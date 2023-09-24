import React from 'react';
import Piece from './Piece';
import './Puzzle.css'; // Import the CSS file


const Puzzle = ({ image, pieces, handlePieceClick }) => {
  // Calculate the piece width and height based on the grid size
  const pieceSize = '15vw'; // Adjust the size as needed

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
