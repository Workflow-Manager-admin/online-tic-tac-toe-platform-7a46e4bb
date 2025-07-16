import React from "react";
import "./GameBoard.css";

/**
 * GameBoard component displays 3x3 tic-tac-toe board and handles move input.
 *
 * Props:
 *  - board: array of 9 elements ("X", "O", or "")
 *  - onCellClick: function(index) - called when a cell is clicked
 *  - mySymbol: "X"|"O"
 *  - turn: "X"|"O"
 *  - isOver: bool
 *  - winner: "X"|"O"|null
 */
// PUBLIC_INTERFACE
function GameBoard({ board, onCellClick, mySymbol, turn, isOver, winner }) {
  return (
    <div className="game-board-container">
      <div className="game-board">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className={`cell${cell ? " occupied" : ""}`}
            disabled={!!cell || isOver || turn !== mySymbol}
            onClick={() => onCellClick(idx)}
            aria-label={`Cell ${idx + 1}: ${cell || "empty"}`}
          >
            {cell}
          </button>
        ))}
      </div>
      <div className="game-status">
        {isOver ? (
          winner ? (
            <span className="winner">Winner: {winner}</span>
          ) : (
            <span className="draw">Draw!</span>
          )
        ) : (
          <span>
            {turn === mySymbol
              ? "Your turn"
              : `Waiting for ${turn}`}
          </span>
        )}
      </div>
    </div>
  );
}

export default GameBoard;
