// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage/MainPage';
import { AuthRedirect } from './pages/AuthPage/AuthRedirect';
import { LoginScreen } from './pages/LoginScreen/LoginScreen'; 

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth/callback" element={<AuthRedirect />} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </BrowserRouter>
  );
};
