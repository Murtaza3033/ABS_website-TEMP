import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';

// CMS plumbing only (Phase 3) — no page wiring, no visible behavior change.
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
