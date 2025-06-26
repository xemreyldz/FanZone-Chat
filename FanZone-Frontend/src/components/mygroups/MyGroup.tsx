import React from 'react';
import "./MyGroup.css";
import { useTheme } from '../../components/theme/ThemeContext';
import { useNavigate } from 'react-router-dom'; // Ekle
import { leaveGroup } from "../../api/authService"
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { adjustColorBrightness } from '../../utils/colorUtils';

interface MyGroupProps {
    onLeave: (groupId: number) => void; // Parent'den callback
    group: {
        GroupID: number;
        GroupName: string;
        Description: string;
        GroupImageUrl?: string;
    };
}

const MyGroup: React.FC<MyGroupProps> = ({ group, onLeave }) => {
    const { darkMode, teamColors, isTeamTheme } = useTheme(); // ✅ isTeamTheme eklendi
    const navigate = useNavigate(); // Hook'u çağır
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const handleGoToChat = () => {
        navigate(`/groups?groupId=${group.GroupID}`);
    };

    const handleLeaveGroupConfirmed = async () => {
        try {
            await leaveGroup(group.GroupID);;
            onLeave(group.GroupID);
        } catch (error) {
            alert("Grup ayrılma işlemi başarısız oldu.");
        } finally {
            setConfirmOpen(false);
        }
    };
    const cardStyle = isTeamTheme
        ? darkMode
            ? {
                // ✅ Eğer hem takım teması aktifse hem de dark mode açıksa:
                backgroundColor: adjustColorBrightness(teamColors.primary, -25), // renk koyulaştırılır
                color: teamColors.secondary,
            }
            : {
                // ✅ Sadece takım teması aktifse, dark mode kapalıysa:
                backgroundColor: teamColors.primary,
                color: teamColors.secondary,
            }
        : darkMode
            ? {
                // ✅ Takım teması kapalı, ama dark mode açık ise:
                backgroundColor: '#2e2c16',
                color: '#ffffff',
            }
            : {
                // ✅ Hem takım teması kapalı, hem dark mode kapalıysa:
                backgroundColor: 'black',
                color: '#000000',
            };


    const btnStyle = isTeamTheme
        ? {
            backgroundColor: adjustColorBrightness(teamColors.primary, 25), // biraz açalım
            color: "white",
        }
        : darkMode
            ? { backgroundColor: '#3f3d1f', color: 'white' }
            : { backgroundColor: '#464646', color: 'white' };


    return (
        <div className={`mygroup-wrapper ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <ConfirmDialog
                open={confirmOpen}


                title="Grup Ayrılma Onayı"
                description="Bu gruptan ayrılmak istediğinize emin misiniz?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleLeaveGroupConfirmed}
            />
            <div className="card mygroup-card" style={cardStyle}>
                <div className="card-body">
                    <div className='card-title'>
                        <img
                            title='logo'
                            src={`http://localhost:5000${group.GroupImageUrl}`}
                            alt={group.GroupName}
                            height={50}
                            width={50}
                        />
                        <h5 className="card-team-name">{group.GroupName}</h5>
                    </div>
                    <p className="card-text">{group.Description}</p>
                    <div className='card-buttons' >
                        <button style={btnStyle} className="btn-card-login" onClick={handleGoToChat}>Sohbete Git</button>
                        <button style={btnStyle} className="btn-card-logout" onClick={() => setConfirmOpen(true)}>Ayrıl</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyGroup;
