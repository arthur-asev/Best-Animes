import React from 'react';

import './index.css';
import { BrowserRouter } from 'react-router';
import App from "./app";
import ReactDOM from 'react-dom/client';


const rootElement = document.getElementById('root');

if (rootElement) {
  // Criar a raiz do React
  const root = ReactDOM.createRoot(rootElement);

  // Usar o método render para renderizar o JSX
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('Elemento com id "root" não encontrado.');
}
