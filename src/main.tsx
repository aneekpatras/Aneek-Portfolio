import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import App from './App.tsx';
import AdminDashboard from './admin/AdminDashboard.tsx';
import WorkPage from './components/WorkPage.tsx';
import AboutPage from './components/AboutPage.tsx';
import ExperiencePage from './components/ExperiencePage.tsx';
import ContactPage from './components/ContactPage.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import Chatbot from './components/Chatbot.tsx';
import './index.css';

function Root() {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<App />} />
        </Routes>
        <CustomCursor />
        <Routes>
          <Route path="/admin" element={null} />
          <Route path="*" element={<Chatbot />} />
        </Routes>
      </BrowserRouter>
    </ReactLenis>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);