import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
    User, MapPin, ChevronDown, Globe, Map, Hash,
    ArrowLeft, Save, AlertCircle
} from 'lucide-react';
import { FaVenusMars, FaBirthdayCake } from 'react-icons/fa';
import { PATHROUTES } from "../../../routes/pathRoutes";

// City data by state (2 cities per state as requested)
const cityOptionsByState = {
    "Maharashtra": ["Mumbai", "Pune"],
    "Gujarat": ["Ahmedabad", "Surat"],
    "Karnataka": ["Bengaluru", "Mysore"],
    "Telangana": ["Hyderabad", "Warangal"],
    "Tamil Nadu": ["Chennai", "Coimbatore"],
    "Delhi": ["New Delhi", "Gurgaon"],
    "Uttar Pradesh": ["Lucknow", "Kanpur"],
    "Rajasthan": ["Jaipur", "Jodhpur"],
    "Madhya Pradesh": ["Bhopal", "Indore"],
    "West Bengal": ["Kolkata", "Howrah"]
};

// Available states
const stateOptions = Object.keys(cityOptionsByState).sort();

const EditBeneficiary = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const location = useLocation();
    
    const [beneficiary, setBeneficiary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableCities, setAvailableCities] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [errors, setErrors] = useState({});

    // Sample beneficiary data (replace with actual API call)
    const sampleBeneficiaryData = {
        "BEN-2024-001": {
            uid: "BEN-2024-001",
            name: "Ramesh Kumar",
            gender: "male",
            dateOfBirth: "1985-06-15",
            address: "123 Main Street, Near City Park",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            createdAt: "2024-01-15T10:30:00Z"
        },
        "BEN-2024-002": {
            uid: "BEN-2024-002",
            name: "Sunita Sharma",
            gender: "female",
            dateOfBirth: "1990-08-22",
            address: "456 Lake View Apartments, Andheri East",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400069",
            createdAt: "2024-01-18T11:45:00Z"
        },
        "BEN-2024-003": {
            uid: "BEN-2024-003",
            name: "Amit Patel",
            gender: "male",
            dateOfBirth: "1978-03-10",
            address: "789 Green Park Colony",
            city: "Ahmedabad",
            state: "Gujarat",
            pincode: "380015",
            createdAt: "2024-01-20T09:15:00Z"
        }
    };

    // Load beneficiary data
    useEffect(() => {
        const loadBeneficiaryData = async () => {
            setLoading(true);
            
            try {
                // Check if beneficiary data was passed in state (from list page)
                if (location.state) {
                    const beneficiaryData = location.state;
                    setBeneficiary(beneficiaryData);
                    
                    setFormData({
                        name: beneficiaryData.name || '',
                        gender: beneficiaryData.gender || '',
                        dateOfBirth: beneficiaryData.dateOfBirth || '',
                        address: beneficiaryData.address || '',
                        city: beneficiaryData.city || '',
                        state: beneficiaryData.state || '',
                        pincode: beneficiaryData.pincode || ''
                    });
                } else if (uid) {
                    await fetchBeneficiaryData(uid);
                } else {
                    toast.error("No beneficiary ID provided");
                    navigate(PATHROUTES.beneficiaryList);
                }
            } catch (error) {
                console.error("Error loading beneficiary data:", error);
                toast.error("Failed to load beneficiary details");
            } finally {
                setLoading(false);
            }
        };

        loadBeneficiaryData();
    }, [uid, location.state, navigate]);

    // Fetch beneficiary data (simulated API call)
    const fetchBeneficiaryData = async (beneficiaryUid) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Get sample data
            const beneficiaryData = sampleBeneficiaryData[beneficiaryUid];
            
            if (beneficiaryData) {
                setBeneficiary(beneficiaryData);
                
                setFormData({
                    name: beneficiaryData.name || '',
                    gender: beneficiaryData.gender || '',
                    dateOfBirth: beneficiaryData.dateOfBirth || '',
                    address: beneficiaryData.address || '',
                    city: beneficiaryData.city || '',
                    state: beneficiaryData.state || '',
                    pincode: beneficiaryData.pincode || ''
                });
            } else {
                toast.error("Beneficiary record not found");
                navigate(PATHROUTES.beneficiaryList);
            }
        } catch (error) {
            console.error("Error fetching beneficiary data:", error);
            toast.error("Failed to load beneficiary details");
            navigate(PATHROUTES.beneficiaryList);
        }
    };

    // Update available cities when state changes
    useEffect(() => {
        if (formData.state) {
            setAvailableCities(cityOptionsByState[formData.state] || []);
            // Clear city if current city is not in the new state's cities
            if (formData.city && !cityOptionsByState[formData.state]?.includes(formData.city)) {
                setFormData(prev => ({ ...prev, city: '' }));
            }
        } else {
            setAvailableCities([]);
        }
    }, [formData.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }
        
        // Gender validation
        if (!formData.gender) {
            newErrors.gender = 'Please select gender';
        }
        
        // Date of Birth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        } else {
            const dob = new Date(formData.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            if (age < 18) {
                newErrors.dateOfBirth = 'Beneficiary must be at least 18 years old';
            } else if (age > 120) {
                newErrors.dateOfBirth = 'Please enter a valid date of birth';
            }
        }
        
        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        } else if (formData.address.trim().length < 10) {
            newErrors.address = 'Please enter complete address (min 10 characters)';
        }
        
        // State validation
        if (!formData.state) {
            newErrors.state = 'Please select state';
        }
        
        // City validation
        if (!formData.city) {
            newErrors.city = 'Please select city';
        }
        
        // Pincode validation
        if (!formData.pincode) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Pincode must be 6 digits';
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
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.success('Beneficiary updated successfully!');
            
            // Navigate back to beneficiary list
            setTimeout(() => {
                navigate(PATHROUTES.beneficiaryList);
            }, 1500);
            
        } catch (error) {
            console.error("Error updating beneficiary:", error);
            toast.error(error?.response?.data?.message || "Failed to update beneficiary record");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(PATHROUTES.beneficiaryList);
    };

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        if (!dob) return '';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Beneficiary Details...</h3>
                    <p className="text-gray-500">Please wait while we fetch the beneficiary information.</p>
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
                        <h1 className="text-2xl font-bold text-gray-900">Edit Beneficiary</h1>
                        <p className="text-gray-600">Update beneficiary information</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <User className="text-primary-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter full name"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors appearance-none bg-white ${
                                        errors.gender ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                            {errors.gender && (
                                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors ${
                                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.dateOfBirth && (
                                <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                            )}
                            {formData.dateOfBirth && !errors.dateOfBirth && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Age: {calculateAge(formData.dateOfBirth)} years
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <MapPin className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Address Textarea */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Complete Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors ${
                                    errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter complete address with landmark, street, etc."
                                disabled={isSubmitting}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* State Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors appearance-none bg-white ${
                                            errors.state ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        <option value="">Select State</option>
                                        {stateOptions.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                                {errors.state && (
                                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                                )}
                            </div>

                            {/* City Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors appearance-none bg-white ${
                                            errors.city ? 'border-red-500' : 'border-gray-300'
                                        } ${!formData.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        disabled={isSubmitting || !formData.state}
                                    >
                                        <option value="">
                                            {formData.state ? 'Select City' : 'Select State First'}
                                        </option>
                                        {availableCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                                {!formData.state && (
                                    <p className="text-xs text-gray-500 mt-1">Please select state first</p>
                                )}
                                {errors.city && (
                                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                                )}
                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pincode <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        maxLength="6"
                                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors ${
                                            errors.pincode ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter 6-digit pincode"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.pincode && (
                                    <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                                )}
                            </div>
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
                                Update Beneficiary
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBeneficiary;