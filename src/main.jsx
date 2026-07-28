import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// React.StrictMode re-enabled: every page is now idiomatic React with effects that
// clean up fully (intervals/timeouts/rAF/listeners all torn down), so StrictMode's
// dev-only double-invocation is safe — no double-initialized DOM, no leaked timers.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
