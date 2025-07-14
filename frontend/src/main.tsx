import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/main.scss'

// Importation des pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Error from './pages/Error/Error';
import Projects from './pages/Projects/Projects';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';


// Importation des components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BackgroundGradient from './components/BackgroundGradient/BackgroundGradient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <BackgroundGradient />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/projects/:id' element={<ProjectDetail />} />
        <Route path='/404' element={<Error />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Footer />
    </Router>
  </StrictMode>,
);
