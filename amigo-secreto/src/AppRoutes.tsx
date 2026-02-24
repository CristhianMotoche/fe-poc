import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameSetup from './pages/GameSetup';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/setup" element={<GameSetup />} />
    </Routes>
  );
}

export default AppRoutes;
