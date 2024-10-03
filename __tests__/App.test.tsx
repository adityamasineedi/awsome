// __tests__/App.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App'; // Ensure the relative path is correct

describe('App Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    expect(getByText('Welcome')).toBeTruthy();
  });
});
