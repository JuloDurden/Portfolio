import React from 'react';
import './BackgroundGradient.scss';

import Iridescence from '../Iridescence/Iridescence';

const BackgroundGradient = () => {
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
