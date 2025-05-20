import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleAuthClick = () => {
    window.open('/#/auth', '_blank');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        scrolled ? 'neo-blur' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gradient">ConectaPro</h1>
        </div>
        
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#" className="text-muted-foreground hover:text-white transition-colors">Início</a>
          <a href="#services" className="text-muted-foreground hover:text-white transition-colors">Funcionalidades</a>
          <a href="#differentials" className="text-muted-foreground hover:text-white transition-colors">Diferenciais</a>
          <a href="#audience" className="text-muted-foreground hover:text-white transition-colors">Para Quem</a>
          <a href="#planos" className="text-muted-foreground hover:text-white transition-colors">Planos</a>
          <a href="#contact" className="text-muted-foreground hover:text-white transition-colors">Contato</a>
          <Button variant="secondary" className="hover:glow-border">Experimentar</Button>
          <Button variant="secondary" className="hover:glow-border ml-2" onClick={handleAuthClick}>
            Já é Cliente? Clique aqui
          </Button>
        </nav>
        
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 neo-blur py-4 px-6">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#" 
              className="text-white hover:text-dmanske-purple transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </a>
            <a 
              href="#services" 
              className="text-white hover:text-dmanske-purple transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Funcionalidades
            </a>
            <a 
              href="#differentials" 
              className="text-white hover:text-dmanske-purple transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Diferenciais
            </a>
            <a 
              href="#audience" 
              className="text-white hover:text-dmanske-purple transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Para Quem
            </a>
            <a 
              href="#planos" 
              className="text-white hover:text-dmanske-purple transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planos
            </a>
            <a 
              href="#contact" 
              className="text-white hover:text-dmanske-purple transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </a>
            <Button variant="secondary" className="w-full">Experimentar</Button>
            <Button variant="secondary" className="w-full" onClick={handleAuthClick}>
              Já é Cliente? Clique aqui
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
