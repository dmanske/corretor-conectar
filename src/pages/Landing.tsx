
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserPlus, 
  FaChartLine, 
  FaBirthdayCake, 
  FaFileAlt, 
  FaMoneyBillWave, 
  FaDesktop,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Handle scroll events for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form validation
  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        error = value.length < 3 ? 'Nome deve ter pelo menos 3 caracteres' : '';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        error = !emailRegex.test(value) ? 'Email inválido' : '';
        break;
      case 'phone':
        const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        error = !phoneRegex.test(value) ? 'Telefone inválido. Use formato: (99) 99999-9999' : '';
        break;
      case 'message':
        error = value.length < 10 ? 'Mensagem deve ter pelo menos 10 caracteres' : '';
        break;
      default:
        break;
    }
    return error;
  };

  // Format phone number as user types
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let newValue = value;
    if (name === 'phone') {
      newValue = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    const error = validateField(name, newValue);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      message: validateField('message', formData.message)
    };
    
    setFormErrors(errors);
    
    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, corrija os erros antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    
    // Form is valid, submit data
    toast({
      title: "Formulário enviado!",
      description: "Entraremos em contato em breve.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const buttonHover = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const cardHover = {
    rest: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
    hover: { 
      y: -10, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans overflow-hidden">
      {/* Gradient Orbs - Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/30 to-blue-500/20 blur-[120px] animate-[float_15s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-500/20 to-emerald-500/30 blur-[120px] animate-[float_18s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-[40%] left-[25%] w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-[100px] animate-[float_20s_ease-in-out_infinite]"></div>
      </div>

      {/* Navbar */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-primary">Corretor<span className="text-blue-500">Conecta</span></span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#funcionalidades" className="text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">Funcionalidades</a>
            <a href="#beneficios" className="text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">Benefícios</a>
            <a href="#depoimentos" className="text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">Depoimentos</a>
            <a href="#contato" className="text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">Contato</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              aria-label={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.button>
            <motion.a 
              href="#cadastro"
              className="bg-gradient-to-r from-primary to-blue-500 text-white px-6 py-2 rounded-full shadow-lg shadow-primary/20"
              whileHover="hover"
              variants={buttonHover}
            >
              Buscar Agora
            </motion.a>
          </div>
        </div>
      </motion.nav>
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 dark:from-primary/90 dark:to-blue-700/90 -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="max-w-2xl text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p 
              className="text-sm font-medium mb-2 text-white/80"
              variants={fadeInUp}
            >
              App para imobiliárias e corretores
            </motion.p>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              variants={fadeInUp}
            >
              Sua Solução Completa para Gestão Imobiliária
            </motion.h1>
            <motion.p 
              className="text-lg mb-8 text-white/90"
              variants={fadeInUp}
            >
              Organize seus clientes, vendas e comissões em um só lugar. 
              Desenvolvido especialmente para corretores que buscam escalabilidade e 
              eficiência em seus negócios.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={fadeInUp}
            >
              <motion.a 
                href="#cadastro" 
                className="bg-white text-primary px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-xl shadow-white/20"
                whileHover="hover"
                variants={buttonHover}
              >
                Buscar Agora
              </motion.a>
              <motion.a 
                href="#funcionalidades" 
                className="border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
                whileHover="hover"
                variants={buttonHover}
              >
                Saiba Mais
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="funcionalidades" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-2">Funcionalidades Poderosas</h2>
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
            {/* Feature 1 */}
            <motion.div 
              className="rounded-xl p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-white/10 dark:border-gray-700/30"
              variants={fadeInUp}
              whileHover="hover"
              initial="rest"
              variants={cardHover}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4 text-white shadow-lg shadow-emerald-400/20">
                <FaUserPlus size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Cadastro de Clientes</h3>
              <p className="text-muted-foreground">
                Mantenha todos os dados dos seus clientes organizados, com histórico completo e alertas para datas importantes.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="rounded-xl p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-white/10 dark:border-gray-700/30"
              variants={fadeInUp}
              whileHover="hover"
              initial="rest"
              variants={cardHover}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-400/20">
                <FaChartLine size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Gestão de Vendas</h3>
              <p className="text-muted-foreground">
                Acompanhe todas as suas vendas em tempo real, com estatísticas e relatórios detalhados para análise completa do seu negócio.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="rounded-xl p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-white/10 dark:border-gray-700/30"
              variants={fadeInUp}
              whileHover="hover"
              initial="rest"
              variants={cardHover}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 text-white shadow-lg shadow-purple-400/20">
                <FaBirthdayCake size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Alertas de Aniversário</h3>
              <p className="text-muted-foreground">
                Nunca mais esqueça datas importantes dos seus clientes. Receba notificações automáticas e fortaleça o relacionamento.
              </p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div 
              className="rounded-xl p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-white/10 dark:border-gray-700/30"
              variants={fadeInUp}
              whileHover="hover"
              initial="rest"
              variants={cardHover}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-4 text-white shadow-lg shadow-teal-400/20">
                <FaFileAlt size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Relatórios Detalhados</h3>
              <p className="text-muted-foreground">
                Acesso completo a relatórios de suas vendas, clientes e comissões para ajudar na tomada de decisões estratégicas.
              </p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div 
              className="rounded-xl p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-white/10 dark:border-gray-700/30"
              variants={fadeInUp}
              whileHover="hover"
              initial="rest"
              variants={cardHover}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 text-white shadow-lg shadow-amber-400/20">
                <FaMoneyBillWave size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Gestão Financeira</h3>
              <p className="text-muted-foreground">
                Controle suas finanças de forma completa e integrada, com fluxo de caixa, despesas e previsões de entradas de caixa.
              </p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div 
              className="rounded-xl p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-white/10 dark:border-gray-700/30"
              variants={fadeInUp}
              whileHover="hover"
              initial="rest"
              variants={cardHover}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mb-4 text-white shadow-lg shadow-indigo-400/20">
                <FaDesktop size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Interface Amigável</h3>
              <p className="text-muted-foreground">
                Interface intuitiva e responsiva, disponível para desktop, tablet e dispositivos móveis de qualquer lugar.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="beneficios" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzBoMnYyaC0yek0zMCAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Simplifique seu Trabalho com o Corretor Conecta</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nossos usuários economizam, em média, 10 horas por semana com as funcionalidades do Corretor Conecta, podendo usar esse tempo para gerar mais clientes financeiros.
              </p>
              
              <ul className="space-y-4">
                <motion.li 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center mt-1 shadow-lg shadow-emerald-400/20">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Gestão completa de clientes e leads</span>
                </motion.li>
                
                <motion.li 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center mt-1 shadow-lg shadow-emerald-400/20">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Controle detalhado de vendas e comissões</span>
                </motion.li>
                
                <motion.li 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center mt-1 shadow-lg shadow-emerald-400/20">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Sistema rápido otimizado para dispositivos móveis</span>
                </motion.li>
                
                <motion.li 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center mt-1 shadow-lg shadow-emerald-400/20">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Notificações automáticas de datas importantes</span>
                </motion.li>
                
                <motion.li 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center mt-1 shadow-lg shadow-emerald-400/20">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Emissão rápida de relatórios para reuniões</span>
                </motion.li>
              </ul>
              
              <motion.a 
                href="#cadastro"
                className="inline-block mt-8 bg-gradient-to-r from-primary to-blue-500 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Experimente Agora
              </motion.a>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden rounded-lg border border-white/10">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-lg border border-white/10 shadow-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="text-white/50 text-xs">Dashboard</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white/10 rounded-lg p-4 h-20"></div>
                          <div className="bg-white/10 rounded-lg p-4 h-20"></div>
                          <div className="bg-white/10 rounded-lg p-4 h-20"></div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 h-40 mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/10 rounded-lg p-4 h-24"></div>
                          <div className="bg-white/10 rounded-lg p-4 h-24"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 shadow-xl border border-white/10 dark:border-gray-700/30">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                    <span>Notificações Integradas</span>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 shadow-xl border border-white/10 dark:border-gray-700/30">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                    <span>Relatórios Inteligentes</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzBoMnYyaC0yek0zMCAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Animated circles */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Pronto para Revolucionar sua Gestão Imobiliária?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Cadastre-se para receber mais informações sobre o aplicativo e começar a usar hoje mesmo.
            </p>
            
            <div id="cadastro" className="max-w-md mx-auto">
              <motion.div 
                className="bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border bg-white/5 backdrop-blur-md text-white placeholder-white/60 ${
                        formErrors.name ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {formErrors.name && <p className="text-red-300 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Seu e-mail"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border bg-white/5 backdrop-blur-md text-white placeholder-white/60 ${
                        formErrors.email ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {formErrors.email && <p className="text-red-300 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Seu telefone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border bg-white/5 backdrop-blur-md text-white placeholder-white/60 ${
                        formErrors.phone ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {formErrors.phone && <p className="text-red-300 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                  
                  <div>
                    <textarea
                      name="message"
                      placeholder="Sua mensagem"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border bg-white/5 backdrop-blur-md text-white placeholder-white/60 ${
                        formErrors.message ? 'border-red-500' : 'border-white/20'
                      }`}
                    ></textarea>
                    {formErrors.message && <p className="text-red-300 text-sm mt-1">{formErrors.message}</p>}
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full bg-white text-primary py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-xl shadow-white/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cadastrar
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="depoimentos" className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">O que Dizem Nossos Usuários</h2>
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
            {/* Testimonial 1 */}
            <motion.div 
              className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-white/10 dark:border-gray-700/30 shadow-xl"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-foreground mb-4 flex-grow">
                  "O Corretor Conecta revolucionou minha forma de trabalhar. Antes passava horas organizando planilhas, hoje todos os dados dos meus clientes e vendas estão a um clique de distância. Isso aumentou minha produtividade em 300%."
                </blockquote>
                
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mr-4 text-white">
                    <span className="text-lg font-bold">RA</span>
                  </div>
                  <div>
                    <p className="font-bold">Rodrigo Alvares</p>
                    <p className="text-sm text-muted-foreground">Corretor Autônomo</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div 
              className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-white/10 dark:border-gray-700/30 shadow-xl"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-foreground mb-4 flex-grow">
                  "A função de alertas de aniversário do sistema me ajuda a manter uma relação próxima com clientes. Já fechei 3 negócios apenas por lembrar de parabenizar clientes antigos no dia certo. Fantástico!"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mr-4 text-white">
                    <span className="text-lg font-bold">JR</span>
                  </div>
                  <div>
                    <p className="font-bold">Julia Rodrigues</p>
                    <p className="text-sm text-muted-foreground">Diretora de Imobiliária</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer id="contato" className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzBoMnYyaC0yek0zMCAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sobre nós</h3>
              <p className="text-gray-400 text-sm">
                O Corretor Conecta é a solução completa para gestão imobiliária, desenvolvida especialmente para corretores e imobiliárias que buscam eficiência e organização.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a></li>
                <li><a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  <span>contato@corretorconecta.com.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  <span>+55 (11) 99999-9999</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  <span>São Paulo, SP</span>
                </li>
              </ul>
              
              <div className="flex space-x-4 mt-4">
                <motion.a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  whileHover={{ y: -3 }}
                >
                  <FaFacebookF className="text-white" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  whileHover={{ y: -3 }}
                >
                  <FaTwitter className="text-white" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  whileHover={{ y: -3 }}
                >
                  <FaInstagram className="text-white" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  whileHover={{ y: -3 }}
                >
                  <FaLinkedinIn className="text-white" />
                </motion.a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 Corretor Conecta. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
