import React from 'react';
import './Puzzle.css';
import Piece from './Piece';

const Puzzle = ({ image, pieces, handlePieceClick }) => {
  // Calculate the piece width and height based on the screen size
  const screenWidth = window.innerWidth;
  const pieceSize = Math.min(screenWidth * 0.2, 200);

  return (
    <div className="puzzle">
      {pieces.map((piece, index) => (
        <Piece
          key={index}
          piece={piece}
          width={pieceSize}
          height={pieceSize}
          handleClick={() => handlePieceClick(index)}
        />
      ))}
    </div>
  );
};

export default Puzzle;
