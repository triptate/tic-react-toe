import React from 'react';
import { Board } from './Board';

export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastMove: null,
        winningCombo: null
      }],
      stepNumber: 0,
      reverseMoves: false
    };
  }

  playerForStep(step) {
    return (step % 2) === 0 ? 'O' : 'X';
  }

  playerAtSquare(i) {
    const current = this.state.history[this.state.stepNumber];
    return current.squares[i]
  }

  coords(i) {
    const x = i % 3 + 1;
    const y = Math.floor((11 - i) / 3);
    return { x: x, y: y };
  }

  isOver(history) {
    return history.length === 10 || this.getWinningCombo(history);
  }

  getWinningCombo(history) {
    const current = history[history.length - 1];
    return current.winningCombo;
  }

  determineWinningCombo(squares) {
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

  handleClick(i) {
    const thisStep = this.state.stepNumber + 1
    const history = this.state.history.slice(0, thisStep);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.isOver(history) || squares[i]) return;

    squares[i] = this.playerForStep(thisStep);
    this.setState({
      history: history.concat([{
        squares: squares,
        lastMove: i,
        winningCombo: this.determineWinningCombo(squares)
      }]),
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({ stepNumber: step });
  }

  reverseMoves() {
    this.setState({ reverseMoves: !this.state.reverseMoves });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const winningCombo = current.winningCombo;

    let moves = history.map((step, move) => {
      let desc;
      if (move) {
        const coords = this.coords(step.lastMove);
        desc = `Move #${move}: ${this.playerForStep(move)} to position (${coords.x}, ${coords.y})`;
      } else {
        desc = 'Start of game';
      }
      return (
        <li key={move}>
          {desc}
          <button onClick={() => this.jumpTo(move)}>
            Go
          </button>
        </li>
      )
    })
    if (this.state.reverseMoves) moves.reverse();

    let status;
    if (winningCombo) {
      status = `Winner: ${this.playerAtSquare(winningCombo[0])}`;
    } else if (this.isOver(history)) {
      status = 'It\'s a draw...';
    } else {
      status = `Next player: ${this.playerForStep(this.state.stepNumber + 1)}`;
    }

    return (
      <div className="game">
        <Board
          squares={squares}
          winningCombo={winningCombo}
          lastMove={current.lastMove}
          onClick={(i) => this.handleClick(i)}
        />
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.reverseMoves()}>
            Reverse Moves
          </button>
        </div>
      </div>
    );
  }
}
