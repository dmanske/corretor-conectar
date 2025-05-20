import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: "Otoniel Zilse",
    role: "Representante Autônomo",
    image: "/placeholder.svg",
    content: "A melhor parte do ConectaPro é a gestão dos aniversários dos clientes. Antes, eu esquecia essas datas e acabava perdendo oportunidades de contato. Agora, recebo alertas automáticos e consigo manter um relacionamento muito mais próximo. Meus clientes adoram!"
  },
  {
    name: "Phelipe Manske",
    role: "Representante Comercial",
    image: "/placeholder.svg",
    content: "O painel financeiro do ConectaPro é incrível! Consigo saber exatamente o que foi vendido, o que recebi e o que ainda está pendente. A integração com WhatsApp para mandar mensagens rápidas para os clientes é um diferencial enorme."
  },
  {
    name: "Chrismacleiton Pamplona",
    role: "Corretor de Imóveis",
    image: "/placeholder.svg",
    content: "Utilizo o ConectaPro para organizar todas as minhas vendas e acompanhar as comissões. O painel é super intuitivo e os relatórios me ajudam a ter uma visão clara dos meus ganhos. É um diferencial enorme para quem trabalha com vendas externas."
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-dmanske-deep-purple/20 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos <span className="text-gradient">clientes</span> dizem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Veja como o ConectaPro tem transformado negócios por todo o Brasil
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="backdrop-blur bg-card/50 border-slate-800 overflow-hidden hover:glow-border transition-all duration-300">
              <CardContent className="p-6">
                <div 
                  className="bg-card/30 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-dmanske-purple">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <p className="mb-4 italic text-muted-foreground">"{testimonial.content}"</p>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-dmanske-purple">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
