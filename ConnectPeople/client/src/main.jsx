import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/Home.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import './styles.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
    </Routes>
  </BrowserRouter>
);
