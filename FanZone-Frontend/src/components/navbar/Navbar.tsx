import React, { useEffect, useRef, useState } from 'react';
import "./Navbar.css";
import { Avatar, Badge, IconButton } from '@mui/material';
import "../../font/Font.css";
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../components/theme/ThemeContext';
import CustomizedSwitches from '../switch/CustomizedSwitches';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnimatedSearchBar from '../animetedsearchbar/AnimetedSearchBar';
import Notifications from '../notifications/Notifications';
import { getNotifications, acceptInvitation, ignoreNotification } from '../../api/authService'; // accept ve ignore fonksiyonları ekliyoruz
import MessageBox from '../messagebox/MessageBox';

interface NotificationType {
    NotificationID: number;
    UserID: number;
    Type: string;
    Message: string;
    RelatedGroupID: number;
    SenderUserID: number;
    IsRead: boolean;
    CreatedAt: string;
    GroupName: string;
}

interface NavbarProps {
    showText?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showText = true }) => {
    const defaultProfileImage = '/profileImage/avatar/default.png';
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const baseUrl = 'http://localhost:5000';

    // Mesaj ve hata için ayrı state'ler
    const [acceptMessage, setAcceptMessage] = useState<string | null>(null);
    const [rejectMessage, setRejectMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [generalMessage, setGeneralMessage] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);

    const username = user?.username ?? "Kullanıcı";
    const profileImage = user?.profileImage
        ? `${baseUrl}${user.profileImage}`
        : defaultProfileImage;

    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const data = await getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Bildirimler alınamadı', error);
            }
        }
        fetchNotifications();
    }, []);

    // Bildirim kutusunun dışına tıklanırsa kapat
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                showNotifications &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
            }
        }

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    const unreadCount = notifications.filter(n => !n.IsRead).length;

    const handleToggleNotifications = () => {
        setShowNotifications(prev => !prev);
    };

    // Kabul Et işlemi - Bildirim listesini güncelle
    const handleAccept = async (notif: NotificationType) => {
        try {
            await acceptInvitation(notif.RelatedGroupID, notif.NotificationID);
            setNotifications(prev => prev.filter(n => n.NotificationID !== notif.NotificationID));
            setAcceptMessage("Davet başarıyla kabul edildi!");
            setRejectMessage(null);
            setErrorMessage(null);
            setGeneralMessage(null);
            setGeneralError(null);
        } catch (error) {
            console.error('Kabul etme hatası:', error);
            setErrorMessage("Davet kabul edilemedi.");
            setAcceptMessage(null);
            setRejectMessage(null);
            setGeneralMessage(null);
            setGeneralError(null);
        }
    };

    // Yoksay işlemi - Bildirim listesini güncelle
    const handleIgnore = async (notif: NotificationType) => {
        try {
            await ignoreNotification(notif.NotificationID, notif.RelatedGroupID);
            setNotifications(prev => prev.filter(n => n.NotificationID !== notif.NotificationID));
            setRejectMessage("Davet reddedildi.");
            setAcceptMessage(null);
            setErrorMessage(null);
            setGeneralMessage(null);
            setGeneralError(null);
        } catch (error) {
            console.error('Yoksayma hatası:', error);
            setErrorMessage("Davet reddedilemedi.");
            setRejectMessage(null);
            setAcceptMessage(null);
            setGeneralMessage(null);
            setGeneralError(null);
        }
    };

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
                        <AnimatedSearchBar />
                    </div>

                    <div className='navabar-notification' style={{ position: 'relative' }}>
                        <IconButton onClick={handleToggleNotifications} color="inherit">
                            <Badge badgeContent={unreadCount} color="error">
                                <NotificationsIcon fontSize="large" />
                            </Badge>
                        </IconButton>
                        {showNotifications && (
                            <div
                                ref={notificationRef}
                                style={{
                                    position: 'absolute',
                                    top: '50px',
                                    right: 0,
                                    backgroundColor: darkMode ? '#222' : '#fff',
                                    color: darkMode ? '#fff' : '#000',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                    width: '320px',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    zIndex: 1500,
                                }}
                            >
                                <Notifications
                                    notifications={notifications}
                                    onAccept={handleAccept}
                                    onIgnore={handleIgnore}
                                    onAcceptSuccess={(msg) => {
                                        setAcceptMessage(msg);
                                        setRejectMessage(null);
                                        setErrorMessage(null);
                                        setGeneralMessage(null);
                                        setGeneralError(null);
                                    }}
                                    onAcceptError={(errMsg) => {
                                        setErrorMessage(errMsg);
                                        setAcceptMessage(null);
                                        setRejectMessage(null);
                                        setGeneralMessage(null);
                                        setGeneralError(null);
                                    }}
                                    onRejectSuccess={(msg) => {
                                        setRejectMessage(msg);
                                        setAcceptMessage(null);
                                        setErrorMessage(null);
                                        setGeneralMessage(null);
                                        setGeneralError(null);
                                    }}
                                    onRejectError={(errMsg) => {
                                        setErrorMessage(errMsg);
                                        setRejectMessage(null);
                                        setAcceptMessage(null);
                                        setGeneralMessage(null);
                                        setGeneralError(null);
                                    }}
                                    onGeneralMessage={(msg) => {
                                        setGeneralMessage(msg);
                                        setAcceptMessage(null);
                                        setRejectMessage(null);
                                        setErrorMessage(null);
                                        setGeneralError(null);
                                    }}
                                    onGeneralError={(errMsg) => {
                                        setGeneralError(errMsg);
                                        setAcceptMessage(null);
                                        setRejectMessage(null);
                                        setErrorMessage(null);
                                        setGeneralMessage(null);
                                    }}
                                />
                            </div>
                        )}
                    </div>

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

            {/* Mesaj kutusu */}
            <MessageBox
                message={acceptMessage ?? rejectMessage ?? generalMessage ?? undefined}
                error={errorMessage ?? generalError ?? undefined}
                duration={3000}
                redirectTo={acceptMessage ? '/groups' : undefined}
            />

        </div>
    );
};

export default Navbar;
