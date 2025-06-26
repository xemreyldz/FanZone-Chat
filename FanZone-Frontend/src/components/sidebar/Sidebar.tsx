// src/components/Sidebar.tsx
import "../../App.css"
import React, { useState } from 'react';
import {
  Drawer, Box, IconButton, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import "./Sidebar.css"
import LightLogo from "../../assets/favicon/64x64/64x64 siyah.png"
import DarkLogo from "../../assets/favicon/64x64/64x64 sarı.png"
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import AddGroup from '../addgroups/AddGroup'; // doğru yola göre güncelle
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../../api/authService";
import { adjustColorBrightness } from "../../utils/colorUtils";


interface SidebarProps {
  open: boolean;
  toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
  const { darkMode, teamColors, isTeamTheme } = useTheme(); // ✅ isTeamTheme eklendi
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;

      if (payload?.userId) {
        await logoutUser(payload.userId);
      }

      localStorage.removeItem('userToken');
      navigate('/login');
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

 const sidebarStyle = isTeamTheme
  ? darkMode
    ? {
        // ✅ Eğer hem takım teması aktifse hem de dark mode açıksa:
        // - Yazı rengi, takımın belirlediği secondary renge göre ayarlanır
        backgroundColor:"#1C1B1B", // renk koyulaştırılır
        color: teamColors.secondary,
      }
    : {
        // ✅ Sadece takım teması aktifse, dark mode kapalıysa:
        // - Takımın orijinal renkleri olduğu gibi uygulanır
        backgroundColor: teamColors.secondary,
        color: teamColors.secondary,
      }
  : darkMode
  ? {
      // ✅ Takım teması kapalı, ama dark mode açık ise:
      // - Klasik koyu tema: siyah zemin ve beyaz yazı
      backgroundColor: '#1C1B1B',
      color: '#ffffff',
    }
  : {
      // ✅ Hem takım teması kapalı, hem dark mode kapalıysa:
      // - Klasik açık tema: açık gri zemin ve siyah yazı
      backgroundColor: '#FAED38',
      color: '#000000',
    };










  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        style: {
          ...sidebarStyle,  // ✅ MyGroup tarzı uygulama
        }
      }}
      className={`homePage-sidebar ${open ? 'open' : 'collapsed'}`}
    >
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%"
        sx={{
          ...sidebarStyle,
          transition: 'all 0.3s ease',
        }}
      >
        <Box>
          {/* LOGO + MENU TOGGLE */}
          <Box display="flex" justifyContent="start" alignItems="flex-start" flexDirection="column" mt={2} ml={1} sx={{
            color: darkMode ? 'white' : 'black',
            transition: 'color 0.3s ease',
          }}>
            <Box>
              <img title='logo' src={darkMode ? DarkLogo : LightLogo} height={50} width={50} />
            </Box>
            <Box display="flex" justifyContent="flex-start">
              <IconButton onClick={toggleDrawer} sx={{ color: darkMode ? 'white' : 'black' }}>
                <MenuIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Box>
          </Box>


          {/* MENU LIST */}
          <List>
            <ListItem component={Link} to="/homepage" sx={{ color: darkMode ? 'white' : 'black' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <HomeIcon sx={{ fontSize: 40, color: darkMode ? 'white' : 'black' }} />
              </ListItemIcon>
              {open && <ListItemText primary="Anasayfa" primaryTypographyProps={{
                fontSize: '18px',
                fontFamily: "inter",
                fontWeight: 'bold',
                color: darkMode ? 'white' : 'black',
              }} />}
            </ListItem>

            <ListItem component={Link} to="/groups" sx={{ color: darkMode ? 'white' : 'black' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <GroupIcon sx={{ fontSize: 40, color: darkMode ? 'white' : 'black' }} />
              </ListItemIcon>
              {open && <ListItemText primary="Gruplar" primaryTypographyProps={{
                fontSize: '18px',
                fontFamily: "inter",
                fontWeight: 'bold',
                color: darkMode ? 'white' : 'black',
              }} />}
            </ListItem>



            <ListItem
              component="div"
              onClick={() => setOpenModal(true)}
              sx={{ color: darkMode ? 'white' : 'black', cursor: 'pointer', width: 175 }}
            >
              <ListItemIcon sx={{ color: darkMode ? 'white' : 'black' }}>
                <AddCircleIcon sx={{ fontSize: 40, color: darkMode ? 'white' : 'black' }} />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Grup Ekle"
                  primaryTypographyProps={{
                    fontSize: '18px',
                    fontFamily: "inter",
                    fontWeight: 'bold',
                    color: darkMode ? 'white' : 'black',
                  }}
                />
              )}
            </ListItem>

            {/* Modal */}
            <AddGroup open={openModal} onClose={() => setOpenModal(false)} />

            <ListItem component={Link} to="/settings" sx={{ color: darkMode ? 'white' : 'black' }}>
              <ListItemIcon sx={{ color: darkMode ? 'white' : 'black' }}>
                <SettingsIcon sx={{ fontSize: 40, color: darkMode ? 'white' : 'black' }} />
              </ListItemIcon>
              {open && <ListItemText primary="Ayarlar" primaryTypographyProps={{
                fontSize: '18px',
                fontFamily: "inter",
                fontWeight: 'bold',
                color: darkMode ? 'white' : 'black',
              }} />}
            </ListItem>
          </List>
        </Box>


        <Box display="flex" justifyContent="start" mb={2}>
          <ListItem
            component="div"
            onClick={handleLogout}
            sx={{
              color: darkMode ? 'white' : 'black',
              cursor: 'pointer',
              width: 175,
              height: 50,
            }}
          >
            <ListItemIcon sx={{ color: darkMode ? 'white' : 'black' }}>
              <LogoutIcon sx={{ fontSize: 40, color: darkMode ? 'white' : 'black' }} />
            </ListItemIcon>

            {/* Text her zaman DOM'da ama genişliği ve görünürlüğü animasyonla kontrol ediliyor */}
            <Box
              sx={{
                overflow: 'hidden',
                transition: 'width 0.3s ease',
                width: open ? '100px' : '0px',
              }}
            >
              <ListItemText
                primary="Çıkış Yap"
                primaryTypographyProps={{
                  fontSize: '18px',
                  fontFamily: 'inter',
                  fontWeight: 'bold',
                  sx: {
                    whiteSpace: 'nowrap',
                    opacity: open ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    color: darkMode ? 'white' : 'black',
                  },
                }}
              />
            </Box>
          </ListItem>
        </Box>


      </Box>
    </Drawer>
  );
};

export default Sidebar;
