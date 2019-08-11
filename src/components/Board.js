import React from 'react';
import { Square } from './Square';

export class Board extends React.Component {
  renderSquare(row, col) {
    const idx = 3 * row + col;
    let className = 'square';
    if (this.props.lastMove === idx) className += ' active';
    const winningCombo = this.props.winningCombo;
    if (winningCombo && winningCombo.includes(idx)) className += ' winner'
    return (
      <Square
        key={`row-${row}-col-${col}`}
        value={this.props.squares[idx]}
        className={className}
        onClick={() => this.props.onClick(idx)}
      />
    );
  }

  renderBoardRow(row) {
    let squares = []
    for (let col = 0; col < 3; col++) {
      squares.push(this.renderSquare(row, col));
    }
    return (
      <div key={`row-${row}`} className="board-row">
        {squares}
      </div>
    );
  }

  render() {
    let boardRows = [];
    for (let row = 0; row < 3; row++) {
      boardRows.push(this.renderBoardRow(row));
    }
    return <div className="game-board">{boardRows}</div>;
  }
}
