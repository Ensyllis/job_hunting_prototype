import '../styles/globals.css'; // Global CSS
import type { AppProps } from 'next/app';

// Main App component wrapping all pages
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
