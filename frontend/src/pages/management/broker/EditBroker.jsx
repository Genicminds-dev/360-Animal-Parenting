import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { User, Phone, Camera, Upload, FileText, X, Eye, FileIcon, ArrowLeft, Save } from 'lucide-react';
import api, { baseURLFile } from "../../../services/api/api";
import { Endpoints } from "../../../services/api/EndPoint";
import { PATHROUTES } from "../../../routes/pathRoutes";

const EditBroker = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const location = useLocation();
    
    const [broker, setBroker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageError, setImageError] = useState({});
    
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        aadharNumber: '',
        profilePhoto: null,
        aadharDocument: null
    });
    
    const [errors, setErrors] = useState({});
    const [profilePreview, setProfilePreview] = useState(null);
    const [documentPreview, setDocumentPreview] = useState(null);
    const [existingFiles, setExistingFiles] = useState({
        profileImg: null,
        aadhaarFile: null
    });

    // Helper function to get full URL for files
    const getFullFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${baseURLFile}${path}`;
    };

    // Load broker data from API
    useEffect(() => {
        const loadBrokerData = async () => {
            setLoading(true);
            
            try {
                // Check if broker data was passed in state (from list page)
                if (location.state) {
                    const brokerData = location.state;
                    setBroker(brokerData);
                    
                    setFormData({
                        fullName: brokerData.fullName || '',
                        mobile: brokerData.mobile || '',
                        aadharNumber: brokerData.aadharNumber || '',
                        profilePhoto: null,
                        aadharDocument: null
                    });
                    
                    // Store existing file URLs separately
                    setExistingFiles({
                        profileImg: brokerData.profileImg || null,
                        aadhaarFile: brokerData.aadhaarFile || null
                    });
                    
                    // Set preview URLs from existing files with full URL
                    if (brokerData.profileImg) {
                        setProfilePreview(getFullFileUrl(brokerData.profileImg));
                    }
                    
                    if (brokerData.aadhaarFile) {
                        setDocumentPreview(getFullFileUrl(brokerData.aadhaarFile));
                    }
                } else if (uid) {
                    await fetchBrokerData(uid);
                } else {
                    toast.error("No broker ID provided");
                    navigate(PATHROUTES.brokerList);
                }
            } catch (error) {
                console.error("Error loading broker data:", error);
                toast.error("Failed to load broker details");
            } finally {
                setLoading(false);
            }
        };

        loadBrokerData();

        // Cleanup function for preview URLs
        return () => {
            if (profilePreview && profilePreview.startsWith('blob:')) {
                URL.revokeObjectURL(profilePreview);
            }
            if (documentPreview && documentPreview.startsWith('blob:')) {
                URL.revokeObjectURL(documentPreview);
            }
        };
    }, [uid, location.state, navigate]);

    // Fetch broker data from API
    const fetchBrokerData = async (brokerUid) => {
        try {
            const response = await api.get(Endpoints.GET_BROKER_BY_ID(brokerUid));
            
            if (response.data.success) {
                const brokerData = response.data.data;
                setBroker(brokerData);
                
                setFormData({
                    fullName: brokerData.name || '',
                    mobile: brokerData.phone || '',
                    aadharNumber: brokerData.aadhaarNumber || '',
                    profilePhoto: null,
                    aadharDocument: null
                });
                
                setExistingFiles({
                    profileImg: brokerData.profileImg || null,
                    aadhaarFile: brokerData.aadhaarFile || null
                });
                
                // Set preview URLs from existing files with full URL
                if (brokerData.profileImg) {
                    setProfilePreview(getFullFileUrl(brokerData.profileImg));
                }
                
                if (brokerData.aadhaarFile) {
                    setDocumentPreview(getFullFileUrl(brokerData.aadhaarFile));
                }
            } else {
                toast.error(response.data.message || "Broker not found");
                navigate(PATHROUTES.brokerList);
            }
        } catch (error) {
            console.error("Error fetching broker data:", error);
            toast.error(error?.response?.data?.message || "Failed to load broker details");
            navigate(PATHROUTES.brokerList);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size
        if (field === 'profilePhoto') {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Profile photo size should be less than 5MB");
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload a valid image file");
                return;
            }
        } else if (field === 'aadharDocument') {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Document size should be less than 10MB");
                return;
            }
        }

        // Update form data with actual file
        setFormData(prev => ({ ...prev, [field]: file }));

        // Create preview URL
        const url = URL.createObjectURL(file);
        
        if (field === 'profilePhoto') {
            // Clean up old preview URL
            if (profilePreview && profilePreview.startsWith('blob:')) {
                URL.revokeObjectURL(profilePreview);
            }
            setProfilePreview(url);
            // Clear image error
            setImageError(prev => ({ ...prev, profile: false }));
        } else if (field === 'aadharDocument') {
            // Clean up old preview URL
            if (documentPreview && documentPreview.startsWith('blob:')) {
                URL.revokeObjectURL(documentPreview);
            }
            setDocumentPreview(url);
            // Clear image error
            setImageError(prev => ({ ...prev, document: false }));
        }

        // Clear error if any
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const removeProfilePhoto = () => {
        // Clean up blob URL
        if (profilePreview && profilePreview.startsWith('blob:')) {
            URL.revokeObjectURL(profilePreview);
        }
        
        setProfilePreview(null);
        setFormData(prev => ({ ...prev, profilePhoto: null }));
        setExistingFiles(prev => ({ ...prev, profileImg: null }));
        setImageError(prev => ({ ...prev, profile: false }));
    };

    const removeAadharDocument = () => {
        // Clean up blob URL
        if (documentPreview && documentPreview.startsWith('blob:')) {
            URL.revokeObjectURL(documentPreview);
        }
        
        setDocumentPreview(null);
        setFormData(prev => ({ ...prev, aadharDocument: null }));
        setExistingFiles(prev => ({ ...prev, aadhaarFile: null }));
        setImageError(prev => ({ ...prev, document: false }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName?.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.mobile?.trim()) newErrors.mobile = 'Mobile Number is required';
        
        if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number must be 10 digits';
        }
        
        if (formData.aadharNumber && !/^[0-9]{12}$/.test(formData.aadharNumber)) {
            newErrors.aadharNumber = 'Aadhar number must be 12 digits';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isPDF = (file) => {
        if (!file) return false;
        
        if (file instanceof File) {
            return file.type === "application/pdf";
        }
        
        if (typeof file === "string") {
            return file.toLowerCase().includes('.pdf');
        }
        
        return false;
    };

    const isImage = (file) => {
        if (!file) return false;
        
        if (file instanceof File) {
            return file.type.startsWith("image/");
        }
        
        if (typeof file === "string") {
            return /\.(jpg|jpeg|png|gif)$/i.test(file);
        }
        
        return false;
    };

    const getFileName = () => {
        if (formData.aadharDocument instanceof File) {
            return formData.aadharDocument.name;
        }
        if (existingFiles.aadhaarFile) {
            const urlParts = existingFiles.aadhaarFile.split('/');
            return urlParts[urlParts.length - 1] || 'Aadhar Document.pdf';
        }
        return 'Aadhar Document.pdf';
    };

    const openDocument = () => {
        // If newly uploaded file
        if (formData.aadharDocument instanceof File) {
            const blobUrl = URL.createObjectURL(formData.aadharDocument);
            window.open(blobUrl, "_blank");
            return;
        }
        
        // If existing file URL - add base URL
        if (existingFiles.aadhaarFile) {
            const fullUrl = getFullFileUrl(existingFiles.aadhaarFile);
            window.open(fullUrl, "_blank");
        }
    };

    const handleImageError = (type) => {
        setImageError(prev => ({ ...prev, [type]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const formDataToSend = new FormData();
            
            // Append basic fields
            formDataToSend.append('name', formData.fullName);
            formDataToSend.append('phone', formData.mobile);
            
            // Only append aadhar number if it has value, otherwise send empty string to clear it
            formDataToSend.append('aadhaarNumber', formData.aadharNumber || '');
            
            // Handle profile photo
            if (formData.profilePhoto instanceof File) {
                // New file selected
                formDataToSend.append('profileImg', formData.profilePhoto);
            } else if (!existingFiles.profileImg) {
                // File was removed - send empty string to clear
                formDataToSend.append('profileImg', '');
            }
            
            // Handle aadhar document
            if (formData.aadharDocument instanceof File) {
                // New file selected
                formDataToSend.append('aadhaarFile', formData.aadharDocument);
            } else if (!existingFiles.aadhaarFile) {
                // File was removed - send empty string to clear
                formDataToSend.append('aadhaarFile', '');
            }
            
            // Send PUT request to update broker
            const response = await api.put(
                Endpoints.UPDATE_BROKER(uid),
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            if (response.data.success) {
                toast.success(response.data.message || 'Broker updated successfully!');
                
                // Clean up preview URLs
                if (profilePreview && profilePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(profilePreview);
                }
                if (documentPreview && documentPreview.startsWith('blob:')) {
                    URL.revokeObjectURL(documentPreview);
                }
                
                // Navigate back to broker list
                navigate(PATHROUTES.brokerList);
            } else {
                toast.error(response.data.message || "Failed to update broker");
            }
            
        } catch (error) {
            console.error("Error updating broker:", error);
            toast.error(error?.response?.data?.message || "Failed to update broker");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Clean up preview URLs
        if (profilePreview && profilePreview.startsWith('blob:')) {
            URL.revokeObjectURL(profilePreview);
        }
        if (documentPreview && documentPreview.startsWith('blob:')) {
            URL.revokeObjectURL(documentPreview);
        }
        
        navigate(PATHROUTES.brokerList);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Broker Details...</h3>
                    <p className="text-gray-500">Please wait while we fetch the broker information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCancel}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Broker Details</h1>
                        <p className="text-gray-600">Update broker details like name, contact information, and other basic details.</p>
                    </div>
                </div>

            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Details Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <User className="text-primary-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
                    </div>

                    {/* Profile Photo Section */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative w-32 h-32 mb-4">
                            <div className="w-full h-full rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                                {profilePreview && !imageError.profile ? (
                                    <img 
                                        src={profilePreview} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                        onError={() => handleImageError('profile')}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-4">
                                        <User className="text-gray-400" size={40} />
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            {profilePreview ? 'Failed to load' : 'No Photo'}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <label 
                                htmlFor="profilePhoto"
                                className={`absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Camera size={18} />
                            </label>
                            {profilePreview && (
                                <button
                                    type="button"
                                    onClick={removeProfilePhoto}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        
                        <div className="text-center">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Photo
                            </label>
                            <input
                                type="file"
                                name="profilePhoto"
                                onChange={(e) => handleFileChange(e, 'profilePhoto')}
                                className="hidden"
                                id="profilePhoto"
                                accept="image/*"
                                disabled={isSubmitting}
                            />
                            
                            {formData.profilePhoto instanceof File && (
                                <p className="text-xs text-green-600 mt-2">
                                    ✓ {formData.profilePhoto.name}
                                </p>
                            )}
                            {existingFiles.profileImg && !(formData.profilePhoto instanceof File) && !imageError.profile && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Current: {existingFiles.profileImg.split('/').pop()}
                                </p>
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
                                className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
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
                                    className={`w-full pl-10 px-4 py-2 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
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
                                className={`w-full px-4 py-2 border ${errors.aadharNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                placeholder="Enter 12-digit Aadhar number"
                                disabled={isSubmitting}
                            />
                            {errors.aadharNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.aadharNumber}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Aadhar Document Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <FileText className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Aadhar Document</h2>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="w-full max-w-2xl">
                            {(formData.aadharDocument || existingFiles.aadhaarFile) ? (
                                <div className="border-2 border-gray-300 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-3 rounded-lg ${
                                                isPDF(formData.aadharDocument || existingFiles.aadhaarFile) 
                                                    ? 'bg-red-100 text-red-600' 
                                                    : 'bg-primary-100 text-primary-600'
                                            }`}>
                                                {isPDF(formData.aadharDocument || existingFiles.aadhaarFile) ? (
                                                    <FileIcon size={24} />
                                                ) : (
                                                    <Camera size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 break-all max-w-xs">
                                                    {getFileName()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {isPDF(formData.aadharDocument || existingFiles.aadhaarFile) 
                                                        ? 'PDF Document' 
                                                        : 'Image Document'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={openDocument}
                                                className={`p-2 rounded-lg hover:opacity-90 transition-opacity ${
                                                    isPDF(formData.aadharDocument || existingFiles.aadhaarFile)
                                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                        : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                                                }`}
                                                title={isPDF(formData.aadharDocument || existingFiles.aadhaarFile) ? "Open PDF" : "Preview Image"}
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
                                    
                                    {/* Show preview for images */}
                                    {isImage(formData.aadharDocument || existingFiles.aadhaarFile) && 
                                     documentPreview && 
                                     !imageError.document && (
                                        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="p-2 bg-gray-50 border-b border-gray-200">
                                                <p className="text-sm font-medium text-gray-700">Document Preview</p>
                                            </div>
                                            <div className="p-4 flex items-center justify-center bg-gray-50">
                                                <img 
                                                    src={documentPreview} 
                                                    alt="Aadhar Preview" 
                                                    className="max-w-full max-h-64 object-contain rounded"
                                                    onError={() => setImageError(prev => ({ ...prev, document: true }))}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Show error message if image failed to load */}
                                    {isImage(formData.aadharDocument || existingFiles.aadhaarFile) && 
                                     imageError.document && (
                                        <div className="mt-4 text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
                                            <Camera className="mx-auto text-gray-400 mb-3" size={48} />
                                            <p className="text-sm text-gray-700 font-medium mb-2">
                                                Failed to load image preview
                                            </p>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Click the eye icon above to view the document
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Show PDF info */}
                                    {isPDF(formData.aadharDocument || existingFiles.aadhaarFile) && (
                                        <div className="mt-4 text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
                                            <FileIcon className="mx-auto text-red-400 mb-3" size={48} />
                                            <p className="text-sm text-gray-700 font-medium mb-2">
                                                {getFileName()}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Click the eye icon above to open this PDF document
                                            </p>
                                        </div>
                                    )}
                                    
                                    <p className="text-xs text-gray-500 mt-2">
                                        Upload a new file to replace existing document. Click remove to delete.
                                    </p>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                                    <div className="flex flex-col items-center justify-center">
                                        <Upload className="text-gray-400 mb-3" size={40} />
                                        <p className="text-sm text-gray-700 mb-2 font-medium">
                                            Upload Aadhar Document
                                        </p>
                                        <p className="text-xs text-gray-500 mb-4">
                                            Upload photo or PDF of Aadhar card (Max 10MB)
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
                                onChange={(e) => handleFileChange(e, 'aadharDocument')}
                                className="hidden"
                                id="aadharDocument"
                                accept=".jpg,.jpeg,.png,.pdf"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Update Broker
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBroker;