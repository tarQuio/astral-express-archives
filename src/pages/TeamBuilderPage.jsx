import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaLayerGroup, FaSearch, FaInfoCircle, FaUsers, FaTrash, FaChevronRight } from 'react-icons/fa';

const TeamBuilderPage = () => {
  const [characters, setCharacters] = useState([]);
  const [team, setTeam] = useState([null, null, null, null]);
  const [roles, setRoles] = useState(['Main DPS', 'Support', 'Sustain', 'Flex']);
  const [teamName, setTeamName] = useState('My New Team');
  const [savedTeams, setSavedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);

  useEffect(() => {
    // Load characters
    fetch('/data/characters.json')
      .then(res => res.json())
      .then(data => {
        setCharacters(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load characters", err);
        setCharacters([]);
        setLoading(false);
      });

    // Load saved teams
    const saved = localStorage.getItem('hsr_saved_teams');
    if (saved) {
      setSavedTeams(JSON.parse(saved));
    }
  }, []);

  const saveTeam = () => {
    if (team.every(c => c === null)) return;
    
    const newTeamData = {
      id: Date.now(),
      name: teamName,
      characters: team,
      roles: roles,
      date: new Date().toISOString()
    };

    const updatedTeams = [...savedTeams, newTeamData];
    setSavedTeams(updatedTeams);
    localStorage.setItem('hsr_saved_teams', JSON.stringify(updatedTeams));
    alert('Team saved successfully!');
  };

  const loadTeam = (savedTeam) => {
    setTeam(savedTeam.characters);
    setRoles(savedTeam.roles || ['Main DPS', 'Support', 'Sustain', 'Flex']);
    setTeamName(savedTeam.name);
  };

  const deleteTeam = (id) => {
    const updatedTeams = savedTeams.filter(t => t.id !== id);
    setSavedTeams(updatedTeams);
    localStorage.setItem('hsr_saved_teams', JSON.stringify(updatedTeams));
  };

  const openCharacterModal = (index) => {
    setActiveSlotIndex(index);
    setIsModalOpen(true);
    setSearchQuery('');
  };

  const selectCharacter = (character) => {
    if (activeSlotIndex !== null) {
      const newTeam = [...team];
      newTeam[activeSlotIndex] = character;
      setTeam(newTeam);
      setIsModalOpen(false);
    }
  };

  const removeFromTeam = (index, e) => {
    e.stopPropagation(); // Prevent opening modal
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const updateRole = (index, newRole) => {
    const newRoles = [...roles];
    newRoles[index] = newRole;
    setRoles(newRoles);
  };

  const filteredCharacters = characters.filter(char => {
    if (searchQuery && !char.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Heuristic Mappings
  const MATERIAL_MAPPING = {
    'Destruction': 'Destruction Trace Materials',
    'Hunt': 'Hunt Trace Materials',
    'Erudition': 'Erudition Trace Materials',
    'Harmony': 'Harmony Trace Materials',
    'Nihility': 'Nihility Trace Materials',
    'Preservation': 'Preservation Trace Materials',
    'Abundance': 'Abundance Trace Materials',
    'Remembrance': 'Remembrance Trace Materials'
  };

  const RELIC_MAPPING = {
    'Physical': 'Champion of Streetwise Boxing',
    'Fire': 'Firesmith of Lava-Forging',
    'Ice': 'Hunter of Glacial Forest',
    'Thunder': 'Band of Sizzling Thunder',
    'Wind': 'Eagle of Twilight Line',
    'Quantum': 'Genius of Brilliant Stars',
    'Imaginary': 'Wastelander of Banditry Desert'
  };

  const calculateSynergy = () => {
    let score = 0;
    let feedback = [];
    const activeRoles = roles.filter((_, i) => team[i] !== null);
    
    // Basic Composition Check
    const hasSustain = activeRoles.includes('Sustain');
    const hasDPS = activeRoles.includes('Main DPS');
    const hasSupport = activeRoles.includes('Support');

    if (hasSustain) score += 30; else feedback.push("Missing Sustain (Healer/Shielder)");
    if (hasDPS) score += 30; else feedback.push("Missing Main DPS");
    if (hasSupport) score += 20; else feedback.push("Consider adding a Support");
    
    // SP Economy Estimate (Very rough)
    let spBalance = 0;
    activeRoles.forEach(r => {
      if (r === 'Main DPS') spBalance -= 1;
      if (r === 'Sub DPS') spBalance -= 0.5;
      if (r === 'Sustain') spBalance += 1;
      if (r === 'Support') spBalance += 0.5;
    });

    if (spBalance < -1) {
      score -= 10;
      feedback.push("Warning: High SP Consumption");
    } else if (spBalance > 1) {
      score += 10;
      feedback.push("Good SP Generation");
    } else {
      score += 10;
      feedback.push("Balanced SP Economy");
    }

    // Cap score
    score = Math.min(100, Math.max(0, score));

    return { score, feedback, spBalance };
  };

  const generateFarmingList = () => {
    const materials = new Set();
    const relics = new Set();

    team.forEach(char => {
      if (!char) return;
      if (char.path?.name) materials.add(MATERIAL_MAPPING[char.path.name] || 'Unknown Materials');
      if (char.element?.id) relics.add(RELIC_MAPPING[char.element.id] || 'Unknown Relics');
    });

    return { materials: Array.from(materials), relics: Array.from(relics) };
  };

  const analysis = calculateSynergy();
  const farming = generateFarmingList();

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
      <div className="mb-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black mb-2 bg-hsr-gradient bg-clip-text text-transparent drop-shadow-lg"
        >
          Team Builder
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Column: Saved Teams */}
        <div className="xl:col-span-1 order-2 xl:order-1">
           <div className="bg-hsr-elevated/50 backdrop-blur-md p-6 rounded-2xl border border-hsr-gold/20 h-full max-h-[800px] overflow-y-auto">
            <h3 className="text-hsr-gold font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2 border-b border-hsr-gold/10 pb-3">
              <FaLayerGroup /> Saved Teams
            </h3>
            
            {savedTeams.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">
                No saved teams yet.
              </div>
            ) : (
              <div className="space-y-3">
                {savedTeams.map(saved => (
                  <div key={saved.id} className="bg-hsr-dark/60 p-3 rounded-xl border border-white/5 hover:border-hsr-gold/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white text-sm truncate">{saved.name}</h4>
                      <button 
                        onClick={() => deleteTeam(saved.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {saved.characters.map((char, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden border border-gray-700">
                          {char && <img src={char.image} alt="" className="w-full h-full object-cover" />}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => loadTeam(saved)}
                      className="w-full py-1.5 bg-hsr-gold/10 text-hsr-gold text-xs font-bold rounded hover:bg-hsr-gold hover:text-black transition-all"
                    >
                      Load Team
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center/Right Column: Builder & Analysis */}
        <div className="xl:col-span-3 space-y-6 order-1 xl:order-2">
          {/* Team Name & Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-hsr-elevated/30 p-4 rounded-2xl border border-white/5">
            <div className="w-full md:w-1/2">
              <label className="text-xs text-gray-400 block mb-1 ml-1">Team Name</label>
              <input 
                type="text" 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-hsr-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-hsr-gold focus:outline-none"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={saveTeam}
                className="flex-1 md:flex-none px-6 py-2 bg-hsr-gold text-black font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-glow-gold"
              >
                Save Team
              </button>
              <button 
                onClick={() => {
                  setTeam([null, null, null, null]);
                  setTeamName('New Team');
                }}
                className="flex-1 md:flex-none px-6 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Active Team Slots */}
          <div className="bg-hsr-elevated/50 backdrop-blur-md p-6 rounded-3xl border border-hsr-gold/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-hsr-gold/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex flex-col gap-2">
                  {/* Role Selector */}
                  <select 
                    value={roles[index]}
                    onChange={(e) => updateRole(index, e.target.value)}
                    className="w-full bg-hsr-dark/80 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 focus:border-hsr-gold focus:outline-none"
                  >
                    <option>Main DPS</option>
                    <option>Sub DPS</option>
                    <option>Support</option>
                    <option>Sustain</option>
                    <option>Flex</option>
                  </select>

                  {/* Character Slot Card */}
                  <div 
                    onClick={() => openCharacterModal(index)}
                    className={`relative aspect-[3/4] rounded-2xl border-2 transition-all duration-300 flex items-center justify-center overflow-hidden group cursor-pointer ${
                      team[index] 
                        ? 'border-hsr-gold shadow-[0_0_15px_rgba(232,197,71,0.3)] bg-hsr-dark' 
                        : 'border-dashed border-gray-700 bg-hsr-dark/30 hover:border-hsr-gold/50 hover:bg-hsr-dark/50'
                    }`}
                  >
                    {team[index] ? (
                      <>
                        <img 
                          src={team[index].image} 
                          alt={team[index].name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        
                        <button
                          onClick={(e) => removeFromTeam(index, e)}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 z-20"
                          title="Hapus dari tim"
                        >
                          <FaTrash size={12} />
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center z-10">
                          <div className="flex justify-center items-center gap-2 mb-1">
                            <img src={team[index].element?.icon} className="w-5 h-5 drop-shadow-md" alt="" />
                            <img src={team[index].path?.icon} className="w-5 h-5 drop-shadow-md" alt="" />
                          </div>
                          <h3 className="font-bold text-white text-sm truncate px-1">{team[index].name}</h3>
                          <div className="flex justify-center gap-0.5 text-[10px] text-hsr-gold mt-1">
                            {[...Array(team[index].rarity)].map((_, i) => '★')}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 group-hover:text-hsr-gold transition-colors">
                        <FaPlus className="text-3xl mx-auto mb-2 opacity-50" />
                        <span className="text-sm font-medium">Select Character</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis & Farming Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Team Synergy */}
             <div className="bg-hsr-elevated/50 backdrop-blur-md p-6 rounded-2xl border border-hsr-gold/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-hsr-gold" /> Team Synergy
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`text-4xl font-black ${analysis.score >= 80 ? 'text-green-400' : analysis.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {analysis.score}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${analysis.score >= 80 ? 'bg-green-400' : analysis.score >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                        style={{ width: `${analysis.score}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Synergy Score</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {analysis.feedback.map((msg, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-hsr-gold">•</span>
                      {msg}
                    </div>
                  ))}
                  {analysis.feedback.length === 0 && (
                    <div className="text-sm text-green-400">Great team composition!</div>
                  )}
                </div>
             </div>

             {/* Farming Guide */}
             <div className="bg-hsr-elevated/50 backdrop-blur-md p-6 rounded-2xl border border-hsr-purple/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaLayerGroup className="text-hsr-purple" /> Farming Guide
                </h3>
                
                {team.some(c => c) ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Trace Materials</h4>
                      <div className="flex flex-wrap gap-2">
                        {farming.materials.map((mat, i) => (
                          <span key={i} className="px-2 py-1 bg-hsr-dark rounded border border-gray-700 text-xs text-gray-300">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Recommended Relics</h4>
                      <div className="flex flex-wrap gap-2">
                        {farming.relics.map((relic, i) => (
                          <span key={i} className="px-2 py-1 bg-hsr-dark rounded border border-gray-700 text-xs text-gray-300">
                            {relic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">Add characters to see farming recommendations.</p>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Character Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl bg-hsr-elevated border border-hsr-gold/20 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-hsr-dark/50">
                <h2 className="text-2xl font-bold text-white">Select Character</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <FaTimes size={24} className="text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Search */}
              <div className="p-6 pb-2">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search character..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-hsr-dark/80 border border-gray-700 rounded-xl focus:outline-none focus:border-hsr-gold transition-all text-white"
                    autoFocus
                  />
                </div>
              </div>

              {/* Character Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {filteredCharacters.map(char => {
                    const isInTeam = team.some(c => c?.id === char.id);
                    // Allow selecting if it's the current slot (replacing self) or not in team
                    const isCurrentSlot = team[activeSlotIndex]?.id === char.id;
                    const isDisabled = isInTeam && !isCurrentSlot;

                    return (
                      <motion.button
                        key={char.id}
                        onClick={() => selectCharacter(char)}
                        disabled={isDisabled}
                        whileHover={!isDisabled ? { scale: 1.05, y: -4 } : {}}
                        whileTap={{ scale: 0.95 }}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                          isCurrentSlot
                            ? 'border-hsr-gold ring-2 ring-hsr-gold/50'
                            : isDisabled 
                              ? 'border-gray-800 opacity-30 grayscale' 
                              : char.rarity === 5 
                                ? 'border-hsr-gold/30 hover:border-hsr-gold hover:shadow-glow-gold' 
                                : 'border-hsr-purple/30 hover:border-hsr-purple hover:shadow-glow-purple'
                        } bg-hsr-dark`}
                      >
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Rarity Stars */}
                        <div className="absolute top-1 right-1 flex gap-0.5">
                          {[...Array(char.rarity)].map((_, i) => (
                            <span key={i} className="text-[6px] text-hsr-gold">★</span>
                          ))}
                        </div>
                        
                        {/* Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/80 text-center">
                          <p className="text-[10px] sm:text-xs font-bold truncate text-white">
                            {char.name}
                          </p>
                        </div>

                        {isDisabled && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">In Team</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamBuilderPage;
