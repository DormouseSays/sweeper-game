import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Create({ onScreenChange }) {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [mines, setMines] = useState(10);

  return (
    <div className="create">
      <div>Name:</div>
      <div className="line"><input type="text" className="input-text" /></div>
      <div>Rows:</div>
      <div className="line"><input type="text" className="input-text" value={rows} onChange={(e) => setRows(parseInt(e.target.value, 10) || 0)} /></div>
      <div>Columns:</div>
      <div className="line"><input type="text" className="input-text" value={cols} onChange={(e) => setCols(parseInt(e.target.value, 10) || 0)} /></div>
      <div>Mines:</div>
      <div className="line"><input type="text" className="input-text" value={mines} onChange={(e) => setMines(parseInt(e.target.value, 10) || 0)} /></div>
      <div>
        <button
          type="button"
          className="button"
          onClick={() => onScreenChange('game', { rows, cols, mines })}
        >
          Start
        </button>
      </div>
    </div>
  );
}

Create.propTypes = {
  onScreenChange: PropTypes.func.isRequired,
};

export default Create;
