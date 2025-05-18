
import { Comissao, ComissaoTotais, ParcelasPendentes, PdfExportOptions } from "@/types/comissao.types";
import { formatarDataParaPDF } from "@/utils/comissao.utils";
import { 
  createCommissionsTableHeader, 
  createCommissionTableRow, 
  createPendingInstallmentsTable, 
  createPendingInstallmentsSummary, 
  createStatusSummary, 
  createSummaryCards 
} from "./components";
import { createTableLayout } from "./table-config";

/**
 * Creates the PDF document definition object
 * @param comissoesParaExportar - Commissions data to export
 * @param dadosComissoes - Commission totals data
 * @param filtros - Export options
 * @param parcelasPendentes - Pending installments data
 * @param colors - Color palette to use
 */
export const createDocumentDefinition = (
  comissoesParaExportar: Comissao[],
  dadosComissoes: ComissaoTotais,
  filtros: PdfExportOptions,
  parcelasPendentes: ParcelasPendentes[],
  colors: any
) => {
  // Extract filter options
  const {
    incluirCliente = true,
    incluirImovel = true,
    incluirValorVenda = true,
    incluirValorComissao = true,
    incluirDataVenda = true,
    incluirDataPagamento = true,
    incluirStatus = true,
    periodo = "todos",
    incluirParcelasPendentes = true,
  } = filtros;
  
  // Informações resumidas para o cabeçalho
  const totalComissoes = comissoesParaExportar.length;
  const comissoesRecebidas = comissoesParaExportar.filter(c => c.status === 'Recebido').length;
  const comissoesPendentes = comissoesParaExportar.filter(c => c.status === 'Pendente').length;
  const comissoesParciais = comissoesParaExportar.filter(c => c.status === 'Parcial').length;

  // Título e data do relatório
  const dataRelatorio = new Date().toLocaleDateString('pt-BR');
  const horaRelatorio = new Date().toLocaleTimeString('pt-BR');

  // Criar o header da tabela
  const columns = createCommissionsTableHeader({
    incluirCliente,
    incluirImovel,
    incluirValorVenda,
    incluirValorComissao,
    incluirDataVenda, 
    incluirDataPagamento,
    incluirStatus
  }, colors);

  // Preparar dados para a tabela
  const tableBody = [columns];
  
  // Adicionar linhas de dados
  comissoesParaExportar.forEach(comissao => {
    const row = createCommissionTableRow(comissao, {
      incluirCliente,
      incluirImovel,
      incluirValorVenda,
      incluirValorComissao,
      incluirDataVenda,
      incluirDataPagamento,
      incluirStatus
    }, colors);
    
    tableBody.push(row);
  });

  // Prepare pending installments content if needed
  let parcelasContent: any[] = [];
  
  if (incluirParcelasPendentes && parcelasPendentes.length > 0) {
    parcelasContent = [
      // Título da seção
      {
        text: 'PARCELAS PENDENTES',
        fontSize: 16,
        bold: true,
        color: colors.primary,
        margin: [0, 20, 0, 10],
        pageBreak: 'before' // Inicia a seção de parcelas em uma nova página
      },
      
      // Resumo de parcelas em cards
      createPendingInstallmentsSummary(parcelasPendentes, colors),
      
      // Tabela de parcelas pendentes
      createPendingInstallmentsTable(parcelasPendentes, colors)
    ];
  }

  // Descrição do período do relatório
  let periodoTexto = "Todos os períodos";
  if (periodo === "mes") periodoTexto = "Mês atual";
  else if (periodo === "trimestre") periodoTexto = "Trimestre atual";
  else if (periodo === "ano") periodoTexto = "Ano atual";
  else if (periodo === "personalizado") {
    if (filtros.dataInicio && filtros.dataFim) {
      const dataInicio = new Date(filtros.dataInicio).toLocaleDateString('pt-BR');
      const dataFim = new Date(filtros.dataFim).toLocaleDateString('pt-BR');
      periodoTexto = `Período personalizado: ${dataInicio} até ${dataFim}`;
    } else {
      periodoTexto = "Período personalizado";
    }
  }

  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        { text: 'Relatório de Comissões', alignment: 'left', margin: [40, 20, 0, 0], fontSize: 14, bold: true, color: colors.primary },
        { text: `Data: ${dataRelatorio}`, alignment: 'right', margin: [0, 20, 40, 0], fontSize: 10, color: colors.textLight }
      ]
    },
    footer: function(currentPage: number, pageCount: number) {
      return {
        columns: [
          { text: 'Sistema de Gestão de Comissões', alignment: 'left', margin: [40, 0, 0, 0], fontSize: 8, color: colors.textLight },
          { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', margin: [0, 0, 40, 0], fontSize: 8, color: colors.textLight }
        ],
        margin: [40, 20]
      };
    },
    content: [
      // Título principal e data de geração
      {
        columns: [
          {
            stack: [
              { text: 'RELATÓRIO DE COMISSÕES', fontSize: 20, bold: true, color: colors.primary, margin: [0, 0, 0, 5] },
              { text: periodoTexto, fontSize: 12, color: colors.textLight, margin: [0, 0, 0, 20] },
            ],
            width: '70%'
          },
          {
            stack: [
              { text: `Gerado em: ${dataRelatorio}`, fontSize: 10, color: colors.textLight },
              { text: `Horário: ${horaRelatorio}`, fontSize: 10, color: colors.textLight },
            ],
            width: '30%',
            alignment: 'right'
          }
        ],
        margin: [0, 0, 0, 20]
      },

      // Resumo dos dados em formato de cards
      createSummaryCards(colors, dadosComissoes, totalComissoes),

      // Status das comissões
      createStatusSummary(colors, totalComissoes, comissoesRecebidas, comissoesPendentes, comissoesParciais),

      // Tabela de comissões com quebra automática de páginas
      {
        stack: [
          {
            text: 'Detalhamento das Comissões',
            fontSize: 14,
            bold: true,
            color: colors.text,
            margin: [0, 0, 0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: columns.map(() => 'auto'), // Ajustar larguras automaticamente
              body: tableBody,
              dontBreakRows: false, // Permitir quebrar linhas entre páginas
            },
            layout: createTableLayout(colors)
          }
        ],
        margin: [0, 0, 0, 20]
      },
      
      // Adiciona as parcelas pendentes se existirem em uma nova página
      ...parcelasContent
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: colors.text
      },
      tableCell: {
        fontSize: 10
      }
    },
    // Configurações de otimização para documentos grandes
    compress: true,
    info: {
      title: 'Relatório de Comissões',
      author: 'Sistema de Gestão de Comissões',
      subject: `Relatório de Comissões - ${periodoTexto}`
    }
  };
};
