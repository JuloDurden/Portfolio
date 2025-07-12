import React from 'react';
import './BackgroundGradient.scss';

const BackgroundGradient = () => {
  return (
    <div className="background-wrapper">
      <div className="background-layer layer1" />
      <div className="background-layer layer2" />
      <div className="background-layer layer3" />
    </div>
  );
};

export default BackgroundGradient;
