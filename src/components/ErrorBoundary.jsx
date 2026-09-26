import { Component } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { isChunkLoadError, reloadOnceForChunkError } from '../lib/chunkReload';

/* On-brand fallback, same shell as the 404 page (Header/Footer stay mounted
   because the boundary only wraps the routed page). */
function ErrorFallback({ chunk }) {
  const { t } = useLanguage();
  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '140px 32px', textAlign: 'center' }}>
      <div role="alert" style={{ maxWidth: '560px' }}>
        <h1 className="h1">{t('Something went wrong')}</h1>
        <p className="lede" style={{ margin: '16px auto 0' }}>
          {chunk
            ? t('This page couldn’t be loaded. Please check your connection and reload.')
            : t('An unexpected error occurred. Please reload the page.')}
        </p>
        <button type="button" className="btn-cta" style={{ marginTop: '28px', border: 'none', cursor: 'pointer' }} onClick={() => window.location.reload()}>
          {t('Reload')}
        </button>
      </div>
    </main>
  );
}

/* Catches render errors and failed lazy-route chunk loads below it.
   `resetKey` (the pathname) clears the error on navigation, so one broken
   page never locks the visitor out of the rest of the site. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    // A stale/missing chunk: one guarded auto-reload usually recovers.
    if (isChunkLoadError(error)) reloadOnceForChunkError();
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) return <ErrorFallback chunk={isChunkLoadError(this.state.error)} />;
    return this.props.children;
  }
}
