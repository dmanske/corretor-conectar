
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Comissao, ComissaoTotais, PdfExportOptions, ParcelasPendentes } from "@/types/comissao.types";
import { formatarDataParaPDF, formatarMoedaParaPDF } from "@/utils/comissao.utils";
import { useToast } from "@/hooks/use-toast";

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Definição de cores para o PDF
const getPdfColors = (tema: string = 'roxo') => {
  const temas = {
    roxo: {
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
    },
    azul: {
      primary: '#3B82F6',      // Azul vibrante
      secondary: '#93C5FD',    // Azul suave
      success: '#10B981',      // Verde sucesso
      warning: '#FBBF24',      // Amarelo alerta
      danger: '#EF4444',       // Vermelho perigo
      text: '#1F2937',         // Texto escuro
      textLight: '#6B7280',    // Texto cinza
      background: '#FFFFFF',   // Fundo branco
      headerBg: '#F0F9FF',     // Fundo do cabeçalho azul claro
      border: '#E5E7EB'        // Bordas
    },
    verde: {
      primary: '#10B981',      // Verde vibrante
      secondary: '#A7F3D0',    // Verde suave
      success: '#059669',      // Verde escuro
      warning: '#FBBF24',      // Amarelo alerta
      danger: '#EF4444',       // Vermelho perigo
      text: '#1F2937',         // Texto escuro
      textLight: '#6B7280',    // Texto cinza
      background: '#FFFFFF',   // Fundo branco
      headerBg: '#ECFDF5',     // Fundo do cabeçalho verde claro
      border: '#E5E7EB'        // Bordas
    }
  };
  
  return temas[tema as keyof typeof temas] || temas.roxo;
};

