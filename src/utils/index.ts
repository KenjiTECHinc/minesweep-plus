import { TBoard } from "../types/index";

const createBoard = (rows: number, cols: number) => {
    const board: TBoard = []

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        board[rowIndex] = []

        for (let cellIndex = 0; cellIndex < cols; cellIndex++) {
            board[rowIndex][cellIndex] = {
                value: null,
                isOpened: false,
                isFlagged: false,
            };
        }
    }

    return board;
};

const shuffleArray = (array: Array<{ row: number, col: number }>) => {
    /**
     * @description: Shuffle an array.
     */
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // console.log("shuffled positions: ", arr);
    return arr;
}

const fillMines = (emptyBoard: TBoard, rows: number, cols: number, totalMines: number, reservedPositions: Array<{ row: number, col: number }>) => {
    /**
     * @description: Fill the board with mines randomly using a shuffled array.

     */
    const allPositions = [];
    // console.log("filling mines: ", reservedPositions);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!reservedPositions.some(pos => pos.row === i && pos.col === j)) {
                allPositions.push({ row: i, col: j });
            }
        }
    }

    let shuffledPositions = shuffleArray(allPositions);

    for (let i = 0; i < totalMines; i++) {
        const { row, col } = shuffledPositions[i];
        emptyBoard[row][col].value = 'mine';
    }

    return emptyBoard;
}

const fillNumbers = (mineBoard: TBoard, rows: number, cols: number) => {
    mineBoard.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell.value !== 'mine') {
                let mineCount = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === 0 && j === 0) continue; // Skip the current cell
                        const newRow = rowIndex + i;
                        const newCol = colIndex + j;
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                            if (mineBoard[newRow][newCol].value === 'mine') {
                                mineCount++;
                            }
                        }
                    }
                }
                mineBoard[rowIndex][colIndex] = { value: mineCount, isOpened: false, isFlagged: false };
            }
        })
    })
    return mineBoard;
}

export const initBoard = (gameBoard: TBoard, rows: number, cols: number, totalMines: number, reservedPositions: Array<{ row: number, col: number }>) => {
    /**
     * @description: Initialize the game board with mines and numbers.
     */
    const mineBoard = fillMines(gameBoard, rows, cols, totalMines, reservedPositions);
    const mineBoardWithNumbers = fillNumbers(mineBoard, rows, cols);
    // console.log("mine board with numbers: ", mineBoardWithNumbers);
    return mineBoardWithNumbers;
}

export const initGame = (rows: number, cols: number) => {
    /**
     * @description: Initialize an empty game board with the given number of rows and columns.
     */
    return createBoard(rows, cols);
}

export const revealEmptyCells = (board: TBoard, rows: number, cols: number, row: number, col: number) => {
    /**
     * @description: Reveal all empty cells (0) and their adjacent cells recursively.
     * @param {TBoard} board - The game board.
     * @param {number} rows - The number of rows in the board.
     * @param {number} cols - The number of columns in the board.
     * @param {number} row - The row index of the cell to reveal.
     * @param {number} col - The column index of the cell to reveal.
     * @returns {void}
     */
    const queue: [number, number][] = [[row, col]];
    board[row][col].isOpened = true; // Mark the initial cell as opened

    while (queue.length > 0) {
        const next = queue.shift();
        if (!next) continue;
        const [currentRow, currentCol] = next;
        const cell = board[currentRow][currentCol];

        cell.isOpened = true;
        if (cell.value === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = currentRow + i;
                    const newCol = currentCol + j;
                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                        const neighborCell = board[newRow][newCol];
                        console.log("neighbor cell: ", neighborCell);
                        if (!neighborCell.isOpened && neighborCell.value !== 'mine' && !neighborCell.isFlagged) {
                            neighborCell.isOpened = true; // Mark the neighbor cell as opened
                            queue.push([newRow, newCol]);
                        }
                    }
                }
            }
        }
    }
    // console.log("revealed empty cells: ", board);
}

export const revealAllMineCells = (board: TBoard) => {
    board.forEach(row => {
        row.forEach(cell => {
            if (cell.value === 'mine') {
                cell.isOpened = true;
            }
        })
    })
}

export const checkGameWin = (board: TBoard, totalMines: number) => {
    let unopenedCells = 0;
    let correctFlags = 0;

    board.forEach(row => {
        row.forEach(cell => {
            if (!cell.isOpened) unopenedCells++;
            if (cell.isFlagged && cell.value === 'mine') correctFlags++;
        })
    })

    return unopenedCells === totalMines || correctFlags === totalMines;
}

export const getTimeDifference = (timeStart: Date | null, timeNow: Date | null) => {
    /**
     * @description: Get the time difference between two Date objects in MM:SS format.
     */
    if (timeStart === null || timeNow === null) return "00:00";

    return new Intl.DateTimeFormat('en-US', {
        minute: '2-digit',
        second: '2-digit'
    }).format(timeNow.getTime() - timeStart.getTime());
}

export const getAdjacentCells = (row: number, col: number, rows: number, cols: number) => {
    /**
     * @description: Get the adjacent cells of a cell in a 2D grid.
     */
    const positions: { row: number; col: number }[] = [];

    // console.log("get Adjacent cells");

    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < cols) {
                positions.push({ row: i, col: j });
            }
        }
    }

    return positions;
}

export const clearFlags = (board: TBoard) => {
    /**
     * @description: Clear all flags on the board.
     */
    board.forEach(row => {
        row.forEach(cell => {
            if (cell.isFlagged) {
                cell.isFlagged = false;
            }
        })
    })

    return board;
}