import React, { useEffect, useState } from "react";
import "./GroupList.css";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchLastMessagesForAllGroups } from '../../api/authService';
import { useTheme } from '../theme/ThemeContext';
import type { Group } from '../../types/Group';


type NewMessage = {
  groupId: number;
  message: string;
  username: string;
  // diğer opsiyonel alanlar
}

interface GroupListProps {
  newMessage?: NewMessage | null;
  onGroupSelect: (group: Group) => void;
}



const GroupList: React.FC<GroupListProps> = ({ onGroupSelect, newMessage }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchLastMessagesForAllGroups()
      .then(data => {
        setGroups(data);
        setFilteredGroups(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Gelen yeni mesaj geldiğinde grupları güncelle
  useEffect(() => {
    if (!newMessage) return;

    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.GroupID === newMessage.groupId
          ? { ...group, LastMessage: newMessage.message, Username: newMessage.username }
          : group
      )
    );

    setFilteredGroups(prevFiltered =>
      prevFiltered.map(group =>
        group.GroupID === newMessage.groupId
          ? { ...group, LastMessage: newMessage.message, Username: newMessage.username }
          : group
      )
    );
  }, [newMessage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter(group =>
        group.GroupName.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  };

  return (
    <div className={`grouplist-container ${darkMode ? "dark" : "light"}`}>
      <h3 className="grouplist-title">Gruplarım</h3>
      <div style={{ marginBottom: "12px" }}>
        <TextField
          placeholder="Gruplarda Ara"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          className="grouplist-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="grouplist-input-icon" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className="grouplist-scroll-area">
        {filteredGroups.length === 0 ? (
          searchTerm.trim() === "" ? (
            <p>Henüz kayıtlı bir grubunuz yok.</p>
          ) : (
            <p>“{searchTerm}” ile eşleşen grup bulunamadı.</p>
          )
        ) : (
          filteredGroups.map((group) => (
            <div
              key={group.GroupID}
              className="grouplist-item"
              onClick={() => onGroupSelect(group)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "30px",
              }}
            >
              {group.GroupImageUrl ? (
                <img
                  src={`http://localhost:5000${group.GroupImageUrl}`}
                  alt={group.GroupName}
                  style={{ width: 70, height: 70, borderRadius: "50%" }}
                />
              ) : (
                <div className="grouplist-groupImage" />
              )}
              <div>
                <div>{group.GroupName}</div>
                <div style={{ fontSize: "12px", color: darkMode ? "#ccc" : "#000" }}>
                  {group.Username ? (
                    <><strong>{group.Username}:</strong> {group.LastMessage || "Henüz mesaj yok"}</>
                  ) : (
                    group.LastMessage || "Henüz mesaj yok"
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupList;
