import './BackgroundGradient.scss';
import { useState, useEffect } from 'react';
import Iridescence from '../Iridescence/Iridescence';

const BackgroundGradient = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // 🚫 NE REND RIEN SUR MOBILE/TABLETTE
  if (!isDesktop) return null;

  return (
    <div className="background-wrapper">
      <div className="background-layer layer1" />
      <div className="background-layer layer2" />
      <div className="background-layer layer3" />
      <Iridescence
        color={[0.7, 0.7, 0.7]}
        mouseReact={false}
        amplitude={0.1}
        speed={0.2}
      />
    </div>
  );
};

export default BackgroundGradient;
