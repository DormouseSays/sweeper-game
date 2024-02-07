import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './src/app';

// TODO only add this in local development, skip in production //TODO this might need to be just location not window.location
new EventSource('/esbuild').addEventListener('change', () => window.location.reload());
// new EventSource('/esbuild').addEventListener('change', (e) => console.log('esbuild change event', e))

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
