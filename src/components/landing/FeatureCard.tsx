
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

export type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  isActive: boolean;
};

const FeatureCard = ({ icon, title, description, gradient, isActive }: FeatureProps) => {
  return (
    <motion.div 
      className={`rounded-xl p-6 blue-glass ${isActive ? 'ring-2 ring-blue-500/50' : ''}`}
      whileHover={{
        y: -10,
        boxShadow: "0 25px 25px -5px rgba(59, 130, 246, 0.25)"
      }}
      transition={{
        duration: 0.5
      }}
    >
      <motion.div 
        className={`h-16 w-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-500/20`}
        whileHover={{
          scale: 1.1,
          rotate: 5
        }} 
        transition={{
          type: "spring",
          stiffness: 300
        }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
