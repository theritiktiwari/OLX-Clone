import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.scss';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const siteName = 'OLX Clone';

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App siteName={siteName} />
    </BrowserRouter>
  </React.StrictMode>
);