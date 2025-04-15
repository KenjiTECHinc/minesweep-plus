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

const fillMines = (emptyBoard: TBoard, rows: number, cols: number, totalMines: number) => {
    let mines = 0;
    while (mines < totalMines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (emptyBoard[row][col].value !== 'mine') {
            emptyBoard[row][col] = { value: 'mine', isOpened: false, isFlagged: false };
            mines++;
        }
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

export const initBoard = (rows: number, cols: number, totalMines: number) => {
    const emptyBoard = createBoard(rows, cols);
    const mineBoard = fillMines(emptyBoard, rows, cols, totalMines);
    const mineBoardWithNumbers = fillNumbers(mineBoard, rows, cols);

    return mineBoardWithNumbers;
}

export const initGame = (rows: number, cols: number, totalMines: number) => {
    return initBoard(rows, cols, totalMines);
}

export const revealEmptyCells = (board: TBoard, rows: number, cols: number, row: number, col: number) => {
    const queue: [number, number][] = [[row, col]];

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
                        if (!neighborCell.isOpened && neighborCell.value !== 'mine') {
                            queue.push([newRow, newCol]);
                        }
                    }
                }
            }
        }
    }
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