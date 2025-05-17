import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Updated Comissao interface to match what ComissaoTable expects
export interface Comissao {
  id: string;
  vendaId: string;
  cliente: string;
  imovel: string;
  valorVenda: number;
  valorOriginalVenda: number;
  valorAtualVenda: number;
  diferencaValor: number;
  statusValor: "Atualizado" | "Desatualizado" | "Justificado";
  justificativa?: string;
  dataAtualizacao: string;
  valorComissaoImobiliaria: number;
  valorComissaoCorretor: number;
  dataContrato: string;
  dataVenda: string;
  dataPagamento: string | null;
  notaFiscal: string | null;
  status: "Pendente" | "Parcial" | "Recebido";
  valorRecebidoParcial?: number;
  dataRecebimentoParcial?: string;
}

export interface Meta {
  id: string;
  valor: number;
  mes: number;
  ano: number;
  created_at?: string;
}

export const useComissoes = () => {
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [metaComissao, setMetaComissao] = useState<number>(0);
  const [metasMensais, setMetasMensais] = useState<Meta[]>([]);
  const [metaAtual, setMetaAtual] = useState<Meta | null>(null);
  const [mesAtual, setMesAtual] = useState<number>(new Date().getMonth() + 1);
  const [anoAtual, setAnoAtual] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [totais, setTotais] = useState({
    totalComissoes: 0,
    totalPendente: 0,
    totalRecebido: 0,
    totalCount: 0,
    recebidoCount: 0,
    pendenteCount: 0,
    atingidoPercentual: 0
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch comissoes
  useEffect(() => {
    const fetchComissoes = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("comissoes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        const formattedData = data.map((item: any): Comissao => ({
          id: item.id,
          vendaId: item.venda_id,
          cliente: item.cliente,
          imovel: item.imovel,
          valorVenda: item.valor_venda,
          valorOriginalVenda: item.valor_original_venda,
          valorAtualVenda: item.valor_atual_venda,
          diferencaValor: item.diferenca_valor,
          statusValor: item.status_valor as "Atualizado" | "Desatualizado" | "Justificado",
          justificativa: item.justificativa,
          dataAtualizacao: item.data_atualizacao,
          valorComissaoImobiliaria: item.valor_comissao_imobiliaria,
          valorComissaoCorretor: item.valor_comissao_corretor,
          dataContrato: item.data_contrato,
          dataVenda: item.data_venda,
          dataPagamento: item.data_pagamento,
          notaFiscal: item.nota_fiscal,
          status: item.status as "Pendente" | "Parcial" | "Recebido",
          valorRecebidoParcial: item.valor_recebido_parcial,
          dataRecebimentoParcial: item.data_recebimento_parcial
        }));

        setComissoes(formattedData);
      } catch (error) {
        console.error("Error fetching comissoes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComissoes();
  }, [user]);

  // Fetch todas as metas
  useEffect(() => {
    const fetchMetas = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("metas")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const metasFormatadas = data.map((meta: any) => ({
            id: meta.id,
            valor: meta.valor,
            mes: meta.mes || new Date().getMonth() + 1,
            ano: meta.ano || new Date().getFullYear(),
            created_at: meta.created_at
          }));
          
          setMetasMensais(metasFormatadas);
          
          // Busca meta do mês atual
          buscarMetaAtual(mesAtual, anoAtual, metasFormatadas);
        }
      } catch (error) {
        console.error("Error fetching metas:", error);
      }
    };

    fetchMetas();
  }, [user, mesAtual, anoAtual]);

  // Função para buscar meta do mês/ano específico
  const buscarMetaAtual = (mes: number, ano: number, metas: Meta[] = metasMensais) => {
    const metaEncontrada = metas.find(m => m.mes === mes && m.ano === ano);
    
    if (metaEncontrada) {
      setMetaAtual(metaEncontrada);
      setMetaComissao(metaEncontrada.valor);
    } else {
      setMetaAtual(null);
      // Se não tem meta para o mês atual, vamos tentar encontrar a meta mais recente
      if (metas.length > 0) {
        setMetaComissao(metas[0].valor);
      } else {
        setMetaComissao(0);
      }
    }
  };

  // Função para mudar o mês/ano atual
  const alterarPeriodoAtual = (mes: number, ano: number) => {
    setMesAtual(mes);
    setAnoAtual(ano);
    buscarMetaAtual(mes, ano);
  };

  const adicionarComissao = async (novaComissao: Partial<Comissao>) => {
    if (!user) return;
    
    try {
      // Verificar se a venda existe
      const { data: vendaData, error: vendaError } = await supabase
        .from("vendas")
        .select("*")
        .eq("id", novaComissao.vendaId)
        .single();

      if (vendaError || !vendaData) {
        throw new Error("Venda não encontrada");
      }

      const { data, error } = await supabase
        .from("comissoes")
        .insert({
          venda_id: novaComissao.vendaId,
          cliente: novaComissao.cliente,
          imovel: novaComissao.imovel,
          valor_venda: novaComissao.valorVenda,
          valor_original_venda: novaComissao.valorVenda,
          valor_atual_venda: novaComissao.valorVenda,
          diferenca_valor: 0,
          status_valor: "Atualizado",
          justificativa: novaComissao.justificativa,
          data_atualizacao: new Date().toISOString(),
          valor_comissao_imobiliaria: novaComissao.valorComissaoImobiliaria,
          valor_comissao_corretor: novaComissao.valorComissaoCorretor,
          data_contrato: novaComissao.dataContrato,
          data_venda: novaComissao.dataVenda,
          data_pagamento: novaComissao.dataPagamento,
          status: novaComissao.status as "Pendente" | "Parcial" | "Recebido",
          user_id: user.id
        })
        .select(`
          id,
          venda_id,
          cliente,
          imovel,
          valor_venda,
          valor_original_venda,
          valor_atual_venda,
          diferenca_valor,
          status_valor,
          justificativa,
          data_atualizacao,
          valor_comissao_imobiliaria,
          valor_comissao_corretor,
          data_contrato,
          data_venda,
          data_pagamento,
          nota_fiscal,
          status
        `);

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newComissao: Comissao = {
          id: data[0].id,
          vendaId: data[0].venda_id,
          cliente: data[0].cliente,
          imovel: data[0].imovel,
          valorVenda: data[0].valor_venda,
          valorOriginalVenda: data[0].valor_original_venda,
          valorAtualVenda: data[0].valor_atual_venda,
          diferencaValor: data[0].diferenca_valor,
          statusValor: data[0].status_valor as "Atualizado" | "Desatualizado" | "Justificado",
          justificativa: data[0].justificativa,
          dataAtualizacao: data[0].data_atualizacao,
          valorComissaoImobiliaria: data[0].valor_comissao_imobiliaria,
          valorComissaoCorretor: data[0].valor_comissao_corretor,
          dataContrato: data[0].data_contrato,
          dataVenda: data[0].data_venda,
          dataPagamento: data[0].data_pagamento,
          notaFiscal: data[0].nota_fiscal,
          status: data[0].status as "Pendente" | "Parcial" | "Recebido",
          valorRecebidoParcial: data[0].valor_recebido_parcial,
          dataRecebimentoParcial: data[0].data_recebimento_parcial
        };
        setComissoes([newComissao, ...comissoes]);
      }
    } catch (error) {
      console.error("Error adding comissao:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar comissão",
        description: "Não foi possível adicionar a comissão. Verifique se a venda existe."
      });
    }
  };
  
  const atualizarComissao = async (id: string, comissaoAtualizada: Partial<Comissao>) => {
    if (!user) return;
    
    try {
      const atualizacoes: any = {};
      
      if (comissaoAtualizada.cliente) atualizacoes.cliente = comissaoAtualizada.cliente;
      if (comissaoAtualizada.imovel) atualizacoes.imovel = comissaoAtualizada.imovel;
      if (comissaoAtualizada.valorVenda) atualizacoes.valor_venda = comissaoAtualizada.valorVenda;
      if (comissaoAtualizada.valorComissaoImobiliaria) atualizacoes.valor_comissao_imobiliaria = comissaoAtualizada.valorComissaoImobiliaria;
      if (comissaoAtualizada.valorComissaoCorretor) atualizacoes.valor_comissao_corretor = comissaoAtualizada.valorComissaoCorretor;
      if (comissaoAtualizada.dataContrato) atualizacoes.data_contrato = comissaoAtualizada.dataContrato;
      if (comissaoAtualizada.dataPagamento) atualizacoes.data_pagamento = comissaoAtualizada.dataPagamento;
      if (comissaoAtualizada.status) atualizacoes.status = comissaoAtualizada.status;
      
      // Se o status mudou para "Recebido" e não há data de pagamento, definir para hoje
      if (comissaoAtualizada.status === "Recebido" && !comissaoAtualizada.dataPagamento) {
        atualizacoes.data_pagamento = format(new Date(), "yyyy-MM-dd");
      }
      
      const { error } = await supabase
        .from("comissoes")
        .update(atualizacoes)
        .eq("id", id);

      if (error) {
        throw error;
      }
      
      // Atualizar o estado local
      setComissoes(comissoes.map(comissao => {
        if (comissao.id === id) {
          const updated = {
            ...comissao,
            ...comissaoAtualizada
          };
          
          // Se o status é "Recebido" e não há data de pagamento, definir para hoje
          if (updated.status === "Recebido" && !updated.dataPagamento) {
            updated.dataPagamento = format(new Date(), "yyyy-MM-dd");
          }
          
          return updated;
        }
        return comissao;
      }));
      
      toast({
        title: "Comissão atualizada",
        description: "A comissão foi atualizada com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error("Error updating comissao:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar comissão",
        description: "Não foi possível atualizar a comissão. Tente novamente."
      });
      return false;
    }
  };

  const marcarComoPago = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("comissoes")
        .update({
          status: "Recebido",
          data_pagamento: format(new Date(), "yyyy-MM-dd")
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setComissoes(comissoes.map(comissao => 
        comissao.id === id 
          ? { ...comissao, status: "Recebido", dataPagamento: format(new Date(), "yyyy-MM-dd") } 
          : comissao
      ));

      toast({
        title: "Comissão atualizada",
        description: "Comissão marcada como recebida com sucesso"
      });
    } catch (error) {
      console.error("Error updating comissao:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar comissão",
        description: "Não foi possível atualizar a comissão. Tente novamente."
      });
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

      setComissoes(comissoes.filter(c => c.id !== id));

      toast({
        title: "Comissão excluída",
        description: "Comissão excluída com sucesso",
        variant: "success"
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao excluir comissão:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir comissão",
        description: "Não foi possível excluir a comissão. Tente novamente."
      });
      return false;
    }
  };

  const atualizarMeta = async (valor: number, mes: number = mesAtual, ano: number = anoAtual) => {
    if (!user) return;
    
    try {
      // Verificar se já existe uma meta para o mês/ano especificado
      const { data: metasExistentes, error: erroConsulta } = await supabase
        .from("metas")
        .select("*")
        .eq("mes", mes)
        .eq("ano", ano)
        .eq("user_id", user.id);
        
      if (erroConsulta) {
        throw erroConsulta;
      }
      
      if (metasExistentes && metasExistentes.length > 0) {
        // Atualizar meta existente
        const { error } = await supabase
          .from("metas")
          .update({
            valor: valor
          })
          .eq("id", metasExistentes[0].id);
          
        if (error) {
          throw error;
        }
      } else {
        // Inserir nova meta
        const { error } = await supabase
          .from("metas")
          .insert({
            valor: valor,
            mes: mes,
            ano: ano,
            user_id: user.id
          });
          
        if (error) {
          throw error;
        }
      }

      // Atualizar estado local
      const novasMetas = [...metasMensais];
      const indexMetaExistente = novasMetas.findIndex(m => m.mes === mes && m.ano === ano);
      
      if (indexMetaExistente !== -1) {
        novasMetas[indexMetaExistente].valor = valor;
      } else {
        novasMetas.push({
          id: 'temp-id', // será substituído pelo ID real na próxima busca
          valor: valor,
          mes: mes,
          ano: ano
        });
      }
      
      setMetasMensais(novasMetas);
      
      // Atualizar meta atual se for o mês/ano selecionado
      if (mes === mesAtual && ano === anoAtual) {
        setMetaComissao(valor);
        setMetaAtual({
          id: metasExistentes && metasExistentes.length > 0 ? metasExistentes[0].id : 'temp-id',
          valor: valor,
          mes: mes,
          ano: ano
        });
      }

      toast({
        title: "Meta atualizada",
        description: `Meta de comissão para ${obterNomeMes(mes)}/${ano} atualizada com sucesso`
      });
    } catch (error) {
      console.error("Error updating meta:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar meta",
        description: "Não foi possível atualizar a meta. Tente novamente."
      });
    }
  };

  // Função auxiliar para obter o nome do mês
  const obterNomeMes = (mes: number): string => {
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return meses[mes - 1] || "";
  };

  const filtrarComissoes = (tab: string, filtroTexto: string, periodo: string) => {
    // Filtrar comissões com base na aba selecionada, texto de filtro e período
    return comissoes.filter(comissao => {
      // Filtro por status
      if (tab === "pendentes" && comissao.status !== "Pendente") return false;
      if (tab === "recebidas" && comissao.status !== "Recebido") return false;
      if (tab === "parciais" && comissao.status !== "Parcial") return false;
      
      // Filtro por texto
      if (filtroTexto && !comissao.cliente.toLowerCase().includes(filtroTexto.toLowerCase()) && 
          !comissao.imovel.toLowerCase().includes(filtroTexto.toLowerCase())) {
        return false;
      }
      
      // Filtro por período
      if (periodo === "mes") {
        const dataVenda = new Date(comissao.dataVenda);
        const hoje = new Date();
        if (dataVenda.getMonth() !== hoje.getMonth() || dataVenda.getFullYear() !== hoje.getFullYear()) {
          return false;
        }
      } else if (periodo === "trimestre") {
        const dataVenda = new Date(comissao.dataVenda);
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const trimestreAtual = Math.floor(mesAtual / 3);
        const trimestreVenda = Math.floor(dataVenda.getMonth() / 3);
        
        if (trimestreVenda !== trimestreAtual || dataVenda.getFullYear() !== hoje.getFullYear()) {
          return false;
        }
      } else if (periodo === "ano") {
        const dataVenda = new Date(comissao.dataVenda);
        const hoje = new Date();
        if (dataVenda.getFullYear() !== hoje.getFullYear()) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Função auxiliar para buscar todos os recebimentos de todas as comissões
  const getTodosRecebimentos = async (comissoes: Comissao[]) => {
    const ids = comissoes.map(c => c.id);
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from("comissao_recebimentos")
      .select("*")
      .in("comissao_id", ids);
    if (error) throw error;
    return data || [];
  };

  // Função para calcular totais considerando recebimentos parciais reais
  const calcularTotaisComRecebimentos = async (comissoesFiltradas: Comissao[]) => {
    const recebimentos = await getTodosRecebimentos(comissoesFiltradas);
    // Agrupar recebimentos por comissao_id
    const recebidosPorComissao: Record<string, number> = {};
    recebimentos.forEach((r: any) => {
      recebidosPorComissao[r.comissao_id] = (recebidosPorComissao[r.comissao_id] || 0) + r.valor;
    });

    let totalRecebido = 0;
    let totalPendente = 0;
    let totalComissoes = 0;
    let recebidoCount = 0;
    let pendenteCount = 0;
    let totalVendas = 0;

    comissoesFiltradas.forEach(c => {
      const recebido = recebidosPorComissao[c.id] || 0;
      totalComissoes += c.valorComissaoCorretor;
      totalRecebido += recebido;
      const falta = c.valorComissaoCorretor - recebido;
      if (falta > 0 && (c.status === "Pendente" || c.status === "Parcial")) {
        totalPendente += falta;
        pendenteCount++;
      }
      if (falta <= 0) {
        recebidoCount++;
      }
      // Soma o valor total de todas as vendas
      totalVendas += c.valorVenda;
    });

    const totalCount = comissoesFiltradas.length;
    // Agora o atingidoPercentual mostra quanto da meta foi atingido considerando todas as vendas
    let atingidoPercentual = metaComissao > 0 ? (totalVendas / metaComissao) * 100 : 0;
    if (atingidoPercentual < 0) atingidoPercentual = 0;

    return {
      totalComissoes,
      totalPendente,
      totalRecebido,
      totalCount,
      recebidoCount,
      pendenteCount,
      metaComissao,
      atingidoPercentual
    };
  };

  // Atualizar totais quando comissões mudarem
  useEffect(() => {
    let isMounted = true;
    const atualizarTotais = async () => {
      const comissoesFiltradas = comissoes;
      const novosTotais = await calcularTotaisComRecebimentos(comissoesFiltradas);
      if (isMounted) setTotais(novosTotais);
    };
    atualizarTotais();
    return () => { isMounted = false; };
  }, [comissoes, metaComissao]);

  const getComissaoById = (id: string) => {
    return comissoes.find(c => c.id === id) || null;
  };

  // Função para buscar recebimentos de uma comissão
  const getRecebimentosByComissaoId = async (comissaoId: string) => {
    const { data, error } = await supabase
      .from("comissao_recebimentos")
      .select("*")
      .eq("comissao_id", comissaoId)
      .order("data", { ascending: true });
    if (error) throw error;
    return data || [];
  };

  // Função para adicionar um novo recebimento
  const adicionarRecebimento = async (comissaoId: string, valor: number, data: string) => {
    const { data: novo, error } = await supabase
      .from("comissao_recebimentos")
      .insert([{ comissao_id: comissaoId, valor, data }])
      .select();
    if (error) throw error;
    return novo && novo[0];
  };
  
  // Funções de exportação
  
  // Exportar para CSV
  const exportarParaCSV = (comissoesFiltradas: Comissao[], filtros: any = {}) => {
    try {
      // Filtrar as colunas conforme o usuário selecionou
      const colunas = {
        cliente: filtros.incluirCliente !== false,
        imovel: filtros.incluirImovel !== false,
        valorVenda: filtros.incluirValorVenda !== false,
        valorComissaoCorretor: filtros.incluirValorComissao !== false,
        dataVenda: filtros.incluirDataVenda !== false,
        dataPagamento: filtros.incluirDataPagamento !== false,
        status: filtros.incluirStatus !== false
      };
      
      // Cabeçalho do CSV
      let cabecalhos = [];
      let campos = [];
      
      if (colunas.cliente) { cabecalhos.push('Cliente'); campos.push('cliente'); }
      if (colunas.imovel) { cabecalhos.push('Imóvel'); campos.push('imovel'); }
      if (colunas.valorVenda) { cabecalhos.push('Valor Venda'); campos.push('valorVenda'); }
      if (colunas.valorComissaoCorretor) { cabecalhos.push('Comissão'); campos.push('valorComissaoCorretor'); }
      if (colunas.dataVenda) { cabecalhos.push('Data Venda'); campos.push('dataVenda'); }
      if (colunas.dataPagamento) { cabecalhos.push('Data Pagamento'); campos.push('dataPagamento'); }
      if (colunas.status) { cabecalhos.push('Status'); campos.push('status'); }
      
      let csvContent = cabecalhos.join(';') + '\n';
      
      // Adicionar linhas de dados
      comissoesFiltradas.forEach(comissao => {
        let linha = [];
        
        campos.forEach(campo => {
          if (campo === 'dataVenda' || campo === 'dataPagamento') {
            const data = comissao[campo as keyof Comissao];
            linha.push(data ? new Date(data.toString()).toLocaleDateString() : '');
          } 
          else if (campo === 'valorVenda' || campo === 'valorComissaoCorretor') {
            const valor = comissao[campo as keyof Comissao];
            linha.push(typeof valor === 'number' ? valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00');
          }
          else {
            linha.push(comissao[campo as keyof Comissao] || '');
          }
        });
        
        csvContent += linha.join(';') + '\n';
      });
      
      // Criar blob e link para download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `comissoes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Exportação concluída",
        description: "Arquivo CSV baixado com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados para CSV"
      });
      
      return false;
    }
  };
  
  // Função para exportar para PDF (usando biblioteca externa como jsPDF)
  const exportarParaPDF = (comissoesFiltradas: Comissao[], filtros: any = {}) => {
    // Esta função será implementada quando adicionarmos a biblioteca jsPDF
    toast({
      variant: "destructive",
      title: "Funcionalidade em desenvolvimento",
      description: "A exportação para PDF será implementada em breve"
    });
    
    return false;
  };

  return {
    comissoes,
    metaComissao,
    metasMensais,
    metaAtual,
    mesAtual,
    anoAtual,
    isLoading,
    adicionarComissao,
    atualizarComissao,
    marcarComoPago,
    excluirComissao,
    atualizarMeta,
    alterarPeriodoAtual,
    buscarMetaAtual,
    obterNomeMes,
    filtrarComissoes,
    totais,
    getComissaoById,
    getRecebimentosByComissaoId,
    adicionarRecebimento,
    exportarParaCSV,
    exportarParaPDF
  };
};
