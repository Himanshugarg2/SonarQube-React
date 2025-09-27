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
    expect(screen.getByText(/Please enter a number between 1 and 100/i)).toBeInTheDocument();
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

  test('can restart the game', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Restart/i }));
    expect(screen.getByText(/Attempts: 0/i)).toBeInTheDocument();
  });
});
