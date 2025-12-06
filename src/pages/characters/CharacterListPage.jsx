import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import CharacterCard from '../../components/CharacterCard';
import Filters from '../../components/Filters';

const CharacterListPage = () => {
  const [characters, setCharacters] = useState([]);
  const [elements, setElements] = useState([]);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeElement, setActiveElement] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [activeRarity, setActiveRarity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/data/characters.json').then(res => res.json()),
      fetch('/data/elements.json').then(res => res.json()),
      fetch('/data/paths.json').then(res => res.json())
    ])
      .then(([charsData, elementsData, pathsData]) => {
        setCharacters(charsData);
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
    if (activeRarity && char.rarity !== activeRarity) return false;
    if (searchQuery && !char.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-hsr-gold/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-hsr-gold rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-hsr-gradient bg-clip-text text-transparent drop-shadow-lg"
        >
          Database Karakter
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          Jelajahi {characters.length} Trailblazer di seluruh galaksi
        </motion.p>
      </div>

      {/* Controls Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        {/* Filters Panel */}
        <div className="lg:col-span-3">
          <Filters 
            activeElement={activeElement} 
            setActiveElement={setActiveElement}
            activePath={activePath}
            setActivePath={setActivePath}
            elements={elements}
            paths={paths}
          />
        </div>

        {/* Search & Rarity */}
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-hsr-elevated/50 backdrop-blur-md p-6 rounded-2xl border border-hsr-gold/20">
            <h3 className="text-hsr-gold font-bold mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-hsr-gold rounded-full"></span>
              Cari
            </h3>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari karakter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-hsr-dark/80 border border-gray-700 rounded-xl focus:outline-none focus:border-hsr-gold focus:ring-1 focus:ring-hsr-gold transition-all text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Rarity Filter */}
          <div className="bg-hsr-elevated/50 backdrop-blur-md p-6 rounded-2xl border border-hsr-gold/20">
            <h3 className="text-hsr-gold font-bold mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-hsr-gold rounded-full"></span>
              Rarity
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveRarity(null)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 border ${
                  !activeRarity
                    ? 'bg-gray-700 text-white border-gray-500'
                    : 'bg-hsr-dark/50 text-gray-400 border-gray-700 hover:bg-gray-700'
                }`}
              >
                Semua
              </button>
              {[5, 4].map(rarity => (
                <button
                  key={rarity}
                  onClick={() => setActiveRarity(activeRarity === rarity ? null : rarity)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 border ${
                    activeRarity === rarity
                      ? rarity === 5 
                        ? 'bg-hsr-gold text-hsr-dark border-hsr-gold shadow-glow-gold' 
                        : 'bg-hsr-purple text-white border-hsr-purple shadow-glow-purple'
                      : 'bg-hsr-dark/50 text-gray-400 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {rarity} ★
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {filteredCharacters.map((char, index) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="flex justify-center"
          >
            <CharacterCard character={char} variant="full" />
          </motion.div>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌌</div>
          <p className="text-xl text-gray-400">Tidak ada karakter ditemukan di sektor ini</p>
        </div>
      )}
    </div>
  );
};

export default CharacterListPage;
