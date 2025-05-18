
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Comissao } from "../types/comissao.types";
import { formatarDataParaPDF, formatarMoedaParaPDF } from "../utils/comissao.utils";
import { useToast } from "@/hooks/use-toast";

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Definição de cores para o PDF
const pdfColors = {
  primary: '#8B5CF6',      // Roxo vibrante
  secondary: '#C4B5FD',    // Roxo suave
  success: '#10B981',      // Verde sucesso
  warning: '#FBBF24',      // Amarelo alerta
  danger: '#EF4444',       // Vermelho perigo
  text: '#1F2937',         // Texto escuro
  textLight: '#6B7280',    // Texto cinza
  background: '#FFFFFF',   // Fundo branco
  headerBg: '#F9FAFB',     // Fundo do cabeçalho
  border: '#E5E7EB'        // Bordas
};

interface PdfExportOptions {
  incluirCliente?: boolean;
  incluirImovel?: boolean;
  incluirValorVenda?: boolean;
  incluirValorComissao?: boolean;
  incluirDataVenda?: boolean;
  incluirDataPagamento?: boolean;
  incluirStatus?: boolean;
  periodo?: string;
  dataInicio?: string;
  dataFim?: string;
}

interface ComissaoTotaisResumo {
  totalComissoes: number;
  recebido: number;
  pendente: number;
  parcial: number;
}

