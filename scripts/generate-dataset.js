import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const ASSET_DIR = path.join(__dirname, '..', 'Char asset', 'StarRailRes-master');
const INDEX_DIR = path.join(ASSET_DIR, 'index_new', 'id');
const OUTPUT_DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const OUTPUT_ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');

// Create output directories
if (!fs.existsSync(OUTPUT_DATA_DIR)) fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_ASSETS_DIR)) fs.mkdirSync(OUTPUT_ASSETS_DIR, { recursive: true });

// Load data
const characters = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'characters.json'), 'utf8'));
const elements = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'elements.json'), 'utf8'));
const paths = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'paths.json'), 'utf8'));
const characterSkills = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'character_skills.json'), 'utf8'));
const characterRanks = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'character_ranks.json'), 'utf8'));
const characterSkillTrees = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'character_skill_trees.json'), 'utf8'));
const lightCones = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'light_cones.json'), 'utf8'));
const lightConeRanks = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'light_cone_ranks.json'), 'utf8'));
const relicSets = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'relic_sets.json'), 'utf8'));
const relics = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'relics.json'), 'utf8'));
const achievements = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'achievements.json'), 'utf8'));
const items = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'items.json'), 'utf8'));

// Tier mapping (manual for now)
const TIER_MAPPING = {
  'Acheron': 'S',
  'Aventurine': 'S',
  'Black Swan': 'S',
  'Boothill': 'S',
  'Dan Heng • Imbibitor Lunae': 'S',
  'Dr. Ratio': 'S',
  'Feixiao': 'S',
  'Firefly': 'S',
  'Fu Xuan': 'S',
  'Huohuo': 'S',
  'Jiaoqiu': 'S',
  'Jingliu': 'S',
  'Kafka': 'S',
  'Lingsha': 'S',
  'Ruan Mei': 'S',
  'Robin': 'S',
  'Sparkle': 'S',
  'Topaz & Numby': 'S',
  'Argenti': 'A',
  'Bailu': 'A',
  'Blade': 'A',
  'Bronya': 'A',
  'Clara': 'A',
  'Gepard': 'A',
  'Himeko': 'A',
  'Jade': 'A',
  'Luocha': 'A',
  'Seele': 'A',
  'Silver Wolf': 'A',
  'Tingyun': 'A',
  'Yukong': 'A'
};

// ====================
// CHARACTERS
// ====================
console.log('Processing characters...');
const characterData = [];
const characterIconDir = path.join(OUTPUT_ASSETS_DIR, 'characters');
if (!fs.existsSync(characterIconDir)) fs.mkdirSync(characterIconDir, { recursive: true });

