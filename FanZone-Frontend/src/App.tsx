import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';
import ResetPassword from './pages/resetpassword/ResetPassword';
import HomePage from './pages/home/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from './components/theme/ThemeContext';
import Groups from './pages/groups/Groups';
import { AuthProvider } from './context/AuthContext'; 
import  Settings from "./pages/settings/Settings"

function App() {
  

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path='/homepage' element={<HomePage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/register' element={<Register />} />
            <Route path='/groups' element={<Groups />} />
            <Route path='/settings' element={<Settings/>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
