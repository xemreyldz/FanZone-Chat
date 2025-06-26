import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./ResetPassword.css";
import Logo from "../../assets/logo/logo-yellow2.png";
import { Box, Button, FormHelperText, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaLock } from "react-icons/fa6";
import { ResetPassword as ResetPasswordSchema } from "../../validations/ResetPassword";
import { useFormik } from "formik";
import MessageBox from "../../components/messagebox/MessageBox"; // 💡 Bileşeni import et

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get("token");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      if (!token) {
        setErrorMessage("Şifreler uyuşmuyor!");
        return;
      }

      try {
        await axiosClient.post("/forgot-password/reset-password", {
          token,
          newPassword: values.password,
        });
        setSuccessMessage("Şifre başarıyla değiştirildi.");
        setTimeout(() => navigate("/login"), 1000);
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || "Bir hata oluştu.");
      }
    },
  });

  return (
    <div className="resetPassword-container">
      <MessageBox
        message={successMessage}
        error={errorMessage}
        duration={2500}
        redirectTo={successMessage ? "/login" : undefined}
      />
      <div className="resetPassword-left">
        <div className="resetPassword-container-text">
          <h1 className="protest-strike-regular">FANZONE SENİ BEKLİYOR</h1>
          <p className="inter">
            Hemen yeni bir şifre oluştur, FanZone kaldığın <br /> yerden devam
            etsin
          </p>
        </div>
      </div>

      <div className="resetPassword-right">
        <div className="resetPassword-container-form">
          <div className="resetPassword-container-logo">
            <img title="logo" height={250} width={250} src={Logo} alt="logo" />
          </div>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              textAlign: "center",
            }}
          >
            <TextField
              className="register-input"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="yeni şifre"
              variant="filled"
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock className="register-custom-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ color: "white" }}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ marginRight: "12px" }} />
                      ) : (
                        <Visibility sx={{ marginRight: "12px" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div style={{ minHeight: "28px" }}>

              {formik.touched.password && formik.errors.password && (
                <FormHelperText sx={{ fontSize: "14px", }} error>
                  {formik.errors.password}
                </FormHelperText>
              )}

            </div>

            <TextField
              className="register-input"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="yeni şifre (tekrar)"
              variant="filled"
              fullWidth
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock className="register-custom-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ color: "white" }}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ marginRight: "12px" }} />
                      ) : (
                        <Visibility sx={{ marginRight: "12px" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div style={{ minHeight: "28px" }}>

              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <FormHelperText sx={{ fontSize: "14px", }} error>
                  {formik.errors.confirmPassword}
                </FormHelperText>
              )}

            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>

            </div>
            <div className="login-container-login-div button-group">
              <button className="btn-modern primary" type="submit">Kaydet</button>
              <button className="btn-modern secondary" onClick={() => navigate("/login")}>Giriş Ekranına Dön</button>
            </div>

          </Box>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
