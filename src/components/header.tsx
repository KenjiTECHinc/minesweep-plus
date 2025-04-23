import GameStatus from "./gameStatus";
import TimerDisplay from "./timerDisplay";

type headerProps = {
    isGameWin: boolean;
    isGameOver: boolean;
    isGameEnded: boolean;
    minesLeft: number;
    timeDifference: string;
}

const header = (props: headerProps) => {
    const { isGameWin, isGameOver, isGameEnded, minesLeft, timeDifference } = props;
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
            <div className="header-labels">
                <TimerDisplay timeDifference={timeDifference} />
            </div>
        </header>
    )
}

export default header;