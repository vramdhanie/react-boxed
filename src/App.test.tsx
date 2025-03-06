import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders solve button', () => {
  render(<App />);
  const linkElement = screen.getByText(/Solve/i);
  expect(linkElement).toBeInTheDocument();
});
