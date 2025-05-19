
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const testimonials = [
    {
      text: "O Corretor Conecta revolucionou minha forma de trabalhar. Antes passava horas organizando planilhas, hoje todos os dados dos meus clientes e vendas estão a um clique de distância. Isso aumentou minha produtividade em 300%.",
      author: "Rodrigo Alvares",
      role: "Corretor Autônomo",
      initials: "RA"
    },
    {
      text: "A função de alertas de aniversário do sistema me ajuda a manter uma relação próxima com clientes. Já fechei 3 negócios apenas por lembrar de parabenizar clientes antigos no dia certo. Fantástico!",
      author: "Julia Rodrigues",
      role: "Diretora de Imobiliária",
      initials: "JR"
    }
  ];

  return (
    <section id="depoimentos" className="py-20 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16" 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">O que Dizem Nossos Usuários</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira as histórias de sucesso de corretores e profissionais que transformaram seu negócio com o Corretor Conecta.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8" 
          variants={staggerContainer} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="blue-glass rounded-xl p-6 shadow-xl" 
              variants={fadeInUp} 
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <motion.svg 
                        key={i} 
                        className="w-5 h-5 text-yellow-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg"
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </motion.svg>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-foreground mb-4 flex-grow text-blue-800 dark:text-blue-200">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center">
                  <motion.div 
                    className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4 text-white shadow-lg shadow-blue-500/30" 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring" }}
                  >
                    <span className="text-lg font-bold">{testimonial.initials}</span>
                  </motion.div>
                  <div>
                    <p className="font-bold text-blue-700 dark:text-blue-300">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            repeat: Infinity,
            duration: 8
          }}
        />
        
        <motion.div 
          className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl" 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            delay: 1
          }}
        />
      </div>
    </section>
  );
};

export default TestimonialsSection;
