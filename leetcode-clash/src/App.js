import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
