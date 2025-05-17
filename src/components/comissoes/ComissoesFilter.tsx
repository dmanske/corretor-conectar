
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
}

const ComissoesFilter = ({
  tab,
  onTabChange,
  filtro,
  onFiltroChange,
  periodo,
  onPeriodoChange
}: ComissoesFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <TabsList>
        <TabsTrigger value="todas" onClick={() => onTabChange("todas")}>Todas</TabsTrigger>
        <TabsTrigger value="pendentes" onClick={() => onTabChange("pendentes")}>Pendentes</TabsTrigger>
        <TabsTrigger value="recebidas" onClick={() => onTabChange("recebidas")}>Recebidas</TabsTrigger>
        <TabsTrigger value="parciais" onClick={() => onTabChange("parciais")}>Parciais</TabsTrigger>
      </TabsList>
      
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou imóvel..."
            className="pl-8"
            value={filtro}
            onChange={(e) => onFiltroChange(e.target.value)}
          />
        </div>
        
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
      </div>
    </div>
  );
};

export default ComissoesFilter;
