import { supabase } from "@/integrations/supabase/client";
import { MetaAnual, MetaAnualCreate, MetaAnualUpdate } from "@/types/meta-anual.types";

export const metaAnualService = {
  async getByAno(ano: number): Promise<MetaAnual | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from("metas_anuais")
      .select("*")
      .eq("ano", ano)
      .eq("usuario_id", user.id)
      .single();
    if (error) {
      console.error("Erro ao buscar meta anual:", error);
      return null;
    }
    return data;
  },

  async create(meta: MetaAnualCreate): Promise<MetaAnual | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from("metas_anuais")
      .insert([{ ...meta, usuario_id: user.id }])
      .select()
      .single();
    if (error) {
      console.error("Erro ao criar meta anual:", error);
      return null;
    }
    return data;
  },

  async update(id: string, meta: MetaAnualUpdate): Promise<MetaAnual | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from("metas_anuais")
      .update(meta)
      .eq("id", id)
      .eq("usuario_id", user.id)
      .select()
      .single();
    if (error) {
      console.error("Erro ao atualizar meta anual:", error);
      return null;
    }
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("metas_anuais")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar meta anual:", error);
      return false;
    }

    return true;
  },
}; 