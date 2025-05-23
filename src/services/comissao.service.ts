import { supabase } from "@/integrations/supabase/client";
import { Comissao, ComissaoStatus, StatusValor, ComissaoRecebimento, ParcelasPendentes } from "@/types/comissao.types";
import { useToast } from "@/hooks/use-toast";

export const fetchComissoes = async (userId: string | undefined) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("comissoes")
      .select("*")
      .order('data_contrato', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map((comissao) => ({
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
      nota_fiscal: comissao.nota_fiscal || ""
    }));
  } catch (error) {
    console.error("Erro ao buscar comissões:", error);
    throw error;
  }
};

export const adicionarComissao = async (
  comissao: Omit<Comissao, "id" | "createdAt" | "updatedAt">,
  userId: string | undefined,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!userId) return null;

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
        status_valor: comissao.statusValor || "Atualizado" as StatusValor,
        user_id: userId,
        nota_fiscal: comissao.nota_fiscal,
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
        nota_fiscal: data[0].nota_fiscal,
      };

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

export const atualizarComissao = async (
  id: string,
  comissaoAtualizada: Partial<Comissao>,
  userId: string | undefined,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!userId) return false;

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
    if (comissaoAtualizada.nota_fiscal !== undefined) atualizacoes.nota_fiscal = comissaoAtualizada.nota_fiscal;

    const { error } = await supabase
      .from("comissoes")
      .update(atualizacoes)
      .eq("id", id);

    if (error) {
      throw error;
    }
    // --- SINCRONIZAR COM VENDA ---
    // Buscar a comissão para pegar o vendaId
    const { data: comissaoData, error: errorComissao } = await supabase
      .from("comissoes")
      .select("venda_id")
      .eq("id", id)
      .single();
    if (!errorComissao && comissaoData && comissaoData.venda_id) {
      const vendaUpdates: any = {};
      if (comissaoAtualizada.valorComissaoImobiliaria !== undefined) {
        vendaUpdates.comissao_imobiliaria = comissaoAtualizada.valorComissaoImobiliaria;
      }
      if (comissaoAtualizada.valorComissaoCorretor !== undefined) {
        vendaUpdates.comissao_corretor = comissaoAtualizada.valorComissaoCorretor;
      }
      if (Object.keys(vendaUpdates).length > 0) {
        await supabase
          .from("vendas")
          .update(vendaUpdates)
          .eq("id", comissaoData.venda_id);
      }
    }
    // --- FIM SINCRONAÇÃO ---
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

export const marcarComoPago = async (
  id: string,
  userId: string | undefined,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!userId) return false;

  try {
    // Buscar a comissão para pegar o valor total
    const { data: comissaoData, error: comissaoError } = await supabase
      .from("comissoes")
      .select("valor_comissao_corretor")
      .eq("id", id)
      .single();
    if (comissaoError || !comissaoData) {
      throw comissaoError || new Error("Comissão não encontrada");
    }
    const valorTotal = comissaoData.valor_comissao_corretor || 0;

    // Buscar recebimentos já registrados
    const recebimentos = await getRecebimentosByComissaoId(id);
    const valorRecebido = recebimentos.reduce((acc, r) => acc + (r.valor || 0), 0);
    const valorRestante = valorTotal - valorRecebido;

    // Se houver valor pendente, registrar recebimento automático
    if (valorRestante > 0) {
      await adicionarRecebimento(id, valorRestante, new Date().toISOString().slice(0, 10), toast);
    }

    // Atualizar status para Recebido
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

    toast({
      title: "Comissão marcada como recebida",
      description: valorRestante > 0 ? "O valor restante foi registrado automaticamente." : "Status atualizado.",
      variant: "success"
    });

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

export const excluirComissao = async (
  id: string,
  userId: string | undefined,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!userId) return false;

  try {
    const { error } = await supabase
      .from("comissoes")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

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

export const getRecebimentosByComissaoId = async (comissaoId: string): Promise<ComissaoRecebimento[]> => {
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

    return (data || []).map(item => ({
      id: item.id,
      comissao_id: item.comissao_id,
      valor: item.valor,
      data: item.data
    }));
  } catch (error) {
    console.error("Erro ao buscar recebimentos:", error);
    return [];
  }
};

export const adicionarRecebimento = async (
  comissaoId: string,
  valor: number,
  data: string,
  toast: ReturnType<typeof useToast>["toast"]
) => {
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
    return true;
  } catch (error) {
    console.error("Erro ao adicionar recebimento:", error);
    toast({
      variant: "destructive",
      title: "Erro ao adicionar recebimento",
      description: "Não foi possível adicionar o recebimento.",
    });
    return false;
  }
};

export const getParcelasPendentes = async (userId: string | undefined): Promise<ParcelasPendentes[]> => {
  if (!userId) return [];
  
  try {
    // Busca comissões pendentes ou parciais
    const { data: comissoes, error: comissoesError } = await supabase
      .from("comissoes")
      .select("*")
      .in("status", ["Pendente", "Parcial"])
      .order('data_venda', { ascending: false });
    
    if (comissoesError) throw comissoesError;
    if (!comissoes || comissoes.length === 0) return [];
    
    // Lista de parcelas pendentes
    const parcelas: ParcelasPendentes[] = [];
    
    // Para cada comissão, busca recebimentos e calcula valores pendentes
    for (const comissao of comissoes) {
      const { data: recebimentos, error: recebimentosError } = await supabase
        .from('comissao_recebimentos')
        .select('*')
        .eq('comissao_id', comissao.id)
        .order('data', { ascending: false });
      
      if (recebimentosError) {
        console.error("Erro ao buscar recebimentos:", recebimentosError);
        continue;
      }
      
      const valorTotal = comissao.valor_comissao_corretor || 0;
      const valorPago = (recebimentos || []).reduce((total, item) => total + (item.valor || 0), 0);
      const valorPendente = valorTotal - valorPago;
      
      // Se há valor pendente, adiciona à lista
      if (valorPendente > 0) {
        // Calcula próximo vencimento (simulado: 30 dias após a venda ou último pagamento)
        const ultimoPagamento = recebimentos && recebimentos.length > 0 
          ? recebimentos[0].data 
          : null;
        
        // Calcula próximo vencimento (30 dias após a venda ou último pagamento)
        const baseDate = ultimoPagamento || comissao.data_venda;
        const proximoVencimento = baseDate ? 
          new Date(new Date(baseDate).setDate(new Date(baseDate).getDate() + 30)).toISOString().split('T')[0] : null;
        
        // Calcula dias em atraso
        let diasEmAtraso = 0;
        if (proximoVencimento) {
          const hoje = new Date();
          const dataVencimento = new Date(proximoVencimento);
          if (hoje > dataVencimento) {
            diasEmAtraso = Math.floor((hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24));
          }
        }
        
        parcelas.push({
          comissaoId: comissao.id,
          cliente: comissao.cliente,
          imovel: comissao.imovel,
          valorTotal,
          valorPago,
          valorPendente,
          dataVenda: comissao.data_venda,
          dataUltimoPagamento: ultimoPagamento,
          proximoVencimento,
          diasEmAtraso
        });
      }
    }
    
    return parcelas;
  } catch (error) {
    console.error("Erro ao buscar parcelas pendentes:", error);
    return [];
  }
};
