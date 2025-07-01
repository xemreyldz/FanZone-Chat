import React, { useState, useEffect } from 'react';
import {
    InputBase, IconButton, Paper, List, ListItem, ListItemText, CircularProgress,
    ListItemButton, ListItemAvatar, Avatar, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Select, MenuItem, FormControl, InputLabel,
    Typography,
    Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { searchUsers, fetchUserGroups, inviteUserToGroup } from '../../api/authService';
import MessageBox from "../messagebox/MessageBox"
import GroupIcon from '@mui/icons-material/Group';


const AnimatedSearchBar: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [userGroups, setUserGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | number>('');
    const [invitingUserId, setInvitingUserId] = useState<number | null>(null);
    const [sendingInvite, setSendingInvite] = useState(false);

    const { darkMode } = useTheme();
    const { user } = useAuth();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const handleToggle = () => setExpanded(prev => !prev);
    const handleClear = () => {
        setQuery('');
        setResults([]);
        setExpanded(false);
    };

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const users = await searchUsers(query);
                setResults(users);
            } catch (err) {
                console.error('Arama hatası:', err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [query]);

    const handleInviteClick = async (userId: number) => {
        setInvitingUserId(userId);
        setSelectedGroup('');
        setOpenModal(true);
        // Önceki mesajları temizle
        setMessage('');
        setError('');

        try {
            const groups = await fetchUserGroups();
            setUserGroups(groups);
        } catch (error: any) {
            console.error('Grup alma hatası:', error);
            setUserGroups([]);

            const errorMessage =
                error.response?.data?.message || '❌ Kullanıcının grup bilgileri alınamadı.';
            setError(errorMessage);
        }
    };

    const handleSendInvitation = async () => {
        if (!selectedGroup || !invitingUserId) return;

        // Önceki mesajları temizle
        setMessage('');
        setError('');
        setSendingInvite(true);

        try {
            await inviteUserToGroup(invitingUserId, Number(selectedGroup));
            setMessage("Davet başarıyla gönderildi.");
            setOpenModal(false);
        } catch (error: any) {
            console.error('Davet gönderme hatası:', error);
            setError(error.response?.data?.message || "Davet gönderilemedi.");
        } finally {
            setSendingInvite(false);
        }
    };

    const menuProps = {
        PaperProps: {
            sx: {
                bgcolor: darkMode ? '#333' : '#fff',    // Menü arkaplanı
                color: darkMode ? '#fff' : '#000',       // Menü yazı rengi
                '& .MuiMenuItem-root': {
                    '&:hover': {
                        backgroundColor: darkMode ? '#444' : '#eee',
                    },
                    '&.Mui-selected': {
                        backgroundColor: darkMode ? 'gray' : 'gray',
                        '&:hover': {
                            backgroundColor: darkMode ? '#276229' : '#1b5e20',
                        }
                    }
                }
            }
        }
    };

    return (
        <div className="search-container" style={{ position: 'relative' }}>
            <MessageBox message={message} error={error} />
            <Paper
                component="form"
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: expanded ? 300 : 40,
                    transition: 'width 0.7s ease',
                    overflow: 'hidden',
                    borderRadius: '30px',
                    backgroundColor: darkMode ? 'white' : 'black'
                }}
                onSubmit={(e) => e.preventDefault()}
            >
                <IconButton onClick={handleToggle} size="small">
                    <SearchIcon sx={{ color: darkMode ? 'black' : 'white' }} />
                </IconButton>
                {expanded && (
                    <>
                        <InputBase
                            sx={{ ml: 1, flex: 1, color: darkMode ? 'black' : 'white' }}
                            placeholder="Ara..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <IconButton size="small" onClick={handleClear}>
                            <CloseIcon sx={{ color: darkMode ? "black" : "white" }} />
                        </IconButton>
                    </>
                )}
            </Paper>

            {expanded && query && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    backgroundColor: darkMode ? '#fff' : '#222',
                    color: darkMode ? '#000' : '#fff',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    marginTop: '5px',
                    zIndex: 100,
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {loading ? (
                        <div style={{ padding: '10px', textAlign: 'center' }}>
                            <CircularProgress size={20} />
                        </div>
                    ) : (
                        <List dense>
                            {results.length > 0 ? (
                                results.map(u => (
                                    <ListItem key={u.UserID} disablePadding>
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar alt={u.Username} src={`${baseUrl}${u.ProfileImage}`} />
                                            </ListItemAvatar>
                                            <ListItemText primary={u.Username} />
                                            <Button
                                                sx={{ backgroundColor: "transparent", border: "none", color: darkMode ? "black" : "white", fontSize: "8px" }}
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleInviteClick(u.UserID)}
                                            >
                                                Davet Et
                                            </Button>
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="Sonuç bulunamadı." />
                                </ListItem>
                            )}
                        </List>
                    )}
                </div>
            )}

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                        color: darkMode ? '#fff' : '#000',
                        borderRadius: 3,
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon sx={{ fontSize: 40 }} />
                    Grup Seç ve Davet Gönder
                </DialogTitle>

                {invitingUserId && (
                    <Typography
                        variant="body1"
                        sx={{ ml: 3, fontWeight: 500, color: darkMode ? '#ddd' : '#333' }}
                    >
                        <strong>{results.find(u => u.UserID === invitingUserId)?.Username || ''}</strong> adlı kullanıcıyı davet etmek istediğin grubu seç.
                    </Typography>
                )}

                <DialogContent>
                    {userGroups.length === 0 ? (
                        <Typography sx={{ color: darkMode ? '#aaa' : '#444' }}>
                            Grup bulunamadı veya yükleniyor...
                        </Typography>
                    ) : (
                        <FormControl fullWidth>
                            <Select
                                MenuProps={menuProps}
                                displayEmpty
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em style={{ color: darkMode ? '#aaa' : '#666' }}>Bir grup seçin</em>;
                                    }
                                    const group = userGroups.find(g => g.GroupID === selected);
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar
                                                src={group?.GroupImageUrl ? `${baseUrl}${group.GroupImageUrl}` : '/default-group.png'}
                                                alt={group?.GroupName}
                                                sx={{ width: 70, height: 70 }}
                                            />
                                            <Typography sx={{ color:"white" }}>
                                                {group?.GroupName}
                                            </Typography>
                                        </Box>
                                    );
                                }}
                                sx={{
                                    height: 80,
                                    bgcolor: selectedGroup ? (darkMode ? '#2e7d32' : 'green') : (darkMode ? '#333' : '#f5f5f5'),
                                    color: darkMode ? '#fff' : '#000',
                                    borderRadius: 3,
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        paddingY: 1,
                                        height: 70,
                                        color:"white"
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: darkMode ? '#555' : '#ccc',
                                    }
                                }}
                            >
                                <MenuItem disabled value="">
                                    Bir grup seçin
                                </MenuItem>
                                {userGroups.map((group) => (
                                    <MenuItem

                                        key={group.GroupID}
                                        value={group.GroupID}
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                    >
                                        <Avatar
                                            src={group.GroupImageUrl ? `${baseUrl}${group.GroupImageUrl}` : '/default-group.png'}
                                            alt={group.GroupName}
                                            sx={{ width: 30, height: 30 }}
                                        />
                                        <Typography>{group.GroupName}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} sx={{ color: darkMode ? '#bbb' : undefined }}>
                        İptal
                    </Button>
                    <Button
                        onClick={handleSendInvitation}
                        disabled={!selectedGroup || sendingInvite}
                        variant="contained"
                        sx={{ backgroundColor: darkMode ? '#2e7d32' : 'green' }}
                    >
                        {sendingInvite ? 'Gönderiliyor...' : 'Davet Gönder'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AnimatedSearchBar;
