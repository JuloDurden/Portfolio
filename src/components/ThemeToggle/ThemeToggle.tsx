import { useTheme } from '../../contexts/ThemeContext';
import { useState, useRef } from 'react';
import './ThemeToggle.scss';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isChanging) return; // Empêcher les clics multiples
    
    const button = buttonRef.current;
    if (!button) return;

    setIsChanging(true);
    
    // 🎯 CALCULER LA POSITION DU RIPPLE
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // 🌊 CRÉER L'EFFET RIPPLE
    createRippleEffect(x, y);
    
    // 🔄 CHANGER LE THÈME APRÈS UN DÉLAI
    setTimeout(() => {
      toggleTheme();
    }, 300); // Délai pour voir l'animation commencer
    
    // ✅ RESET STATE
    setTimeout(() => {
      setIsChanging(false);
    }, 480);
  };

  const createRippleEffect = (x: number, y: number) => {
    // 🌊 CRÉER L'OVERLAY RIPPLE
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // 📱 CALCULER LA TAILLE DU RIPPLE (couvrir tout l'écran)
    const maxDistance = Math.max(
      Math.sqrt(x * x + y * y), // Top-left
      Math.sqrt((window.innerWidth - x) * (window.innerWidth - x) + y * y), // Top-right
      Math.sqrt(x * x + (window.innerHeight - y) * (window.innerHeight - y)), // Bottom-left
      Math.sqrt((window.innerWidth - x) * (window.innerWidth - x) + (window.innerHeight - y) * (window.innerHeight - y)) // Bottom-right
    );
    
    ripple.style.setProperty('--ripple-size', `${maxDistance * 2}px`);
    
    document.body.appendChild(ripple);
    
    // 🗑️ NETTOYER APRÈS L'ANIMATION
    setTimeout(() => {
      if (document.body.contains(ripple)) {
        document.body.removeChild(ripple);
      }
    }, 480);
  };

  return (
    <button 
      ref={buttonRef}
      onClick={handleToggle}
      className="theme-toggle"
      data-changing={isChanging}
      disabled={isChanging}
      title={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
      aria-label={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      {theme === 'light' ? (
        // Icône lune (mode sombre)
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Icône soleil (mode clair)
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="m5 13h-2c-.5527344 0-1-.4472656-1-1s.4472656-1 1-1h2c.5527344 0 1 .4472656 1 1s-.4472656 1-1 1zm1.3427734-5.2431641c.1953125.1953125.4511719.2929688.7070312.2929688s.5117188-.0976562.7070312-.2929688c.390625-.390625.390625-1.0234375 0-1.4140625l-1.4140624-1.4140625c-.390625-.390625-1.0234375-.390625-1.4140625 0s-.390625 1.0234375 0 1.4140625zm5.6572266-1.7568359c.5527344 0 1-.4472656 1-1v-2c0-.5527344-.4472656-1-1-1s-1 .4472656-1 1v2c0 .5527344.4472656 1 1 1zm4.9501953 2.0498047c.2558594 0 .5117188-.0976562.7070312-.2929688l1.4140625-1.4140625c.390625-.390625.390625-1.0234375 0-1.4140625s-1.0234375-.390625-1.4140625 0l-1.4140625 1.4140625c-.390625.390625-.390625 1.0234375 0 1.4140625.1953126.1953125.4511719.2929688.7070313.2929688zm-10.6074219 8.1933594-1.4140625 1.4140625c-.390625.390625-.390625 1.0234375 0 1.4140625.1953125.1953125.4511719.2929688.7070312.2929688s.5117188-.0976562.7070312-.2929688l1.4140625-1.4140625c.390625-.390625.390625-1.0234375 0-1.4140625s-1.0234374-.390625-1.4140624 0zm14.6572266-5.2431641h-2c-.5527344 0-1 .4472656-1 1s.4472656 1 1 1h2c.5527344 0 1-.4472656 1-1s-.4472656-1-1-1zm-3.3427734 5.2431641c-.390625-.390625-1.0234375-.390625-1.4140625 0s-.390625 1.0234375 0 1.4140625l1.4140625 1.4140625c.1953125.1953125.4511719.2929688.7070312.2929688s.5117188-.0976562.7070312-.2929688c.390625-.390625.390625-1.0234375 0-1.4140625zm-.6572266-4.2431641c0 2.7568359-2.2431641 5-5 5s-5-2.2431641-5-5 2.2431641-5 5-5 5 2.2431641 5 5zm-2 0c0-1.6542969-1.3457031-3-3-3s-3 1.3457031-3 3 1.3457031 3 3 3 3-1.3457031 3-3zm-3 6c-.5527344 0-1 .4472656-1 1v2c0 .5527344.4472656 1 1 1s1-.4472656 1-1v-2c0-.5527344-.4472656-1-1-1z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
