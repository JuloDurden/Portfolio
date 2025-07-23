import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/main.scss'

// Importation du ThemeProvider
import { ThemeProvider } from './contexts/ThemeContext'

// Importation des pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Error from './pages/Error/Error';
import Projects from './pages/Projects/Projects';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import Dashboard from './pages/Dashboard/Dashboard';

// Importation des components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

// Context d'authentification
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/projects/:id' element={<ProjectDetail />} />
            
            {/* 🔐 Route protégée pour le dashboard */}
            <Route 
              path='/dashboard/*' 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path='/404' element={<Error />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
    <BackToTop />
  </StrictMode>,
);
