import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import LockIcon from '@mui/icons-material/Lock';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Login = () => {
    const [showSecondScreen, setShowSecondScreen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailEmpty, setIsEmailEmpty] = useState(true);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleContinue = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error('Invalid email format');
            return;
        }
        setShowSecondScreen(true);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsEmailEmpty(e.target.value.trim() === '');
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setIsPasswordEmpty(event.target.value.trim() === '');
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/users/login', { email, password }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            const data = response.data;
            if (response.status === 200) {
                toast.success(data.message);
                setEmail('');
                setPassword('');
                setTimeout(() => navigate('/'), 1000);
            } else {
                toast.error(data.message || 'An error occurred');
            }
        } catch (error) {
            toast.error('Server error');
            setEmail('');
            setPassword('');
        }
    };

    return (
        <>
            <div className={`min-h-screen flex justify-center items-center ${showSecondScreen ? 'hidden' : ''}`}>
                <div className="bg-white sm:p-3 sml:p-12 rounded-2xl shadow-md w-[460px]">
                    <h2 className="text-center text-blue-600 mb-5 sm:py-2 sml:py-1">Login</h2>
                    <div className='mx-4 mb-4'>
                        <TextField
                            id="outlined-size-small"
                            size="small"
                            fullWidth
                            placeholder='Email'
                            variant="outlined"
                            value={email}
                            onChange={handleEmailChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className="mx-4 mb-3">
                        <button
                            className={`bg-blue-700 text-white font-semibold py-2 px-4 rounded-full w-full ${isEmailEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleContinue}
                            disabled={isEmailEmpty}
                        >
                            Continue with Email
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <hr className="w-1/3 border-gray-400 border-1 mr-2" />
                        <span className="text-gray-500">OR</span>
                        <hr className="w-1/3 border-gray-400 border-1 ml-2" />
                    </div>
                    <p className="text-center pt-2">Don't have an account?</p>
                    <div className="mx-4 sm:mb-5 sml:mb-0">
                        <button
                            onClick={() => navigate("/register")}
                            className="hover:bg-gray-100 border text-blue-700 font-semibold py-2 px-4 rounded-full w-full">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>

            <div className={`min-h-screen flex justify-center items-center ${showSecondScreen ? '' : 'hidden'}`}>
                <div className="bg-white sm:p-1 sml:p-12 rounded-2xl shadow-md w-[460px] ">
                    <h2 className="text-center text-blue-600 mb-3 sm:py-2 sml:py-1">Welcome</h2>
                    <p className="text-center font-semibold text-black mb-5">{email}</p>
                    <div className='mx-10 mb-2'>
                        <TextField
                            id="outlined-size-small1"
                            size="small"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            placeholder='Password'
                            variant="outlined"
                            value={password}
                            onChange={handlePasswordChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon style={{ fontSize: "20px" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                    <div className="flex justify-end items-center mb-4 mt-0 mx-10">
                        <Link to="/login/forgetpassword/email" className="text-blue-700 no-underline hover:underline cursor-pointer">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="text-center mb-3 pt-2">
                        <button
                            className={`bg-blue-700 text-white font-semibold py-2 px-4 rounded-full w-1/2 ${isPasswordEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleLogin}
                            disabled={isPasswordEmpty}
                        >
                            Login
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <hr className="w-1/3 border-gray-400 border-1 mr-2" />
                        <span className="text-gray-500">OR</span>
                        <hr className="w-1/3 border-gray-400 border-1 ml-2" />
                    </div>
                    <div className="text-center mb-3 pt-3">
                        <button className="mx-auto text-center pt-2 text-blue-700 font-semibold"
                            onClick={() => setShowSecondScreen(false)}
                        >
                            Not You?
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />

        </>
    );
};

export default Login;
