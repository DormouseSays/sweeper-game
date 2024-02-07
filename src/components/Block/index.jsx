import React from 'react';
import PropTypes from 'prop-types';
import './Block.css';

function Block({
  row, col, open, flagged, mine, value, onClick,
}) {
  const showValue = () => {
    if (open) {
      if (mine) {
        if (flagged) {
          return '✅';
        }

        return '🚫';
      }

      return value || '';
    }

    if (flagged) {
      return 'F';
    }

    return '';
  };

  return (
    <div className="block">
      <button type="button" className={`square${open ? '' : ' block-closed'}`} onClick={() => onClick(row, col)}>
        {showValue()}
      </button>
    </div>
  );
}

Block.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  flagged: PropTypes.bool.isRequired,
  mine: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Block;
