
import React from 'react';
import { Button } from '@/components/ui/button';

const CallToAction: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-dmanske-purple/20 to-dmanske-blue/20 blur-3xl transform -translate-y-1/2 opacity-30"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Experimente o <span className="text-gradient">ConectaPro</span> Agora
          </h2>
          <p className="text-lg text-muted-foreground">
            Organize suas vendas e aumente sua produtividade com o melhor sistema de gestão 
            para corretores e representantes.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-dmanske-purple to-dmanske-blue hover:opacity-90 text-white px-8 py-6 text-lg"
            onClick={scrollToContact}
          >
            Quero Experimentar!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
