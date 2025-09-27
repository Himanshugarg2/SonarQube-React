import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Guess the Number Game', () => {
  test('renders game UI', () => {
    render(<App />);
    expect(screen.getByText(/Guess the Number Game/i)).toBeInTheDocument();
    expect(screen.getByText(/I'm thinking of a number between 1 and 100/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guess/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Restart/i })).toBeInTheDocument();
  });

  test('shows error for invalid input', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '200' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    expect(screen.getByText(/Please enter a valid number between 1 and 100/i)).toBeInTheDocument();
  });

  test('shows error for input below range', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    expect(screen.getByText(/Please enter a valid number between 1 and 100/i)).toBeInTheDocument();
  });

  test('shows error for empty input', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    expect(screen.getByText(/Please enter a valid number between 1 and 100/i)).toBeInTheDocument();
  });

  test('prevents non-numeric input', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    
    // Try to enter non-numeric characters
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input).toHaveValue(null); // Should remain empty
    
    // Try to enter special characters
    fireEvent.change(input, { target: { value: '!@#' } });
    expect(input).toHaveValue(null); // Should remain empty
    
    // Valid numeric input should work
    fireEvent.change(input, { target: { value: '50' } });
    expect(input).toHaveValue(50);
  });

  test('shows feedback for wrong guess', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    expect(
      screen.getByText(/Too low! Try again.|Too high! Try again./i)
    ).toBeInTheDocument();
  });

  test('updates input value when typing', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '50' } });
    expect(input).toHaveValue(50);
  });

  test('increments attempts counter', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    
    // Make first guess
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    expect(screen.getByText(/Attempts: 1/i)).toBeInTheDocument();
    
    // Make second guess
    fireEvent.change(input, { target: { value: '75' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    expect(screen.getByText(/Attempts: 2/i)).toBeInTheDocument();
  });

  test('can restart the game', () => {
    render(<App />);
    
    // Make a guess first
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    
    // Then restart
    fireEvent.click(screen.getByRole('button', { name: /Restart/i }));
    expect(screen.getByText(/Attempts: 0/i)).toBeInTheDocument();
    expect(input).toHaveValue(null);
  });

  test('disables input and guess button when game is won', () => {
    // Mock Math.random to return a predictable value
    const mockMath = Object.create(global.Math);
    mockMath.random = jest.fn(() => 0.49); // This will give us 50 as the target
    global.Math = mockMath;
    
    render(<App />);
    const input = screen.getByRole('spinbutton');
    const guessButton = screen.getByRole('button', { name: /Guess/i });
    
    // Guess the correct number
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(guessButton);
    
    expect(screen.getByText(/Congratulations!/i)).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(guessButton).toBeDisabled();
    
    // Restore Math.random
    global.Math = Math;
  });
});
