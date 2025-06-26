import React, { useState } from 'react'
import "./Register.css"
import "../../font/Font.css"
import Logo from "../../assets/logo/logo-yellow2.png"
import { Box, Button, TextField, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, InputAdornment } from '@mui/material';
import { IoMail } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { MdBadge } from "react-icons/md";
import { FaArrowRightLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { RegisterSchema, RegisterSchema2, RegisterSchema3 } from '../../validations/RegisterSchema';

import { Cancel, CheckCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setRegisterData } from '../../store/slices/features/registerSlice';
import type { RootState } from '../../store/store';
import { teams } from "../../team";
import MessageBox from '../../components/messagebox/MessageBox';
import { resetRegister } from '../../store/slices/features/registerSlice'; // doğru yoldan import et
import { registerUser } from "../../api/authService";





interface FormValues {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    teamID: number;
    kosullariKabul: boolean;
    saygiliIletisim: boolean;
}



const Register: React.FC = () => {
    const validationSchemas = [RegisterSchema, RegisterSchema2, RegisterSchema3];
    const steps = ['Kişisel Bilgiler', 'Favori Takım', 'Kullanım Koşulları'];
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Mesajı göstermek için state tanımla
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const goToLoginPage = () => {
        navigate('/login')
    }

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };


    const handleNext = async () => {
        const errors = await formik.validateForm();
        const fieldsForStep = Object.keys(validationSchemas[activeStep].fields);

        // Sadece ilgili adımın alanlarında hata varsa ilerlemeyi engelle
        const stepErrors = fieldsForStep.some(field => errors[field]);

        if (stepErrors) {
            // İlgili alanları touched yap
            const touchedFields = fieldsForStep.reduce((acc, field) => ({ ...acc, [field]: true }), {});
            formik.setTouched({ ...formik.touched, ...touchedFields });
            formik.setErrors(errors);
        } else {
            if (activeStep === steps.length - 1) {
                formik.handleSubmit();
            } else {
                setActiveStep(prev => prev + 1);
            }
        }
    };

    const registerData = useSelector((state: RootState) => state.reg);
    const formik = useFormik<FormValues>({
        initialValues: {
            firstname: registerData.firstname || '',
            lastname: registerData.lastname || '',
            email: registerData.email || '',
            username: registerData.username || '',
            password: registerData.password || '',
            teamID: Number(registerData.teamID) || 0,
            kosullariKabul: false,
            saygiliIletisim: false,
        },
        enableReinitialize: true, // redux state değişince form da güncellenir
        validationSchema: validationSchemas[activeStep],
        onSubmit: async (values) => {
            console.log('register form verileri:', values);
            dispatch(setRegisterData(values));

            try {
                const response = await registerUser({
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    username: values.username,
                    password: values.password,
                    teamID: values.teamID,
                    kosullariKabul: values.kosullariKabul,
                    saygiliIletisim: values.saygiliIletisim,
                });

                setMessage(response.message);
                setError(null);
                dispatch(resetRegister());
                formik.resetForm();
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.error || 'Bir hata oluştu daha sonra tekrar deneyin.');
                setMessage(null);
            }


        },
    });

    console.log("Redux içindeki kayıt verisi:", registerData);

    return (
        <div className='register-container'>
            {(message || error) && (
                <MessageBox
                    message={message ?? undefined}
                    error={error ?? undefined}
                    duration={1000}
                    redirectTo={message ? "/login" : undefined} // sadece başarılıysa yönlendir
                />
            )}
            <div className='register-container-left'>
                <div className='register-container-text'>
                    <h1 className=' protest-strike-regular'>FANZONE'A KATIL,<br />TARAFTARLA BÜTÜNLEŞ!</h1>

                    <p className='inter'>Kayıt olmak sadece birkaç saniye sürer!<br />Taraftar sohbetlerine katılmak için bir hesap<br />oluştur.</p>
                </div>
            </div>
            <div className='register-container-right'>
                <div className='register-container-form'>
                    <div className='register-container-logo'>
                        <img title='logo' height={200} width={200} src={Logo}></img>
                    </div>
                    <div className="register-form">
                        <Box
                            sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2, justifyContent: "center", alignContent: "center", textAlign: "center" }}>
                            <form onSubmit={formik.handleSubmit}>
                                {/* Kişisel Bilgiler */}
                                {activeStep === 0 && (
                                    <><Box sx={{ display: "flex", flexDirection: "row", gap: 5, width: "350px", alignItems: "flex-start", minHeight: "80px", position: "relative" }}>
                                        {/* AD */}
                                        <TextField
                                            className='register-input'
                                            placeholder='Ad'
                                            name="firstname"
                                            variant='filled'
                                            value={formik.values.firstname}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                                            helperText={formik.touched.firstname && formik.errors.firstname}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            height: "100%",
                                                        }}>
                                                            <MdBadge className='register-custom-icon'/>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                                disableUnderline: false // isteğe bağlı
                                            }}
                                        />
                                        <Box sx={{ position: "absolute", right: "163px", top: "15px" }}>
                                            {formik.touched.firstname && (
                                                formik.errors.firstname ? (
                                                    <Cancel sx={{ color: "#ff4d4d", fontSize: 24 }} />
                                                ) : (
                                                    <CheckCircle sx={{ color: "#4caf50", fontSize: 24 }} />
                                                )
                                            )}
                                        </Box>

                                        {/* SOYAD */}
                                        <TextField
                                            className='register-input'
                                            placeholder='Soyad'
                                            name="lastname"
                                            value={formik.values.lastname}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                                            helperText={formik.touched.lastname && formik.errors.lastname}

                                            variant='filled'
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MdBadge className='register-custom-icon'/>
                                                    </InputAdornment>
                                                ),
                                                disableUnderline: false // isteğe bağlı
                                            }}
                                        />

                                        <Box sx={{ position: "absolute", right: "-35px", top: "15px" }}>
                                            {formik.touched.lastname && (
                                                formik.errors.lastname ? (
                                                    <Cancel sx={{ color: "#ff4d4d", fontSize: 24 }} />
                                                ) : (
                                                    <CheckCircle sx={{ color: "#4caf50", fontSize: 24 }} />
                                                )
                                            )}
                                        </Box>
                                    </Box>

                                        <Box minHeight={80} position={"relative"}>
                                            {/* E-POSTA */}
                                            <TextField
                                                className='register-input'
                                                placeholder="E-posta"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}

                                                fullWidth
                                                variant="filled"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IoMail className='register-custom-icon'/>
                                                        </InputAdornment>
                                                    ),
                                                    disableUnderline: false // isteğe bağlı
                                                }}
                                            />
                                            <Box sx={{ position: "absolute", right: "-35px", top: "15px" }}>
                                                {formik.touched.email && (
                                                    formik.errors.email ? (
                                                        <Cancel sx={{ color: "#ff4d4d", fontSize: 24 }} />
                                                    ) : (
                                                        <CheckCircle sx={{ color: "#4caf50", fontSize: 24 }} />
                                                    )
                                                )}
                                            </Box>

                                        </Box>

                                        <Box minHeight={80} position={"relative"}>
                                            {/* USERNAME */}
                                            <TextField
                                                className='register-input'
                                                placeholder='Kullanıcı adı'
                                                name="username"
                                                value={formik.values.username}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.username && Boolean(formik.errors.username)}
                                                helperText={formik.touched.username && formik.errors.username}
                                                variant='filled'
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <FaUser className='register-custom-icon'/>
                                                        </InputAdornment>
                                                    ),
                                                    disableUnderline: false // isteğe bağlı
                                                }}
                                            />
                                            <Box sx={{ position: "absolute", right: "-35px", top: "15px" }}>
                                                {formik.touched.username && (
                                                    formik.errors.username ? (
                                                        <Cancel sx={{ color: "#ff4d4d", fontSize: 24 }} />
                                                    ) : (
                                                        <CheckCircle sx={{ color: "#4caf50", fontSize: 24 }} />
                                                    )
                                                )}
                                            </Box>
                                        </Box>
                                        <Box minHeight={80} position={"relative"}>
                                            <TextField
                                                className="register-input"
                                                placeholder="Şifre"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                variant="filled"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}

                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <FaLock className='register-custom-icon' />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton sx={{ marginRight: "5px", marginTop: "18px" }} onClick={handleClickShowPassword} edge="end">
                                                                {showPassword ? <VisibilityOff sx={{ color: 'white' }} /> : <Visibility sx={{ color: 'white', marginBottom:"15px" }} />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <Box sx={{ position: "absolute", right: "-35px", top: "15px" }}>
                                                {formik.touched.password && (
                                                    formik.errors.password ? (
                                                        <Cancel sx={{ color: "#ff4d4d", fontSize: 24 }} />
                                                    ) : (
                                                        <CheckCircle sx={{ color: "#4caf50", fontSize: 24 }} />
                                                    )
                                                )}
                                            </Box>
                                        </Box>
                                        <div className='goToStepOne'>
                                            <Button
                                                variant="contained"
                                                endIcon={<IoIosArrowForward />}
                                                onClick={handleNext}
                                            >
                                                Sonraki
                                            </Button>
                                        </div>
                                        <div className='register-container-account'>
                                            <p className='inter'>Zaten bir hesabın var mı?<FaArrowRightLong style={{ marginLeft: "5px", marginRight: "5px" }} /> <span className='goToLogin' onClick={goToLoginPage}>Giriş Yap</span> </p>
                                        </div>

                                    </>
                                )}
                                {/* TAKIM SEÇ */}
                                {activeStep === 1 && (
                                    <>
                                        <Typography variant="h6" sx={{ mb: 2, color: "white", fontFamily: "inter", fontSize: "20px" }}>Favori Takımını Seç</Typography>
                                        <RadioGroup
                                            row
                                            name="teamID"  // burası formik'in tutacağı alan
                                            value={formik.values.teamID}
                                            onChange={(e) => formik.setFieldValue("teamID", Number(e.target.value))} // string → number dönüşümü
                                            sx={{ justifyContent: "space-around", width: "100%" }}
                                        >
                                            {teams.map((team) => (
                                                <FormControlLabel
                                                    key={team.id}
                                                    value={team.id.toString()}  // Radio value string olmalı
                                                    control={
                                                        <Radio sx={{
                                                            color: "gray",
                                                            '&.Mui-checked': {
                                                                color: 'white',
                                                            },
                                                        }} />
                                                    }
                                                    label={
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <img src={team.img} alt={team.name} width={150} height={150} />
                                                            <Typography variant="body2" sx={{ color: "white", fontSize: "17px" }}>
                                                                {team.name}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    labelPlacement="top"
                                                    sx={{ margin: 1 }}
                                                />
                                            ))}
                                        </RadioGroup>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                            <Button className='register-goToPrev' variant="outlined" onClick={() => setActiveStep(0)}>Geri</Button>
                                            <Button className='register-goToPrev'
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setActiveStep(2)}
                                                disabled={!formik.values.teamID} // burası önemli
                                            >
                                                Sonraki
                                            </Button>
                                        </Box>
                                    </>
                                )}
                                {/* KULLANIM KOŞULLARI */}
                                {activeStep === 2 && (
                                    <>
                                        <Typography variant="h6" sx={{ mb: 2, color: "white", fontFamily: "inter", fontSize: "25px", fontWeight: "bold" }}>
                                            Kullanım Koşulları
                                        </Typography>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="kosullariKabul"
                                                        checked={formik.values.kosullariKabul}
                                                        onChange={formik.handleChange}
                                                        sx={{
                                                            color: "white",
                                                            '&.Mui-checked': { color: 'white' },
                                                        }}
                                                    />
                                                }
                                                label="Kişisel verilerimin chat hizmeti kapsamında kullanılmasını onaylıyorum"
                                                sx={{
                                                    color: "white",
                                                    fontFamily: "inter",
                                                    fontSize: "20px",
                                                }}
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="saygiliIletisim"
                                                        checked={formik.values.saygiliIletisim}
                                                        onChange={formik.handleChange}
                                                        sx={{
                                                            color: "white",
                                                            '&.Mui-checked': { color: 'white' },
                                                        }}
                                                    />
                                                }
                                                label="Topluluk Kurallarını okudum ve kabul ediyorum"
                                                sx={{
                                                    color: "white",
                                                    fontFamily: "inter",
                                                    fontSize: "20px",
                                                }}
                                            />

                                        </div>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                            <Button className='register-goToPrev' variant="outlined" onClick={() => setActiveStep(1)}>Geri</Button>
                                            <Button className='register-btnSave'
                                                variant="contained"
                                                color="success"
                                                disabled={!(formik.values.kosullariKabul && formik.values.saygiliIletisim)}
                                                type='submit'

                                            >
                                                Kayıt Ol
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            </form>
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register