
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dmanske-deep-purple via-black to-black"></div>
      <div className="absolute inset-0 bg-futuristic-grid grid-bg opacity-30"></div>

      {/* Gradient blobs */}
      <div className="absolute top-10 -left-20 w-96 h-96 bg-dmanske-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow"></div>
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-dmanske-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-dmanske-green rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow animation-delay-4000"></div>

      {/* Abstract data flows */}
      <div className="hidden lg:block absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dmanske-purple/50 to-transparent animate-data-flow"></div>
      <div className="hidden lg:block absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dmanske-blue/50 to-transparent animate-data-flow animation-delay-3000"></div>
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dmanske-green/30 to-transparent animate-data-flow animation-delay-5000"></div>
    </div>
  );
};

export default AnimatedBackground;
