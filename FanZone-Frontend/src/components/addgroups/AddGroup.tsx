// src/components/AddGroup.tsx

import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { MdSportsSoccer } from "react-icons/md";
import { useTheme } from '../theme/ThemeContext';
import { createGroup } from '../../api/authService';
import { AddGroupSchema } from '../../validations/AddGroupSchema';
import { useFormik } from "formik";
import MessageBox from '../messagebox/MessageBox';

interface AddGroupProps {
    open: boolean;
    onClose: () => void;
}

const AddGroup: React.FC<AddGroupProps> = ({ open, onClose }) => {
    const { darkMode } = useTheme();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);  // Dosyayı state'e kaydet
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            image: null, // image kontrolü için ekleniyor ama kullanmayacağız
        },
        validationSchema: AddGroupSchema,
        validate: (values) => {
            const errors: { image?: string } = {};
            if (!imageFile) {
                errors.image = "Grup görseli zorunlu";
            }
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            setMsg("");
            setErr("")

            try {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("description", values.description);
                if (imageFile) formData.append("image", imageFile);

                await createGroup(formData);

                setMsg("Grup başarıyla oluşturuldu.");

                // Mesajı göstermesi için kısa bekle
                setTimeout(() => {
                    onClose();
                    resetForm();
                    setImageFile(null);
                    setPreviewUrl(null);
                }, 3000); // 2 saniye bekle

            } catch (error: any) {
                // Backend'den hata mesajını yakala ve alert göster
                setErr(error.response?.data?.error || error.message || "Bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        },
    });


    return (

        <Modal
            open={open}
            onClose={onClose} // ❗ Modal dışına tıklanınca kapanmasını sağlar
            aria-labelledby="modal-title"
            aria-describedby="modal-description"

        >

            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    height: 500,
                    bgcolor: darkMode ? 'grey.900' : 'background.paper',
                    color: darkMode ? 'grey.100' : 'text.primary',
                    borderRadius: 10,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <MessageBox message={msg} error={err} duration={4000} />

                <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <CancelIcon onClick={onClose} sx={{ color: 'inherit', fontSize: "35px", '&:hover': { color: '#BD1926', cursor: "pointer", } }} />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: "25px", fontFamily: "inter", fontWeight: "bold" }}>
                        Yeni Bir Taraftar Grubu Kur!
                    </Typography>
                    <p style={{ fontSize: "18px", fontFamily: "inter" }}>Grubuna bir isim ver,açıklmanı yaz ve kendi dijital tribünü oluştur.</p>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        gap: 4,
                        alignItems: "flex-start",
                        mt: 2,
                    }}
                >
                    {/* SOL TARAF - GÖRSEL YÜKLEME */}
                    <Box>
                        <input
                            name="image"
                            accept="image/*"
                            type="file"
                            id="upload-image"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <label htmlFor="upload-image">
                            <Box
                                component="span"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: "2px dashed gray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    overflow: "hidden",
                                    borderRadius: 2,
                                    position: "relative",
                                }}
                            >
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Önizleme"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    "Görsel Yükle"
                                )}
                            </Box>
                        </label>
                        {/* ✅ Görsel validasyon hatası */}
                        {formik.errors.image && (
                            <Typography color="error" fontSize={12} mt={1}>
                                {formik.errors.image}
                            </Typography>
                        )}
                    </Box>

                    {/* SAĞ TARAF - FORM ALANLARI */}
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            name='name'
                            placeholder="Grup adı giriniz."
                            fullWidth
                            variant="filled"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            sx={{
                                mb: 2,
                                bgcolor: darkMode ? '#333' : '#f0f0f0',
                                '& .MuiFilledInput-root': {
                                    backgroundColor: darkMode ? '#333' : '#f0f0f0',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#444' : '#e0e0e0',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: darkMode ? '#444' : '#e0e0e0',
                                    },
                                },
                                '& .MuiFilledInput-input': {
                                    color: darkMode ? '#fff' : '#000',
                                },
                            }}
                        />
                        <TextField
                            placeholder="Grup açıklaması giriniz."
                            name='description'
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            sx={{
                                mb: 2,
                                bgcolor: darkMode ? '#333' : '#f0f0f0',
                                '& .MuiFilledInput-root': {
                                    backgroundColor: darkMode ? '#333' : '#f0f0f0',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#444' : '#e0e0e0',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: darkMode ? '#444' : '#e0e0e0',
                                    },
                                },
                                // multiline textarea için yazı rengini buraya ekliyoruz:
                                '& .MuiFilledInput-multiline': {
                                    color: darkMode ? '#fff' : '#000',
                                },
                            }}
                        />
                    </Box>

                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignContent: "center" }} mt={5}>
                    {message && (
                        <Typography color={message.includes("başarıyla") ? "success.main" : "error"} sx={{ mb: 2 }}>
                            {message}
                        </Typography>
                    )}
                    <p style={{ fontFamily: "inter" }}>
                        <MdSportsSoccer /> Unutma, herkes senin grubuna katılabilir. Hadi, taraftar ruhunu yansıt!
                    </p>
                    <Button
                        sx={{ backgroundColor: "#faed38", color: "black", fontFamily: "inter", fontWeight: "bold" }}
                        onClick={() => formik.handleSubmit()}
                        disabled={loading}
                    >
                        {loading ? "Yükleniyor..." : "Grup Oluştur"}
                    </Button>
                </Box>



            </Box>
        </Modal>
    );
};

export default AddGroup;
