import React from 'react';

const Piece = ({ piece, width, height, handleClick }) => {
  const pieceStyle = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundImage: `url(${piece.image})`,
    backgroundPosition: `-${piece.x * width}px -${piece.y * height}px`,
  };

  return (
    <div className="piece" style={pieceStyle} onClick={handleClick}>
      {/* Add any additional content or styles for the pieces */}
    </div>
  );
};

export default Piece;
