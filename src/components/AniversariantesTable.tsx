import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "./WhatsAppButton";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, LayoutGrid, Table } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { ClientCard } from "./ClientCard";

function getInitials(nome: string) {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function formatarData(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  if (!ano || !mes || !dia) return data;
  return `${dia}/${mes}`;
}

function formatarMes(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  if (!ano || !mes || !dia) return data;
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return meses[parseInt(mes, 10) - 1];
}

function getStatusTag(diasAte: number) {
  if (diasAte === 0) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800 shadow">Hoje!</span>;
  if (diasAte === 1) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-200 text-blue-800 shadow">Amanhã</span>;
  if (diasAte <= 7) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800 shadow">Em {diasAte} dias</span>;
  return null;
}

function formatarDataCurta(data: string) {
  if (!data || data === "-") return "-";
  try {
    const d = isValid(new Date(data)) ? new Date(data) : parseISO(data);
    if (!isValid(d)) return data;
    return format(d, "dd/MM/yyyy");
  } catch {
    return data;
  }
}

export interface AniversarianteTable {
  id: string;
  nome: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  diasAte: number;
  clienteDesde?: string;
  ultimaCompra?: string;
}

interface AniversariantesTableProps {
  aniversariantes: AniversarianteTable[];
  loading?: boolean;
  onSearch?: (q: string) => void;
  searchPlaceholder?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  defaultViewMode?: 'cards' | 'list';
}

const AniversariantesTable: React.FC<AniversariantesTableProps> = ({
  aniversariantes,
  loading,
  onSearch,
  searchPlaceholder = "Buscar por nome, email ou telefone...",
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  defaultViewMode = 'cards',
}) => {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<AniversarianteTable | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [viewMode, setViewMode] = useState<'cards' | 'list'>(defaultViewMode === 'cards' ? 'cards' : 'list');

  const filtered = useMemo(() => {
    if (!search) return aniversariantes;
    const q = search.toLowerCase();
    return aniversariantes.filter(a =>
      a.nome.toLowerCase().includes(q) ||
      (a.email && a.email.toLowerCase().includes(q)) ||
      (a.telefone && a.telefone.includes(q))
    );
  }, [aniversariantes, search]);

  const paginated = useMemo(() => {
    if (!filtered) return [];
    if (!pageSize) return filtered;
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = total ? Math.ceil(total / pageSize) : Math.ceil(filtered.length / pageSize);

  const handleEnviarEmail = async () => {
    if (!selectedClient || !customMessage.trim()) return;
    // Aqui você pode integrar com seu backend ou serviço de e-mail
    // Exemplo fictício:
    try {
      // await sendEmail(selectedClient.email, customMessage);
      alert(`E-mail enviado para ${selectedClient.email}!`);
      setCustomMessage("");
      setSelectedClient(null);
    } catch (e) {
      alert("Erro ao enviar e-mail. Tente novamente.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-0 md:p-4">
      {/* Barra de busca */}
      <div className="mb-2 flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            className="pl-10"
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              onSearch && onSearch(e.target.value);
            }}
          />
        </div>
        <div className="ml-4 flex gap-2">
          <button
            className={`p-2 rounded ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setViewMode('cards')}
            title="Visualizar em cards"
          >
            <span className="material-icons">Grade</span>
          </button>
          <button
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setViewMode('list')}
            title="Visualizar em lista"
          >
            <span className="material-icons">Lista</span>
          </button>
        </div>
      </div>

      {/* Visualização condicional */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-0 items-start w-full max-w-3xl">
          {paginated.map((aniversariante) => {
            // Extrair dia e mês
            let dia = '-';
            let mes = '-';
            if (aniversariante.dataNascimento) {
              const partes = aniversariante.dataNascimento.split('-');
              if (partes.length === 3) {
                dia = partes[2];
                const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                mes = meses[parseInt(partes[1], 10) - 1];
              }
            }
            return (
              <div key={aniversariante.id} className="bg-white rounded-2xl shadow-2xl p-5 flex flex-col gap-4 items-center relative border border-gray-100 min-h-[160px] w-full transition-all">
                {/* Selo Hoje! */}
                {aniversariante.diasAte === 0 && (
                  <span className="absolute top-4 right-4 bg-green-500 text-white px-5 py-1.5 rounded-b-xl text-base font-semibold shadow-lg z-10">Hoje!</span>
                )}
                {/* Avatar e nome */}
                <div className="flex flex-col items-center w-full gap-1">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow mb-1">
                    {getInitials(aniversariante.nome)}
                  </div>
                  <div className="text-xl font-extrabold text-gray-900 text-center leading-tight">{aniversariante.nome}</div>
                  <div className="flex flex-col gap-0.5 mt-1 text-base text-gray-500 font-medium items-center">
                    <span className="flex items-center gap-1"><span className="text-base">📅</span> Cliente desde: {formatarDataCurta(aniversariante.clienteDesde)}</span>
                    <span className="flex items-center gap-1"><span className="text-base">💳</span> Última compra: {formatarDataCurta(aniversariante.ultimaCompra)}</span>
                  </div>
                </div>
                {/* Data e status */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-blue-700 leading-none">{dia}</span>
                  <span className="text-lg text-gray-700 font-semibold">{mes}</span>
                  {aniversariante.diasAte === 0 && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-base font-semibold ml-1">Hoje!</span>
                  )}
                </div>
                {/* Botão WhatsApp */}
                <div className="mt-2 w-full flex justify-center">
                  <button
                    onClick={() => window.open(`https://wa.me/55${aniversariante.telefone.replace(/\D/g, '')}`)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-medium px-6 py-2 rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <span className="text-2xl">📱</span> WhatsApp
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 bg-white rounded-xl shadow-md mt-2">
          {paginated.map((aniversariante) => {
            let dia = '-';
            let mes = '-';
            if (aniversariante.dataNascimento) {
              const partes = aniversariante.dataNascimento.split('-');
              if (partes.length === 3) {
                dia = partes[2];
                const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                mes = meses[parseInt(partes[1], 10) - 1];
              }
            }
            return (
              <div key={aniversariante.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  {getInitials(aniversariante.nome)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-900 truncate">{aniversariante.nome}</span>
                    {aniversariante.diasAte === 0 && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold ml-2">Hoje!</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex gap-2 flex-wrap">
                    <span className="flex items-center gap-1"><span className="text-base">📅</span> {formatarDataCurta(aniversariante.clienteDesde)}</span>
                    <span className="flex items-center gap-1"><span className="text-base">💳</span> {formatarDataCurta(aniversariante.ultimaCompra)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-extrabold text-blue-700">{dia}</span>
                    <span className="text-base text-gray-700 font-semibold">{mes}</span>
                  </div>
                  <button
                    onClick={() => window.open(`https://wa.me/55${aniversariante.telefone.replace(/\D/g, '')}`)}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-base font-medium px-4 py-1 rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-green-400 mt-1"
                  >
                    <span className="text-xl">📱</span> WhatsApp
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={i + 1 === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange && onPageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AniversariantesTable; 