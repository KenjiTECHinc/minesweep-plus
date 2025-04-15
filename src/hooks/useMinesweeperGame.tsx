import { useCallback, useEffect, useState } from "react";
import { initBoard, initGame, revealAllMineCells, revealEmptyCells } from "../utils";
import { TBoard, TLevel } from "../types";
import { DEFAULT_LEVEL, LEVELS } from "../constants";

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
    const [gameBoard, setGameBoard] = useState(initGame(LEVELS[DEFAULT_LEVEL].rows, LEVELS[DEFAULT_LEVEL].cols, LEVELS[DEFAULT_LEVEL].mines));
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameWin, setIsGameWin] = useState(false);
    const isGameEnded = isGameOver || isGameWin;
    const minesLeft = currentLevel.mines;

    const resetBoard = useCallback(() => {
        setIsGameOver(false);
        setIsGameWin(false);
        setIsFirstClick(true);
        setGameBoard(initGame(currentLevel.rows, currentLevel.cols, currentLevel.mines));
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


    const openCell = (gameBoard: TBoard, row: number, col: number) => {
        const newGameBoard: TBoard = JSON.parse(JSON.stringify(gameBoard)); // Deep copy of the game board
        const cell = newGameBoard[row][col];
        const isMineCell = cell.value === "mine";
        const isNumberCell = typeof cell.value === "number" && cell.value > 0;
        const isEmptyCell = typeof cell.value === "number" && cell.value === 0;

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
        }
        return newGameBoard;
    }

    const handleCellClick = (row: number, col: number) => {
        // Handle cell click logic here
        if (isGameEnded ||
            gameBoard[row][col].isOpened ||
            gameBoard[row][col].isFlagged
        ) {
            return null;
        }

        const mineCell = gameBoard[row][col].value === "mine";
        const firstClickIsMine = isFirstClick && mineCell;

        let newGameBoard: TBoard;

        if (firstClickIsMine) {
            do {
                newGameBoard = initBoard(currentLevel.rows, currentLevel.cols, currentLevel.mines);
            } while (newGameBoard[row][col].value === "mine");
        } else {
            newGameBoard = JSON.parse(JSON.stringify(gameBoard)); // Deep copy of the game board
        }

        setIsFirstClick(false); // first click is false after game is played.
        const openCellGameBoard = openCell(newGameBoard, row, col);

        if (openCellGameBoard) {
            setGameBoard(openCellGameBoard);
        }

        console.log(`Cell clicked at (${row}, ${col})`);

    };

    const handleCellRightClick = (e: React.MouseEvent<HTMLDivElement>, row: number, col: number) => {
        e.preventDefault(); // Prevent the default context menu from appearing

        if (gameBoard[row][col].isOpened) return; // Prevent flagging opened cells

        setGameBoard((prevBoard) => {
            const newBoard: TBoard = JSON.parse(JSON.stringify(prevBoard)); // Deep copy of the game board
            const cell = newBoard[row][col];

            if (cell.isFlagged) {
                cell.isFlagged = false;
            } else {
                cell.isFlagged = true;
            }

            return newBoard;
        });

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
        minesLeft,
        startNewGame,
    };
};

export default useMinesweeperGame;