
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // Game state
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleInputChange = (e) => {
    setGuess(e.target.value);
  };

  const handleGuess = () => {
    const numGuess = Number(guess);
    if (!numGuess || numGuess < 1 || numGuess > 100) {
      setMessage('Please enter a number between 1 and 100.');
      return;
    }
    setAttempts(attempts + 1);
    if (numGuess === target) {
      setMessage(`Congratulations! You guessed the number in ${attempts + 1} attempts.`);
    } else if (numGuess < target) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
  };

  const handleRestart = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
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
