
import { Comissao, ComissaoTotais, ParcelasPendentes } from "@/types/comissao.types";
import { formatarDataParaPDF, formatarMoedaParaPDF } from "@/utils/comissao.utils";
import { createTableLayout } from "./table-config";

/**
 * Creates the summary cards section for PDF report
 * @param colors - Color palette to use
 * @param dadosComissoes - Commission totals data
 * @param totalComissoes - Total number of commissions
 */
export const createSummaryCards = (colors: any, dadosComissoes: ComissaoTotais, totalComissoes: number) => {
  return {
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
  };
};

/**
 * Creates the status summary section for PDF report
 * @param colors - Color palette to use
 * @param totalComissoes - Total number of commissions
 * @param comissoesRecebidas - Number of received commissions
 * @param comissoesPendentes - Number of pending commissions
 * @param comissoesParciais - Number of partial commissions
 */
export const createStatusSummary = (
  colors: any,
  totalComissoes: number,
  comissoesRecebidas: number,
  comissoesPendentes: number,
  comissoesParciais: number
) => {
  return {
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
  };
};

/**
 * Creates the header for the commissions table
 * @param incluirCliente - Whether to include client column
 * @param incluirImovel - Whether to include property column
 * @param incluirValorVenda - Whether to include sale value column
 * @param incluirValorComissao - Whether to include commission value column
 * @param incluirDataVenda - Whether to include sale date column
 * @param incluirDataPagamento - Whether to include payment date column
 * @param incluirStatus - Whether to include status column
 * @param colors - Color palette to use
 */
export const createCommissionsTableHeader = (
  {
    incluirCliente = true,
    incluirImovel = true,
    incluirValorVenda = true,
    incluirValorComissao = true,
    incluirDataVenda = true,
    incluirDataPagamento = true,
    incluirStatus = true
  }: {
    incluirCliente?: boolean,
    incluirImovel?: boolean,
    incluirValorVenda?: boolean,
    incluirValorComissao?: boolean,
    incluirDataVenda?: boolean,
    incluirDataPagamento?: boolean,
    incluirStatus?: boolean
  },
  colors: any
) => {
  const columns = [];
  
  if (incluirCliente) columns.push({ text: 'Cliente', style: 'tableHeader', fillColor: colors.headerBg });
  if (incluirImovel) columns.push({ text: 'Imóvel', style: 'tableHeader', fillColor: colors.headerBg });
  if (incluirValorVenda) columns.push({ text: 'Valor da Venda', style: 'tableHeader', fillColor: colors.headerBg, alignment: 'right' });
  if (incluirValorComissao) columns.push({ text: 'Comissão', style: 'tableHeader', fillColor: colors.headerBg, alignment: 'right' });
  if (incluirDataVenda) columns.push({ text: 'Data da Venda', style: 'tableHeader', fillColor: colors.headerBg });
  if (incluirDataPagamento) columns.push({ text: 'Data Pagamento', style: 'tableHeader', fillColor: colors.headerBg });
  if (incluirStatus) columns.push({ text: 'Status', style: 'tableHeader', fillColor: colors.headerBg });
  
  return columns;
};

/**
 * Creates a row for the commissions table
 * @param comissao - Commission data
 * @param options - Table column options
 * @param colors - Color palette to use
 */
export const createCommissionTableRow = (
  comissao: Comissao, 
  options: {
    incluirCliente?: boolean,
    incluirImovel?: boolean,
    incluirValorVenda?: boolean,
    incluirValorComissao?: boolean,
    incluirDataVenda?: boolean,
    incluirDataPagamento?: boolean,
    incluirStatus?: boolean
  },
  colors: any
) => {
  const {
    incluirCliente = true,
    incluirImovel = true,
    incluirValorVenda = true,
    incluirValorComissao = true,
    incluirDataVenda = true,
    incluirDataPagamento = true,
    incluirStatus = true
  } = options;
  
  const row = [];

  if (incluirCliente) row.push({ text: comissao.cliente || 'N/A', style: 'tableCell', fillColor: colors.headerBg });
  if (incluirImovel) row.push({ text: comissao.imovel || 'N/A', style: 'tableCell', fillColor: colors.headerBg });
  if (incluirValorVenda) row.push({ text: formatarMoedaParaPDF(comissao.valorVenda), style: 'tableCell', alignment: 'right', fillColor: colors.headerBg });
  if (incluirValorComissao) row.push({ text: formatarMoedaParaPDF(comissao.valorComissaoCorretor), style: 'tableCell', alignment: 'right', fillColor: colors.headerBg });
  if (incluirDataVenda) row.push({ text: formatarDataParaPDF(comissao.dataVenda), style: 'tableCell', fillColor: colors.headerBg });
  if (incluirDataPagamento) row.push({ text: formatarDataParaPDF(comissao.dataPagamento), style: 'tableCell', fillColor: colors.headerBg });
  
  if (incluirStatus) {
    row.push({ 
      text: comissao.status, 
      style: 'tableCell',
      fillColor: colors.headerBg,
      alignment: 'left'
    });
  }

  return row;
};

/**
 * Creates a table of pending installments for the PDF report
 * @param parcelasPendentes - Pending installments data
 * @param colors - Color palette to use
 */
export const createPendingInstallmentsTable = (parcelasPendentes: ParcelasPendentes[], colors: any) => {
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
    parcelsTableBody.push([
      { text: parcela.cliente, style: 'tableCell', fillColor: colors.headerBg },
      { text: parcela.imovel, style: 'tableCell', fillColor: colors.headerBg },
      { text: formatarMoedaParaPDF(parcela.valorTotal), style: 'tableCell', alignment: 'right', fillColor: colors.headerBg },
      { text: formatarMoedaParaPDF(parcela.valorPago), style: 'tableCell', alignment: 'right', fillColor: colors.headerBg },
      { text: formatarMoedaParaPDF(parcela.valorPendente), style: 'tableCell', alignment: 'right', fillColor: colors.headerBg },
      { text: formatarDataParaPDF(parcela.proximoVencimento), style: 'tableCell', fillColor: colors.headerBg },
      { text: parcela.diasEmAtraso.toString(), style: 'tableCell', alignment: 'right', fillColor: colors.headerBg }
    ]);
  });

  return {
    table: {
      headerRows: 1,
      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
      body: parcelsTableBody
    },
    layout: createTableLayout(colors),
    margin: [0, 0, 0, 20]
  };
};

/**
 * Creates the summary cards for pending installments
 * @param parcelasPendentes - Pending installments data
 * @param colors - Color palette to use
 */
export const createPendingInstallmentsSummary = (parcelasPendentes: ParcelasPendentes[], colors: any) => {
  // Resumo de parcelas pendentes
  const totalPendente = parcelasPendentes.reduce((total, p) => total + p.valorPendente, 0);
  const totalEmAtraso = parcelasPendentes.filter(p => p.diasEmAtraso > 0).reduce((total, p) => total + p.valorPendente, 0);
  const contEmAtraso = parcelasPendentes.filter(p => p.diasEmAtraso > 0).length;
  
  return {
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
  };
};
