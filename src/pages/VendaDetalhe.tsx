import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash, User } from "lucide-react";
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
import { formatarData, formatarMoeda } from "../data/mockData";
import { useVendas } from "@/hooks/useVendas";

const VendaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getVendaById, excluirVenda, formatarData, formatarMoeda } = useVendas();
  const [venda, setVenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      const vendaEncontrada = getVendaById(id);
      setVenda(vendaEncontrada);
      setCarregando(false);
    }
  }, [id, getVendaById]);
  
  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!venda) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Venda não encontrada</h2>
        <p className="text-slate-500 mb-8">A venda que você está procurando não existe ou foi removida.</p>
        <Button asChild>
          <Link to="/vendas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista de Vendas
          </Link>
        </Button>
      </div>
    );
  }
  
  const handleExcluir = async () => {
    const sucesso = await excluirVenda(venda.id);
    if (sucesso) {
      toast({
        title: "Venda excluída",
        description: "A venda foi excluída com sucesso.",
      });
      navigate("/vendas");
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header com botão de voltar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Detalhes da Venda</h2>
            <p className="text-slate-500">{venda.tipoImovel} - {formatarData(venda.dataVenda)}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/app/vendas/${venda.id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setConfirmationOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações da venda */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Informações do Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-slate-500">Tipo de Imóvel</h4>
                <p className="text-base">{venda.tipoImovel}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500">Valor</h4>
                <p className="text-base font-semibold text-blue-600">{formatarMoeda(venda.valor)}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-slate-500">Endereço</h4>
                <p className="text-base">{venda.endereco}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-slate-500">Data da Venda</h4>
                <p className="text-base">{formatarData(venda.dataVenda)}</p>
              </div>
            </div>
            
            {venda.observacoes && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Observações</h4>
                  <p className="text-base">{venda.observacoes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Informações do cliente */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-slate-100 rounded-full">
                <User className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{venda.clienteNome}</h3>
                <Link 
                  to={`/app/clientes/${venda.clienteId}`} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver perfil completo do cliente
                </Link>
              </div>
            </div>
            
            <Separator />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 mb-4">Registre novas vendas para este cliente:</p>
              <Button asChild>
                <Link to={`/app/vendas/nova?cliente=${venda.clienteId}`}>
                  Nova Venda
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir} className="bg-red-600 hover:bg-red-700">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VendaDetalhe;
