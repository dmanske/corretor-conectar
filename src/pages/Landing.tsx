import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaChartLine, FaBirthdayCake, FaFileAlt, FaMoneyBillWave, FaDesktop, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaArrowRight, FaRegLightbulb } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
const Landing = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    toast
  } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
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

  // Rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
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
    const {
      name,
      value
    } = e.target;
    let newValue = value;
    if (name === 'phone') {
      newValue = formatPhone(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    const error = validateField(name, newValue);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
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
      description: "Entraremos em contato em breve."
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
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  const staggerContainer = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
  const cardHover = {
    rest: {
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3
      }
    }
  };
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
  const featureData = [{
    icon: <FaUserPlus size={28} />,
    title: "Cadastro de Clientes",
    description: "Mantenha todos os dados dos seus clientes organizados, com histórico completo e alertas para datas importantes.",
    gradient: "from-blue-400 to-blue-600"
  }, {
    icon: <FaChartLine size={28} />,
    title: "Gestão de Vendas",
    description: "Acompanhe todas as suas vendas em tempo real, com estatísticas e relatórios detalhados para análise completa do seu negócio.",
    gradient: "from-blue-500 to-indigo-600"
  }, {
    icon: <FaBirthdayCake size={28} />,
    title: "Alertas de Aniversário",
    description: "Nunca mais esqueça datas importantes dos seus clientes. Receba notificações automáticas e fortaleça o relacionamento.",
    gradient: "from-blue-400 to-cyan-600"
  }, {
    icon: <FaFileAlt size={28} />,
    title: "Relatórios Detalhados",
    description: "Acesso completo a relatórios de suas vendas, clientes e comissões para ajudar na tomada de decisões estratégicas.",
    gradient: "from-cyan-400 to-blue-600"
  }, {
    icon: <FaMoneyBillWave size={28} />,
    title: "Gestão Financeira",
    description: "Controle suas finanças de forma completa e integrada, com fluxo de caixa, despesas e previsões de entradas de caixa.",
    gradient: "from-indigo-400 to-blue-600"
  }, {
    icon: <FaDesktop size={28} />,
    title: "Interface Amigável",
    description: "Interface intuitiva e responsiva, disponível para desktop, tablet e dispositivos móveis de qualquer lugar.",
    gradient: "from-blue-600 to-indigo-500"
  }];
  return <div className="min-h-screen bg-background font-sans overflow-hidden">
      {/* Gradient Orbs - Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/20 blur-[120px] animate-[float_15s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-blue-500/30 blur-[120px] animate-[float_18s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-[40%] left-[25%] w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 blur-[100px] animate-[float_20s_ease-in-out_infinite]"></div>
      </div>

      {/* Navbar */}
      <motion.nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${isScrolled ? 'blue-glass' : 'bg-transparent'}`} initial={{
      y: -100
    }} animate={{
      y: 0
    }} transition={{
      duration: 0.7,
      ease: "easeOut"
    }}>
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
      </motion.nav>
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 bg-slate-950 rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 dark:from-blue-800 dark:to-blue-950 -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzBoMnYyaC0yek0zMCAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <motion.div className="max-w-2xl text-white" initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer}>
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
              <motion.a href="#cadastro" className="relative overflow-hidden bg-white text-blue-600 px-6 py-3 rounded-full font-medium shadow-xl shadow-blue-900/30 group" whileHover={{
              y: -5,
              boxShadow: "0 25px 25px -5px rgba(30, 64, 175, 0.2)"
            }} transition={{
              duration: 0.3
            }}>
                <span className="relative z-10">Buscar Agora</span>
                <motion.span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white z-0 opacity-0" whileHover={{
                opacity: 1
              }} transition={{
                duration: 0.3
              }}></motion.span>
              </motion.a>
              <motion.a href="#funcionalidades" className="border border-white/40 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-all duration-300" whileHover={{
              scale: 1.05,
              borderColor: "rgba(255, 255, 255, 0.6)"
            }} whileTap={{
              scale: 0.95
            }}>
                Saiba Mais
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute bottom-0 right-0 transform translate-y-1/4 -z-1">
          <motion.div className="hidden md:block w-72 h-72 bg-blue-400/10 backdrop-blur-md rounded-full border border-white/10" animate={{
          y: [0, -20, 0]
        }} transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut"
        }} />
        </div>
        
        <div className="absolute top-20 right-40 -z-1">
          <motion.div className="hidden md:block w-32 h-32 bg-blue-300/10 backdrop-blur-sm rounded-full border border-white/10" animate={{
          y: [0, -15, 0]
        }} transition={{
          repeat: Infinity,
          duration: 4,
          repeatType: "reverse",
          ease: "easeInOut"
        }} />
        </div>
      </section>
      
      {/* Features Section */}
      <section id="funcionalidades" className="py-20 px-6 relative overflow-hidden">
        <motion.div className="text-center mb-16" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
          <h2 className="text-3xl font-bold mb-2 text-blue-gradient">Funcionalidades Poderosas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubra todas as ferramentas que o Corretor Conecta oferece para tornar seu 
            negócio imobiliário mais produtivo e rentável.
          </p>
        </motion.div>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.3
      }}>
          {featureData.map((feature, index) => <motion.div key={index} className={`rounded-xl p-6 blue-glass ${activeFeature === index ? 'ring-2 ring-blue-500/50' : ''}`} variants={fadeInUp} whileHover={{
          y: -10,
          boxShadow: "0 25px 25px -5px rgba(59, 130, 246, 0.25)"
        }} transition={{
          duration: 0.5
        }}>
              <motion.div className={`h-16 w-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-500/20`} whileHover={{
            scale: 1.1,
            rotate: 5
          }} transition={{
            type: "spring",
            stiffness: 300
          }}>
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">{feature.title}</h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>)}
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/5 blur-3xl"></div>
        <div className="absolute -top-10 right-0 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/5 blur-3xl"></div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefícios" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-950 dark:to-blue-900/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzBoMnYyaC0yek0zMCAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40 bg-gray-900"></div>
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
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  
                </div>
                
                <motion.div className="absolute -bottom-4 -right-4 blue-glass p-4 shadow-xl" whileHover={{
                scale: 1.1,
                x: -5,
                y: -5
              }} transition={{
                type: "spring",
                stiffness: 400
              }}>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"></div>
                    <span className="text-blue-800 dark:text-blue-200">Notificações Integradas</span>
                  </div>
                </motion.div>
                
                
                
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
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzBoMnYyaC0yek0zMCAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Animated circles */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="bg-slate-950">
            <motion.h2 className="text-3xl font-bold text-white mb-4" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.7
          }}>
              Pronto para <span className="text-blue-300">Revolucionar</span> sua Gestão Imobiliária?
            </motion.h2>
            <motion.p className="text-blue-100 mb-8 max-w-2xl mx-auto" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.7,
            delay: 0.1
          }}>
              Cadastre-se para receber mais informações sobre o aplicativo e começar a usar hoje mesmo.
            </motion.p>
            
            <div id="cadastro" className="max-w-md mx-auto">
              <motion.div className="blue-glass p-6 rounded-xl shadow-2xl border border-white/20" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} whileHover={{
              boxShadow: "0 25px 50px -12px rgba(29, 78, 216, 0.25)"
            }}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <motion.div whileHover={{
                    scale: 1.02
                  }} transition={{
                    duration: 0.2
                  }}>
                      <input type="text" name="name" placeholder="Seu nome" value={formData.name} onChange={handleChange} className={`w-full p-3 rounded-lg border bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 ${formErrors.name ? 'border-red-500' : 'border-white/20'}`} />
                    </motion.div>
                    {formErrors.name && <p className="text-red-300 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <motion.div whileHover={{
                    scale: 1.02
                  }} transition={{
                    duration: 0.2
                  }}>
                      <input type="email" name="email" placeholder="Seu e-mail" value={formData.email} onChange={handleChange} className={`w-full p-3 rounded-lg border bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 ${formErrors.email ? 'border-red-500' : 'border-white/20'}`} />
                    </motion.div>
                    {formErrors.email && <p className="text-red-300 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  
                  <div>
                    <motion.div whileHover={{
                    scale: 1.02
                  }} transition={{
                    duration: 0.2
                  }}>
                      <input type="text" name="phone" placeholder="Seu telefone" value={formData.phone} onChange={handleChange} className={`w-full p-3 rounded-lg border bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 ${formErrors.phone ? 'border-red-500' : 'border-white/20'}`} />
                    </motion.div>
                    {formErrors.phone && <p className="text-red-300 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                  
                  <div>
                    <motion.div whileHover={{
                    scale: 1.02
                  }} transition={{
                    duration: 0.2
                  }}>
                      <textarea name="message" placeholder="Sua mensagem" rows={4} value={formData.message} onChange={handleChange} className={`w-full p-3 rounded-lg border bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 ${formErrors.message ? 'border-red-500' : 'border-white/20'}`}></textarea>
                    </motion.div>
                    {formErrors.message && <p className="text-red-300 text-sm mt-1">{formErrors.message}</p>}
                  </div>
                  
                  <motion.button type="submit" className="w-full bg-white text-blue-700 py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 hover:bg-blue-50 overflow-hidden relative group" whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }}>
                    <span className="relative z-10 flex items-center justify-center">
                      Cadastrar
                      <motion.span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white z-0 opacity-0" whileHover={{
                      opacity: 1
                    }} transition={{
                      duration: 0.3
                    }}></motion.span>
                    </span>
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
          <motion.div className="text-center mb-16" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">O que Dizem Nossos Usuários</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Confira as histórias de sucesso de corretores e profissionais que transformaram seu negócio com o Corretor Conecta.
            </p>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{
          once: true
        }}>
            {[{
            text: "O Corretor Conecta revolucionou minha forma de trabalhar. Antes passava horas organizando planilhas, hoje todos os dados dos meus clientes e vendas estão a um clique de distância. Isso aumentou minha produtividade em 300%.",
            author: "Rodrigo Alvares",
            role: "Corretor Autônomo",
            initials: "RA"
          }, {
            text: "A função de alertas de aniversário do sistema me ajuda a manter uma relação próxima com clientes. Já fechei 3 negócios apenas por lembrar de parabenizar clientes antigos no dia certo. Fantástico!",
            author: "Julia Rodrigues",
            role: "Diretora de Imobiliária",
            initials: "JR"
          }].map((testimonial, index) => <motion.div key={index} className="blue-glass rounded-xl p-6 shadow-xl" variants={fadeInUp} whileHover={{
            y: -5,
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
          }} transition={{
            duration: 0.5
          }}>
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex gap-1">
                      {Array(5).fill(0).map((_, i) => <motion.svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" initial={{
                    scale: 0,
                    rotate: -15
                  }} animate={{
                    scale: 1,
                    rotate: 0
                  }} transition={{
                    delay: i * 0.1 + 0.3,
                    type: "spring"
                  }}>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </motion.svg>)}
                    </div>
                  </div>
                  
                  <blockquote className="text-foreground mb-4 flex-grow text-blue-800 dark:text-blue-200">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <motion.div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4 text-white shadow-lg shadow-blue-500/30" whileHover={{
                  scale: 1.1,
                  rotate: 5
                }} transition={{
                  type: "spring"
                }}>
                      <span className="text-lg font-bold">{testimonial.initials}</span>
                    </motion.div>
                    <div>
                      <p className="font-bold text-blue-700 dark:text-blue-300">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }} transition={{
          repeat: Infinity,
          duration: 8
        }} />
          
          <motion.div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl" animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }} transition={{
          repeat: Infinity,
          duration: 10,
          delay: 1
        }} />
        </div>
      </section>
      
      {/* Tips Section */}
      <motion.section className="py-16 px-6 relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-950 dark:to-blue-900/70" initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }}>
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <motion.div className="inline-block p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4" whileHover={{
            rotate: 15,
            scale: 1.1
          }} transition={{
            type: "spring",
            stiffness: 300
          }}>
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
            {[{
            title: "Mantenha Contato",
            description: "Crie um sistema para manter contato regular com clientes antigos e leads. Relacionamento é tudo neste mercado."
          }, {
            title: "Conhecimento Local",
            description: "Seja um especialista em sua região. Conheça detalhes sobre escolas, comércio, transporte e tendências locais."
          }, {
            title: "Marketing Digital",
            description: "Invista em marketing digital e mídias sociais para aumentar sua presença online e gerar novos leads."
          }].map((tip, index) => <motion.div key={index} className="blue-glass p-6 rounded-xl" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1 + 0.2,
            duration: 0.5
          }} whileHover={{
            y: -5,
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
          }}>
                <h3 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-300">{tip.title}</h3>
                <p className="text-muted-foreground">
                  {tip.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </motion.section>
      
      {/* Footer */}
      <footer id="contato" className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzBoMnYyaC0yek0zMCAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Sobre nós</h3>
              <p className="text-blue-200/80 text-sm">
                O Corretor Conecta é a solução completa para gestão imobiliária, desenvolvida especialmente para corretores e imobiliárias que buscam eficiência e organização.
              </p>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }}>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Links Rápidos</h3>
              <ul className="space-y-2 text-blue-200/80 text-sm">
                {["Home", "Funcionalidades", "Benefícios", "Depoimentos"].map((item, i) => <motion.li key={i} whileHover={{
                x: 5
              }} transition={{
                duration: 0.2
              }}>
                    <a href={`#${item === "Home" ? "" : item.toLowerCase()}`} className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </motion.li>)}
              </ul>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }}>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Suporte</h3>
              <ul className="space-y-2 text-blue-200/80 text-sm">
                {["FAQ", "Central de Ajuda", "Tutoriais", "Contato"].map((item, i) => <motion.li key={i} whileHover={{
                x: 5
              }} transition={{
                duration: 0.2
              }}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </motion.li>)}
              </ul>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }}>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Contato</h3>
              <ul className="space-y-2 text-blue-200/80 text-sm">
                <motion.li className="flex items-center gap-2" whileHover={{
                x: 5
              }} transition={{
                duration: 0.2
              }}>
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  <span>contato@corretorconecta.com.br</span>
                </motion.li>
                <motion.li className="flex items-center gap-2" whileHover={{
                x: 5
              }} transition={{
                duration: 0.2
              }}>
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  <span>+55 (11) 99999-9999</span>
                </motion.li>
                <motion.li className="flex items-center gap-2" whileHover={{
                x: 5
              }} transition={{
                duration: 0.2
              }}>
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  <span>São Paulo, SP</span>
                </motion.li>
              </ul>
              
              <div className="flex space-x-4 mt-4">
                {[{
                Icon: FaFacebookF,
                color: "hover:bg-blue-600"
              }, {
                Icon: FaTwitter,
                color: "hover:bg-blue-400"
              }, {
                Icon: FaInstagram,
                color: "hover:bg-pink-600"
              }, {
                Icon: FaLinkedinIn,
                color: "hover:bg-blue-700"
              }].map((social, i) => <motion.a key={i} href="#" className={`h-10 w-10 rounded-full bg-white/10 flex items-center justify-center ${social.color} transition-colors`} whileHover={{
                y: -5
              }} whileTap={{
                scale: 0.9
              }}>
                    <social.Icon className="text-white" />
                  </motion.a>)}
              </div>
            </motion.div>
          </div>
          
          <motion.div className="border-t border-blue-800 mt-12 pt-8 text-center" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.5
        }}>
            <p className="text-blue-200/60 text-sm">© 2025 Corretor Conecta. Todos os direitos reservados.</p>
          </motion.div>
        </div>
      </footer>
    </div>;
};
export default Landing;