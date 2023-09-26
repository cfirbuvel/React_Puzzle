import React, { useState } from 'react';
import './App.css';
import Puzzle from './Puzzle';
import shuffle from 'lodash/shuffle'; 

function App() {
  // Load the image
  const imageUrl = process.env.PUBLIC_URL + '/image.jpg'; // Corrected path

  const [moveCount, setMoveCount] = useState(0);

  const [isVictory, setIsVictory] = useState(false); // New state for victory status


  // Function to reset the move count to 0
  const resetMoveCount = () => {
    setMoveCount(0);
  };

  // Function to check if the puzzle is solved
  const checkVictory = () => {
    const isSolved = pieces.every((piece, index) => {
      const correctPiece = initialPieces[index];
      return piece.x === correctPiece.x && piece.y === correctPiece.y;
    });
  
    if (isSolved) {
      setIsVictory(true);
    }
  };

  // Initialize a 3x3 grid with 8 image pieces and 1 empty piece
  const initialPieces = [
    { image: imageUrl, x: 0, y: 0 },
    { image: imageUrl, x: 1, y: 0 },
    { image: imageUrl, x: 2, y: 0 },
    { image: imageUrl, x: 0, y: 1 },
    { image: imageUrl, x: 1, y: 1 },
    { image: imageUrl, x: 2, y: 1 },
    { image: imageUrl, x: 0, y: 2 },
    { image: imageUrl, x: 1, y: 2 },
    { image: '', x: 2, y: 2 }, // An empty piece
  ];

  // Shuffle the initial pieces array
  const shuffledPieces = shuffle(initialPieces);

  const [pieces, setPieces] = useState(shuffledPieces);

  // Function to handle piece clicks
  const handlePieceClick = (clickedIndex) => {
    // Find the index of the empty piece
    const emptyIndex = pieces.findIndex((piece) => piece.image === '');
  
    // Calculate the row and column of the clicked piece
    const clickedRow = Math.floor(clickedIndex / 3);
    const clickedCol = clickedIndex % 3;
  
    // Calculate the row and column of the empty piece
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
  
    // Check if the clicked piece is adjacent to the empty piece (horizontally or vertically)
    const rowDiff = Math.abs(clickedRow - emptyRow);
    const colDiff = Math.abs(clickedCol - emptyCol);
  
    // Call checkVictory after piece click
    checkVictory();

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      // Increment the move count
      setMoveCount(moveCount + 1);
      // Swap the positions of the clicked piece and the empty piece
      const newPieces = [...pieces];
      newPieces[clickedIndex] = pieces[emptyIndex];
      newPieces[emptyIndex] = pieces[clickedIndex];
  
      // Update the state with the new pieces array
      setPieces(newPieces);
    }
  };
  
  // Function to shuffle the pieces (similar to what we discussed earlier)
  const shufflePieces = () => {
    const shuffledPieces = shuffle(pieces);
    resetMoveCount();
    setPieces(shuffledPieces);
  };

  return (
    <div className="App">
      {/* Display the victory message if `isVictory` is `true` */}
      {isVictory ? (
        <div className="victory-message">Congratulations! You solved the puzzle!</div>
      ) : (
        <div className="center-container">
          <div className="move-count">Moves: {moveCount}</div>
          <Puzzle image={imageUrl} pieces={pieces} handlePieceClick={handlePieceClick} />
        </div>
      )}
      <button onClick={shufflePieces}>Randomize</button>
    </div>
  );
}

export default App;
