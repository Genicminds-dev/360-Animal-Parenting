// src/components/settings/MyProfile.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCamera, FiCheckCircle, FiXCircle, FiArrowLeft, FiMail, FiPhone, FiAward, FiEdit2, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { getId } from '../../utils/TokenDecode/TokenDecode';
import { PATHROUTES } from '../../routes/pathRoutes';
import api, { baseURLFile } from '../../services/api/api';
import { Endpoints } from '../../services/api/EndPoint';

const MyProfile = ({ onLogout, darkMode }) => {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        mobile: "",
        roleId: "",
        profileImg: "",
        status: "",
        Role: {
            name: ""
        }
    });
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        mobile: "",
        profileImg: "",
        previewImage: "",
        imageFile: null
    });
    const [errors, setErrors] = useState({});
    const [isHovering, setIsHovering] = useState(false);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = getId();
                if (!userId) {
                    navigate(PATHROUTES.login);
                    return;
                }

                const response = await api.get(Endpoints.GET_PROFILE(userId));
                const data = response.data.data;

                setUserData({
                    id: data.id,
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    username: data.username || "",
                    email: data.email || "",
                    mobile: data.mobile || "",
                    roleId: data.roleId || "",
                    profileImg: data.profileImg || "",
                    status: data.status || "",
                    Role: {
                        name: data.Role?.name || ""
                    }
                });

            } catch (error) {
                console.error("Error fetching user data:", error);
                if (error.response?.status === 401) {
                    onLogout?.();
                    navigate(PATHROUTES.login);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, onLogout]);

    // Initialize form data when userData changes
    useEffect(() => {
        if (userData.id) {
            setFormData({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                mobile: userData.mobile || "",
                profileImg: userData.profileImg || "",
                previewImage: "",
                imageFile: null
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Validation for mobile number - only numbers and max 10 digits
        if (name === 'mobile') {
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }

        // Validation for first and last name - only letters and spaces
        if (name === 'firstName' || name === 'lastName') {
            if (!/^[a-zA-Z\s]*$/.test(value)) return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const roleMap = {
        1: "Master Admin",
        2: "Super Admin",
        3: "Admin",
        4: "User",
        5: "Viewer",
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName) newErrors.firstName = "Required";
        else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) newErrors.firstName = "Only letters allowed";

        if (!formData.lastName) newErrors.lastName = "Required";
        else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) newErrors.lastName = "Only letters allowed";

        if (!formData.mobile) {
            newErrors.mobile = "Required";
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Must be 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);

            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('mobile', formData.mobile);

            // Only append image if a new one was selected
            if (formData.imageFile) {
                formDataToSend.append('profileImg', formData.imageFile);
            }

            const response = await api.put(
                Endpoints.UPDATE_USER_PROFILE,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const updatedUserData = {
                ...userData,
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: formData.mobile,
                profileImg: response.data.data.profileImg || userData.profileImg
            };

            setUserData(updatedUserData);

            toast.success("Profile updated successfully!");
            setEditMode(false);

        } catch (error) {
            console.error("Failed to update profile:", error);
            const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
            toast.error(errorMessage);

            if (error.response?.status === 401) {
                onLogout?.();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ profileImg: "Image must be less than 5MB" });
            return;
        }

        // Validate image type
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            setErrors({ profileImg: "Only JPG/PNG images are allowed" });
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        setFormData(prev => ({
            ...prev,
            previewImage: previewUrl,
            imageFile: file
        }));

        setErrors(prev => ({ ...prev, profileImg: "" }));
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    // Helper function to get image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        if (imagePath.startsWith('http')) return imagePath;
        return `${baseURLFile}${imagePath}`;
    };

    return (
        <div className='p-2'>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: darkMode ? '#374151' : '#363636',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#0284c7', // primary-600
                        },
                    },
                    error: {
                        style: {
                            background: '#dc2626',
                        },
                    },
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Profile Picture Section */}
                    <div className="w-full lg:w-1/3 flex flex-col items-center px-4">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="relative mb-4 group"
                            onHoverStart={() => setIsHovering(true)}
                            onHoverEnd={() => setIsHovering(false)}
                        >
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl relative bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                {formData.previewImage || userData.profileImg ? (
                                    <img
                                        src={formData.previewImage || getImageUrl(userData.profileImg)}
                                        alt="Profile"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <FiUser className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                                )}
                                {editMode && (
                                    <motion.label
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: isHovering ? 1 : 0 }}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                        <div className="bg-white/80 p-3 rounded-full text-primary-600">
                                            <FiCamera className="text-2xl" />
                                        </div>
                                    </motion.label>
                                )}
                            </div>
                            {errors.profileImg && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-2 text-center text-sm text-red-600 dark:text-red-400"
                                >
                                    {errors.profileImg}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.h2
                            className="text-2xl font-bold text-gray-800 dark:text-white text-center max-w-full truncate"
                            whileHover={{ scale: 1.02 }}
                        >
                            {userData.username}
                        </motion.h2>

                        <motion.p
                            className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"
                            whileHover={{ scale: 1.01 }}
                        >
                            <FiAward className="text-primary-500" /> {roleMap[userData.roleId] || userData.Role?.name || "N/A"}
                        </motion.p>

                        {!editMode && (
                            <motion.button
                                onClick={() => setEditMode(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-6 px-6 py-2 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center gap-2"
                            >
                                <FiEdit2 /> Edit Profile
                            </motion.button>
                        )}
                    </div>

                    {/* Profile Form Section */}
                    <div className="w-full lg:w-2/3">
                        {editMode ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['firstName', 'lastName', 'mobile'].map((field) => (
                                        <motion.div
                                            key={field}
                                            variants={fieldVariants}
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ duration: 0.3 }}
                                            className="space-y-1"
                                        >
                                            <label htmlFor={field} className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize flex items-center gap-2">
                                                {field === 'mobile' ? <FiPhone size={14} /> : <FiUser size={14} />}
                                                {field.replace(/([A-Z])/g, ' $1').trim()}
                                            </label>
                                            <input
                                                type={field === 'mobile' ? 'tel' : 'text'}
                                                id={field}
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                                maxLength={field === 'mobile' ? 10 : 20}
                                                className={`mt-1 block w-full rounded-md border ${errors[field]
                                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                                                    } shadow-sm px-4 py-2 sm:text-sm
                                                focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                                                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                            />
                                            {errors[field] && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                >
                                                    <FiXCircle /> {errors[field]}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData(prev => ({
                                                ...prev,
                                                previewImage: userData.profileImg || "",
                                                imageFile: null
                                            }));
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                                    >
                                        <FiArrowLeft /> Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-2 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <FiLoader className="animate-spin" />
                                        ) : (
                                            <>
                                                <FiCheckCircle /> Update
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { key: 'firstName', label: 'First Name', value: userData.firstName, icon: <FiUser /> },
                                        { key: 'lastName', label: 'Last Name', value: userData.lastName, icon: <FiUser /> },
                                        { key: 'email', label: 'Email', value: userData.email, icon: <FiMail /> },
                                        { key: 'mobile', label: 'Mobile', value: userData.mobile, icon: <FiPhone /> }
                                    ].map((field) => (
                                        <motion.div
                                            key={field.key}
                                            whileHover={{ scale: 1.01 }}
                                            className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-md border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200"
                                        >
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize flex items-center gap-2">
                                                {field.icon}
                                                {field.label}
                                            </h3>
                                            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white max-w-[250px] break-words">
                                                {field.value || 'Not provided'}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MyProfile;