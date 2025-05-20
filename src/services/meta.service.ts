
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const fetchMetaMensal = async (
  mes: number,
  ano: number,
  userId: string | undefined
) => {
  if (!userId) return 0;
  
  try {
    const { data, error } = await supabase
      .from('metas')
      .select('valor')
      .eq('mes', mes)
      .eq('ano', ano)
      .eq('user_id', userId)
      .single();
    
    if (!error && data && typeof data.valor === 'number') {
      return data.valor;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Erro ao buscar meta mensal:", error);
    return 0;
  }
};

export const getMetaMensal = async (
  mes: number,
  ano: number
): Promise<number> => {
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

// Nova função para buscar meta anual (mes=0 representa meta anual)
export const fetchMetaAnual = async (
  ano: number,
  userId: string | undefined
) => {
  if (!userId) return 0;
  
  try {
    const { data, error } = await supabase
      .from('metas')
      .select('valor')
      .eq('mes', 0) // Mes=0 indica meta anual
      .eq('ano', ano)
      .eq('user_id', userId)
      .single();
    
    if (!error && data && typeof data.valor === 'number') {
      return data.valor;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Erro ao buscar meta anual:", error);
    return 0;
  }
};

// Função para buscar todas as metas de um ano
export const fetchMetasDoAno = async (
  ano: number,
  userId: string | undefined
) => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('ano', ano)
      .eq('user_id', userId);
    
    if (!error && data) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Erro ao buscar metas do ano:", error);
    return [];
  }
};

export const adicionarMetaMensal = async (
  mes: number,
  ano: number,
  valor: number,
  userId: string | undefined,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from('metas')
      .upsert({
        mes: mes,
        ano: ano,
        valor: valor,
        user_id: userId
      }, { onConflict: 'mes,ano,user_id' });

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

export const atualizarMeta = async (
  valor: number,
  mes: number,
  ano: number,
  userId: string | undefined,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!userId) return false;

  try {
    // Busca se já existe meta para o mês/ano/usuário
    const { data: existingMeta, error: fetchError } = await supabase
      .from('metas')
      .select('*')
      .eq('mes', mes)
      .eq('ano', ano)
      .eq('user_id', userId)
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
          user_id: userId
        });
      if (error) throw error;
    }

    toast({
      title: "Meta de venda atualizada",
      description: `A meta de ${mes === 0 ? 'anual' : `venda para ${mes}/${ano}`} foi atualizada com sucesso.`,
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

// Nova função para atualizar meta anual
export const atualizarMetaAnual = async (
  valor: number,
  ano: number,
  userId: string | undefined,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  // Usamos a mesma função atualizarMeta, mas com mes=0
  return atualizarMeta(valor, 0, ano, userId, toast);
};

export const getTotalRecebidoPorMesAno = async (mes: number, ano: number) => {
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

// Nova função para buscar o total recebido no ano
export const getTotalRecebidoPorAno = async (ano: number) => {
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
    // Soma todos os valores do ano
    return (data || []).reduce((acc, r) => {
      if (!r.data) return acc;
      const [yyyy] = r.data.split('-');
      if (parseInt(yyyy) === ano) {
        return acc + (r.valor || 0);
      }
      return acc;
    }, 0);
  } catch (err) {
    console.error('Erro ao buscar recebimentos do ano:', err);
    return 0;
  }
};

// Função para obter os recebimentos agrupados por mês
export const getRecebimentosPorMesAno = async (ano: number) => {
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
      return {};
    }
    
    // Agrupa os recebimentos por mês
    const recebimentosPorMes: { [mes: number]: number } = {};
    
    (data || []).forEach(r => {
      if (!r.data) return;
      const [yyyy, mm] = r.data.split('-');
      const mes = parseInt(mm) - 1; // Convertendo para índice 0-11
      
      if (parseInt(yyyy) === ano) {
        if (!recebimentosPorMes[mes]) {
          recebimentosPorMes[mes] = 0;
        }
        recebimentosPorMes[mes] += (r.valor || 0);
      }
    });
    
    return recebimentosPorMes;
  } catch (err) {
    console.error('Erro ao buscar recebimentos por mês:', err);
    return {};
  }
};

// Função para obter valores a receber por mês
export const getValoresAReceberPorMesAno = async (ano: number, comissoes: any[]) => {
  try {
    // Inicializa objeto de valores por mês
    const aReceberPorMes: { [mes: number]: number } = {};
    
    // Filtra comissões do ano que são pendentes ou parciais
    const comissoesDoAno = comissoes.filter(c => {
      if (!c.dataVenda) return false;
      const dataVenda = new Date(c.dataVenda);
      return dataVenda.getFullYear() === ano && 
             (c.status?.toLowerCase() === 'pendente' || c.status?.toLowerCase() === 'parcial');
    });
    
    // Para cada comissão, busca os recebimentos já feitos e calcula o saldo
    for (const comissao of comissoesDoAno) {
      if (!comissao.dataVenda) continue;
      
      const dataVenda = new Date(comissao.dataVenda);
      const mes = dataVenda.getMonth();
      
      // Busca recebimentos desta comissão
      const { data: recebimentos, error } = await supabase
        .from('comissao_recebimentos')
        .select('valor')
        .eq('comissao_id', comissao.id);
        
      if (error) {
        console.error('Erro ao buscar recebimentos da comissão:', error);
        continue;
      }
      
      // Calcula total já recebido desta comissão
      const totalRecebido = (recebimentos || []).reduce((acc, r) => acc + (r.valor || 0), 0);
      
      // Calcula saldo a receber
      const valorAReceber = Math.max(0, (comissao.valorComissaoCorretor || 0) - totalRecebido);
      
      // Adiciona ao mês correspondente
      if (!aReceberPorMes[mes]) {
        aReceberPorMes[mes] = 0;
      }
      aReceberPorMes[mes] += valorAReceber;
    }
    
    return aReceberPorMes;
  } catch (err) {
    console.error('Erro ao calcular valores a receber por mês:', err);
    return {};
  }
};
