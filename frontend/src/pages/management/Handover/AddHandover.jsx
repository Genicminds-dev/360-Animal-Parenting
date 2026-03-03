import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Phone, Calendar, Clock, Upload, FileText, 
    X, Eye, File, Search, ChevronDown, Tag, Image, Video,
    CheckCircle, AlertCircle, Camera
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { PATHROUTES } from '../../../routes/pathRoutes';

const AddHandover = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [handoverOfficers, setHandoverOfficers] = useState([]);
    const [animalEarTags, setAnimalEarTags] = useState([]);
    const [loading, setLoading] = useState({
        officers: false,
        earTags: false
    });
    
    const [formData, setFormData] = useState({
        handoverOfficerId: '',
        beneficiaryId: '',
        doNumber: '',
        animalEarTagId: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        image: null,
        video: null,
        finalHandoverDocument: null
    });

    const [errors, setErrors] = useState({});
    const [previews, setPreviews] = useState({
        image: null,
        video: null,
        document: null
    });
    
    const [officerSearchTerm, setOfficerSearchTerm] = useState('');
    const [earTagSearchTerm, setEarTagSearchTerm] = useState('');
    const [showOfficerDropdown, setShowOfficerDropdown] = useState(false);
    const [showEarTagDropdown, setShowEarTagDropdown] = useState(false);

    useEffect(() => {
        fetchHandoverOfficers();
        fetchAnimalEarTags();
    }, []);

    useEffect(() => {
        return () => {
            Object.values(previews).forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    const fetchHandoverOfficers = async () => {
        setLoading(prev => ({ ...prev, officers: true }));
        try {
            // Simulate API call
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
            setLoading(prev => ({ ...prev, officers: false }));
        }
    };

    const fetchAnimalEarTags = async () => {
        setLoading(prev => ({ ...prev, earTags: true }));
        try {
            // Simulate API call
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
            setLoading(prev => ({ ...prev, earTags: false }));
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (files && files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            
            // Clear previous preview
            if (previews[name]) {
                URL.revokeObjectURL(previews[name]);
                setPreviews(prev => ({ ...prev, [name]: null }));
            }
            
            // Set preview for images/videos
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
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

    const removeFile = (fieldName) => {
        if (previews[fieldName]) {
            URL.revokeObjectURL(previews[fieldName]);
            setPreviews(prev => ({ ...prev, [fieldName]: null }));
        }
        setFormData(prev => ({ ...prev, [fieldName]: null }));
    };

    const getDisplayFileName = (file, prefix) => {
        if (!file) return '';
        const extension = file.name.split('.').pop().toLowerCase();
        return `${prefix}.${extension}`;
    };

    const isPDF = (file) => {
        return file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    };

    const isImage = (file) => {
        return file && file.type.startsWith('image/');
    };

    const isVideo = (file) => {
        return file && file.type.startsWith('video/');
    };

    const openDocument = (file, previewUrl) => {
        if (file) {
            const url = previewUrl || URL.createObjectURL(file);
            window.open(url, '_blank');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.handoverOfficerId) {
            newErrors.handoverOfficerId = 'Please select a handover officer';
        }
        
        if (!formData.beneficiaryId.trim()) {
            newErrors.beneficiaryId = 'Beneficiary ID is required';
        }
        
        if (!formData.doNumber.trim()) {
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
            
            // Simulate form submission delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            toast.success('Handover record created successfully!');
            
            // Clean up preview URLs
            Object.values(previews).forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
            
            // Redirect to handover list page
            setTimeout(() => {
                navigate(PATHROUTES.handoverList);
            }, 1500);
            
        } catch (error) {
            console.error('Error creating handover:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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

    // File Upload Component
    const FileUploadField = ({ 
        label, 
        name, 
        accept, 
        icon: Icon, 
        required = false,
        description 
    }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            {formData[name] ? (
                <div className="border-2 border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                                isPDF(formData[name]) ? 'bg-red-100 text-red-600' :
                                isVideo(formData[name]) ? 'bg-purple-100 text-purple-600' :
                                'bg-primary-100 text-primary-600'
                            }`}>
                                {isPDF(formData[name]) ? <File size={20} /> :
                                 isVideo(formData[name]) ? <Video size={20} /> :
                                 <Image size={20} />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {getDisplayFileName(formData[name], label)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {Math.round(formData[name].size / 1024)} KB
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {(isImage(formData[name]) || isPDF(formData[name]) || isVideo(formData[name])) && (
                                <button
                                    type="button"
                                    onClick={() => openDocument(formData[name], previews[name])}
                                    className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                    title="Preview"
                                    disabled={isSubmitting}
                                >
                                    <Eye size={16} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => removeFile(name)}
                                className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                title="Remove"
                                disabled={isSubmitting}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {previews[name] && isImage(formData[name]) && (
                        <div className="mt-3">
                            <img 
                                src={previews[name]} 
                                alt="Preview" 
                                className="max-h-32 rounded object-contain"
                            />
                        </div>
                    )}
                    
                    {previews[name] && isVideo(formData[name]) && (
                        <div className="mt-3">
                            <video 
                                src={previews[name]} 
                                controls 
                                className="max-h-32 rounded"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                    <div className="flex flex-col items-center">
                        <Icon className="text-gray-400 mb-2" size={24} />
                        <p className="text-sm text-gray-600 mb-1">{description}</p>
                        <p className="text-xs text-gray-500 mb-2">Click to browse</p>
                        <label 
                            htmlFor={name}
                            className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded cursor-pointer hover:bg-primary-700 transition-colors"
                        >
                            Choose File
                        </label>
                    </div>
                    <input
                        type="file"
                        name={name}
                        id={name}
                        onChange={handleChange}
                        className="hidden"
                        accept={accept}
                        disabled={isSubmitting}
                    />
                </div>
            )}
            {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Handover Record</h1>
                <p className="text-gray-600">Complete the handover process for beneficiary</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Handover Officer Dropdown */}
                <div className="card">
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
                                    className={`w-full input-field text-left flex items-center justify-between ${
                                        errors.handoverOfficerId ? 'border-red-500' : ''
                                    }`}
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
                                            {loading.officers ? (
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
                                className={`input-field ${errors.beneficiaryId ? 'border-red-500' : ''}`}
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
                                className={`input-field ${errors.doNumber ? 'border-red-500' : ''}`}
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
                                    className={`w-full input-field text-left flex items-center justify-between ${
                                        errors.animalEarTagId ? 'border-red-500' : ''
                                    }`}
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
                                            {loading.earTags ? (
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
                                    className={`input-field pl-10 ${errors.date ? 'border-red-500' : ''}`}
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
                                    className={`input-field pl-10 ${errors.time ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.time && (
                                <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Media Upload Section */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Camera className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Media Files</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUploadField
                            label="Image"
                            name="image"
                            accept=".jpg,.jpeg,.png"
                            icon={Image}
                            description="Upload handover image"
                        />
                        
                        <FileUploadField
                            label="Video"
                            name="video"
                            accept=".mp4,.mov,.avi"
                            icon={Video}
                            description="Upload handover video"
                        />
                    </div>
                </div>

                {/* Final Handover Document */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <FileText className="text-purple-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Final Handover Document</h2>
                    </div>

                    <FileUploadField
                        label="Final Handover Document"
                        name="finalHandoverDocument"
                        accept=".pdf,.jpg,.jpeg,.png"
                        icon={FileText}
                        description="Upload signed handover document"
                    />
                </div>

                {/* Status Indicator - Hidden but present */}
                <input type="hidden" name="status" value="inprogress" />

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[160px] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            'Create Handover Record'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddHandover;