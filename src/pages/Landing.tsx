
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserPlus, 
  FaChartLine, 
  FaBirthdayCake, 
  FaFileAlt, 
  FaMoneyBillWave, 
  FaDesktop 
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

  return (
    <div className="min-h-screen bg-background font-sans">
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
            <span className="text-xl font-semibold text-primary">Corretor</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#funcionalidades" className="text-foreground hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#beneficios" className="text-foreground hover:text-primary transition-colors">Benefícios</a>
            <a href="#depoimentos" className="text-foreground hover:text-primary transition-colors">Depoimentos</a>
            <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a 
              href="#cadastro"
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors hidden md:block"
            >
              Buscar Agora
            </a>
          </div>
        </div>
      </motion.nav>
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-600 -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="max-w-2xl text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p 
              className="text-sm font-medium mb-2"
              variants={fadeInUp}
            >
              App para imobiliárias e corretores
            </motion.p>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              variants={fadeInUp}
            >
              Sua Solução Completa para Gestão Imobiliária
            </motion.h1>
            <motion.p 
              className="text-lg mb-8"
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
              <a 
                href="#cadastro" 
                className="bg-white text-primary px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Buscar Agora
              </a>
              <a 
                href="#funcionalidades" 
                className="border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Saiba Mais
              </a>
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
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                <FaUserPlus size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Cadastro de Clientes</h3>
              <p className="text-muted-foreground">
                Mantenha todos os dados dos seus clientes organizados, com histórico completo e alertas para datas importantes.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                <FaChartLine size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Gestão de Vendas</h3>
              <p className="text-muted-foreground">
                Acompanhe todas as suas vendas em tempo real, com estatísticas e relatórios detalhados para análise completa do seu negócio.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                <FaBirthdayCake size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Alertas de Aniversário</h3>
              <p className="text-muted-foreground">
                Nunca mais esqueça datas importantes dos seus clientes. Receba notificações automáticas e fortaleça o relacionamento.
              </p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                <FaFileAlt size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Relatórios Detalhados</h3>
              <p className="text-muted-foreground">
                Acesso completo a relatórios de suas vendas, clientes e comissões para ajudar na tomada de decisões estratégicas.
              </p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                <FaMoneyBillWave size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Gestão Financeira</h3>
              <p className="text-muted-foreground">
                Controle suas finanças de forma completa e integrada, com fluxo de caixa, despesas e previsões de entradas de caixa.
              </p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
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
      <section id="beneficios" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">Simplifique seu Trabalho com o Corretor Conecta</h2>
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
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center mt-1">
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
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center mt-1">
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
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center mt-1">
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
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center mt-1">
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
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center mt-1">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Emissão rápida de relatórios para reuniões</span>
                </motion.li>
              </ul>
              
              <motion.a 
                href="#cadastro"
                className="inline-block mt-8 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
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
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/lovable-uploads/a757818f-7692-4600-9a21-8bfbcefc9da5.png" 
                    alt="Dashboard do Sistema" 
                    className="w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <span>Notificações Integradas</span>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span>Relatórios Inteligentes</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-600 -z-10"></div>
        <div className="max-w-7xl mx-auto text-center">
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
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
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
                      className={`w-full p-3 rounded-lg border ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700`}
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Seu e-mail"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700`}
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Seu telefone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                  
                  <div>
                    <textarea
                      name="message"
                      placeholder="Sua mensagem"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border ${
                        formErrors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700`}
                    ></textarea>
                    {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Cadastrar
                  </button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="depoimentos" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-2">O que Dizem Nossos Usuários</h2>
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
              className="bg-card rounded-xl p-6 border border-border shadow-sm"
              variants={fadeInUp}
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
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
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
              className="bg-card rounded-xl p-6 border border-border shadow-sm"
              variants={fadeInUp}
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
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
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
      <footer id="contato" className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
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
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
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
