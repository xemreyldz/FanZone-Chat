import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Box, TextField, List, ListItem, ListItemText, ListItemIcon, Button, Divider, } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import type { Group } from '../../types/Group';
import { fetchGroupMembers } from '../../api/authService';
import { leaveGroup } from '../../api/authService';
import ConfirmDialog from "../confirmdialog/ConfirmDialog"
import { useTheme } from '../theme/ThemeContext';
import StyledBadge from '../styledbadge/StyleBadge';



interface GroupDetailsProps {
    group: Group | null;
    messages?: any[]; // veya eğer belli bir tip varsa: Message[]
}
type Member = {
    id: number;
    name: string;
    isActive?: boolean;
    profileImage?: string;  // burada profil image olmalı
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ group, messages = [] }) => {
    const { darkMode } = useTheme();

    const [members, setMembers] = useState<Member[]>(group?.Members || []);
    const sharedImages = messages.filter(msg => msg.Image);
    const sharedImageNames = sharedImages.map(img => {
        const fullPath = img.Image;
        return fullPath.split('/').pop() || '';
    });

    const baseUrl = 'http://localhost:5000';

    const imageUrl = group?.GroupImageUrl ? baseUrl + group.GroupImageUrl : undefined;
    const [confirmOpen, setConfirmOpen] = useState(false);






    useEffect(() => {
        if (!group) return;

        fetchGroupMembers(group.GroupID)
            .then(fetchedMembers => {
                console.log('Fetched Members:', fetchedMembers); // burada profileImage tam olarak nasıl geliyor?
                setMembers(fetchedMembers);
            })
            .catch(() => setMembers([]));
    }, [group]);

    if (!group) {
        return <Typography sx={{ mt: 4 }}>Grup seçilmedi.</Typography>;
    }

    console.log(group);



    const {
        GroupName,
        Description = 'Açıklama bulunamadı.',
    } = group;

    const handleLeaveGroup = async () => {
        if (!group) return;

        setConfirmOpen(true); // Onay dialogunu aç
    };

    const handleConfirmLeave = async () => {
        if (!group) return;

        try {
            await leaveGroup(group.GroupID);
            window.location.reload(); // veya sayfa yenileme/navigate işlemi
        } catch (error) {
            console.error('Gruptan çıkarken hata oluştu:', error);
        } finally {
            setConfirmOpen(false);
        }
    };





    const handleSeeAllFiles = () => {
        console.log('Tümünü Gör Dosyalar clicked!');
    };

    const handleSeeAllMembers = () => {
        console.log('Tümünü Gör Üyeler clicked!');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 1,
                marginTop: "10px",
                maxHeight: 'calc(100vh - 64px)',
                overflowY: 'scroll',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            <Avatar
                src={imageUrl}
                sx={{ width: 100, height: 100, bgcolor: 'transparent', mb: 2 }}
            />

            <Typography sx={{ color: darkMode ? "white" : "black" }} variant="h5" gutterBottom>{GroupName}</Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, color: darkMode ? "gray" : "black" }}>
                {members.length} Üye
            </Typography>

            <TextField
                multiline
                rows={3}
                fullWidth
                variant="filled"
                value={Description}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                }}
                sx={{
                    mb: 2,
                    '& .MuiFilledInput-root': {
                        backgroundColor: darkMode ? "#333333" : "#f0f0f0", // Açık tema için düz hex kullan
                        color: darkMode ? "white" : "black",
                        borderRadius: 2,
                    },
                    '& .MuiFilledInput-input': {
                        color: darkMode ? "white" : "black", // Yazı rengi burada belirlenir
                    }
                }}
            />

            {sharedImages.length > 0 && (
                <Box sx={{ width: '100%', mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography sx={{ color: darkMode ? "white" : "black", }} variant="h6">Paylaşılan Görseller</Typography>
                        <Button onClick={() => console.log('Tümünü Gör Görseller')} sx={{ textTransform: 'none' }}>
                            Tümünü Gör
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', color: darkMode ? "white" : "black", flexDirection: 'column', gap: 0.5, mb: 2 }}>
                        {sharedImageNames.map((fileName, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <InsertDriveFileIcon style={{ fontSize: 40, color: darkMode ? "gray" : "gray", }} color="action" />
                                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                    {fileName}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}


            <Divider sx={{ width: '100%', mb: 1 }} />

            {/* Members */}
            <Box sx={{ width: '100%', mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ color: darkMode ? "white" : "black", }} variant="h6">Üyeler</Typography>
                    <Button onClick={handleSeeAllMembers} sx={{ textTransform: 'none' }}>
                        Tümünü Gör
                    </Button>
                </Box>
                {members.map(member => {
                    return (
                        <ListItem sx={{ color: darkMode ? "white" : "black", }} key={member.id} disableGutters>
                            <ListItemIcon>
                                {member.isActive ? (
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Avatar alt={member.name} src={baseUrl + member.profileImage} />
                                    </StyledBadge>
                                ) : (
                                    <Avatar alt={member.name} src={baseUrl + member.profileImage} />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={member.name} />
                        </ListItem>
                    );
                })}

            </Box>

            <Box
                sx={{
                    position: 'sticky',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: darkMode ? "#121212" : "#fff",
                    padding: 2,
                    zIndex: 1000,
                    borderTop: '1px solid #ccc'
                }}
            >
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<ExitToAppIcon />}
                    onClick={handleLeaveGroup}
                    fullWidth
                    sx={{
                        py: 1.5,
                        borderRadius: 5,
                        backgroundColor: darkMode ? "#5e0e0e" : "white",
                        border: "3px solid #5e0e0e",
                        color: darkMode ? "white" : "black"
                    }}
                >
                    Gruptan Çık
                </Button>
            </Box>


            <ConfirmDialog
                open={confirmOpen}
                title="Gruptan Çık"
                description={`${group?.GroupName} grubundan çıkmak istediğinize emin misiniz?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmLeave}
            />
        </Box>
    );
};


export default GroupDetails;