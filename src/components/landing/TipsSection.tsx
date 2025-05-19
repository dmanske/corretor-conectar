
import { motion } from 'framer-motion';
import { FaRegLightbulb } from 'react-icons/fa';

const TipsSection = () => {
  const tips = [
    {
      title: "Mantenha Contato",
      description: "Crie um sistema para manter contato regular com clientes antigos e leads. Relacionamento é tudo neste mercado."
    },
    {
      title: "Conhecimento Local",
      description: "Seja um especialista em sua região. Conheça detalhes sobre escolas, comércio, transporte e tendências locais."
    },
    {
      title: "Marketing Digital",
      description: "Invista em marketing digital e mídias sociais para aumentar sua presença online e gerar novos leads."
    }
  ];

  return (
    <motion.section 
      className="py-16 px-6 relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-950 dark:to-blue-900/70" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12" 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-block p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4" 
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaRegLightbulb className="text-blue-600 dark:text-blue-400 text-xl" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
            Dicas Para Corretores
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Algumas dicas valiosas para impulsionar sua carreira como corretor imobiliário.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <motion.div 
              key={index} 
              className="blue-glass p-6 rounded-xl" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)" }}
            >
              <h3 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-300">{tip.title}</h3>
              <p className="text-muted-foreground">{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TipsSection;
