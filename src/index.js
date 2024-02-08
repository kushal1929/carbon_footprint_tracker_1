import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './components/common/AuthContext';


ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
    <Router>
      <App />
      <ToastContainer />
    </Router>
    </AuthProvider>

  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
