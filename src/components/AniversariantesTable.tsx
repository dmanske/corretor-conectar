import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "./WhatsAppButton";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, LayoutGrid, Table } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

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
  defaultViewMode?: 'table' | 'cards';
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
  defaultViewMode = 'table',
}) => {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<AniversarianteTable | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(defaultViewMode);

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
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-0 md:p-4">
      {/* Barra de busca */}
      <div className="mb-4">
        <div className="relative">
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
      </div>

      {/* Botão de alternância de visualização */}
      <div className="flex justify-end mb-2">
        <button
          className={`mr-2 p-2 rounded ${viewMode === 'table' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setViewMode('table')}
          title="Visualizar em tabela"
        >
          <Table className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setViewMode('cards')}
          title="Visualizar em cards"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>

      {/* Renderização condicional */}
      {viewMode === 'table' ? (
        <div className="rounded-lg overflow-hidden border border-gray-100">
          {/* Cabeçalho */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
            <div className="col-span-2">Data</div>
            <div className="col-span-5">Cliente</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Ações</div>
          </div>

          {/* Lista */}
          {loading ? (
            <div className="py-8 text-center text-gray-500">Carregando...</div>
          ) : paginated.length === 0 ? (
            <div className="py-8 text-center text-gray-500">Nenhum aniversariante encontrado.</div>
          ) : (
            <div className="divide-y">
              {paginated.map(aniversariante => (
                <div key={aniversariante.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-3 md:px-6 py-4 hover:bg-gray-50 border-b last:border-b-0 items-center">
                  {/* Data */}
                  <div className="col-span-2 flex items-center">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{aniversariante.dataNascimento ? aniversariante.dataNascimento.split("-")[2] : "-"}</div>
                      <div className="text-sm text-gray-500">{formatarMes(aniversariante.dataNascimento)}</div>
                    </div>
                  </div>

                  {/* Cliente */}
                  <div className="col-span-5 flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {getInitials(aniversariante.nome)}
                    </div>
                    <div>
                      <div className="font-bold">{aniversariante.nome}</div>
                      <div className="text-sm text-gray-500">
                        <span>• Cliente desde: {formatarDataCurta(aniversariante.clienteDesde)}</span><br />
                        <span>• Última compra: {formatarDataCurta(aniversariante.ultimaCompra)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    {getStatusTag(aniversariante.diasAte)}
                  </div>

                  {/* Ações */}
                  <div className="col-span-3 flex items-center space-x-2 justify-end md:justify-start">
                    <WhatsAppButton
                      telefone={aniversariante.telefone}
                      mensagem={`Olá ${aniversariante.nome}, feliz aniversário! 🎉`}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginated.map((aniversariante, idx) => (
            <div
              key={aniversariante.id}
              className={`rounded-2xl shadow-lg p-5 flex flex-col gap-3 border border-gray-100 hover:shadow-xl transition-all min-h-[180px] bg-gradient-to-br ${
                idx % 4 === 0 ? 'from-blue-100 via-blue-50 to-white' :
                idx % 4 === 1 ? 'from-green-100 via-green-50 to-white' :
                idx % 4 === 2 ? 'from-purple-100 via-purple-50 to-white' :
                'from-yellow-100 via-yellow-50 to-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {getInitials(aniversariante.nome)}
                </div>
                <div>
                  <div className="font-bold text-lg">{aniversariante.nome}</div>
                  <div className="text-sm text-gray-500">
                    <span>• Cliente desde: {formatarDataCurta(aniversariante.clienteDesde)}</span><br />
                    <span>• Última compra: {formatarDataCurta(aniversariante.ultimaCompra)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="text-2xl font-bold text-blue-600">{aniversariante.dataNascimento ? aniversariante.dataNascimento.split("-")[2] : "-"}</div>
                <div className="text-base text-gray-500">{formatarMes(aniversariante.dataNascimento)}</div>
                <div>{getStatusTag(aniversariante.diasAte)}</div>
              </div>
              <div className="flex gap-2 mt-2">
                <WhatsAppButton
                  telefone={aniversariante.telefone}
                  mensagem={`Olá ${aniversariante.nome}, feliz aniversário! 🎉`}
                  size="sm"
                />
              </div>
            </div>
          ))}
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