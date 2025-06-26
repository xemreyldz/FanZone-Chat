// components/ConfirmDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, title, description, onCancel, onConfirm }) => {
    const { darkMode } = useTheme();
    return (
        <Dialog PaperProps={{
            sx: {
                backgroundColor: darkMode ? '#2c2c2c' : '#fff',
                color: darkMode ? '#ccc' : '#000',
            },
        }} open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{description}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit">
                    Vazgeç
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Onayla
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
