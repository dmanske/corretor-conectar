
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id="contato" className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzBoMnYyaC0yek0zMCAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Sobre nós</h3>
            <p className="text-blue-200/80 text-sm">
              O Corretor Conecta é a solução completa para gestão imobiliária, desenvolvida especialmente para corretores e imobiliárias que buscam eficiência e organização.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Links Rápidos</h3>
            <ul className="space-y-2 text-blue-200/80 text-sm">
              {["Home", "Funcionalidades", "Benefícios", "Depoimentos"].map((item, i) => (
                <motion.li 
                  key={i} 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href={`#${item === "Home" ? "" : item.toLowerCase()}`} className="hover:text-white transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Suporte</h3>
            <ul className="space-y-2 text-blue-200/80 text-sm">
              {["FAQ", "Central de Ajuda", "Tutoriais", "Contato"].map((item, i) => (
                <motion.li 
                  key={i} 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Contato</h3>
            <ul className="space-y-2 text-blue-200/80 text-sm">
              <motion.li 
                className="flex items-center gap-2" 
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>contato@corretorconecta.com.br</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2" 
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span>+55 (11) 99999-9999</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2" 
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <span>São Paulo, SP</span>
              </motion.li>
            </ul>
            
            <div className="flex space-x-4 mt-4">
              {[
                { Icon: FaFacebookF, color: "hover:bg-blue-600" },
                { Icon: FaTwitter, color: "hover:bg-blue-400" },
                { Icon: FaInstagram, color: "hover:bg-pink-600" },
                { Icon: FaLinkedinIn, color: "hover:bg-blue-700" }
              ].map((social, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  className={`h-10 w-10 rounded-full bg-white/10 flex items-center justify-center ${social.color} transition-colors`} 
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.Icon className="text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-blue-800 mt-12 pt-8 text-center" 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-blue-200/60 text-sm">© 2025 Corretor Conecta. Todos os direitos reservados.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
