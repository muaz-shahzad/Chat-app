import { useState, useEffect, useRef } from 'react'
import * as React from 'react'
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LockIcon from '@mui/icons-material/Lock';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Forget = () => {

    const navigate = useNavigate();
    const [showSecondScreen, setShowSecondScreen] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [email, setEmail] = useState('');
    const [count, setCount] = useState(0); // Initial value
    const [otp, setOTP] = useState(['', '', '', '', '', '']);
    const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const [showUpdateComponent, setShowUpdateComponent] = useState(false); // New state variable
    const [loading, setLoading] = useState(false);
    // States For Update Component
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
    const [disableConfirm, setDisableConfirm] = React.useState(true);
    const [passwordStrength, setPasswordStrength] = React.useState('');

    // Verifying State
    const [verifying, setVerifying] = useState(false);
    // Resending State
    const [resending, setResending] = useState(false);

    const intervalRef = useRef(null);



    useEffect(() => {
        if (showSecondScreen) {
            setCount(30); // Reset timer
            setResendDisabled(false);

            intervalRef.current = setInterval(() => {
                setCount(prevCount => {
                    if (prevCount <= 1) {
                        clearInterval(intervalRef.current);
                        toast.error('OTP expired, press Resend');
                        setOTP(['', '', '', '', '', '']);
                        setResendDisabled(true);
                        return 0;
                    } else {
                        return prevCount - 1;
                    }
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [showSecondScreen]);




    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSendEmail = async () => {
        if (!email.trim()) {
            toast.error('Email is required');
            return;
        }
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailFormat)) {
            toast.error('Invalid email format');
            return;
        }

        // Set loading state to true to prevent multiple clicks
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/auth/forgot-password', { email }, {
                withCredentials: true // Include credentials (cookies) with the request
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                // Proceed to the second screen after a successful response from the server
                setTimeout(() => {
                    setShowSecondScreen(true);
                }, 100);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error('User not found');
                } else {
                    toast.error('Server Error');
                }
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response received from the server');
            } else {
                // Something happened in setting up the request that triggered an error

                toast.error('Error setting up the request');
            }
        } finally {
            // Set loading state to false after request completes
            setLoading(false);
        }
    };

    const handleChange = (index, value) => {
        const newOTP = [...otp];

        // Restrict the input to a single digit
        if (value.length === 1 && /^\d$/.test(value)) {
            newOTP[index] = value;
            setOTP(newOTP);

            // Move focus to the next input field if available
            if (index < 5 && value !== '') {
                refs[index + 1].current.focus();
            }
        } else if (value === '') {
            // Clear the input if the user deletes the digit
            newOTP[index] = '';
            setOTP(newOTP);

            // Move focus to the previous input field if available
            if (index > 0) {
                refs[index - 1].current.focus();
            }
        }
    };


    const handleKeyUp = (event, index) => {
        // If the user deletes a digit and the current input field is empty, focus on the previous field
        if (event.key === 'Backspace' && index > 0 && otp[index] === '') {
            refs[index - 1].current.focus();
        }
    };


    useEffect(() => {
        if (showUpdateComponent) {
            setOTP(['', '', '', '', '', '']); // Clear OTP when moving to the update screen
            setCount(30); // Optionally reset the timer
        }
    }, [showUpdateComponent]);


    const handleVerify = async () => {
        const enteredOTP = otp.join('');
        if (enteredOTP === '') {
            toast.error('Please enter OTP');
            return;
        }

        setVerifying(true);

        try {
            const response = await axios.post('http://localhost:8000/api/auth/verify-otp', {
                email: email,
                enteredOTP: enteredOTP
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                // Reset the timer and stop it
                setCount(30);
                clearInterval(intervalRef.current); // Ensure the interval is cleared

                setTimeout(() => {
                    setShowUpdateComponent(true); // Show the update component after successful verification
                }, 1000); // Short delay before showing the update component
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("User not found.");
                }
                if (error.response.status === 400) {
                    toast.error("Invalid OTP. Please retry.");
                }
            } else if (error.request) {
                toast.error('No response received from the server');
            } else {
                toast.error('Error setting up the request');
            }
        } finally {
            setVerifying(false);
        }
    };


    // Update Component Fucntions
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleContinue = async () => {
        // Validate password and confirmPassword
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
                navigate('/login');
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'Error updating password');
            } else {
                toast.error('Server Error');
            }
        }
    };



    const validatePassword = () => {
        const passwordLength = password.length;

        if (passwordLength > 8 && passwordLength <= 13) {
            setPasswordStrength('Weak Passsword');
        } else if (passwordLength > 13) {
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


    // Resend Functions
    const handleResend = async () => {
        setResending(true);

        try {
            const response = await axios.post('http://localhost:8000/api/auth/resend-otp', {
                email: email
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setCount(30); // Reset timer
                clearInterval(intervalRef.current); // Clear existing interval
                intervalRef.current = setInterval(() => {
                    setCount(prevCount => {
                        if (prevCount <= 1) {
                            clearInterval(intervalRef.current);
                            toast.error('OTP expired, press Resend');
                            setOTP(['', '', '', '', '', '']);
                            setResendDisabled(true);
                            return 0;
                        } else {
                            return prevCount - 1;
                        }
                    });
                }, 1000); // Restart timer
                setResendDisabled(false);
            }
        } catch (error) {
            toast.error('Error resending OTP');
        } finally {
            setResending(false);
        }
    };






    return (
        <>
            {!showSecondScreen && (
                <div className="min-h-screen flex justify-center items-center " >
                    <div className="bg-white sm:p-3 sml:p-12 rounded-2xl shadow-md w-[460px] ">
                        <img className="img-fluid w-1/3 mx-auto" src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg" alt="" />
                        <h2 className="text-center text-blue-600 mb-3 py-1">Forgot Password?</h2>
                        <p className="text-center mt-4 xs:px-4 sm:px-2 sml:px-0  sml:p-0 login_Desc">
                            Enter your email address & press Send Email.</p>
                        <div>
                            <div className='mx-10 mb-3'>
                                <TextField
                                    id="outlined-size-small"
                                    size="small"
                                    fullWidth
                                    placeholder='Email'
                                    variant="outlined"
                                    value={email}
                                    onChange={handleEmailChange} // Bind the function to handle email changes
                                />
                            </div>
                            <div className="flex justify-end mx-10 mb-3 pt-3">
                                <button className="text-blue-700 font-semibold py-2 sm:px-1 sml:px-4 rounded-full w-1/4 "
                                    onClick={() => navigate("/login")}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`bg-blue-700 hover:bg-blue-500 mx-1 px-3 text-white font-semibold  rounded-full ${!email.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={handleSendEmail}
                                    disabled={!email.trim() || loading}
                                >
                                    {loading ? 'Sending...' : 'Send Email'}
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            )}

            {showSecondScreen && !showUpdateComponent && (
                <div className="min-h-screen flex justify-center items-center " >
                    <div className="bg-white sm:p-8 sml:p-12 rounded-2xl shadow-md w-[500px] ">
                        <img className="img-fluid w-full mx-auto" src="https://thumbs.dreamstime.com/b/otp-authentication-security-identity-security-illustration-concept-flat-illustration-isolated-white-background-250136154.jpg" alt="" />
                        <h2 className="text-center text-blue-600 mb-3 pt-2">OTP</h2>
                        <p className="text-center mt-2 login_Desc">
                            OTP was sent to you via email
                        </p>
                        <div className="otp-field mb-4">
                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    type="number"
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyUp={(e) => handleKeyUp(e, index)}
                                    ref={refs[index]}
                                    maxLength={1}
                                />
                            ))}
                        </div>
                        <p className="mt-4 mx-16 flex justify-end login_Desc">
                            Remaining Time <span className='font-semibold ms-1'> {count}</span>
                        </p>

                        <div className="flex justify-end mx-12 mb-3 pt-3">
                            <button
                                className={`text-blue-700 font-semibold py-2 sm:px-1 sml:px-4 rounded-full w-1/4 ${!resendDisabled || resending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleResend}
                                disabled={!resendDisabled || resending}
                            >
                                {resending ? 'Resending...' : 'Resend'}
                            </button>
                            <button
                                className={`bg-blue-700 hover:bg-blue-500 mx-1 px-8  text-white font-semibold rounded-full  ${otp.some(value => value === '') || verifying || resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleVerify}
                                disabled={otp.some(value => value === '') || verifying || resendDisabled}
                            >
                                {verifying ? 'Verifying...' : 'Verify'}
                            </button>


                        </div>

                    </div>
                </div>
            )}
            {showUpdateComponent && (
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

                            {/* Display error message if passwords do not match */}
                            {password !== confirmPassword && confirmPassword !== '' && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    Passwords do not match
                                </p>
                            )}
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
            )}



            <ToastContainer />

        </>
    )
}

export default Forget