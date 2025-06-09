import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'light' | 'dark' | 'system';

const ThemeContext = createContext({
  theme: 'system' as ThemeType,
  setTheme: (theme: ThemeType) => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children, setThemes }: any) {
  const [theme, setTheme] = useState<ThemeType>('system');

  useEffect(() => {
    if (setThemes) setThemes(theme);
  }, [theme, setThemes]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 