
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const apps = [
  {
    title: "App Finanças",
    image: "/placeholder.svg",
    description: "Aplicativo de gestão financeira pessoal e empresarial",
    tags: ["React Native", "Firebase"]
  },
  {
    title: "Sistema de Logística",
    image: "/placeholder.svg",
    description: "Sistema completo para gerenciamento de entregas e estoque",
    tags: ["React", "Node.js"]
  },
  {
    title: "App Delivery",
    image: "/placeholder.svg",
    description: "Plataforma de delivery para restaurantes e serviços",
    tags: ["Flutter", "Express"]
  },
  {
    title: "Sistema ERP",
    image: "/placeholder.svg",
    description: "Sistema integrado de gestão empresarial",
    tags: ["React", "PostgreSQL"]
  }
];

const OurApps: React.FC = () => {
  return (
    <section id="apps" className="py-24 px-4 bg-gradient-to-b from-background to-dmanske-deep-purple/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos <span className="text-gradient">Aplicativos</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desenvolvemos aplicativos personalizados para diversas necessidades de negócio
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {apps.map((app, index) => (
            <Card key={index} className="overflow-hidden hover:scale-105 transition-transform duration-300 bg-card/70 backdrop-blur border-slate-800">
              <div className="h-48 bg-secondary/30 flex items-center justify-center">
                <img src={app.image} alt={app.title} className="h-32 w-32 object-contain" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{app.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{app.description}</p>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs py-1 px-2 bg-dmanske-purple/20 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurApps;
