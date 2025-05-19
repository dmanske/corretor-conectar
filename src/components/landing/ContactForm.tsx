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

  return (
    <section id="cadastro" className="py-20 px-6 bg-blue-50/50 dark:bg-blue-950/50 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Entre em Contato</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preencha o formulário abaixo e nossa equipe entrará em contato para mostrar como o Corretor Conecta pode transformar sua gestão imobiliária
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-blue-900/40 rounded-xl p-6 md:p-8 shadow-xl backdrop-blur-sm border border-blue-100 dark:border-blue-700/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-blue-900 dark:text-blue-100">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/60 border ${
                    formErrors.name ? 'border-red-500' : 'border-blue-200 dark:border-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-50`}
                  placeholder="Seu nome completo"
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-blue-900 dark:text-blue-100">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/60 border ${
                    formErrors.email ? 'border-red-500' : 'border-blue-200 dark:border-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-50`}
                  placeholder="seu@email.com"
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2 text-blue-900 dark:text-blue-100">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/60 border ${
                  formErrors.phone ? 'border-red-500' : 'border-blue-200 dark:border-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-50`}
                placeholder="(99) 99999-9999"
              />
              {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-blue-900 dark:text-blue-100">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/60 border ${
                  formErrors.message ? 'border-red-500' : 'border-blue-200 dark:border-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-50`}
                placeholder="Como podemos ajudar você? Conte um pouco sobre suas necessidades..."
              ></textarea>
              {formErrors.message && <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>}
            </div>

            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
              >
                Enviar Mensagem
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute top-20 right-10 w-60 h-60 rounded-full bg-blue-300/10 blur-3xl"></div>
    </section>
  );
};

export default ContactForm;
