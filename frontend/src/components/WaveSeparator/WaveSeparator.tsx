import React, { useEffect, useRef } from "react";
import styles from "./WaveSeparator.module.scss";

const WaveSeparator: React.FC = () => {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollX = window.scrollY;

      if (layer1Ref.current)
        layer1Ref.current.style.backgroundPositionX = `${scrollX * 0.4}px`;
      if (layer2Ref.current)
        layer2Ref.current.style.backgroundPositionX = `${scrollX * 0.2}px`;
      if (layer3Ref.current)
        layer3Ref.current.style.backgroundPositionX = `${scrollX * 0.1}px`;
    };

    const onScroll = () => requestAnimationFrame(handleScroll);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.waveWrapper}>
      <div ref={layer3Ref} className={`${styles.layer} ${styles.layer3}`} />
      <div ref={layer2Ref} className={`${styles.layer} ${styles.layer2}`} />
      <div ref={layer1Ref} className={`${styles.layer} ${styles.layer1}`} />
    </div>
  );
};

export default WaveSeparator;
