import React, { useEffect, useState } from 'react'
import SidebarLayout from '../../layout/sidebarLayout/SidebarLayout'
import GroupList from '../../components/grouplist/GroupList'
import ChatPanel from "../../components/chatpanel/ChatPanel"
import EmptyChatMessage from '../../components/emptychatmessage/EmptyChatMessage';
import GroupDetails from '../../components/groupdetails/GroupDetails';
import { Fade } from '@mui/material';
import type { Group } from '../../types/Group'; // ✅ süslü parantezle
import socket from '../../socket/Socket';
import { fetchGroupMembers, fetchMessagesByGroupId, fetchUserGroups } from "../../api/authService";
import { useLocation } from 'react-router-dom';

interface NewMessage {
  groupId: number;
  message: string;
  username: string;
}



const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newMessage, setNewMessage] = useState<NewMessage | null>(null);
  const location = useLocation();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<any[]>([]);



  useEffect(() => {
    const fetchGroupsAndSelectFromUrl = async () => {
      try {
        const groups = await fetchUserGroups();
        setUserGroups(groups);

        const params = new URLSearchParams(location.search);
        const groupIdParam = params.get("groupId");

        if (groupIdParam) {
          const groupId = parseInt(groupIdParam, 10);
          const matchedGroup = groups.find(g => g.GroupID === groupId);
          if (matchedGroup) {
            setSelectedGroup(matchedGroup);
          }
        }
      } catch (error) {
        console.error("Grup bilgileri alınamadı:", error);
      }
    };

    fetchGroupsAndSelectFromUrl();
  }, [location.search]);


  useEffect(() => {
    if (!selectedGroup) {
      setMembers([]);
      setMessages([]);
      return;
    }

    const fetchData = async () => {
      try {
        const [fetchedMembers, fetchedMessages] = await Promise.all([
          fetchGroupMembers(selectedGroup.GroupID),
          fetchMessagesByGroupId(selectedGroup.GroupID)
        ]);

        setMembers(fetchedMembers);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Veriler alınırken hata oluştu", error);
        setMembers([]);
        setMessages([]);
      }
    };

    fetchData();
  }, [selectedGroup]);




  useEffect(() => {
    socket.on("receiveMessage", (messageData: NewMessage) => {
      console.log("Socket'ten gelen mesaj:", messageData);
      setNewMessage({
        groupId: messageData.groupId,
        message: messageData.message,
        username: messageData.username || ''
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Bu ikinci useEffect — grup seçilince emit
  useEffect(() => {
    if (selectedGroup) {
      socket.emit("joinGroup", selectedGroup.GroupID);
    }
  }, [selectedGroup]);



  const handleToggleGroupDetails = () => {
    setShowGroupDetails(prev => {
      if (!prev) setSidebarOpen(false); // detay açılırken sidebar kapanır
      return !prev;
    });
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => {
      if (!prev) setShowGroupDetails(false); // sidebar açılırken detay kapanır
      return !prev;
    });
  };


  return (
    <SidebarLayout sidebarOpen={sidebarOpen} toggleSidebar={handleToggleSidebar}>
      <div style={{ display: "flex" }}>
        <div>
          <GroupList onGroupSelect={setSelectedGroup} newMessage={newMessage} />
        </div>

        <div style={{ width: "100%" }}>
          {selectedGroup ? (
            <ChatPanel members={members} group={selectedGroup} onShowDetails={handleToggleGroupDetails} />
          ) : (
            <EmptyChatMessage />
          )}
        </div>

        <Fade in={showGroupDetails} timeout={500} unmountOnExit>
          <div style={{ width: '60%' }}>
            <GroupDetails group={selectedGroup} messages={messages} />
          </div>
        </Fade>
      </div>
    </SidebarLayout>
  )
}

export default Groups