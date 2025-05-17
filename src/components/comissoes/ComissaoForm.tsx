import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useClientes } from "@/hooks/useClientes";
import { useComissoes, Comissao } from "@/hooks/useComissoes";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CalendarIcon } from "lucide-react";

interface ComissaoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddComissao: (comissao: Partial<Comissao>) => void;
  isMetaForm?: boolean;
  currentMeta?: number;
  comissaoParaEditar?: Comissao | null;
}

const ComissaoForm = ({ 
  open, 
  onOpenChange, 
  onAddComissao, 
  isMetaForm = false, 
  currentMeta,
  comissaoParaEditar
}: ComissaoFormProps) => {
  const { toast } = useToast();
  const { clientes } = useClientes();
  const { getRecebimentosByComissaoId, adicionarRecebimento, obterNomeMes } = useComissoes();
  
  const [novaComissao, setNovaComissao] = useState<Partial<Comissao>>({
    cliente: "",
    imovel: "",
    valorVenda: 0,
    valorComissaoImobiliaria: 0,
    valorComissaoCorretor: 0,
    dataContrato: format(new Date(), "yyyy-MM-dd"),
    dataPagamento: null,
    status: "Pendente"
  });
  
  const [metaValor, setMetaValor] = useState(currentMeta || 0);
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string>("");
  const [recebimentos, setRecebimentos] = useState<{ valor: number, data: string }[]>([]);
  const [novoRecebimento, setNovoRecebimento] = useState({ valor: '', data: '' });
  const [recebimentoParaExcluir, setRecebimentoParaExcluir] = useState<{ valor: number, data: string } | null>(null);

  useEffect(() => {
    if (isMetaForm && currentMeta) {
      setMetaValor(currentMeta);
    }
    
    // Se estiver no modo de edição, preencher o formulário com os dados da comissão
    if (comissaoParaEditar) {
      setNovaComissao({
        ...comissaoParaEditar,
      });
      
      // Encontrar o ID do cliente baseado no nome
      const clienteEncontrado = clientes.find(c => c.nome === comissaoParaEditar.cliente);
      if (clienteEncontrado) {
        setClienteSelecionadoId(clienteEncontrado.id);
      }
    }

    if (comissaoParaEditar && comissaoParaEditar.id) {
      getRecebimentosByComissaoId(comissaoParaEditar.id).then(recebimentosDb => {
        setRecebimentos(recebimentosDb.map((r: any) => ({ valor: r.valor, data: r.data })));
      });
    }
  }, [isMetaForm, currentMeta, comissaoParaEditar, clientes]);
  
  const handleClienteChange = (clienteId: string) => {
    setClienteSelecionadoId(clienteId);
    const clienteSelecionado = clientes.find(c => c.id === clienteId);
    if (clienteSelecionado) {
      setNovaComissao({
        ...novaComissao,
        cliente: clienteSelecionado.nome
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "valorVenda" || name === "valorComissaoImobiliaria" || name === "valorComissaoCorretor") {
      const valorNumerico = parseFloat(value);
      setNovaComissao({
        ...novaComissao,
        [name]: valorNumerico
      });
    } else if (name === "metaValor") {
      setMetaValor(parseFloat(value));
    } else {
      setNovaComissao({
        ...novaComissao,
        [name]: value
      });
    }
  };
  
  const handleStatusChange = (status: "Pendente" | "Parcial" | "Recebido") => {
    setNovaComissao({
      ...novaComissao,
      status,
      // Se o status for "Recebido", definir a data de pagamento como a data atual
      dataPagamento: status === "Recebido" ? format(new Date(), "yyyy-MM-dd") : novaComissao.dataPagamento
    });
  };

  const handleAdicionarRecebimento = async () => {
    if (!novoRecebimento.valor || !novoRecebimento.data) return;
    await adicionarRecebimento(comissaoParaEditar?.id || "", parseFloat(novoRecebimento.valor), novoRecebimento.data);
    setNovoRecebimento({ valor: '', data: '' });
    // Buscar novamente e mapear para valor/data
    const lista = await getRecebimentosByComissaoId(comissaoParaEditar?.id || "");
    setRecebimentos(lista.map((r: any) => ({ valor: r.valor, data: r.data })));
  };

  // Gerar anos para o select
  const gerarAnos = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = anoAtual - 2; i <= anoAtual + 2; i++) {
      anos.push(i);
    }
    return anos;
  };

  const handleSubmit = () => {
    if (isMetaForm) {
      onAddComissao({ 
        valorComissaoCorretor: metaValor, 
        dataVenda: `${anoSelecionado}-${mesSelecionado.toString().padStart(2, '0')}-01`, // Usamos para passar o mês/ano
        dataContrato: `${mesSelecionado}-${anoSelecionado}` // Usamos para passar o mês/ano em outro formato
      });
      onOpenChange(false);
      toast({
        title: "Meta atualizada",
        description: `A meta de comissão para ${obterNomeMes(mesSelecionado)}/${anoSelecionado} foi atualizada com sucesso.`
      });
      return;
    }
    
    if (!novaComissao.cliente || !novaComissao.imovel || !novaComissao.valorVenda || 
        !novaComissao.valorComissaoImobiliaria || !novaComissao.valorComissaoCorretor) {
      toast({
        title: "Erro ao adicionar",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onAddComissao(novaComissao);
    onOpenChange(false);
    
    toast({
      title: comissaoParaEditar ? "Comissão atualizada" : "Comissão adicionada",
      description: comissaoParaEditar 
        ? "A comissão foi atualizada com sucesso." 
        : "A nova comissão foi adicionada com sucesso."
    });
    
    // Resetar o formulário
    setNovaComissao({
      cliente: "",
      imovel: "",
      valorVenda: 0,
      valorComissaoImobiliaria: 0,
      valorComissaoCorretor: 0,
      dataContrato: format(new Date(), "yyyy-MM-dd"),
      dataPagamento: null,
      status: "Pendente"
    });
    setClienteSelecionadoId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isMetaForm 
              ? "Definir Meta de Comissão" 
              : comissaoParaEditar ? "Editar Comissão" : "Adicionar Nova Comissão"}
          </DialogTitle>
          <DialogDescription>
            {isMetaForm 
              ? "Defina a meta de comissão para o mês e ano selecionados."
              : comissaoParaEditar 
                ? "Atualize os dados da comissão selecionada." 
                : "Preencha os dados da nova comissão a ser registrada."}
          </DialogDescription>
        </DialogHeader>
        
        {isMetaForm ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="selectMes">Mês</Label>
                <Select 
                  value={String(mesSelecionado)} 
                  onValueChange={(value) => setMesSelecionado(parseInt(value))}
                >
                  <SelectTrigger id="selectMes" className="w-full">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {obterNomeMes(i + 1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="selectAno">Ano</Label>
                <Select 
                  value={String(anoSelecionado)} 
                  onValueChange={(value) => setAnoSelecionado(parseInt(value))}
                >
                  <SelectTrigger id="selectAno" className="w-full">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {gerarAnos().map((ano) => (
                      <SelectItem key={ano} value={String(ano)}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="metaValor">Valor da Meta (R$)</Label>
              <Input
                id="metaValor"
                name="metaValor"
                type="number"
                value={metaValor || ""}
                onChange={handleInputChange}
                placeholder="0,00"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
              <div className="text-sm text-slate-600 mb-1 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Período selecionado</span>
              </div>
              <div className="font-medium text-slate-800">
                {obterNomeMes(mesSelecionado)} de {anoSelecionado}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="clienteSelect">Cliente</Label>
                <Select
                  value={clienteSelecionadoId}
                  onValueChange={handleClienteChange}
                  disabled={!!comissaoParaEditar}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imovel">Imóvel</Label>
                <Input
                  id="imovel"
                  name="imovel"
                  value={novaComissao.imovel}
                  onChange={handleInputChange}
                  placeholder="Descrição do imóvel"
                  disabled={!!comissaoParaEditar}
                />
              </div>
              <div>
                <Label htmlFor="valorVenda">Valor da Venda (R$)</Label>
                <Input
                  id="valorVenda"
                  name="valorVenda"
                  type="number"
                  value={novaComissao.valorVenda || ""}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  disabled={!!comissaoParaEditar}
                />
              </div>
              <div>
                <Label htmlFor="valorComissaoImobiliaria">Valor da Comissão da Imobiliária (R$)</Label>
                <Input
                  id="valorComissaoImobiliaria"
                  name="valorComissaoImobiliaria"
                  type="number"
                  value={novaComissao.valorComissaoImobiliaria || ""}
                  onChange={handleInputChange}
                  placeholder="Ex: 7.500,00"
                />
              </div>
              <div>
                <Label htmlFor="valorComissaoCorretor">Valor da Comissão do Corretor (R$)</Label>
                <Input
                  id="valorComissaoCorretor"
                  name="valorComissaoCorretor"
                  type="number"
                  value={novaComissao.valorComissaoCorretor || ""}
                  onChange={handleInputChange}
                  placeholder="Ex: 3.500,00"
                />
              </div>
              <div>
                <Label htmlFor="dataContrato">Data do Contrato</Label>
                <Input
                  id="dataContrato"
                  name="dataContrato"
                  type="date"
                  value={novaComissao.dataContrato}
                  onChange={handleInputChange}
                />
              </div>
              {comissaoParaEditar && (
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={novaComissao.status}
                    onValueChange={(value) => handleStatusChange(value as "Pendente" | "Parcial" | "Recebido")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Parcial">Parcial</SelectItem>
                      <SelectItem value="Recebido">Recebido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {novaComissao.status === "Recebido" && (
              <div>
                <Label htmlFor="dataPagamento">Data de Recebimento</Label>
                <Input
                  id="dataPagamento"
                  name="dataPagamento"
                  type="date"
                  value={novaComissao.dataPagamento || ""}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {novaComissao.status === "Parcial" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8 }}>
                  <b>Recebimentos já feitos:</b>
                  {recebimentos.length === 0 && <div className="text-slate-500">Nenhum recebimento lançado</div>}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {recebimentos.map((rec, idx) => (
                      <div key={idx} style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        padding: '8px 16px',
                        background: '#f9fafb',
                        minWidth: 120,
                        textAlign: 'center',
                        position: 'relative'
                      }}>
                        <div style={{ fontWeight: 600 }}>R$ {rec.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div style={{ fontSize: 12 }}>{rec.data.split('-').reverse().join('/')}</div>
                        <button
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#aaa',
                            padding: 0
                          }}
                          title="Excluir recebimento"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecebimentoParaExcluir(rec);
                          }}
                        >
                          <span style={{ fontSize: 14, fontWeight: 700 }}>&times;</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <Label>Valor Recebido (R$)</Label>
                    <Input
                      type="number"
                      value={novoRecebimento.valor}
                      onChange={e => setNovoRecebimento({ ...novoRecebimento, valor: e.target.value })}
                      placeholder="Ex: 1.000,00"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Label>Data do Recebimento</Label>
                    <Input
                      type="date"
                      value={novoRecebimento.data}
                      onChange={e => setNovoRecebimento({ ...novoRecebimento, data: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 'none' }}>
                    <Button type="button" onClick={handleAdicionarRecebimento}>Adicionar</Button>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Label>Falta receber</Label>
                  <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    padding: '0.5rem',
                    background: '#f9fafb',
                    minHeight: 40
                  }}>
                    R$ {((novaComissao.valorComissaoCorretor || 0) - (recebimentos.reduce((acc, r) => acc + r.valor, 0) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {isMetaForm 
              ? "Definir Meta" 
              : comissaoParaEditar ? "Atualizar Comissão" : "Adicionar Comissão"}
          </Button>
        </DialogFooter>
      </DialogContent>
      {/* Modal de confirmação de exclusão de recebimento */}
      <AlertDialog open={!!recebimentoParaExcluir} onOpenChange={() => setRecebimentoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este recebimento?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!recebimentoParaExcluir) return;
                const { error } = await supabase
                  .from('comissao_recebimentos' as any)
                  .delete()
                  .eq('comissao_id', comissaoParaEditar.id)
                  .eq('valor', recebimentoParaExcluir.valor)
                  .eq('data', recebimentoParaExcluir.data);
                if (!error) {
                  const lista = await getRecebimentosByComissaoId(comissaoParaEditar.id);
                  setRecebimentos(lista.map((r: any) => ({ valor: r.valor, data: r.data })));
                  toast({
                    title: 'Recebimento excluído',
                    description: 'O recebimento foi removido com sucesso.'
                  });
                } else {
                  toast({
                    title: 'Erro ao excluir recebimento',
                    description: 'Não foi possível remover o recebimento. Tente novamente.',
                    variant: 'destructive'
                  });
                }
                setRecebimentoParaExcluir(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default ComissaoForm;
