
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // Game state - Using more secure random number generation
  const generateSecureRandom = () => {
    // Fallback to Math.random if crypto is not available
    if (window.crypto?.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return Math.floor((array[0] / (0xffffffff + 1)) * 100) + 1;
    }
    return Math.floor(Math.random() * 100) + 1;
  };
  
  const [target, setTarget] = useState(() => generateSecureRandom());
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Sanitize input - only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setGuess(value);
    }
  };

  const handleGuess = () => {
    const numGuess = parseInt(guess, 10);
    // Enhanced input validation
    if (!Number.isInteger(numGuess) || numGuess < 1 || numGuess > 100) {
      setMessage('Please enter a valid number between 1 and 100.');
      return;
    }
    setAttempts(prev => prev + 1);
    if (numGuess === target) {
      setMessage(`Congratulations! You guessed the number in ${attempts + 1} attempts.`);
    } else if (numGuess < target) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
  };

  const handleRestart = () => {
    setTarget(generateSecureRandom());
    setGuess('');
    setMessage('');
    setAttempts(0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Guess the Number Game</h2>
        <p>I'm thinking of a number between 1 and 100.</p>
        <input
          type="number"
          value={guess}
          onChange={handleInputChange}
          min="1"
          max="100"
          disabled={message.startsWith('Congratulations')}
        />
        <button onClick={handleGuess} disabled={message.startsWith('Congratulations')}>Guess</button>
        <button onClick={handleRestart}>Restart</button>
        <p>{message}</p>
        <p>Attempts: {attempts}</p>
      </header>
    </div>
  );
}

export default App;
