import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus,
  UserPlus,
  List,
  LayoutGrid,
  Trash,
  Edit,
  Eye,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Cliente, Venda } from "../types";
import { useClientes } from "@/hooks/useClientes";
import { useVendasContext } from "@/hooks/VendasProvider";
import { Badge } from "@/components/ui/badge";
import { isValid } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ClientCard } from "@/components/ClientCard";
import { useComissoes } from "@/hooks/comissoes";

const Clientes = () => {
  const [busca, setBusca] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const viewParam = params.get("view");
  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>(viewParam === "lista" ? "lista" : "grid");
  const { clientes, isLoading, formatarTelefone, atualizarCliente, excluirCliente } = useClientes();
  const { vendas, excluirVenda, formatarMoeda, formatarData, atualizarVenda } = useVendasContext();
  const { getComissoesByVendaId } = useComissoes();
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);
  const [vendaParaExcluir, setVendaParaExcluir] = useState<string | null>(null);
  const [formEdit, setFormEdit] = useState<Partial<Cliente> & { cep?: string }>({});
  const [salvando, setSalvando] = useState(false);
  const { toast } = useToast();
  const [ordenacao, setOrdenacao] = useState("nome");
  const navigate = useNavigate();
  
  // Filtrar clientes com base na busca
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.telefone.includes(busca) ||
    cliente.email.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.endereco.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.cidade.toLowerCase().includes(busca.toLowerCase())
  );
  
  // Função para ordenar clientes
  const clientesOrdenados = useMemo(() => {
    let lista = [...clientesFiltrados];
    if (ordenacao === "nome") {
      lista.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordenacao === "cadastro") {
      lista.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (ordenacao === "aniversario") {
      lista.sort((a, b) => {
        const hoje = new Date();
        const getProxAniv = (data: string) => {
          const [ano, mes, dia] = data.split("-");
          const aniv = new Date(hoje.getFullYear(), parseInt(mes) - 1, parseInt(dia));
          if (aniv < hoje) aniv.setFullYear(aniv.getFullYear() + 1);
          return aniv.getTime() - hoje.getTime();
        };
        return getProxAniv(a.dataNascimento) - getProxAniv(b.dataNascimento);
      });
    }
    return lista;
  }, [clientesFiltrados, ordenacao]);
  
  // Função para abrir o modal de edição
  const abrirModalEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setFormEdit({ ...cliente });
  };

  // Função para salvar edição
  const salvarEdicao = async () => {
    if (!clienteEditando) return false;
    setSalvando(true);
    const sucesso = await atualizarCliente(clienteEditando.id, formEdit);
    setSalvando(false);
    return sucesso;
  };

  const handleExcluirCliente = async () => {
    if (!clienteParaExcluir) return;
    
    try {
      const sucesso = await excluirCliente(clienteParaExcluir.id);
      
      if (sucesso) {
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso.",
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente. Verifique se não há vendas associadas."
      });
    } finally {
      setClienteParaExcluir(null);
    }
  };

  const handleExcluirVenda = async () => {
    if (!vendaParaExcluir) return;
    
    // Verificar se há comissões associadas a esta venda
    const comissoesAssociadas = getComissoesByVendaId(vendaParaExcluir);
    if (comissoesAssociadas && comissoesAssociadas.length > 0) {
      toast({
        variant: "destructive",
        title: "Não foi possível excluir a venda",
        description: "Esta venda está atrelada a uma comissão. Exclua a comissão antes de remover a venda."
      });
      setVendaParaExcluir(null);
      return;
    }
    
    try {
      const sucesso = await excluirVenda(vendaParaExcluir);
      if (sucesso) {
        toast({
          title: "Venda excluída",
          description: "A venda foi excluída com sucesso.",
          variant: "success"
        });
      }
    } catch (error: any) {
      // Verifica se o erro é relacionado à comissão
      if (error?.response?.data?.mensagem?.toLowerCase().includes("comissão") || 
          error?.message?.toLowerCase().includes("comissão") ||
          error?.message?.toLowerCase().includes("comissao")) {
        toast({
          variant: "destructive",
          title: "Não foi possível excluir a venda",
          description: "Esta venda está atrelada a uma comissão. Exclua a comissão antes de remover a venda."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao excluir venda",
          description: "Não foi possível excluir a venda."
        });
      }
    } finally {
      setVendaParaExcluir(null);
    }
  };

  // Função para verificar se o cliente tem vendas
  const getVendasCliente = (clienteId: string) => {
    return vendas.filter(venda => venda.clienteId === clienteId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
          <p className="text-slate-500">Gerencie seus clientes cadastrados.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={visualizacao === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setVisualizacao('grid')}
            aria-label="Visualização em grade"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={visualizacao === 'lista' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setVisualizacao('lista')}
            aria-label="Visualização em lista"
          >
            <List className="h-5 w-5" />
          </Button>
          <Button asChild>
            <Link to="/app/clientes/novo">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Link>
          </Button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            type="text"
            placeholder="Buscar clientes por nome, telefone ou endereço..." 
            className="pl-10"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Seletor de ordenação */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-500">Ordenar por:</div>
        <select value={ordenacao} onChange={e => setOrdenacao(e.target.value)} className="border rounded px-2 py-1 text-sm">
          <option value="nome">Nome (A-Z)</option>
          <option value="cadastro">Data de Cadastro</option>
          <option value="aniversario">Aniversário mais próximo</option>
        </select>
      </div>

      {/* Lista de clientes */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : clientesOrdenados.length > 0 ? (
        visualizacao === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clientesOrdenados.map(cliente => (
              <ClientCard
                key={cliente.id}
                name={cliente.nome}
                clientSince={cliente.createdAt}
                phone={cliente.telefone}
                email={cliente.email}
                isPremium={cliente.isPremium}
                address={{
                  street: cliente.endereco,
                  number: cliente.numero,
                  complement: cliente.complemento,
                  city: cliente.cidade,
                  state: cliente.estado,
                  zipCode: cliente.cep,
                }}
                birthday={cliente.dataNascimento}
                sales={getVendasCliente(cliente.id).map(venda => ({
                  id: venda.id,
                  property: venda.tipoImovel,
                  date: venda.dataVenda,
                  value: venda.valor,
                  type: venda.tipoImovel === 'Prédio' ? 'predio' : venda.tipoImovel === 'Comercial' ? 'comercial' : 'casa'
                }))}
                onWhatsAppClick={() => window.open(`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`)}
                onViewDetails={() => navigate(`/app/clientes/${cliente.id}`)}
                onEdit={() => abrirModalEditar(cliente)}
                onDelete={() => setClienteParaExcluir(cliente)}
                compact={true}
              />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {clientesOrdenados.map(cliente => {
              // Lógica de aniversário hoje (UTC)
              let dataNascimentoObj;
              const partes = cliente.dataNascimento.split('-');
              if (partes.length === 3) {
                dataNascimentoObj = new Date(Date.UTC(
                  parseInt(partes[0]),
                  parseInt(partes[1]) - 1,
                  parseInt(partes[2])
                ));
              } else {
                const partesAlternativas = cliente.dataNascimento.split('/');
                if (partesAlternativas.length === 3) {
                  dataNascimentoObj = new Date(Date.UTC(
                    parseInt(partesAlternativas[2]),
                    parseInt(partesAlternativas[1]) - 1,
                    parseInt(partesAlternativas[0])
                  ));
                }
              }
              const hoje = new Date();
              const aniversarioHoje = dataNascimentoObj && isValid(dataNascimentoObj) &&
                dataNascimentoObj.getUTCDate() === hoje.getUTCDate() &&
                dataNascimentoObj.getUTCMonth() === hoje.getUTCMonth();

              // Buscar vendas do cliente
              const vendasDoCliente = vendas.filter(v => v.clienteId === cliente.id);
              const ultimaVenda = vendasDoCliente.length > 0 ? vendasDoCliente.reduce((a, b) => new Date(a.dataVenda) > new Date(b.dataVenda) ? a : b) : null;
              const anoCadastro = cliente.createdAt ? new Date(cliente.createdAt).getFullYear() : null;

              return (
                <div key={cliente.id} className="flex items-center justify-between py-4 px-2 hover:bg-slate-50 hover:shadow-md border-b border-slate-200 transition group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex-shrink-0 bg-slate-200 rounded-full w-10 h-10 flex items-center justify-center text-slate-500 font-bold text-lg">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-base truncate">{cliente.nome}</div>
                      </div>
                      <div className="text-xs text-slate-500 truncate">{formatarTelefone(cliente.telefone)} • {cliente.email}</div>
                      <div className="text-xs text-slate-500 truncate">{cliente.cidade} {cliente.estado && `/ ${cliente.estado}`}{cliente.cep ? ` • CEP: ${cliente.cep}` : ''}</div>
                      <div className="text-xs text-slate-500 truncate flex items-center gap-2">
                        Aniversário: {(() => {
                          const [year, month, day] = cliente.dataNascimento.split('-');
                          return `${day}/${month}/${year}`;
                        })()}
                        {aniversarioHoje && (
                          <Badge variant="destructive" className="bg-pink-500 text-white text-xs px-2 py-1 ml-2">
                            🎉 Hoje
                          </Badge>
                        )}
                      </div>
                      {/* Cliente desde */}
                      {anoCadastro && (
                        <div className="text-xs text-slate-400">Cliente desde {anoCadastro}</div>
                      )}
                      {/* Última venda */}
                      {ultimaVenda && (
                        <div className="text-xs text-blue-700 mt-1">Última venda: {formatarData(ultimaVenda.dataVenda)} - {formatarMoeda(ultimaVenda.valor)}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <WhatsAppButton telefone={cliente.telefone} size="sm" />
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/app/clientes/${cliente.id}`} state={{ visualizacao }}><Eye className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => abrirModalEditar(cliente)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setClienteParaExcluir(cliente)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <Card className="border border-dashed border-slate-300 bg-slate-50">
          <CardContent className="py-10 text-center">
            <p className="text-slate-500 mb-4">Nenhum cliente encontrado.</p>
            <Button asChild>
              <Link to="/app/clientes/novo">
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de edição */}
      <Dialog open={!!clienteEditando} onOpenChange={open => { if (!open) setClienteEditando(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={async e => { e.preventDefault(); const sucesso = await salvarEdicao(); if (sucesso) setClienteEditando(null); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" value={formEdit.nome || ""} onChange={e => setFormEdit(f => ({ ...f, nome: e.target.value }))} required />
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={formEdit.email || ""} onChange={e => setFormEdit(f => ({ ...f, email: e.target.value }))} required />
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" value={formEdit.telefone || ""} onChange={e => setFormEdit(f => ({ ...f, telefone: e.target.value }))} required />
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value={formEdit.cpf || ""} onChange={e => setFormEdit(f => ({ ...f, cpf: e.target.value }))} required />
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input id="dataNascimento" type="date" value={formEdit.dataNascimento || ""} onChange={e => setFormEdit(f => ({ ...f, dataNascimento: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" value={formEdit.endereco || ""} onChange={e => setFormEdit(f => ({ ...f, endereco: e.target.value }))} />
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" value={formEdit.complemento || ""} onChange={e => setFormEdit(f => ({ ...f, complemento: e.target.value }))} />
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={formEdit.cidade || ""} onChange={e => setFormEdit(f => ({ ...f, cidade: e.target.value }))} />
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" value={formEdit.estado || ""} onChange={e => setFormEdit(f => ({ ...f, estado: e.target.value }))} />
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" value={formEdit.cep || ""} onChange={e => setFormEdit(f => ({ ...f, cep: e.target.value }))} />
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" value={formEdit.observacoes || ""} onChange={e => setFormEdit(f => ({ ...f, observacoes: e.target.value }))} />
            </div>
            <DialogFooter className="col-span-1 md:col-span-2">
              <Button type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</Button>
              <Button type="button" variant="outline" onClick={() => setClienteEditando(null)}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={!!clienteParaExcluir} onOpenChange={open => { if (!open) setClienteParaExcluir(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
              {clienteParaExcluir && getVendasCliente(clienteParaExcluir.id).length > 0 && (
                <p className="mt-2 text-red-600">
                  Atenção: Este cliente possui {getVendasCliente(clienteParaExcluir.id).length} venda(s) registrada(s). 
                  Você precisa excluir as vendas associadas antes de remover o cliente.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExcluirCliente} 
              className="bg-red-600 hover:bg-red-700"
              disabled={clienteParaExcluir ? getVendasCliente(clienteParaExcluir.id).length > 0 : false}
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação para exclusão de venda */}
      <AlertDialog open={!!vendaParaExcluir} onOpenChange={open => { if (!open) setVendaParaExcluir(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExcluirVenda} 
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clientes;
