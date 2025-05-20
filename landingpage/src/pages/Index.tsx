import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import FeaturedServices from '../components/FeaturedServices';
import Differentials from '../components/Differentials';
import TargetAudience from '../components/TargetAudience';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import LandingPageStyleProvider from '../LandingPageStyleProvider';

const PlansSection = () => (
  <section id="planos" className="py-24 px-4 relative z-10">
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-gradient">ConectaPro</span> - Organize suas Vendas e Multiplique seus Resultados!
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          O ConectaPro é a solução definitiva para corretores, representantes comerciais e vendedores externos que desejam mais organização, controle e resultados em suas vendas. Com uma interface moderna, fácil de usar e 100% online, você centraliza tudo em um único lugar: clientes, vendas, aniversários e histórico financeiro.
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
        <div className="flex-1 bg-card/30 rounded-lg backdrop-blur p-8 text-center shadow-lg hover:glow-border transition-all duration-300">
          <h3 className="text-2xl font-bold mb-2">Mensal</h3>
          <div className="text-4xl font-extrabold text-gradient mb-2">R$ 39,90</div>
          <div className="text-muted-foreground mb-4">por mês</div>
        </div>
        <div className="flex-1 bg-card/30 rounded-lg backdrop-blur p-8 text-center shadow-lg border-2 border-primary hover:glow-border transition-all duration-300">
          <h3 className="text-2xl font-bold mb-2">Anual</h3>
          <div className="text-4xl font-extrabold text-gradient mb-2">R$ 399,90</div>
          <div className="text-muted-foreground mb-1">por ano</div>
          <div className="text-sm text-primary font-semibold">Economize 15%</div>
        </div>
      </div>
      <div className="text-center mb-8">
        <div className="inline-block bg-primary/10 rounded-full px-6 py-2 text-primary font-semibold mb-2 animate-pulse-glow">
          Teste grátis por 3 dias para explorar todas as funcionalidades!
        </div>
        <div className="text-muted-foreground text-sm max-w-xl mx-auto mb-4">
          Importante: Após o período de teste, é necessário ativar a assinatura para continuar utilizando todas as funcionalidades do ConectaPro.
        </div>
        <a href="#" className="inline-block mt-4 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:glow-border transition-all duration-300">
          Testar grátis por 3 dias
        </a>
      </div>
    </div>
  </section>
);

const Index: React.FC = () => {
  return (
    <LandingPageStyleProvider>
      <div className="landing-page min-h-screen flex flex-col relative overflow-hidden">
        <AnimatedBackground />
        <NavBar />
        <main>
          <Hero />
          <FeaturedServices />
          <Differentials />
          <TargetAudience />
          <PlansSection />
          <Testimonials />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LandingPageStyleProvider>
  );
};

export default Index;
