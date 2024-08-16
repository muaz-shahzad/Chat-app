import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetEmailScreen = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [showUpdateComponent, setShowUpdateComponent] = useState(false); // New state variable
    const [loading, setLoading] = useState(false);


    const intervalRef = useRef(null);








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

            });
            if (response.status === 200) {
                toast.success(response.data.message);
                setEmail("")
                // Proceed to the second screen after a successful response from the server
                setTimeout(() => {
                    navigate('/login/forgetpassword/otp', { state: { email } });
                }, 600);
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


    return (
        <>
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
            <ToastContainer />

        </>


    );
};

export default ForgetEmailScreen;
