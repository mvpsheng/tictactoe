import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Square extends React.Component {

  render() {
    return (
      <button className={this.props.isWinning ? 'squarewinning' : 'square'}
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button >
    );
  }
}

class Board extends React.Component {


  renderSquare(i, isWinningSquare) {
    // const row = Math.floor(i / 3) + 1;
    // const col = (i % 3) + 1;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinning={isWinningSquare}
      /*         location={`(${row}, ${col})`} */
      />
    );
  }

  render() {
    const winningLine = calculateWinner(this.props.squares);
    return (
      <div>
        {[0, 1, 2].map((i) => (
          <div className="board-row">
            {[0, 1, 2].map((j) => {
              const index = i * 3 + j;
              const isWinningSquare = winningLine && winningLine.includes(index);
              return this.renderSquare(index, isWinningSquare);
            })}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // let row = Math.floor(i / 3) + 1;
    // let col = (i % 3) + 1;
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc = move ?
        `Go to move # ${move}` :
        'Go to game start';
      if (move === history.length - 1 && move != 0) {
        desc = `you are at move#${move}`;
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <span>{step.location ? `(${Math.floor(step.location / 3) + 1}, ${(step.location % 3) + 1})` : ''}</span>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else if (history.length === 10) {
      status = 'Draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => {
            this.setState({
              movesAscending: !this.state.movesAscending
            });
          }}>
            {this.state.movesAscending ? 'Sort Descending' : 'Sort Ascending'}
          </button>
          <ol>{this.state.movesAscending ? moves : moves.slice().reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
      return lines[i];
    }
  }
  return null;
}