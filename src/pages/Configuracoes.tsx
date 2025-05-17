import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Configuracoes = () => {
  const { toast } = useToast();
  const [comissaoPadrao, setComissaoPadrao] = useState("5");
  const [mensagemAniversario, setMensagemAniversario] = useState(
    "Olá [nome], feliz aniversário! 🎂🎉 Desejamos muita saúde, paz e prosperidade neste novo ciclo de vida."
  );

  const salvarConfiguracoes = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso!",
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-slate-500">Gerencie as configurações do sistema.</p>
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as informações básicas do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Imobiliária/Corretor</Label>
                  <Input id="nome" placeholder="Insira o nome" defaultValue="Corretor Conecta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail para contato</Label>
                  <Input id="email" type="email" placeholder="contato@corretorconecta.com" defaultValue="contato@corretorconecta.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" placeholder="Endereço completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sobre">Sobre</Label>
                <Textarea 
                  id="sobre" 
                  placeholder="Informações sobre a imobiliária/corretor"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={salvarConfiguracoes}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Mensagens</CardTitle>
              <CardDescription>
                Personalize as mensagens automáticas do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mensagem-aniversario">Mensagem padrão de aniversário</Label>
                <Textarea 
                  id="mensagem-aniversario" 
                  value={mensagemAniversario}
                  onChange={e => setMensagemAniversario(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-slate-500">Use [nome] para inserir o nome do cliente automaticamente.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensagem-pos-venda">Mensagem padrão pós-venda</Label>
                <Textarea 
                  id="mensagem-pos-venda" 
                  placeholder="Mensagem enviada após a conclusão de uma venda"
                  defaultValue="Olá [nome], agradecemos pela confiança em nossos serviços! Estamos à disposição para ajudar em futuras negociações."
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={salvarConfiguracoes}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>
                Configure parâmetros financeiros e de comissões.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="comissao-padrao">Percentual padrão de comissão (%)</Label>
                  <Input 
                    id="comissao-padrao" 
                    type="number" 
                    placeholder="5"
                    value={comissaoPadrao}
                    onChange={e => setComissaoPadrao(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forma-pagamento-padrao">Forma de pagamento padrão</Label>
                  <Select defaultValue="pix">
                    <SelectTrigger id="forma-pagamento-padrao">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={salvarConfiguracoes}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure quais notificações deseja receber.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Aniversários</p>
                    <p className="text-sm text-slate-500">Receber notificações de aniversários</p>
                  </div>
                  <div>
                    <Switch id="notif-aniversarios" defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Vendas</p>
                    <p className="text-sm text-slate-500">Receber notificações de novas vendas</p>
                  </div>
                  <div>
                    <Switch id="notif-vendas" defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pagamentos</p>
                    <p className="text-sm text-slate-500">Receber alertas de pagamentos pendentes</p>
                  </div>
                  <div>
                    <Switch id="notif-pagamentos" defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Metas</p>
                    <p className="text-sm text-slate-500">Receber alertas sobre o progresso de metas</p>
                  </div>
                  <div>
                    <Switch id="notif-metas" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={salvarConfiguracoes}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
