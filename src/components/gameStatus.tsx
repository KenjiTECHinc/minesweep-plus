type GameStatusProps = {
    isGameWin: boolean;
    isGameOver: boolean;
    isGameEnded: boolean;
    minesLeft: number;
};

const GameStatus = (props: GameStatusProps) => {
    const { isGameWin, isGameOver, isGameEnded, minesLeft } = props;
    return (
        <>
            {isGameWin && <div className="game-status">You Win! 🎉</div>}
            {isGameOver && <div className="game-status">Game Over! 💥</div>}
            {!isGameEnded && (<>🚩{minesLeft}</>)}
        </>
    );
};

export default GameStatus;