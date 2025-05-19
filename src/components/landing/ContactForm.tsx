
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FormErrors = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 -z-10"></div>
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
          className="bg-slate-950"
        >
          <motion.h2 
            className="text-3xl font-bold text-white mb-4" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Pronto para <span className="text-blue-300">Revolucionar</span> sua Gestão Imobiliária?
          </motion.h2>
          <motion.p 
            className="text-blue-100 mb-8 max-w-2xl mx-auto" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Cadastre-se para receber mais informações sobre o aplicativo e começar a usar hoje mesmo.
          </motion.p>
          
          <div id="cadastro" className="max-w-md mx-auto">
            <motion.div 
              className="blue-glass p-6 rounded-xl shadow-2xl border border-white/20" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(29, 78, 216, 0.25)" }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Seu nome" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className={`w-full p-3 rounded-lg border bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 ${formErrors.name ? 'border-red-500' : 'border-white/20'}`} 
                    />
                  </motion.div>
                  {formErrors.name && <p className="text-red-300 text-sm mt-1">{formErrors.name}</p>}
                </div>
                
                <div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Seu e-mail" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className={`w-full p-3 rounded-lg border bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 ${formErrors.email ? 'border-red-500' : 'border-white/20'}`} 
                    />
                  </motion.div>
                  {formErrors.email && <p className="text-red-300 text-sm mt-1">{formErrors.email}</p>}
                </div>
                
                <div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input 
                      type="text" 
                      name="phone" 
                      placeholder="Seu telefone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className={`w-full p-3 rounded-lg border bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 ${formErrors.phone ? 'border-red-500' : 'border-white/20'}`} 
                    />
                  </motion.div>
                  {formErrors.phone && <p className="text-red-300 text-sm mt-1">{formErrors.phone}</p>}
                </div>
                
                <div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <textarea 
                      name="message" 
                      placeholder="Sua mensagem" 
                      rows={4} 
                      value={formData.message} 
                      onChange={handleChange} 
                      className={`w-full p-3 rounded-lg border bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 ${formErrors.message ? 'border-red-500' : 'border-white/20'}`}
                    ></textarea>
                  </motion.div>
                  {formErrors.message && <p className="text-red-300 text-sm mt-1">{formErrors.message}</p>}
                </div>
                
                <motion.button 
                  type="submit" 
                  className="w-full bg-white text-blue-700 py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 hover:bg-blue-50 overflow-hidden relative group" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Cadastrar
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white z-0 opacity-0" 
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    ></motion.span>
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
