import './App.css';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { trackPageView } from './services/api';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skill from './components/Skill';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import SkillBadges from './components/SkillBadges';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import QuickContact from './components/QuickContact';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Track analytics
    trackPageView(pathname).catch(console.error);
  }, [pathname]);

  return null;
}

function HomePage() {
  useGSAP(() => {
    const elements = gsap.utils.toArray('.reveal-up');
    elements.forEach((element) => {
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: '-200 bottom',
          end: 'bottom 80%',
          scrub: true,
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
      });
    });
  });

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skill />
        <SkillBadges />
        <Experience />
        <Certifications />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ReactLenis root>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <QuickContact />
      </ReactLenis>
    </BrowserRouter>
  );
}

export default App;
