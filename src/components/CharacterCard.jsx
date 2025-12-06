import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';

const RARITY_CONFIG = {
  5: {
    border: 'border-hsr-gold',
    shadow: 'shadow-[0_0_15px_rgba(232,197,71,0.5)]',
    bg: 'bg-gradient-to-b from-hsr-gold/20 to-hsr-gold/5',
    text: 'text-hsr-gold'
  },
  4: {
    border: 'border-hsr-purple',
    shadow: 'shadow-[0_0_15px_rgba(155,89,208,0.5)]',
    bg: 'bg-gradient-to-b from-hsr-purple/20 to-hsr-purple/5',
    text: 'text-hsr-purple'
  },
  3: {
    border: 'border-blue-500',
    shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    bg: 'bg-gradient-to-b from-blue-500/20 to-blue-500/5',
    text: 'text-blue-400'
  },
};

const CharacterCard = ({ character, onClick, disableLink = false, variant = 'full' }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: character.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const config = RARITY_CONFIG[character.rarity] || RARITY_CONFIG[3];

  // Compact is for Tier List, Full is for Character List
  const isCompact = variant === 'compact';

  const CardContent = (
    <div 
      className={`relative overflow-hidden border transition-all duration-300 group hover:-translate-y-1 ${
        isCompact 
          ? 'w-20 h-28 sm:w-24 sm:h-32 m-1 rounded-lg border-2' // Compact dimensions
          : 'w-full aspect-[2/3] rounded-2xl' // Full dimensions
      } ${
        character.rarity === 5 
          ? 'border-hsr-gold/30 hover:border-hsr-gold hover:shadow-glow-gold' 
          : 'border-hsr-purple/30 hover:border-hsr-purple hover:shadow-glow-purple'
      } ${isCompact ? 'bg-hsr-dark' : 'bg-hsr-elevated/30'}`}
    >
      {/* Image Container */}
      <div className={`relative w-full h-full overflow-hidden flex items-center justify-center ${
        isCompact ? '' : 'bg-hsr-dark/20'
      }`}>
        <img 
          src={isCompact ? character.image : (character.preview || character.portrait || character.image)} 
          alt={character.name} 
          className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 ${
            isCompact ? 'scale-110' : '' // Zoom in slightly more for compact
          }`}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 ${
          isCompact ? 'opacity-60' : 'via-black/20 opacity-80 group-hover:opacity-60'
        }`} />

        {/* Icons - Only show on Full variant or if needed */}
        {!isCompact && (
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            <div className="w-8 h-8 rounded-full bg-black/40 p-1.5 border border-white/10 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img src={character.element.icon} alt={character.element.name} className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="w-8 h-8 rounded-full bg-black/40 p-1.5 border border-white/10 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 delay-75">
              <img src={character.path.icon} alt={character.path.name} className="w-full h-full object-contain drop-shadow-md" />
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className={`absolute bottom-0 left-0 right-0 z-20 ${
          isCompact ? 'p-1' : 'p-4 transform transition-transform duration-300 group-hover:-translate-y-1'
        }`}>
          {!isCompact && (
            <div className="flex gap-0.5 mb-1 justify-center opacity-90">
              {[...Array(character.rarity)].map((_, i) => (
                <span key={i} className={`text-[10px] drop-shadow-lg ${
                  character.rarity === 5 ? 'text-hsr-gold' : 'text-hsr-purple'
                }`}>★</span>
              ))}
            </div>
          )}
          <h3 className={`font-bold text-center leading-tight line-clamp-1 drop-shadow-lg ${
            isCompact ? 'text-[10px]' : 'text-sm sm:text-base'
          } ${
            character.rarity === 5 ? 'text-hsr-gold' : 'text-hsr-purple'
          }`}>
            {character.name}
          </h3>
        </div>
        
        {/* Shine Effect */}
        {!isCompact && (
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full" />
        )}
      </div>
    </div>
  );

  if (disableLink) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
        {CardContent}
      </div>
    );
  }

  return (
    <Link to={`/characters/${character.id}`} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {CardContent}
    </Link>
  );
};

export default CharacterCard;
