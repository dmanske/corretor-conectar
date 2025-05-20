
import React from 'react';

const clients = [
  {
    name: "Empresa ABC",
    logo: "/placeholder.svg",
    siteUrl: "#"
  },
  {
    name: "Consultoria XYZ",
    logo: "/placeholder.svg",
    siteUrl: "#"
  },
  {
    name: "Tech Solutions",
    logo: "/placeholder.svg",
    siteUrl: "#"
  },
  {
    name: "Global Services",
    logo: "/placeholder.svg",
    siteUrl: "#"
  },
  {
    name: "Indústrias Brasil",
    logo: "/placeholder.svg",
    siteUrl: "#"
  },
  {
    name: "Comércio Digital",
    logo: "/placeholder.svg",
    siteUrl: "#"
  }
];

const ClientSites: React.FC = () => {
  return (
    <section id="sites" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sites dos Nossos <span className="text-gradient">Clientes</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Projetos web de destaque desenvolvidos para nossos clientes
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {clients.map((client, index) => (
            <a 
              key={index} 
              href={client.siteUrl}
              className="bg-card/30 p-6 rounded-lg flex items-center justify-center hover:glow-border transition-all duration-300 backdrop-blur"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-col items-center">
                <img 
                  src={client.logo} 
                  alt={`${client.name} logo`} 
                  className="h-16 w-16 object-contain mb-4" 
                />
                <span className="text-sm text-center">{client.name}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientSites;
