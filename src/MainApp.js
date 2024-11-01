import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'; // Import the App component

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

ReactDOM.render(<MainApp />, document.getElementById('root'));
