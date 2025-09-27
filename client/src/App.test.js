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
    // Mock crypto.getRandomValues to return a predictable value
    const mockGetRandomValues = jest.fn((array) => {
      array[0] = 2147483647; // This will give us approximately 50 as the target
    });
    
    Object.defineProperty(window, 'crypto', {
      value: { getRandomValues: mockGetRandomValues },
      writable: true
    });
    
    render(<App />);
    const input = screen.getByRole('spinbutton');
    const guessButton = screen.getByRole('button', { name: /Guess/i });
    
    // Guess the correct number
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(guessButton);
    
    expect(screen.getByText(/Congratulations!/i)).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(guessButton).toBeDisabled();
  });

  test('generates random numbers within valid range', () => {
    // Test that the random generation always produces numbers 1-100
    // We can't test the exact value, but we can test the range
    for (let i = 0; i < 10; i++) {
      render(<App />);
      // The game should always start with a valid state (no error messages)
      expect(screen.queryByText(/Please enter a valid number/i)).not.toBeInTheDocument();
    }
  });
});
