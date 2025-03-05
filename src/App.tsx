
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import WelcomeModal from './components/WelcomeModal';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setShowWelcome(false);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('hasVisitedBefore', 'true');
    setShowWelcome(false);
  };

  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
