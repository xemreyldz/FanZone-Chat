import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { fetchUserInfo, updateUserInfo } from '../../api/authService';
import MessageBox from "../../components/messagebox/MessageBox";
import { useTheme } from '../../components/theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';  // AuthContext'ten setToken al

const AccountSettings: React.FC = () => {
  const { darkMode } = useTheme();
  const { setToken } = useAuth();  // Burada setToken aldık

  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);

  const [initialUsername, setInitialUsername] = useState('');
  const [initialEmail, setInitialEmail] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserInfo()
      .then(data => {
        setFirstname(data.firstname || data.name || '');
        setLastname(data.lastname || data.surname || '');
        setUsername(data.username);
        setEmail(data.email);
        setInitialUsername(data.username);
        setInitialEmail(data.email);
        if (data.avatarUrl) {
          const fullImageUrl = `http://localhost:5000${data.avatarUrl}`;
          setPreview(fullImageUrl);
        } else {
          setPreview(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Kullanıcı bilgileri alınamadı:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  const isChanged = () => {
    return (
      username !== initialUsername ||
      email !== initialEmail ||
      selectedFile !== null
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSave = async () => {
    if (!isChanged()) {
      setMessage("Değişiklik yapılmadı.");
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);

      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }

      const data = await updateUserInfo(formData); // token parametresi kaldırıldı

      // Yeni token'i localStorage'a kaydet
      localStorage.setItem('userToken', data.token);

      // Token'ı AuthContext'te de güncelle, böylece navbar vs. güncellenir
      setToken(data.token);

      setMessage('Güncelleme başarılı!');
      setInitialUsername(data.user.username);
      setInitialEmail(data.user.email);
      setSelectedFile(null);
      setIsUsernameEditable(false);
      setIsEmailEditable(false);

    } catch (error) {
      console.error(error);
      setError('Güncelleme başarısız oldu!');
    } finally {
      setSaving(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const containerStyle = {
    backgroundColor: darkMode ? 'black' : '#fff',
    color: darkMode ? '#eee' : '#111',
    minHeight: '100vh',
    padding: '20px',
  };

  return (
    <Box sx={containerStyle}>
      <MessageBox
        message={message || undefined}
        error={error || undefined}
        duration={4000}
      />
      <Typography variant="h4" component="h1">
        Hesap Ayarları
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          backgroundColor: darkMode ? 'black' : 'white',
          borderRadius: 5,
          boxShadow: darkMode
            ? '0 15px 15px rgba(255,255,255,0.05)'
            : '0 15px 15px rgba(0,0,0,0.05)',
          padding: 4,
          width: '100%',
          maxWidth: 900,
          gap: 4,
          color: darkMode ? '#eee' : '#111',
        }}
      >
        {/* Sol: Avatar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            alt="User Avatar"
            src={preview || undefined}
            sx={{ width: 150, height: 150, marginBottom: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              '&:hover': { backgroundColor: '#555' },
              textTransform: 'none',
              padding: '8px 24px',
              borderRadius: 3,
            }}
            onClick={handleButtonClick}
          >
            Değiştir
          </Button>
        </Box>

        {/* Sağ: Form Alanları */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Ad ve Soyad (disabled) */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ marginBottom: 0.5, fontWeight: 'bold', color: darkMode ? '#ccc' : '#555' }}
              >
                Ad
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                disabled
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: darkMode ? '#333' : '#eee',
                    borderRadius: '8px',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'transparent' },
                    '&.Mui-focused fieldset': { borderColor: 'transparent' },
                    color: darkMode ? '#eee' : '#111',
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ marginBottom: 0.5, fontWeight: 'bold', color: darkMode ? '#ccc' : '#555' }}
              >
                Soyad
              </Typography>
              <TextField
                fullWidth
                disabled
                variant="outlined"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: darkMode ? '#333' : '#eee',
                    borderRadius: '8px',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'transparent' },
                    '&.Mui-focused fieldset': { borderColor: 'transparent' },
                    color: darkMode ? '#eee' : '#111',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Kullanıcı Adı */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 0.5,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', color: darkMode ? '#ccc' : '#555' }}
              >
                Kullanıcı Adı
              </Typography>
              <Button
                sx={{ textTransform: 'none', color: '#666' }}
                onClick={() => setIsUsernameEditable(!isUsernameEditable)}
              >
                {isUsernameEditable ? 'Vazgeç' : 'Düzenle'}
              </Button>
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              value={username}
              disabled={!isUsernameEditable}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#333' : '#eee',
                  borderRadius: '8px',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: 'transparent' },
                  color: darkMode ? '#eee' : '#111',
                },
              }}
            />
          </Box>

          {/* E-mail Adresi */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 0.5,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', color: darkMode ? '#ccc' : '#555' }}
              >
                E-mail Adresi
              </Typography>
              <Button
                sx={{ textTransform: 'none', color: '#666' }}
                onClick={() => setIsEmailEditable(!isEmailEditable)}
              >
                {isEmailEditable ? 'Kilitle' : 'Düzenle'}
              </Button>
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              type="email"
              value={email}
              disabled={!isEmailEditable}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#333' : '#eee',
                  borderRadius: '8px',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: 'transparent' },
                  color: darkMode ? '#eee' : '#111',
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Butonlar */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          marginTop: 4,
          justifyContent: 'space-between',
          paddingRight: { xs: 0, sm: 2, md: 4 },
          width: '100%',
          maxWidth: 900,
        }}
      >
        <Box>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#8BC34A',
              color: '#8BC34A',
              textTransform: 'none',
              padding: '10px 24px',
              borderRadius: '25px',
              minWidth: 120,
              visibility: isChanged() ? 'visible' : 'hidden',
              '&:hover': {
                backgroundColor: 'rgba(139, 195, 74, 0.04)',
                borderColor: '#8BC34A',
              },
            }}
            onClick={() => {
              setUsername(initialUsername);
              setEmail(initialEmail);
              setSelectedFile(null);
              setMessage(null);
              setError(null);
              setIsUsernameEditable(false);
              setIsEmailEditable(false);
            }}
          >
            Vazgeç
          </Button>
        </Box>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !isChanged()}
          sx={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            textTransform: 'none',
            padding: '10px 24px',
            borderRadius: '25px',
            minWidth: 180,
            '&:hover': {
              backgroundColor: '#388E3C',
            },
          }}
        >
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </Button>
      </Box>
    </Box>
  );
};

export default AccountSettings;
