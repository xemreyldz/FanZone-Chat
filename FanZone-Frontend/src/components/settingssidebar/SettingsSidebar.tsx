import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PaletteIcon from '@mui/icons-material/Palette';
import { useTheme } from '../../components/theme/ThemeContext';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsSidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const { darkMode } = useTheme();

  const sidebarStyle = {
    width: '300px',
    borderRight: darkMode ? '4px solid #444' : '4px solid #000',
    padding: '1rem',
    backgroundColor: darkMode ? 'black' : '#fff',
    color: darkMode ? '#eee' : '#111',
    height: '100vh',
  };

  const itemStyle = (tab: string) => ({
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? (darkMode ? '#333' : '#ddd') : 'transparent',
    color: activeTab === tab ? (darkMode ? '#fff' : '#000') : (darkMode ? '#ccc' : '#333'),
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    borderRadius: 4,
    transition: 'background-color 0.3s, color 0.3s',
  });

  return (
    <div style={sidebarStyle}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li onClick={() => setActiveTab('account')} style={itemStyle('account')}>
          <PersonIcon />
          Hesap Ayarları
        </li>
        <li onClick={() => setActiveTab('privacy')} style={itemStyle('privacy')}>
          <LockIcon />
          Gizlilik ve Güvenlik
        </li>
        <li onClick={() => setActiveTab('theme')} style={itemStyle('theme')}>
          <PaletteIcon />
          Uygulama Teması
        </li>
      </ul>
    </div>
  );
};

export default SettingsSidebar;
