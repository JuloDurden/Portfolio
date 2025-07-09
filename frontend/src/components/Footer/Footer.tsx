import './Footer.scss';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__left">
            <p>&copy; {currentYear} Mon Portfolio. Tous droits réservés.</p>
          </div>
          
          <div className="footer__right">
            <div className="footer__social">
              <a 
                href="https://github.com/votre-username" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link"
              >
                GitHub
              </a>
              <a 
                href="https://linkedin.com/in/votre-profil" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link"
              >
                LinkedIn
              </a>
              <a 
                href="mailto:votre.email@exemple.com" 
                className="footer__social-link"
              >
                Email
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer__bottom">
          <p>Développé avec ❤️ et React + TypeScript</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
