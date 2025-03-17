import React, { useState } from 'react';
import axios from 'axios';

const OTPForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendOtp = async () => {
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        setGeneratedOtp(otpCode);

        console.log(otpCode);

        try {
            await axios.post('http://localhost:5000/send-otp', {
                phone: formData.phone,
                otp: otpCode
            })
            alert('OTP Sent Successfully!');
        } catch (error) {
            console.error('Error sending OTP', error);
            alert('Failed to send OTP');
        }
    };


    const verifyOtp = () => {
        if (parseInt(otp) === generatedOtp) {
            setIsVerified(true);
            alert('OTP Verified Successfully!');

            console.log('User Data:', formData);
        } else {
            alert('Incorrect OTP');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Form with OTP Verification</h2>
            {!isVerified ? (
                <>
                    {/* <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ display: 'block', margin: '10px 0' }}
                    /> */}
                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <button onClick={sendOtp}>Send OTP</button>
                    <br /><br />
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <button onClick={verifyOtp}>Verify OTP</button>
                </>
            ) : (
                <h3>OTP Verified! 🎉</h3>
            )}
        </div>
    );
};

export default OTPForm;
