import { TBoard, TLevel } from '../types';
import Cell from './cell';

type Props = {
    gameBoard: TBoard;
    level: TLevel;
    handleCellClick: (row: number, col: number) => void;
    handleCellRightClick: (e: React.MouseEvent<HTMLDivElement>, row: number, col: number) => void;
}

const Game_board = (props: Props) => {
    const { gameBoard, level, handleCellClick, handleCellRightClick } = props;

    return (
        <div className="game_board">
            {gameBoard.map((row, rowIndex) => (
                <div className="row">
                    {row.map((cell, cellIndex) => (
                        <Cell
                            cell={cell}
                            level={level}
                            rowIndex={rowIndex}
                            colIndex={cellIndex}
                            handleCellClick={handleCellClick}
                            handleCellRightClick={handleCellRightClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Game_board;