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
}

export const ComissaoTable = ({ 
  comissoes, 
  onMarcarPago, 
  onEditar, 
  onExcluir,
  showActions = true 
}: ComissaoTableProps) => {
  const [detalhesComissao, setDetalhesComissao] = useState<Comissao | null>(null);
  const [comissaoParaExcluir, setComissaoParaExcluir] = useState<string | null>(null);
  const [recebimentos, setRecebimentos] = useState<{ valor: number, data: string }[]>([]);
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

  const totalRecebido = recebimentos.reduce((acc, r) => acc + r.valor, 0);
  const faltaReceber = (detalhesComissao?.valorComissaoCorretor || 0) - totalRecebido;
  
  const formatarData = (data: string | null) => {
    if (!data) return "-";
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
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
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor da Venda</TableHead>
            <TableHead>Comissão</TableHead>
            <TableHead>Data do Contrato</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {comissoes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 6 : 5} className="text-center py-8 text-slate-500">
                Nenhuma comissão encontrada
              </TableCell>
            </TableRow>
          ) : (
            comissoes.map((comissao) => (
              <TableRow key={comissao.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setDetalhesComissao(comissao)}>
                <TableCell className="font-medium">
                  <div>{comissao.cliente}</div>
                  <div className="text-sm text-slate-500">{comissao.imovel}</div>
                </TableCell>
                <TableCell>
                  <FormatCurrency value={comissao.valorVenda} />
                </TableCell>
                <TableCell>
                  <FormatCurrency value={comissao.valorComissaoCorretor} />
                </TableCell>
                <TableCell>
                  {formatarData(comissao.dataContrato)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={comissao.status} />
                </TableCell>
                {showActions && (
                  <TableCell className="text-right space-x-1">
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
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Modal de detalhes da comissão */}
      <Dialog open={!!detalhesComissao} onOpenChange={() => setDetalhesComissao(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Comissão</DialogTitle>
          </DialogHeader>
          
          {detalhesComissao && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Informações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Cliente</p>
                      <p className="font-medium">{detalhesComissao.cliente}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Imóvel</p>
                      <p>{detalhesComissao.imovel}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Status</p>
                      <StatusBadge status={detalhesComissao.status} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Valores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Valor da Venda</p>
                      <p className="font-medium"><FormatCurrency value={detalhesComissao.valorVenda} /></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Comissão Imobiliária</p>
                      <p><FormatCurrency value={detalhesComissao.valorComissaoImobiliaria} /></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Comissão Corretor</p>
                      <p className="font-semibold text-green-600"><FormatCurrency value={detalhesComissao.valorComissaoCorretor} /></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Falta Receber</p>
                      <p className={faltaReceber > 0 ? 'font-semibold text-yellow-600' : 'text-slate-500'}>
                        R$ {faltaReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    {recebimentos.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <p className="text-sm font-medium text-slate-500 mb-1">Recebimentos já feitos:</p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                          {recebimentos.map((rec, idx) => (
                            <div key={idx} style={{
                              border: '1px solid #e5e7eb',
                              borderRadius: 8,
                              padding: '8px 16px',
                              background: '#f9fafb',
                              minWidth: 120,
                              textAlign: 'center'
                            }}>
                              <div style={{ fontWeight: 600 }}>R$ {rec.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                              <div style={{ fontSize: 12 }}>{rec.data.split('-').reverse().join('/')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-between pt-2">
                {detalhesComissao.status !== "Recebido" && onMarcarPago && (
                  <Button 
                    onClick={async () => {
                      try {
                        console.log('Cliquei em Marcar como Recebido', detalhesComissao, faltaReceber);
                        if (faltaReceber > 0) {
                          const hoje = new Date();
                          const dataHoje = hoje.toISOString().split('T')[0];
                          await adicionarRecebimento(detalhesComissao.id, faltaReceber, dataHoje);
                          const recebimentosDb = await getRecebimentosByComissaoId(detalhesComissao.id);
                          setRecebimentos(recebimentosDb.map((r: any) => ({ valor: r.valor, data: r.data })));
                        }
                        if (onMarcarPago) {
                          await onMarcarPago(detalhesComissao.id);
                        } else {
                          alert('Função onMarcarPago não definida!');
                        }
                        const recebimentosDb = await getRecebimentosByComissaoId(detalhesComissao.id);
                        setRecebimentos(recebimentosDb.map((r: any) => ({ valor: r.valor, data: r.data })));
                        setDetalhesComissao(null);
                      } catch (err) {
                        console.error('Erro ao marcar como recebido:', err);
                        alert('Erro ao marcar como recebido. Veja o console para detalhes.');
                      }
                    }}
                    variant="outline"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marcar como Recebido
                  </Button>
                )}
                
                <div className="flex gap-2 ml-auto">
                  {onEditar && (
                    <Button 
                      onClick={() => {
                        onEditar(detalhesComissao);
                        setDetalhesComissao(null);
                      }}
                      variant="outline"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                  
                  <DialogClose asChild>
                    <Button>Fechar</Button>
                  </DialogClose>
                </div>
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
