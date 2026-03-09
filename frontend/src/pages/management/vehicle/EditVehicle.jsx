import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
    Camera, X, ChevronDown, Save, ArrowLeft, Truck, User, Users, Phone, IdCard, CreditCard, Upload, Eye, Image as ImageIcon, Video, File
} from 'lucide-react';
import { PATHROUTES } from '../../../routes/pathRoutes';
import api from '../../../services/api/api';
import { Endpoints } from '../../../services/api/EndPoint';

const EditVehicle = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const vehicleData = location.state || {};

    const [formData, setFormData] = useState({
        // Vehicle Details
        vehicleType: vehicleData.vehicleType || '',
        vehicleNumber: vehicleData.vehicleNumber || '',
        vehicleSize: vehicleData.vehicleSize || '',

        // Driver Details
        driverName: vehicleData.driverName || '',
        driverMobile: vehicleData.driverMobile || '',
        driverAadhar: vehicleData.driverAadhar || '',
        driverDL: vehicleData.driverDL || '',

        // Helper Details
        helperName: vehicleData.helperName || '',
        helperMobile: vehicleData.helperMobile || '',
        helperAadhar: vehicleData.helperAadhar || '',

        // Existing media flags
        existingVehiclePhoto: vehicleData.vehiclePhotoUrl || '',
        existingVehicleVideo: vehicleData.vehicleVideoUrl || '',
        existingRcDocument: vehicleData.rcDocumentUrl || '',
        existingInsuranceDocument: vehicleData.insuranceDocumentUrl || '',
        existingDriverPhoto: vehicleData.driverPhotoUrl || '',
        existingHelperPhoto: vehicleData.helperPhotoUrl || '',

        // New media
        vehiclePhoto: null,
        vehicleVideo: null,
        rcDocument: null,
        insuranceDocument: null,
        driverPhoto: null,
        helperPhoto: null
    });

    const [removeExisting, setRemoveExisting] = useState({
        vehiclePhoto: false,
        vehicleVideo: false,
        rcDocument: false,
        insuranceDocument: false,
        driverPhoto: false,
        helperPhoto: false
    });

    const [errors, setErrors] = useState({});
    const [vehicleTypeDropdownOpen, setVehicleTypeDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Media previews
    const [vehiclePhotoPreview, setVehiclePhotoPreview] = useState(null);
    const [vehicleVideoPreview, setVehicleVideoPreview] = useState(null);
    const [rcDocumentPreview, setRcDocumentPreview] = useState(null);
    const [insuranceDocumentPreview, setInsuranceDocumentPreview] = useState(null);
    const [driverPhotoPreview, setDriverPhotoPreview] = useState(null);
    const [helperPhotoPreview, setHelperPhotoPreview] = useState(null);

    const vehicleTypeRef = useRef(null);

    const vehicleTypes = [
        "Ambulance",
        "Animal Transport Van",
        "Pickup Truck",
        "Cattle Carrier",
        "Small Van",
        "Large Truck",
        "Refrigerated Van",
        "Other"
    ];

    useEffect(() => {
        return () => {
            // Clean up all preview URLs
            [vehiclePhotoPreview, vehicleVideoPreview, rcDocumentPreview,
                insuranceDocumentPreview, driverPhotoPreview, helperPhotoPreview].forEach(preview => {
                    if (preview && preview.startsWith('blob:')) {
                        URL.revokeObjectURL(preview);
                    }
                });
        };
    }, [vehiclePhotoPreview, vehicleVideoPreview, rcDocumentPreview,
        insuranceDocumentPreview, driverPhotoPreview, helperPhotoPreview]);

    useEffect(() => {
        if (!vehicleData || Object.keys(vehicleData).length === 0) {
            toast.error('No vehicle data found');
            navigate(PATHROUTES.vehiclesList);
        }
    }, [vehicleData, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (vehicleTypeRef.current && !vehicleTypeRef.current.contains(event.target)) {
                setVehicleTypeDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Validation for specific fields
        if (name === 'driverMobile' || name === 'helperMobile') {
            if (value.length > 10) return;
            if (value && !/^\d*$/.test(value)) return;
        }

        if (name === 'driverAadhar' || name === 'helperAadhar') {
            if (value.length > 12) return;
            if (value && !/^\d*$/.test(value)) return;
        }

        if (name === 'vehicleSize') {
            if (value && !/^\d*\.?\d*$/.test(value)) return;
        }

        if (name === 'vehicleNumber') {
            setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
        } else if (files && files[0]) {
            handleFileUpload(name, files[0]);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileUpload = (fieldName, file) => {
        // Validate file type based on field
        if (fieldName.includes('Photo') && !file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (fieldName === 'vehicleVideo' && !file.type.startsWith('video/')) {
            toast.error('Please select a video file');
            return;
        }
        if ((fieldName === 'rcDocument' || fieldName === 'insuranceDocument') &&
            !file.type.includes('pdf') && !file.type.includes('image/')) {
            toast.error('Please select a PDF or image file');
            return;
        }

        setFormData(prev => ({ ...prev, [fieldName]: file }));
        setRemoveExisting(prev => ({ ...prev, [fieldName]: false }));

        // Set preview based on field
        switch (fieldName) {
            case 'vehiclePhoto':
                if (vehiclePhotoPreview) URL.revokeObjectURL(vehiclePhotoPreview);
                setVehiclePhotoPreview(URL.createObjectURL(file));
                break;
            case 'vehicleVideo':
                if (vehicleVideoPreview) URL.revokeObjectURL(vehicleVideoPreview);
                setVehicleVideoPreview(URL.createObjectURL(file));
                break;
            case 'rcDocument':
                if (file.type.startsWith('image/')) {
                    if (rcDocumentPreview) URL.revokeObjectURL(rcDocumentPreview);
                    setRcDocumentPreview(URL.createObjectURL(file));
                }
                break;
            case 'insuranceDocument':
                if (file.type.startsWith('image/')) {
                    if (insuranceDocumentPreview) URL.revokeObjectURL(insuranceDocumentPreview);
                    setInsuranceDocumentPreview(URL.createObjectURL(file));
                }
                break;
            case 'driverPhoto':
                if (driverPhotoPreview) URL.revokeObjectURL(driverPhotoPreview);
                setDriverPhotoPreview(URL.createObjectURL(file));
                break;
            case 'helperPhoto':
                if (helperPhotoPreview) URL.revokeObjectURL(helperPhotoPreview);
                setHelperPhotoPreview(URL.createObjectURL(file));
                break;
        }
    };

    const handleVehicleTypeSelect = (type) => {
        setFormData(prev => ({ ...prev, vehicleType: type }));
        setVehicleTypeDropdownOpen(false);

        if (errors.vehicleType) {
            setErrors(prev => ({ ...prev, vehicleType: '' }));
        }
    };

    const removeMedia = (type) => {
        setFormData(prev => ({ ...prev, [type]: null }));
        setRemoveExisting(prev => ({ ...prev, [type]: true }));

        switch (type) {
            case 'vehiclePhoto':
                if (vehiclePhotoPreview) {
                    URL.revokeObjectURL(vehiclePhotoPreview);
                    setVehiclePhotoPreview(null);
                }
                break;
            case 'vehicleVideo':
                if (vehicleVideoPreview) {
                    URL.revokeObjectURL(vehicleVideoPreview);
                    setVehicleVideoPreview(null);
                }
                break;
            case 'rcDocument':
                if (rcDocumentPreview) {
                    URL.revokeObjectURL(rcDocumentPreview);
                    setRcDocumentPreview(null);
                }
                break;
            case 'insuranceDocument':
                if (insuranceDocumentPreview) {
                    URL.revokeObjectURL(insuranceDocumentPreview);
                    setInsuranceDocumentPreview(null);
                }
                break;
            case 'driverPhoto':
                if (driverPhotoPreview) {
                    URL.revokeObjectURL(driverPhotoPreview);
                    setDriverPhotoPreview(null);
                }
                break;
            case 'helperPhoto':
                if (helperPhotoPreview) {
                    URL.revokeObjectURL(helperPhotoPreview);
                    setHelperPhotoPreview(null);
                }
                break;
        }
    };

    const getDisplayFileName = (file, type) => {
        if (!file) return '';
        const extension = file.name.split('.').pop().toLowerCase();
        return `${type}.${extension}`;
    };

    const openMedia = (type, url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Vehicle Details
        if (!formData.vehicleType) {
            newErrors.vehicleType = 'Vehicle type is required';
        }

        if (!formData.vehicleNumber.trim()) {
            newErrors.vehicleNumber = 'Vehicle number is required';
        } else if (!/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/.test(formData.vehicleNumber.replace(/\s/g, ''))) {
            newErrors.vehicleNumber = 'Enter valid vehicle number (e.g., MH12AB1234)';
        }

        if (!formData.vehicleSize) {
            newErrors.vehicleSize = 'Vehicle size is required';
        } else if (parseFloat(formData.vehicleSize) <= 0) {
            newErrors.vehicleSize = 'Vehicle size must be greater than 0';
        }

        // Driver Details
        if (!formData.driverName.trim()) {
            newErrors.driverName = 'Driver name is required';
        }

        if (!formData.driverMobile) {
            newErrors.driverMobile = 'Driver mobile number is required';
        } else if (!/^\d{10}$/.test(formData.driverMobile)) {
            newErrors.driverMobile = 'Mobile number must be 10 digits';
        }

        if (!formData.driverAadhar) {
            newErrors.driverAadhar = 'Driver Aadhar number is required';
        } else if (!/^\d{12}$/.test(formData.driverAadhar)) {
            newErrors.driverAadhar = 'Aadhar number must be 12 digits';
        }

        if (!formData.driverDL.trim()) {
            newErrors.driverDL = 'Driver license number is required';
        }

        // Helper Details (Optional)
        if (formData.helperName && !formData.helperMobile) {
            newErrors.helperMobile = 'Helper mobile is required if name is provided';
        }
        if (formData.helperMobile && !/^\d{10}$/.test(formData.helperMobile)) {
            newErrors.helperMobile = 'Helper mobile must be 10 digits';
        }
        if (formData.helperAadhar && !/^\d{12}$/.test(formData.helperAadhar)) {
            newErrors.helperAadhar = 'Helper Aadhar must be 12 digits';
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

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            // Append basic fields
            formDataToSend.append('uid', vehicleData.uid || id);
            formDataToSend.append('vehicleType', formData.vehicleType);
            formDataToSend.append('vehicleNumber', formData.vehicleNumber);
            formDataToSend.append('vehicleSize', formData.vehicleSize);
            formDataToSend.append('driverName', formData.driverName);
            formDataToSend.append('driverMobile', formData.driverMobile);
            formDataToSend.append('driverAadhar', formData.driverAadhar);
            formDataToSend.append('driverDL', formData.driverDL);
            formDataToSend.append('helperName', formData.helperName || '');
            formDataToSend.append('helperMobile', formData.helperMobile || '');
            formDataToSend.append('helperAadhar', formData.helperAadhar || '');

            // Handle new media
            if (formData.vehiclePhoto) {
                formDataToSend.append('vehiclePhoto', formData.vehiclePhoto);
            } else if (removeExisting.vehiclePhoto) {
                formDataToSend.append('removeVehiclePhoto', 'true');
            }

            if (formData.vehicleVideo) {
                formDataToSend.append('vehicleVideo', formData.vehicleVideo);
            } else if (removeExisting.vehicleVideo) {
                formDataToSend.append('removeVehicleVideo', 'true');
            }

            if (formData.rcDocument) {
                formDataToSend.append('rcDocument', formData.rcDocument);
            } else if (removeExisting.rcDocument) {
                formDataToSend.append('removeRcDocument', 'true');
            }

            if (formData.insuranceDocument) {
                formDataToSend.append('insuranceDocument', formData.insuranceDocument);
            } else if (removeExisting.insuranceDocument) {
                formDataToSend.append('removeInsuranceDocument', 'true');
            }

            if (formData.driverPhoto) {
                formDataToSend.append('driverPhoto', formData.driverPhoto);
            } else if (removeExisting.driverPhoto) {
                formDataToSend.append('removeDriverPhoto', 'true');
            }

            if (formData.helperPhoto) {
                formDataToSend.append('helperPhoto', formData.helperPhoto);
            } else if (removeExisting.helperPhoto) {
                formDataToSend.append('removeHelperPhoto', 'true');
            }

            // Make API call
            const response = await api.put(
                `${Endpoints.UPDATE_VEHICLE}/${vehicleData.uid || id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Vehicle updated successfully!');

                // Clean up previews
                [vehiclePhotoPreview, vehicleVideoPreview, rcDocumentPreview,
                    insuranceDocumentPreview, driverPhotoPreview, helperPhotoPreview].forEach(preview => {
                        if (preview && preview.startsWith('blob:')) {
                            URL.revokeObjectURL(preview);
                        }
                    });

                setTimeout(() => {
                    navigate(PATHROUTES.vehiclesList);
                }, 1500);
            } else {
                toast.error(response.data.message || 'Failed to update vehicle');
            }
        } catch (error) {
            console.error('Error updating vehicle:', error);

            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error.response) {
                errorMessage = error.response.data?.message || 'Server error occurred';
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(PATHROUTES.vehiclesList);
    };

    const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

    // Helper function to check if media exists
    const hasExistingMedia = (type) => {
        if (!type) return false;

        switch (type) {
            case 'vehiclePhoto':
                return formData.existingVehiclePhoto && !removeExisting.vehiclePhoto && !formData.vehiclePhoto;
            case 'vehicleVideo':
                return formData.existingVehicleVideo && !removeExisting.vehicleVideo && !formData.vehicleVideo;
            case 'rcDocument':
                return formData.existingRcDocument && !removeExisting.rcDocument && !formData.rcDocument;
            case 'insuranceDocument':
                return formData.existingInsuranceDocument && !removeExisting.insuranceDocument && !formData.insuranceDocument;
            case 'driverPhoto':
                return formData.existingDriverPhoto && !removeExisting.driverPhoto && !formData.driverPhoto;
            case 'helperPhoto':
                return formData.existingHelperPhoto && !removeExisting.helperPhoto && !formData.helperPhoto;
            default:
                return false;
        }
    };

    const getExistingMediaUrl = (type) => {
        switch (type) {
            case 'vehiclePhoto':
                return formData.existingVehiclePhoto;
            case 'vehicleVideo':
                return formData.existingVehicleVideo;
            case 'rcDocument':
                return formData.existingRcDocument;
            case 'insuranceDocument':
                return formData.existingInsuranceDocument;
            case 'driverPhoto':
                return formData.existingDriverPhoto;
            case 'helperPhoto':
                return formData.existingHelperPhoto;
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleCancel}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                    disabled={isSubmitting}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Vehicle</h1>
                    <p className="text-gray-600 dark:text-gray-400">Update vehicle information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Vehicle Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                            <Truck className="text-primary-600 dark:text-primary-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vehicle Type */}
                        <div className="relative" ref={vehicleTypeRef}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vehicle Type <RequiredStar />
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    readOnly
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                        errors.vehicleType 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="Select vehicle type"
                                    onClick={() => !isSubmitting && setVehicleTypeDropdownOpen(!vehicleTypeDropdownOpen)}
                                    disabled={isSubmitting}
                                />
                                <ChevronDown
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 ${!isSubmitting ? 'cursor-pointer' : 'opacity-50'}`}
                                    size={20}
                                    onClick={() => !isSubmitting && setVehicleTypeDropdownOpen(!vehicleTypeDropdownOpen)}
                                />

                                {vehicleTypeDropdownOpen && !isSubmitting && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/30 max-h-60 overflow-y-auto">
                                        {vehicleTypes.map((type, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-gray-900 dark:text-white"
                                                onClick={() => handleVehicleTypeSelect(type)}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.vehicleType && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.vehicleType}</p>
                            )}
                        </div>

                        {/* Vehicle Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vehicle Number <RequiredStar />
                            </label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                    errors.vehicleNumber 
                                        ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                                placeholder="e.g., MH12AB1234"
                                disabled={isSubmitting}
                            />
                            {errors.vehicleNumber && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.vehicleNumber}</p>
                            )}
                        </div>

                        {/* Vehicle Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vehicle Size (in tons) <RequiredStar />
                            </label>
                            <input
                                type="number"
                                name="vehicleSize"
                                value={formData.vehicleSize}
                                onChange={handleChange}
                                step="0.1"
                                min="0.1"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                    errors.vehicleSize 
                                        ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                                placeholder="e.g., 2.5"
                                disabled={isSubmitting}
                            />
                            {errors.vehicleSize && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.vehicleSize}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Driver Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <User className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Driver Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Driver Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Driver Name <RequiredStar />
                            </label>
                            <input
                                type="text"
                                name="driverName"
                                value={formData.driverName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                    errors.driverName 
                                        ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                                placeholder="Enter driver's full name"
                                disabled={isSubmitting}
                            />
                            {errors.driverName && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.driverName}</p>
                            )}
                        </div>

                        {/* Driver Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mobile Number <RequiredStar />
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="driverMobile"
                                    value={formData.driverMobile}
                                    onChange={handleChange}
                                    maxLength={10}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                        errors.driverMobile 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="10-digit mobile number"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.driverMobile && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.driverMobile}</p>
                            )}
                        </div>

                        {/* Driver Aadhar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Aadhar Number <RequiredStar />
                            </label>
                            <div className="relative">
                                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="driverAadhar"
                                    value={formData.driverAadhar}
                                    onChange={handleChange}
                                    maxLength={12}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                        errors.driverAadhar 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="12-digit Aadhar number"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.driverAadhar && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.driverAadhar}</p>
                            )}
                        </div>

                        {/* Driver License */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Driving License Number <RequiredStar />
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="driverDL"
                                    value={formData.driverDL}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                        errors.driverDL 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="Enter driving license number"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.driverDL && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.driverDL}</p>
                            )}
                        </div>

                        {/* Driver Photo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Driver Photo
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full">
                                    {formData.driverPhoto || hasExistingMedia('driverPhoto') ? (
                                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-3 rounded-lg ${
                                                        formData.driverPhoto 
                                                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        <ImageIcon size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white break-all max-w-xs">
                                                            {formData.driverPhoto
                                                                ? getDisplayFileName(formData.driverPhoto, 'driver_photo')
                                                                : 'Existing Driver Photo'
                                                            }
                                                        </p>
                                                        {formData.driverPhoto && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {Math.round(formData.driverPhoto.size / 1024)} KB
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openMedia('driverPhoto', driverPhotoPreview || getExistingMediaUrl('driverPhoto'))}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            formData.driverPhoto || driverPhotoPreview
                                                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                        title="Preview"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedia('driverPhoto')}
                                                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        title="Remove"
                                                        disabled={isSubmitting}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {(driverPhotoPreview || (hasExistingMedia('driverPhoto') && !driverPhotoPreview)) && (
                                                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Photo Preview</p>
                                                    </div>
                                                    <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                        <img
                                                            src={driverPhotoPreview || getExistingMediaUrl('driverPhoto')}
                                                            alt="Driver Preview"
                                                            className="max-w-full max-h-64 object-contain rounded"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                                            <div className="flex flex-col items-center justify-center">
                                                <Upload className="text-gray-400 dark:text-gray-500 mb-3" size={40} />
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                                    Upload Driver Photo
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                    Upload a clear photo of the driver
                                                </p>

                                                <label
                                                    htmlFor="driverPhotoUpload"
                                                    className={`px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Browse File
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="driverPhoto"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="driverPhotoUpload"
                                        accept=".jpg,.jpeg,.png"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Helper Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <Users className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Helper Details</h2>
                        <span className="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Helper Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Helper Name
                            </label>
                            <input
                                type="text"
                                name="helperName"
                                value={formData.helperName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white"
                                placeholder="Enter helper's full name"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Helper Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="helperMobile"
                                    value={formData.helperMobile}
                                    onChange={handleChange}
                                    maxLength={10}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                        errors.helperMobile 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="10-digit mobile number"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.helperMobile && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.helperMobile}</p>
                            )}
                        </div>

                        {/* Helper Aadhar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Aadhar Number
                            </label>
                            <div className="relative">
                                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="helperAadhar"
                                    value={formData.helperAadhar}
                                    onChange={handleChange}
                                    maxLength={12}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                        errors.helperAadhar 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="12-digit Aadhar number"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.helperAadhar && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.helperAadhar}</p>
                            )}
                        </div>

                        {/* Helper Photo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Helper Photo
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full">
                                    {formData.helperPhoto || hasExistingMedia('helperPhoto') ? (
                                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-3 rounded-lg ${
                                                        formData.helperPhoto 
                                                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        <ImageIcon size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white break-all max-w-xs">
                                                            {formData.helperPhoto
                                                                ? getDisplayFileName(formData.helperPhoto, 'helper_photo')
                                                                : 'Existing Helper Photo'
                                                            }
                                                        </p>
                                                        {formData.helperPhoto && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {Math.round(formData.helperPhoto.size / 1024)} KB
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openMedia('helperPhoto', helperPhotoPreview || getExistingMediaUrl('helperPhoto'))}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            formData.helperPhoto || helperPhotoPreview
                                                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                        title="Preview"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedia('helperPhoto')}
                                                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        title="Remove"
                                                        disabled={isSubmitting}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {(helperPhotoPreview || (hasExistingMedia('helperPhoto') && !helperPhotoPreview)) && (
                                                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Photo Preview</p>
                                                    </div>
                                                    <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                        <img
                                                            src={helperPhotoPreview || getExistingMediaUrl('helperPhoto')}
                                                            alt="Helper Preview"
                                                            className="max-w-full max-h-64 object-contain rounded"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                                            <div className="flex flex-col items-center justify-center">
                                                <Upload className="text-gray-400 dark:text-gray-500 mb-3" size={40} />
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                                    Upload Helper Photo
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                    Upload a clear photo of the helper
                                                </p>

                                                <label
                                                    htmlFor="helperPhotoUpload"
                                                    className={`px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Browse File
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="helperPhoto"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="helperPhotoUpload"
                                        accept=".jpg,.jpeg,.png"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <File className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Documents</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* RC Document */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                RC Document
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full">
                                    {formData.rcDocument || hasExistingMedia('rcDocument') ? (
                                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-3 rounded-lg ${
                                                        formData.rcDocument 
                                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        <File size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white break-all max-w-xs">
                                                            {formData.rcDocument
                                                                ? getDisplayFileName(formData.rcDocument, 'rc')
                                                                : 'Existing RC Document'
                                                            }
                                                        </p>
                                                        {formData.rcDocument && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {Math.round(formData.rcDocument.size / 1024)} KB
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia('rcDocument')}
                                                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    title="Remove"
                                                    disabled={isSubmitting}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                                            <div className="flex flex-col items-center justify-center">
                                                <Upload className="text-gray-400 dark:text-gray-500 mb-3" size={40} />
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                                    Upload RC Document
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                    Upload PDF or image of RC
                                                </p>

                                                <label
                                                    htmlFor="rcDocumentUpload"
                                                    className={`px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Browse File
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="rcDocument"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="rcDocumentUpload"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Insurance Document */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Insurance Document
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full">
                                    {formData.insuranceDocument || hasExistingMedia('insuranceDocument') ? (
                                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-3 rounded-lg ${
                                                        formData.insuranceDocument 
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        <File size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white break-all max-w-xs">
                                                            {formData.insuranceDocument
                                                                ? getDisplayFileName(formData.insuranceDocument, 'insurance')
                                                                : 'Existing Insurance Document'
                                                            }
                                                        </p>
                                                        {formData.insuranceDocument && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {Math.round(formData.insuranceDocument.size / 1024)} KB
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia('insuranceDocument')}
                                                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    title="Remove"
                                                    disabled={isSubmitting}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                                            <div className="flex flex-col items-center justify-center">
                                                <Upload className="text-gray-400 dark:text-gray-500 mb-3" size={40} />
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                                    Upload Insurance Document
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                    Upload PDF or image of Insurance
                                                </p>

                                                <label
                                                    htmlFor="insuranceDocumentUpload"
                                                    className={`px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Browse File
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="insuranceDocument"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="insuranceDocumentUpload"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicle Media Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                            <Camera className="text-orange-600 dark:text-orange-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Media</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vehicle Photo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Vehicle Photo
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full">
                                    {formData.vehiclePhoto || hasExistingMedia('vehiclePhoto') ? (
                                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-3 rounded-lg ${
                                                        formData.vehiclePhoto 
                                                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        <ImageIcon size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white break-all max-w-xs">
                                                            {formData.vehiclePhoto
                                                                ? getDisplayFileName(formData.vehiclePhoto, 'vehicle_photo')
                                                                : 'Existing Vehicle Photo'
                                                            }
                                                        </p>
                                                        {formData.vehiclePhoto && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {Math.round(formData.vehiclePhoto.size / 1024)} KB
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openMedia('vehiclePhoto', vehiclePhotoPreview || getExistingMediaUrl('vehiclePhoto'))}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            formData.vehiclePhoto || vehiclePhotoPreview
                                                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                        title="Preview"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedia('vehiclePhoto')}
                                                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        title="Remove"
                                                        disabled={isSubmitting}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {(vehiclePhotoPreview || (hasExistingMedia('vehiclePhoto') && !vehiclePhotoPreview)) && (
                                                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Photo Preview</p>
                                                    </div>
                                                    <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                        <img
                                                            src={vehiclePhotoPreview || getExistingMediaUrl('vehiclePhoto')}
                                                            alt="Vehicle Preview"
                                                            className="max-w-full max-h-64 object-contain rounded"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                                            <div className="flex flex-col items-center justify-center">
                                                <Upload className="text-gray-400 dark:text-gray-500 mb-3" size={40} />
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                                    Upload Vehicle Photo
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                    Upload photo of the vehicle
                                                </p>

                                                <label
                                                    htmlFor="vehiclePhotoUpload"
                                                    className={`px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Browse File
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="vehiclePhoto"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="vehiclePhotoUpload"
                                        accept=".jpg,.jpeg,.png"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Video */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Vehicle Video
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full">
                                    {formData.vehicleVideo || hasExistingMedia('vehicleVideo') ? (
                                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-3 rounded-lg ${
                                                        formData.vehicleVideo 
                                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        <Video size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white break-all max-w-xs">
                                                            {formData.vehicleVideo
                                                                ? getDisplayFileName(formData.vehicleVideo, 'vehicle_video')
                                                                : 'Existing Vehicle Video'
                                                            }
                                                        </p>
                                                        {formData.vehicleVideo && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {Math.round(formData.vehicleVideo.size / 1024)} KB
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openMedia('vehicleVideo', vehicleVideoPreview || getExistingMediaUrl('vehicleVideo'))}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            formData.vehicleVideo || vehicleVideoPreview
                                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                        title="Play"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedia('vehicleVideo')}
                                                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        title="Remove"
                                                        disabled={isSubmitting}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {(vehicleVideoPreview || (hasExistingMedia('vehicleVideo') && !vehicleVideoPreview)) && (
                                                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Preview</p>
                                                    </div>
                                                    <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                        <video
                                                            src={vehicleVideoPreview || getExistingMediaUrl('vehicleVideo')}
                                                            controls
                                                            className="max-w-full max-h-64 rounded"
                                                        >
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                                            <div className="flex flex-col items-center justify-center">
                                                <Upload className="text-gray-400 dark:text-gray-500 mb-3" size={40} />
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                                    Upload Vehicle Video
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                    Show the vehicle from all angles
                                                </p>

                                                <label
                                                    htmlFor="vehicleVideoUpload"
                                                    className={`px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Browse File
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="vehicleVideo"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="vehicleVideoUpload"
                                        accept=".mp4,.mov,.avi,.mkv"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2" size={18} />
                                    Update Vehicle
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <Toaster
                toastOptions={{
                    className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
                }}
            />
        </div>
    );
};

export default EditVehicle;