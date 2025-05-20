
import React from 'react';

const techCategories = [
  {
    name: "Frontend",
    techs: [
      { name: "React", icon: "devicon-react-original colored" },
      { name: "Next.js", icon: "devicon-nextjs-original" },
      { name: "TypeScript", icon: "devicon-typescript-plain colored" },
      { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" }
    ]
  },
  {
    name: "Backend",
    techs: [
      { name: "Node.js", icon: "devicon-nodejs-plain colored" },
      { name: "Express", icon: "devicon-express-original" },
      { name: "Python", icon: "devicon-python-plain colored" },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" }
    ]
  },
  {
    name: "Infraestrutura",
    techs: [
      { name: "AWS", icon: "devicon-amazonwebservices-original colored" },
      { name: "Docker", icon: "devicon-docker-plain colored" },
      { name: "Kubernetes", icon: "devicon-kubernetes-plain colored" },
      { name: "Serverless", icon: "devicon-amazonwebservices-plain-wordmark colored" }
    ]
  }
];

const TechStack: React.FC = () => {
  return (
    <section id="tech" className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossa <span className="text-gradient">Stack de Tecnologia</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Utilizamos tecnologias de ponta para construir soluções robustas, escaláveis e de alto desempenho
          </p>
        </div>
        
        <div className="space-y-12">
          {techCategories.map((category, index) => (
            <div key={index} className="mb-10">
              <h3 className="text-2xl font-semibold mb-6 text-center text-dmanske-purple">{category.name}</h3>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {category.techs.map((tech, techIndex) => (
                  <div key={techIndex} className="flex flex-col items-center hover:scale-110 transition-transform">
                    <i className={`${tech.icon} text-5xl mb-2`}></i>
                    <span className="text-sm text-muted-foreground">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
