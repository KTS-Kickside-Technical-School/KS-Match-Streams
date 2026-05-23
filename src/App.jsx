import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { apiService } from './services/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Watch from './pages/Watch';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [liveCount, setLiveCount] = useState(0);

  // Dynamic live count sync for Navbar indicator
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
      <div style={styles.appContainer}>
        {/* Sticky Glass Navbar */}
        <Navbar 
          searchValue={searchValue} 
          onSearchChange={setSearchValue} 
          liveCount={liveCount} 
        />

        {/* Content Routes */}
        <div style={styles.contentWrapper}>
          <Routes>
            <Route 
              path="/" 
              element={<Home searchValue={searchValue} />} 
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
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  },
  contentWrapper: {
    flexGrow: 1,
  }
};

export default App;
