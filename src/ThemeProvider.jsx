import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggle: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme'); 
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light')),
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}

      <button
        type="button"
        className="theme-toggle group px-2 border-box fixed bottom-5 right-5 z-50 active:scale-95"
        onClick={value.toggle}
        aria-label="Toggle theme"
        title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
      >
        <span className="sr-only">Toggle theme</span>

        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-current"
          aria-hidden="true"
        >
          <g
            className={[
              "sun origin-center transition-all duration-500 ease-out",
              "group-hover:rotate-45",
              theme === 'light'
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-75 -rotate-45"
            ].join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <line x1="12" y1="2"  x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2"  y1="12" x2="4"  y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>

          <defs>
            <mask id="moon-mask">
              <rect x="0" y="0" width="24" height="24" fill="white" />
              <circle cx="16" cy="10" r="8" fill="black" />
            </mask>
          </defs>
          <g
            className={[
              "moon origin-center transition-all duration-500 ease-out",
              "group-hover:-rotate-12",
              theme === 'light'
                ? "opacity-0 scale-75 rotate-45"
                : "opacity-100 scale-100 rotate-0"
            ].join(" ")}
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="8" mask="url(#moon-mask)" />

            <g className="transition-opacity duration-500 group-hover:opacity-100 opacity-70">
              <circle cx="5"  cy="6"  r="0.9" />
              <circle cx="19" cy="7"  r="0.6" />
              <circle cx="7"  cy="17" r="0.7" />
            </g>
          </g>
        </svg>
      </button>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
