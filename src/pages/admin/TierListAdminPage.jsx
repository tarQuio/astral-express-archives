import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  rectIntersection,
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Link } from 'react-router-dom';
import { FaSave, FaEye, FaUndo, FaDownload, FaSkull, FaBookOpen, FaGlobe } from 'react-icons/fa';
import TierRow from '../../components/TierRow';
import CharacterCard from '../../components/CharacterCard';
import Filters from '../../components/Filters';

const TIERS = [
  { id: 'S', label: 'S', color: '#ff7f7f' },
  { id: 'A', label: 'A', color: '#ffbf7f' },
  { id: 'B', label: 'B', color: '#ffff7f' },
  { id: 'C', label: 'C', color: '#7fff7f' },
  { id: 'D', label: 'D', color: '#7fbfff' },
  // Unranked is now handled separately in the UI
];

const MODES = [
  { id: 'moc', label: 'Memory of Chaos', icon: FaSkull, color: 'text-red-400' },
  { id: 'pf', label: 'Pure Fiction', icon: FaBookOpen, color: 'text-yellow-400' },
  { id: 'as', label: 'Apocalyptic Shadow', icon: FaGlobe, color: 'text-blue-400' }
];

const TierListAdminPage = () => {
  const [characters, setCharacters] = useState([]);
  const [tierRankings, setTierRankings] = useState({});
  const [elements, setElements] = useState([]);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeElement, setActiveElement] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeMode, setActiveMode] = useState('moc');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    Promise.all([
      fetch('/data/characters.json').then(res => res.json()),
      fetch('/data/elements.json').then(res => res.json()),
      fetch('/data/paths.json').then(res => res.json()),
      fetch('/data/tier_rankings.json').then(res => res.json()).catch(() => ({}))
    ])
      .then(([charsData, elementsData, pathsData, rankingsData]) => {
        setCharacters(charsData);
        setElements(elementsData);
        setPaths(pathsData);
        
        const savedRankings = localStorage.getItem('hsr_tier_rankings');
        if (savedRankings) {
          setTierRankings(JSON.parse(savedRankings));
        } else {
          setTierRankings(rankingsData);
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load data", err);
        setLoading(false);
      });
  }, []);

  const getCharacterTier = (charId) => {
    return tierRankings[charId]?.[activeMode] || 'Unranked';
  };

  const getCharacterOrder = (charId) => {
    return tierRankings[charId]?.[`${activeMode}_order`] ?? 9999;
  };

  // Filter AND Sort characters
  const processedCharacters = characters
    .filter(char => {
      if (activeElement && char.element.id !== activeElement) return false;
      if (activePath && char.path.id !== activePath) return false;
      return true;
    })
    .map(char => ({
      ...char,
      tier: getCharacterTier(char.id),
      order: getCharacterOrder(char.id)
    }))
    .sort((a, b) => a.order - b.order);

  const updateTierAndOrder = (updates) => {
    setTierRankings(prev => {
      const next = { ...prev };
      updates.forEach(({ id, tier, order }) => {
        if (!next[id]) next[id] = {};
        if (tier !== undefined) next[id][activeMode] = tier;
        if (order !== undefined) next[id][`${activeMode}_order`] = order;
      });
      return next;
    });
    setHasChanges(true);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeCharId = active.id;
    const overId = over.id;
    
    // Determine target tier
    const isOverContainer = TIERS.some(t => t.id === overId) || overId === 'Unranked';
    let targetTier = overId;

    if (!isOverContainer) {
      const overChar = processedCharacters.find(c => c.id === overId);
      targetTier = overChar ? overChar.tier : 'Unranked';
    }

    const currentTier = getCharacterTier(activeCharId);

    if (currentTier !== targetTier) {
      // Optimistic update for smoother drag between containers
      // We don't save order here, just tier to allow dropping
      updateTierAndOrder([{ id: activeCharId, tier: targetTier }]);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeCharId = active.id;
    const overId = over.id;

    const activeChar = processedCharacters.find(c => c.id === activeCharId);
    
    // Determine target tier
    const isOverContainer = TIERS.some(t => t.id === overId) || overId === 'Unranked';
    let targetTier = overId;
    if (!isOverContainer) {
       const overChar = processedCharacters.find(c => c.id === overId);
       targetTier = overChar ? overChar.tier : 'Unranked';
    }

    // Get all characters in the target tier (sorted)
    const targetTierChars = processedCharacters.filter(c => c.tier === targetTier);
    
    let newIndex;
    if (isOverContainer) {
      // Dropped on container -> add to end
      newIndex = targetTierChars.length;
    } else {
      // Dropped on character -> replace index
      const overIndex = targetTierChars.findIndex(c => c.id === overId);
      const activeIndex = targetTierChars.findIndex(c => c.id === activeCharId);
      
      if (activeIndex !== -1) {
        // Reordering within same tier
        newIndex = overIndex;
        // Use arrayMove to simulate the new order
        const reordered = arrayMove(targetTierChars, activeIndex, overIndex);
        
        // Update order for ALL characters in this tier
        const updates = reordered.map((char, index) => ({
          id: char.id,
          order: index
        }));
        updateTierAndOrder(updates);
        return;
      } else {
        // Moving from another tier to specific position (should be handled by DragOver mostly, but safety check)
        newIndex = overIndex >= 0 ? overIndex : targetTierChars.length;
      }
    }

    // If we just changed tiers without specific reordering (or DragOver handled the tier switch)
    // We need to ensure the order is correct for the new tier list
    // Re-fetch chars in target tier to be safe
    const finalTierChars = processedCharacters.filter(c => c.tier === targetTier);
    const updates = finalTierChars.map((char, index) => ({
      id: char.id,
      order: index
    }));
    updateTierAndOrder(updates);
  };

  const saveChanges = () => {
    localStorage.setItem('hsr_tier_rankings', JSON.stringify(tierRankings));
    setHasChanges(false);
    alert('Tier list saved to Local Storage!');
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tierRankings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tier_rankings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all tiers to default from file?')) {
      fetch('/data/tier_rankings.json')
        .then(res => res.json())
        .then(data => {
          setTierRankings(data);
          setHasChanges(true);
        })
        .catch(() => setTierRankings({}));
    }
  };

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
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-hsr-gradient bg-clip-text text-transparent">
            Tier List Editor
          </h1>
          <p className="text-gray-400">Drag and drop characters to organize tiers for each mode</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50 rounded-lg font-semibold transition-all"
          >
            <FaUndo /> Reset
          </button>
          <button
            onClick={downloadJson}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/50 rounded-lg font-semibold transition-all"
          >
            <FaDownload /> Download JSON
          </button>
          <Link
            to="/tier-list"
            className="flex items-center gap-2 px-4 py-2 bg-hsr-dark border border-gray-700 hover:border-hsr-gold hover:text-hsr-gold rounded-lg font-semibold transition-all"
          >
            <FaEye /> View Public
          </Link>
          {hasChanges && (
            <button
              onClick={saveChanges}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-green-500/30 animate-pulse"
            >
              <FaSave /> Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 p-1 bg-hsr-elevated/50 rounded-xl border border-white/5 backdrop-blur-sm w-fit">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                isActive 
                  ? 'bg-hsr-gold text-black shadow-glow-gold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={isActive ? 'text-black' : mode.color} />
              {mode.label}
            </button>
          );
        })}
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={rectIntersection} 
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-8">
          <Filters 
            activeElement={activeElement} 
            setActiveElement={setActiveElement}
            activePath={activePath}
            setActivePath={setActivePath}
            elements={elements}
            paths={paths}
          />

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Tier List */}
            <div className="flex-1 w-full flex flex-col border-2 border-hsr-gold/20 rounded-2xl overflow-hidden bg-hsr-elevated/30 backdrop-blur-md shadow-2xl">
              {TIERS.map(tier => (
                <TierRow 
                  key={tier.id}
                  id={tier.id} 
                  label={tier.label} 
                  color={tier.color} 
                  characters={processedCharacters.filter(c => c.tier === tier.id)} 
                />
              ))}
            </div>

            {/* Right Column: Character Pool */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 sticky top-4">
              <div className="p-6 bg-hsr-elevated/50 rounded-2xl border border-hsr-gold/20 backdrop-blur-sm max-h-[calc(100vh-100px)] overflow-y-auto">
                 <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3 sticky top-0 bg-hsr-elevated/90 p-2 rounded-lg z-10 backdrop-blur">
                  <span className="w-1 h-6 bg-gray-400 rounded-full"></span>
                  Pool
                  <span className="text-sm font-normal text-gray-400 bg-hsr-dark px-3 py-1 rounded-full border border-gray-700 ml-auto">
                    {processedCharacters.filter(c => c.tier === 'Unranked').length}
                  </span>
                </h2>
                 <TierRow 
                    id="Unranked"
                    label="Pool"
                    color="#a0aec0"
                    characters={processedCharacters.filter(c => c.tier === 'Unranked')} 
                    isPool={true}
                  />
              </div>
            </div>
          </div>
        </div>
        
        <DragOverlay>
          {activeId ? (
            <div className="scale-110 cursor-grabbing">
              <CharacterCard character={characters.find(c => c.id === activeId)} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TierListAdminPage;
