import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/characters', label: 'Karakter' },
    { path: '/light-cones', label: 'Light Cone' },
    { path: '/relics', label: 'Relik' },
    { path: '/team-builder', label: 'Tim Builder' },
    { path: '/tier-list', label: 'Tier List' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-hsr-dark/95 backdrop-blur-md border-b border-hsr-gold/20 shadow-hsr">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10">
                <FaStar className="text-hsr-gold text-2xl drop-shadow-[0_0_10px_rgba(232,197,71,0.5)] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="font-bold text-xl tracking-wide text-white group-hover:text-hsr-gold transition-colors duration-300">
                HSR COMPANION
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 lg:px-5 py-2.5 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-hsr-gold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-hsr-gold shadow-glow-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isActive(link.path) && (
                    <div className="absolute inset-0 bg-hsr-gold/0 hover:bg-hsr-gold/10 rounded-lg transition-colors -z-10" />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-hsr-gold hover:bg-hsr-elevated transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-br from-hsr-dark via-hsr-elevated to-hsr-dark border-l border-hsr-gold/30 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-hsr-gold/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-hsr-gold to-hsr-purple rounded-lg flex items-center justify-center clip-corners">
                    <FaStar className="text-hsr-dark" />
                  </div>
                  <div>
                    <div className="font-bold bg-hsr-gradient bg-clip-text text-transparent">
                      HSR Companion
                    </div>
                    <div className="text-xs text-hsr-gold/60">Menu</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-300 hover:text-hsr-gold hover:bg-hsr-elevated/50 transition-all"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="p-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-5 py-3.5 rounded-lg font-medium transition-all ${
                        isActive(link.path)
                          ? 'bg-hsr-gold text-hsr-dark shadow-glow-gold'
                          : 'text-gray-300 hover:text-white hover:bg-hsr-elevated'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-hsr-gold/20">
                <div className="text-center text-sm text-gray-400">
                  Semoga Perjalanan Ini Membawa Kita ke Bintang
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
