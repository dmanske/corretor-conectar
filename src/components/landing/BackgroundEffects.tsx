
import { motion } from 'framer-motion';

const BackgroundEffects = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/20 blur-[120px] animate-[float_15s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-blue-500/30 blur-[120px] animate-[float_18s_ease-in-out_infinite_reverse]"></div>
      <div className="absolute top-[40%] left-[25%] w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 blur-[100px] animate-[float_20s_ease-in-out_infinite]"></div>
    </div>
  );
};

export default BackgroundEffects;
