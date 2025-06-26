import * as Yup from 'yup';

const ChangePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Eski şifre zorunludur'),
  newPassword: Yup.string()
    .required('Yeni şifre zorunludur')
    .min(6, 'Şifre en az 6 karakter olmalı'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrar zorunludur'),
});

export default ChangePasswordSchema;
