import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { 
    User, Phone, Calendar, Clock, Upload, FileText, 
    X, Eye, FileIcon, ArrowLeft, Save, Tag, Image, Video,
    Search, ChevronDown, Camera, AlertCircle, CheckCircle, 
    XCircle, Loader, Clock as ClockIcon
} from 'lucide-react';
import api, { baseURLFile } from "../../../services/api/api";
import { Endpoints } from "../../../services/api/EndPoint";
import { PATHROUTES } from "../../../routes/pathRoutes";

const EditHandover = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const location = useLocation();
    
    const [handover, setHandover] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageError, setImageError] = useState({});
    
    // Data for dropdowns
    const [handoverOfficers, setHandoverOfficers] = useState([]);
    const [animalEarTags, setAnimalEarTags] = useState([]);
    const [loadingDropdowns, setLoadingDropdowns] = useState({
        officers: false,
        earTags: false
    });
    
    const [formData, setFormData] = useState({
        handoverOfficerId: '',
        beneficiaryId: '',
        doNumber: '',
        animalEarTagId: '',
        date: '',
        time: '',
        image: null,
        video: null,
        finalHandoverDocument: null,
        status: 'inprogress'
    });
    
    const [errors, setErrors] = useState({});
    const [previews, setPreviews] = useState({
        image: null,
        video: null,
        document: null
    });
    const [existingFiles, setExistingFiles] = useState({
        image: null,
        video: null,
        document: null
    });
    
    const [officerSearchTerm, setOfficerSearchTerm] = useState('');
    const [earTagSearchTerm, setEarTagSearchTerm] = useState('');
    const [showOfficerDropdown, setShowOfficerDropdown] = useState(false);
    const [showEarTagDropdown, setShowEarTagDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Status options
    const statusOptions = [
        { value: 'inprogress', label: 'In Progress', icon: <Loader size={16} className="text-blue-600" />, color: 'bg-blue-100 text-blue-800' },
        { value: 'completed', label: 'Completed', icon: <CheckCircle size={16} className="text-green-600" />, color: 'bg-green-100 text-green-800' }
    ];

    // Helper function to get full URL for files
    const getFullFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${baseURLFile}${path}`;
    };

    // Fetch dropdown data
    useEffect(() => {
        fetchHandoverOfficers();
        fetchAnimalEarTags();
    }, []);

    const fetchHandoverOfficers = async () => {
        setLoadingDropdowns(prev => ({ ...prev, officers: true }));
        try {
            // Simulate API call - replace with actual endpoint
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setHandoverOfficers([
                { id: '1', name: 'Rajesh Kumar', mobile: '9876543210' },
                { id: '2', name: 'Priya Sharma', mobile: '9876543211' },
                { id: '3', name: 'Amit Patel', mobile: '9876543212' },
                { id: '4', name: 'Sneha Reddy', mobile: '9876543213' },
                { id: '5', name: 'Vikram Singh', mobile: '9876543214' },
            ]);
        } catch (error) {
            console.error('Error fetching handover officers:', error);
            toast.error('Failed to load handover officers');
        } finally {
            setLoadingDropdowns(prev => ({ ...prev, officers: false }));
        }
    };

    const fetchAnimalEarTags = async () => {
        setLoadingDropdowns(prev => ({ ...prev, earTags: true }));
        try {
            // Simulate API call - replace with actual endpoint
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const sampleTags = [];
            for (let i = 1; i <= 20; i++) {
                sampleTags.push({
                    id: i.toString(),
                    tagId: `TAG-${i.toString().padStart(4, '0')}`,
                    animalType: i % 2 === 0 ? 'Cow' : 'Buffalo',
                });
            }
            setAnimalEarTags(sampleTags);
        } catch (error) {
            console.error('Error fetching animal ear tags:', error);
            toast.error('Failed to load animal ear tags');
        } finally {
            setLoadingDropdowns(prev => ({ ...prev, earTags: false }));
        }
    };

    // Load handover data
    useEffect(() => {
        const loadHandoverData = async () => {
            setLoading(true);
            
            try {
                // Check if handover data was passed in state (from list page)
                if (location.state) {
                    const handoverData = location.state;
                    setHandover(handoverData);
                    
                    setFormData({
                        handoverOfficerId: handoverData.handoverOfficerId || '',
                        beneficiaryId: handoverData.beneficiaryId || '',
                        doNumber: handoverData.doNumber || '',
                        animalEarTagId: handoverData.animalEarTagId || '',
                        date: handoverData.date || new Date().toISOString().split('T')[0],
                        time: handoverData.time || new Date().toTimeString().slice(0, 5),
                        image: null,
                        video: null,
                        finalHandoverDocument: null,
                        status: handoverData.status || 'inprogress'
                    });
                    
                    // Store existing file URLs separately
                    setExistingFiles({
                        image: handoverData.image || null,
                        video: handoverData.video || null,
                        document: handoverData.finalHandoverDocument || null
                    });
                    
                    // Set preview URLs from existing files
                    if (handoverData.image) {
                        setPreviews(prev => ({ ...prev, image: getFullFileUrl(handoverData.image) }));
                    }
                    
                    if (handoverData.video) {
                        setPreviews(prev => ({ ...prev, video: getFullFileUrl(handoverData.video) }));
                    }
                    
                    if (handoverData.finalHandoverDocument) {
                        setPreviews(prev => ({ ...prev, document: getFullFileUrl(handoverData.finalHandoverDocument) }));
                    }
                } else if (uid) {
                    await fetchHandoverData(uid);
                } else {
                    toast.error("No handover ID provided");
                    navigate(PATHROUTES.handoverList);
                }
            } catch (error) {
                console.error("Error loading handover data:", error);
                toast.error("Failed to load handover details");
            } finally {
                setLoading(false);
            }
        };

        loadHandoverData();

        // Cleanup function for preview URLs
        return () => {
            Object.values(previews).forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [uid, location.state, navigate]);

    // Fetch handover data from API
    const fetchHandoverData = async (handoverUid) => {
        try {
            const response = await api.get(Endpoints.GET_HANDOVER_BY_ID(handoverUid));
            
            if (response.data.success) {
                const handoverData = response.data.data;
                setHandover(handoverData);
                
                setFormData({
                    handoverOfficerId: handoverData.handoverOfficerId || '',
                    beneficiaryId: handoverData.beneficiaryId || '',
                    doNumber: handoverData.doNumber || '',
                    animalEarTagId: handoverData.animalEarTagId || '',
                    date: handoverData.date || new Date().toISOString().split('T')[0],
                    time: handoverData.time || new Date().toTimeString().slice(0, 5),
                    image: null,
                    video: null,
                    finalHandoverDocument: null,
                    status: handoverData.status || 'inprogress'
                });
                
                setExistingFiles({
                    image: handoverData.image || null,
                    video: handoverData.video || null,
                    document: handoverData.finalHandoverDocument || null
                });
                
                // Set preview URLs from existing files
                if (handoverData.image) {
                    setPreviews(prev => ({ ...prev, image: getFullFileUrl(handoverData.image) }));
                }
                
                if (handoverData.video) {
                    setPreviews(prev => ({ ...prev, video: getFullFileUrl(handoverData.video) }));
                }
                
                if (handoverData.finalHandoverDocument) {
                    setPreviews(prev => ({ ...prev, document: getFullFileUrl(handoverData.finalHandoverDocument) }));
                }
            } else {
                toast.error(response.data.message || "Handover record not found");
                navigate(PATHROUTES.handoverList);
            }
        } catch (error) {
            console.error("Error fetching handover data:", error);
            toast.error(error?.response?.data?.message || "Failed to load handover details");
            navigate(PATHROUTES.handoverList);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleStatusSelect = (status) => {
        setFormData(prev => ({ ...prev, status }));
        setShowStatusDropdown(false);
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size based on type
        const maxSize = field === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for others
        
        if (file.size > maxSize) {
            toast.error(`${field === 'video' ? 'Video' : 'File'} size should be less than ${maxSize / (1024 * 1024)}MB`);
            return;
        }

        // Validate file type
        if (field === 'image' && !file.type.startsWith('image/')) {
            toast.error("Please upload a valid image file");
            return;
        }
        
        if (field === 'video' && !file.type.startsWith('video/')) {
            toast.error("Please upload a valid video file");
            return;
        }
        
        if (field === 'finalHandoverDocument' && !file.type.startsWith('image/') && file.type !== 'application/pdf') {
            toast.error("Please upload a valid image or PDF file");
            return;
        }

        // Update form data with actual file
        setFormData(prev => ({ ...prev, [field]: file }));

        // Create preview URL
        const url = URL.createObjectURL(file);
        
        // Clean up old preview URL if it was a blob
        if (previews[field] && previews[field].startsWith('blob:')) {
            URL.revokeObjectURL(previews[field]);
        }
        
        setPreviews(prev => ({ ...prev, [field]: url }));
        
        // Clear existing file reference
        setExistingFiles(prev => ({ ...prev, [field]: null }));
        
        // Clear error if any
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleOfficerSelect = (officer) => {
        setFormData(prev => ({ ...prev, handoverOfficerId: officer.id }));
        setShowOfficerDropdown(false);
        setOfficerSearchTerm('');
        if (errors.handoverOfficerId) {
            setErrors(prev => ({ ...prev, handoverOfficerId: '' }));
        }
    };

    const handleEarTagSelect = (tag) => {
        setFormData(prev => ({ ...prev, animalEarTagId: tag.id }));
        setShowEarTagDropdown(false);
        setEarTagSearchTerm('');
        if (errors.animalEarTagId) {
            setErrors(prev => ({ ...prev, animalEarTagId: '' }));
        }
    };

    const removeFile = (field) => {
        // Clean up blob URL
        if (previews[field] && previews[field].startsWith('blob:')) {
            URL.revokeObjectURL(previews[field]);
        }
        
        setPreviews(prev => ({ ...prev, [field]: null }));
        setFormData(prev => ({ ...prev, [field]: null }));
        setExistingFiles(prev => ({ ...prev, [field]: null }));
        setImageError(prev => ({ ...prev, [field]: false }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.handoverOfficerId) {
            newErrors.handoverOfficerId = 'Please select a handover officer';
        }
        
        if (!formData.beneficiaryId?.trim()) {
            newErrors.beneficiaryId = 'Beneficiary ID is required';
        }
        
        if (!formData.doNumber?.trim()) {
            newErrors.doNumber = 'DO Number is required';
        }
        
        if (!formData.animalEarTagId) {
            newErrors.animalEarTagId = 'Please select an animal ear tag';
        }
        
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        
        if (!formData.time) {
            newErrors.time = 'Time is required';
        }
        
        if (!formData.status) {
            newErrors.status = 'Status is required';
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

    const isVideo = (file) => {
        if (!file) return false;
        
        if (file instanceof File) {
            return file.type.startsWith("video/");
        }
        
        if (typeof file === "string") {
            return /\.(mp4|mov|avi|mkv)$/i.test(file);
        }
        
        return false;
    };

    const getFileName = (field, prefix) => {
        if (formData[field] instanceof File) {
            return formData[field].name;
        }
        if (existingFiles[field]) {
            const urlParts = existingFiles[field].split('/');
            return urlParts[urlParts.length - 1] || `${prefix || 'Document'}.pdf`;
        }
        return `${prefix || 'Document'}.pdf`;
    };

    const openDocument = (field) => {
        // If newly uploaded file
        if (formData[field] instanceof File) {
            const blobUrl = URL.createObjectURL(formData[field]);
            window.open(blobUrl, "_blank");
            return;
        }
        
        // If existing file URL
        if (existingFiles[field]) {
            const fullUrl = getFullFileUrl(existingFiles[field]);
            window.open(fullUrl, "_blank");
        }
    };

    const handleImageError = (field) => {
        setImageError(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.success('Handover record updated successfully!');
            
            // Clean up preview URLs
            Object.values(previews).forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
            
            // Navigate back to handover list
            setTimeout(() => {
                navigate(PATHROUTES.handoverList);
            }, 1500);
            
        } catch (error) {
            console.error("Error updating handover:", error);
            toast.error(error?.response?.data?.message || "Failed to update handover record");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Clean up preview URLs
        Object.values(previews).forEach(url => {
            if (url && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
        
        navigate(PATHROUTES.handoverList);
    };

    // Filter officers based on search
    const filteredOfficers = handoverOfficers.filter(officer => 
        officer.name.toLowerCase().includes(officerSearchTerm.toLowerCase()) ||
        officer.mobile.includes(officerSearchTerm)
    );

    // Filter ear tags based on tagId search
    const filteredEarTags = animalEarTags.filter(tag => 
        tag.tagId.toLowerCase().includes(earTagSearchTerm.toLowerCase())
    );

    const selectedOfficer = handoverOfficers.find(o => o.id === formData.handoverOfficerId);
    const selectedEarTag = animalEarTags.find(t => t.id === formData.animalEarTagId);
    const selectedStatus = statusOptions.find(s => s.value === formData.status);

    // File Upload Field Component
    const FileUploadField = ({ 
        label, 
        field, 
        accept, 
        icon: Icon, 
        required = false,
        description 
    }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            {(formData[field] || existingFiles[field]) ? (
                <div className="border-2 border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                                isPDF(formData[field] || existingFiles[field]) ? 'bg-red-100 text-red-600' :
                                isVideo(formData[field] || existingFiles[field]) ? 'bg-purple-100 text-purple-600' :
                                'bg-primary-100 text-primary-600'
                            }`}>
                                {isPDF(formData[field] || existingFiles[field]) ? <FileIcon size={20} /> :
                                 isVideo(formData[field] || existingFiles[field]) ? <Video size={20} /> :
                                 <Image size={20} />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 break-all max-w-xs">
                                    {getFileName(field, label)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {isPDF(formData[field] || existingFiles[field]) ? 'PDF Document' :
                                     isVideo(formData[field] || existingFiles[field]) ? 'Video File' :
                                     'Image File'}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {(isImage(formData[field] || existingFiles[field]) || 
                              isPDF(formData[field] || existingFiles[field]) || 
                              isVideo(formData[field] || existingFiles[field])) && (
                                <button
                                    type="button"
                                    onClick={() => openDocument(field)}
                                    className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                    title="Preview"
                                    disabled={isSubmitting}
                                >
                                    <Eye size={16} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => removeFile(field)}
                                className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                title="Remove"
                                disabled={isSubmitting}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {previews[field] && isImage(formData[field] || existingFiles[field]) && !imageError[field] && (
                        <div className="mt-3">
                            <img 
                                src={previews[field]} 
                                alt="Preview" 
                                className="max-h-32 rounded object-contain"
                                onError={() => handleImageError(field)}
                            />
                        </div>
                    )}
                    
                    {previews[field] && isVideo(formData[field] || existingFiles[field]) && (
                        <div className="mt-3">
                            <video 
                                src={previews[field]} 
                                controls 
                                className="max-h-32 rounded"
                            />
                        </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                        Upload a new file to replace existing one. Click remove to delete.
                    </p>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                    <div className="flex flex-col items-center">
                        <Icon className="text-gray-400 mb-2" size={24} />
                        <p className="text-sm text-gray-600 mb-1">{description}</p>
                        <p className="text-xs text-gray-500 mb-2">Click to browse</p>
                        <label 
                            htmlFor={field}
                            className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded cursor-pointer hover:bg-primary-700 transition-colors"
                        >
                            Choose File
                        </label>
                    </div>
                </div>
            )}
            
            <input
                type="file"
                name={field}
                id={field}
                onChange={(e) => handleFileChange(e, field)}
                className="hidden"
                accept={accept}
                disabled={isSubmitting}
            />
            
            {errors[field] && (
                <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
            )}
        </div>
    );

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Handover Details...</h3>
                    <p className="text-gray-500">Please wait while we fetch the handover information.</p>
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
                        <h1 className="text-2xl font-bold text-gray-900">Edit Handover Record</h1>
                        <p className="text-gray-600">Update handover details and documents</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Handover Details Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <User className="text-primary-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Handover Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Handover Officer Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Handover Officer <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowOfficerDropdown(!showOfficerDropdown)}
                                    className={`w-full px-4 py-2 border ${errors.handoverOfficerId ? 'border-red-500' : 'border-gray-300'} rounded-lg text-left flex items-center justify-between bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                    disabled={isSubmitting}
                                >
                                    <span className={selectedOfficer ? 'text-gray-900' : 'text-gray-500'}>
                                        {selectedOfficer 
                                            ? `${selectedOfficer.name} - ${selectedOfficer.mobile}`
                                            : 'Select Handover Officer'
                                        }
                                    </span>
                                    <ChevronDown size={18} className="text-gray-400" />
                                </button>
                                
                                {showOfficerDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <div className="p-2 border-b">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Search by name or mobile..."
                                                    value={officerSearchTerm}
                                                    onChange={(e) => setOfficerSearchTerm(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {loadingDropdowns.officers ? (
                                                <div className="p-4 text-center text-gray-500">
                                                    Loading...
                                                </div>
                                            ) : filteredOfficers.length > 0 ? (
                                                filteredOfficers.map(officer => (
                                                    <button
                                                        key={officer.id}
                                                        type="button"
                                                        onClick={() => handleOfficerSelect(officer)}
                                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 flex items-center space-x-2"
                                                    >
                                                        <User size={16} className="text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {officer.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {officer.mobile}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    No officers found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.handoverOfficerId && (
                                <p className="text-red-500 text-xs mt-1">{errors.handoverOfficerId}</p>
                            )}
                        </div>

                        {/* Beneficiary ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Beneficiary ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="beneficiaryId"
                                value={formData.beneficiaryId}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors.beneficiaryId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                placeholder="Enter beneficiary ID"
                                disabled={isSubmitting}
                            />
                            {errors.beneficiaryId && (
                                <p className="text-red-500 text-xs mt-1">{errors.beneficiaryId}</p>
                            )}
                        </div>

                        {/* DO Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                DO Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="doNumber"
                                value={formData.doNumber}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors.doNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                placeholder="Enter DO number"
                                disabled={isSubmitting}
                            />
                            {errors.doNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.doNumber}</p>
                            )}
                        </div>

                        {/* Animal Ear Tag Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Animal Ear Tag ID <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowEarTagDropdown(!showEarTagDropdown)}
                                    className={`w-full px-4 py-2 border ${errors.animalEarTagId ? 'border-red-500' : 'border-gray-300'} rounded-lg text-left flex items-center justify-between bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                    disabled={isSubmitting}
                                >
                                    <span className={selectedEarTag ? 'text-gray-900' : 'text-gray-500'}>
                                        {selectedEarTag 
                                            ? `${selectedEarTag.tagId} ${selectedEarTag.animalType ? `- ${selectedEarTag.animalType}` : ''}`
                                            : 'Select Animal Ear Tag'
                                        }
                                    </span>
                                    <ChevronDown size={18} className="text-gray-400" />
                                </button>
                                
                                {showEarTagDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <div className="p-2 border-b">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Search by tag ID (e.g., TAG-0001)..."
                                                    value={earTagSearchTerm}
                                                    onChange={(e) => setEarTagSearchTerm(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {loadingDropdowns.earTags ? (
                                                <div className="p-4 text-center text-gray-500">
                                                    Loading...
                                                </div>
                                            ) : filteredEarTags.length > 0 ? (
                                                filteredEarTags.map(tag => (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => handleEarTagSelect(tag)}
                                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 flex items-center space-x-2"
                                                    >
                                                        <Tag size={16} className="text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {tag.tagId}
                                                            </p>
                                                            {tag.animalType && (
                                                                <p className="text-xs text-gray-500">
                                                                    {tag.animalType}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    No ear tags found matching "{earTagSearchTerm}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.animalEarTagId && (
                                <p className="text-red-500 text-xs mt-1">{errors.animalEarTagId}</p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`w-full pl-10 px-4 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.date && (
                                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                            )}
                        </div>

                        {/* Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className={`w-full pl-10 px-4 py-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.time && (
                                <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                            )}
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                    className={`w-full px-4 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg text-left flex items-center justify-between bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                    disabled={isSubmitting}
                                >
                                    <div className="flex items-center gap-2">
                                        {selectedStatus?.icon}
                                        <span className={selectedStatus ? 'text-gray-900' : 'text-gray-500'}>
                                            {selectedStatus ? selectedStatus.label : 'Select Status'}
                                        </span>
                                    </div>
                                    <ChevronDown size={18} className="text-gray-400" />
                                </button>
                                
                                {showStatusDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <div className="max-h-60 overflow-y-auto">
                                            {statusOptions.map(status => (
                                                <button
                                                    key={status.value}
                                                    type="button"
                                                    onClick={() => handleStatusSelect(status.value)}
                                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 flex items-center gap-2"
                                                >
                                                    {status.icon}
                                                    <span className="text-sm text-gray-900">{status.label}</span>
                                                    {formData.status === status.value && (
                                                        <span className="ml-auto text-xs text-primary-600">✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.status && (
                                <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Media Files Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Camera className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Media Files</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUploadField
                            label="Image"
                            field="image"
                            accept=".jpg,.jpeg,.png"
                            icon={Image}
                            description="Upload handover image (Max 10MB)"
                        />
                        
                        <FileUploadField
                            label="Video"
                            field="video"
                            accept=".mp4,.mov,.avi"
                            icon={Video}
                            description="Upload handover video (Max 50MB)"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <FileText className="text-purple-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Final Handover Document</h2>
                    </div>

                    <FileUploadField
                        label="Final Handover Document"
                        field="finalHandoverDocument"
                        accept=".pdf,.jpg,.jpeg,.png"
                        icon={FileText}
                        required={true}
                        description="Upload signed handover document (Max 10MB)"
                    />
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
                                Update Handover
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditHandover;