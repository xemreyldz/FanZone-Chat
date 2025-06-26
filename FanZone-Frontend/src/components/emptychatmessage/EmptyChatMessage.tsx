import React from 'react';
import { useTheme } from '../theme/ThemeContext';
const EmptyChatMessage: React.FC = () => {
   const { darkMode } = useTheme();
  return (
    <div style={{
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.2rem',
      color: darkMode ? "lightgray":"black",
      fontWeight: '500',
      backgroundColor: darkMode ? '#2c2c2c':"#f0f0f0",
      borderRadius: '12px',
      margin: '10px',
      padding: '30px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center',
    }}>
      <p>Mesaj yazmak icin lütfen bir grup seciniz.</p>
    </div>
  );
};

export default EmptyChatMessage;
