import React from 'react';
import { Button } from '@/components/ui/button';
import DemoVideo from './DemoVideo';

const Hero: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthClick = () => {
    window.open('/#/auth', '_blank');
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative pb-32 pt-40">
      <div className="max-w-4xl text-center space-y-6 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter glow">
          <span className="text-gradient">ConectaPro</span> <br />
          Impulsione suas Vendas
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Organize seus clientes, acompanhe suas vendas e aumente seus 
          resultados com facilidade.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-dmanske-purple to-dmanske-blue hover:opacity-90 text-white"
            onClick={scrollToContact}
          >
            Experimente Agora
          </Button>
          <Button size="lg" variant="secondary" className="glass">
            Ver Demonstração
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-dmanske-purple to-dmanske-blue hover:opacity-90 text-white"
            onClick={handleAuthClick}
          >
            Já é Cliente? Clique Aqui
          </Button>
        </div>
      </div>

      {/* Vídeo flutuante, sem card, sem borda, sem glass */}
      <div className="mt-12 max-w-5xl w-full flex justify-center relative z-10">
        <DemoVideo />
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10 text-dmanske-purple/50 animate-bounce" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
