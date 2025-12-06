import React, { useEffect, useState } from 'react';
import Filters from './Filters';

const TIERS = [
  { id: 'S', label: 'S', color: '#ff7f7f' },
  { id: 'A', label: 'A', color: '#ffbf7f' },
  { id: 'B', label: 'B', color: '#ffff7f' },
  { id: 'C', label: 'C', color: '#7fff7f' },
  { id: 'D', label: 'D', color: '#7fbfff' },
];

const TierList = () => {
  const [characters, setCharacters] = useState([]);
  const [elements, setElements] = useState([]);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeElement, setActiveElement] = useState(null);
  const [activePath, setActivePath] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/characters.json').then(res => res.json()),
      fetch('/data/elements.json').then(res => res.json()),
      fetch('/data/paths.json').then(res => res.json())
    ])
      .then(([charsData, elementsData, pathsData]) => {
        // Load from localStorage if available (admin edits)
        const saved = localStorage.getItem('tierListData');
        setCharacters(saved ? JSON.parse(saved) : charsData);
        setElements(elementsData);
        setPaths(pathsData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load data", err);
        setLoading(false);
      });
  }, []);

  const filteredCharacters = characters.filter(char => {
    if (activeElement && char.element.id !== activeElement) return false;
    if (activePath && char.path.id !== activePath) return false;
    return true;
  });

  if (loading) {
    return <div className="text-center text-white p-10">Loading assets...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <Filters 
        activeElement={activeElement} 
        setActiveElement={setActiveElement}
        activePath={activePath}
        setActivePath={setActivePath}
        elements={elements}
        paths={paths}
      />

      {/* Tier List Container - READ ONLY */}
      <div className="flex flex-col border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-900 shadow-2xl">
        {TIERS.map(tier => {
          const tierChars = filteredCharacters.filter(c => c.tier === tier.id);
          
          return (
            <div key={tier.id} className="flex border-b border-gray-700 last:border-b-0">
              {/* Tier Label */}
              <div 
                className="w-24 flex items-center justify-center font-bold text-3xl shrink-0"
                style={{ backgroundColor: tier.color }}
              >
                {tier.label}
              </div>
              
              {/* Characters */}
              <div className="flex-1 p-4 bg-gray-950/50 min-h-[120px]">
                <div className="flex flex-wrap gap-3">
                  {tierChars.map(char => (
                    <div
                      key={char.id}
                      className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${char.rarity === 5 ? 'border-yellow-500' : 'border-purple-500'} transition-transform hover:scale-110 hover:z-10`}
                      title={char.name}
                    >
                      <img
                        src={char.image}
                        alt={char.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unranked Pool */}
      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
         <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <span>Character Pool</span>
          <span className="text-sm font-normal text-gray-400">
            ({filteredCharacters.filter(c => !['S','A','B','C','D'].includes(c.tier)).length} characters)
          </span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {filteredCharacters
            .filter(c => !['S','A','B','C','D'].includes(c.tier))
            .map(char => (
              <div
                key={char.id}
                className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${char.rarity === 5 ? 'border-yellow-500' : 'border-purple-500'} transition-transform hover:scale-110`}
                title={char.name}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TierList;
