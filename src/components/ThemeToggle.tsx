import React, { useState, useEffect } from 'react';

export const ThemeToggle: React.FC = () => {
  const [isPinned, setIsPinned] = useState<boolean>(() => {
    return localStorage.getItem('color-scheme') !== null;
  });
  
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const pinned = localStorage.getItem('color-scheme');
    if (pinned === 'light' || pinned === 'dark') {
      return pinned;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Media query listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('color-scheme')) {
        const nextTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = systemIsDark ? 'dark' : 'light';

    if (!isPinned) {
      // Pin to the opposite of system theme
      const oppositeTheme = systemTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('color-scheme', oppositeTheme);
      setIsPinned(true);
      setResolvedTheme(oppositeTheme);
      document.documentElement.setAttribute('data-theme', oppositeTheme);
      if (metaColorScheme) {
        metaColorScheme.setAttribute('content', oppositeTheme);
      }
    } else {
      // Unpin and revert to system theme
      localStorage.removeItem('color-scheme');
      setIsPinned(false);
      setResolvedTheme(systemTheme);
      document.documentElement.removeAttribute('data-theme');
      if (metaColorScheme) {
        metaColorScheme.setAttribute('content', 'light dark');
      }
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-glass"
      style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
      title={isPinned ? `Pinned to ${resolvedTheme} mode. Click to follow system.` : `Following system (${resolvedTheme} mode). Click to override.`}
      id="theme-toggle-btn"
    >
      <span>{resolvedTheme === 'dark' ? '🌙' : '☀️'}</span>
      <span>{isPinned ? 'Pinned' : 'System'}</span>
    </button>
  );
};
