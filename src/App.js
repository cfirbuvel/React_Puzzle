import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Puzzle from './Puzzle';
import shuffle from 'lodash/shuffle'; 


function App() {
  // Load the image
  const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL + '/image.jpg'); 
  const [moveCount, setMoveCount] = useState(0);
  const [isVictory, setIsVictory] = useState(false); 
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

// Function to check the timer color
const timerColorClass = useCallback(() => {
  if (elapsedTime >= 0 && elapsedTime < 120) {
    return 'green-timer'; // Dark green color for 0-2 minutes
  } else if (elapsedTime >= 120 && elapsedTime < 300) {
    return 'yellow-timer'; // Dark yellow color for 2-5 minutes
  } else if (elapsedTime >= 300 && elapsedTime < 600) {
    return 'red-timer'; // Dark red color for 5-10 minutes
  }
  return ''; // Default color
}, [elapsedTime]);

  // Effect to update the elapsed time
useEffect(() => {
  let intervalId;

  // Start the timer when `isTimerRunning` is `true`
  if (isTimerRunning) {
    intervalId = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000); // Update every second
  } else {
    clearInterval(intervalId);
  }

  // Clean up the interval on unmount or when `isTimerRunning` changes
  return () => {
    clearInterval(intervalId);
  };
}, [isTimerRunning, elapsedTime, timerColorClass]);

// Effect to update the timer color class based on `elapsedTime`
useEffect(() => {
  const colorClass = timerColorClass();
  const timerElement = document.querySelector('.timer');
  if (timerElement) {
    timerElement.className = `timer ${colorClass}`;
  }
}, [elapsedTime, timerColorClass]);


  // Function to start the timer
  const startTimer = () => {
    setIsTimerRunning(true);
  };

  // Function to stop the timer
  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  // Function to reset the timer
  const resetTimer = () => {
    setElapsedTime(0);
  };


  // Function to reset the move count to 0
  const resetMoveCount = () => {
    setMoveCount(0);
  };

  // Function to format the elapsed time as "Xm Ys"
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  // Function to check if the puzzle is solved
  const checkVictory = () => {
    startTimer();
    const isSolved = pieces.every((piece, index) => {
      const correctPiece = initialPieces[index];
      return piece.x === correctPiece.x && piece.y === correctPiece.y;
    });

    if (isSolved && !isTimerRunning) {
      stopTimer();
      setIsVictory(true);
    }

    if (isSolved) {
      stopTimer();
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

  //Helper for solving the puzzle fast
  // const [pieces, setPieces] = useState(initialPieces);

  // Shuffle the initial pieces array
  const shuffledPieces = shuffle(initialPieces);

  const [pieces, setPieces] = useState(shuffledPieces);

  // Function to handle piece clicks
  const handlePieceClick = (clickedIndex) => {

    // Start the timer when the user first clicks on the puzzle
    if (!isTimerRunning) {
      startTimer();
    }
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
  
  // Define the winning levels
  const levels = [
    { name: 'Bronze', minMoves: 201, maxMoves: Infinity },
    { name: 'Silver', minMoves: 101, maxMoves: 200 },
    { name: 'Gold', minMoves: 0, maxMoves: 100 },
  ];

  // Function to determine the user's rank based on the number of moves
  const determineRank = () => {
    for (const level of levels) {
      if (moveCount >= level.minMoves && moveCount <= level.maxMoves) {
        return level.name;
      }
    }
    return 'No Rank'; // Default if none of the levels match
  };

   // Function to reset the puzzle
   const resetPuzzle = () => {
    // Reset move count to 0
    resetMoveCount();
    resetTimer();

    // Shuffle the initial pieces array
    const shuffledPieces = shuffle(initialPieces);

    // Update the state with the new shuffled pieces
    setPieces(shuffledPieces);

    // Reset victory status
    setIsVictory(false);
  };

  // Function to shuffle the pieces (similar to what we discussed earlier)
  const shufflePieces = () => {
    const shuffledPieces = shuffle(pieces);
    resetTimer();
    stopTimer();
    resetMoveCount();
    setPieces(shuffledPieces);
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Update the image URL and initialPieces with the new image
        setImageUrl(e.target.result);
        // Create a copy of initialPieces and update the image property for each piece
        const updatedPieces = initialPieces.map((piece, index) => ({
          ...piece,
          image: e.target.result,
          x: index % 3,
          y: Math.floor(index / 3),
        }));
  
        // Set the last piece as empty
        updatedPieces[8].image = '';

        // Shuffle the pieces
        const shuffledPieces = shuffle(updatedPieces);

         // Update the pieces state
        setPieces(shuffledPieces);

        setPieces(shuffledPieces);
        // Reset move count when a new image is uploaded
        resetMoveCount();
        // Reset victory status
        setIsVictory(false);
      };
      reader.readAsDataURL(file);
    }
  };

return (
    <div className="App">
      {isVictory ? (
        <div className="victory-message">
          Congratulations! You solved the puzzle in {moveCount} moves.
          <div>Your Rank: {determineRank()}</div>
          <div className={`timer ${timerColorClass()}`}>{formatTime(elapsedTime)}</div>
          <button onClick={resetPuzzle}>Restart Puzzle</button>
        </div>
      ) : (
        <div className="center-container">
          <div className="timer">Time: {formatTime(elapsedTime)}</div> {/* Display the elapsed time */}
          <div className="move-count">Moves: {moveCount}</div>
          <Puzzle image={imageUrl} pieces={pieces} handlePieceClick={handlePieceClick} />
          <button onClick={shufflePieces}>Randomize</button>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="upload-button" />
        </div>
      )}
    </div>
  );
}

export default App;
