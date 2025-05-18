import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useClientes } from "@/hooks/useClientes";
import { useVendasContext } from "@/hooks/VendasProvider";

const tiposImoveis = [
  "Apartamento",
  "Casa",
  "Terreno",
  "Prédio",
  "Comercial",
  "Outro"
];

const NovaVenda = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { clientes } = useClientes();
  const { adicionarVenda, formatarMoeda } = useVendasContext();
  
  // Extrair o ID do cliente da URL, se existir
  const queryParams = new URLSearchParams(location.search);
  const clienteIdFromUrl = queryParams.get('cliente');
  const clienteFromUrl = clienteIdFromUrl ? clientes.find(c => c.id === clienteIdFromUrl) : null;
  
  const [formData, setFormData] = useState({
    clienteId: clienteIdFromUrl || "",
    tipoImovel: "",
    outroTipoImovel: "",
    endereco: "",
    valor: "",
    dataVenda: new Date().toISOString().substring(0, 10),
    comissaoImobiliaria: "",
    comissaoCorretor: "",
    observacoes: ""
  });
  
  // Salvar o cliente original para poder voltar à página dele após salvar
  const [clienteOriginalId, setClienteOriginalId] = useState(clienteIdFromUrl);
  
  // Se o clienteId mudar na URL, atualizar o formData
  useEffect(() => {
    if (clienteIdFromUrl) {
      setFormData(prev => ({ ...prev, clienteId: clienteIdFromUrl }));
      setClienteOriginalId(clienteIdFromUrl);
    }
  }, [clienteIdFromUrl]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.clienteId || !formData.tipoImovel || !formData.endereco || !formData.valor) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }
    
    // Converter valor para número
    const valorNumerico = parseFloat(formData.valor.replace(/[^0-9,]/g, '').replace(',', '.'));
    
    const clienteSelecionado = clientes.find(c => c.id === formData.clienteId);
    if (!clienteSelecionado) {
      toast({
        variant: "destructive",
        title: "Cliente não encontrado",
        description: "O cliente selecionado não foi encontrado."
      });
      return;
    }
    
    const dataVendaString = formData.dataVenda;
    
    const novaVenda = {
      clienteId: formData.clienteId,
      tipoImovel: formData.tipoImovel === 'Outro' ? formData.outroTipoImovel : formData.tipoImovel,
      endereco: formData.endereco,
      valor: valorNumerico,
      dataVenda: dataVendaString,
      comissao_imobiliaria: formData.comissaoImobiliaria ? parseFloat(formData.comissaoImobiliaria.replace(/[^0-9,]/g, '').replace(',', '.')) : undefined,
      comissao_corretor: formData.comissaoCorretor ? parseFloat(formData.comissaoCorretor.replace(/[^0-9,]/g, '').replace(',', '.')) : undefined,
      observacoes: formData.observacoes
    };
    
    const vendaAdicionada = await adicionarVenda(novaVenda, clienteSelecionado.nome);
    
    if (vendaAdicionada) {
      toast({
        title: "Venda registrada!",
        description: "A nova venda foi registrada com sucesso.",
        variant: "success"
      });
      
      // Se veio de um cliente específico, voltar para ele
      if (clienteOriginalId) {
        navigate(`/clientes/${clienteOriginalId}`);
      } else {
        navigate("/vendas");
      }
    }
  };
  
  // Formatar valor para exibição ao digitar
  const formatarValorInput = (valor: string): string => {
    // Remove caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, "");
    
    if (!apenasNumeros) return "";
    
    // Converte para número e formata
    const numero = parseFloat(apenasNumeros) / 100;
    return formatarMoeda(numero).replace("R$", "").trim();
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
          <p className="text-slate-500">Registre uma nova venda de imóvel.</p>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Dados do cliente */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente <span className="text-red-500">*</span></Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("clienteId", value)}
                    value={formData.clienteId}
                    disabled={!!clienteIdFromUrl} // Desabilitar se um cliente já estiver pré-selecionado
                  >
                    <SelectTrigger id="clienteId">
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
                  {clienteFromUrl && (
                    <p className="text-xs text-slate-500">Cliente pré-selecionado: {clienteFromUrl.nome}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipoImovel">Tipo de Imóvel <span className="text-red-500">*</span></Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("tipoImovel", value)}
                    value={formData.tipoImovel}
                  >
                    <SelectTrigger id="tipoImovel">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposImoveis.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.tipoImovel === 'Outro' && (
                    <Input
                      id="outroTipoImovel"
                      name="outroTipoImovel"
                      placeholder="Descreva o tipo de imóvel"
                      value={formData.outroTipoImovel}
                      onChange={handleChange}
                      required
                      className="mt-2"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço do Imóvel <span className="text-red-500">*</span></Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    placeholder="Ex: Rua das Flores, 123, Bairro"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Dados da venda */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor da Venda (R$) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R$</span>
                    <Input
                      id="valor"
                      name="valor"
                      className="pl-10"
                      placeholder="Ex: 450.000,00"
                      value={formData.valor}
                      onChange={(e) => {
                        const valorFormatado = formatarValorInput(e.target.value);
                        setFormData(prev => ({ ...prev, valor: valorFormatado }));
                      }}
                      required
                    />
                  </div>
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
                
                <div className="space-y-2">
                  <Label htmlFor="comissaoImobiliaria">Comissão da Imobiliária (R$)</Label>
                  <Input
                    id="comissaoImobiliaria"
                    name="comissaoImobiliaria"
                    placeholder="Ex: 10.000,00"
                    value={formData.comissaoImobiliaria}
                    onChange={handleChange}
                    className="pl-2"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comissaoCorretor">Comissão do Corretor (R$)</Label>
                  <Input
                    id="comissaoCorretor"
                    name="comissaoCorretor"
                    placeholder="Ex: 4.500,00"
                    value={formData.comissaoCorretor}
                    onChange={handleChange}
                    className="pl-2"
                    type="text"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    placeholder="Detalhes sobre a negociação, condições especiais, etc."
                    rows={5}
                    value={formData.observacoes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-slate-50 p-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => {
                if (clienteOriginalId) {
                  navigate(`/clientes/${clienteOriginalId}`);
                } else {
                  navigate("/vendas");
                }
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Registrar Venda
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NovaVenda;
