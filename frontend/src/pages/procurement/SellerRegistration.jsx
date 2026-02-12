import React, { useState } from 'react';
import { User, MapPin, Phone, CreditCard, Camera } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../services/api/api';
import { Endpoints } from '../../services/api/EndPoint';
import { PATHROUTES } from '../../routes/pathRoutes';
import { useNavigate } from 'react-router-dom';

const SellerRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Personal Details
        fullName: '',
        mobile: '',
        gender: '',

        // Profile Picture (non-mandatory)
        profilePhoto: null,
        aadharNumber: '', // non-mandatory

        // Address Details
        address: '',
        state: '',
        district: '',
        pincode: '',
        village: '',

        // Bank Details (all non-mandatory)
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Mandatory fields validation
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.mobile.trim()) newErrors.mobile = 'Mobile Number is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.address.trim()) newErrors.address = 'Complete Address is required';
        if (!formData.state) newErrors.state = 'State is required';

        // Mobile number pattern validation
        if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number must be 10 digits';
        }

        // Pincode pattern validation (if provided)
        if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'PIN code must be 6 digits';
        }

        // Aadhar pattern validation (if provided)
        if (formData.aadharNumber && !/^[0-9]{12}$/.test(formData.aadharNumber)) {
            newErrors.aadharNumber = 'Aadhar number must be 12 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        try {
            setIsSubmitting(true);

            // Create FormData for file upload
            const formDataToSend = new FormData();
            
            // Append all form fields
            formDataToSend.append('name', formData.fullName.trim());
            formDataToSend.append('phone', formData.mobile.trim());
            formDataToSend.append('gender', formData.gender);
            
            if (formData.aadharNumber.trim()) {
                formDataToSend.append('aadhaarNumber', formData.aadharNumber.trim());
            }
            
            formDataToSend.append('address', formData.address.trim());
            formDataToSend.append('state', formData.state);
            
            if (formData.district.trim()) {
                formDataToSend.append('district', formData.district.trim());
            }
            
            if (formData.pincode.trim()) {
                formDataToSend.append('pincode', formData.pincode.trim());
            }
            
            if (formData.village.trim()) {
                formDataToSend.append('town', formData.village.trim());
            }
            
            if (formData.bankName.trim()) {
                formDataToSend.append('bankName', formData.bankName.trim());
            }
            
            if (formData.accountNumber.trim()) {
                formDataToSend.append('accountNumber', formData.accountNumber.trim());
            }
            
            if (formData.ifscCode.trim()) {
                formDataToSend.append('ifscCode', formData.ifscCode.trim());
            }
            
            if (formData.upiId.trim()) {
                formDataToSend.append('upiId', formData.upiId.trim());
            }
            
            // Append files only if they exist
            if (formData.profilePhoto) {
                formDataToSend.append('profileImg', formData.profilePhoto);
            }

            // Make API call
            const response = await api.post(Endpoints.CREATE_SELLER, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                // Show success toast
                toast.success(response.data.message || 'Seller registered successfully!');
                
                // Reset form
                setFormData({
                    fullName: '',
                    mobile: '',
                    gender: '',
                    profilePhoto: null,
                    aadharNumber: '',
                    address: '',
                    state: '',
                    district: '',
                    pincode: '',
                    village: '',
                    bankName: '',
                    accountNumber: '',
                    ifscCode: '',
                    upiId: ''
                });
                setErrors({});
                
                // Navigate to sellers list page after a short delay
                setTimeout(() => {
                    navigate(PATHROUTES.sellersList);
                }, 1500);
                
            } else {
                // Handle API error messages
                const errorMessage = response.data.message || 'Failed to register seller';
                toast.error(errorMessage);
                
                // Set specific field errors based on error message
                if (errorMessage.toLowerCase().includes('phone') || errorMessage.toLowerCase().includes('mobile')) {
                    setErrors(prev => ({ ...prev, mobile: 'This phone number is already registered' }));
                } else if (errorMessage.toLowerCase().includes('aadhaar')) {
                    setErrors(prev => ({ ...prev, aadharNumber: 'This Aadhaar number is already registered' }));
                }
            }
        } catch (error) {
            console.error('Error registering seller:', error);
            
            // Handle different error types
            let errorMessage = 'An unexpected error occurred. Please try again.';
            
            if (error.response) {
                // Server responded with error status
                errorMessage = error.response.data?.message || 'Server error occurred';
                
                // Set specific field errors based on error message
                if (errorMessage.toLowerCase().includes('phone') || errorMessage.toLowerCase().includes('mobile')) {
                    setErrors(prev => ({ ...prev, mobile: 'This phone number is already registered' }));
                } else if (errorMessage.toLowerCase().includes('aadhaar')) {
                    setErrors(prev => ({ ...prev, aadharNumber: 'This Aadhaar number is already registered' }));
                }
            } else if (error.request) {
                // Request was made but no response
                errorMessage = 'Network error. Please check your connection.';
            }
            
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toaster Component */}
            <Toaster
                position="top-center"
                toastOptions={{
                    style: { background: "#363636", color: "#fff" },
                    success: { style: { background: "#10b981" } },
                    error: { style: { background: "#ef4444" } },
                    duration: 3000,
                }}
            />
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Seller Registration</h1>
                <p className="text-gray-600">Register new seller for animal procurement</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Details Card */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
                    </div>

                    {/* Profile Photo Section - Center Top */}
                    <div className="mb-8 flex flex-col items-center justify-center">
                        <div className="relative w-32 h-32 mb-4">
                            <div className="w-full h-full rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                                {formData.profilePhoto ? (
                                    <img
                                        src={URL.createObjectURL(formData.profilePhoto)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-4">
                                        <Camera className="text-gray-400" size={40} />
                                        <p className="text-xs text-gray-500 mt-2 text-center">No Photo</p>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="profilePhoto"
                                className={`absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Camera size={18} />
                            </label>
                        </div>

                        <div className="text-center">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Photo
                            </label>
                            <input
                                type="file"
                                name="profilePhoto"
                                onChange={handleChange}
                                className="hidden"
                                id="profilePhoto"
                                accept=".jpg,.jpeg,.png"
                                disabled={isSubmitting}
                            />

                            {formData.profilePhoto && (
                                <p className="text-xs text-green-600 mt-2">✓ {formData.profilePhoto.name}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name - Mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                                placeholder="Enter full name"
                                disabled={isSubmitting}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Mobile Number - Mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className={`input-field pl-10 ${errors.mobile ? 'border-red-500' : ''}`}
                                    placeholder="Enter 10-digit mobile number"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.mobile && (
                                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                            )}
                        </div>

                        {/* Gender - Mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`input-field ${errors.gender ? 'border-red-500' : ''}`}
                                disabled={isSubmitting}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                            )}
                        </div>

                        {/* Aadhar Number - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aadhar Number
                            </label>
                            <input
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                                className={`input-field ${errors.aadharNumber ? 'border-red-500' : ''}`}
                                placeholder="Enter 12-digit Aadhar number"
                                disabled={isSubmitting}
                            />
                            {errors.aadharNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.aadharNumber}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Details Card */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <MapPin className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Address Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Complete Address - Mandatory */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Complete Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`input-field min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
                                placeholder="Enter complete address with landmarks"
                                disabled={isSubmitting}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                            )}
                        </div>

                        {/* State - Mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                                disabled={isSubmitting}
                            >
                                <option value="">Select State</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Punjab">Punjab</option>
                            </select>
                            {errors.state && (
                                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                            )}
                        </div>

                        {/* District - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                District
                            </label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter district"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* PIN Code - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                PIN Code
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className={`input-field ${errors.pincode ? 'border-red-500' : ''}`}
                                placeholder="Enter 6-digit PIN code"
                                disabled={isSubmitting}
                            />
                            {errors.pincode && (
                                <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                            )}
                        </div>

                        {/* Village/Town - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Village/Town
                            </label>
                            <input
                                type="text"
                                name="village"
                                value={formData.village}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter village/town"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                {/* Bank Details Card - All fields non-mandatory */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <CreditCard className="text-purple-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Bank Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bank Name - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name
                            </label>
                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter bank name"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Account Number - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number
                            </label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter account number"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* IFSC Code - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                IFSC Code
                            </label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter IFSC code"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* UPI ID - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                UPI ID
                            </label>
                            <input
                                type="text"
                                name="upiId"
                                value={formData.upiId}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter UPI ID"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </>
                        ) : (
                            'Register Seller'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerRegistration;