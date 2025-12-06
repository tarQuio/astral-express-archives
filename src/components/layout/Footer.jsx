import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-yellow-500 to-purple-600 bg-clip-text text-transparent">
              HSR Companion
            </h3>
            <p className="text-gray-400 text-sm">
              Your ultimate companion for Honkai: Star Rail. Character builds, tier lists, and more.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/characters" className="text-gray-400 hover:text-white transition-colors">Characters</a></li>
              <li><a href="/tier-list" className="text-gray-400 hover:text-white transition-colors">Tier List</a></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Disclaimer</h3>
            <p className="text-gray-400 text-xs">
              This is an unofficial fan-made website. Honkai: Star Rail and all related content are trademarks of HoYoverse.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2024 HSR Companion. Built with passion for the community.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