for (const [id, char] of Object.entries(characters)) {
  // Get element and path
  const element = elements[char.element];
  const charPath = paths[char.path];
  
  // Copy character icon
  const iconPath = path.join(ASSET_DIR, char.icon);
  if (fs.existsSync(iconPath)) {
    fs.copyFileSync(iconPath, path.join(characterIconDir, `${id}.png`));
  }

  // Copy portrait
  if (char.portrait) {
    const portraitPath = path.join(ASSET_DIR, char.portrait);
    if (fs.existsSync(portraitPath)) {
      fs.copyFileSync(portraitPath, path.join(characterIconDir, `portrait_${id}.png`));
    }
  }

  // Copy preview
  if (char.preview) {
    const previewPath = path.join(ASSET_DIR, char.preview);
    if (fs.existsSync(previewPath)) {
      fs.copyFileSync(previewPath, path.join(characterIconDir, `preview_${id}.png`));
    }
  }

  // Get skills for this character
  const charSkills = Object.values(characterSkills).filter(skill => 
    skill.id.startsWith(id.substring(0, 4))
  );

  // Get eidolons (ranks)
  const charRanks = Object.values(characterRanks).filter(rank => 
    rank.id.toString().startsWith(id)
  );

  // Get traces (skill trees)
  const charTraces = Object.values(characterSkillTrees).filter(trace => 
    trace.character_id === id
  );

  // Copy skill icons
  const skillIconDir = path.join(OUTPUT_ASSETS_DIR, 'icon', 'skill');
  if (!fs.existsSync(skillIconDir)) fs.mkdirSync(skillIconDir, { recursive: true });
  
  charSkills.forEach(skill => {
    if (skill.icon) {
      const skillIconPath = path.join(ASSET_DIR, skill.icon);
      const skillIconName = path.basename(skill.icon);
      if (fs.existsSync(skillIconPath)) {
        fs.copyFileSync(skillIconPath, path.join(skillIconDir, skillIconName));
      }
    }
  });

  // Copy eidolon/rank icons
  const rankIconDir = path.join(OUTPUT_ASSETS_DIR, 'icon', 'skill');
  if (!fs.existsSync(rankIconDir)) fs.mkdirSync(rankIconDir, { recursive: true });
  
  charRanks.forEach(rank => {
    if (rank.icon) {
      const rankIconPath = path.join(ASSET_DIR, rank.icon);
      const rankIconName = path.basename(rank.icon);
      if (fs.existsSync(rankIconPath)) {
        fs.copyFileSync(rankIconPath, path.join(rankIconDir, rankIconName));
      }
    }
  });

  characterData.push({
    id,
    name: char.name.replace('{NICKNAME}', 'Trailblazer').replace('{M#He}{F#She}', 'Trailblazer'),
    rarity: char.rarity,
    element: {
      id: element.id,
      name: element.name,
      icon: `/assets/elements/${element.id}.png`,
      color: element.color
    },
    path: {
      id: charPath.id,
      name: charPath.name,
      icon: `/assets/paths/${charPath.id}.png`
    },
    image: `/assets/characters/${id}.png`,
    portrait: char.portrait ? `/assets/characters/portrait_${id}.png` : null,
    preview: char.preview ? `/assets/characters/preview_${id}.png` : null,
    tier: TIER_MAPPING[char.name] || 'C',
    skills: charSkills.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type_text,
      desc: s.desc,
      icon: `/assets/${s.icon}`
    })),
    eidolons: charRanks.map(r => ({
      id: r.id,
      level: r.rank,
      name: r.name,
      desc: r.desc,
      icon: r.icon ? `/assets/${r.icon}` : null
    })),
    traces: charTraces.length
  });
}

characterData.sort((a, b) => {
  if (b.rarity !== a.rarity) return b.rarity - a.rarity;
  return a.name.localeCompare(b.name);
});

fs.writeFileSync(path.join(OUTPUT_DATA_DIR, 'characters.json'), JSON.stringify(characterData, null, 2));

// ====================
// LIGHT CONES
// ====================
console.log('Processing light cones...');
const lightConeData = [];
const lcIconDir = path.join(OUTPUT_ASSETS_DIR, 'light_cones');
if (!fs.existsSync(lcIconDir)) fs.mkdirSync(lcIconDir, { recursive: true });

const lightConePromotions = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'light_cone_promotions.json'), 'utf8'));

for (const [id, lc] of Object.entries(lightCones)) {
  const lcPath = paths[lc.path];
  
  // Copy icon
  const iconPath = path.join(ASSET_DIR, lc.icon);
  if (fs.existsSync(iconPath)) {
    fs.copyFileSync(iconPath, path.join(lcIconDir, `${id}.png`));
  }

  // Copy portrait (High Quality)
  let portraitUrl = null;
  if (lc.portrait) {
    const portraitPath = path.join(ASSET_DIR, lc.portrait);
    if (fs.existsSync(portraitPath)) {
      fs.copyFileSync(portraitPath, path.join(lcIconDir, `${id}_portrait.png`));
      portraitUrl = `/assets/light_cones/${id}_portrait.png`;
    }
  }

  // Get superimposition levels
  const lcRanksData = Object.values(lightConeRanks).filter(rank => 
    rank.id.toString() === id
  );

  // Calculate Max Stats (Level 80)
  let stats = null;
  const promoData = lightConePromotions[id];
  if (promoData && promoData.values && promoData.values.length > 0) {
    const maxAscension = promoData.values[promoData.values.length - 1];
    // Formula: Base at Asc 6 + (Step * (Level - 1))
    // Level 80 means 79 steps from Level 1
    stats = {
      hp: Math.floor(maxAscension.hp.base + (maxAscension.hp.step * 79)),
      atk: Math.floor(maxAscension.atk.base + (maxAscension.atk.step * 79)),
      def: Math.floor(maxAscension.def.base + (maxAscension.def.step * 79))
    };
  }

  lightConeData.push({
    id,
    name: lc.name,
    rarity: lc.rarity,
    path: {
      id: lcPath.id,
      name: lcPath.name,
      icon: `/assets/paths/${lcPath.id}.png`
    },
    desc: lc.desc,
    icon: `/assets/light_cones/${id}.png`,
    portrait: portraitUrl,
    stats,
    ranks: lcRanksData.map(r => ({
      level: r.rank,
      desc: r.desc,
      params: r.params
    }))
  });
}

