import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserThemeMode, updateUserThemeMode } from '../../api/themeApi';
import { getTeamTheme } from '../../api/authService';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => Promise<void>;
  loading: boolean;
  teamColors: {
    primary: string;
    secondary: string;
  };
  isTeamTheme: boolean;
  setTeamColors: (colors: { primary: string; secondary: string }) => void;
  setIsTeamTheme: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.userId ?? 0;
  const teamId = user?.teamId ?? 0;

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamColors, setTeamColors] = useState({ primary: '#1976d2', secondary: '#dc004e' });
  const [isTeamTheme, setIsTeamTheme] = useState(false); // ✅ EKLENDİ

  useEffect(() => {
    const fetchTheme = async () => {
      setLoading(true);
      try {
        const mode = await fetchUserThemeMode(userId);
        setDarkMode(mode === 'dark');

        const selectedThemeId = localStorage.getItem('selectedThemeId') || 'default';

        if (selectedThemeId === 'team' && teamId) {
          const teamTheme = await getTeamTheme();
          if (teamTheme) {
            setTeamColors({
              primary: teamTheme.PrimaryColor || '#1976d2',
              secondary: teamTheme.SecondaryColor || '#dc004e',
            });
            setIsTeamTheme(true);
          }
        } else {
          // Varsayılan temayı uygula
          setTeamColors({
            primary: '#1976d2',
            secondary: '#dc004e',
          });
          setIsTeamTheme(false);
        }
      } catch (error) {
        console.error('Tema modu veya takım renkleri alınamadı', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTheme();
  }, [userId, teamId]);

  const toggleDarkMode = async () => {
    const newMode = darkMode ? 'light' : 'dark';
    try {
      await updateUserThemeMode(userId, newMode);
      setDarkMode(newMode === 'dark');
    } catch (error) {
      console.error('Tema modu güncellenemedi', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        loading,
        teamColors,
        isTeamTheme,
        setTeamColors,
        setIsTeamTheme, // ✅ Context'e ver
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
