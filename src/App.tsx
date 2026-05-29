import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { apiService } from './services/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Live from './pages/Live';
import Watch from './pages/Watch';

const App: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [liveCount, setLiveCount] = useState(0);

  // Dynamic live count sync for Navbar active badge
  useEffect(() => {
    const fetchLiveCount = async () => {
      try {
        const matches = await apiService.getLiveMatches();
        setLiveCount(matches.length);
      } catch (err) {
        setLiveCount(0);
      }
    };

    fetchLiveCount();
    const interval = setInterval(fetchLiveCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#08090c] text-white">
        
        {/* Sticky Glass Navbar */}
        <Navbar 
          searchValue={searchValue} 
          onSearchChange={setSearchValue} 
          liveCount={liveCount} 
        />

        {/* Content Routes wrapping */}
        <div className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={<Home searchValue={searchValue} />} 
            />
            <Route 
              path="/live" 
              element={<Live searchValue={searchValue} />} 
            />
            <Route 
              path="/watch/:id" 
              element={<Watch />} 
            />
          </Routes>
        </div>

        {/* Sleek Dark Footer */}
        <Footer />
        
      </div>
    </Router>
  );
};

export default App;
