import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useClientes } from "@/hooks/useClientes";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Input = ({ label, type = "text", placeholder, className = "", required = false, value, onChange, name }) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required={required}
      value={value}
      onChange={onChange}
      name={name}
    />
  </div>
);

const Textarea = ({ label, placeholder, className = "", value, onChange, name }) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      placeholder={placeholder}
      rows={4}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      value={value}
      onChange={onChange}
      name={name}
    />
  </div>
);

export default function NovoCliente() {
  const navigate = useNavigate();
  const { adicionarCliente } = useClientes();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
    complemento: "",
    cep: "",
    cidade: "",
    estado: "",
    observacoes: ""
  });

  // Máscaras
  function maskTelefone(value) {
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
  function maskCPF(value) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  function maskCEP(value) {
    return value.replace(/\D/g, "").replace(/(\d{5})(\d{1,3})/, "$1-$2").slice(0, 9);
  }

  const handleChange = async (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="max-w-4xl p-6 bg-white border-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Adicione um novo cliente ao sistema
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nome Completo" 
              placeholder="Ex: João Silva"
              className="col-span-2" 
              required 
              name="nome"
              value={formData.nome}
              onChange={handleChange}
            />
            <Input 
              label="E-mail" 
              type="email"
              placeholder="Ex: joao@email.com"
              required 
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input 
              label="Telefone" 
              placeholder="Ex: (11) 9 9999-9999"
              required 
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
            <Input 
              label="CPF" 
              placeholder="Ex: 123.456.789-00"
              required 
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
            />
            <Input 
              label="Data de Nascimento" 
              type="date"
              required 
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
            />
            <Input 
              label="Endereço" 
              placeholder="Ex: Rua das Flores, 123"
              className="col-span-2" 
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
            />
            <Input 
              label="Complemento" 
              placeholder="Ex: Apto 101"
              name="complemento"
              value={formData.complemento}
              onChange={handleChange}
            />
            <Input 
              label="CEP" 
              placeholder="Ex: 12345-678"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
            />
            <Input 
              label="Cidade" 
              placeholder="Ex: São Paulo"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
            />
            <Input 
              label="Estado" 
              placeholder="Ex: SP"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            />
            <Textarea 
              label="Observações" 
              placeholder="Adicione observações relevantes sobre o cliente"
              className="col-span-2" 
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/app/clientes')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
