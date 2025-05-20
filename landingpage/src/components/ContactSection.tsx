
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em uma aplicação real, isso enviaria os dados do formulário para um backend
    console.log('Formulário enviado');
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Entre em <span className="text-gradient">Contato</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pronto para transformar sua gestão de vendas? Entre em contato para experimentar o ConectaPro.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Informações de Contato</h3>
            
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-dmanske-purple mt-1" />
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-muted-foreground">contato@conectapro.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-dmanske-purple mt-1" />
              <div>
                <h4 className="font-medium">Telefone</h4>
                <p className="text-muted-foreground">(11) 98765-4321</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-dmanske-purple mt-1" />
              <div>
                <h4 className="font-medium">Endereço</h4>
                <p className="text-muted-foreground">
                  Av. Paulista, 1000<br />
                  São Paulo, SP - Brasil
                </p>
              </div>
            </div>
          </div>
          
          <Card className="lg:col-span-3 glass border-slate-800">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome Completo
                  </label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome completo" 
                    className="bg-secondary/30 border-slate-700"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Seu email" 
                      className="bg-secondary/30 border-slate-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Telefone
                    </label>
                    <Input 
                      id="phone" 
                      placeholder="Seu telefone" 
                      className="bg-secondary/30 border-slate-700"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensagem (opcional)
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Sua mensagem" 
                    className="bg-secondary/30 border-slate-700 min-h-[100px]"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-dmanske-purple to-dmanske-blue hover:opacity-90"
                >
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
