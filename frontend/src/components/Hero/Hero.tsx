import { Link } from 'react-router-dom';
import './Hero.scss';
import HeroImage from './img/Me.webp';

function Hero() {
    return (
        <section className="hero__section">
            <div className="hero__content">
                <div className='hero__content--titles'>
                    <p className="hero__content--greeting animate-fade-in-up">
                        bonjour, moi c'est
                    </p>
                    <h1 className="hero__content--title animate-fade-in-up animate-delay-200">
                        <span className="hero__name">Julien Clavel</span>
                    </h1>
                    <p className="hero__content--subtitle animate-fade-in-up animate-delay-400">
                        Développeur Web passionné par la création d'expériences web modernes
                    </p>
                    <div className="hero__content--cta animate-fade-in-up animate-delay-600">
                        <Link 
                            to="/projects" 
                            className="hero__btn hero__btn--primary"
                        >
                            Voir mes projets
                        </Link>
                        <a 
                            href="mailto:julowebdev@gmail.com?subject=Votre profil m'intéresse" 
                            className="hero__btn hero__btn--secondary"
                        >
                            Me contacter
                        </a>
                    </div>
                </div>
                <img 
                    src={HeroImage} 
                    alt='Julien Clavel, Développeur Web'
                    className="hero__image animate-fade-in-right animate-delay-400"
                />
            </div>
        </section>
    );
}

export default Hero;
