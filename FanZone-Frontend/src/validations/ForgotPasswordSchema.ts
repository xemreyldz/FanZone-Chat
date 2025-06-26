import * as  Yup from "yup"

export const ForgotPasswordSchema = Yup.object({
    email: Yup.string()
       .email("Geçerli bir email adresi giriniz")
       .required("Email zorunludur")
})