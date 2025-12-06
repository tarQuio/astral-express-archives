import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaStar, FaBolt, FaBook, FaLayerGroup } from 'react-icons/fa';

const CharacterDetailPage = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skills');

  useEffect(() => {
    fetch('/data/characters.json')
      .then(res => res.json())
      .then(data => {
        const char = data.find(c => c.id === id);
        setCharacter(char);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load character", err);
        setLoading(false);
      });
  }, [id]);

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

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Character Not Found</h2>
        <Link to="/characters" className="text-hsr-gold hover:underline">Return to Database</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'skills', label: 'Abilities', icon: FaBolt },
    { id: 'eidolons', label: 'Eidolons', icon: FaStar },
    { id: 'builds', label: 'Builds', icon: FaLayerGroup },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img 
            src={character.portrait || character.image} 
            alt={character.name} 
            className="w-full h-full object-cover object-top opacity-50 blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-hsr-space/60 via-hsr-space/80 to-hsr-space" />
          <div className="absolute inset-0 bg-gradient-to-r from-hsr-space via-transparent to-hsr-space/80" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-6 lg:px-8 flex flex-col justify-end pb-12">
          <Link
            to="/characters"
            className="absolute top-8 left-6 lg:left-8 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-hsr-gold/50"
          >
            <FaArrowLeft /> Back to Database
          </Link>

          <div className="flex flex-col md:flex-row items-end gap-8">
            {/* Portrait */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 shrink-0 rounded-2xl overflow-hidden border-4 border-hsr-gold/30 shadow-glow-gold clip-corners bg-hsr-dark"
            >
              <img 
                src={character.image} 
                alt={character.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 mb-4"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`px-3 py-1 rounded-full text-sm font-bold border ${
                  character.rarity === 5 
                    ? 'bg-hsr-gold/20 text-hsr-gold border-hsr-gold' 
                    : 'bg-hsr-purple/20 text-hsr-purple border-hsr-purple'
                }`}>
                  {character.rarity} ★
                </div>
                <div className="flex items-center gap-2 text-gray-300 bg-black/30 px-3 py-1 rounded-full border border-white/10">
                  <img src={character.element.icon} alt={character.element.name} className="w-5 h-5" />
                  <span>{character.element.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 bg-black/30 px-3 py-1 rounded-full border border-white/10">
                  <img src={character.path.icon} alt={character.path.name} className="w-5 h-5" />
                  <span>{character.path.name}</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 drop-shadow-lg">
                {character.name}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-6 lg:px-8 mt-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-800 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-lg font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'text-hsr-gold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-hsr-gold shadow-glow-gold rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {character.skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-hsr-elevated/50 backdrop-blur-sm border border-hsr-gold/10 rounded-2xl p-6 hover:border-hsr-gold/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-5">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-full bg-hsr-dark border-2 border-hsr-gold/30 flex items-center justify-center overflow-hidden group-hover:border-hsr-gold transition-colors shadow-lg">
                          <img src={skill.icon} alt={skill.name} className="w-16 h-16 object-contain" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-hsr-dark px-3 py-0.5 rounded-full border border-gray-700 text-xs font-bold text-gray-300 whitespace-nowrap shadow-md">
                          {skill.type}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-hsr-gold transition-colors">
                          {skill.name}
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                          {skill.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'eidolons' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {character.eidolons.map((eidolon, index) => (
                  <div 
                    key={index}
                    className="bg-hsr-elevated/50 backdrop-blur-sm border border-hsr-purple/20 rounded-2xl p-6 hover:border-hsr-purple/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-5">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full bg-hsr-dark border-2 border-hsr-purple/30 flex items-center justify-center overflow-hidden group-hover:border-hsr-purple transition-colors shadow-lg">
                          <img src={eidolon.icon} alt={eidolon.name} className="w-12 h-12 object-contain" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-hsr-purple rounded-full flex items-center justify-center font-bold text-white border-2 border-hsr-dark shadow-md">
                          E{eidolon.level}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-hsr-purple transition-colors">
                          {eidolon.name}
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                          {eidolon.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'builds' && (
              <div className="bg-hsr-elevated/30 border border-dashed border-gray-700 rounded-2xl p-12 text-center">
                <FaLayerGroup className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">Build Recommendations Coming Soon</h3>
                <p className="text-gray-500">
                  We are currently analyzing combat data to provide the best builds for {character.name}.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CharacterDetailPage;
