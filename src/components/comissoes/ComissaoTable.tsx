import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Check, Trash, Eye } from "lucide-react";
import { FormatCurrency } from "./FormatComponents";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Comissao } from "@/hooks/useComissoes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useComissoes } from "@/hooks/useComissoes";

interface ComissaoTableProps {
  comissoes: Comissao[];
  onMarcarPago?: (id: string) => void;
  onEditar?: (comissao: Comissao) => void;
  onExcluir?: (id: string) => void; // Nova propriedade
  showActions?: boolean;
  showHeader?: boolean; // Nova prop para controlar o cabeçalho
}

export const ComissaoTable = ({ 
  comissoes, 
  onMarcarPago, 
  onEditar, 
  onExcluir,
  showActions = true,
  showHeader = true // valor padrão
}: ComissaoTableProps) => {
  const [detalhesComissao, setDetalhesComissao] = useState<Comissao | null>(null);
  const [comissaoParaExcluir, setComissaoParaExcluir] = useState<string | null>(null);
  const [recebimentos, setRecebimentos] = useState<{ valor: number, data: string }[]>([]);
  const [recebimentosPorComissao, setRecebimentosPorComissao] = useState<{ [id: string]: { valor: number, data: string }[] }>({});
  const { getRecebimentosByComissaoId, adicionarRecebimento } = useComissoes();

  useEffect(() => {
    if (detalhesComissao?.id) {
      getRecebimentosByComissaoId(detalhesComissao.id).then(recebimentosDb => {
        setRecebimentos(recebimentosDb.map((r: any) => ({ valor: r.valor, data: r.data })));
      });
    } else {
      setRecebimentos([]);
    }
  }, [detalhesComissao]);

  useEffect(() => {
    async function fetchAllRecebimentos() {
      const map: { [id: string]: { valor: number, data: string }[] } = {};
      for (const c of comissoes) {
        const recs = await getRecebimentosByComissaoId(c.id);
        map[c.id] = recs.map((r: any) => ({ valor: r.valor, data: r.data }));
      }
      setRecebimentosPorComissao(map);
    }
    if (comissoes.length > 0) fetchAllRecebimentos();
    // eslint-disable-next-line
  }, [comissoes]);

  const totalRecebido = recebimentos.reduce((acc, r) => acc + r.valor, 0);
  const faltaReceber = (detalhesComissao?.valorComissaoCorretor || 0) - totalRecebido;
  
  const formatarData = (data: string | null) => {
    if (!data) return "-";
    try {
      return format(new Date(data + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return "-";
    }
  };
  
  const handleConfirmarExclusao = () => {
    if (comissaoParaExcluir && onExcluir) {
      onExcluir(comissaoParaExcluir);
      setComissaoParaExcluir(null);
    }
  };

  return (
    <>
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow className="bg-slate-100 text-sm font-bold font-display">
              <TableHead className="px-3 py-2 text-center">Data / Cliente</TableHead>
              <TableHead className="px-3 py-2 text-center">Imóvel</TableHead>
              <TableHead className="px-3 py-2 text-center">Venda</TableHead>
              <TableHead className="px-3 py-2 text-center">Comissão</TableHead>
              <TableHead className="px-3 py-2 text-center">Recebido</TableHead>
              <TableHead className="px-3 py-2 text-center">Pendente</TableHead>
              <TableHead className="px-3 py-2 text-center">Status</TableHead>
              {showActions && <TableHead className="text-center px-3 py-2">Ações</TableHead>}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {comissoes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 8 : 7} className="text-center py-8 text-slate-500 font-sans text-xs">
                Nenhuma comissão encontrada
              </TableCell>
            </TableRow>
          ) : (
            comissoes.map((comissao, idx) => {
              const recs = recebimentosPorComissao[comissao.id] || [];
              const valorRecebido = recs.reduce((acc, r) => acc + (r.valor || 0), 0);
              const valorPendente = (comissao.valorComissaoCorretor || 0) - valorRecebido;
              return (
                <TableRow key={comissao.id} className={`${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} font-sans text-xs border-b border-slate-100`}>
                  <TableCell className="px-3 py-2 align-middle text-center">
                    <div className="flex flex-col gap-0.5 items-center">
                      <span className="font-bold text-slate-900 text-[14.4px]">{comissao.cliente}</span>
                      <span className="text-slate-500 text-[14.4px]">{formatarData(comissao.dataContrato)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2 align-middle text-center">
                    <span className="inline-block bg-slate-100 text-slate-600 rounded px-2 py-1 text-[14.4px] font-medium">{comissao.imovel}</span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-blue-900 font-bold text-[14.4px] align-middle text-center">{comissao.valorVenda ? `R$ ${Number(comissao.valorVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</TableCell>
                  <TableCell className="px-3 py-2 text-green-900 font-bold text-[14.4px] align-middle text-center">{comissao.valorComissaoCorretor ? `R$ ${Number(comissao.valorComissaoCorretor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</TableCell>
                  <TableCell className="px-3 py-2 text-green-700 font-bold text-[14.4px] align-middle text-center">{valorRecebido > 0 ? `R$ ${valorRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</TableCell>
                  <TableCell className={`px-3 py-2 font-bold text-[14.4px] align-middle text-center ${valorPendente > 0 ? 'text-red-700' : 'text-slate-400'}`}>{valorPendente > 0 ? `R$ ${valorPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</TableCell>
                  <TableCell className="px-3 py-2 align-middle text-center">
                    <span className={`px-2 py-1 rounded-full text-[14.4px] font-bold ${
                      comissao.status === 'Recebido' ? 'bg-green-100 text-green-800' :
                      comissao.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      comissao.status === 'Parcial' ? 'bg-blue-100 text-blue-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {comissao.status}
                    </span>
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-center px-3 py-2 align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetalhesComissao(comissao);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {onEditar && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditar(comissao);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onExcluir && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setComissaoParaExcluir(comissao.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      
      {/* Modal de detalhes da comissão */}
      <Dialog open={!!detalhesComissao} onOpenChange={() => setDetalhesComissao(null)}>
        <DialogContent className="sm:max-w-2xl p-0 bg-white rounded-2xl shadow-xl border border-slate-100">
          {detalhesComissao && (
            <div className="p-8 flex flex-col gap-6">
              {/* Avatar e nome */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400 border-4 border-white shadow-md">
                  {/* Se tiver avatar, exiba aqui. Senão, iniciais do nome */}
                  {detalhesComissao.cliente ? detalhesComissao.cliente.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : <span>👤</span>}
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 font-display">{detalhesComissao.cliente}</div>
                  <div className="text-lg text-slate-500 font-medium">{detalhesComissao.status || 'Status não informado'}</div>
                  <div className="text-slate-400 flex items-center gap-1 mt-1 text-sm">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.11 10.39 8.09 11.09.34.25.82.25 1.16 0C13.89 21.39 21 16.25 21 11c0-4.97-4.03-9-9-9Zm0 17.88C9.14 17.1 5 13.61 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7c0 2.61-4.14 6.1-7 8.88Z"/><path fill="currentColor" d="M12 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Z"/></svg>
                    {detalhesComissao.imovel || 'Imóvel não informado'}
                  </div>
                </div>
              </div>
              {/* Sobre */}
              <div>
                <div className="text-base font-semibold text-slate-700 mb-1 flex items-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v2H4zm0 4h16v2H4zm0 4h10v2H4zm0 4h10v2H4z"/></svg> Sobre</div>
                <div className="text-slate-700 text-base">Venda de {detalhesComissao.imovel || 'imóvel não informado'} no valor de <span className="font-bold">{detalhesComissao.valorVenda ? `R$ ${Number(detalhesComissao.valorVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</span>.</div>
              </div>
              {/* Boxes de informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {/* Informações profissionais */}
                <div className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col gap-2">
                  <div className="text-base font-semibold text-slate-700 mb-2">Informações da venda</div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z"/><path fill="currentColor" d="M7 9h10v2H7zm0 4h7v2H7z"/></svg> Data do Contrato: <span className="ml-1 text-slate-700 font-medium">{formatarData(detalhesComissao.dataContrato)}</span></div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">Valor da comissão da imobiliária: <span className="ml-1 text-blue-700 font-bold">{detalhesComissao.valorComissaoImobiliaria ? `R$ ${Number(detalhesComissao.valorComissaoImobiliaria).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</span></div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">Valor da comissão do corretor: <span className="ml-1 text-green-700 font-bold">{detalhesComissao.valorComissaoCorretor ? `R$ ${Number(detalhesComissao.valorComissaoCorretor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</span></div>
                </div>
                {/* Contato/Recebimentos */}
                <div className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col gap-2">
                  <div className="text-base font-semibold text-slate-700 mb-2">Recebimentos</div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/></svg> Valor Recebido: <span className="ml-1 text-green-700 font-bold">{recebimentos.length > 0 ? `R$ ${totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</span></div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z"/><path fill="currentColor" d="M7 9h10v2H7zm0 4h7v2H7z"/></svg> Valor Pendente: <span className="ml-1 text-yellow-700 font-bold">{faltaReceber > 0 ? `R$ ${faltaReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</span></div>
                  {recebimentos.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-slate-500 mb-1">Pagamentos realizados:</div>
                      <div className="flex flex-wrap gap-2">
                        {recebimentos.map((rec, idx) => (
                          <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center min-w-[110px]">
                            <div className="font-bold text-green-700">R$ {rec.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                            <div className="text-xs text-slate-500">{formatarData(rec.data)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Botão fechar */}
              <div className="flex justify-end mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Fechar</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={!!comissaoParaExcluir} onOpenChange={() => setComissaoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta comissão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmarExclusao}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ComissaoTable;
