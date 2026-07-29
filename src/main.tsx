import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AdminDashboard from './admin/AdminDashboard.tsx';
import WorkPage from './components/WorkPage.tsx';
import AboutPage from './components/AboutPage.tsx';
import ExperiencePage from './components/ExperiencePage.tsx';
import ContactPage from './components/ContactPage.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import Chatbot from './components/Chatbot.tsx';
import './index.css';

/**
 * Lightweight hash-based routing (no router dependency):
 *   #/admin  → local Admin Dashboard
 *   #/work   → dedicated Work page (all projects)
 *   #/about  → dedicated About page (includes tech stack & skills)
 *   #/experience → dedicated Experience page
 *   #/contact → dedicated Contact page
 *   anything else → the public portfolio site
 * Hash routing works out of the box with `vite dev`, `vite build` and
 * `vite preview` — no server rewrite rules required.
 */
function Root() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const route = hash.replace(/^#\/?/, '').toLowerCase();
  const isAdmin = route.startsWith('admin');

  let page;
  if (isAdmin) page = <AdminDashboard />;
  else if (route.startsWith('work')) page = <WorkPage />;
  else if (route.startsWith('about')) page = <AboutPage />;
  else if (route.startsWith('experience')) page = <ExperiencePage />;
  else if (route.startsWith('contact')) page = <ContactPage />;
  else page = <App />;

  return (
    <>
      {page}
      {/* Global custom cursor — mounted once, persists across all routes */}
      <CustomCursor />
      {/* Floating AI assistant on all public pages (not the admin dashboard) */}
      {!isAdmin && <Chatbot />}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
