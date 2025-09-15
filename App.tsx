
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';

export type Theme = 'light' | 'dark';

function App() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = isSystemDark ? 'dark' : 'light';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return newTheme;
    });
  };

  return (
    <div className="bg-background text-foreground font-sans antialiased">
      <div className="flex">
        <Workspace theme={theme} toggleTheme={toggleTheme} />
        <aside className="w-[360px] h-screen bg-background border-l border-border flex-shrink-0">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}

export default App;
