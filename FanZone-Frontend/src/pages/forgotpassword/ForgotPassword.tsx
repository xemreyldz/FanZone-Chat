import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Box, InputAdornment, TextField } from "@mui/material";
import { IoMail } from "react-icons/io5";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { ForgotPasswordSchema } from "../../validations/ForgotPasswordSchema";
import { forgotPassword } from '../../api/authService';
import  MessageBox  from "../../components/messagebox/MessageBox"

import Logo from "../../assets/logo/logo-yellow2.png";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);




  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setMessage(null);
        setError(null);
        await forgotPassword(values.email);
        setMessage("Şifre sıfırlama linki e-posta adresine gönderildi.");
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Bir hata oluştu, lütfen tekrar deneyin.");
        }
      } finally {
        setSubmitting(false);
      }
    }
  });


  return (
    <div className="forgotPassword-container">
      <MessageBox
        message={message || undefined}
        error={error || undefined}
        duration={4000}
        redirectTo={message ? "/login" : undefined}
      />
      <div className="forgotPassword-container-left">
        <div className="forgotPassword-container-text">
          <h1 className="protest-strike-regular">ŞİFRENİ Mİ UNUTTUN?</h1>
          <p className="inter">
            Endişelenme, bu her taraftarın başına gelebilir!
            <br />
            Hemen yeni bir şifre oluştur,
            <br />
            FanZone kaldığın yerden devam etsin.
            <br />
          </p>
        </div>
      </div>

      <div className="forgotPassword-container-right">
        <div className="forgotPassword-container-form">
          <div className="forgotPassword-container-logo">
            <img title="logo" height={250} width={250} src={Logo} />
          </div>

          <form onSubmit={formik.handleSubmit} className="forgotPassword-form">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "300px",
                gap: 2,
              }}
            >
              <Box minHeight={80} position={"relative"}>
                <TextField
                  className="register-input"
                  fullWidth
                  variant="filled"
                  placeholder="E-posta"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IoMail className="register-custom-icon" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ position: "absolute", right: "-35px", top: "10px" }}>
                  {formik.touched.email &&
                    (formik.errors.email ? (
                      <Cancel sx={{ color: "#ff4d4d", fontSize: 24 }} />
                    ) : (
                      <CheckCircle sx={{ color: "#4caf50", fontSize: 24 }} />
                    ))}
                </Box>
              </Box>
            </Box>

            <div className="div-forgotPassword">
              <p className="inter">
                Yeni bir şifre oluşturman için sana bir
                <br /> bağlantı göndereceğiz
              </p>
            </div>


            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="forgotPassword-goToLogin">
                <p className="inter" onClick={() => navigate("/login")}>
                  Giriş Yap
                </p>
              </div>
              <div className="forgotPasswordDiv-container">
                <button type="submit" className="inter btn-login">
                  Gönder
                </button>
              </div>


            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
