import { useState } from 'react';
import './App.css';

const algorithm = require('./algorithm');

function App() {

  const getChar = (turn) => {
    if (turn === 0)
      return ' ';
    if (turn === 1)
      return 'O';
    if (turn === 2)
      return 'X';
    return 'N';
  }

  const [status, setStatus] = useState('PLAYING');
  const [board, setBoard] = useState(
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  );

  const onGrid = (row, col) => {
    if (status !== 'PLAYING')
      return;

    if (board[row][col] !== 0) {
      alert('You can put into only empty cells.')
      return;
    }

    let new_board = [...board];
    new_board[row][col] = 1;
    setBoard(new_board);

    let pos = algorithm.getNextTurn(new_board, 2);

    if (pos === null) {
      setStatus('WithDraw!');
      return;
    }

    let final_board = [...new_board];
    final_board[pos[0]][pos[1]] = 2;
    setBoard(final_board);

    let winner = algorithm.isEnd(final_board);
    if (winner !== 0) {
      if (winner === 1)
        setStatus('Player won!');
      else
        setStatus('Computer won!');
    }
  };

  const onreset = () => {
    setStatus('PLAYING');
    setBoard(
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    )
  };

  return (
    <div className="App">
      <header className="App-header">
        {
          status !== 'PLAYING' ? 
            <div className="status">
              <div>
                {status}
              </div>
              <button onClick={() => onreset()} className="statusbtn">Reset</button>
            </div>
             : 
            <></>
        }
        {
          board.map((rowdata, row) => {
            return (
              <div key={row} className="row">
                {
                  rowdata.map((coldata, col) => {
                    return <div 
                              key={col}
                              onClick={() => onGrid(row, col)} 
                              className="col">{getChar(board[row][col])}
                           </div>
                  })
                }
              </div>
            )
          })
        }
      </header>
    </div>
  );
}

export default App;
