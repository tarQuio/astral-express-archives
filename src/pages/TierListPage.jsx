import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLock, FaCog } from 'react-icons/fa';
import TierRow from '../components/TierRow';
import Filters from '../components/Filters';

const TIERS = [
  { id: 'S', label: 'S', color: '#ff7f7f' },
  { id: 'A', label: 'A', color: '#ffbf7f' },
  { id: 'B', label: 'B', color: '#ffff7f' },
  { id: 'C', label: 'C', color: '#7fff7f' },
  { id: 'D', label: 'D', color: '#7fbfff' },
];

const TierListPage = () => {
  const [characters, setCharacters] = useState([]);
  const [tierRankings, setTierRankings] = useState({});
  const [elements, setElements] = useState([]);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeElement, setActiveElement] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [activeMode, setActiveMode] = useState('moc');

  useEffect(() => {
    Promise.all([
      fetch('/data/characters.json').then(res => res.json()),
      fetch('/data/elements.json').then(res => res.json()),
      fetch('/data/paths.json').then(res => res.json()),
      fetch('/data/tier_rankings.json').then(res => res.json()).catch(() => ({})) // Handle missing file gracefully
    ])
      .then(([charsData, elementsData, pathsData, rankingsData]) => {
        setCharacters(charsData);
        setElements(elementsData);
        setPaths(pathsData);
        setTierRankings(rankingsData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load data", err);
        setLoading(false);
      });
  }, []);

  const getCharacterTier = (charId) => {
    if (tierRankings[charId] && tierRankings[charId][activeMode]) {
      return tierRankings[charId][activeMode];
    }
    // Fallback to default tier in character data or 'D' if missing
    const char = characters.find(c => c.id === charId);
    return char ? char.tier : 'D';
  };

  const filteredCharacters = characters
    .map(char => ({
      ...char,
      tier: getCharacterTier(char.id)
    }))
    .filter(char => {
      if (activeElement && char.element.id !== activeElement) return false;
      if (activePath && char.path.id !== activePath) return false;
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
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-hsr-gradient bg-clip-text text-transparent drop-shadow-lg"
          >
            Meta Tier List
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg flex items-center gap-2"
          >
            <FaLock className="text-hsr-gold/50" size={14} />
            Current meta rankings for Memory of Chaos
          </motion.p>
        </div>
        
        <Link
          to="/admin/tier-list"
          className="flex items-center gap-2 px-6 py-3 bg-hsr-dark border border-gray-700 rounded-xl hover:border-hsr-gold/50 hover:text-hsr-gold transition-all group"
        >
          <FaCog className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-semibold">Admin Panel</span>
        </Link>
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-hsr-elevated/50 backdrop-blur-md p-1 rounded-xl border border-hsr-gold/20 inline-flex gap-1">
          {[
            { id: 'moc', label: 'Memory of Chaos', icon: '⚔️' },
            { id: 'pf', label: 'Pure Fiction', icon: '📚' },
            { id: 'as', label: 'Apocalyptic Shadow', icon: '🌑' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeMode === mode.id
                  ? 'bg-hsr-gold text-black shadow-glow-gold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-10">
        <Filters 
          activeElement={activeElement} 
          setActiveElement={setActiveElement}
          activePath={activePath}
          setActivePath={setActivePath}
          elements={elements}
          paths={paths}
        />
      </div>

      {/* Tier List */}
      <motion.div 
        key={activeMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-2 border-hsr-gold/20 rounded-2xl overflow-hidden bg-hsr-elevated/30 backdrop-blur-md shadow-2xl"
      >
        {TIERS.map(tier => (
          <TierRow 
            key={tier.id}
            id={tier.id} 
            label={tier.label} 
            color={tier.color} 
            characters={filteredCharacters.filter(c => c.tier === tier.id)}
            isPublic={true}
          />
        ))}
      </motion.div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        * Rankings are based on overall performance in current endgame content
      </div>
    </div>
  );
};

export default TierListPage;
