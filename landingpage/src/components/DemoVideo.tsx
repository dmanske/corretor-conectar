import React from 'react';

const DemoVideo: React.FC = () => {
  return (
    <iframe
      src="https://www.youtube.com/embed/fewNwzfqhGg?rel=0&modestbranding=1&controls=0&showinfo=0&fs=1&disablekb=1"
      title="Demonstração ConectaPro"
      allow="autoplay; encrypted-media"
      allowFullScreen
      className="w-full aspect-video"
      style={{ maxWidth: '1000px', margin: '0 auto', display: 'block' }}
    />
  );
};

export default DemoVideo; 