export const exportarComissoesParaPDF = (
  comissoesParaExportar: Comissao[],
  calcularTotais: (comissoes: Comissao[]) => ComissaoTotais,
  filtros: PdfExportOptions,
  parcelasPendentes: ParcelasPendentes[],
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
    // Define o tema do relatório
    const tema = filtros.tema || 'roxo';
    const colors = getPdfColors(tema);
    
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
      periodo = "todos",
      incluirParcelasPendentes = true,
    } = filtros;

    // Definir colunas da tabela com base nos filtros
    const columns = [];
    if (incluirCliente) columns.push({ text: 'Cliente', style: 'tableHeader', fillColor: colors.headerBg });
    if (incluirImovel) columns.push({ text: 'Imóvel', style: 'tableHeader', fillColor: colors.headerBg });
    if (incluirValorVenda) columns.push({ text: 'Valor da Venda', style: 'tableHeader', fillColor: colors.headerBg, alignment: 'right' });
    if (incluirValorComissao) columns.push({ text: 'Comissão', style: 'tableHeader', fillColor: colors.headerBg, alignment: 'right' });
    if (incluirDataVenda) columns.push({ text: 'Data da Venda', style: 'tableHeader', fillColor: colors.headerBg });
    if (incluirDataPagamento) columns.push({ text: 'Data Pagamento', style: 'tableHeader', fillColor: colors.headerBg });
    if (incluirStatus) columns.push({ text: 'Status', style: 'tableHeader', fillColor: colors.headerBg });

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
        let statusColor = colors.textLight;
        if (comissao.status === 'Recebido') statusColor = colors.success;
        else if (comissao.status === 'Pendente') statusColor = colors.warning;
        else if (comissao.status === 'Parcial') statusColor = colors.secondary;
        
        row.push({ 
          text: comissao.status, 
          style: 'tableCell', 
          color: statusColor,
          bold: comissao.status === 'Recebido'
        });
      }

      tableBody.push(row);
    });

    // Preparar tabela de parcelas pendentes
    let parcelasContent = [];
    
    if (incluirParcelasPendentes && parcelasPendentes.length > 0) {
      // Cabeçalho
      const parcelsHeaderRow = [
        { text: 'Cliente', style: 'tableHeader', fillColor: colors.headerBg },
        { text: 'Imóvel', style: 'tableHeader', fillColor: colors.headerBg },
        { text: 'Valor Total', style: 'tableHeader', fillColor: colors.headerBg, alignment: 'right' },
        { text: 'Valor Pago', style: 'tableHeader', fillColor: colors.headerBg, alignment: 'right' },
        { text: 'Valor Pendente', style: 'tableHeader', fillColor: colors.headerBg, alignment: 'right' },
        { text: 'Vencimento', style: 'tableHeader', fillColor: colors.headerBg },
        { text: 'Atraso (dias)', style: 'tableHeader', fillColor: colors.headerBg, alignment: 'right' }
      ];
      
      const parcelsTableBody = [parcelsHeaderRow];
      
      // Ordenar por dias em atraso (decrescente)
      const parcelasSorted = [...parcelasPendentes].sort((a, b) => b.diasEmAtraso - a.diasEmAtraso);
      
      // Adicionar linhas
      parcelasSorted.forEach(parcela => {
        const atrasoColor = parcela.diasEmAtraso > 0 ? colors.danger : colors.text;
        
        parcelsTableBody.push([
          { text: parcela.cliente, style: 'tableCell' },
          { text: parcela.imovel, style: 'tableCell' },
          { text: formatarMoedaParaPDF(parcela.valorTotal), style: 'tableCell', alignment: 'right' },
          { text: formatarMoedaParaPDF(parcela.valorPago), style: 'tableCell', alignment: 'right' },
          { text: formatarMoedaParaPDF(parcela.valorPendente), style: 'tableCell', alignment: 'right', color: colors.primary, bold: true },
          { text: formatarDataParaPDF(parcela.proximoVencimento), style: 'tableCell' },
          { text: parcela.diasEmAtraso.toString(), style: 'tableCell', alignment: 'right', color: atrasoColor, bold: parcela.diasEmAtraso > 0 }
        ]);
      });
      
      // Resumo de parcelas pendentes
      const totalPendente = parcelasPendentes.reduce((total, p) => total + p.valorPendente, 0);
      const totalEmAtraso = parcelasPendentes.filter(p => p.diasEmAtraso > 0).reduce((total, p) => total + p.valorPendente, 0);
      const contEmAtraso = parcelasPendentes.filter(p => p.diasEmAtraso > 0).length;
      
      parcelasContent = [
        // Título da seção
        {
          text: 'PARCELAS PENDENTES',
          fontSize: 16,
          bold: true,
          color: colors.primary,
          margin: [0, 20, 0, 10]
        },
        
        // Resumo de parcelas em cards
        {
          columns: [
            {
              stack: [
                { 
                  text: 'Total de Parcelas', 
                  fontSize: 11,
                  bold: true,
                  color: colors.text 
                },
                { 
                  text: parcelasPendentes.length.toString(), 
                  fontSize: 18, 
                  bold: true,
                  color: colors.primary,
                  margin: [0, 5, 0, 0] 
                }
              ],
              width: '33%',
              margin: [0, 0, 10, 0],
              padding: [10, 10, 10, 10],
              background: colors.headerBg
            },
            {
              stack: [
                { 
                  text: 'Valor Pendente Total', 
                  fontSize: 11,
                  bold: true,
                  color: colors.text 
                },
                { 
                  text: formatarMoedaParaPDF(totalPendente), 
                  fontSize: 18, 
                  bold: true,
                  color: colors.primary,
                  margin: [0, 5, 0, 0] 
                }
              ],
              width: '33%',
              margin: [0, 0, 10, 0],
              padding: [10, 10, 10, 10],
              background: colors.headerBg
            },
            {
              stack: [
                { 
                  text: `Em Atraso (${contEmAtraso})`, 
                  fontSize: 11,
                  bold: true,
                  color: colors.text 
                },
                { 
                  text: formatarMoedaParaPDF(totalEmAtraso), 
                  fontSize: 18, 
                  bold: true,
                  color: colors.danger,
                  margin: [0, 5, 0, 0] 
                }
              ],
              width: '34%',
              padding: [10, 10, 10, 10],
              background: '#FEF2F2'
            }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Tabela de parcelas pendentes
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: parcelsTableBody
          },
          layout: {
            hLineWidth: function(i: number, node: any) {
              return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
            },
            vLineWidth: function(i: number, node: any) {
              return 0;
            },
            hLineColor: function(i: number, node: any) {
              return colors.border;
            },
            vLineColor: function(i: number, node: any) {
              return colors.border;
            },
            paddingLeft: function(i: number, node: any) { return 8; },
            paddingRight: function(i: number, node: any) { return 8; },
            paddingTop: function(i: number, node: any) { return 6; },
            paddingBottom: function(i: number, node: any) { return 6; },
            fillColor: function(rowIndex: number, node: any, columnIndex: any) {
              return rowIndex % 2 === 0 ? '#FFFFFF' : colors.headerBg;
            }
          },
          margin: [0, 0, 0, 20]
        }
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

    // Criar estrutura do documento PDF
    const docDefinition = {
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
        {
          columns: [
            {
              stack: [
                { 
                  text: 'Total de Comissões', 
                  fontSize: 12,
                  bold: true,
                  color: colors.text 
                },
                { 
                  text: totalComissoes.toString(), 
                  fontSize: 20, 
                  bold: true,
                  color: colors.primary,
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
                  color: colors.text 
                },
                { 
                  text: formatarMoedaParaPDF(dadosComissoes.totalComissoes), 
                  fontSize: 20, 
                  bold: true,
                  color: colors.primary,
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
                  color: colors.text 
                },
                { 
                  text: formatarMoedaParaPDF(dadosComissoes.recebido), 
                  fontSize: 20, 
                  bold: true,
                  color: colors.success,
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
                  color: colors.text 
                },
                { 
                  text: formatarMoedaParaPDF(dadosComissoes.pendente), 
                  fontSize: 20, 
                  bold: true,
                  color: colors.warning,
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
              color: colors.text,
              margin: [0, 0, 0, 10]
            },
            {
              columns: [
                {
                  width: '33%',
                  stack: [
                    { text: 'Recebidas', fontSize: 12, color: colors.textLight },
                    { text: `${comissoesRecebidas} (${Math.round(comissoesRecebidas/totalComissoes*100) || 0}%)`, fontSize: 16, bold: true, color: colors.success }
                  ],
                  margin: [0, 0, 10, 0]
                },
                {
                  width: '33%',
                  stack: [
                    { text: 'Pendentes', fontSize: 12, color: colors.textLight },
                    { text: `${comissoesPendentes} (${Math.round(comissoesPendentes/totalComissoes*100) || 0}%)`, fontSize: 16, bold: true, color: colors.warning }
                  ],
                  margin: [0, 0, 10, 0]
                },
                {
                  width: '33%',
                  stack: [
                    { text: 'Parciais', fontSize: 12, color: colors.textLight },
                    { text: `${comissoesParciais} (${Math.round(comissoesParciais/totalComissoes*100) || 0}%)`, fontSize: 16, bold: true, color: colors.secondary }
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
              color: colors.text,
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
                  return colors.border;
                },
                vLineColor: function(i: number, node: any) {
                  return colors.border;
                },
                paddingLeft: function(i: number, node: any) { return 8; },
                paddingRight: function(i: number, node: any) { return 8; },
                paddingTop: function(i: number, node: any) { return 6; },
                paddingBottom: function(i: number, node: any) { return 6; },
                fillColor: function(rowIndex: number, node: any, columnIndex: any) {
                  return rowIndex % 2 === 0 ? '#FFFFFF' : colors.headerBg;
                }
              }
            }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Adiciona as parcelas pendentes se existirem
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
