import React, { createContext, useContext, useState } from 'react';

const PreloaderContext = createContext({
  isPreloaderDone: false,
  setIsPreloaderDone: () => {},
});

export const PreloaderProvider = ({ children }) => {
  const [isPreloaderDone, setIsPreloaderDone] = useState(() => {
    try {
      return sessionStorage.getItem('genvaani_preloader_seen') === 'true';
    } catch {
      return false;
    }
  });

  return (
    <PreloaderContext.Provider value={{ isPreloaderDone, setIsPreloaderDone }}>
      {children}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = () => useContext(PreloaderContext);

export default PreloaderContext;

