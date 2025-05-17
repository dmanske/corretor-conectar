import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Edit, Trash, Home, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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
import WhatsAppButton from "@/components/WhatsAppButton";
import { useClientes } from "@/hooks/useClientes";
import { useVendasContext } from "@/hooks/VendasProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ClienteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clientes, excluirCliente, formatarData, formatarTelefone, atualizarCliente } = useClientes();
  const { vendas, formatarMoeda, atualizarVenda, excluirVenda } = useVendasContext();
  const [cliente, setCliente] = useState(null);
  const [vendasCliente, setVendasCliente] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [vendaDetalhe, setVendaDetalhe] = useState<any | null>(null);
  const [vendaEditando, setVendaEditando] = useState<any | null>(null);
  const [formVenda, setFormVenda] = useState<any>({});
  const [salvandoVenda, setSalvandoVenda] = useState(false);
  const [vendaParaExcluir, setVendaParaExcluir] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState<any>({});
  const [salvando, setSalvando] = useState(false);
  const location = useLocation();
  const visualizacao = location.state?.visualizacao || "grid";
  
  useEffect(() => {
    // Buscar cliente e vendas
    const clienteEncontrado = clientes.find(c => c.id === id);
    const vendasEncontradas = vendas.filter(v => v.clienteId === id);
    
    if (clienteEncontrado) {
      setCliente(clienteEncontrado);
      setVendasCliente(vendasEncontradas);
    }
    setCarregando(false);
  }, [id, clientes, vendas]);
  
  useEffect(() => {
    if (editando && cliente) {
      setFormEdit({ ...cliente });
    }
  }, [editando, cliente]);
  
  const handleExcluirCliente = async () => {
    try {
      const sucesso = await excluirCliente(id);
      
      if (sucesso) {
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso.",
          variant: "success"
        });
        navigate("/clientes");
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente. Verifique se não há vendas associadas."
      });
    }
  };
  
  // Função para abrir modal de edição
  const abrirModalEditarVenda = (venda: any) => {
    setVendaEditando(venda);
    setFormVenda({ ...venda });
  };

  // Função para salvar edição da venda
  const salvarEdicaoVenda = async () => {
    if (!vendaEditando) return;
    setSalvandoVenda(true);
    await atualizarVenda(vendaEditando.id, formVenda);
    setSalvandoVenda(false);
    setVendaEditando(null);
    toast({
      title: "Venda atualizada",
      description: "Os dados da venda foram atualizados.",
      variant: "success"
    });
  };

  // Função para excluir venda
  const handleExcluirVenda = async () => {
    if (!vendaParaExcluir) return;
    try {
      const sucesso = await excluirVenda(vendaParaExcluir);
      if (sucesso) {
        toast({
          title: "Venda excluída",
          description: "A venda foi excluída com sucesso.",
          variant: "success"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir venda",
        description: "Não foi possível excluir a venda."
      });
    } finally {
      setVendaParaExcluir(null);
    }
  };
  
  // Função para salvar edição do cliente
  const salvarEdicao = async () => {
    if (!cliente) return;
    setSalvando(true);
    await atualizarCliente(cliente.id, formEdit);
    setSalvando(false);
    setEditando(false);
    toast({
      title: "Cliente atualizado",
      description: "Os dados do cliente foram atualizados.",
      variant: "success"
    });
  };
  
  const handleVoltar = () => {
    if (location.state && location.state.fromVendas) {
      navigate('/vendas');
    } else {
      navigate(`/clientes?view=${visualizacao}`);
    }
  };
  
  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!cliente) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Cliente não encontrado</h2>
        <p className="text-slate-500 mb-8">O cliente que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/clientes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista de Clientes
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={handleVoltar} className="mr-4">
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{cliente.nome}</h2>
          <p className="text-slate-500">Detalhes do cliente e histórico de vendas</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações do cliente */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-slate-500">Telefone</h4>
                <p className="text-base">{formatarTelefone(cliente.telefone)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500">E-mail</h4>
                <p className="text-base">{cliente.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500">CPF</h4>
                <p className="text-base">{cliente.cpf}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500">Data de Nascimento</h4>
                <p className="text-base">{formatarData(cliente.dataNascimento)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium text-slate-500">Endereço</h4>
              <p className="text-base">
                {cliente.endereco}
                {cliente.complemento && `, ${cliente.complemento}`}
              </p>
              <p className="text-base">
                {cliente.cidade}/{cliente.estado}
              </p>
              {cliente.cep && (
                <p className="text-base">CEP: {cliente.cep}</p>
              )}
            </div>
            
            {cliente.observacoes && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Observações</h4>
                  <p className="text-base">{cliente.observacoes}</p>
                </div>
              </>
            )}
            
            <div className="pt-4 flex justify-center gap-2">
              <WhatsAppButton 
                telefone={cliente.telefone} 
                mensagem={`Olá ${cliente.nome}, tudo bem? Estou entrando em contato para...`}
              />
              <Button variant="outline" onClick={() => setEditando(true)}>
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Histórico de vendas */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Histórico de Vendas</CardTitle>
              {vendasCliente.length > 0 && (
                <Button asChild size="sm">
                  <Link to={`/vendas/nova?cliente=${cliente.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Venda
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {vendasCliente.length > 0 ? (
              <div className="space-y-2">
                {vendasCliente.map(venda => (
                  <div key={venda.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium">{venda.tipoImovel}</p>
                        <p className="text-xs text-slate-500">{formatarData(venda.dataVenda)} - {formatarMoeda(venda.valor)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => setVendaDetalhe(venda)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => abrirModalEditarVenda(venda)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setVendaParaExcluir(venda.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-400 mb-4">Nenhuma venda registrada para este cliente.</p>
                <Button asChild>
                  <Link to={`/vendas/nova?cliente=${cliente.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Venda
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
              {vendasCliente.length > 0 && (
                <p className="mt-2 text-red-600">
                  Atenção: Este cliente possui {vendasCliente.length} venda(s) registrada(s). 
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
              disabled={vendasCliente.length > 0}
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modais de detalhes, edição e confirmação de exclusão de venda */}
      <Dialog open={!!vendaDetalhe} onOpenChange={open => { if (!open) setVendaDetalhe(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Venda</DialogTitle>
          </DialogHeader>
          {vendaDetalhe && (
            <div className="space-y-2">
              <p><b>Tipo do imóvel:</b> {vendaDetalhe.tipoImovel}</p>
              <p><b>Valor:</b> {formatarMoeda(vendaDetalhe.valor)}</p>
              <p><b>Data da venda:</b> {formatarData(vendaDetalhe.dataVenda)}</p>
              <p><b>Observação:</b> {vendaDetalhe.observacao || '-'}</p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!vendaEditando} onOpenChange={open => { if (!open) setVendaEditando(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Venda</DialogTitle>
          </DialogHeader>
          {vendaEditando && (
            <form onSubmit={e => { e.preventDefault(); salvarEdicaoVenda(); }} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo do imóvel</label>
                <input className="w-full border rounded px-2 py-1" value={formVenda.tipoImovel || ''} onChange={e => setFormVenda(f => ({ ...f, tipoImovel: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <input className="w-full border rounded px-2 py-1" type="number" value={formVenda.valor || ''} onChange={e => setFormVenda(f => ({ ...f, valor: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data da venda</label>
                <input className="w-full border rounded px-2 py-1" type="date" value={formVenda.dataVenda ? formVenda.dataVenda.slice(0,10) : ''} onChange={e => setFormVenda(f => ({ ...f, dataVenda: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Observação</label>
                <textarea className="w-full border rounded px-2 py-1" value={formVenda.observacao || ''} onChange={e => setFormVenda(f => ({ ...f, observacao: e.target.value }))} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={salvandoVenda}>{salvandoVenda ? "Salvando..." : "Salvar"}</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!vendaParaExcluir} onOpenChange={open => { if (!open) setVendaParaExcluir(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleExcluirVenda} className="bg-red-600 hover:bg-red-700">Sim, excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editando} onOpenChange={setEditando}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); salvarEdicao(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClienteDetalhe;
