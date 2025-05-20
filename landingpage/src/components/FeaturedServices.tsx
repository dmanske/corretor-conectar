
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Database, LayoutDashboard, Calendar, FileText, Cloud, Monitor } from 'lucide-react';

const services = [
  {
    icon: <Users className="h-10 w-10 text-dmanske-purple" />,
    title: "Cadastro de Clientes",
    description: "Gerencie seus clientes potenciais e atuais em um único lugar com acesso rápido a todos os dados."
  },
  {
    icon: <LayoutDashboard className="h-10 w-10 text-dmanske-blue" />,
    title: "Gestão de Vendas",
    description: "Acompanhe todo o processo de vendas, do primeiro contato até o fechamento com facilidade."
  },
  {
    icon: <Calendar className="h-10 w-10 text-dmanske-green" />,
    title: "Alertas de Aniversário",
    description: "Nunca mais perca datas importantes dos seus clientes com notificações automáticas."
  },
  {
    icon: <FileText className="h-10 w-10 text-dmanske-light-purple" />,
    title: "Relatórios Detalhados",
    description: "Visualize métricas importantes para tomar decisões baseadas em dados reais do seu negócio."
  },
  {
    icon: <Database className="h-10 w-10 text-dmanske-blue" />,
    title: "Painel Financeiro",
    description: "Controle suas receitas, despesas e comissões em um painel intuitivo e completo."
  },
  {
    icon: <Cloud className="h-10 w-10 text-dmanske-green" />,
    title: "Sincronização em Nuvem",
    description: "Seus dados sempre seguros e disponíveis em qualquer dispositivo, a qualquer momento."
  }
];

const FeaturedServices: React.FC = () => {
  return (
    <section id="services" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossas <span className="text-gradient">Funcionalidades</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ferramentas completas projetadas para otimizar seu trabalho e aumentar seus resultados
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-slate-800 hover:glow-border transition-all duration-300">
              <CardHeader>
                <div className="bg-secondary/30 p-3 rounded-lg w-fit mb-4">
                  {service.icon}
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
