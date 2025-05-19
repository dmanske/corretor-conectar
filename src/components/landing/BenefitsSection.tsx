import { motion } from 'framer-motion';
const BenefitsSection = () => {
  return <section id="benefícios" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-950 dark:to-blue-900/70 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div className="md:w-1/2" initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">Simplifique seu Trabalho com o Corretor Conecta</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nossos usuários economizam, em média, <span className="text-blue-600 dark:text-blue-400 font-semibold">10 horas por semana</span> com as funcionalidades do Corretor Conecta, podendo usar esse tempo para gerar mais clientes financeiros.
            </p>
            
            <ul className="space-y-4">
              {["Gestão completa de clientes e leads", "Controle detalhado de vendas e comissões", "Sistema rápido otimizado para dispositivos móveis", "Notificações automáticas de datas importantes", "Emissão rápida de relatórios para reuniões"].map((item, i) => <motion.li key={i} className="flex items-start gap-3" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1 + 0.1
            }}>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mt-1 shadow-lg shadow-blue-500/20">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-blue-800 dark:text-blue-200">{item}</span>
                </motion.li>)}
            </ul>
            
            <motion.a href="#cadastro" className="inline-block mt-8 btn-blue-glow" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              Experimente Agora
            </motion.a>
          </motion.div>
          
          <motion.div className="md:w-1/2" initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <motion.div className="relative" whileHover={{
            scale: 1.03
          }} transition={{
            duration: 0.5
          }}>
              <div className="rounded-lg overflow-hidden shadow-2xl"></div>
              
              
              
              <motion.div className="absolute top-1/2 -translate-y-1/2 -left-14 blue-glass p-4 shadow-xl hidden lg:block" initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} whileHover={{
              scale: 1.1,
              x: 5
            }} transition={{
              type: "spring",
              stiffness: 300,
              delay: 0.3
            }}>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"></div>
                  <span className="text-blue-800 dark:text-blue-200">Análise em Tempo Real</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default BenefitsSection;