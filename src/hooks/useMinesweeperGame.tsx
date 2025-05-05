import { useCallback, useEffect, useState } from "react";
import { initBoard, initGame, revealAllMineCells, revealEmptyCells, checkGameWin, getAdjacentCells, clearFlags } from "../utils";
import { TBoard, TLevel } from "../types";
import { DEFAULT_LEVEL, LEVELS } from "../constants";
import useTimer from "./useTimer";

const useMinesweeperGame = () => {
    const [level, setLevel] = useState(DEFAULT_LEVEL);
    const [customLevel, setCustomLevel] = useState({ rows: 0, cols: 0, mines: 0 }); // Custom level state

    const currentLevel = level === 'custom' ? customLevel : LEVELS[level];

    const changeLevel = useCallback((selectedLevel: TLevel, settings?: { rows: number, cols: number, mines: number }) => {
        if (selectedLevel === 'custom' && settings) {
            setCustomLevel(settings);
        }
        setLevel(selectedLevel);
    }, []);

    const [isFirstClick, setIsFirstClick] = useState(true);
    const [gameBoard, setGameBoard] = useState(initGame(LEVELS[DEFAULT_LEVEL].rows, LEVELS[DEFAULT_LEVEL].cols));
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameWin, setIsGameWin] = useState(false);
    const [totalFlags, setTotalFlags] = useState(0); // Track the number of flags placed
    const isGameEnded = isGameOver || isGameWin;
    const flagsLeft = currentLevel.mines - totalFlags; // Calculate flags left based on flags placed

    const { timeDifference, startTimer, stopTimer, resetTimer, isTimerRunning } = useTimer();

    const resetBoard = useCallback(() => {
        setIsGameOver(false);
        setIsGameWin(false);
        setIsFirstClick(true);
        setTotalFlags(0);
        resetTimer();
        setGameBoard(initGame(currentLevel.rows, currentLevel.cols));
    }
        , [currentLevel]);

    const startNewGame = useCallback(() => {
        resetBoard();
    }
        , [resetBoard]);

    useEffect(() => {
        startNewGame();
    }
        , [currentLevel]);

    useEffect(() => {
        if (isGameEnded) {
            console.log("game ended stopping timer");
            stopTimer(); // Stop the timer when the game ends
        }
    }, [isGameEnded, stopTimer]);

    const openCell = (gameBoard: TBoard, row: number, col: number) => {
        /**
         * * @description: Open a cell and reveal its value. If the cell is empty (0), reveal adjacent cells recursively.
         * * @param {TBoard} gameBoard - The current game board.
         * * @param {number} row - The row index of the cell to open.
         * * @param {number} col - The column index of the cell to open.
         * * @returns {TBoard | null} - The updated game board or null if the game is over.
         */
        const newGameBoard: TBoard = JSON.parse(JSON.stringify(gameBoard)); // Deep copy of the game board
        const cell = newGameBoard[row][col];
        const isMineCell = cell.value === "mine";
        const isNumberCell = typeof cell.value === "number" && cell.value > 0;
        const isEmptyCell = typeof cell.value === "number" && cell.value === 0;

        if (!isTimerRunning) {
            startTimer(); // Start the timer on the first click
        }

        if (isMineCell) {
            setIsGameOver(true);
            console.log("Game Over!");
            revealAllMineCells(newGameBoard);
            //return null;
        }
        if (!isMineCell) {
            cell.isOpened = true;
            if (isNumberCell) { }
            if (isEmptyCell) {
                revealEmptyCells(newGameBoard, currentLevel.rows, currentLevel.cols, row, col);
            }
            if (checkGameWin(newGameBoard, currentLevel.mines)) {
                setIsGameWin(true);
                console.log("You Win!");
                revealAllMineCells(newGameBoard);
            }
        }
        return newGameBoard;
    }

    const handleCellClick = (row: number, col: number) => {
        /**
         * * @description: Handle cell click event. If it's the first click, initialize the board and place mines. Otherwise, open the clicked cell.
         * * @param {number} row - The row index of the clicked cell.
         * * @param {number} col - The column index of the clicked cell.
         * * @returns {void}
         */
        if (isGameEnded ||
            gameBoard[row][col].isOpened ||
            gameBoard[row][col].isFlagged
        ) {
            return null;
        }

        let newGameBoard: TBoard;

        if (isFirstClick) {
            const reservedPositions = getAdjacentCells(row, col, currentLevel.rows, currentLevel.cols);
            reservedPositions.push({ row, col });

            newGameBoard = clearFlags(gameBoard); // Clear flags on the new game board

            // Initialize the board with mines placed excluding reserved positions
            newGameBoard = initBoard(newGameBoard, currentLevel.rows, currentLevel.cols, currentLevel.mines, reservedPositions);
            setTotalFlags(0);
            setIsFirstClick(false);
        } else {
            newGameBoard = JSON.parse(JSON.stringify(gameBoard)); // Deep copy of the game board
        }

        const openCellGameBoard = openCell(newGameBoard, row, col);

        if (openCellGameBoard) {
            setGameBoard(openCellGameBoard);
        }

        console.log(`Cell clicked at (${row}, ${col})`);

    };

    const handleCellRightClick = (e: React.MouseEvent<HTMLDivElement>, row: number, col: number) => {
        /**
         * * @description: Handle right-click event to flag or unflag a cell. Prevent default context menu from appearing.
         * * @param {React.MouseEvent<HTMLDivElement>} e - The right-click event.
         * * @param {number} row - The row index of the clicked cell.
         * * @param {number} col - The column index of the clicked cell.
         * * @returns {void}
         */
        e.preventDefault(); // Prevent the default context menu from appearing

        if (isGameEnded || gameBoard[row][col].isOpened) return; // Prevent flagging opened cells
        if (!gameBoard[row][col].isFlagged && flagsLeft === 0) return; // Prevent flagging if no flags left

        let flagDifference = 0;

        setGameBoard((prevBoard) => {
            const newBoard: TBoard = JSON.parse(JSON.stringify(prevBoard)); // Deep copy of the game board
            const cell = prevBoard[row][col];

            if (cell.isFlagged) {
                newBoard[row][col].isFlagged = false;
                if (!flagDifference) flagDifference--;
            } else {
                newBoard[row][col].isFlagged = true;
                if (!flagDifference) flagDifference++;
            }

            if (checkGameWin(newBoard, currentLevel.mines)) {
                setIsGameWin(true);
                console.log("You Win!");
                revealAllMineCells(newBoard);
            }

            return newBoard;
        });

        setTotalFlags((prevFlags) => prevFlags + flagDifference);
    };


    return {
        level,
        changeLevel,
        gameBoard,
        handleCellClick,
        handleCellRightClick,
        isGameOver,
        isGameWin,
        isGameEnded,
        flagsLeft,
        startNewGame,
        timeDifference,
    };
};

export default useMinesweeperGame;