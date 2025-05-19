
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, X, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useVendas } from "@/hooks/useVendas";
import { useClientes } from "@/hooks/useClientes";
import { formatarMoeda } from "@/lib/utils";

const NovaVenda = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adicionarVenda } = useVendas();
  const { clientes } = useClientes();
  
  const [formData, setFormData] = useState({
    clienteId: "",
    tipoImovel: "Apartamento",
    endereco: "",
    valor: "0,00",
    dataVenda: new Date().toISOString().slice(0, 10),
    comissaoImobiliaria: "0",
    comissaoCorretor: "0",
    observacoes: ""
  });
  
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Preenche o clienteId da URL se existir
    const params = new URLSearchParams(window.location.search);
    const clienteId = params.get("cliente");
    if (clienteId) {
      setFormData(prev => ({ ...prev, clienteId }));
      const cliente = clientes.find(c => c.id === clienteId);
      setClienteSelecionado(cliente);
    }
  }, [clientes]);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId || !formData.tipoImovel || !formData.endereco || !formData.valor || !formData.dataVenda) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios."
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Adjust the venda object to match the updated interface
      const resultado = await adicionarVenda({
        clienteId: formData.clienteId,
        tipoImovel: formData.tipoImovel,
        endereco: formData.endereco,
        enderecoImovel: formData.endereco, // Add enderecoImovel for backwards compatibility
        valor: parseFloat(formData.valor.replace(/\D/g, "")) / 100,
        dataVenda: formData.dataVenda,
        comissao_imobiliaria: parseFloat(formData.comissaoImobiliaria || "0"),
        comissao_corretor: parseFloat(formData.comissaoCorretor || "0"),
        observacoes: formData.observacoes,
        comissao: parseFloat(formData.comissaoImobiliaria || "0"), // For backwards compatibility
        corretor: "", // Add default value for compatibility
      }, clienteSelecionado?.nome || "");
      
      if (resultado) {
        toast({
          title: "Venda cadastrada!",
          description: "A nova venda foi cadastrada com sucesso."
        });
        navigate("/vendas");
      } else {
        throw new Error("Falha ao cadastrar venda");
      }
    } catch (error) {
      console.error("Erro ao cadastrar venda:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar a venda. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nova Venda</h2>
          <p className="text-slate-500">Adicione uma nova venda ao sistema.</p>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Dados básicos */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente <span className="text-red-500">*</span></Label>
                  <select
                    id="clienteId"
                    name="clienteId"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.clienteId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipoImovel">Tipo de Imóvel <span className="text-red-500">*</span></Label>
                  <select
                    id="tipoImovel"
                    name="tipoImovel"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.tipoImovel}
                    onChange={handleChange}
                    required
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Sala Comercial">Sala Comercial</option>
                    <option value="Galpão">Galpão</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço <span className="text-red-500">*</span></Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    placeholder="Ex: Rua das Flores, 123"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor da Venda (R$) <span className="text-red-500">*</span></Label>
                  <Input
                    id="valor"
                    name="valor"
                    placeholder="Ex: 1.200,00"
                    value={formData.valor}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataVenda">Data da Venda <span className="text-red-500">*</span></Label>
                  <Input
                    id="dataVenda"
                    name="dataVenda"
                    type="date"
                    value={formData.dataVenda}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Comissões e Observações */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comissaoImobiliaria">Comissão Imobiliária (R$)</Label>
                  <Input
                    id="comissaoImobiliaria"
                    name="comissaoImobiliaria"
                    placeholder="Ex: 15.000,00"
                    value={formData.comissaoImobiliaria}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comissaoCorretor">Comissão Corretor (R$)</Label>
                  <Input
                    id="comissaoCorretor"
                    name="comissaoCorretor"
                    placeholder="Ex: 7.500,00"
                    value={formData.comissaoCorretor}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    placeholder="Adicione observações relevantes sobre a venda"
                    rows={5}
                    value={formData.observacoes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-slate-50 p-4">
            <Button variant="outline" type="button" onClick={() => navigate("/vendas")} disabled={isSubmitting}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Venda
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NovaVenda;
