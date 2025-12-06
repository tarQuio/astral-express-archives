import React from 'react';
import { motion } from 'framer-motion';

const Filters = ({ activeElement, setActiveElement, activePath, setActivePath, elements = [], paths = [] }) => {
  const hasElements = elements && elements.length > 0;

  return (
    <div className={`grid grid-cols-1 ${hasElements ? 'lg:grid-cols-2' : ''} gap-8`}>
      {/* Combat Type (Elements) - Only render if elements exist */}
      {hasElements && (
        <div className="bg-hsr-elevated/50 backdrop-blur-md p-6 rounded-2xl border border-hsr-gold/20 flex flex-col h-full">
          <h3 className="text-hsr-gold font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-3 border-b border-hsr-gold/10 pb-4">
            <span className="w-1.5 h-5 bg-hsr-gold rounded-full shadow-[0_0_10px_rgba(232,197,71,0.5)]"></span>
            Tipe Tempur
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveElement(null)}
              className={`col-span-2 sm:col-span-4 py-3 rounded-xl font-bold transition-all duration-300 border flex items-center justify-center gap-2 ${
                !activeElement
                  ? 'bg-hsr-gold text-hsr-dark border-hsr-gold shadow-glow-gold scale-[1.02]'
                  : 'bg-hsr-dark/50 text-gray-400 border-gray-700 hover:border-hsr-gold/50 hover:text-white hover:bg-hsr-elevated'
              }`}
            >
              Semua Tipe
            </button>
            
            {elements.map(el => (
              <button
                key={el.id}
                onClick={() => setActiveElement(activeElement === el.id ? null : el.id)}
                className={`group relative p-3 rounded-xl transition-all duration-300 border flex flex-col items-center gap-2 overflow-hidden ${
                  activeElement === el.id
                    ? 'bg-gradient-to-br from-hsr-elevated to-hsr-dark border-hsr-gold shadow-glow-gold scale-105 z-10'
                    : 'bg-hsr-dark/30 border-gray-700 hover:border-hsr-gold/50 hover:bg-hsr-elevated'
                }`}
              >
                {/* Background Glow */}
                <div 
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
                    activeElement === el.id ? 'opacity-20' : 'group-hover:opacity-10'
                  }`}
                  style={{ backgroundColor: el.color }}
                />

                <div className="relative w-10 h-10 flex items-center justify-center">
                  <img 
                    src={el.icon} 
                    alt={el.name} 
                    className={`w-full h-full object-contain transition-all duration-300 ${
                      activeElement === el.id 
                        ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                        : 'grayscale group-hover:grayscale-0 group-hover:scale-110'
                    }`} 
                  />
                </div>
                
                <span className={`text-xs font-semibold transition-colors duration-300 ${
                  activeElement === el.id ? 'text-hsr-gold' : 'text-gray-400 group-hover:text-gray-200'
                }`}>
                  {el.name}
                </span>

                {activeElement === el.id && (
                  <motion.div
                    layoutId="activeElementBorder"
                    className="absolute inset-0 border-2 border-hsr-gold rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Path */}
      <div className={`bg-hsr-elevated/50 backdrop-blur-md p-6 rounded-2xl border border-hsr-purple/20 flex flex-col h-full ${!hasElements ? 'w-full' : ''}`}>
        <h3 className="text-hsr-purple font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-3 border-b border-hsr-purple/10 pb-4">
          <span className="w-1.5 h-5 bg-hsr-purple rounded-full shadow-[0_0_10px_rgba(155,89,208,0.5)]"></span>
          Path
        </h3>
        
        <div className={`grid grid-cols-2 sm:grid-cols-4 ${!hasElements ? 'md:grid-cols-6 lg:grid-cols-8' : ''} gap-3`}>
          <button
            onClick={() => setActivePath(null)}
            className={`col-span-2 sm:col-span-4 ${!hasElements ? 'md:col-span-2' : ''} py-3 rounded-xl font-bold transition-all duration-300 border flex items-center justify-center gap-2 ${
              !activePath
                ? 'bg-hsr-purple text-white border-hsr-purple shadow-glow-purple scale-[1.02]'
                : 'bg-hsr-dark/50 text-gray-400 border-gray-700 hover:border-hsr-purple/50 hover:text-white hover:bg-hsr-elevated'
            }`}
          >
            Semua Path
          </button>
          
          {paths.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePath(activePath === p.id ? null : p.id)}
              className={`group relative p-3 rounded-xl transition-all duration-300 border flex flex-col items-center gap-2 overflow-hidden ${
                activePath === p.id
                  ? 'bg-gradient-to-br from-hsr-elevated to-hsr-dark border-hsr-purple shadow-glow-purple scale-105 z-10'
                  : 'bg-hsr-dark/30 border-gray-700 hover:border-hsr-purple/50 hover:bg-hsr-elevated'
              }`}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <img 
                  src={p.icon} 
                  alt={p.name} 
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    activePath === p.id 
                      ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                      : 'grayscale group-hover:grayscale-0 group-hover:scale-110'
                  }`} 
                />
              </div>
              
              <span className={`text-xs font-semibold transition-colors duration-300 ${
                activePath === p.id ? 'text-hsr-purple' : 'text-gray-400 group-hover:text-gray-200'
              }`}>
                {p.name}
              </span>

              {activePath === p.id && (
                <motion.div
                  layoutId="activePathBorder"
                  className="absolute inset-0 border-2 border-hsr-purple rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
