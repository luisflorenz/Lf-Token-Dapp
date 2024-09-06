import React from 'react';
import ReactDOM from 'react-dom'; // Update this import to use 'react-dom/client'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Use ReactDOM.createRoot instead of ReactDOM.render
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); // Create the root element

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: This is for measuring performance
reportWebVitals();
