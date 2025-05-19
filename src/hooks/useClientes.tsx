import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Cliente } from "@/types";
import { format, isWithinInterval, addDays, addMonths, setYear, isSameDay, parse, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Extend the Cliente type to include temporary properties used for birthday calculations
interface ClienteWithBirthdayInfo extends Cliente {
  _diasAteAniversario?: number;
  _isAniversarioHoje?: boolean;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<ClienteWithBirthdayInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch clients
  useEffect(() => {
    const fetchClientes = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("clientes")
          .select("*")
          .order("nome");

        if (error) {
          throw error;
        }

        if (data) {
          const clientesFormatados = data.map(cliente => ({
            id: cliente.id,
            nome: cliente.nome,
            endereco: cliente.endereco || "",
            complemento: cliente.complemento || "",
            numero: cliente.numero || "", // Handle the numero property
            telefone: cliente.telefone || "",
            cidade: cliente.cidade || "",
            estado: cliente.estado || "",
            cpf: cliente.cpf || "",
            dataNascimento: cliente.data_nascimento || "",
            email: cliente.email || "",
            observacoes: cliente.observacoes || "",
            cep: cliente.cep || "",
            createdAt: cliente.created_at || "",
            updatedAt: cliente.updated_at || "",
            isPremium: cliente.is_premium || false // Handle the isPremium property
          }));
          
          setClientes(clientesFormatados);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar os clientes."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, [user, toast]);

  const adicionarCliente = async (cliente: Omit<Cliente, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("clientes")
        .insert({
          nome: cliente.nome,
          endereco: cliente.endereco,
          complemento: cliente.complemento,
          numero: cliente.numero, // Include the numero property
          telefone: cliente.telefone,
          cidade: cliente.cidade,
          estado: cliente.estado,
          cpf: cliente.cpf,
          data_nascimento: cliente.dataNascimento,
          email: cliente.email,
          observacoes: cliente.observacoes,
          cep: cliente.cep,
          user_id: user.id
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const novoCliente: Cliente = {
          id: data[0].id,
          nome: data[0].nome,
          endereco: data[0].endereco || "",
          complemento: data[0].complemento || "",
          numero: data[0].numero || "", // Include the numero property
          telefone: data[0].telefone || "",
          cidade: data[0].cidade || "",
          estado: data[0].estado || "",
          cpf: data[0].cpf || "",
          dataNascimento: data[0].data_nascimento || "",
          email: data[0].email || "",
          observacoes: data[0].observacoes || "",
          cep: data[0].cep || "",
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at
        };

        setClientes([...clientes, novoCliente]);
        return novoCliente;
      }
      return null;
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar cliente",
        description: "Não foi possível adicionar o cliente."
      });
      return null;
    }
  };

  const atualizarCliente = async (id: string, cliente: Partial<Cliente>) => {
    if (!user) return false;
    
    try {
      const atualizacoes: any = {};
      
      if (cliente.nome !== undefined) atualizacoes.nome = cliente.nome;
      if (cliente.endereco !== undefined) atualizacoes.endereco = cliente.endereco;
      if (cliente.complemento !== undefined) atualizacoes.complemento = cliente.complemento;
      if (cliente.telefone !== undefined) atualizacoes.telefone = cliente.telefone;
      if (cliente.cidade !== undefined) atualizacoes.cidade = cliente.cidade;
      if (cliente.estado !== undefined) atualizacoes.estado = cliente.estado;
      if (cliente.cpf !== undefined) atualizacoes.cpf = cliente.cpf;
      if (cliente.dataNascimento !== undefined) atualizacoes.data_nascimento = cliente.dataNascimento;
      if (cliente.email !== undefined) atualizacoes.email = cliente.email;
      if (cliente.observacoes !== undefined) atualizacoes.observacoes = cliente.observacoes;
      if (cliente.cep !== undefined) atualizacoes.cep = cliente.cep;
      
      const { error } = await supabase
        .from("clientes")
        .update(atualizacoes)
        .eq("id", id);

      if (error) {
        throw error;
      }

      setClientes(clientes.map(c => 
        c.id === id ? { ...c, ...cliente, updatedAt: new Date().toISOString() } : c
      ));
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente."
      });
      return false;
    }
  };

  const excluirCliente = async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setClientes(clientes.filter(c => c.id !== id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente."
      });
      return false;
    }
  };

  const getClienteById = (id: string) => {
    return clientes.find(c => c.id === id) || null;
  };

  const getAniversariantes = () => {
    const hoje = new Date();
    console.log("Total de clientes:", clientes.length);
    console.log("Data de hoje:", hoje.toLocaleDateString(), "- Dia:", hoje.getDate(), "Mês:", hoje.getMonth() + 1);
    
    const aniversariantes = clientes
      .filter(cliente => {
        if (!cliente.dataNascimento) {
          console.log(`Cliente ${cliente.nome} não tem data de nascimento`);
          return false;
        }
        
        try {
          // Tentativa de parsing mais robusta
          let dataNascimento;
          
          // Se a data estiver no formato DD/MM/YYYY, converter para YYYY-MM-DD
          if (cliente.dataNascimento.includes('/')) {
            const partes = cliente.dataNascimento.split('/');
            if (partes.length === 3) {
              // Assumindo formato DD/MM/YYYY
              dataNascimento = new Date(Date.UTC(
                parseInt(partes[2]), // ano
                parseInt(partes[1]) - 1, // mês (0-11)
                parseInt(partes[0]) // dia
              ));
              console.log(`Data convertida de DD/MM/YYYY para (UTC): ${dataNascimento.toISOString()}`);
            }
          } else {
            // Tentar com formato padrão (YYYY-MM-DD), interpretando como UTC
            const partes = cliente.dataNascimento.split('-');
            if (partes.length === 3) {
              dataNascimento = new Date(Date.UTC(
                parseInt(partes[0]), // ano
                parseInt(partes[1]) - 1, // mês (0-11)
                parseInt(partes[2]) // dia
              ));
              console.log(`Data original (YYYY-MM-DD) interpretada como UTC: ${dataNascimento.toISOString()}`);
            } else {
              // Fallback para o método anterior se não for YYYY-MM-DD
              dataNascimento = new Date(cliente.dataNascimento); 
            }
          }
          
          if (!isValid(dataNascimento)) {
            console.log(`Data de nascimento inválida para ${cliente.nome}: ${cliente.dataNascimento}`);
            return false;
          }
          
          // Extrair dia e mês para comparação direta (usando UTC)
          const diaNascimento = dataNascimento.getUTCDate();
          const mesNascimento = dataNascimento.getUTCMonth(); // 0-11
          const diaHoje = hoje.getUTCDate();
          const mesHoje = hoje.getUTCMonth(); // 0-11
          
          console.log(`Cliente ${cliente.nome}: Nascimento (UTC) - Dia: ${diaNascimento}, Mês: ${mesNascimento+1} | Hoje (UTC) - Dia: ${diaHoje}, Mês: ${mesHoje+1}`);
          
          // Verificar se hoje é aniversário (comparando apenas dia e mês)
          const isToday = diaHoje === diaNascimento && mesHoje === mesNascimento;
          
          console.log(`Cliente ${cliente.nome} é aniversário hoje? ${isToday ? "SIM" : "NÃO"}`);
          
          // Se for aniversário hoje, já retorna true e define diasAte = 0
          if (isToday) {
            cliente._diasAteAniversario = 0;
            cliente._isAniversarioHoje = true;
            console.log(`Cliente ${cliente.nome}: É aniversário HOJE!`);
            return true;
          }
          
          // Create a date for this year's birthday
          const aniversarioEsteAno = new Date(
            hoje.getFullYear(),
            mesNascimento,
            diaNascimento
          );

          // Se o aniversário já passou este ano, use o próximo ano
          let aniversarioProximo = new Date(aniversarioEsteAno);
          if (aniversarioEsteAno < hoje) {
            aniversarioProximo = new Date(
              hoje.getFullYear() + 1,
              mesNascimento,
              diaNascimento
            );
          }

          // Zerar horas/minutos/segundos para evitar problemas de comparação
          aniversarioProximo.setHours(0, 0, 0, 0);
          const hojeZerado = new Date(hoje);
          hojeZerado.setHours(0, 0, 0, 0);

          // Calculate days until birthday
          const diasAte = Math.round(
            (aniversarioProximo.getTime() - hojeZerado.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          console.log(`Cliente ${cliente.nome}: Aniversário em ${diasAte} dias, é hoje? ${isToday}`);
          
          // Store this information for later use
          cliente._diasAteAniversario = diasAte;
          cliente._isAniversarioHoje = isToday;
          
          // Consider for the next 30 days
          return diasAte <= 30 || isToday;
        } catch (e) {
          console.error(`Erro ao processar data de nascimento para ${cliente.nome}:`, e);
          return false;
        }
      })
      .map(cliente => {
        const dataNascimento = new Date(cliente.dataNascimento);
        const diasAte = cliente._diasAteAniversario || 0;
        const isHoje = cliente._isAniversarioHoje || false;
        
        return {
          id: cliente.id,
          nome: cliente.nome,
          dataNascimento: cliente.dataNascimento,
          telefone: cliente.telefone,
          email: cliente.email,
          diasAte: isHoje ? 0 : diasAte
        };
      })
      .sort((a, b) => a.diasAte - b.diasAte);

    const aniversariantesSemana = aniversariantes.filter(a => a.diasAte <= 7);
    const aniversariantesMes = aniversariantes.filter(a => a.diasAte <= 30);

    console.log("Aniversariantes da semana:", aniversariantesSemana.length);
    console.log("Aniversariantes do mês:", aniversariantesMes.length);

    return { aniversariantesSemana, aniversariantesMes };
  };

  // Util functions for formatting
  const formatarData = (data: string): string => {
    if (!data) return "";
    try {
      return format(parseISO(data), 'dd/MM/yyyy');
    } catch (e) {
      return "";
    }
  };

  const formatarTelefone = (telefone: string): string => {
    if (!telefone) return "";
    if (telefone.length === 11) {
      return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
    }
    return telefone;
  };

  return {
    clientes,
    isLoading,
    adicionarCliente,
    atualizarCliente,
    excluirCliente,
    getClienteById,
    getAniversariantes,
    formatarData,
    formatarTelefone
  };
};

export default useClientes;
