import React, { useState, useEffect } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, playerName, opponentName, toggleEditingName }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + (winner === 'X' ? playerName : opponentName);
  } else if (!squares.includes(null)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? playerName : opponentName);
  }

  return (
    <>
      <div className="status">
        {status}
        {winner || !squares.includes(null) ? null : (
          <button className="edit-button" onClick={toggleEditingName} title="Change Name">
            ✏️
          </button>
        )}
      </div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      {winner || !squares.includes(null) ? <Alert message={status} /> : null}
    </>
  );
}

function Alert({ message }) {
  return (
    <div className="alert">
      <span className="closebtn" onClick={() => document.querySelector('.alert').style.display = 'none'}>&times;</span>
      {message}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerName, setPlayerName] = useState('Player');
  const [opponentName, setOpponentName] = useState('BOT');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPlayingWithBot, setIsPlayingWithBot] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function handleNameChange(event) {
    setPlayerName(event.target.value);
  }

  function handleOpponentNameChange(event) {
    setOpponentName(event.target.value);
  }

  function toggleEditingName() {
    setIsEditingName(!isEditingName);
  }

  function botMove(squares) {
    let availableSquares = [];
    squares.forEach((square, index) => {
      if (square === null) availableSquares.push(index);
    });
    const randomMove = availableSquares[Math.floor(Math.random() * availableSquares.length)];
    squares[randomMove] = 'O';
    handlePlay(squares);
  }

  useEffect(() => {
    if (isPlayingWithBot && !xIsNext && !calculateWinner(currentSquares)) {
      const squaresCopy = currentSquares.slice();
      botMove(squaresCopy);
    }
  }, [currentMove, isPlayingWithBot, xIsNext]);

  const moves = history.map((squares, move) => {
    if (move === 0) return null;
    const description = 'Go to move #' + move;
    return (
      <option key={move} value={move}>{description}</option>
    );
  });

  return (
    <div className="game-container">
      <h1 className="game-title">TicTacToe</h1>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            playerName={playerName}
            opponentName={opponentName}
            toggleEditingName={toggleEditingName}
          />
        </div>
        <div className="game-info">
          {isEditingName && (
            <div className="name-edit">
              <div>
                <label>Player 1 Name:</label>
                <input type="text" value={playerName} onChange={handleNameChange} />
              </div>
              {isPlayingWithBot ? (
                <div>
                  <label>Bot Name:</label>
                  <input type="text" value={opponentName} onChange={handleOpponentNameChange} />
                </div>
              ) : (
                <div>
                  <label>Player 2 Name:</label>
                  <input type="text" value={opponentName} onChange={handleOpponentNameChange} />
                </div>
              )}
              <button onClick={toggleEditingName}>OK</button>
            </div>
          )}
          <select onChange={(e) => jumpTo(Number(e.target.value))}>
            <option value="">Select move</option>
            {moves}
          </select>
          <button onClick={restartGame}>Restart Game</button>
          <div className="game-mode">
            <label>
              <input
                type="radio"
                name="game-mode"
                value="bot"
                checked={isPlayingWithBot}
                onChange={() => setIsPlayingWithBot(true)}
              />
              Play with Bot
            </label>
            <label>
              <input
                type="radio"
                name="game-mode"
                value="player"
                checked={!isPlayingWithBot}
                onChange={() => setIsPlayingWithBot(false)}
              />
              Play with Another Player
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