export const exportarComissoesParaPDF = (
  comissoesParaExportar: Comissao[],
  calcularTotais: (comissoes: Comissao[]) => ComissaoTotaisResumo,
  filtros: PdfExportOptions,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  // Verifique se há dados para exportar
  if (comissoesParaExportar.length === 0) {
    toast({
      variant: "destructive",
      title: "Sem dados",
      description: "Não há comissões para exportar."
    });
    return;
  }

  try {
    // Informações resumidas para o cabeçalho
    const dadosComissoes = calcularTotais(comissoesParaExportar);
    const totalComissoes = comissoesParaExportar.length;
    const comissoesRecebidas = comissoesParaExportar.filter(c => c.status === 'Recebido').length;
    const comissoesPendentes = comissoesParaExportar.filter(c => c.status === 'Pendente').length;
    const comissoesParciais = comissoesParaExportar.filter(c => c.status === 'Parcial').length;

    // Título e data do relatório
    const dataRelatorio = new Date().toLocaleDateString('pt-BR');
    const horaRelatorio = new Date().toLocaleTimeString('pt-BR');

    // Preparar colunas conforme filtros
    const {
      incluirCliente = true,
      incluirImovel = true,
      incluirValorVenda = true,
      incluirValorComissao = true,
      incluirDataVenda = true,
      incluirDataPagamento = true,
      incluirStatus = true,
      periodo = "todos"
    } = filtros;

    // Definir colunas da tabela com base nos filtros
    const columns = [];
    if (incluirCliente) columns.push({ text: 'Cliente', style: 'tableHeader', fillColor: pdfColors.headerBg });
    if (incluirImovel) columns.push({ text: 'Imóvel', style: 'tableHeader', fillColor: pdfColors.headerBg });
    if (incluirValorVenda) columns.push({ text: 'Valor da Venda', style: 'tableHeader', fillColor: pdfColors.headerBg, alignment: 'right' });
    if (incluirValorComissao) columns.push({ text: 'Comissão', style: 'tableHeader', fillColor: pdfColors.headerBg, alignment: 'right' });
    if (incluirDataVenda) columns.push({ text: 'Data da Venda', style: 'tableHeader', fillColor: pdfColors.headerBg });
    if (incluirDataPagamento) columns.push({ text: 'Data Pagamento', style: 'tableHeader', fillColor: pdfColors.headerBg });
    if (incluirStatus) columns.push({ text: 'Status', style: 'tableHeader', fillColor: pdfColors.headerBg });

    // Preparar dados para a tabela
    const tableBody = [columns];

    // Adicionar linhas de dados
    comissoesParaExportar.forEach(comissao => {
      const row = [];

      if (incluirCliente) row.push({ text: comissao.cliente || 'N/A', style: 'tableCell' });
      if (incluirImovel) row.push({ text: comissao.imovel || 'N/A', style: 'tableCell' });
      if (incluirValorVenda) row.push({ text: formatarMoedaParaPDF(comissao.valorVenda), style: 'tableCell', alignment: 'right' });
      if (incluirValorComissao) row.push({ text: formatarMoedaParaPDF(comissao.valorComissaoCorretor), style: 'tableCell', alignment: 'right' });
      if (incluirDataVenda) row.push({ text: formatarDataParaPDF(comissao.dataVenda), style: 'tableCell' });
      if (incluirDataPagamento) row.push({ text: formatarDataParaPDF(comissao.dataPagamento), style: 'tableCell' });
      
      if (incluirStatus) {
        let statusColor = pdfColors.textLight;
        if (comissao.status === 'Recebido') statusColor = pdfColors.success;
        else if (comissao.status === 'Pendente') statusColor = pdfColors.warning;
        else if (comissao.status === 'Parcial') statusColor = pdfColors.secondary;
        
        row.push({ 
          text: comissao.status, 
          style: 'tableCell', 
          color: statusColor,
          bold: comissao.status === 'Recebido'
        });
      }

      tableBody.push(row);
    });

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

    // Criar estrutura do documento PDF
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: {
        columns: [
          { text: 'Relatório de Comissões', alignment: 'left', margin: [40, 20, 0, 0], fontSize: 14, bold: true, color: pdfColors.primary },
          { text: `Data: ${dataRelatorio}`, alignment: 'right', margin: [0, 20, 40, 0], fontSize: 10, color: pdfColors.textLight }
        ]
      },
      footer: function(currentPage: number, pageCount: number) {
        return {
          columns: [
            { text: 'Sistema de Gestão de Comissões', alignment: 'left', margin: [40, 0, 0, 0], fontSize: 8, color: pdfColors.textLight },
            { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', margin: [0, 0, 40, 0], fontSize: 8, color: pdfColors.textLight }
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
                { text: 'RELATÓRIO DE COMISSÕES', fontSize: 20, bold: true, color: pdfColors.primary, margin: [0, 0, 0, 5] },
                { text: periodoTexto, fontSize: 12, color: pdfColors.textLight, margin: [0, 0, 0, 20] },
              ],
              width: '70%'
            },
            {
              stack: [
                { text: `Gerado em: ${dataRelatorio}`, fontSize: 10, color: pdfColors.textLight },
                { text: `Horário: ${horaRelatorio}`, fontSize: 10, color: pdfColors.textLight },
              ],
              width: '30%',
              alignment: 'right'
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // Resumo dos dados em formato de cards
        {
          columns: [
            {
              stack: [
                { 
                  text: 'Total de Comissões', 
                  fontSize: 12,
                  bold: true,
                  color: pdfColors.text 
                },
                { 
                  text: totalComissoes.toString(), 
                  fontSize: 20, 
                  bold: true,
                  color: pdfColors.primary,
                  margin: [0, 5, 0, 0] 
                }
              ],
              width: '25%',
              margin: [0, 0, 10, 0],
              padding: [10, 10, 10, 10],
              background: '#F9FAFC'
            },
            {
              stack: [
                { 
                  text: 'Valor Total', 
                  fontSize: 12,
                  bold: true,
                  color: pdfColors.text 
                },
                { 
                  text: formatarMoedaParaPDF(dadosComissoes.totalComissoes), 
                  fontSize: 20, 
                  bold: true,
                  color: pdfColors.primary,
                  margin: [0, 5, 0, 0] 
                }
              ],
              width: '25%',
              margin: [0, 0, 10, 0],
              padding: [10, 10, 10, 10],
              background: '#F9FAFC'
            },
            {
              stack: [
                { 
                  text: 'Recebido', 
                  fontSize: 12,
                  bold: true,
                  color: pdfColors.text 
                },
                { 
                  text: formatarMoedaParaPDF(dadosComissoes.recebido), 
                  fontSize: 20, 
                  bold: true,
                  color: pdfColors.success,
                  margin: [0, 5, 0, 0] 
                }
              ],
              width: '25%',
              margin: [0, 0, 10, 0],
              padding: [10, 10, 10, 10],
              background: '#F0FDF4'
            },
            {
              stack: [
                { 
                  text: 'Pendente', 
                  fontSize: 12,
                  bold: true,
                  color: pdfColors.text 
                },
                { 
                  text: formatarMoedaParaPDF(dadosComissoes.pendente), 
                  fontSize: 20, 
                  bold: true,
                  color: pdfColors.warning,
                  margin: [0, 5, 0, 0] 
                }
              ],
              width: '25%',
              margin: [0, 0, 0, 0],
              padding: [10, 10, 10, 10],
              background: '#FFFBEB'
            }
          ],
          margin: [0, 0, 0, 30]
        },

        // Status das comissões (um gráfico simplificado em formato de texto)
        {
          stack: [
            {
              text: 'Status das Comissões',
              fontSize: 14,
              bold: true,
              color: pdfColors.text,
              margin: [0, 0, 0, 10]
            },
            {
              columns: [
                {
                  width: '33%',
                  stack: [
                    { text: 'Recebidas', fontSize: 12, color: pdfColors.textLight },
                    { text: `${comissoesRecebidas} (${Math.round(comissoesRecebidas/totalComissoes*100) || 0}%)`, fontSize: 16, bold: true, color: pdfColors.success }
                  ],
                  margin: [0, 0, 10, 0]
                },
                {
                  width: '33%',
                  stack: [
                    { text: 'Pendentes', fontSize: 12, color: pdfColors.textLight },
                    { text: `${comissoesPendentes} (${Math.round(comissoesPendentes/totalComissoes*100) || 0}%)`, fontSize: 16, bold: true, color: pdfColors.warning }
                  ],
                  margin: [0, 0, 10, 0]
                },
                {
                  width: '33%',
                  stack: [
                    { text: 'Parciais', fontSize: 12, color: pdfColors.textLight },
                    { text: `${comissoesParciais} (${Math.round(comissoesParciais/totalComissoes*100) || 0}%)`, fontSize: 16, bold: true, color: pdfColors.secondary }
                  ],
                  margin: [0, 0, 0, 0]
                }
              ],
            }
          ],
          margin: [0, 0, 0, 30]
        },

        // Tabela de comissões
        {
          stack: [
            {
              text: 'Detalhamento das Comissões',
              fontSize: 14,
              bold: true,
              color: pdfColors.text,
              margin: [0, 0, 0, 10]
            },
            {
              table: {
                headerRows: 1,
                widths: Array(columns.length).fill('auto'),
                body: tableBody
              },
              layout: {
                hLineWidth: function(i: number, node: any) {
                  return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
                },
                vLineWidth: function(i: number, node: any) {
                  return 0;
                },
                hLineColor: function(i: number, node: any) {
                  return pdfColors.border;
                },
                vLineColor: function(i: number, node: any) {
                  return pdfColors.border;
                },
                paddingLeft: function(i: number, node: any) { return 8; },
                paddingRight: function(i: number, node: any) { return 8; },
                paddingTop: function(i: number, node: any) { return 6; },
                paddingBottom: function(i: number, node: any) { return 6; },
                fillColor: function(rowIndex: number, node: any, columnIndex: any) {
                  return rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                }
              }
            }
          ],
          margin: [0, 0, 0, 20]
        }
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: pdfColors.text
        },
        tableCell: {
          fontSize: 10
        }
      }
    };

    // Gera e faz o download do PDF
    toast({
      title: "Exportação de PDF",
      description: "Preparando o arquivo de relatório...",
    });

    pdfMake.createPdf(docDefinition).download('relatorio-comissoes.pdf');
    
  } catch (error) {
    console.error("Erro ao exportar para PDF:", error);
    toast({
      variant: "destructive",
      title: "Erro na exportação",
      description: "Não foi possível gerar o relatório em PDF."
    });
  }
};
