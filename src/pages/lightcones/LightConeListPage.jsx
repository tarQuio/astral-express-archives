import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import Filters from '../../components/Filters';

const LightConeListPage = () => {
  const [lightCones, setLightCones] = useState([]);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePath, setActivePath] = useState(null);
  const [activeRarity, setActiveRarity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/data/light_cones.json').then(res => res.json()),
      fetch('/data/paths.json').then(res => res.json())
    ])
      .then(([lcData, pathsData]) => {
        setLightCones(lcData);
        setPaths(pathsData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load data", err);
        setLoading(false);
      });
  }, []);

  const filteredLightCones = lightCones.filter(lc => {
    if (activePath && lc?.path?.id !== activePath) return false;
    if (activeRarity && lc?.rarity !== activeRarity) return false;
    if (searchQuery && !lc?.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
          Light Cone
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          Koleksi {lightCones.length} memori dari masa lalu
        </motion.p>
      </div>

      {/* Controls Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        {/* Filters Panel - Using the new Filters component */}
        <div className="lg:col-span-3">
          <Filters 
            activePath={activePath}
            setActivePath={setActivePath}
            paths={paths}
            elements={[]} // Explicitly pass empty array
            activeElement={null}
            setActiveElement={() => {}}
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
                placeholder="Cari light cone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-hsr-dark/80 border border-gray-700 rounded-xl focus:outline-none focus:border-hsr-gold focus:ring-1 focus:ring-hsr-gold transition-all text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Rarity */}
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
              {[5, 4, 3].map(rarity => (
                <button
                  key={rarity}
                  onClick={() => setActiveRarity(activeRarity === rarity ? null : rarity)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 border ${
                    activeRarity === rarity
                      ? rarity === 5 
                        ? 'bg-hsr-gold text-hsr-dark border-hsr-gold shadow-glow-gold' 
                        : rarity === 4
                          ? 'bg-hsr-purple text-white border-hsr-purple shadow-glow-purple'
                          : 'bg-blue-500 text-white border-blue-500 shadow-glow-blue'
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

      {/* Light Cone Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {filteredLightCones.map((lc, index) => (
          <motion.div
            key={lc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className={`bg-hsr-elevated/30 rounded-2xl overflow-hidden border transition-all duration-300 group hover:-translate-y-2 ${
              lc.rarity === 5 
                ? 'border-hsr-gold/30 hover:border-hsr-gold hover:shadow-glow-gold' 
                : lc.rarity === 4
                  ? 'border-hsr-purple/30 hover:border-hsr-purple hover:shadow-glow-purple'
                  : 'border-blue-500/30 hover:border-blue-500 hover:shadow-glow-blue'
            }`}
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-hsr-dark/20 p-2 flex items-center justify-center">
              <img 
                src={lc?.portrait || lc?.icon} 
                alt={lc?.name} 
                className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110 relative z-10"
              />
              
              {/* Holographic Glass Shine Effect */}
              <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                {/* Prismatic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 via-blue-300/30 via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out mix-blend-color-dodge transform skew-x-12" />
                
                {/* Sharp Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent w-1/2 -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-700 ease-out delay-100 mix-blend-overlay transform -skew-x-12" />
              </div>

              <div className="absolute top-2 right-2 z-30">
                {lc?.path?.icon && (
                  <div className="w-10 h-10 rounded-full bg-black/70 p-1.5 border border-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img src={lc.path.icon} alt={lc?.path?.name} className="w-full h-full object-contain opacity-90" />
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-hsr-dark/50 border-t border-white/5">
              <div className="flex gap-0.5 mb-2 justify-center">
                {[...Array(lc.rarity || 0)].map((_, i) => (
                  <span key={i} className={`text-[10px] ${
                    lc.rarity === 5 ? 'text-hsr-gold' : lc.rarity === 4 ? 'text-hsr-purple' : 'text-blue-400'
                  }`}>★</span>
                ))}
              </div>
              <h3 className={`font-bold text-center text-sm mb-3 line-clamp-2 h-10 flex items-center justify-center ${
                lc.rarity === 5 ? 'text-hsr-gold' : lc.rarity === 4 ? 'text-hsr-purple' : 'text-blue-300'
              }`}>
                {lc?.name}
              </h3>
            {/* Stats Display */}
            {lc?.stats && (
              <div className="mb-4 bg-hsr-dark/40 p-2 rounded-lg border border-white/5 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-hsr-dark px-2 text-[10px] text-hsr-gold border border-hsr-gold/30 rounded-full">
                  Lv. 80
                </div>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">HP</div>
                    <div className="font-mono text-sm font-bold text-gray-300">{lc.stats.hp}</div>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">ATK</div>
                    <div className="font-mono text-sm font-bold text-gray-300">{lc.stats.atk}</div>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">DEF</div>
                    <div className="font-mono text-sm font-bold text-gray-300">{lc.stats.def}</div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredLightCones.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌌</div>
          <p className="text-xl text-gray-400">Tidak ada light cone ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default LightConeListPage;
