import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetOTPScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOTP] = useState(['', '', '', '', '', '']);
    const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const [count, setCount] = useState(30);
    const [resendDisabled, setResendDisabled] = useState(false);
    const intervalRef = useRef(null);
    const email = location.state?.email;
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);


    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCount(prevCount => {
                if (prevCount <= 1) {
                    clearInterval(intervalRef.current);
                    toast.error('OTP expired, press Resend');
                    setResendDisabled(true);
                    setOTP(['', '', '', '', '', ''])
                    return 0;
                } else {
                    return prevCount - 1;
                }
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    const handleChange = (index, value) => {
        const newOTP = [...otp];
        if (value.length === 1 && /^\d$/.test(value)) {
            newOTP[index] = value;
            setOTP(newOTP);
            if (index < 5 && value !== '') {
                refs[index + 1].current.focus();
            }
        } else if (value === '') {
            newOTP[index] = '';
            setOTP(newOTP);
            if (index > 0) {
                refs[index - 1].current.focus();
            }
        }
    };

    const handleKeyUp = (event, index) => {
        if (event.key === 'Backspace' && index > 0 && otp[index] === '') {
            refs[index - 1].current.focus();
        }
    };

    const handleVerify = async () => {
        const enteredOTP = otp.join('');
        if (enteredOTP === '') {
            toast.error('Please enter OTP');
            return;
        }

        setVerifying(true);

        try {
            const response = await axios.post('http://localhost:8000/api/auth/verify-otp', {
                email,
                enteredOTP
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/login/forgetpassword/updatepassword', { state: { email } });
                }, 1000);
                navigate('');
            }
        } catch (error) {
            handleError(error);
        } finally {
            setVerifying(false);
        }
    };

    const handleError = (error) => {
        if (error.response) {
            if (error.response.status === 404) {
                toast.error("User not found.");
            } else if (error.response.status === 400) {
                toast.error("Invalid OTP. Please retry.");
            }
        } else if (error.request) {
            toast.error('No response received from the server');
        } else {
            toast.error('Error setting up the request');
        }
    };


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

            <ToastContainer />


        </>

    );
};

export default ForgetOTPScreen;
