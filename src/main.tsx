import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx: Starting app initialization');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
console.log('React root created');

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('App rendered');
