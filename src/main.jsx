import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { storedLang } from './context/LanguageContext';
import { loadArabic } from './lib/arabic';

// staleTime is generous since CMS content changes rarely relative to page views.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// React.StrictMode re-enabled: every page is now idiomatic React with effects that
// clean up fully (intervals/timeouts/rAF/listeners all torn down), so StrictMode's
// dev-only double-invocation is safe — no double-initialized DOM, no leaked timers.
const render = () => {
  // index.html's static <title> is only the no-JS default; drop it so the
  // <title> React/Helmet hoists into <head> is the only one (no duplicates).
  document.getElementById('static-title')?.remove();
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
};

// English renders immediately; a returning Arabic visitor waits for the
// dictionary chunk first so the page never flashes English (falls back to
// English if the chunk can't load).
if (storedLang() === 'ar') loadArabic().then(render, render);
else render();
