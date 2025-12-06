import React from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import CharacterCard from './CharacterCard';

const TierRow = ({ id, label, color, characters, isPublic = false }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    disabled: isPublic // Disable drop in public view
  });

  // Convert hex color to RGB for background opacity
  const getBgColor = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div className="flex w-full min-h-[160px] border-b border-gray-800 last:border-b-0 bg-hsr-dark/30 backdrop-blur-sm">
      {/* Header */}
      <div 
        className="w-24 sm:w-32 md:w-40 flex-shrink-0 flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ 
          backgroundColor: getBgColor(color, 0.15),
          borderRight: `2px solid ${color}`
        }}
      >
        {/* Background Glow */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: `linear-gradient(135deg, ${color} 0%, transparent 100%)` 
          }}
        />
        
        <span 
          className="text-4xl sm:text-5xl md:text-6xl font-black relative z-10 drop-shadow-lg"
          style={{ color: color }}
        >
          {label}
        </span>
        
        {/* Decorative Line */}
        <div 
          className="w-12 h-1 mt-2 rounded-full opacity-50"
          style={{ backgroundColor: color }}
        />
      </div>
      
      {/* Content */}
      <SortableContext 
        id={id}
        items={characters.map(c => c.id)}
        strategy={rectSortingStrategy}
      >
        <div 
          ref={setNodeRef}
          className={`flex-1 p-4 sm:p-6 flex flex-wrap gap-4 items-start content-start transition-all duration-300 ${
            isOver && !isPublic 
              ? 'bg-hsr-gold/10 ring-2 ring-hsr-gold ring-inset shadow-[inset_0_0_20px_rgba(232,197,71,0.2)]' 
              : ''
          }`}
        >
          {characters.length === 0 ? (
            !isPublic && (
              <div className="w-full h-full min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-700/50 rounded-xl">
                <span className="text-gray-600 text-sm italic flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                  Drop characters here
                  <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                </span>
              </div>
            )
          ) : (
            characters.map(char => (
              <CharacterCard 
                key={char.id} 
                character={char} 
                disableLink={!isPublic}
                variant="compact"
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default TierRow;
