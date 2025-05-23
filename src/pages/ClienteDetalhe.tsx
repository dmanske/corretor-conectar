import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Edit, Trash, Home, Plus, Eye, Calendar } from "lucide-react";
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
        navigate("/app/clientes");
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
  
  // Função para converter valor formatado para número
  function parseValor(valor: string | number) {
    if (typeof valor === "number") return valor;
    if (!valor) return 0;
    return parseFloat(valor.replace(/\./g, "").replace(",", "."));
  }
  
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
      valor: parseValor(formVenda.valor),
      comissao_imobiliaria: parseValor(formVenda.comissao_imobiliaria),
      comissao_corretor: parseValor(formVenda.comissao_corretor),
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

  // Função para formatar valor inicial ao abrir o modal
  function formatarValorInicial(valor: string | number) {
    if (typeof valor === "number") {
      return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (typeof valor === "string" && valor.includes(",")) {
      return valor;
    }
    const num = parseFloat(valor);
    if (!isNaN(num)) {
      return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "";
  }

  // Ao abrir o modal de edição de venda, garantir que os valores estejam formatados
  useEffect(() => {
    if (vendaEditando) {
      setFormVenda((prev: any) => ({
        ...prev,
        valor: formatarValorInicial(vendaEditando.valor),
        comissao_imobiliaria: formatarValorInicial(vendaEditando.comissao_imobiliaria),
        comissao_corretor: formatarValorInicial(vendaEditando.comissao_corretor)
      }));
    }
  }, [vendaEditando]);

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
      navigate('/app/vendas');
    } else {
      navigate(`/app/clientes?view=${visualizacao}`);
    }
  };
  
  // Funções de máscara para CPF, telefone e CEP
  function maskTelefone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/^(.{0,2})(.{0,1})(.{0,4})(.{0,4}).*/, (m, p1, p2, p3, p4) => {
        let out = "";
        if (p1) out += `(${p1}`;
        if (p1 && p1.length === 2) out += ") ";
        if (p2) out += p2;
        if (p3) out += ` ${p3}`;
        if (p4) out += `-${p4}`;
        return out;
      })
      .slice(0, 16);
  }
  function maskCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  function maskCEP(value: string) {
    return value.replace(/\D/g, "").replace(/(\d{5})(\d{1,3})/, "$1-$2").slice(0, 9);
  }
  
  // Função de máscara para moeda (R$)
  function maskValor(value: string | number) {
    let v = String(value).replace(/\D/g, "");
    v = (parseInt(v, 10) || 0).toString();
    if (v.length === 0) return "";
    if (v.length === 1) return "0,0" + v;
    if (v.length === 2) return "0," + v;
    return v.replace(/(\d+)(\d{2})$/, "$1,$2").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
          <Link to="/app/clientes">
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
      const vendaMaisRecente = vendasCliente.reduce((a, b) => new Date(a.dataVenda) > new Date(b.dataVenda) ? a : b);
      navigate(`/app/vendas/${vendaMaisRecente.id}`);
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
  const handleNewSale = () => navigate(`/app/vendas/nova?cliente=${cliente.id}`);

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
        cpf={cliente.cpf}
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
          property: venda.endereco,
          date: venda.dataVenda,
          value: venda.valor,
          type: venda.tipoImovel,
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
              comissao_corretor: venda.comissao_corretor,
              endereco: venda.endereco
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
      {isDetalhesVendaModalOpen && selectedVenda && (
        <Dialog open={isDetalhesVendaModalOpen} onOpenChange={setIsDetalhesVendaModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Informações Completas da Venda</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-2 mb-4">
                <Calendar className="text-blue-500" />
                <span className="text-blue-900 text-sm font-medium">Detalhes financeiros da transação.</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-1">Valor Total</span>
                  <span className="text-2xl font-bold text-gray-900">{formatarMoeda(selectedVenda.valor_total)}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-1">Data da Venda</span>
                  <span className="text-2xl font-bold text-gray-900">{formatarData(selectedVenda.data_venda)}</span>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-base font-semibold mb-2">Comissões</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-2 flex justify-between">
                  <span>Comissão do Corretor</span>
                  <span>{formatarMoeda(selectedVenda.comissao_corretor)}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-2 flex justify-between">
                  <span>Comissão da Imobiliária</span>
                  <span>{formatarMoeda(selectedVenda.comissao_imobiliaria)}</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex justify-between font-semibold">
                  <span>Total de Comissões</span>
                  <span>{formatarMoeda((selectedVenda.comissao_corretor || 0) + (selectedVenda.comissao_imobiliaria || 0))}</span>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-base font-semibold mb-2">Informações do Cliente</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 gap-2">
                  <div className="flex justify-between"><span className="text-gray-500">Nome</span><span className="font-medium text-gray-900">{cliente.nome}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">CPF</span><span className="font-medium text-gray-900">{cliente.cpf}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Telefone</span><span className="font-medium text-gray-900">{cliente.telefone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{cliente.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Endereço</span><span className="font-medium text-gray-900">{cliente.endereco}</span></div>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-base font-semibold mb-2">Detalhes do Imóvel</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 gap-2">
                  <div className="flex justify-between"><span className="text-gray-500">Tipo</span><span className="font-medium text-gray-900">{selectedVenda.produto}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Nome do Imóvel</span><span className="font-medium text-gray-900">{selectedVenda.endereco}</span></div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={!!vendaEditando} onOpenChange={open => { if (!open) setVendaEditando(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edite os dados da venda</DialogTitle>
            <p className="text-slate-500 text-sm mt-1">Atualize as informações da venda abaixo. Campos marcados com <span className='text-red-500'>*</span> são obrigatórios.</p>
          </DialogHeader>
          {vendaEditando && (
            <form onSubmit={e => { e.preventDefault(); salvarEdicaoVenda(); }}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Tipo do imóvel <span className="text-red-500">*</span></label>
                    <select
                      name="tipoImovel"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                      value={formVenda.tipoImovel || ''}
                      onChange={e => setFormVenda(f => ({ ...f, tipoImovel: e.target.value }))}
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="Apartamento">Apartamento</option>
                      <option value="Casa">Casa</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Sala Comercial">Sala Comercial</option>
                      <option value="Galpão">Galpão</option>
                      <option value="Outros">Outros...</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Valor <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Ex: 250.000,00"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      value={formVenda.valor || ''}
                      onChange={e => setFormVenda(f => ({ ...f, valor: maskValor(e.target.value) }))}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Data da venda <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      value={formVenda.dataVenda ? formVenda.dataVenda.slice(0,10) : ''}
                      onChange={e => setFormVenda(f => ({ ...f, dataVenda: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Comissão da Imobiliária (R$)</label>
                    <input
                      type="text"
                      placeholder="Ex: 15.000,00"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formVenda.comissao_imobiliaria || ''}
                      onChange={e => setFormVenda(f => ({ ...f, comissao_imobiliaria: maskValor(e.target.value) }))}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Comissão do Corretor (R$)</label>
                    <input
                      type="text"
                      placeholder="Ex: 7.500,00"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formVenda.comissao_corretor || ''}
                      onChange={e => setFormVenda(f => ({ ...f, comissao_corretor: maskValor(e.target.value) }))}
                    />
                  </div>
                  <div className="flex flex-col space-y-1 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Observações</label>
                    <textarea
                      placeholder="Adicione observações relevantes sobre a venda"
                      rows={4}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      value={formVenda.observacoes || ''}
                      onChange={e => setFormVenda(f => ({ ...f, observacoes: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => setVendaEditando(null)}
                    disabled={salvandoVenda}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    disabled={salvandoVenda}
                  >
                    {salvandoVenda ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
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
              <Input id="telefone" value={maskTelefone(formEdit.telefone || "")} onChange={e => setFormEdit(f => ({ ...f, telefone: maskTelefone(e.target.value) }))} required />
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value={maskCPF(formEdit.cpf || "")} onChange={e => setFormEdit(f => ({ ...f, cpf: maskCPF(e.target.value) }))} required />
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
              <Input id="cep" value={maskCEP(formEdit.cep || "")} onChange={e => setFormEdit(f => ({ ...f, cep: maskCEP(e.target.value) }))} />
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
