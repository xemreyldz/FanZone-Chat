import React, { useState } from 'react'

import "./NewGroups.css"
import { useTheme } from '../../components/theme/ThemeContext';
import type { Group } from "../../types/Group"
import { joinGroup } from '../../api/authService'
import MessageBox from '../../components/messagebox/MessageBox';
import { adjustColorBrightness } from '../../utils/colorUtils';

interface NewGroupCardProps {
    group: Group;
}

const NewGroups: React.FC<NewGroupCardProps> = ({ group }) => {
    const { darkMode, teamColors, isTeamTheme } = useTheme(); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined)

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const imageUrl = group.GroupImageUrl?.startsWith("http")
        ? group.GroupImageUrl
        : `${baseUrl}${group.GroupImageUrl}`;

    const handleJoinGroup = async () => {
        setLoading(true);
        setMessage(undefined);
        setError(undefined);

        try {
            await joinGroup(group.GroupID);
            setMessage("Gruba başarıyla katıldınız!");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Katılırken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    }

    const newGroupStyle = isTeamTheme
        ? darkMode
            ? {
                // ✅ Eğer hem takım teması aktifse hem de dark mode açıksa:
               backgroundColor: adjustColorBrightness(teamColors.secondary, -25), // renk koyulaştırılır
                color: teamColors.secondary,
            }
            : {
                // ✅ Sadece takım teması aktifse, dark mode kapalıysa:
                backgroundColor: teamColors.secondary,
                color: teamColors.secondary,
            }
        : darkMode
            ? {
                // ✅ Takım teması kapalı, ama dark mode açık ise:
                backgroundColor: '#151516',
                color: '#ffffff',
            }
            : {
                // ✅ Hem takım teması kapalı, hem dark mode kapalıysa:
                backgroundColor: '#FAED38',
                color: '#000000',
            };







             const btnLoginStyle = isTeamTheme
        ? darkMode
            ? {
                // ✅ Eğer hem takım teması aktifse hem de dark mode açıksa:
               backgroundColor: adjustColorBrightness(teamColors.secondary, -12), // renk koyulaştırılır
                color: "white",
            }
            : {
                // ✅ Sadece takım teması aktifse, dark mode kapalıysa:
                  backgroundColor: adjustColorBrightness(teamColors.secondary, -30),
                color: "black",
            }
        : darkMode
            ? {
                // ✅ Takım teması kapalı, ama dark mode açık ise:
                backgroundColor: '#1C1B1B',
                color: '#ffffff',
            }
            : {
                // ✅ Hem takım teması kapalı, hem dark mode kapalıysa:
                backgroundColor: '#D7CC29',
                color: '#000000',
            };






    return (
        <div className={`newgroups-wrapper ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            {/* Mesaj kutusu */}
            <MessageBox message={message} error={error} duration={4000} redirectTo="/groups" />
            <div className="card newgroups-card" style={{ width: "18rem" ,...newGroupStyle  }}>
                <div className="card-body newgroups-card-body">
                    <div className='newgroups-card-title'>
                        <img
                            title='logo'
                            src={imageUrl}
                            height={50}
                            width={50}
                            alt={`${group.GroupName} logo`}
                        />
                        <h5 className="card-team-name">{group.GroupName}</h5>
                    </div>
                    <p className="newgroups-card-text">{group.Description}</p>
                    <div className='newgroups-card-buttons'>
                        <button style={btnLoginStyle}
                            className="btn-card-login"
                            onClick={handleJoinGroup}
                            disabled={loading}
                        >
                            {loading ? "Katılıyor..." : "Gruba Katıl"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewGroups;
