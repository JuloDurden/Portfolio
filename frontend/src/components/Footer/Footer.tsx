import './Footer.scss';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <p>&copy; {currentYear} Julien Clavel | Tous droits réservés.</p>
        </div>
        
        <div className="footer__bottom">
          <p>Développé avec ❤️ et React + TypeScript</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
