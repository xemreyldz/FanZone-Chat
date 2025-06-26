import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Switch,
  Stack,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ChangePasswordSchema from '../../validations/ChangePassword';
import { useFormik } from 'formik';
import { changePassword, deleteAccount } from '../../api/authService';
import MessageBox from '../messagebox/MessageBox';
import { useTheme } from '../../components/theme/ThemeContext';  // Tema context

const PrivacySettings: React.FC = () => {
  const { darkMode } = useTheme();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  type FieldName = 'currentPassword' | 'newPassword' | 'confirmNewPassword';

  const fields: { name: FieldName; label: string }[] = [
    { name: 'currentPassword', label: 'Eski Şifre' },
    { name: 'newPassword', label: 'Yeni Şifre' },
    { name: 'confirmNewPassword', label: 'Yeni Şifreyi Onayla' },
  ];

  const handleToggle2FA = () => setTwoFactorEnabled((prev) => !prev);

  const handleChangePassword = () => setPasswordModalOpen(true);

  const handleDeleteAccount = async () => {
    if (window.confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        const result = await deleteAccount();
        setMessage(result.message); // "Hesap başarıyla silindi."

        // İsteğe bağlı yönlendirme
        setTimeout(() => {
          localStorage.removeItem('userToken'); // varsa token’ı temizle
        }, 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Hesap silinirken hata oluştu.');
      }
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await changePassword(values.currentPassword, values.newPassword);
        setSuccessMessage('Şifre başarıyla güncellendi.');
        setErrorMessage(undefined);
        setPasswordModalOpen(false);
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || 'Şifre değiştirme başarısız.');
        setSuccessMessage(undefined);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Tema uyumlu stiller:
  const containerStyle = {
    padding: 4,
    maxWidth: 600,
    height: 550,
    marginLeft: 5,
    backgroundColor: darkMode ? 'black' : '#f8f8f8',
    borderRadius: 2,
    color: darkMode ? '#eee' : '#111',
  };

  const dialogStyle = {
    borderRadius: 6,
    padding: 4,
    backgroundColor: darkMode ? '#1e1e1e' : '#f4f4f4',
    minWidth: 500,
    color: darkMode ? '#eee' : '#111',
  };

  return (
    <Box sx={containerStyle}>
      <MessageBox
        message={successMessage || message || undefined}
        error={errorMessage || error || undefined}
        duration={3000}
        redirectTo={message ? '/login' : undefined}
      />

      <Typography variant="h5" fontWeight="bold" mb={4}>
        Gizlilik ve Güvenlik
      </Typography>

      {/* Şifreyi Değiştir */}
      <Box mb={5}>
        <Typography variant="subtitle1" fontWeight="500" mb={1} color={darkMode ? '#ddd' : undefined}>
          Şifre
        </Typography>
        <Button
          variant="contained"
          onClick={handleChangePassword}
          sx={{
            backgroundColor: darkMode ? '#333' : '#1c1c1c',
            '&:hover': {
              backgroundColor: darkMode ? '#555' : '#333',
            },
            borderRadius: 2,
            paddingX: 3,
            paddingY: 1,
            color: '#fff',
          }}
        >
          Şifreyi Değiştir
        </Button>
      </Box>

      {/* İki Adımlı Doğrulama */}
      <Box mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" fontWeight="500" color={darkMode ? '#ddd' : undefined}>
              İki Adımlı Doğrulama
            </Typography>
            <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
              Hesabınıza ek bir güvenlik katmanı ekleyin.
            </Typography>
          </Box>
          <Switch checked={twoFactorEnabled} onChange={handleToggle2FA} color="default" />
        </Stack>
      </Box>

      {/* Hesabı Sil */}
      <Box mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" fontWeight="500" color={darkMode ? '#ddd' : undefined}>
              Hesabımı Sil
            </Typography>
            <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
              Hesabınızı kalıcı olarak silin.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleDeleteAccount}
            sx={{
              backgroundColor: '#e53935',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
              borderRadius: 2,
              paddingX: 3,
              paddingY: 1,
              color: '#fff',
            }}
          >
            Hesabı sil
          </Button>
        </Stack>
      </Box>

      {/* Şifre Modal */}
      <Dialog
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        PaperProps={{
          sx: dialogStyle,
        }}
      >
        <IconButton
          onClick={() => setPasswordModalOpen(false)}
          sx={{ position: 'absolute', top: 16, right: 16, color: darkMode ? '#eee' : '#111' }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={1} color={darkMode ? '#eee' : '#111'}>
          Yeni Şifre Belirle
        </Typography>
        <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'} textAlign="center" mb={3}>
          Güvenliğin için yeni bir şifre oluştur. <br />
          Lütfen aşağıdaki alanları doldur.
        </Typography>

        <DialogContent>
          <form
            onSubmit={formik.handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 30 }}
          >
            {fields.map(({ name, label }) => (
              <Box key={name}>
                <TextField
                  name={name}
                  label={label}
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword} edge="end" sx={{ color: darkMode ? '#eee' : undefined }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      backgroundColor: darkMode ? '#333' : '#eeeeee',
                      borderRadius: '30px',
                      height: 50,
                      paddingX: 2,
                      fontSize: 15,
                      color: darkMode ? '#eee' : '#111',
                      '& input': {
                        paddingY: 1,
                        color: darkMode ? '#eee' : '#111',
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                />

                <Typography
                  variant="body2"
                  color="error"
                  sx={{
                    minHeight: 20,
                    visibility: formik.touched[name] && formik.errors[name] ? 'visible' : 'hidden',
                    marginTop: 0.5,
                    marginLeft: 1,
                  }}
                >
                  {formik.errors[name]}
                </Typography>
              </Box>
            ))}

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting || !formik.isValid}
                sx={{
                  backgroundColor: '#2e7d32',
                  '&:hover': { backgroundColor: '#1b5e20' },
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                Şifreyi Güncelle
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PrivacySettings;
