"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    primaryRgb: string;
    secondaryRgb: string;
    accentRgb: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'dawn',
    name: 'Dawn',
    colors: {
      primary: '#f97316', // orange-500
      secondary: '#db2777', // pink-600
      accent: '#fb923c', // orange-400
      primaryRgb: '249, 115, 22',
      secondaryRgb: '219, 39, 119',
      accentRgb: '251, 146, 60'
    }
  },
  {
    id: 'twilight',
    name: 'Twilight',
    colors: {
      primary: '#3b82f6', // blue-500
      secondary: '#7c3aed', // violet-600
      accent: '#60a5fa', // blue-400
      primaryRgb: '59, 130, 246',
      secondaryRgb: '124, 58, 237',
      accentRgb: '96, 165, 250'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#22c55e', // green-500
      secondary: '#2563eb', // blue-600
      accent: '#4ade80', // green-400
      primaryRgb: '34, 197, 94',
      secondaryRgb: '37, 99, 235',
      accentRgb: '74, 222, 128'
    }
  },
  {
    id: 'inferno',
    name: 'Inferno',
    colors: {
      primary: '#ff3131', // bright red
      secondary: '#3a0ca3', // deep purple
      accent: '#ff5757', // lighter red
      primaryRgb: '255, 49, 49',
      secondaryRgb: '58, 12, 163',
      accentRgb: '255, 87, 87'
    }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]); // Default to Dawn

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('levelup-theme');
    if (savedTheme) {
      const theme = themes.find(t => t.id === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  // Update CSS custom properties when theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', currentTheme.colors.primary);
    root.style.setProperty('--theme-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--theme-accent', currentTheme.colors.accent);
    root.style.setProperty('--theme-primary-rgb', currentTheme.colors.primaryRgb);
    root.style.setProperty('--theme-secondary-rgb', currentTheme.colors.secondaryRgb);
    root.style.setProperty('--theme-accent-rgb', currentTheme.colors.accentRgb);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('levelup-theme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}