
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
