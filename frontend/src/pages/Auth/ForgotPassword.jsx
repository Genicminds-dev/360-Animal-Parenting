import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { GiCow } from 'react-icons/gi';
import api from "../../services/api/api";
import { Endpoints } from "../../services/api/EndPoint";
import { PATHROUTES } from "../../routes/pathRoutes";

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        setLoading(true);

        try {
            const res = await api.post(Endpoints.FORGOT_PASSWORD, { email });
            setSuccess(res.data.message || 'If the email exists, a reset link has been sent');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Logo inside card */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
                        <GiCow className="text-white" size={32} />
                    </div>
            
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
                    <p className="text-gray-600">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start">
                        <FaExclamationCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-start">
                        <FaCheckCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium transition-all ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                Sending...
                            </span>
                        ) : 'Send Reset Link'}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-6 text-sm">
                    <Link
                        to={PATHROUTES.login}
                        className="inline-flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700 hover:underline"
                    >
                        <IoIosArrowBack className="text-sm" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;