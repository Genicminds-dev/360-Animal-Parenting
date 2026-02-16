// src/components/settings/PasswordSettings.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { getId } from '../../utils/TokenDecode/TokenDecode';
import { PATHROUTES } from '../../routes/pathRoutes';
import api from '../../services/api/api';
import { Endpoints } from '../../services/api/EndPoint';

const PasswordSettings = ({ onLogout }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [securityLevel, setSecurityLevel] = useState(0);
    const [passwordVisible, setPasswordVisible] = useState({
        old: false,
        new: false,
        confirm: false
    });

    // Password strength calculation
    useEffect(() => {
        let level = 0;
        const password = formData.newPassword;

        if (password.length > 0) level += 20;
        if (password.length >= 8) level += 30;
        if (/[A-Z]/.test(password)) level += 20;
        if (/[0-9]/.test(password)) level += 20;
        if (/[^A-Za-z0-9]/.test(password)) level += 10;

        setSecurityLevel(Math.min(level, 100));
    }, [formData.newPassword]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisible(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.oldPassword) {
            newErrors.oldPassword = "Current password is required";
        } else if (formData.oldPassword.length < 8 || formData.oldPassword.length > 70) {
            newErrors.oldPassword = "Password must be between 8-70 characters";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8 || formData.newPassword.length > 70) {
            newErrors.newPassword = "Password must be between 8-70 characters";
        } else if (formData.newPassword === formData.oldPassword) {
            newErrors.newPassword = "New password must be different from current password";
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        } else if (formData.confirmPassword.length < 8 || formData.confirmPassword.length > 70) {
            newErrors.confirmPassword = "Password must be between 8-70 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            const userId = getId();
            
            if (!userId) {
                navigate(PATHROUTES.login);
                return;
            }

            // API call for password change
            await api.put(Endpoints.CHANGE_PASSWORD, {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            toast.success("Password changed successfully! Please login again.", {
                duration: 3000
            });

            // Clear form
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            // Clear all auth tokens and storage
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');

            // Redirect to login after delay
            setTimeout(() => {
                navigate(PATHROUTES.login, { replace: true });
                window.location.reload(); // Force full page reload to clear all states
            }, 2000);

        } catch (error) {
            console.error("Failed to update password:", error);
            const errorMessage = error.response?.data?.message || "Failed to update password. Please try again.";
            toast.error(errorMessage);

            if (error.response?.status === 401) {
                onLogout?.();
            }
        } finally {
            setLoading(false);
        }
    };

    const securityColor = () => {
        if (securityLevel < 30) return 'bg-red-400';
        if (securityLevel < 70) return 'bg-yellow-400';
        return 'bg-green-400';
    };

    return (
        <div className="p-2">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: 'green',
                        },
                    },
                    error: {
                        style: {
                            background: 'red',
                        },
                    },
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                <div className="text-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 bg-gradient-to-r from-green-100 to-pink-100 rounded-full p-5 mx-auto mb-4 flex items-center justify-center"
                    >
                        <FaShieldAlt className="h-12 w-12 text-green-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
                    <p className="text-gray-500 mt-2">Secure your account with a strong, unique password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                        {/* Current Password */}
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FiLock /> Current Password <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={passwordVisible.old ? "text" : "password"}
                                    id="oldPassword"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleInputChange}
                                    maxLength={70}
                                    className={`block w-full rounded-md border ${
                                        errors.oldPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    } shadow-sm px-4 py-2 pr-10 sm:text-sm
                                    focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500`}
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('old')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-500"
                                >
                                    {passwordVisible.old ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.oldPassword && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                >
                                    <FiXCircle /> {errors.oldPassword}
                                </motion.p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FiLock /> New Password <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={passwordVisible.new ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    maxLength={70}
                                    className={`block w-full rounded-md border ${
                                        errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    } shadow-sm px-4 py-2 pr-10 sm:text-sm
                                    focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500`}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-500"
                                >
                                    {passwordVisible.new ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                >
                                    <FiXCircle /> {errors.newPassword}
                                </motion.p>
                            )}
                        </div>

                        {/* Password Strength Meter */}
                        {formData.newPassword && (
                            <div className="pt-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <FaShieldAlt className={`${
                                            securityLevel < 30 ? 'text-red-500' :
                                            securityLevel < 70 ? 'text-yellow-500' : 'text-green-500'
                                        }`} />
                                        Password Strength
                                    </span>
                                    <span className={`text-xs font-medium ${
                                        securityLevel < 30 ? 'text-red-500' :
                                        securityLevel < 70 ? 'text-yellow-500' : 'text-green-500'
                                    }`}>
                                        {formData.newPassword.length > 70 ? 'Too long' :
                                         securityLevel < 30 ? 'Weak' :
                                         securityLevel < 70 ? 'Medium' : 'Strong'}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className={`h-2 rounded-full ${
                                            formData.newPassword.length > 70 ? 'bg-red-500' : securityColor()
                                        }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${formData.newPassword.length > 70 ? 100 : securityLevel}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FiLock /> Confirm New Password <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={passwordVisible.confirm ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    maxLength={70}
                                    className={`block w-full rounded-md border ${
                                        errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    } shadow-sm px-4 py-2 pr-10 sm:text-sm
                                    focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500`}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-500"
                                >
                                    {passwordVisible.confirm ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                >
                                    <FiXCircle /> {errors.confirmPassword}
                                </motion.p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full px-6 py-3 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-tr from-[#02382b] to-[#16a34a] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <FiLoader className="animate-spin" />
                                ) : (
                                    <>
                                        <FiCheckCircle /> Update Password
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PasswordSettings;