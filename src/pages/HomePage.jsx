import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaGem, FaCube, FaChess, FaArrowRight, FaStar } from 'react-icons/fa';

// Hero Characters (High Quality Portraits)
const HERO_CHARACTERS = [
  { id: '1310', name: 'Firefly', color: 'hsr-fire', quote: "I will set the seas ablaze." }, // Firefly
  { id: '1308', name: 'Acheron', color: 'hsr-lightning', quote: "Tears rain down on the waking world." }, // Acheron
  { id: '1005', name: 'Kafka', color: 'hsr-lightning', quote: "Listen to the sound of your heartbeat." }, // Kafka
  { id: '1224', name: 'March 7th', color: 'hsr-imaginary', quote: "Check out this awesome move!" }, // March 7th (Hunt)
];

const FeatureCard = ({ to, icon, title, desc, color }) => (
  <Link to={to} className="block group h-full">
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-hsr-elevated/30 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-${color}/50 transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]`}
    >
      {/* Hover Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Icon Container */}
      <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-inner`}>
        <div className={`text-${color} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
          {icon}
        </div>
      </div>
      
      <h3 className={`text-xl font-bold mb-3 text-white group-hover:text-${color} transition-colors relative z-10`}>{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors relative z-10">{desc}</p>
      
      {/* Corner Accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-${color}/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    </motion.div>
  </Link>
);

const HomePage = () => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_CHARACTERS.length);
    }, 6000); // Change every 6 seconds
    return () => clearInterval(interval);
  }, []);

  const currentHero = HERO_CHARACTERS[currentHeroIndex];

  return (
    <div className="min-h-screen bg-hsr-dark text-white font-sans selection:bg-hsr-gold/30 relative overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        
        {/* Dynamic Background Slideshow */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            {/* Character Image - Positioned to the right */}
            <div className="absolute inset-0 flex justify-end">
               <img 
                src={`/assets/characters/portrait_${currentHero.id}.png`} 
                alt={currentHero.name}
                className="h-full w-auto object-cover object-center md:object-right opacity-80 md:opacity-100 mask-image-gradient"
                style={{ maskImage: 'linear-gradient(to left, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 100%)' }}
              />
            </div>
            
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-hsr-dark via-hsr-dark/90 to-transparent"></div>
            <div className={`absolute inset-0 bg-gradient-to-t from-hsr-dark via-transparent to-transparent opacity-80`}></div>
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-hsr-gold text-sm font-bold mb-8 shadow-[0_0_20px_rgba(232,197,71,0.2)]">
                <FaStar className="animate-pulse" />
                <span>PANDUAN ASTRAL EXPRESS</span>
              </div>

              {/* Title */}
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-2xl">
                  HSR
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-hsr-gold via-[#F4D03F] to-hsr-gold drop-shadow-[0_0_30px_rgba(232,197,71,0.6)]">
                  COMPANION
                </span>
              </h1>

              {/* Dynamic Quote */}
              <AnimatePresence mode='wait'>
                <motion.p
                  key={currentHero.quote}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl md:text-2xl text-gray-300 mb-10 italic font-light border-l-4 border-hsr-gold pl-6"
                >
                  "{currentHero.quote}"
                </motion.p>
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-5">
                <Link 
                  to="/characters"
                  className="px-8 py-4 bg-gradient-to-r from-hsr-gold to-[#F4D03F] text-hsr-dark rounded-xl font-black text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(232,197,71,0.4)] hover:shadow-[0_0_50px_rgba(232,197,71,0.7)] flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Jelajahi Karakter <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                </Link>
                
                <Link 
                  to="/team-builder"
                  className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Bangun Tim
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-hsr-gold rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight, 
                opacity: Math.random() * 0.5 + 0.2 
              }}
              animate={{ 
                y: [null, Math.random() * -100],
                opacity: [null, 0]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-0.5 h-12 bg-gradient-to-b from-hsr-gold to-transparent"></div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-hsr-dark relative z-10">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-hsr-dark to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white drop-shadow-lg">
              Fitur <span className="text-hsr-gold">Unggulan</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Semua alat yang Anda butuhkan untuk memaksimalkan potensi Trailblazer Anda.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              to="/characters"
              icon={<FaUsers className="text-4xl" />}
              title="Database Karakter"
              desc="Daftar lengkap dengan skill, eidolon, dan build terbaik."
              color="hsr-purple"
            />
            <FeatureCard 
              to="/lightcones"
              icon={<FaGem className="text-4xl" />}
              title="Light Cone"
              desc="Katalog senjata lengkap dengan status dan efek pasif."
              color="hsr-pink"
            />
            <FeatureCard 
              to="/relics"
              icon={<FaCube className="text-4xl" />}
              title="Relik & Planar"
              desc="Panduan set bonus untuk optimalisasi stat karakter."
              color="green-400"
            />
            <FeatureCard 
              to="/team-builder"
              icon={<FaChess className="text-4xl" />}
              title="Pembuat Tim"
              desc="Simulasikan sinergi tim dan temukan kombinasi meta."
              color="blue-400"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
