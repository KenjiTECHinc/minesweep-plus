import GameStatus from "./gameStatus";

type headerProps = {
    isGameWin: boolean;
    isGameOver: boolean;
    isGameEnded: boolean;
    minesLeft: number;
}

const header = (props: headerProps) => {
    const { isGameWin, isGameOver, isGameEnded, minesLeft } = props;
    return (
        <header>
            <div className="header-labels">
                <GameStatus
                    isGameWin={isGameWin}
                    isGameOver={isGameOver}
                    isGameEnded={isGameEnded}
                    minesLeft={minesLeft}
                />
            </div>
        </header>
    )
}

export default header;