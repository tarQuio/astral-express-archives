import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import StarBackground from './components/StarBackground';
import HomePage from './pages/HomePage';
import CharacterListPage from './pages/characters/CharacterListPage';
import CharacterDetailPage from './pages/characters/CharacterDetailPage';
import LightConeListPage from './pages/lightcones/LightConeListPage';
import RelicListPage from './pages/relics/RelicListPage';
import TeamBuilderPage from './pages/TeamBuilderPage';
import TierListPage from './pages/TierListPage';
import TierListAdminPage from './pages/admin/TierListAdminPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-hsr-space text-white flex flex-col relative">
        <StarBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/characters" element={<CharacterListPage />} />
            <Route path="/characters/:id" element={<CharacterDetailPage />} />
            <Route path="/light-cones" element={<LightConeListPage />} />
            <Route path="/relics" element={<RelicListPage />} />
            <Route path="/team-builder" element={<TeamBuilderPage />} />
            <Route path="/tier-list" element={<TierListPage />} />
            <Route path="/admin/tier-list" element={<TierListAdminPage />} />
          </Routes>
        </main>
        <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
