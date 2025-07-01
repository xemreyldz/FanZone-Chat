import React from 'react';
import { Avatar, Button, Divider } from '@mui/material';

interface Notification {
    NotificationID: number;
    UserID: number;
    Type: string;
    Message: string;
    RelatedGroupID: number;
    SenderUserID: number;
    SenderUsername?: string;
    SenderProfileImage?: string;
    IsRead: boolean;
    CreatedAt: string;
    GroupName: string;
}

interface NotificationsProps {
    notifications: Notification[];
    onAccept: (notif: Notification) => void;
    onIgnore: (notif: Notification) => void;
    onAcceptSuccess: (msg: string) => void;
    onAcceptError: (errMsg: string) => void;
    onRejectSuccess?: (msg: string) => void;
    onRejectError?: (errMsg: string) => void;
    onGeneralMessage: (msg: string) => void;
    onGeneralError: (errMsg: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
    notifications,
    onAccept,
    onIgnore,
}) => {
    const baseUrl = 'http://localhost:5000';

    if (notifications.length === 0) {
        return (
            <div
                style={{
                    padding: 16,
                    textAlign: 'center',
                    fontStyle: 'italic',
                }}
            >
                Şu anda yeni bildiriminiz yok.
            </div>
        );
    }

    return (
        <div style={{ maxHeight: 300, overflowY: 'auto', padding: 8 }}>
            <h3>Bildirimler</h3>
            <Divider />
            {notifications.map(n => (
                <div
                    key={n.NotificationID}
                    style={{ display: 'flex', flexDirection: 'column', padding: 10, borderBottom: '1px solid #ccc' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar
                            alt={n.SenderUsername || "Profil"}
                            src={n.SenderProfileImage ? `${baseUrl}${n.SenderProfileImage}` : '/default-avatar.png'}
                            sx={{ width: 50, height: 50 }}
                        />
                        <p style={{ margin: 0, fontWeight: '500' }}>
                            <strong>{n.SenderUsername || "Bir kullanıcı"}</strong> seni <strong>{n.GroupName || "bir grup"}</strong> grubuna davet etti.
                        </p>
                    </div>

                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color='success'
                            size="small"
                            onClick={() => onAccept(n)}
                            style={{ marginRight: 8 }}
                        >
                            Kabul Et
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => onIgnore(n)}
                        >
                            Yoksay
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Notifications;