lightConeData.sort((a, b) => {
  if (b.rarity !== a.rarity) return b.rarity - a.rarity;
  return a.name.localeCompare(b.name);
});

fs.writeFileSync(path.join(OUTPUT_DATA_DIR, 'light_cones.json'), JSON.stringify(lightConeData, null, 2));

// ====================
// RELICS
// ====================
console.log('Processing relics...');
const relicData = [];
const relicIconDir = path.join(OUTPUT_ASSETS_DIR, 'relics');
if (!fs.existsSync(relicIconDir)) fs.mkdirSync(relicIconDir, { recursive: true });

for (const [id, set] of Object.entries(relicSets)) {
  // Copy icon
  const iconPath = path.join(ASSET_DIR, set.icon);
  if (fs.existsSync(iconPath)) {
    fs.copyFileSync(iconPath, path.join(relicIconDir, `${id}.png`));
  }

  // Get individual relics in this set
  const setRelics = Object.values(relics).filter(r => r.set_id === id);

  relicData.push({
    id,
    name: set.name,
    icon: `/assets/relics/${id}.png`,
    desc: set.desc,
    bonuses: set.desc,
    pieces: setRelics.length
  });
}

fs.writeFileSync(path.join(OUTPUT_DATA_DIR, 'relics.json'), JSON.stringify(relicData, null, 2));

// ====================
// ACHIEVEMENTS
// ====================
console.log('Processing achievements...');
const achievementData = [];

for (const [id, ach] of Object.entries(achievements)) {
  achievementData.push({
    id,
    series: ach.series_id,
    title: ach.title,
    desc: ach.desc,
    reward: ach.jades || 0
  });
}

fs.writeFileSync(path.join(OUTPUT_DATA_DIR, 'achievements.json'), JSON.stringify(achievementData, null, 2));

// ====================
// ELEMENTS & PATHS (for filters)
// ====================
console.log('Processing elements and paths...');

// Copy element icons
const elementIconDir = path.join(OUTPUT_ASSETS_DIR, 'elements');
if (!fs.existsSync(elementIconDir)) fs.mkdirSync(elementIconDir, { recursive: true });

for (const [id, el] of Object.entries(elements)) {
  const iconPath = path.join(ASSET_DIR, el.icon);
  if (fs.existsSync(iconPath)) {
    fs.copyFileSync(iconPath, path.join(elementIconDir, `${id}.png`));
  }
}

// Copy path icons
const pathIconDir = path.join(OUTPUT_ASSETS_DIR, 'paths');
if (!fs.existsSync(pathIconDir)) fs.mkdirSync(pathIconDir, { recursive: true });

for (const [id, p] of Object.entries(paths)) {
  const iconPath = path.join(ASSET_DIR, p.icon);
  if (fs.existsSync(iconPath)) {
    fs.copyFileSync(iconPath, path.join(pathIconDir, `${id}.png`));
  }
}

const elementsExport = Object.values(elements).map(el => ({
  id: el.id,
  name: el.name,
  icon: `/assets/elements/${el.id}.png`,
  color: el.color
}));

const pathsExport = Object.values(paths).map(p => ({
  id: p.id,
  name: p.name,
  icon: `/assets/paths/${p.id}.png`
}));

fs.writeFileSync(path.join(OUTPUT_DATA_DIR, 'elements.json'), JSON.stringify(elementsExport, null, 2));
fs.writeFileSync(path.join(OUTPUT_DATA_DIR, 'paths.json'), JSON.stringify(pathsExport, null, 2));

console.log(`\n✅ Dataset generated successfully!`);
console.log(`- ${characterData.length} characters`);
console.log(`- ${lightConeData.length} light cones`);
console.log(`- ${relicData.length} relic sets`);
console.log(`- ${achievementData.length} achievements`);
