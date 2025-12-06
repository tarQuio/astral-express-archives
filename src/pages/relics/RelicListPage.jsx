import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaCubes, FaCircle } from 'react-icons/fa';

const RelicListPage = () => {
  const [relics, setRelics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('cavern');

  useEffect(() => {
    fetch('/data/relics.json')
      .then(res => res.json())
      .then(data => {
        setRelics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load relics", err);
        setLoading(false);
      });
  }, []);

  const filteredRelics = relics.filter(relic => {
    if (searchQuery && !relic.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const cavernSets = filteredRelics.filter(r => parseInt(r.id) < 300);
  const planarSets = filteredRelics.filter(r => parseInt(r.id) >= 300);

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
          Relic Archive
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          Ancient artifacts of power
        </motion.p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search relic sets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-hsr-elevated/50 backdrop-blur-md border border-hsr-gold/20 rounded-xl focus:outline-none focus:border-hsr-gold focus:ring-1 focus:ring-hsr-gold transition-all text-white placeholder-gray-500 shadow-lg"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-hsr-elevated/50 backdrop-blur-md p-1 rounded-xl border border-hsr-gold/20 inline-flex">
          <button
            onClick={() => setActiveTab('cavern')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'cavern'
                ? 'bg-hsr-gold text-black shadow-glow-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Cavern Relics
          </button>
          <button
            onClick={() => setActiveTab('planar')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'planar'
                ? 'bg-hsr-purple text-white shadow-glow-purple'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Planar Ornaments
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'cavern' ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-hsr-gold/20 rounded-lg text-hsr-gold">
                <FaCubes size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Cavern Relics</h2>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400 border border-gray-700">4-Piece Sets</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cavernSets.map((relic, index) => (
                <motion.div
                  key={relic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="bg-hsr-elevated/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-hsr-gold/50 hover:bg-hsr-elevated transition-all duration-300 group"
                >
                  <div className="flex gap-6 mb-6">
                    <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 border-hsr-gold/30 group-hover:border-hsr-gold group-hover:shadow-glow-gold transition-all duration-300 bg-hsr-dark">
                      <img src={relic.icon} alt={relic.name} className="w-full h-full object-cover p-2" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-hsr-gold transition-colors">{relic.name}</h3>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-hsr-dark rounded text-xs text-gray-400 border border-gray-700">Cavern of Corrosion</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 bg-hsr-dark/50 rounded-xl p-4 border border-gray-800">
                    {relic.desc.map((bonus, i) => (
                      <div key={i} className="text-sm leading-relaxed">
                        <span className="text-hsr-gold font-bold mr-2">{i === 0 ? '2-Pc:' : '4-Pc:'}</span>
                        <span className="text-gray-300">{bonus}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-hsr-purple/20 rounded-lg text-hsr-purple">
                <FaCircle size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Planar Ornaments</h2>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400 border border-gray-700">2-Piece Sets</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {planarSets.map((relic, index) => (
                <motion.div
                  key={relic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="bg-hsr-elevated/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-hsr-purple/50 hover:bg-hsr-elevated transition-all duration-300 group"
                >
                  <div className="flex gap-6 mb-6">
                    <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 border-hsr-purple/30 group-hover:border-hsr-purple group-hover:shadow-glow-purple transition-all duration-300 bg-hsr-dark">
                      <img src={relic.icon} alt={relic.name} className="w-full h-full object-cover p-2" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-hsr-purple transition-colors">{relic.name}</h3>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-hsr-dark rounded text-xs text-gray-400 border border-gray-700">Simulated Universe</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-hsr-dark/50 rounded-xl p-4 border border-gray-800">
                    <div className="text-sm leading-relaxed">
                      <span className="text-hsr-purple font-bold mr-2">2-Pc:</span>
                      <span className="text-gray-300">{relic.desc[0]}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RelicListPage;
