import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

export type ComissaoStatus = "Pendente" | "Parcial" | "Recebido";
export type StatusValor = "Atualizado" | "Desatualizado" | "Justificado";

export interface Comissao {
  id: string;
  vendaId: string;
  cliente: string;
  imovel: string;
  valorVenda: number;
  valorComissaoImobiliaria: number;
  valorComissaoCorretor: number;
  dataContrato: string;
  dataVenda: string;
  dataPagamento: string | null;
  status: ComissaoStatus;
  // Campos adicionais para conformidade com o banco de dados
  valorOriginalVenda?: number;
  valorAtualVenda?: number;
  diferencaValor?: number;
  statusValor?: StatusValor;
  justificativa?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useComissoes = () => {
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metaComissao, setMetaComissao] = useState<number>(0);
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1);
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchComissoes = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("comissoes")
          .select("*")
          .order('data_contrato', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setComissoes(
            data.map((comissao) => ({
              id: comissao.id,
              vendaId: comissao.venda_id,
              cliente: comissao.cliente,
              imovel: comissao.imovel,
              valorVenda: comissao.valor_venda,
              valorComissaoImobiliaria: comissao.valor_comissao_imobiliaria,
              valorComissaoCorretor: comissao.valor_comissao_corretor,
              dataContrato: comissao.data_contrato,
              dataVenda: comissao.data_venda,
              dataPagamento: comissao.data_pagamento,
              status: comissao.status as ComissaoStatus,
              valorOriginalVenda: comissao.valor_original_venda,
              valorAtualVenda: comissao.valor_atual_venda,
              diferencaValor: comissao.diferenca_valor,
              statusValor: comissao.status_valor as StatusValor,
              justificativa: comissao.justificativa,
              createdAt: comissao.created_at,
              updatedAt: comissao.updated_at,
            }))
          );
        }
      } catch (error) {
        console.error("Erro ao buscar comissões:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar comissões",
          description: "Não foi possível carregar as comissões.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComissoes();
  }, [user, toast]);

  useEffect(() => {
    if (!user) return;
    const fetchMeta = async () => {
      const { data, error } = await supabase
        .from('metas')
        .select('valor')
        .eq('mes', mesAtual)
        .eq('ano', anoAtual)
        .eq('user_id', user.id)
        .single();
      if (!error && data && typeof data.valor === 'number') {
        setMetaComissao(data.valor);
      } else {
        setMetaComissao(0);
      }
    };
    fetchMeta();
  }, [mesAtual, anoAtual, user]);

  const adicionarComissao = async (comissao: Omit<Comissao, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("comissoes")
        .insert({
          venda_id: comissao.vendaId,
          cliente: comissao.cliente,
          imovel: comissao.imovel,
          valor_venda: comissao.valorVenda,
          valor_comissao_imobiliaria: comissao.valorComissaoImobiliaria,
          valor_comissao_corretor: comissao.valorComissaoCorretor,
          data_contrato: comissao.dataContrato,
          data_venda: comissao.dataVenda,
          data_pagamento: comissao.dataPagamento,
          status: comissao.status,
          status_valor: comissao.statusValor || "Atualizado",
          user_id: user.id,
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const novaComissao: Comissao = {
          id: data[0].id,
          vendaId: data[0].venda_id,
          cliente: data[0].cliente,
          imovel: data[0].imovel,
          valorVenda: data[0].valor_venda,
          valorComissaoImobiliaria: data[0].valor_comissao_imobiliaria,
          valorComissaoCorretor: data[0].valor_comissao_corretor,
          dataContrato: data[0].data_contrato,
          dataVenda: data[0].data_venda,
          dataPagamento: data[0].data_pagamento,
          status: data[0].status as ComissaoStatus,
          valorOriginalVenda: data[0].valor_original_venda,
          valorAtualVenda: data[0].valor_atual_venda,
          diferencaValor: data[0].diferenca_valor,
          statusValor: data[0].status_valor as StatusValor,
          justificativa: data[0].justificativa,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at,
        };

        setComissoes([novaComissao, ...comissoes]);
        return novaComissao;
      }
      return null;
    } catch (error) {
      console.error("Erro ao adicionar comissão:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar comissão",
        description: "Não foi possível adicionar a comissão.",
      });
      return null;
    }
  };

  const atualizarComissao = async (id: string, comissaoAtualizada: Partial<Comissao>) => {
    if (!user) return false;

    try {
      const atualizacoes: any = {};
      if (comissaoAtualizada.cliente !== undefined) atualizacoes.cliente = comissaoAtualizada.cliente;
      if (comissaoAtualizada.imovel !== undefined) atualizacoes.imovel = comissaoAtualizada.imovel;
      if (comissaoAtualizada.valorVenda !== undefined) atualizacoes.valor_venda = comissaoAtualizada.valorVenda;
      if (comissaoAtualizada.valorComissaoImobiliaria !== undefined) atualizacoes.valor_comissao_imobiliaria = comissaoAtualizada.valorComissaoImobiliaria;
      if (comissaoAtualizada.valorComissaoCorretor !== undefined) atualizacoes.valor_comissao_corretor = comissaoAtualizada.valorComissaoCorretor;
      if (comissaoAtualizada.dataContrato !== undefined) atualizacoes.data_contrato = comissaoAtualizada.dataContrato;
      if (comissaoAtualizada.dataVenda !== undefined) atualizacoes.data_venda = comissaoAtualizada.dataVenda;
      if (comissaoAtualizada.dataPagamento !== undefined) atualizacoes.data_pagamento = comissaoAtualizada.dataPagamento;
      if (comissaoAtualizada.status !== undefined) atualizacoes.status = comissaoAtualizada.status;
      if (comissaoAtualizada.statusValor !== undefined) atualizacoes.status_valor = comissaoAtualizada.statusValor;
      if (comissaoAtualizada.justificativa !== undefined) atualizacoes.justificativa = comissaoAtualizada.justificativa;

      const { error } = await supabase
        .from("comissoes")
        .update(atualizacoes)
        .eq("id", id);

      if (error) {
        throw error;
      }

      setComissoes(
        comissoes.map((comissao) =>
          comissao.id === id ? { ...comissao, ...comissaoAtualizada, updatedAt: new Date().toISOString() } : comissao
        )
      );
      toast({
        title: "Comissão atualizada",
        description: "Os dados da comissão foram atualizados.",
        variant: "success",
      });
      return true;
    } catch (error) {
      console.error("Erro ao atualizar comissão:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar comissão",
        description: "Não foi possível atualizar a comissão.",
      });
      return false;
    }
  };

  const excluirComissao = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("comissoes")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setComissoes(comissoes.filter((comissao) => comissao.id !== id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir comissão:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir comissão",
        description: "Não foi possível excluir a comissão.",
      });
      return false;
    }
  };

  const getComissaoById = (id: string) => {
    return comissoes.find((comissao) => comissao.id === id) || null;
  };

  const getComissoesByVendaId = (vendaId: string) => {
    return comissoes.filter((comissao) => comissao.vendaId === vendaId);
  };

  const getComissoesByStatus = (status: ComissaoStatus) => {
    return comissoes.filter((comissao) => comissao.status === status);
  };

  // Função para formatar valores monetários para exibição no PDF
  const formatarMoedaParaPDF = (valor: number) => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      minimumFractionDigits: 2 
    });
  };

  // Função para formatar datas para exibição no PDF
  const formatarDataParaPDF = (dataString: string | null | undefined) => {
    if (!dataString) return "N/A";
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  // Funções de exportação
  const exportarParaCSV = (comissoesParaExportar: Comissao[], filtros: any) => {
    const {
      incluirCliente,
      incluirImovel,
      incluirValorVenda,
      incluirValorComissao,
      incluirDataVenda,
      incluirDataPagamento,
      incluirStatus,
    } = filtros;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Função para escapar campos CSV
    function escapeCSV(value: any) {
      if (value === null || value === undefined) return '';
      let str = String(value);
      if (str.includes('"')) str = str.replace(/"/g, '""');
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        str = '"' + str + '"';
      }
      return str;
    }

    // Cabeçalho
    const header = [
      incluirCliente ? "Cliente" : null,
      incluirImovel ? "Imóvel" : null,
      incluirValorVenda ? "Valor da Venda" : null,
      incluirValorComissao ? "Valor da Comissão" : null,
      incluirDataVenda ? "Data da Venda" : null,
      incluirDataPagamento ? "Data de Pagamento" : null,
      incluirStatus ? "Status" : null,
    ].filter(v => v !== null && v !== undefined).join(",");
    
    csvContent += header + "\r\n";

    // Conteúdo das linhas
    comissoesParaExportar.forEach(comissao => {
      const row = [
        incluirCliente ? escapeCSV(comissao.cliente) : null,
        incluirImovel ? escapeCSV(comissao.imovel) : null,
        incluirValorVenda ? escapeCSV(comissao.valorVenda) : null,
        incluirValorComissao ? escapeCSV(comissao.valorComissaoCorretor) : null,
        incluirDataVenda ? escapeCSV(comissao.dataVenda) : null,
        incluirDataPagamento ? escapeCSV(comissao.dataPagamento) : null,
        incluirStatus ? escapeCSV(comissao.status) : null,
      ].filter(v => v !== null && v !== undefined).join(",");
      
      csvContent += row + "\r\n";
    });

    // Toast bonito do sistema
    toast({
      title: "Exportação iniciada",
      description: "O download do arquivo CSV está sendo gerado.",
      variant: "success"
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "comissoes.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  // Implementação da exportação para PDF
  const exportarParaPDF = (comissoesParaExportar: Comissao[], filtros: any) => {
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
      // Definição de cores e estilos
      const colors = {
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

      // Título e data do relatório
      const dataRelatorio = new Date().toLocaleDateString('pt-BR');
      const horaRelatorio = new Date().toLocaleTimeString('pt-BR');
      
      // Informações resumidas para o cabeçalho
      const dadosComissoes = calcularTotais(comissoesParaExportar);
      const totalComissoes = comissoesParaExportar.length;
      const comissoesRecebidas = comissoesParaExportar.filter(c => c.status === 'Recebido').length;
      const comissoesPendentes = comissoesParaExportar.filter(c => c.status === 'Pendente').length;
      const comissoesParciais = comissoesParaExportar.filter(c => c.status === 'Parcial').length;

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

  const getMetaMensal = async (mes: number, ano: number): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('metas')
        .select('valor')
        .eq('mes', mes)
        .eq('ano', ano)
        .single();

      if (error) {
        console.error("Erro ao buscar meta mensal:", error);
        return 0;
      }

      return data ? data.valor : 0;
    } catch (error) {
      console.error("Erro ao buscar meta mensal:", error);
      return 0;
    }
  };

  const adicionarMetaMensal = async (mes: number, ano: number, valor: number) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('metas')
        .upsert({
          mes: mes,
          ano: ano,
          valor: valor,
          user_id: user.id
        }, { onConflict: 'mes,ano,user_id' });  // Fixed string format

      if (error) {
        throw error;
      }
      toast({
        title: "Meta atualizada",
        description: `A meta de comissão para ${mes}/${ano} foi atualizada com sucesso.`,
        variant: "success"
      });
      return true;
    } catch (error) {
      console.error("Erro ao adicionar meta mensal:", error);
      toast({
        variant: "destructive",
        title: "Erro ao definir meta",
        description: "Não foi possível definir a meta mensal.",
      });
      return false;
    }
  };

  const obterNomeMes = (mes: number): string => {
    const nomesDosMeses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return nomesDosMeses[mes - 1] || "";
  };

  const getRecebimentosByComissaoId = async (comissaoId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('comissao_recebimentos')
        .select('*')
        .eq('comissao_id', comissaoId)
        .order('data', { ascending: false });

      if (error) {
        console.error("Erro ao buscar recebimentos:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro ao buscar recebimentos:", error);
      return [];
    }
  };

  const adicionarRecebimento = async (comissaoId: string, valor: number, data: string) => {
    try {
      const { error } = await supabase
        .from('comissao_recebimentos')
        .insert({
          comissao_id: comissaoId,
          valor: valor,
          data: data
        });

      if (error) {
        throw error;
      }
      toast({
        title: "Recebimento adicionado",
        description: "Recebimento adicionado com sucesso.",
        variant: "success"
      });
    } catch (error) {
      console.error("Erro ao adicionar recebimento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar recebimento",
        description: "Não foi possível adicionar o recebimento.",
      });
    }
  };

  // Update calcularTotais to return all needed properties
  const calcularTotais = (comissoesFiltradas: Comissao[]) => {
    const total = comissoesFiltradas.reduce((acc, comissao) => acc + (comissao.valorComissaoCorretor || 0), 0);
    const recebido = comissoesFiltradas
      .filter(c => c.status === "Recebido")
      .reduce((acc, comissao) => acc + (comissao.valorComissaoCorretor || 0), 0);
    const pendente = comissoesFiltradas
      .filter(c => c.status === "Pendente")
      .reduce((acc, comissao) => acc + (comissao.valorComissaoCorretor || 0), 0);
    const parcial = comissoesFiltradas
      .filter(c => c.status === "Parcial")
      .reduce((acc, comissao) => {
        return acc + (comissao.valorComissaoCorretor || 0) / 2;
      }, 0);
    
    // Add these properties needed by Relatorios.tsx
    const totalComissoes = total;
    const totalRecebido = recebido;
    const totalPendente = pendente;
    const recebidoCount = comissoesFiltradas.filter(c => c.status === "Recebido").length;
    const pendenteCount = comissoesFiltradas.filter(c => c.status === "Pendente").length;
    const metaComissao = 0; // This is a placeholder - the actual value comes from component state
    const atingidoPercentual = 0; // Placeholder - calculated in the component

    return { 
      total, 
      recebido, 
      pendente, 
      parcial, 
      totalComissoes,
      totalRecebido,
      totalPendente,
      recebidoCount,
      pendenteCount,
      metaComissao,
      atingidoPercentual
    };
  };

  const filtrarComissoes = (tab: string, filtro: string, periodo: string) => {
    let comissoesFiltradas = [...comissoes];

    // Filtra por status (tab)
    if (tab !== "todas") {
      comissoesFiltradas = comissoesFiltradas.filter(
        (comissao) => comissao.status === tab
      );
    }

    // Filtra por texto (filtro)
    if (filtro) {
      const filtroLower = filtro.toLowerCase();
      comissoesFiltradas = comissoesFiltradas.filter(
        (comissao) =>
          comissao.cliente.toLowerCase().includes(filtroLower) ||
          comissao.imovel.toLowerCase().includes(filtroLower)
      );
    }

    // Filtra por período
    if (periodo !== "todos") {
      const hoje = new Date();
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

      comissoesFiltradas = comissoesFiltradas.filter((comissao) => {
        const dataVenda = new Date(comissao.dataVenda);
        return dataVenda >= inicioMes && dataVenda <= fimMes;
      });
    }

    return comissoesFiltradas;
  };

  const alterarPeriodoAtual = (mes: number, ano: number) => {
    setMesAtual(mes);
    setAnoAtual(ano);
  };

  const marcarComoPago = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("comissoes")
        .update({
          status: "Recebido",
          data_pagamento: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setComissoes(
        comissoes.map((comissao) =>
          comissao.id === id
            ? {
                ...comissao,
                status: "Recebido",
                dataPagamento: new Date().toISOString(),
              }
            : comissao
        )
      );
      return true;
    } catch (error) {
      console.error("Erro ao marcar comissão como paga:", error);
      toast({
        variant: "destructive",
        title: "Erro ao marcar comissão como paga",
        description: "Não foi possível marcar a comissão como paga.",
      });
      return false;
    }
  };

  const atualizarMeta = async (valor: number, mes: number, ano: number) => {
    if (!user) return false;

    try {
      // Busca se já existe meta para o mês/ano/usuário
      const { data: existingMeta, error: fetchError } = await supabase
        .from('metas')
        .select('*')
        .eq('mes', mes)
        .eq('ano', ano)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingMeta) {
        // Atualiza a meta existente
        const { error } = await supabase
          .from('metas')
          .update({ valor })
          .eq('id', existingMeta.id);
        if (error) throw error;
      } else {
        // Insere nova meta
        const { error } = await supabase
          .from('metas')
          .insert({
            mes,
            ano,
            valor,
            user_id: user.id
          });
        if (error) throw error;
      }

      // Busca novamente para garantir o valor correto
      const { data, error: fetchAgainError } = await supabase
        .from('metas')
        .select('valor')
        .eq('mes', mes)
        .eq('ano', ano)
        .eq('user_id', user.id)
        .single();
      if (!fetchAgainError && data && typeof data.valor === 'number') {
        setMetaComissao(data.valor);
      } else {
        setMetaComissao(0);
      }

      toast({
        title: "Meta de venda atualizada",
        description: `A meta de venda para ${mes}/${ano} foi atualizada com sucesso.`,
        variant: "success"
      });
      return true;
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
      toast({
        variant: "destructive",
        title: "Erro ao definir meta de venda",
        description: "Não foi possível definir a meta mensal de venda.",
      });
      return false;
    }
  };

  const totais = useMemo(() => {
    const comissoesFiltradas = filtrarComissoes("todas", "", "todos");
    const totalComissoes = comissoesFiltradas.reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
    const totalPendente = comissoesFiltradas
      .filter(c => c.status === "Pendente")
      .reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
    const totalRecebido = comissoesFiltradas
      .filter(c => c.status === "Recebido")
      .reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
    const totalCount = comissoesFiltradas.length;
    const recebidoCount = comissoesFiltradas.filter(c => c.status === "Recebido").length;
    const pendenteCount = comissoesFiltradas.filter(c => c.status === "Pendente").length;
    const atingidoPercentual = metaComissao > 0 ? (totalRecebido / metaComissao) * 100 : 0;

    return {
      totalComissoes,
      totalPendente,
      totalRecebido,
      totalCount,
      recebidoCount,
      pendenteCount,
      atingidoPercentual
    };
  }, [comissoes, metaComissao]);

  // Função para buscar e somar recebimentos de um mês/ano
  const getTotalRecebidoPorMesAno = async (mes: number, ano: number) => {
    try {
      const inicioAno = `${ano}-01-01`;
      const fimAno = `${ano}-12-31`;
      const { data, error } = await supabase
        .from('comissao_recebimentos')
        .select('valor, data')
        .gte('data', inicioAno)
        .lte('data', fimAno);
      if (error) {
        console.error('Erro ao buscar recebimentos do ano:', error);
        return 0;
      }
      // Filtra pelo mês e ano exatos usando split da string
      return (data || []).reduce((acc, r) => {
        if (!r.data) return acc;
        const [yyyy, mm] = r.data.split('-');
        if (parseInt(yyyy) === ano && parseInt(mm) === mes) {
          return acc + (r.valor || 0);
        }
        return acc;
      }, 0);
    } catch (err) {
      console.error('Erro ao buscar recebimentos do mês:', err);
      return 0;
    }
  };

  return {
    comissoes,
    metaComissao,
    isLoading,
    adicionarComissao,
    atualizarComissao,
    marcarComoPago,
    excluirComissao,
    atualizarMeta,
    filtrarComissoes,
    totais,
    mesAtual,
    anoAtual,
    alterarPeriodoAtual,
    obterNomeMes,
    getRecebimentosByComissaoId,
    adicionarRecebimento,
    calcularTotais,
    getTotalRecebidoPorMesAno,
    exportarParaCSV,  // Added to return object
    exportarParaPDF   // Added to return object
  };
};
