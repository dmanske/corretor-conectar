import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useClientes } from "@/hooks/useClientes";
import { useVendas } from "@/hooks/useVendas";

const tiposImoveis = [
  "Apartamento",
  "Casa",
  "Terreno",
  "Prédio",
  "Comercial",
  "Outro"
];

const VendaEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clientes } = useClientes();
  const { getVendaById, formatarMoeda } = useVendas();
  const [venda, setVenda] = useState(null);
  
  const [formData, setFormData] = useState({
    clienteId: "",
    tipoImovel: "",
    endereco: "",
    valor: "",
    dataVenda: "",
    comissaoImobiliaria: "",
    comissaoCorretor: "",
    observacoes: ""
  });
  
  useEffect(() => {
    if (id) {
      const vendaEncontrada = getVendaById(id);
      if (vendaEncontrada) {
        setVenda(vendaEncontrada);
        setFormData({
          clienteId: vendaEncontrada.clienteId,
          tipoImovel: vendaEncontrada.tipoImovel,
          endereco: vendaEncontrada.endereco,
          valor: formatarValorInput(vendaEncontrada.valor),
          dataVenda: vendaEncontrada.dataVenda,
          comissaoImobiliaria: vendaEncontrada.comissao_imobiliaria ? formatarValorInput(vendaEncontrada.comissao_imobiliaria) : "",
          comissaoCorretor: vendaEncontrada.comissao_corretor ? formatarValorInput(vendaEncontrada.comissao_corretor) : "",
          observacoes: vendaEncontrada.observacoes || ""
        });
      } else {
        toast({
          variant: "destructive",
          title: "Venda não encontrada",
          description: "A venda que você está tentando editar não foi encontrada."
        });
        navigate("/vendas");
      }
    }
  }, [id, getVendaById, navigate, toast]);
  
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
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de vendas será implementada em breve."
    });
    navigate(`/vendas/${id}`);
  };
  
  // Formatar valor para exibição ao digitar
  const formatarValorInput = (valor: string | number): string => {
    if (typeof valor === "number") {
      return formatarMoeda(valor).replace("R$", "").trim();
    }
    
    // Remove caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, "");
    
    if (!apenasNumeros) return "";
    
    // Converte para número e formata
    const numero = parseFloat(apenasNumeros) / 100;
    return formatarMoeda(numero).replace("R$", "").trim();
  };
  
  if (!venda) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Venda</h2>
          <p className="text-slate-500">Atualize os detalhes da venda.</p>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Dados do cliente */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente</Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) => handleSelectChange("clienteId", value)}
                    disabled={true} // Cliente não pode ser alterado
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
                  <p className="text-xs text-slate-500">O cliente não pode ser alterado.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipoImovel">Tipo de Imóvel</Label>
                  <Select
                    value={formData.tipoImovel}
                    onValueChange={(value) => handleSelectChange("tipoImovel", value)}
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço do Imóvel</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Dados da venda */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor da Venda (R$)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R$</span>
                    <Input
                      id="valor"
                      name="valor"
                      className="pl-10"
                      value={formData.valor}
                      onChange={(e) => {
                        const valorFormatado = formatarValorInput(e.target.value);
                        setFormData(prev => ({ ...prev, valor: valorFormatado }));
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataVenda">Data da Venda</Label>
                  <Input
                    id="dataVenda"
                    name="dataVenda"
                    type="date"
                    value={formData.dataVenda}
                    onChange={handleChange}
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
                    rows={5}
                    value={formData.observacoes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-slate-50 p-4">
            <Button variant="outline" type="button" onClick={() => navigate(`/app/vendas/${id}`)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default VendaEditar;
