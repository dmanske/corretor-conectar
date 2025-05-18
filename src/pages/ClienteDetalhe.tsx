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
import { ClientCard } from "@/components/ClientCard";
import { Modal } from "@/components/ui/modal";

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
  const [isDetalhesVendaModalOpen, setIsDetalhesVendaModalOpen] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState<any | null>(null);
  
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
    setFormVenda({
      ...venda,
      comissao_imobiliaria: venda.comissao_imobiliaria || '',
      comissao_corretor: venda.comissao_corretor || '',
      observacoes: venda.observacoes || ''
    });
  };

  // Função para salvar edição da venda
  const salvarEdicaoVenda = async () => {
    if (!vendaEditando) return;
    setSalvandoVenda(true);
    await atualizarVenda(vendaEditando.id, {
      ...formVenda,
      observacoes: formVenda.observacoes
    });
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
  
  // Função utilitária para criar datas UTC a partir de 'YYYY-MM-DD'
  function parseDateUTC(dateString) {
    if (!dateString) return null;
    // Aceita tanto 'YYYY-MM-DD' quanto 'YYYY-MM-DDTHH:mm:ss' (pega só a data)
    const [datePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
  
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
  
  // Funções para ações dos botões
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`);
  };
  const handleViewDetails = () => {
    if (vendasCliente.length > 0) {
      // Ordena por data e pega a venda mais recente
      const vendaMaisRecente = vendasCliente.reduce((a, b) => new Date(a.dataVenda) > new Date(b.dataVenda) ? a : b);
      setVendaDetalhe(vendaMaisRecente);
    } else {
      toast({
        title: "Sem vendas",
        description: "Este cliente ainda não possui vendas para exibir detalhes.",
        variant: "default"
      });
    }
  };
  const handleEdit = () => setEditando(true);
  const handleDelete = () => setConfirmationOpen(true);
  const handleNewSale = () => navigate(`/vendas/nova?cliente=${cliente.id}`);

  const handleAprovarVenda = (vendaId: string) => {
    // Implemente a lógica para aprovar uma venda
    console.log("Aprovar venda:", vendaId);
    toast({
      title: "Venda aprovada",
      description: "A venda foi aprovada com sucesso.",
      variant: "success"
    });
  };

  const handleReprovarVenda = (vendaId: string) => {
    // Implemente a lógica para reprovar uma venda
    console.log("Reprovar venda:", vendaId);
    toast({
      title: "Venda reprovada",
      description: "A venda foi reprovada com sucesso.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={handleVoltar} className="mr-4">
          Voltar
        </Button>
      </div>
      <ClientCard
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
        sales={vendasCliente.map(venda => ({
          id: venda.id,
          property: venda.tipoImovel,
          date: venda.dataVenda,
          value: venda.valor,
          type: venda.tipoImovel === 'Prédio' ? 'predio' : venda.tipoImovel === 'Comercial' ? 'comercial' : 'casa',
          comissao_corretor: venda.comissao_corretor ?? venda.comissaoCorretor ?? venda.comissaoCorretor,
          comissao_imobiliaria: venda.comissao_imobiliaria ?? venda.comissaoImobiliaria ?? venda.comissaoImobiliaria,
          observacoes: venda.observacoes
        }))}
        onWhatsAppClick={handleWhatsAppClick}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNewSale={handleNewSale}
        onViewSale={(saleId) => {
          const venda = vendasCliente.find(v => v.id === saleId);
          if (venda) {
            setSelectedVenda({
              ...venda,
              valor_total: venda.valor,
              data_venda: venda.dataVenda,
              produto: venda.tipoImovel,
              plano: venda.tipoImovel,
              valor_mensal: venda.valor / 12,
              status: 'Pendente',
              cliente_nome: cliente.nome,
              cliente_cpf: cliente.cpf,
              cliente_telefone: cliente.telefone,
              observacoes: venda.observacao,
              comissao_imobiliaria: venda.comissao_imobiliaria,
              comissao_corretor: venda.comissao_corretor
            });
            setIsDetalhesVendaModalOpen(true);
          }
        }}
        onEditSale={(saleId) => {
          const venda = vendasCliente.find(v => v.id === saleId);
          if (venda) abrirModalEditarVenda(venda);
        }}
        onDeleteSale={(saleId) => setVendaParaExcluir(saleId)}
        onApproveSale={handleAprovarVenda}
        onRejectSale={handleReprovarVenda}
      />
      
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

      {/* Modal de Detalhes da Venda */}
      <Modal
        isOpen={isDetalhesVendaModalOpen}
        onClose={() => setIsDetalhesVendaModalOpen(false)}
        title={null}
      >
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedVenda?.id ? `Venda #${selectedVenda.id}` : ''}</h3>
                <p className="text-sm text-gray-500">Informações completas da venda</p>
              </div>
            </div>

            {/* Informações Principais */}
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedVenda?.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                selectedVenda?.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedVenda?.status}
              </span>
            </div>
          </div>

          {/* Informações Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Valor Total</div>
              <div className="text-xl font-semibold text-gray-900">
                {selectedVenda?.valor_total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Data da Venda</div>
              <div className="text-xl font-semibold text-gray-900">
                {selectedVenda?.data_venda ? formatarData(selectedVenda.data_venda) : '-'}
              </div>
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Detalhes do Produto</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Produto</span>
                <span className="text-sm font-medium text-gray-900">{selectedVenda?.produto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Plano</span>
                <span className="text-sm font-medium text-gray-900">{selectedVenda?.plano}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Valor Mensal</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedVenda?.valor_mensal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Informações do Cliente</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nome</span>
                <span className="text-sm font-medium text-gray-900">{selectedVenda?.cliente_nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">CPF</span>
                <span className="text-sm font-medium text-gray-900">{selectedVenda?.cliente_cpf}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Telefone</span>
                <span className="text-sm font-medium text-gray-900">{selectedVenda?.cliente_telefone}</span>
              </div>
            </div>
          </div>

          {/* Observações */}
          {selectedVenda?.observacoes && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Observações</h4>
              <p className="text-sm text-gray-600">{selectedVenda.observacoes}</p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setIsDetalhesVendaModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Fechar
            </button>
            {selectedVenda?.status === 'Pendente' && (
              <>
                <button
                  onClick={() => {
                    if (selectedVenda) {
                      handleAprovarVenda(selectedVenda.id);
                      setIsDetalhesVendaModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Aprovar Venda
                </button>
                <button
                  onClick={() => {
                    if (selectedVenda) {
                      handleReprovarVenda(selectedVenda.id);
                      setIsDetalhesVendaModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reprovar Venda
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>

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
                <label className="block text-sm font-medium mb-1">Comissão da Imobiliária (R$)</label>
                <input className="w-full border rounded px-2 py-1" type="number" value={formVenda.comissao_imobiliaria || ''} onChange={e => setFormVenda(f => ({ ...f, comissao_imobiliaria: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comissão do Corretor (R$)</label>
                <input className="w-full border rounded px-2 py-1" type="number" value={formVenda.comissao_corretor || ''} onChange={e => setFormVenda(f => ({ ...f, comissao_corretor: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Observações</label>
                <textarea className="w-full border rounded px-2 py-1" value={formVenda.observacoes || ''} onChange={e => setFormVenda(f => ({ ...f, observacoes: e.target.value }))} />
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
