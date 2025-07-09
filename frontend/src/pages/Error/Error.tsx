// pages/Error/Error.tsx
import './Error.scss';
import { Link } from 'react-router-dom';

function Error() {
  return (
    <div className="error">
      <div className="error__container">
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>Désolé, la page que vous cherchez n'existe pas.</p>
        <Link to="/" className="error__link">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default Error;
