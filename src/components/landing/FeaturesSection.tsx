
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaChartLine, FaBirthdayCake, FaFileAlt, FaMoneyBillWave, FaDesktop } from 'react-icons/fa';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  // Rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const featureData = [
    {
      icon: <FaUserPlus size={28} />,
      title: "Cadastro de Clientes",
      description: "Mantenha todos os dados dos seus clientes organizados, com histórico completo e alertas para datas importantes.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: <FaChartLine size={28} />,
      title: "Gestão de Vendas",
      description: "Acompanhe todas as suas vendas em tempo real, com estatísticas e relatórios detalhados para análise completa do seu negócio.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <FaBirthdayCake size={28} />,
      title: "Alertas de Aniversário",
      description: "Nunca mais esqueça datas importantes dos seus clientes. Receba notificações automáticas e fortaleça o relacionamento.",
      gradient: "from-blue-400 to-cyan-600"
    },
    {
      icon: <FaFileAlt size={28} />,
      title: "Relatórios Detalhados",
      description: "Acesso completo a relatórios de suas vendas, clientes e comissões para ajudar na tomada de decisões estratégicas.",
      gradient: "from-cyan-400 to-blue-600"
    },
    {
      icon: <FaMoneyBillWave size={28} />,
      title: "Gestão Financeira",
      description: "Controle suas finanças de forma completa e integrada, com fluxo de caixa, despesas e previsões de entradas de caixa.",
      gradient: "from-indigo-400 to-blue-600"
    },
    {
      icon: <FaDesktop size={28} />,
      title: "Interface Amigável",
      description: "Interface intuitiva e responsiva, disponível para desktop, tablet e dispositivos móveis de qualquer lugar.",
      gradient: "from-blue-600 to-indigo-500"
    }
  ];

  return (
    <section id="funcionalidades" className="py-20 px-6 relative overflow-hidden">
      <motion.div 
        className="text-center mb-16" 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-2 text-blue-gradient">Funcionalidades Poderosas</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Descubra todas as ferramentas que o Corretor Conecta oferece para tornar seu 
          negócio imobiliário mais produtivo e rentável.
        </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
        variants={staggerContainer} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.3 }}
      >
        {featureData.map((feature, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              isActive={activeFeature === index}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/5 blur-3xl"></div>
      <div className="absolute -top-10 right-0 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/5 blur-3xl"></div>
    </section>
  );
};

export default FeaturesSection;
