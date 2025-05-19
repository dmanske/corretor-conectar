import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
type NavbarProps = {
  isScrolled: boolean;
};
const Navbar = ({
  isScrolled
}: NavbarProps) => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const navLinkHover = {
    rest: {
      width: "0%"
    },
    hover: {
      width: "100%",
      transition: {
        duration: 0.3
      }
    }
  };
  const buttonHover = {
    rest: {
      scale: 1
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} transition={{
    duration: 0.7,
    ease: "easeOut"
  }} className="">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div className="flex items-center" initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.7,
        delay: 0.2
      }}>
          <span className="text-xl font-semibold">
            <span className="text-blue-gradient">Corretor</span>
            <span className="text-blue-600">Conecta</span>
          </span>
        </motion.div>
        
        <motion.div className="hidden md:flex space-x-8" initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7,
        delay: 0.4
      }}>
          {['Funcionalidades', 'Benefícios', 'Depoimentos', 'Contato'].map((item, i) => <motion.a key={item} href={`#${item.toLowerCase()}`} className="text-foreground hover:text-blue-600 transition-colors relative" initial="rest" whileHover="hover">
              {item}
              <motion.span className="absolute bottom-0 left-0 h-0.5 bg-blue-600" variants={navLinkHover}></motion.span>
            </motion.a>)}
        </motion.div>
        
        <motion.div className="flex items-center space-x-4" initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.7,
        delay: 0.6
      }}>
          <motion.button onClick={toggleTheme} className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors text-blue-600 dark:text-blue-300" whileHover={{
          rotate: 180,
          scale: 1.1
        }} transition={{
          duration: 0.3
        }} aria-label={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </motion.button>
          <motion.a href="#cadastro" className="relative overflow-hidden btn-blue-glow group" whileHover="hover" whileTap={{
          scale: 0.95
        }} variants={buttonHover}>
            <span className="relative z-10 flex items-center">
              Buscar Agora 
              <motion.span className="ml-2" initial={{
              x: 0
            }} whileHover={{
              x: 5
            }} transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.6
            }}>
                <FaArrowRight />
              </motion.span>
            </span>
          </motion.a>
        </motion.div>
      </div>
    </motion.nav>;
};
export default Navbar;