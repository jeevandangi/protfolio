import { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  // Fixed theme - no dark/light mode toggle
  const value = {
    isDark: false, // Always false since we're using a custom color scheme
    toggleTheme: () => { }, // No-op function
    theme: 'custom',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
