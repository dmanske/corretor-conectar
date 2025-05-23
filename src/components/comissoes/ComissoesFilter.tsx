import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ComissoesFilterProps {
  tab: string;
  onTabChange: (value: string) => void;
  filtro: string;
  onFiltroChange: (value: string) => void;
  periodo: string;
  onPeriodoChange: (value: string) => void;
  order?: string;
  onOrderChange?: (value: string) => void;
  showPeriodo?: boolean;
  groupByDay?: boolean;
  onGroupByDayChange?: (value: boolean) => void;
  onHojeClick?: () => void;
  dataInicial?: string;
  dataFinal?: string;
  onDataInicialChange?: (value: string) => void;
  onDataFinalChange?: (value: string) => void;
  minData?: string;
  maxData?: string;
  onLimparFiltros?: () => void;
}

const ComissoesFilter = ({
  tab,
  onTabChange,
  filtro,
  onFiltroChange,
  periodo,
  onPeriodoChange,
  order = 'az',
  onOrderChange,
  showPeriodo = true,
  groupByDay,
  onGroupByDayChange,
  onHojeClick,
  dataInicial,
  dataFinal,
  onDataInicialChange,
  onDataFinalChange,
  minData,
  maxData,
  onLimparFiltros
}: ComissoesFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <TabsList>
        <TabsTrigger value="todas" onClick={() => onTabChange("todas")}>Todas</TabsTrigger>
        <TabsTrigger value="pendentes" onClick={() => onTabChange("pendentes")}>Pendentes</TabsTrigger>
        <TabsTrigger value="recebidas" onClick={() => onTabChange("recebidas")}>Recebidas</TabsTrigger>
      </TabsList>
      
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-center">
        {/* Botão Hoje */}
        {onHojeClick && (
          <button
            className="px-3 py-1 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            onClick={onHojeClick}
            type="button"
          >
            Hoje
          </button>
        )}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, imóvel, valor, data, status, nota fiscal..."
            className="pl-8"
            value={filtro}
            onChange={(e) => onFiltroChange(e.target.value)}
          />
        </div>
        {/* Botão Limpar filtros */}
        {onLimparFiltros && (
          <button
            className="px-3 py-1 rounded bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition border border-slate-300"
            onClick={onLimparFiltros}
            type="button"
          >
            Limpar filtros
          </button>
        )}
        
        {/* Datas inicial e final */}
        {onDataInicialChange && (
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={dataInicial || ''}
            min={minData}
            max={maxData}
            onChange={e => onDataInicialChange(e.target.value)}
          />
        )}
        {onDataFinalChange && (
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={dataFinal || ''}
            min={minData}
            max={maxData}
            onChange={e => onDataFinalChange(e.target.value)}
          />
        )}
        
        {/* Seletor de agrupamento por dia só se for anual */}
        {onGroupByDayChange && groupByDay !== undefined && showPeriodo && (
          <Select value={groupByDay ? 'dia' : 'lista'} onValueChange={v => onGroupByDayChange(v === 'dia')}>
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder="Visualização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lista">Lista única</SelectItem>
              <SelectItem value="dia">Agrupar por dia</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {/* Seletor de período só se showPeriodo for true */}
        {showPeriodo && (
          <Select value={periodo} onValueChange={onPeriodoChange}>
            <SelectTrigger className="w-full md:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="mes">Este mês</SelectItem>
              <SelectItem value="trimestre">Este trimestre</SelectItem>
              <SelectItem value="ano">Este ano</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {/* Select para ordenação A-Z/Z-A */}
        {onOrderChange && (
          <Select value={order} onValueChange={onOrderChange}>
            <SelectTrigger className="w-full md:w-28">
              <SelectValue placeholder="Ordem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default ComissoesFilter;
