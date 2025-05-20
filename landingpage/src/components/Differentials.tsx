
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MessageSquare, RefreshCw, Zap } from 'lucide-react';

const differentials = [
  {
    icon: <Globe className="h-8 w-8 text-dmanske-purple" />,
    title: "100% Online",
    description: "Acesse de qualquer lugar, sem necessidade de instalação"
  },
  {
    icon: <Zap className="h-8 w-8 text-dmanske-blue" />,
    title: "Design Moderno",
    description: "Interface responsiva com animações e tema escuro/claro"
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-dmanske-green" />,
    title: "Suporte Dedicado",
    description: "Atendimento rápido e equipe focada na sua satisfação"
  },
  {
    icon: <RefreshCw className="h-8 w-8 text-dmanske-light-purple" />,
    title: "Atualizações Constantes",
    description: "Novas funcionalidades e melhorias sendo adicionadas regularmente"
  }
];

const Differentials: React.FC = () => {
  return (
    <section id="differentials" className="py-24 px-4 bg-gradient-to-b from-background to-dmanske-deep-purple/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher o <span className="text-gradient">ConectaPro</span>?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nossos diferenciais que transformam a maneira como você gerencia seus negócios
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentials.map((item, index) => (
            <Card 
              key={index} 
              className="text-center bg-card/50 backdrop-blur border-slate-800 hover:glow-border hover:scale-105 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentials;
