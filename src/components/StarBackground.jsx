import React from 'react';

const StarBackground = () => {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-hsr-space via-hsr-dark to-black" />
      
      {/* Animated Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          }}
        />
      ))}
      
      {/* Nebula Effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hsr-purple opacity-10 blur-3xl rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hsr-gold opacity-10 blur-3xl rounded-full" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-hsr-space/80 to-transparent" />
    </div>
  );
};

export default StarBackground;
