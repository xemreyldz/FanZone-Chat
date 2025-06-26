import * as Yup from "yup";

export const RegisterSchema = Yup.object({
    firstname:Yup.string()
    .required("Ad zorunludur")
    .min(3,"Min 3 harf girmelisiniz"),
    lastname:Yup.string()
    .required("Soyad zorunludur")
    .min(3,"Min 3 harf girmelisiniz"),
    email: Yup.string()
    .email("Geçerli bir email adresi giriniz")
    .required("Email zorunludur")
    .matches(/^\S+$/, "Boşluk karakteri kullanılamaz"),
    username:Yup.string()
    .required("Kullanıcı adı zorunludur")
    .min(3,"Min 3 harf girmelisiniz")
    .matches(/^\S+$/, "Boşluk karakteri kullanılamaz"),
    password:Yup.string()
    .required("Şifre zorunludur")
    .min(6,"Min 6 harf girmelisiniz")

})
export const RegisterSchema2 = Yup.object({
  favoriTakim: Yup.string().required("Favori takım seçmelisiniz"),
});

export const RegisterSchema3 = Yup.object({
  kosullariKabul: Yup.boolean()
    .oneOf([true], "Kullanım koşullarını kabul etmelisiniz"),
  saygiliIletisim: Yup.boolean()
    .oneOf([true], "Topluluk kurallarını kabul etmelisiniz"),
})