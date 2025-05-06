import { useState } from 'react'
import './App.css'
import Game_board from './components/board'
import useMinesweeperGame from './hooks/useMinesweeperGame'
import SelectLevel from './components/selectLevel'
import Header from './components/header'
import Footer from './components/Footer'
import CustomLevelForm from './components/CustomLevelForm'

function App() {

  const isDebug = false; //change here to toggle between debug and normal mode

  const { level,
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
  } = useMinesweeperGame()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCustomLevelSubmit = (settings: { rows: number; cols: number; mines: number }) => {
    changeLevel('custom', settings);
    startNewGame();
  };

  return (
    <div className='game'>
      <Header
        isGameWin={isGameWin}
        isGameOver={isGameOver}
        isGameEnded={isGameEnded}
        minesLeft={flagsLeft}
        timeDifference={timeDifference}
      />
      <div className="board-container">
        <Game_board isDebug={isDebug} gameBoard={gameBoard} level={level} handleCellClick={handleCellClick} handleCellRightClick={handleCellRightClick} />
      </div>
      <SelectLevel level={level} changeLevel={changeLevel} />
      <CustomLevelForm
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSubmit={handleCustomLevelSubmit}
      />
      <Footer
        level={level}
        openModal={openModal}
        startNewGame={startNewGame}
      />
    </div>
  )
}

export default App
