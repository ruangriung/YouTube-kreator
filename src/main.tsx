import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import TermsOfService from './pages/TermsOfService.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'pending-client-id';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);
