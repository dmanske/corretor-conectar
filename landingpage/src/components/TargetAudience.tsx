
import React from 'react';
import { User, Briefcase } from 'lucide-react';

const audiences = [
  {
    icon: <User className="h-12 w-12 text-dmanske-purple" />,
    title: "Corretores Autônomos",
    description: "Ideal para profissionais que atuam de forma independente"
  },
  {
    icon: <Briefcase className="h-12 w-12 text-dmanske-blue" />,
    title: "Representantes Comerciais",
    description: "Perfeito para quem representa empresas e marcas no mercado"
  },
  {
    icon: <User className="h-12 w-12 text-dmanske-green" />,
    title: "Vendedores Externos",
    description: "Otimizado para profissionais que trabalham em campo"
  }
];

const TargetAudience: React.FC = () => {
  return (
    <section id="audience" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Para <span className="text-gradient">Quem</span> é Indicado?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conheça os perfis que mais se beneficiam da nossa plataforma
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center max-w-xs p-6 bg-card/30 rounded-lg backdrop-blur hover:glow-border transition-all duration-300"
            >
              <div className="mb-4">
                {audience.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{audience.title}</h3>
              <p className="text-muted-foreground">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
