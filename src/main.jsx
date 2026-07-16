import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Note: React.StrictMode is intentionally omitted. Several pages mount ported imperative
// runtimes (Home's product switcher/dashboards, canvas effects, etc.); StrictMode's dev-only
// double-invocation of effects would double-initialize that DOM. Effects still clean up fully
// (each returns a teardown), so this only affects the dev double-mount behavior.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
