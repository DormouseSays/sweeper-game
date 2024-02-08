export const getSquare = (board, r, c) => {
  if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
    return board[r][c];
  }
  return null;
};

export const createTestBoard = (rows, cols) => {
  const board = [];

  for (let y = 0; y < rows; y += 1) {
    board[y] = [];
    for (let x = 0; x < cols; x += 1) {
      // create square
      board[y][x] = {
        open: false,
        flagged: false,
        mine: false,
        value: 0,
        id: `${y}_${x}`,
      };
    }
  }

  board[2][1].mine = true;
  board[2][2].mine = true;
  board[2][3].mine = true;
  // board[5][].mine = true;

  return board;
};

export const createBoard = (rows, cols, mines) => {
  // get all board squares into a single list, reset them, then pull randomly from the collection to add mines
  const collection = [];
  const board = [];

  for (let y = 0; y < rows; y += 1) {
    board[y] = [];
    for (let x = 0; x < cols; x += 1) {
      // create square
      board[y][x] = {
        open: false,
        flagged: false,
        mine: false,
        value: 0,
        id: `${y}_${x}`,
      };
      collection.push(board[y][x]);
    }
  }

  for (let i = mines; i > 0; i -= 1) {
    const index = Math.floor(Math.random() * collection.length);
    const removedList = collection.splice(index, 1);
    if (removedList && removedList.length > 0) {
      removedList[0].mine = true;
    }
  }

  return board;

  // this.updateValues();
};

export const revealBoard = (originalBoard) => {
  const board = JSON.parse(JSON.stringify(originalBoard));

  for (let w = 0; w < board.length; w += 1) {
    for (let h = 0; h < board[w].length; h += 1) {
      board[w][h].open = true;
    }
  }

  return board;
};

export const openSquare = (originalBoard, row, col) => {
  const board = JSON.parse(JSON.stringify(originalBoard));

  const startSquare = getSquare(board, row, col);

  // console.log(`openSquare ${startSquare.id}`);

  if (!startSquare || startSquare.open || startSquare.flagged) {
    // console.log(`can't open ${startSquare.id}`);
    return board;
  }

  const neighborLocations = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const toOpen = [[row, col]];
  const checked = {};

  let sentinel = 10000;
  while (toOpen.length > 0 && sentinel > 0) {
    const currentLocation = toOpen.pop();

    const s = getSquare(board, currentLocation[0], currentLocation[1]);
    s.open = true;

    // console.log(`open while loop on ${s.id} val is ${s.value}`);

    checked[`${currentLocation[0]}_${currentLocation[1]}`] = true;

    // if this is a blank square, open all its neighbors
    if (s.value === 0) {
      const neighbors = neighborLocations
        .map((loc) => getSquare(
          board,
          currentLocation[0] + loc[0],
          currentLocation[1] + loc[1],
        ))
        .filter((sq) => !!sq);
      // TODO filter out flagged squares here

      for (const n of neighbors) {
        // console.log(`loop check neighbor ${n.id}`)
        if (!checked[n.id]) {
          const vals = n.id.split('_').map((v) => parseInt(v, 10));
          checked[n.id] = true;

          // console.log("adding", n);
          toOpen.push([vals[0], vals[1]]);
        }
      }
    }

    // debugger;

    sentinel -= 1;
  }

  // console.log(`openSquare done with sentinel at ${sentinel}`);

  return board;
};

export const openSquareRecursiveSet = (originalBoard, row, col) => {
  const board = JSON.parse(JSON.stringify(originalBoard));

  const openSquareSet = new Set();

  const recursivelyOpenSquare = (b, r, c) => {
    const squareTag = `${r},${c}`;

    if (openSquareSet.has(squareTag)) {
      // console.log(`already visited ${squareTag}`);
      return;
    }

    const s = getSquare(b, r, c);

    if (!s || s.open || s.flagged) {
      // console.log(`can't open ${squareTag}`);
      return;
    }

    openSquareSet.add(squareTag);

    // console.log(`recursively check ${squareTag}`);

    // s.open = true;

    // if the square has a value > 0 (not open) or is a mine (game ends anyway), bail out here
    if (s.value !== 0 || s.mine) {
      return;
    }

    // //game logic method will check if any square is both a mine and open

    for (let x = -1; x <= 1; x += 1) {
      for (let y = -1; y <= 1; y += 1) {
        if (x === 0 && y === 0) {
          continue;
        }
        const nextTag = `${r + x},${c + y}`;
        if (!openSquareSet.has(nextTag)) {
          recursivelyOpenSquare(b, r + x, c + y);
        }
      }
    }
  };

  recursivelyOpenSquare(board, row, col, []);
  const openPositions = [...openSquareSet];

  // update board

  // console.log('open positions', openPositions);

  for (const openPosition of openPositions) {
    const pos = openPosition.split(',');
    const s = getSquare(board, pos[0], pos[1]);
    s.open = true;
  }

  return board;
};

export const openSquareRecursive = (originalBoard, row, col) => {
  const board = JSON.parse(JSON.stringify(originalBoard));

  // TODO optimize this by adding each r,c to a set as we keep hitting open squares, then open everything in the set
  const recursivelyOpenSquare = (r, c) => {
    // console.log(`recursively check ${r},${c}`);

    const s = getSquare(board, r, c);

    if (!s) {
      return board;
    }

    if (s.open || s.flagged) {
      // already opened, or shouldn't be opened
      return board;
    }

    s.open = true;

    // game logic method will check if any square is both a mine and open
    if (s.mine) {
      // boom!
      return board;
    }

    // if this is a zero, open all touching squares recursively
    // since open checks validity, just try each direction
    if (s.value === 0) {
      recursivelyOpenSquare(r - 1, c);
      recursivelyOpenSquare(r + 1, c);
      recursivelyOpenSquare(r, c - 1);
      recursivelyOpenSquare(r, c + 1);
      recursivelyOpenSquare(r + 1, c + 1);
      recursivelyOpenSquare(r - 1, c - 1);
      recursivelyOpenSquare(r + 1, c - 1);
      recursivelyOpenSquare(r - 1, c + 1);
    }
  };

  recursivelyOpenSquare(row, col);

  return board;
};

export const updateValues = (originalBoard) => {
  const board = JSON.parse(JSON.stringify(originalBoard));

  // console.log('updateValues board', board);

  // count mines touching each square and update
  for (let w = 0; w < board.length; w += 1) {
    for (let h = 0; h < board[w].length; h += 1) {
      if (!board[w][h].mine) {
        let count = 0;
        count += getSquare(board, w - 1, h) && getSquare(board, w - 1, h).mine ? 1 : 0;
        count += getSquare(board, w + 1, h) && getSquare(board, w + 1, h).mine ? 1 : 0;
        count += getSquare(board, w, h - 1) && getSquare(board, w, h - 1).mine ? 1 : 0;
        count += getSquare(board, w, h + 1) && getSquare(board, w, h + 1).mine ? 1 : 0;
        count += getSquare(board, w + 1, h + 1) && getSquare(board, w + 1, h + 1).mine
          ? 1
          : 0;
        count += getSquare(board, w - 1, h - 1) && getSquare(board, w - 1, h - 1).mine
          ? 1
          : 0;
        count += getSquare(board, w + 1, h - 1) && getSquare(board, w + 1, h - 1).mine
          ? 1
          : 0;
        count += getSquare(board, w - 1, h + 1) && getSquare(board, w - 1, h + 1).mine
          ? 1
          : 0;

        // console.log(`set count ${count} for ${w}-${h}`);
        board[w][h].value = count;
      }
    }
  }

  // console.log("return board", board);
  return board;
};
