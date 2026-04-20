import React, { useEffect, useState } from 'react';
import './assets/Css/Main.css';

const Preloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loader-wrapper01 ${isLoaded ? 'loaded01' : ''}`}>
      <div className="loader01"></div>
      <div className="loder-section left-section"></div>
      <div className="loder-section right-section"></div>
    </div>
  );
};

export default Preloader;