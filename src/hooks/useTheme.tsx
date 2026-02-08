'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeStyle } from '@/lib/types';

interface ThemeContextType {
  style: ThemeStyle;
  setStyle: (style: ThemeStyle) => void;
  toggleStyle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<ThemeStyle>('pixel');

  useEffect(() => {
    const saved = localStorage.getItem('theme-style') as ThemeStyle;
    if (saved) setStyle(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-style', style);
    document.documentElement.setAttribute('data-theme-style', style);
  }, [style]);

  const toggleStyle = () => {
    setStyle(prev => prev === 'pixel' ? 'modern' : 'pixel');
  };

  return (
    <ThemeContext.Provider value={{ style, setStyle, toggleStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
