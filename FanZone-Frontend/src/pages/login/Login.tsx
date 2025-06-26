import React, { useState } from 'react'
import "./Login.css"
import "../../font/Font.css"
import Logo from "../../assets/logo/logo-yellow2.png"
import TextField from '@mui/material/TextField'
import { Box, FormHelperText, IconButton, InputAdornment } from '@mui/material'
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { LoginSchema } from "../../validations/LoginSchema"
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux'
import { setLoginData } from '../../store/slices/features/loginSlice'
import { loginUser } from '../../api/authService';
import MessageBox from '../../components/messagebox/MessageBox';

import type { RootState } from '../../store/store'
import { resetLogin } from '../../store/slices/features/loginSlice'
import { useAuth } from '../../context/AuthContext';

interface FormValues {
    username: string;
    password: string;
}



const Login: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { setToken } = useAuth();


    const goToForgotPassword = () => {
        navigate('/forgotpassword');  // Burada hedef URL
    };

    const goToRegisterPage = () => {
        navigate('/register')
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };


    const loginData = useSelector((state: RootState) => state.log);
    const formik = useFormik<FormValues>({
        initialValues: {
            username: loginData.username || '',
            password: loginData.password || '',
        },
        enableReinitialize: true,
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            console.log('Login form verileri:', values)
            // Login işlemi
            dispatch(setLoginData(values));
            try {
                const data = await loginUser(values.username, values.password);
                localStorage.setItem('userToken', data.token); // data.token doğru
                console.log('API yanıtı:', data);
                setToken(data.token);  // BURASI EKLENDİ
                setMessage(data.message); // Başarı mesajı
                setError(null); // Hata mesajını temizle


                dispatch(resetLogin());
                formik.resetForm();
            } catch (error: any) {
                console.error(error);
                setError(error.response?.data?.error || 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
                setMessage(null); // Başarı mesajını temizle
            }
        },
    });


    return (

        <div className='login-container'>
            {(message || error) && (
                <MessageBox
                    message={message ?? undefined}
                    error={error ?? undefined}
                    duration={1000}
                    redirectTo={message ? "/homepage" : undefined} // sadece başarılıysa yönlendir
                />
            )}
            <div className='login-container-left'>
                <div className='login-container-text'>
                    <h1 className=' protest-strike-regular'>HOŞ GELDİN TARAFTAR!</h1>
                    <p className='inter'>FanZone'da favori takımının tutkusunu paylaş,<br />taraftar gruplarını katıl ve canlı sohbetn bir<br /> parçası ol. </p>
                </div>
            </div>

            <div className='login-container-right'>
                <div className='login-container-form'>
                    <div className='login-container-logo'>
                        <img title='logo' height={250} width={250} src={Logo}></img>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className='login-login-form'>
                            <Box sx={{ display: "flex", flexDirection: "column", width: "300px", gap: 2, minHeight: "234px" }}>

                                <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                                    <div className='login-form-textfield'>
                                        <TextField
                                            className='register-input'
                                            name="username"
                                            variant="filled"
                                            placeholder="Kullanıcı adı"
                                            value={formik.values.username}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <FaUser className='register-custom-icon' />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                flex: 1,
                                                marginTop: 2,
                                                background: "#174863",
                                                marginBottom: "5px",
                                                borderRadius: "8px",
                                                input: { color: "white" },
                                                "& .MuiInputBase-root:before": {
                                                    borderBottomColor: "#16445d",
                                                },
                                                "& .MuiInputBase-root:after": {
                                                    borderBottomColor: "white",
                                                },
                                                "& .MuiInputBase-root:hover:before": {
                                                    borderBottomColor: "white",
                                                },
                                                "& .MuiInputBase-root": {
                                                    borderRadius: "10px",
                                                },
                                            }}
                                        />
                                        <div style={{ minHeight: "30px" }}>

                                            {formik.touched.username && formik.errors.username && (
                                                <FormHelperText sx={{ fontSize: "14px", }} error>
                                                    {formik.errors.username}
                                                </FormHelperText>
                                            )}

                                        </div>


                                    </div>
                                    {formik.touched.username && (
                                        <Box sx={{ position: "absolute", right: "-35px", top: "25px" }}>
                                            {formik.errors.username ? (
                                                <Cancel sx={{ color: "#ff4d4d", fontSize: 24 }} />
                                            ) : (
                                                <CheckCircle sx={{ color: "#4caf50", fontSize: 24 }} />
                                            )}
                                        </Box>
                                    )}
                                </Box>


                                <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                                    <div className='login-form-textfield'>
                                        <TextField
                                            className='register-input'
                                            name="password"
                                            variant="filled"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Şifre"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <FaLock className='register-custom-icon' />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleTogglePassword}>
                                                            {showPassword ? (
                                                                <Visibility fontSize="small" style={{ color: "white" }} />
                                                            ) : (
                                                                <VisibilityOff fontSize="small" style={{ color: "white" }} />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                flex: 1,

                                                background: "#174863",
                                                marginBottom: "5px",
                                                borderRadius: "8px",

                                                input: { color: "white" },
                                                "& .MuiInputBase-root:before": {
                                                    borderBottomColor: "#16445d",
                                                },
                                                "& .MuiInputBase-root:after": {
                                                    borderBottomColor: "white",
                                                },
                                                "& .MuiInputBase-root:hover:before": {
                                                    borderBottomColor: "white",
                                                },
                                                "& .MuiInputBase-root": {
                                                    borderRadius: "10px",
                                                },
                                            }}
                                        />

                                        {formik.touched.password && formik.errors.password && (
                                            <FormHelperText sx={{ fontSize: "14px" }} error>
                                                {formik.errors.password}
                                            </FormHelperText>
                                        )}
                                    </div>

                                    {formik.touched.password && (
                                        <Box sx={{ position: "absolute", right: "-35px", top: "10px" }}>
                                            {formik.errors.password ? (
                                                <Cancel sx={{ color: "#ff4d4d", fontSize: 24 }} />
                                            ) : (
                                                <CheckCircle sx={{ color: "#4caf50", fontSize: 24 }} />
                                            )}
                                        </Box>
                                    )}
                                </Box>







                            </Box>

                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                                <div className='login-forgotPassword'>
                                    <p className='inter' onClick={goToForgotPassword}>Şifreni mi unuttun?</p>
                                </div>
                                <div className='login-container-login-div'>
                                    <button type='submit' className=' inter btn-login'>Giriş Yap</button>
                                </div>

                            </div>



                            <div className='login-container-account'>
                                <p className='inter'>Henüz Hesabın yok mu?  <FaArrowRightLong style={{ marginLeft: "5px", marginRight: "5px" }} /> <span className='goToRegister' onClick={goToRegisterPage} >Kayıt Ol</span> </p>
                            </div>




                        </div>
                    </form>

                </div>

            </div>
        </div>
    )
}

export default Login