import * as Yup from "yup";

export const LoginSchema = Yup.object({
    username:Yup.string()
    .required("Kullanıcı adı zorunlu")
     .matches(/^\S+$/, "Boşluk karakteri kullanılamaz"),
    password:Yup.string()
    .min(6,"Şifre en az 6 karakter olmalı ")
    .required("Şifre zorunlu")
     .matches(/^\S+$/, "Boşluk karakteri kullanılamaz"),
})