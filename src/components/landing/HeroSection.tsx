
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <section className="relative pt-40 pb-20 px-6 bg-slate-950 rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 dark:from-blue-800 dark:to-blue-950 -z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzBoMnYyaC0yek0zMCAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] -z-10"></div>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="max-w-2xl text-white" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.p className="text-sm font-medium mb-2 text-blue-200" variants={fadeInUp}>
            App para imobiliárias e corretores
          </motion.p>
          <motion.h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" variants={fadeInUp}>
            Sua <span className="text-blue-300">Solução Completa</span> para Gestão Imobiliária
          </motion.h1>
          <motion.p className="text-lg mb-8 text-blue-100" variants={fadeInUp}>
            Organize seus clientes, vendas e comissões em um só lugar. 
            Desenvolvido especialmente para corretores que buscam escalabilidade e 
            eficiência em seus negócios.
          </motion.p>
          <motion.div className="flex flex-wrap gap-4" variants={fadeInUp}>
            <motion.a 
              href="#cadastro" 
              className="relative overflow-hidden bg-white text-blue-600 px-6 py-3 rounded-full font-medium shadow-xl shadow-blue-900/30 group" 
              whileHover={{ y: -5, boxShadow: "0 25px 25px -5px rgba(30, 64, 175, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <span className="relative z-10">Buscar Agora</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white z-0 opacity-0" 
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              ></motion.span>
            </motion.a>
            <motion.a 
              href="#funcionalidades" 
              className="border border-white/40 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-all duration-300" 
              whileHover={{ scale: 1.05, borderColor: "rgba(255, 255, 255, 0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              Saiba Mais
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute bottom-0 right-0 transform translate-y-1/4 -z-1">
        <motion.div 
          className="hidden md:block w-72 h-72 bg-blue-400/10 backdrop-blur-md rounded-full border border-white/10" 
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
      </div>
      
      <div className="absolute top-20 right-40 -z-1">
        <motion.div 
          className="hidden md:block w-32 h-32 bg-blue-300/10 backdrop-blur-sm rounded-full border border-white/10" 
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
