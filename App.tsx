import React, { useEffect, useState } from 'react';
import { GeneratorScreen } from './components/GeneratorScreen';
import { RevelationScreen } from './components/RevelationScreen';

const App: React.FC = () => {
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) {
      setIsRevealing(true);
    } else {
      setIsRevealing(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {isRevealing ? <RevelationScreen /> : <GeneratorScreen />}
    </div>
  );
};

export default App;