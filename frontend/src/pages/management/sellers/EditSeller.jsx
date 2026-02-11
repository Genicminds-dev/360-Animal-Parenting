// pages/sellers/EditSeller.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { 
    User, 
    MapPin, 
    Phone, 
    CreditCard, 
    Camera, 
    Upload, 
    X, 
    Eye, 
    ArrowLeft, 
    Save,
    Building,
    FileText,
    Hash,
    CircleDollarSign
} from 'lucide-react';

const EditSeller = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const location = useLocation();

    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        // Personal Details
        fullName: '',
        mobile: '',
        gender: '',
        profilePhoto: null,
        aadharNumber: '',
        
        // Address Details
        address: '',
        state: '',
        district: '',
        pincode: '',
        village: '',
        
        // Bank Details
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: ''
    });

    const [errors, setErrors] = useState({});
    const [profilePreview, setProfilePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock data matching the registration form
    const MOCK_SELLERS = [
        {
            uid: "SEL001",
            fullName: "Rajesh Kumar",
            mobile: "9876543210",
            gender: "male",
            profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            aadharNumber: "123456789012",
            address: "123 Main Street, Near City Mall",
            state: "MH",
            district: "Mumbai",
            pincode: "400001",
            village: "Mumbai City",
            bankName: "State Bank of India",
            accountNumber: "12345678901234",
            ifscCode: "SBIN0001234",
            upiId: "rajesh.kumar@oksbi",
            createdAt: "2024-01-15T10:30:00Z",
            status: "Active"
        },
        {
            uid: "SEL002",
            fullName: "Priya Sharma",
            mobile: "8765432109",
            gender: "female",
            profilePhoto: null,
            aadharNumber: "",
            address: "456 Park Avenue, Sector 21",
            state: "DL",
            district: "Delhi",
            pincode: "110001",
            village: "New Delhi",
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            upiId: "",
            createdAt: "2024-01-20T14:45:00Z",
            status: "Active"
        },
        {
            uid: "SEL003",
            fullName: "Mohan Singh",
            mobile: "7654321098",
            gender: "male",
            profilePhoto: null,
            aadharNumber: "234567890123",
            address: "789 Gandhi Nagar",
            state: "RJ",
            district: "Jaipur",
            pincode: "302001",
            village: "Jaipur",
            bankName: "HDFC Bank",
            accountNumber: "23456789012345",
            ifscCode: "HDFC0001234",
            upiId: "mohan.singh@hdfcbank",
            createdAt: "2024-01-25T09:15:00Z",
            status: "Active"
        }
    ];

    // Load seller data
    useEffect(() => {
        const loadSellerData = async () => {
            setLoading(true);
            
            try {
                // Check if seller data was passed in state
                if (location.state?.seller) {
                    const sellerData = location.state.seller;
                    setSeller(sellerData);
                    
                    // Set form data from seller
                    setFormData({
                        fullName: sellerData.fullName || '',
                        mobile: sellerData.mobile || '',
                        gender: sellerData.gender || '',
                        profilePhoto: sellerData.profilePhoto || null,
                        aadharNumber: sellerData.aadharNumber || '',
                        address: sellerData.address || '',
                        state: sellerData.state || '',
                        district: sellerData.district || '',
                        pincode: sellerData.pincode || '',
                        village: sellerData.village || '',
                        bankName: sellerData.bankName || '',
                        accountNumber: sellerData.accountNumber || '',
                        ifscCode: sellerData.ifscCode || '',
                        upiId: sellerData.upiId || ''
                    });
                    
                    // Set profile preview if exists
                    if (sellerData.profilePhoto) {
                        setProfilePreview(sellerData.profilePhoto);
                    }
                } else if (uid) {
                    await fetchSellerData(uid);
                } else {
                    toast.error("No seller ID provided");
                    navigate("/sellers");
                }
            } catch (error) {
                console.error("Error loading seller data:", error);
                toast.error("Failed to load seller details");
            } finally {
                setLoading(false);
            }
        };

        loadSellerData();
    }, [uid, location.state, navigate]);

    // Fetch seller data function
    const fetchSellerData = async (uid) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const foundSeller = MOCK_SELLERS.find(s => s.uid === uid);
            
            if (foundSeller) {
                setSeller(foundSeller);
                
                // Set form data
                setFormData({
                    fullName: foundSeller.fullName || '',
                    mobile: foundSeller.mobile || '',
                    gender: foundSeller.gender || '',
                    profilePhoto: foundSeller.profilePhoto || null,
                    aadharNumber: foundSeller.aadharNumber || '',
                    address: foundSeller.address || '',
                    state: foundSeller.state || '',
                    district: foundSeller.district || '',
                    pincode: foundSeller.pincode || '',
                    village: foundSeller.village || '',
                    bankName: foundSeller.bankName || '',
                    accountNumber: foundSeller.accountNumber || '',
                    ifscCode: foundSeller.ifscCode || '',
                    upiId: foundSeller.upiId || ''
                });
                
                // Set profile preview
                if (foundSeller.profilePhoto) {
                    setProfilePreview(foundSeller.profilePhoto);
                }
            } else {
                toast.error("Seller not found");
                navigate("/sellers");
            }
        } catch (error) {
            console.error("Error fetching seller data:", error);
            toast.error("Failed to load seller details");
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (files && files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            
            if (name === 'profilePhoto') {
                // Clean up previous preview
                if (profilePreview && profilePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(profilePreview);
                }
                setProfilePreview(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Remove profile photo
    const removeProfilePhoto = () => {
        if (profilePreview && profilePreview.startsWith('blob:')) {
            URL.revokeObjectURL(profilePreview);
        }
        setProfilePreview(null);
        setFormData(prev => ({ ...prev, profilePhoto: null }));
    };

    // Validation function
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

    // Handle form submission
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
            toast.success('Seller updated successfully!');
            
            // Navigate back to seller details
            navigate(`/management/seller-details/${uid}`, {
                state: { 
                    seller: {
                        ...seller,
                        ...formData,
                        profilePhoto: formData.profilePhoto instanceof File 
                            ? profilePreview 
                            : formData.profilePhoto,
                        updatedAt: new Date().toISOString()
                    }
                }
            });
            
        } catch (error) {
            console.error("Error updating seller:", error);
            toast.error("Failed to update seller");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        // Clean up preview URLs
        if (profilePreview && profilePreview.startsWith('blob:')) {
            URL.revokeObjectURL(profilePreview);
        }
        
        navigate(`/management/seller-details/${uid}`);
    };

    // Get state display name
    const getStateDisplayName = (stateCode) => {
        const states = {
            'UP': 'Uttar Pradesh',
            'MH': 'Maharashtra',
            'RJ': 'Rajasthan',
            'MP': 'Madhya Pradesh',
            'KA': 'Karnataka',
            'TN': 'Tamil Nadu',
            'GJ': 'Gujarat',
            'AP': 'Andhra Pradesh',
            'WB': 'West Bengal',
            'PB': 'Punjab',
            'DL': 'Delhi'
        };
        return states[stateCode] || stateCode;
    };

    // Get gender display name
    const getGenderDisplayName = (gender) => {
        const genders = {
            'male': 'Male',
            'female': 'Female',
            'other': 'Other'
        };
        return genders[gender] || gender;
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Seller Details...</h3>
                    <p className="text-gray-500">Please wait while we fetch the seller information.</p>
                </div>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="p-4 bg-blue-100 rounded-full mb-4 inline-block">
                        <User className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Seller Not Found</h3>
                    <p className="text-gray-500 mb-6">No seller data found in the system.</p>
                    <button
                        onClick={() => navigate("/sellers")}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} />
                        Back to Sellers
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <Toaster position="top-center" />
            
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCancel}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Seller</h1>
                        <p className="text-gray-600">Update seller information for {seller.fullName}</p>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Seller ID: <span className="font-medium">{seller.uid}</span>
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

                    {/* Profile Photo Section - Center Top */}
                    <div className="mb-8 flex flex-col items-center justify-center">
                        <div className="relative w-32 h-32 mb-4">
                            <div className="w-full h-full rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                                {profilePreview ? (
                                    <img 
                                        src={profilePreview} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/150?text=Seller";
                                        }}
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
                                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg"
                            >
                                <Camera size={18} />
                            </label>
                            {profilePreview && (
                                <button
                                    type="button"
                                    onClick={removeProfilePhoto}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
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
                            />
                            
                            {formData.profilePhoto && formData.profilePhoto instanceof File && (
                                <p className="text-xs text-green-600 mt-2">
                                    ✓ {formData.profilePhoto.name}
                                </p>
                            )}
                            {seller.profilePhoto && !profilePreview?.startsWith('blob:') && (
                                <p className="text-xs text-green-600 mt-2">
                                    ✓ Current photo
                                </p>
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
                                className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                placeholder="Enter full name"
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
                                    className={`w-full pl-10 px-4 py-2 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                    placeholder="Enter 10-digit mobile number"
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
                                className={`w-full px-4 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
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
                                className={`w-full px-4 py-2 border ${errors.aadharNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                placeholder="Enter 12-digit Aadhar number"
                            />
                            {errors.aadharNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.aadharNumber}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Details Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
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
                                className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[80px]`}
                                placeholder="Enter complete address with landmarks"
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
                                className={`w-full px-4 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                            >
                                <option value="">Select State</option>
                                <option value="UP">Uttar Pradesh</option>
                                <option value="MH">Maharashtra</option>
                                <option value="RJ">Rajasthan</option>
                                <option value="MP">Madhya Pradesh</option>
                                <option value="KA">Karnataka</option>
                                <option value="TN">Tamil Nadu</option>
                                <option value="GJ">Gujarat</option>
                                <option value="AP">Andhra Pradesh</option>
                                <option value="WB">West Bengal</option>
                                <option value="PB">Punjab</option>
                                <option value="DL">Delhi</option>
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter district"
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
                                className={`w-full px-4 py-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                placeholder="Enter 6-digit PIN code"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter village/town"
                            />
                        </div>
                    </div>
                </div>

                {/* Bank Details Card - All fields non-mandatory */}
                <div className="bg-white rounded-xl shadow-md p-6">
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
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter bank name"
                                />
                            </div>
                        </div>

                        {/* Account Number - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter account number"
                                />
                            </div>
                        </div>

                        {/* IFSC Code - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                IFSC Code
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter IFSC code"
                                />
                            </div>
                        </div>

                        {/* UPI ID - Non-mandatory */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                UPI ID
                            </label>
                            <div className="relative">
                                <CircleDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="upiId"
                                    value={formData.upiId}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter UPI ID"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Cancel
                    </button>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Update Seller
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditSeller;