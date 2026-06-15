import { useState, useContext, useEffect } from 'react';
import Navbar from './Navbar';
import { ThemeContext } from '../ThemeProvider';

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useContext(ThemeContext);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile nav on link click
  const handleNavClick = () => setNavOpen(false);

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {navOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}

      <header
        className={`fixed top-0 left-0 w-full h-16 md:h-20 flex items-center z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-zinc-900/80 backdrop-blur-xl shadow-lg shadow-zinc-950/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-2xl w-full mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="logo shrink-0 relative z-10">
            <img src="/logo.svg" width={36} height={36} alt="Rangga Mukti Logo" />
          </a>

          {/* Center Nav (desktop) */}
          <div className="hidden md:flex items-center">
            <Navbar navOpen={false} onNavClick={handleNavClick} />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 relative z-10">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="w-9 h-9 grid place-items-center rounded-xl bg-zinc-50/10 ring-1 ring-inset ring-zinc-50/5 backdrop-blur-2xl transition-all hover:bg-zinc-50/15 active:scale-95"
            >
              {theme === 'light' ? (
                <span className="material-symbols-rounded text-lg">dark_mode</span>
              ) : (
                <span className="material-symbols-rounded text-lg">light_mode</span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="menu-btn md:hidden"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-rounded">
                {navOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        <div className="md:hidden">
          <Navbar navOpen={navOpen} onNavClick={handleNavClick} />
        </div>
      </header>
    </>
  );
}

export default Header;
