import React, { useEffect, useState } from 'react';
import { getDefaultTheme, getTeamTheme, fetchUserInfo } from '../../api/authService';
import { useTheme } from "../../components/theme/ThemeContext";
import MessageBox from "../../components/messagebox/MessageBox";

type ThemeData = {
  id: string;
  title: string;
  img: string;
  primary?: string;
  secondary?: string;
};

const ThemeSettings: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string>(() => {
    return localStorage.getItem('selectedThemeId') || 'default';
  });
  const [cardData, setCardData] = useState<ThemeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { darkMode, setTeamColors, setIsTeamTheme } = useTheme();
  const [message, setMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchThemesWithUser = async () => {
      try {
        await fetchUserInfo();

        const [defaultTheme, teamTheme] = await Promise.all([
          getDefaultTheme(),
          getTeamTheme(),
        ]);

        const baseUrl = 'http://localhost:5000';

        const cards: ThemeData[] = [
          {
            id: 'default',
            title: 'Varsayılan Tema',
            img: defaultTheme?.ThemeLightUrl?.startsWith('http')
              ? defaultTheme.ThemeLightUrl
              : baseUrl + defaultTheme?.ThemeLightUrl,
            primary: defaultTheme?.PrimaryColor || '#1976d2',
            secondary: defaultTheme?.SecondaryColor || '#dc004e',
          },
          {
            id: 'team',
            title: 'Takım Teması',
            img: teamTheme?.ThemeLightUrl?.startsWith('http')
              ? teamTheme.ThemeLightUrl
              : baseUrl + teamTheme?.ThemeLightUrl,
            primary: teamTheme?.PrimaryColor || '#1976d2',
            secondary: teamTheme?.SecondaryColor || '#dc004e',
          },
        ];

        setCardData(cards);
      } catch (error) {
        console.error('Tema veya kullanıcı verisi alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemesWithUser();
  }, []);

  useEffect(() => {
    if (cardData.length === 0) return;

    const storedThemeId = localStorage.getItem('selectedThemeId') || 'default';
    const selectedTheme = cardData.find(c => c.id === storedThemeId) || cardData[0];

    setSelectedCard(selectedTheme.id);

    if (selectedTheme.primary && selectedTheme.secondary) {
      setTeamColors({
        primary: selectedTheme.primary,
        secondary: selectedTheme.secondary,
      });
      setIsTeamTheme(selectedTheme.id === 'team');
    }
  }, [cardData]);

  const handleSelect = (id: string) => {
    localStorage.setItem('selectedThemeId', id);
    setSelectedCard(id);

    const selectedTheme = cardData.find(c => c.id === id);
    if (selectedTheme?.primary && selectedTheme?.secondary) {
      setTeamColors({
        primary: selectedTheme.primary,
        secondary: selectedTheme.secondary,
      });
      setIsTeamTheme(id === 'team');
      setMessage(`"${selectedTheme.title}" teması uygulandı`);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div
      style={{
        maxWidth: 650,
        fontFamily: 'Arial, sans-serif',
        backgroundColor: darkMode ? 'black' : '#fff',
        color: darkMode ? '#eee' : '#111',
        padding: 20,
        borderRadius: 8,
      }}
    >
      <MessageBox message={message} duration={3000} />
      <h2>Uygulama Teması</h2>
      <div>Uygulamanın görünümünü kendi tercihlerine göre kişiselleştir.</div>
      <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
        {cardData.map(({ id, title, img }) => (
          <div
            key={id}
            onClick={() => handleSelect(id)}
            style={{
              cursor: 'pointer',
              borderRadius: 12,
              overflow: 'hidden',
              width: 400,
              userSelect: 'none',
              backgroundColor: darkMode ? '#1e1e1e' : '#fff',
              border: selectedCard === id
                ? `3px solid ${darkMode ? 'rgb(34, 234, 84)' : 'rgb(34, 234, 84)'}`
                : darkMode
                  ? '1.5px solid #444'
                  : '1.5px solid #ddd',
              boxShadow: selectedCard === id
                ? '0 8px 20px rgba(34, 234, 84, 0.4)'
                : darkMode
                  ? '0 2px 6px rgba(0,0,0,0.6)'
                  : '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.transform = 'scale(1.03)';
              el.style.boxShadow = '0 12px 28px rgba(34, 234, 84, 0.5)';
              el.style.borderColor = 'rgb(34, 234, 84)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.transform = 'scale(1)';
              el.style.boxShadow = selectedCard === id
                ? '0 8px 20px rgba(34, 234, 84, 0.4)'
                : darkMode
                  ? '0 2px 6px rgba(0,0,0,0.6)'
                  : '0 2px 6px rgba(0,0,0,0.1)';
              el.style.borderColor = selectedCard === id
                ? 'rgb(34, 234, 84)'
                : darkMode
                  ? '#444'
                  : '#ddd';
            }}
          >
            <div
              style={{
                padding: '16px 12px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 18,
                color: darkMode ? '#d0f0c0' : '#1a1a1a',
                userSelect: 'none',
              }}
            >
              {title}
            </div>
            <img
              src={img}
              alt={title}
              style={{
                width: '100%',
                height: 180,
                objectFit: 'cover',
                display: 'block',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                transition: 'transform 0.3s ease',
              }}
            />
          </div>

        ))}
      </div>
    </div>
  );
};

export default ThemeSettings;
