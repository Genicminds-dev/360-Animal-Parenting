import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { GiCow } from 'react-icons/gi';

const ForgetPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);

    const navigate = useNavigate();

    // Handle OTP input
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus to next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    // Handle OTP key events
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    // Validate email
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate password strength
    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar
        };
    };

    // Step 1: Send OTP to email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);

            // Simulate API call to send OTP
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Check if email exists in demo users
            const demoUsers = [
                'admin@360animal.com',
                'procurement@360animal.com',
                'vet@360animal.com'
            ];

            if (!demoUsers.includes(email)) {
                // For demo purposes, we'll allow any email
                // In real app, you would check if email exists
                console.log('Email not found in demo users, but proceeding for demo');
            }

            setSuccess(`OTP has been sent to ${email}`);
            setStep(2);
            setCountdown(120); // 2 minutes countdown

            // Start countdown timer
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err) {
            setError('Failed to send OTP. Please try again.');
            console.error('Send OTP error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');

        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        // For demo, accept any 6-digit OTP
        // In real app, you would verify against backend
        if (otpString.length === 6) {
            try {
                setLoading(true);

                // Simulate API call to verify OTP
                await new Promise(resolve => setTimeout(resolve, 1000));

                setSuccess('OTP verified successfully!');
                setStep(3);

            } catch (err) {
                setError('Invalid OTP. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('Invalid OTP. Please enter the correct OTP.');
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            setError('Password does not meet requirements');
            return;
        }

        try {
            setLoading(true);

            // Simulate API call to reset password
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess('Password reset successful! You can now login with your new password.');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError('Failed to reset password. Please try again.');
            console.error('Reset password error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setError('');
        setSuccess('');

        try {
            setLoading(true);

            // Simulate API call to resend OTP
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess('New OTP has been sent to your email');
            setCountdown(120); // Reset to 2 minutes

            // Start countdown timer
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Format countdown time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((stepNumber) => (
                            <div key={stepNumber} className="flex flex-col items-center">
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium
                  ${step >= stepNumber
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }
                `}>
                                    {step > stepNumber ? <CheckCircle size={20} /> : stepNumber}
                                </div>
                                <span className="text-xs mt-2 text-gray-600">
                                    {stepNumber === 1 ? 'Email' : stepNumber === 2 ? 'OTP' : 'Password'}
                                </span>
                            </div>
                        ))}
                        <div className="flex-1 h-1 bg-gray-200 -mt-5 mx-2">
                            <div
                                className="h-1 bg-primary-600 transition-all duration-300"
                                style={{ width: `${((step - 1) / 2) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Step 1: Enter Email */}
                    {step === 1 && (
                        <div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                                <p className="text-gray-600">
                                    Enter your email address and we'll send you an OTP to reset your password
                                </p>
                            </div>

                            <form onSubmit={handleSendOtp} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                        {success}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-field pl-10"
                                            placeholder="Enter your registered email"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                            Sending OTP...
                                        </span>
                                    ) : 'Send OTP'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 2: Verify OTP */}
                    {step === 2 && (
                        <div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                                <p className="text-gray-600">
                                    Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                        {success}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                        6-Digit OTP
                                    </label>
                                    <div className="flex justify-center space-x-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center">
                                    {countdown > 0 ? (
                                        <p className="text-gray-600">
                                            Resend OTP in <span className="font-semibold">{formatTime(countdown)}</span>
                                        </p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={loading}
                                            className="text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                            Verifying...
                                        </span>
                                    ) : 'Verify OTP'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 3: Set New Password */}
                    {step === 3 && (
                        <div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
                                <p className="text-gray-600">
                                    Create a new secure password for your account
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                        {success}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="input-field pl-10 pr-10"
                                            placeholder="Enter new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {newPassword && (
                                        <div className="mt-3">
                                            <div className="text-sm text-gray-600 mb-2">Password must contain:</div>
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                                {Object.entries(validatePassword(newPassword)).map(([key, value]) => {
                                                    if (key === "isValid") return null;

                                                    return (
                                                        <div key={key} className="flex items-center text-sm">
                                                            <div
                                                                className={`w-2 h-2 rounded-full mr-2 ${value ? "bg-green-500" : "bg-gray-300"
                                                                    }`}
                                                            ></div>
                                                            <span className={value ? "text-green-600" : "text-gray-500"}>
                                                                {key === "minLength" && "At least 8 characters"}
                                                                {key === "hasUpperCase" && "One uppercase letter"}
                                                                {key === "hasLowerCase" && "One lowercase letter"}
                                                                {key === "hasNumbers" && "One number"}
                                                                {key === "hasSpecialChar" && "One special character"}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="input-field pl-10 pr-10"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                            Resetting Password...
                                        </span>
                                    ) : 'Reset Password'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                        <p>Remember your password?
                            <button
                                onClick={() => navigate('/login')}
                                className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Back to Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;