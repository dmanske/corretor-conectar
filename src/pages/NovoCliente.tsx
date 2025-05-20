import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useClientes } from "@/hooks/useClientes";
import axios from "axios";

const NovoCliente = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adicionarCliente } = useClientes();
  
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    complemento: "",
    numero: "", // Added the numero field
    telefone: "",
    cidade: "",
    estado: "",
    cep: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    observacoes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Máscaras
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
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "telefone") maskedValue = maskTelefone(value);
    if (name === "cpf") maskedValue = maskCPF(value);
    if (name === "cep") maskedValue = maskCEP(value);
    setFormData(prev => ({
      ...prev,
      [name]: maskedValue
    }));
    // Busca por CEP
    if (name === "cep" && maskedValue.length === 9) {
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${maskedValue.replace(/\D/g, "")}/json/`);
        if (!res.data.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: res.data.logradouro || prev.endereco,
            cidade: res.data.localidade || prev.cidade,
            estado: res.data.uf || prev.estado
          }));
        }
      } catch {}
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.nome || !formData.email || !formData.telefone || !formData.cpf || !formData.dataNascimento) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Nome, e-mail, telefone, CPF e data de nascimento são obrigatórios."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Chamar a função adicionarCliente do hook useClientes
      const resultado = await adicionarCliente(formData);
      
      if (resultado) {
        toast({
          title: "Cliente cadastrado!",
          description: "O novo cliente foi cadastrado com sucesso."
        });
        navigate("/app/clientes");
      } else {
        throw new Error("Falha ao cadastrar cliente");
      }
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      // Log detalhado para ajudar a depurar
      if (error.response) {
        console.error("Resposta do servidor:", error.response.data);
        console.error("Status:", error.response.status);
      } else if (error.request) {
        console.error("Sem resposta recebida:", error.request);
      } else {
        console.error("Erro ao configurar requisição:", error.message);
      }
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar o cliente. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/clientes")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Novo Cliente</h2>
          <p className="text-slate-500">Adicione um novo cliente ao sistema.</p>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Dados básicos */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo <span className="text-red-500">*</span></Label>
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="Ex: João Silva"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ex: joao@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone <span className="text-red-500">*</span></Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    placeholder="Ex: (11) 9 9999-9999"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF <span className="text-red-500">*</span></Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    placeholder="Ex: 123.456.789-00"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento <span className="text-red-500">*</span></Label>
                  <Input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Endereço */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    placeholder="Ex: Rua das Flores, 123"
                    value={formData.endereco}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    name="complemento"
                    placeholder="Ex: Apto 101"
                    value={formData.complemento}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      placeholder="Ex: São Paulo"
                      value={formData.cidade}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      name="estado"
                      placeholder="Ex: SP"
                      value={formData.estado}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    name="cep"
                    placeholder="Ex: 12345-678"
                    value={formData.cep}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    placeholder="Adicione observações relevantes sobre o cliente"
                    rows={5}
                    value={formData.observacoes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-slate-50 p-4">
            <Button variant="outline" type="button" onClick={() => navigate("/app/clientes")} disabled={isSubmitting}>
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
                  Salvar Cliente
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NovoCliente;
