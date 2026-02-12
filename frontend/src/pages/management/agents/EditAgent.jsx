// pages/agents/EditAgent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { User, Phone, Camera, Upload, FileText, X, Eye, FileIcon, ArrowLeft, Save } from 'lucide-react';
import { PATHROUTES } from '../../../routes/pathRoutes';

const EditAgent = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const location = useLocation();
    
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        aadharNumber: '',
        profilePhoto: null,
        aadharDocument: null
    });
    
    const [errors, setErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock data matching the registration form
    const MOCK_AGENTS = [
        {
            uid: "CA0001",
            fullName: "Rajesh Kumar",
            mobile: "9876543210",
            aadharNumber: "123456789012",
            profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
            aadharDocument: {
                fileType: "pdf",
                fileName: "Aadhaar_Rajesh_Kumar.pdf",
                fileSize: "2.4 MB",
                uploadDate: "2024-01-15T10:30:00Z",
                url: "/dummy-aadhar.pdf"
            },
            createdAt: "2024-01-15T10:30:00Z",
            status: "Active"
        },
        {
            uid: "CA0002",
            fullName: "Priya Sharma",
            mobile: "8765432109",
            aadharNumber: "",
            profilePhoto: null,
            aadharDocument: null,
            createdAt: "2024-01-20T14:45:00Z",
            status: "Active"
        }
    ];

    // Load agent data
    useEffect(() => {
        const loadAgentData = async () => {
            setLoading(true);
            
            try {
                // Check if agent data was passed in state
                if (location.state?.agent) {
                    const agentData = location.state.agent;
                    setAgent(agentData);
                    
                    // Set form data from agent
                    setFormData({
                        fullName: agentData.fullName || '',
                        mobile: agentData.mobile || '',
                        aadharNumber: agentData.aadharNumber || '',
                        profilePhoto: agentData.profilePhoto || null,
                        aadharDocument: agentData.aadharDocument || null
                    });
                    
                    // Set profile preview if exists
                    if (agentData.profilePhoto) {
                        setProfilePreview(agentData.profilePhoto);
                    }
                    
                    // Set document preview if exists
                    if (agentData.aadharDocument) {
                        setPreviewUrl(agentData.aadharDocument.url);
                    }
                } else if (uid) {
                    await fetchAgentData(uid);
                } else {
                    toast.error("No agent ID provided");
                    navigate("/agents");
                }
            } catch (error) {
                console.error("Error loading agent data:", error);
                toast.error("Failed to load agent details");
            } finally {
                setLoading(false);
            }
        };

        loadAgentData();

        // Cleanup function for preview URLs
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            if (profilePreview && profilePreview.startsWith('blob:')) {
                URL.revokeObjectURL(profilePreview);
            }
        };
    }, [uid, location.state, navigate]);

    // Fetch agent data function
    const fetchAgentData = async (uid) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const foundAgent = MOCK_AGENTS.find(a => a.uid === uid);
            
            if (foundAgent) {
                setAgent(foundAgent);
                
                // Set form data
                setFormData({
                    fullName: foundAgent.fullName || '',
                    mobile: foundAgent.mobile || '',
                    aadharNumber: foundAgent.aadharNumber || '',
                    profilePhoto: foundAgent.profilePhoto || null,
                    aadharDocument: foundAgent.aadharDocument || null
                });
                
                // Set previews
                if (foundAgent.profilePhoto) {
                    setProfilePreview(foundAgent.profilePhoto);
                }
                if (foundAgent.aadharDocument) {
                    setPreviewUrl(foundAgent.aadharDocument.url);
                }
            } else {
                toast.error("Agent not found");
                navigate("/agents");
            }
        } catch (error) {
            console.error("Error fetching agent data:", error);
            toast.error("Failed to load agent details");
        }
    };

    const getDisplayFileName = (file) => {
        if (!file) return '';
        
        if (typeof file === 'object' && file.fileName) {
            return file.fileName;
        }
        
        // Handle File objects
        if (file?.name && file?.size){
            const extension = file.name.split('.').pop().toLowerCase();
            return `Aadhaar.${extension}`;
        }
        
        return 'Aadhaar Document';
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            
            // Clean up previous preview URLs
            if (name === 'profilePhoto') {
                if (profilePreview && profilePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(profilePreview);
                    setProfilePreview(null);
                }
                setProfilePreview(URL.createObjectURL(file));
            } else if (name === 'aadharDocument') {
                // Clear previous preview
                if (previewUrl && previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
                
                // Create preview URL for BOTH images and PDFs
                // This is the key fix for the blank URL issue
                setPreviewUrl(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const removeProfilePhoto = () => {
        if (profilePreview && profilePreview.startsWith('blob:')) {
            URL.revokeObjectURL(profilePreview);
        }
        setProfilePreview(null);
        setFormData(prev => ({ ...prev, profilePhoto: null }));
    };

    const removeAadharDocument = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setFormData(prev => ({ ...prev, aadharDocument: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.mobile.trim()) newErrors.mobile = 'Mobile Number is required';
        
        if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
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
            toast.error("Please fix the errors before submitting");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Form submitted:', formData);
            toast.success('Agent updated successfully!');
            
            // Clean up preview URLs
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            if (profilePreview && profilePreview.startsWith('blob:')) {
                URL.revokeObjectURL(profilePreview);
            }
            
            // Navigate back to agent details
            navigate(`/management/agent-details/${uid}`, {
                state: { 
                    agent: {
                        ...agent,
                        ...formData,
                        updatedAt: new Date().toISOString()
                    }
                }
            });
            
        } catch (error) {
            console.error("Error updating agent:", error);
            toast.error("Failed to update agent");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Clean up preview URLs
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        if (profilePreview && profilePreview.startsWith('blob:')) {
            URL.revokeObjectURL(profilePreview);
        }
        
        navigate(`/management/agent-details/${uid}`);
    };

const isPDF = (file) => {
    if (!file) return false;

    // If it has a type property (File object)
    if (file?.type) {
        return file.type === "application/pdf";
    }

    // If backend object
    if (file?.fileType) {
        return file.fileType === "pdf";
    }

    // If string URL
    if (typeof file === "string") {
        return file.toLowerCase().endsWith(".pdf");
    }

    return false;
};

const isImage = (file) => {
    if (!file) return false;

    if (file?.type) {
        return file.type.startsWith("image/");
    }

    if (file?.fileType) {
        return file.fileType === "image";
    }

    if (typeof file === "string") {
        return /\.(jpg|jpeg|png|gif|png)$/i.test(file);
    }

    return false;
};


    const openDocument = () => {
        const file = formData.aadharDocument;

        if (!file) return;

        // NEWLY UPLOADED FILE (File object)
        if (file instanceof File) {
            const blobUrl = URL.createObjectURL(file);
            window.open(blobUrl, "_blank");
            return;
        }

        // EXISTING BACKEND FILE OBJECT
        if (typeof file === "object" && file.url) {
            window.open(file.url, "_blank");
            return;
        }

        // DIRECT STRING URL
        if (typeof file === "string") {
            window.open(file, "_blank");
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Agent Details...</h3>
                    <p className="text-gray-500">Please wait while we fetch the agent information.</p>
                </div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="p-4 bg-blue-100 rounded-full mb-4 inline-block">
                        <User className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Agent Not Found</h3>
                    <p className="text-gray-500 mb-6">No agent data found in the system.</p>
                    <button
                        onClick={() => navigate("/agents")}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} />
                        Back to Agents
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Toaster position="top-center" />
            
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(PATHROUTES.agentsList)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Agent</h1>
                        <p className="text-gray-600">Update agent information for {agent.fullName}</p>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Agent ID: <span className="font-medium">{agent.uid}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Details Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
                    </div>

                    {/* Profile Photo Section */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative w-32 h-32 mb-4">
                            <div className="w-full h-full rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                                {profilePreview ? (
                                    <img 
                                        src={profilePreview} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/150?text=Agent";
                                        }}
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
                                onChange={handleChange}
                                className="hidden"
                                id="profilePhoto"
                                accept=".jpg,.jpeg,.png"
                                disabled={isSubmitting}
                            />
                            
                            {formData.profilePhoto && (
                                <p className="text-xs text-green-600 mt-2">
                                    ✓ {formData.profilePhoto instanceof File 
                                        ? formData.profilePhoto.name 
                                        : 'Profile photo selected'}
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
                                                    <FileIcon size={24} />
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
                                                        : formData.aadharDocument?.size
                                                        ? `${Math.round(formData.aadharDocument.size / 1024)} KB`
                                                        : formData.aadharDocument?.fileSize || ''}
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
                                    
                                    {/* Show preview for images */}
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
                                    
                                    {/* Show PDF info */}
                                    {isPDF(formData.aadharDocument) && (
                                        <div className="mt-4 text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
                                            <FileIcon className="mx-auto text-red-400 mb-3" size={48} />
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

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        <ArrowLeft size={16} />
                        Cancel
                    </button>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Update Agent
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditAgent;