import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useVendas } from "@/hooks/useVendas";
import { useClientes } from "@/hooks/useClientes";
import { Cliente } from "@/types";

// Tipos para as props dos componentes Input e Textarea
interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  maxLength?: number;
}

interface TextareaProps {
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  maxLength?: number;
}

const Input = ({ label, type = "text", placeholder, className = "", required = false, value, onChange, name, disabled, maxLength }: InputProps) => (
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
      disabled={disabled}
      maxLength={maxLength}
    />
  </div>
);

const Textarea = ({ label, placeholder, className = "", value, onChange, name, maxLength }: TextareaProps) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      placeholder={placeholder}
      rows={4}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      value={value}
      onChange={onChange}
      name={name}
      maxLength={maxLength}
    />
  </div>
);

export default function NovaVenda() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { adicionarVenda } = useVendas();
  const { clientes } = useClientes();

  const [formData, setFormData] = useState({
    clienteId: "",
    tipoImovel: "Apartamento",
    outroTipo: "",
    endereco: "",
    valor: "",
    dataVenda: new Date().toISOString().slice(0, 10),
    observacoes: "",
    notaFiscal: ""
  });

  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [clienteFixo, setClienteFixo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Preenche o clienteId da URL se existir
    const params = new URLSearchParams(location.search);
    const clienteId = params.get("cliente");
    if (clienteId) {
      setFormData(prev => ({ ...prev, clienteId }));
      const cliente = clientes.find(c => c.id === clienteId);
      if (cliente) {
        setClienteSelecionado(cliente);
        setClienteFixo(true);
      }
    }
  }, [clientes, location.search]);

  // Máscara para valor monetário
  function maskValor(value: string): string {
    let v = value.replace(/\D/g, "");
    v = (parseInt(v, 10) || 0).toString();
    if (v.length === 0) return "";
    if (v.length === 1) return "0,0" + v;
    if (v.length === 2) return "0," + v;
    return v.replace(/(\d+)(\d{2})$/, "$1,$2").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "valor") {
      newValue = maskValor(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Handler para tipo de imóvel (select ou input)
  const handleTipoImovelChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tipoImovel: value,
      outroTipo: value === "Outros" ? prev.outroTipo : ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.clienteId || !formData.tipoImovel || !formData.endereco || !formData.valor || !formData.dataVenda) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios."
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const tipoImovelFinal = formData.tipoImovel === "Outros" ? formData.outroTipo : formData.tipoImovel;
      const resultado = await adicionarVenda({
        clienteId: formData.clienteId,
        tipoImovel: tipoImovelFinal,
        endereco: formData.endereco,
        enderecoImovel: formData.endereco,
        valor: parseFloat(formData.valor.replace(/\D/g, "")) / 100,
        dataVenda: formData.dataVenda,
        comissao_imobiliaria: 0,
        comissao_corretor: 0,
        observacoes: formData.observacoes,
        comissao: 0,
        corretor: "",
        notaFiscal: formData.notaFiscal
      }, clienteSelecionado?.nome || "");
      if (resultado) {
        toast({
          title: "Venda cadastrada!",
          description: "A nova venda foi cadastrada com sucesso."
        });
        navigate("/app/vendas");
      } else {
        throw new Error("Falha ao cadastrar venda");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar a venda. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoltar = () => {
    if (clienteFixo && clienteSelecionado) {
      navigate(`/app/clientes/${formData.clienteId}`);
    } else if (location.state && location.state.fromVendas) {
      navigate('/app/vendas');
    } else {
      navigate('/app/clientes');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Adicione uma nova venda ao sistema
        </h1>
        <div className="h-1 w-20 bg-blue-500 rounded"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente fixo ou select */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">Cliente *</label>
              {clienteFixo && clienteSelecionado ? (
                <>
                  <Input value={clienteSelecionado.nome} disabled />
                  <p className="text-xs text-blue-600 mt-1">Cliente fixo selecionado da página de detalhes.</p>
                </>
              ) : (
                <select
                  name="clienteId"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  value={formData.clienteId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Tipo de Imóvel com campo de texto se "Outros" */}
            <div>
              <label className="text-sm font-medium text-gray-700">Tipo de Imóvel *</label>
              <select
                name="tipoImovel"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={formData.tipoImovel}
                onChange={e => handleTipoImovelChange(e.target.value)}
                required
              >
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Terreno">Terreno</option>
                <option value="Sala Comercial">Sala Comercial</option>
                <option value="Galpão">Galpão</option>
                <option value="Outros">Outros...</option>
              </select>
              {formData.tipoImovel === "Outros" && (
                <Input
                  className="mt-2"
                  maxLength={30}
                  placeholder="Descreva o tipo de imóvel"
                  name="outroTipo"
                  value={formData.outroTipo}
                  onChange={handleChange}
                  required
                />
              )}
            </div>

            {/* Nome do Imóvel */}
            <Input
              label="Nome do Imóvel"
              placeholder="Ex: Residencial Flores"
              required
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
            />

            {/* Valor da Venda */}
            <Input
              label="Valor da Venda (R$)"
              type="text"
              placeholder="Ex: 125.000,00"
              required
              name="valor"
              value={formData.valor}
              onChange={handleChange}
            />

            {/* Nota Fiscal */}
            <Input
              label="Nota Fiscal"
              placeholder="Número da nota fiscal"
              name="notaFiscal"
              value={formData.notaFiscal}
              onChange={handleChange}
            />

            {/* Data da Venda */}
            <Input
              label="Data da Venda"
              type="date"
              required
              name="dataVenda"
              value={formData.dataVenda}
              onChange={handleChange}
            />

            {/* Observações */}
            <Textarea
              label="Observações"
              placeholder="Adicione observações relevantes sobre a venda"
              className="col-span-2"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              maxLength={500}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              onClick={handleVoltar}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Venda'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
