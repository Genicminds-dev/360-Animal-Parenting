import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Camera, Upload, FileText, X, Eye, File } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../services/api/api';
import { Endpoints } from '../../services/api/EndPoint';
import { PATHROUTES } from '../../routes/pathRoutes';

const AgentRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        aadharNumber: '',
        profilePhoto: null,
        aadharDocument: null
    });

    const [errors, setErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getDisplayFileName = (file) => {
        if (!file) return '';
        
        const extension = file.name.split('.').pop().toLowerCase();
        return `Aadhaar.${extension}`;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            
            // Clear previous preview
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            
            // If it's an image, set preview
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const removeAadharDocument = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setFormData(prev => ({ ...prev, aadharDocument: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
        }
        
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile Number is required';
        } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number must be 10 digits';
        }
        
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
            formDataToSend.append('name', formData.fullName.trim());
            formDataToSend.append('phone', formData.mobile.trim());
            
            if (formData.aadharNumber.trim()) {
                formDataToSend.append('aadhaarNumber', formData.aadharNumber.trim());
            }
            
            // Append files only if they exist
            if (formData.profilePhoto) {
                formDataToSend.append('profileImg', formData.profilePhoto);
            }
            
            if (formData.aadharDocument) {
                formDataToSend.append('aadhaarFile', formData.aadharDocument);
            }
            
            // Make API call without showing "Registering agent..." loading toast
            const response = await api.post(Endpoints.CREATE_AGENT, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.success) {
                // Show success toast
                toast.success(response.data.message || 'Agent registered successfully!');
                
                // Clean up preview URLs
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                
                // Reset form
                setFormData({
                    fullName: '',
                    mobile: '',
                    aadharNumber: '',
                    profilePhoto: null,
                    aadharDocument: null
                });
                setErrors({});
                setPreviewUrl(null);
                
                // Navigate to commission agents page after a short delay
                setTimeout(() => {
                    navigate(PATHROUTES.commissionAgents);
                }, 1500);
                
            } else {
                // Handle API error messages
                const errorMessage = response.data.message || 'Failed to register agent';
                toast.error(errorMessage);
                
                // Set specific field errors based on error message
                if (errorMessage.toLowerCase().includes('phone')) {
                    setErrors(prev => ({ ...prev, mobile: 'This phone number is already registered' }));
                } else if (errorMessage.toLowerCase().includes('aadhaar')) {
                    setErrors(prev => ({ ...prev, aadharNumber: 'This Aadhaar number is already registered' }));
                }
            }
        } catch (error) {
            console.error('Error registering agent:', error);
            
            // Handle different error types
            let errorMessage = 'An unexpected error occurred. Please try again.';
            
            if (error.response) {
                // Server responded with error status
                errorMessage = error.response.data?.message || 'Server error occurred';
                
                // Set specific field errors based on error message
                if (errorMessage.toLowerCase().includes('phone')) {
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

    const handleSaveDraft = () => {
        localStorage.setItem('agent_draft', JSON.stringify({
            ...formData,
            profilePhoto: null,
            aadharDocument: null
        }));
        toast.success('Saved as draft!');
    };

    const isPDF = (file) => {
        return file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    };

    const isImage = (file) => {
        return file && file.type.startsWith('image/');
    };

    const openDocument = () => {
        if (formData.aadharDocument) {
            if (isPDF(formData.aadharDocument)) {
                // Open PDF in new tab
                const pdfUrl = URL.createObjectURL(formData.aadharDocument);
                window.open(pdfUrl, '_blank');
            } else if (isImage(formData.aadharDocument)) {
                // For images, we already have previewUrl state
                if (previewUrl) {
                    window.open(previewUrl, '_blank');
                }
            }
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
            
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Agent Registration</h1>
                <p className="text-gray-600">Register new agent for animal procurement</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
                    </div>

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
                                    <User className="text-gray-400" size={40} />
                                    <p className="text-xs text-gray-500 mt-2 text-center">Add Photo</p>
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
                        
                        {formData.profilePhoto ? (
                            <p className="text-xs text-green-600 mt-2">✓ {formData.profilePhoto.name}</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-2">Upload profile photo</p>
                        )}
                    </div>
                </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <FileText className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Aadhar Document</h2>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="w-full max-w-2xl">
                            {formData.aadharDocument ? (
                                <div className="border-2 border-gray-300 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-3 rounded-lg ${
                                                isPDF(formData.aadharDocument) 
                                                    ? 'bg-red-100 text-red-600' 
                                                    : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {isPDF(formData.aadharDocument) ? (
                                                    <File size={24} />
                                                ) : (
                                                    <Camera size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {getDisplayFileName(formData.aadharDocument)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {isPDF(formData.aadharDocument) 
                                                        ? 'PDF Document' 
                                                        : `${Math.round(formData.aadharDocument.size / 1024)} KB`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={openDocument}
                                                className={`p-2 rounded-lg hover:opacity-90 transition-opacity ${
                                                    isPDF(formData.aadharDocument)
                                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                                }`}
                                                title={isPDF(formData.aadharDocument) ? "Open PDF" : "Preview Image"}
                                                disabled={isSubmitting}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={removeAadharDocument}
                                                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                title="Remove"
                                                disabled={isSubmitting}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {isImage(formData.aadharDocument) && previewUrl && (
                                        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="p-2 bg-gray-50 border-b border-gray-200">
                                                <p className="text-sm font-medium text-gray-700">Document Preview</p>
                                            </div>
                                            <div className="p-4 flex items-center justify-center bg-gray-50">
                                                <img 
                                                    src={previewUrl} 
                                                    alt="Aadhar Preview" 
                                                    className="max-w-full max-h-64 object-contain rounded"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {isPDF(formData.aadharDocument) && (
                                        <div className="mt-4 text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
                                            <File className="mx-auto text-red-400 mb-3" size={48} />
                                            <p className="text-sm text-gray-700 font-medium mb-2">
                                                {getDisplayFileName(formData.aadharDocument)}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Click the eye icon above to open this PDF document
                                            </p>
                                            <button
                                                type="button"
                                                onClick={openDocument}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                                disabled={isSubmitting}
                                            >
                                                Open {getDisplayFileName(formData.aadharDocument)}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                                    <div className="flex flex-col items-center justify-center">
                                        <Upload className="text-gray-400 mb-3" size={40} />
                                        <p className="text-sm text-gray-700 mb-2 font-medium">
                                            Upload Aadhar Document
                                        </p>
                                        <p className="text-xs text-gray-500 mb-4">
                                            Upload photo or PDF of Aadhar card
                                        </p>
                                        
                                        <label 
                                            htmlFor="aadharDocument"
                                            className={`px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            Browse File
                                        </label>
                                    </div>
                                </div>
                            )}
                            
                            <input
                                type="file"
                                name="aadharDocument"
                                onChange={handleChange}
                                className="hidden"
                                id="aadharDocument"
                                accept=".jpg,.jpeg,.png,.pdf"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            className={`px-6 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[120px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                'Register Agent'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AgentRegistration;