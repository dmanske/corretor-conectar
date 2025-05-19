import React, { useState } from "react";
import { useComissoes, type ComissaoStatus } from "../hooks/useComissoes";
import { useVendas } from "../hooks/useVendas";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Comissao } from "@/hooks/useComissoes";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { formatarMoeda } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Comissoes = () => {
  const { comissoes, adicionarComissao, atualizarComissao } = useComissoes();
  const { vendas } = useVendas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedComissao, setSelectedComissao] = useState<Comissao | null>(null);
  const { toast: useToastToast } = useToast();
  const [formData, setFormData] = useState({
    vendaId: "",
    cliente: "",
    imovel: "",
    valorVenda: "",
    valorComissaoImobiliaria: "",
    valorComissaoCorretor: "",
    dataContrato: "",
    status: "Pendente" as ComissaoStatus
  });
  const [showJustifyModal, setShowJustifyModal] = useState(false);
  const [justificativa, setJustificativa] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vendaId) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar comissão",
        description: "Selecione uma venda para cadastrar a comissão."
      });
      return;
    }

    const venda = vendas.find(v => v.id === formData.vendaId);
    if (!venda) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar comissão",
        description: "Venda não encontrada."
      });
      return;
    }

    const novaComissao = {
      vendaId: formData.vendaId,
      cliente: venda.clienteNome || "",
      imovel: `${venda.tipoImovel} - ${venda.endereco || venda.enderecoImovel || ""}`,
      valorVenda: Number(formData.valorVenda),
      valorComissaoImobiliaria: Number(formData.valorComissaoImobiliaria),
      valorComissaoCorretor: Number(formData.valorComissaoCorretor),
      dataContrato: formData.dataContrato,
      dataVenda: venda.dataVenda, // Adicionando campo obrigatório
      dataPagamento: null, // Adicionando campo obrigatório
      status: formData.status
    };

    await adicionarComissao(novaComissao);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      vendaId: "",
      cliente: "",
      imovel: "",
      valorVenda: "",
      valorComissaoImobiliaria: "",
      valorComissaoCorretor: "",
      dataContrato: "",
      status: "Pendente"
    });
  };

  const handleVendaChange = (vendaId: string) => {
    const venda = vendas.find(v => v.id === vendaId);
    if (venda) {
      setFormData(prev => ({
        ...prev,
        vendaId,
        cliente: venda.clienteNome || "",
        imovel: `${venda.tipoImovel} - ${venda.endereco || venda.enderecoImovel || ""}`,
        valorVenda: venda.valor.toString(),
        dataContrato: venda.dataVenda
      }));
    }
  };

  const handleJustificar = async () => {
    if (!selectedComissao || !justificativa) return;

    try {
      await atualizarComissao(selectedComissao.id, {
        statusValor: "Justificado",
        justificativa
      });

      setShowJustifyModal(false);
      setJustificativa("");
      setSelectedComissao(null);

      useToastToast({
        title: "Sucesso",
        description: "Justificativa registrada com sucesso"
      });
    } catch (error) {
      useToastToast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao registrar justificativa"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Comissões</h2>
          <p className="text-slate-500">Gerencie as comissões dos corretores.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Comissão
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comissoes.map((comissao) => (
          <Card key={comissao.id} className={`${comissao.statusValor === "Desatualizado" ? "border-red-500" : ""} ${comissao.valorComissaoImobiliaria === 0 && comissao.valorComissaoCorretor === 0 ? "border-yellow-500" : ""}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{comissao.cliente}</h3>
                  <p className="text-sm text-slate-500">{comissao.imovel}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={comissao.status === "Recebido" ? "default" : "secondary"}>
                    {comissao.status}
                  </Badge>
                  {comissao.valorComissaoImobiliaria === 0 && comissao.valorComissaoCorretor === 0 && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Pendente Preenchimento
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Valor da Venda:</span>
                  <span className="font-medium">{formatarMoeda(comissao.valorVenda)}</span>
                </div>

                {comissao.statusValor === "Desatualizado" && (
                  <div className="bg-red-50 p-2 rounded-md text-sm text-red-600">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Valor da venda foi alterado</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Valor Original:</span>
                        <span>{formatarMoeda(comissao.valorOriginalVenda || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor Atual:</span>
                        <span>{formatarMoeda(comissao.valorAtualVenda || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diferença:</span>
                        <span className={(comissao.diferencaValor || 0) > 0 ? "text-green-600" : "text-red-600"}>
                          {formatarMoeda(comissao.diferencaValor || 0)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => {
                        setSelectedComissao(comissao);
                        setShowJustifyModal(true);
                      }}
                    >
                      Justificar Alteração
                    </Button>
                  </div>
                )}

                {comissao.statusValor === "Justificado" && comissao.justificativa && (
                  <div className="bg-slate-50 p-2 rounded-md text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Alteração Justificada</span>
                    </div>
                    <p className="text-slate-600">{comissao.justificativa}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Comissão Imobiliária:</span>
                  <span className="font-medium">{formatarMoeda(comissao.valorComissaoImobiliaria)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Comissão Corretor:</span>
                  <span className="font-medium">{formatarMoeda(comissao.valorComissaoCorretor)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Data do Contrato:</span>
                  <span>{new Date(comissao.dataContrato).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Comissão</DialogTitle>
            <DialogDescription>
              Cadastre uma nova comissão para uma venda existente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="venda">Venda</Label>
              <Select
                value={formData.vendaId}
                onValueChange={handleVendaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma venda" />
                </SelectTrigger>
                <SelectContent>
                  {vendas.map((venda) => (
                    <SelectItem key={venda.id} value={venda.id}>
                      {venda.clienteNome || "Cliente desconhecido"} - {venda.tipoImovel} - {formatarMoeda(venda.valor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorComissaoImobiliaria">Comissão Imobiliária</Label>
              <Input
                id="valorComissaoImobiliaria"
                type="number"
                value={formData.valorComissaoImobiliaria}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    valorComissaoImobiliaria: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorComissaoCorretor">Comissão Corretor</Label>
              <Input
                id="valorComissaoCorretor"
                type="number"
                value={formData.valorComissaoCorretor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    valorComissaoCorretor: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ComissaoStatus) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Parcial">Parcial</SelectItem>
                  <SelectItem value="Recebido">Recebido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="submit">Cadastrar Comissão</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showJustifyModal} onOpenChange={setShowJustifyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justificar Alteração de Valor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Detalhes da Alteração</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Valor Original:</span>
                  <span>{formatarMoeda(selectedComissao?.valorOriginalVenda || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Atual:</span>
                  <span>{formatarMoeda(selectedComissao?.valorAtualVenda || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Diferença:</span>
                  <span className={(selectedComissao?.diferencaValor || 0) > 0 ? "text-green-600" : "text-red-600"}>
                    {formatarMoeda(selectedComissao?.diferencaValor || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="justificativa">Justificativa</Label>
              <Textarea
                id="justificativa"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Explique o motivo da alteração no valor da venda..."
                required
              />
            </div>

            <DialogFooter>
              <Button onClick={handleJustificar}>Registrar Justificativa</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comissoes;
