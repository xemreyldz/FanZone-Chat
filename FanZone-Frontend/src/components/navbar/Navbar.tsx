import React from 'react';
import "./Navbar.css";
import { Avatar } from '@mui/material';
import "../../font/Font.css";
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../components/theme/ThemeContext';
import CustomizedSwitches from '../switch/CustomizedSwitches';

interface NavbarProps {
    showText?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showText = true }) => {
    const defaultProfileImage = '/profileImage/avatar/default.png';
    const { darkMode } = useTheme();
    const { user } = useAuth();  // sadece user al

    const baseUrl = 'http://localhost:5000';

    const username = user?.username ?? "Kullanıcı";
    const profileImage = user?.profileImage
        ? `${baseUrl}${user.profileImage}`
        : defaultProfileImage;

    return (
        <div className={darkMode ? 'dark-mode' : 'light-mode'}>
            <div className='navbar-container'>
                {showText && (
                    <div className='navbar-text'>
                        <div>
                            <p className='inter'>Merhaba, {username}</p>
                        </div>
                        <div>
                            <h4 className='inter '>Favori takımının grupları burada seni bekliyor!</h4>
                        </div>
                    </div>
                )}
                <div className='navbar-avatar'>
                    <div>
                        <CustomizedSwitches />
                    </div>
                    <div>
                        <Avatar
                            alt={username}
                            src={profileImage}
                            sx={{ width: 80, height: 80, '&:hover': { cursor: "pointer" } }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
