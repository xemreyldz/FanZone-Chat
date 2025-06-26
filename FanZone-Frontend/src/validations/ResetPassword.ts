import * as Yup from "yup";

export const ResetPassword = Yup.object().shape({
  password: Yup.string().min(6, "Şifre en az 6 karakter olmalı").required("Zorunlu alan"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Şifreler uyuşmuyor")
    .required("Zorunlu alan"),
});