import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage/MainPage';
import { AuthRedirect } from './pages/AuthPage/AuthRedirect';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth/callback" element={<AuthRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};
