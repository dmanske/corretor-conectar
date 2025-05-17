import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Aniversariante } from "../types";
import WhatsAppButton from "./WhatsAppButton";
import { useToast } from "@/hooks/use-toast";

interface AniversariantesCardProps {
  title: string;
  aniversariantes: Aniversariante[];
  className?: string;
}

const AniversariantesCard = ({
  title,
  aniversariantes,
  className,
}: AniversariantesCardProps) => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<Aniversariante | null>(null);
  const [customMessage, setCustomMessage] = useState("");

  const handleSelectClient = (aniversariante: Aniversariante) => {
    setSelectedClient(aniversariante);
    setCustomMessage(`Olá ${aniversariante.nome}, feliz aniversário! 🎂🎉 Desejamos muita saúde, paz e prosperidade neste novo ciclo de vida.`);
  };

  const handleSendMessage = (cliente: Aniversariante) => {
    // Em uma aplicação real, isso enviaria um e-mail ou mensagem
    toast({
      title: "Mensagem Enviada",
      description: `Mensagem de aniversário enviada para ${cliente.nome}!`,
    });
  };
  
  return (
    <Card className={`overflow-hidden rounded-2xl shadow-lg ${title.includes('Semana') ? 'bg-gradient-to-r from-blue-100 via-blue-50 to-white' : 'bg-gradient-to-r from-green-100 via-green-50 to-white'} ${className || ''}`}>
      <div className="px-6 pt-5 pb-2">
        <CardTitle className="text-xl font-semibold text-slate-800">{title}</CardTitle>
      </div>
      <CardContent className="px-6 pb-5 pt-0">
        {aniversariantes.length > 0 ? (
          <ul className="space-y-4">
            {aniversariantes.map((aniversariante) => {
              let dataNascObj;
              if (aniversariante.dataNascimento.includes('/')) {
                const partes = aniversariante.dataNascimento.split('/');
                if (partes.length === 3) {
                  dataNascObj = new Date(Date.UTC(
                    parseInt(partes[2]),
                    parseInt(partes[1]) - 1,
                    parseInt(partes[0])
                  ));
                }
              } else {
                const partes = aniversariante.dataNascimento.split('-');
                if (partes.length === 3) {
                  dataNascObj = new Date(Date.UTC(
                    parseInt(partes[0]),
                    parseInt(partes[1]) - 1,
                    parseInt(partes[2])
                  ));
                } else {
                  dataNascObj = new Date(aniversariante.dataNascimento);
                }
              }
              const dia = dataNascObj?.getUTCDate().toString().padStart(2, '0');
              const mes = dataNascObj ? dataNascObj.toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' }) : '';
              const dataFormatada = dia && mes ? `${dia} de ${mes}` : aniversariante.dataNascimento;
              
              return (
                <li key={aniversariante.id} className="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2 md:flex-row md:items-center border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl">🎂</span>
                      <h4 className="font-bold text-slate-800 text-lg truncate">{aniversariante.nome}</h4>
                    </div>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <WhatsAppButton
                        telefone={aniversariante.telefone}
                        size="sm"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{dataFormatada}</p>
                  {aniversariante.diasAte === 0 ? (
                    <div className="flex items-center mt-1">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Hoje!</span>
                    </div>
                  ) : aniversariante.diasAte === 1 ? (
                    <div className="flex items-center mt-1">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Amanhã</span>
                    </div>
                  ) : (
                    <div className="flex items-center mt-1">
                      <span className="inline-block bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">
                        Em {aniversariante.diasAte} dias
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <p className="text-slate-400">Nenhum aniversariante encontrado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AniversariantesCard;
