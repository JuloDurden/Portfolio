// pages/About/About.tsx
import './About.scss';

function About() {
  return (
    <div className="about">
      <div className="about__container">
        <section className="about__intro">
          <h1>À propos de moi</h1>
          <p>
            Développeur passionné avec une expérience dans la création 
            d'applications web responsives utilisant JavaScript, React.js, 
            Node.js et diverses autres technologies.
          </p>
        </section>

        <section className="about__skills">
          <h2>Compétences & Technologies</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Frontend</h3>
              <ul>
                <li>React.js</li>
                <li>TypeScript</li>
                <li>HTML/CSS</li>
                <li>SCSS</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
                <li>PostgreSQL</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
