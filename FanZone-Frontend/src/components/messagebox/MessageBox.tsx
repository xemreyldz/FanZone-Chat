import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MessageBox.css";
import { LuCircleCheckBig } from "react-icons/lu";
import { MdError } from "react-icons/md";

interface MessageBoxProps {
  message?: string;
  error?: string;
  duration?: number; // mesajın görünme süresi (ms)
  redirectTo?: string; // yönlendirme yapılacak adres
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, error, duration = 3000, redirectTo }) => {
  const [visible, setVisible] = useState(false);
  const [hide, setHide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (message || error) {
      setVisible(true);
      setHide(false);

      const hideTimer = setTimeout(() => {
        setHide(true); // opacity 0 yapacak
      }, duration);

      const removeTimer = setTimeout(() => {
        setVisible(false); // tamamen kaldıracak
        if (redirectTo) {
          navigate(redirectTo);
        }
      }, duration + 1000);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    } else {
      setVisible(false);
    }
  }, [message, error, duration, redirectTo, navigate]);

  if (!visible) return null;

  return (
    <>
      {message && (
        <div className={`message-box success ${hide ? "hide" : ""}`}>
          <span className="icon material-icons"><LuCircleCheckBig/></span>
          {message}
        </div>
      )}

      {error && (
        <div className={`message-box error ${hide ? "hide" : ""}`}>
          <span className="icon material-icons"><MdError/></span>
          {error}
        </div>
      )}
    </>
  );
};

export default MessageBox;
