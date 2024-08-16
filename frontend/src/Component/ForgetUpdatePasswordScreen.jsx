import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import LockIcon from '@mui/icons-material/Lock';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetUpdatePasswordScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [disableConfirm, setDisableConfirm] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState('');
    const email = location.state?.email;

    // Update Component Fucntions
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleContinue = async () => {
        // Validate password and confirmPassword
        console.log("Email " ,email)
        if (!password || !confirmPassword) {
            toast.error('Both password fields are required');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            toast.error('Password is too short');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/auth/update-password', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                toast.success('Password updated successfully');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            if (error.response) {
                console.log(error)
                toast.error(error.response.data.message || 'Error updating password');
            } else {
                console.log(error)

            }
        }
    };


    const validatePassword = () => {
        const passwordLength = password.length;

        if (passwordLength == 0) {
            setPasswordStrength('');

        } else if (passwordLength <= 8) {
            setPasswordStrength('Weak Passsword');
        } else if (passwordLength > 8) {
            setPasswordStrength('Strong Password');
        } else {
            setPasswordStrength('');
        }

        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordPattern.test(password)) {
            setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.');
        } else {
            setPasswordError('');
        }
    };


    useEffect(() => {
        validatePassword();
    }, [password]);

    useEffect(() => {
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            setDisableConfirm(true);
        } else {
            setConfirmPasswordError('');
            if (password !== '' && confirmPassword !== '') {
                setDisableConfirm(false);
            }
        }
    }, [password, confirmPassword]);

    React.useEffect(() => {
        validatePassword();
    }, [password]);

    React.useEffect(() => {
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            setDisableConfirm(true); // Disable button if passwords don't match
        } else {
            setConfirmPasswordError('');
            if (password !== '' && confirmPassword !== '') {
                setDisableConfirm(false); // Enable button if passwords match and both fields are not empty
            }
        }
    }, [password, confirmPassword]);




    return (
        <>

            <div className="min-h-screen flex justify-center items-center">
                <div className="bg-white sm:p-2 sml:p-12 rounded-2xl shadow-md w-[460px]">
                    {/* Password Strength Indicator */}
                    <p className='text-center font-semibold text-lg font-mono'>
                        {passwordStrength ? (
                            <span className={`text-${passwordStrength === 'Strong Password' ? 'green-500' : 'red-500'}`}>
                                {passwordStrength}
                            </span>
                        ) : ""}
                    </p>

                    <img className="img-fluid w-1/2 mx-auto" src="https://www.shutterstock.com/image-vector/password-reset-icon-flat-vector-600nw-2018493584.jpg" alt="Password Reset Icon" />
                    <h2 className="text-center text-blue-600 mb-4 py-1">Update Password</h2>

                    <div className='mx-10 mb-4'>
                        <TextField
                            id="outlined-size-small3"
                            size="small"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            placeholder='Password'
                            variant="outlined"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                // Update password strength here if needed
                            }}
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
                        <br />
                        <br />

                        <TextField
                            id="outlined-size-small4"
                            size="small"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            placeholder='Confirm Password'
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                // Check password match here if needed
                            }}
                            error={confirmPasswordError !== ''}
                            helperText={confirmPasswordError}
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

                    <div className="flex justify-end mx-10 mb-5 pt-3">
                        <button className="text-blue-700 font-semibold py-2 sm:px-1 sml:px-4 rounded-full w-1/4"
                            onClick={() => navigate("/login")}
                        >
                            Cancel
                        </button>
                        <button
                            className={`bg-blue-700 hover:bg-blue-500 mx-1 px-8 text-white font-semibold rounded-full ${disableConfirm ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleContinue}
                            disabled={disableConfirm}
                        >
                            Confirm
                        </button>
                    </div>

                </div>
            </div>
            <ToastContainer />

        </>

    );
};

export default ForgetUpdatePasswordScreen;

