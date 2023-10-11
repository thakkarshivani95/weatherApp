import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import App from './App';

test('renders App component', () => {
  const { getByText, getByPlaceholderText } = render(<App />);
  const titleElement = getByText(/Weather App/i);
  expect(titleElement).toBeInTheDocument();

  const inputElement = getByPlaceholderText('Enter location');
  expect(inputElement).toBeInTheDocument();
});

test('fetches weather data and displays it', async () => {
  const { getByPlaceholderText, getByText } = render(<App />);
  const inputElement = getByPlaceholderText('Enter location');
  const buttonElement = getByText('Get Weather');

  fireEvent.change(inputElement, { target: { value: 'London' } });
  fireEvent.click(buttonElement);

  await waitFor(() => {
    const temperatureElement = getByText(/Temperature/i);
    expect(temperatureElement).toBeInTheDocument();

    const conditionElement = getByText(/Condition/i);
    expect(conditionElement).toBeInTheDocument();
  });
});

test('displays loading message while fetching data', async () => {
  const { getByPlaceholderText, getByText } = render(<App />);
  const inputElement = getByPlaceholderText('Enter location');
  const buttonElement = getByText('Get Weather');

  fireEvent.change(inputElement, { target: { value: 'Paris' } });
  fireEvent.click(buttonElement);

  const loadingElement = getByText('Loading...');
  expect(loadingElement).toBeInTheDocument();

  await waitFor(() => {
    const temperatureElement = getByText(/Temperature/i);
    expect(temperatureElement).toBeInTheDocument();
  });

  expect(loadingElement).not.toBeInTheDocument();
});
