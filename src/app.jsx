import React, { useState } from 'react';

import Create from './components/Create';
import Grid from './components/Grid';

// import Sweeper from '../sweeper';

function App() {
  const [screen, setScreen] = useState('game');

  const [options, setOptions] = useState({ rows: 10, cols: 10, mines: 10 });

  const onScreenChange = (newScreen, opts) => {
    setOptions(opts);
    setScreen(newScreen);
  };

  const getContent = () => {
    if (screen === 'create') {
      return <Create onScreenChange={onScreenChange} />;
    }
    if (screen === 'game') {
      return <Grid onScreenChange={onScreenChange} rows={options.rows} cols={options.cols} mines={options.mines} />;
    }
    return (
      <div>
        Undefined state
        {screen}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Sweeper</h1>
      <div>{getContent()}</div>
    </div>
  );
}

export default App;
