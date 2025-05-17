import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Venda } from "@/types";
import { format } from "date-fns";
import { useComissoes } from "./useComissoes";

export const useVendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { adicionarComissao } = useComissoes();

  // Fetch vendas
  useEffect(() => {
    const fetchVendas = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Join with clientes to get cliente_nome
        const { data, error } = await supabase
          .from("vendas")
          .select(`
            *,
            clientes:cliente_id (nome)
          `)
          .order('data_venda', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const vendasFormatadas = data.map(venda => ({
            id: venda.id,
            clienteId: venda.cliente_id,
            clienteNome: venda.clientes ? venda.clientes.nome : "Cliente não encontrado",
            tipoImovel: venda.tipo_imovel as any,
            endereco: venda.endereco,
            valor: Number(venda.valor),
            dataVenda: venda.data_venda,
            observacoes: venda.observacoes || "",
            createdAt: venda.created_at,
            updatedAt: venda.updated_at
          }));
          
          setVendas(vendasFormatadas);
        }
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar vendas",
          description: "Não foi possível carregar as vendas."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendas();
  }, [user, toast]);

  const adicionarVenda = async (venda: Omit<Venda, "id" | "clienteNome" | "createdAt" | "updatedAt">, clienteNome: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("vendas")
        .insert({
          cliente_id: venda.clienteId,
          tipo_imovel: venda.tipoImovel,
          endereco: venda.endereco,
          valor: venda.valor,
          data_venda: venda.dataVenda,
          observacoes: venda.observacoes,
          user_id: user.id
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const novaVenda: Venda = {
          id: data[0].id,
          clienteId: data[0].cliente_id,
          clienteNome: clienteNome,
          tipoImovel: data[0].tipo_imovel as any,
          endereco: data[0].endereco,
          valor: Number(data[0].valor),
          dataVenda: data[0].data_venda,
          observacoes: data[0].observacoes || "",
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at
        };

        setVendas([novaVenda, ...vendas]);
        
        // Criar comissão pendente automaticamente
        await adicionarComissao({
          vendaId: novaVenda.id,
          cliente: clienteNome,
          imovel: `${novaVenda.tipoImovel} - ${novaVenda.endereco}`,
          valorVenda: novaVenda.valor,
          valorComissaoImobiliaria: 0, // Será preenchido depois
          valorComissaoCorretor: 0, // Será preenchido depois
          dataContrato: novaVenda.dataVenda,
          dataVenda: novaVenda.dataVenda,
          status: "Pendente"
        });
        
        toast({
          title: "Venda registrada",
          description: "A venda foi registrada com sucesso. Por favor, complete os dados da comissão.",
          variant: "success"
        });
        
        return novaVenda;
      }
      return null;
    } catch (error) {
      console.error("Erro ao adicionar venda:", error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar venda",
        description: "Não foi possível registrar a venda."
      });
      return null;
    }
  };

  const excluirVenda = async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from("vendas")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setVendas(vendas.filter(v => v.id !== id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir venda",
        description: "Não foi possível excluir a venda."
      });
      return false;
    }
  };

  const atualizarVenda = async (id: string, vendaAtualizada: Partial<Venda>) => {
    if (!user) return false;
    try {
      const atualizacoes: any = {};
      if (vendaAtualizada.tipoImovel !== undefined) atualizacoes.tipo_imovel = vendaAtualizada.tipoImovel;
      if (vendaAtualizada.endereco !== undefined) atualizacoes.endereco = vendaAtualizada.endereco;
      if (vendaAtualizada.valor !== undefined) atualizacoes.valor = vendaAtualizada.valor;
      if (vendaAtualizada.dataVenda !== undefined) atualizacoes.data_venda = vendaAtualizada.dataVenda;
      if (vendaAtualizada.observacoes !== undefined) atualizacoes.observacoes = vendaAtualizada.observacoes;

      const { error } = await supabase
        .from("vendas")
        .update(atualizacoes)
        .eq("id", id);

      if (error) {
        throw error;
      }

      setVendas(vendas.map(v => v.id === id ? { ...v, ...vendaAtualizada, updatedAt: new Date().toISOString() } : v));
      toast({
        title: "Venda atualizada",
        description: "Os dados da venda foram atualizados.",
        variant: "success"
      });
      return true;
    } catch (error) {
      console.error("Erro ao atualizar venda:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar venda",
        description: "Não foi possível atualizar a venda."
      });
      return false;
    }
  };

  const getVendaById = (id: string) => {
    return vendas.find(v => v.id === id) || null;
  };
  
  const getVendasByClienteId = (clienteId: string) => {
    return vendas.filter(v => v.clienteId === clienteId);
  };

  // Utils for formatting
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarData = (data: string): string => {
    if (!data) return "";
    const partes = data.split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
  };

  // Dashboard stats
  const getDashboardData = () => {
    const totalVendas = vendas.length;
    const valorTotalVendas = vendas.reduce((total, venda) => total + venda.valor, 0);
    const vendasRecentes = vendas
      .slice(0, 5)
      .map(venda => ({
        id: venda.id,
        clienteNome: venda.clienteNome,
        tipoImovel: venda.tipoImovel,
        valor: venda.valor,
        dataVenda: venda.dataVenda
      }));

    return {
      totalVendas,
      valorTotalVendas,
      vendasRecentes
    };
  };

  return {
    vendas,
    isLoading,
    adicionarVenda,
    excluirVenda,
    atualizarVenda,
    getVendaById,
    getVendasByClienteId,
    formatarMoeda,
    formatarData,
    getDashboardData
  };
};

export default useVendas;
