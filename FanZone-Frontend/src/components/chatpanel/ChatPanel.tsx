import { Box, Typography, Avatar, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import "./ChatPanel.css"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useState, useRef } from 'react';
import socket from '../../socket/Socket';
import { jwtDecode } from 'jwt-decode';
import { fetchMessagesByGroupId, uploadImage } from '../../api/authService';
import { formatDateForChat } from '../../utils/date';
import { useTheme } from '../theme/ThemeContext';
import { adjustColorBrightness } from '../../utils/colorUtils';

type Message = {
  sentAt: string;
  [key: string]: any;
};

type GroupedMessages = {
  [dateLabel: string]: Message[];
};



interface ChatPanelProps {
  group: Group | null;
  onShowDetails: () => void;
  members: Member[];
}




const ChatPanel: React.FC<ChatPanelProps> = ({ group, onShowDetails, members }) => {
  const [messagesByGroup, setMessagesByGroup] = useState<{ [groupId: number]: any[] }>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tokenUsername, setTokenUsername] = useState<string | null>(null);
  const [tokenProfileImage, setTokenProfileImage] = useState<string | null>(null);
  const [userIdNum, setUserIdNum] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { darkMode, teamColors, isTeamTheme } = useTheme(); // ✅ isTeamTheme eklendi
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const safeMembers = members ?? [];
  const activeCount = safeMembers.filter(m => m.isActive).length;
  console.log('Members:', members);


  const baseUrl = import.meta.env.VITE_BASE_URL || "";
  const fullGroupImageUrl = group.GroupImageUrl.startsWith('http')
    ? group.GroupImageUrl
    : baseUrl + group.GroupImageUrl;


  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('Decoded token:', decoded);

        setTokenUsername(decoded.username || decoded.userName || null);
        setTokenProfileImage(decoded.profileImage || null);
        setUserIdNum(decoded.userId || decoded.id || null);
      } catch (e) {
        console.error('Token decode edilemedi', e);
      }
    }
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('Decoded token:', decoded)
        setTokenUsername(decoded.username || decoded.userName || null);
        setTokenProfileImage(decoded.profileImage || null); // Token'da varsa
      } catch (e) {
        console.error(e);
      }
    }
  }, []);




  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  useEffect(() => {
    if (group) {
      socket.emit("joinGroup", group.GroupID);
    }
  }, [group]);


  useEffect(() => {
    if (!group) return;
    if (!userIdNum) return;

    fetchMessagesByGroupId(group.GroupID)
      .then(data => {
        console.log("Mesajlar API'den:", data);
        const formattedMessages = data.map(msg => ({
          sender: msg.UserID === userIdNum ? "me" : "other",
          senderName: msg.Username,
          message: msg.MessageText,
          sentAt: msg.SentAt,
          messageId: msg.MessageID,
          firstName: msg.FirstName,       // backend’den gelen alanı buraya ekle
          lastName: msg.LastName,         // backend’den gelen alanı buraya ekle
          profileImage: msg.ProfileImage,
          image: msg.Image ? (msg.Image.startsWith('http') ? msg.Image : `${baseUrl}${msg.Image}`) : null,



        }));

        setMessagesByGroup(prev => ({
          ...prev,
          [group.GroupID]: formattedMessages,
        }));
      })
      .catch(err => {
        console.error('Mesajlar çekilemedi:', err);
      });
  }, [group, userIdNum]);

  useEffect(() => {
    console.log("Socket bağlantı durumu:", socket.connected);
  }, [socket]);


  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (data) => {
      console.log("Yeni mesaj alındı:", data);
      const groupIdNum = Number(data.groupId);

      setMessagesByGroup(prev => {
        const groupMessages = prev[groupIdNum] || [];
        return {
          ...prev,
          [groupIdNum]: [
            ...groupMessages,
            {
              sender: data.userId === userIdNum ? "me" : "other",
              senderName: data.username,
              message: data.message,
              sentAt: data.sentAt,
              image: data.image,
              profileImage: data.profileImage,
            },
          ],
        };
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, userIdNum]);



  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    if (!group) return;

    let fullImageUrl: string | null = null;

    if (selectedFile) {
      try {
        const { filePath } = await uploadImage(selectedFile);
        fullImageUrl = filePath.startsWith('http') ? filePath : `${baseUrl}${filePath}`;
      } catch (err) {
        console.error("Resim yüklenirken hata oluştu:", err);
        return;
      }
    }

    socket.emit("sendMessage", {
      userId: userIdNum,
      groupId: group.GroupID,
      username: tokenUsername,
      profileImage: tokenProfileImage || '',
      message,
      image: fullImageUrl,
    });


    setMessage("");
    setImagePreview(null);
    setSelectedFile(null);
  };



  <Typography sx={{ color: darkMode ? "#fff" : "#000", backgroundColor: darkMode ? "gray" : "#000", p: 2 }}>
    Lütfen bir grup seçiniz.
  </Typography>


  const messages = messagesByGroup[group?.GroupID || 0] || [];

  const onEmojiClick = (emojiData: any, event: any) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };


  // Mesaj tarihi

  const formatTime24h = (utcString: string) => {
    const date = new Date(utcString);
    const hours = date.getHours();       // Lokal saat (0-23)
    const minutes = date.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes}`;
  };


  // Mesajları tarihe göre gruplamak
  const groupMessagesByDate = (messages: Message[]): GroupedMessages => {
    return messages.reduce((groups, msg) => {
      const dateLabel = formatDateForChat(msg.sentAt);
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(msg);
      return groups;
    }, {} as GroupedMessages);
  };

  const groupedMessages = groupMessagesByDate(messages);


  const myPaperStyle = isTeamTheme
    ? darkMode
      ? {
        // ✅ Eğer hem takım teması aktifse hem de dark mode açıksa:
        // - Yazı rengi, takımın belirlediği secondary renge göre ayarlanır
        backgroundColor: adjustColorBrightness(teamColors.secondary, -30), // renk 
        color: "black",
      }
      : {
        // ✅ Sadece takım teması aktifse, dark mode kapalıysa:
        // - Takımın orijinal renkleri olduğu gibi uygulanır
        backgroundColor: teamColors.secondary,
        color: "black",
      }
    : darkMode
      ? {
        // ✅ Takım teması kapalı, ama dark mode açık ise:
        // - Klasik koyu tema: siyah zemin ve beyaz yazı
        backgroundColor: '#d9d9d9',
        color: 'black',
      }
      : {
        // ✅ Hem takım teması kapalı, hem dark mode kapalıysa:
        // - Klasik açık tema: açık gri zemin ve siyah yazı
        backgroundColor: '#eeecec',
        color: '#000000',
      };




  const theirStyle = isTeamTheme
    ? darkMode
      ? {
        // ✅ Eğer hem takım teması aktifse hem de dark mode açıksa:
        // - Yazı rengi, takımın belirlediği secondary renge göre ayarlanır
        backgroundColor: teamColors.primary, // renk 
        color: "white",
      }
      : {
        // ✅ Sadece takım teması aktifse, dark mode kapalıysa:
        // - Takımın orijinal renkleri olduğu gibi uygulanır
        backgroundColor: teamColors.primary,
        color: "white",
      }
    : darkMode
      ? {
        // ✅ Takım teması kapalı, ama dark mode açık ise:
        // - Klasik koyu tema: siyah zemin ve beyaz yazı
        backgroundColor: '#d7cd63',
        color: '#ffffff',
      }
      : {
        // ✅ Hem takım teması kapalı, hem dark mode kapalıysa:
        // - Klasik açık tema: açık gri zemin ve siyah yazı
        backgroundColor: '#eae162',
        color: '#000000',
      };








  return (
    <Box className={`chatpanel-container ${darkMode ? "dark" : "light"}`}>
      <Box className="chatpanel-header">
        <Box className="chatpanel-left">
          <Avatar
            alt={group.GroupName}
            src={fullGroupImageUrl}
            sx={{ width: 80, height: 80 }}
          />
          <Box sx={{ ml: 1 }}>
            <Typography className="chatpanel-groupHeader" variant="h6" sx={{ fontFamily: "inter", color: darkMode ? "#fff" : "#000" }}>
              {group.GroupName}
            </Typography>
            <Typography sx={{ fontFamily: "inter", color: darkMode ? "#fff" : "#000" }} variant="body2" className="chatpanel-groupHeader">
              {activeCount} Çevrimiçi
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onShowDetails}>
          <MoreVertIcon sx={{ color: darkMode ? '#fff' : '#000', fontSize: "40px" }} />
        </IconButton>
      </Box>

      <Box className="chatpanel-message-settings">
        {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <Box key={dateLabel}>
            <Box sx={{ textAlign: 'center', my: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? '#000' : '#fff',
                  backgroundColor: darkMode ? '#B8B7B7' : 'gray',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  userSelect: 'none',
                  fontSize: '14px',
                }}
              >
                {dateLabel}
              </Typography>
            </Box>

            {msgs.map((msg, index) =>
              msg.sender === "me" ? (
                <Box key={msg.id || index} className='chatpanel-myMessage' sx={{ mt: 1.2 }}>
                  <Paper
                    className='chatpanel-my-paper'
                    sx={{
                      p: 1.2,
                      mt: 1.2,
                      ...myPaperStyle
                    }}
                  >
                    {msg.message && (
                      <Typography variant="body1">{msg.message}</Typography>
                    )}
                    {msg.image && (
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={msg.image}
                          alt="Mesaj resmi"
                          style={{
                            maxWidth: '200px',
                            borderRadius: '8px',
                            display: 'block',
                          }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        fontSize: '10px',
                        mt: 0.5,
                        color: darkMode ? 'black' : 'black',
                      }}
                    >
                      {formatTime24h(msg.sentAt)}
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                <Box key={msg.id || index} className="chatpanel-their-message" sx={{ mb: 1 }}>
                  <Avatar
                    src={
                      msg.profileImage
                        ? msg.profileImage
                        : '/default-avatar.png'
                    }
                    alt={`${msg.firstName || ''} ${msg.lastName || ''}`}
                    className="chatpanel-their-avatar"
                  />
                  <Box className="chatpanel-their-message-body">
                    <Typography
                      variant="body2"
                      sx={{ color: darkMode ? '#fff' : '#000', fontSize: '16px' }}
                    >
                      {msg.senderName || "Kişi"}
                    </Typography>
                    <Paper
                      className='chatpanel-their-paper'
                      sx={{
                        p: 1.2,
                        mt: 1.2,
                        ...theirStyle
                      }}
                    >
                      {msg.message && (
                        <Typography variant="body1">{msg.message}</Typography>
                      )}
                      {msg.image && (
                        <Box sx={{ mt: 1 }}>
                          <img
                            src={msg.image}
                            alt="Mesaj resmi"
                            style={{
                              maxWidth: '200px',
                              borderRadius: '8px',
                              display: 'block',

                            }}
                          />
                        </Box>
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          textAlign: 'right',
                          color: darkMode ? 'white' : 'gray',
                          fontSize: '10px',
                          mt: 0.5,
                        }}
                      >
                        {formatTime24h(msg.sentAt)}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              )
            )}

          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto 15px',
          backgroundColor: darkMode ? '#222' : '#eeecec',
          borderRadius: 14,
          px: 2,
          py: 1,
          position: 'relative',
          gap: 1,
          width: "95%"
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <IconButton onClick={handleAttachClick}>
          <AttachFileIcon sx={{ color: darkMode ? '#fff' : '#000' }} />
        </IconButton>
        {showEmojiPicker && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '50px',
              left: '40px',
              zIndex: 1000,
            }}
          >
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </Box>
        )}
        <IconButton onClick={() => setShowEmojiPicker(val => !val)}>
          <InsertEmoticonIcon sx={{ color: darkMode ? '#fff' : '#000' }} />
        </IconButton>

        {imagePreview && (
          <Box
            component="img"
            src={imagePreview}
            alt="preview"
            sx={{
              width: 40,
              height: 40,
              objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid #000',
              cursor: 'pointer',
            }}
            onClick={() => setImagePreview(null)}
          />
        )}
        <TextField
          variant="standard"
          placeholder="Mesaj yaz..."
          InputProps={{
            disableUnderline: true,
            sx: {
              color: darkMode ? '#fff' : '#000',
            },
          }}
          inputProps={{
            style: {
              color: darkMode ? '#fff' : '#000',
            },
          }}
          sx={{ flex: 1 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // Satır eklenmesini engelle
              handleSendMessage(); // Mesaj gönder
            }
          }}
        />


        <IconButton onClick={handleSendMessage}>
          <SendIcon sx={{ color: darkMode ? '#fff' : '#000' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatPanel;
