import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
    
    // Cabeçalho
    const header = [
      incluirCliente ? "Cliente" : null,
      incluirImovel ? "Imóvel" : null,
      incluirValorVenda ? "Valor da Venda" : null,
      incluirValorComissao ? "Valor da Comissão" : null,
      incluirDataVenda ? "Data da Venda" : null,
      incluirDataPagamento ? "Data de Pagamento" : null,
      incluirStatus ? "Status" : null,
    ].filter(Boolean).join(",");
    
    csvContent += header + "\r\n";

    // Conteúdo das linhas
    comissoesParaExportar.forEach(comissao => {
      const row = [
        incluirCliente ? comissao.cliente : null,
        incluirImovel ? comissao.imovel : null,
        incluirValorVenda ? comissao.valorVenda : null,
        incluirValorComissao ? comissao.valorComissaoCorretor : null,
        incluirDataVenda ? comissao.dataVenda : null,
        incluirDataPagamento ? comissao.dataPagamento : null,
        incluirStatus ? comissao.status : null,
      ].filter(Boolean).join(",");
      
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "comissoes.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  const exportarParaPDF = (comissoesParaExportar: Comissao[], filtros: any) => {
    toast({
      title: "Em desenvolvimento",
      description: "A exportação para PDF estará disponível em breve.",
    });
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
        }, { onConflict: ['mes', 'ano', 'user_id'] });

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
        // Aqui precisaríamos calcular quanto já foi recebido parcialmente
        // Como não temos essa info no tipo, vamos considerar metade
        return acc + (comissao.valorComissaoCorretor || 0) / 2;
      }, 0);

    return { total, recebido, pendente, parcial };
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
  };
};

