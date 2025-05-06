import clsx from 'clsx';
import { CELL_NUMBERS_COLORS } from '../constants';
import { gameCell, TLevel } from '../types';

type CellProps = {
    isDebug: boolean;
    cell: gameCell;
    level: TLevel;
    rowIndex: number;
    colIndex: number;
    handleCellClick: (row: number, col: number) => void;
    handleCellRightClick: (e: React.MouseEvent<HTMLDivElement>, row: number, col: number) => void;
}

const Cell = ({ isDebug, cell, level, rowIndex, colIndex, handleCellClick, handleCellRightClick }: CellProps) => {
    return (
        <div className={clsx(
            "cell",
            typeof cell.value === "number" && CELL_NUMBERS_COLORS[cell.value],
            level !== "default" && "small")}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
        >
            {(typeof cell.value === "number" && cell.value) ? cell.value : ""}
            {cell.value === "mine" && <span className="mine">💣</span>}
            {!cell.isOpened &&
                <div className={isDebug ? "overlay-debug" : "overlay"}>
                    <span className={clsx("flag", cell.isFlagged && "active")}>🚩</span>
                </div>
            }
        </div >
    );
};

export default Cell;