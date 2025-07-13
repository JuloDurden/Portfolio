import './Hero.scss';
import HeroImage from './img/Me.webp';

function Hero() {
    return (
        <section className="hero__section">
            <div className="hero__content">
                <div className='hero__content--titles'>
                    <p className="hero__content--greeting">
                        bonjour, moi c'est
                    </p>
                    <h1 className="hero__content--title">
                        <span className="hero__name">Julien Clavel</span>
                    </h1>
                    <p className="hero__content--subtitle">
                        Développeur Web passionné par la création d'expériences web modernes
                    </p>
                    <div className="hero__content--cta">
                        <button className="hero__btn hero__btn--primary">
                            Voir mes projets
                        </button>
                        <button className="hero__btn hero__btn--secondary">
                            Me contacter
                        </button>
                    </div>
                </div>
                <img 
                    src={HeroImage} 
                    alt='Julien Clavel, Développeur Web'
                    className="hero__image"
                />
            </div>
        </section>
    );
}

export default Hero;
