
import { useState, useEffect } from 'react';

export const useViewport = () => {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isLandscape };
};
