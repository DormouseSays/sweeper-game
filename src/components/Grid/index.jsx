/* eslint react/no-array-index-key: 0 */ // since the grid never moves or re-sorts, we're using array index as a key here

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  createBoard,
  // createTestBoard,
  updateValues,
  getSquare,
  revealBoard,
  openSquare,
} from '../../utils';

import Block from '../Block';

import './Grid.css';

function Grid({
  onScreenChange, rows, cols, mines,
}) {
  const statusArray = ['open', 'flag'];

  const [status, setStatus] = useState(statusArray[0]);
  const [startTime, setStartTime] = useState(null);
  const [seconds, setSeconds] = useState(0);

  // create the active variable, and a ref so we can read its state from inside a setTimeout call below
  const [active, setActive] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  const [message, setMessage] = useState(null);

  const [doubleClickBlock, setDoubleClickBlock] = useState(null);

  const [board, setBoard] = useState(() => updateValues(createBoard(rows, cols, mines)));

  useEffect(() => {
    const timer = setInterval(() => {
      if (!activeRef.current) {
        // console.log('Grid: active false, interval ignored');
        return;
      }
      // console.log(`Grid: interval ran, active = ${activeRef.current}`);
      const now = Date.now();
      const newSeconds = Math.floor((now - startTime) / 1000);

      setSeconds(newSeconds);
    }, 200);
    return () => clearInterval(timer);
  }, [startTime, setSeconds]);

  const handleOnBlockClick = (r, c) => {
    if (startTime == null) {
      setStartTime(Date.now());
      setActive(true);
    } else if (!active) {
      // console.log('not active, ignoring click');
      return;
    }

    let nextBoard = JSON.parse(JSON.stringify(board));

    if (status === 'open') {
      const square = getSquare(nextBoard, r, c);

      if (square.open) {
        // for already open squares, start or finish a double click action to open surrounding unflagged squares
        if (doubleClickBlock && doubleClickBlock === `${r},${c}`) {
          // console.log('clear double click');
          // clear double click
          setDoubleClickBlock(null);

          // trigger an open event on all surrounding blocks
          nextBoard = openSquare(nextBoard, r - 1, c - 1);
          nextBoard = openSquare(nextBoard, r - 1, c);
          nextBoard = openSquare(nextBoard, r - 1, c + 1);

          nextBoard = openSquare(nextBoard, r, c - 1);
          nextBoard = openSquare(nextBoard, r, c + 1);

          nextBoard = openSquare(nextBoard, r + 1, c - 1);
          nextBoard = openSquare(nextBoard, r + 1, c);
          nextBoard = openSquare(nextBoard, r + 1, c + 1);
        } else {
          // console.log(`set double click to ${r},${c}`);
          setDoubleClickBlock(`${r},${c}`);
        }
      } else {
        nextBoard = openSquare(nextBoard, r, c);
      }
    } else if (status === 'flag') {
      const square = getSquare(nextBoard, r, c);

      if (square.flagged) {
        nextBoard[r][c].flagged = false;
      } else {
        nextBoard[r][c].flagged = true;
      }
    }

    const openMine = nextBoard.find((nextRow) => nextRow.find((nextCol) => nextCol.mine && nextCol.open));

    const closedSquares = nextBoard.reduce((total, nextRow) => {
      const newTotal = [...total, ...nextRow.filter((cs) => !cs.open)];

      return newTotal;
    }, []);

    if (openMine) {
      console.log('Grid: opened a mine, setActive(false)');
      setActive(false);
      setMessage('Game Over');
      nextBoard = revealBoard(nextBoard);
    } else if (closedSquares.length === mines) {
      console.log('Grid: won the game, setActive(false)');
      setActive(false);
      setMessage('You Win!');
    } else {
      // console.log(`no open mines. ${closedSquares.length} still open, need ${mines}`);
    }

    setBoard(nextBoard);
  };

  const handleOnStatusClick = () => {
    let statusIndex = statusArray.findIndex((e) => e === status);

    statusIndex = (statusIndex + 1) % statusArray.length;

    setStatus(statusArray[statusIndex]);
  };

  const handleOnRevealClick = () => {
    const updatedBoard = revealBoard(board);
    setBoard(updatedBoard);
  };

  const flagCount = board
    .map((r) => r.filter((c) => c.flagged).length)
    .reduce((acc, v) => acc + v);

  const bombCount = board
    .map((r) => r.filter((c) => c.mine).length)
    .reduce((acc, v) => acc + v);

  return (
    <div className="grid">
      <div className="controls spaced">
        <div>
          <button type="button" onClick={handleOnStatusClick}>{status}</button>
        </div>
        <div className="info">
          <span>
            ⏰
            {seconds}
          </span>
          {' '}
          <span>
            🚩
            {' '}
            {flagCount}
            /
            {bombCount}
          </span>
        </div>
        <div>
          <button type="button" onClick={handleOnRevealClick}>reveal</button>
        </div>
      </div>
      <div className="board">
        {board.map((row, r) => (
          <div key={r} className={`row row-${r}`}>
            {row.map((square, c) => (
              <div key={c} className={`col col-${r}-${c}`}>
                <Block open={square.open} flagged={square.flagged} mine={square.mine} value={square.value} row={r} col={c} onClick={handleOnBlockClick} />
              </div>
            ))}
          </div>
        ))}
        {message && <div className="message">{message}</div>}
      </div>
      <div className="spaced">
        <button type="button" className="button" onClick={() => onScreenChange('create', {})}>
          Quit
        </button>
      </div>
    </div>
  );
}

Grid.propTypes = {
  onScreenChange: PropTypes.func.isRequired,
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  mines: PropTypes.number.isRequired,
};

export default Grid;
