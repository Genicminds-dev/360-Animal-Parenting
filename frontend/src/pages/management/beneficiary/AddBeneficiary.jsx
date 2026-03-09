import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, MapPin, ChevronDown, Globe, Map, Hash, ArrowLeft
} from 'lucide-react';
import { FaVenusMars, FaBirthdayCake } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { PATHROUTES } from '../../../routes/pathRoutes';

const AddBeneficiary = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Dropdown states
    const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');
    
    // Refs for dropdown click outside handling
    const stateRef = useRef(null);
    const cityRef = useRef(null);
    
    // API base URL from the provided endpoints
    const API_BASE = 'https://hapilocations.web.app';
    
    // States and Cities data from API
    const [states, setStates] = useState([]);
    const [statesLoading, setStatesLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(false);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        city: '',
        cityId: null,
        state: '',
        stateId: null,
        pincode: ''
    });

    const [errors, setErrors] = useState({});

    // Fetch all states on component mount
    useEffect(() => {
        fetchStates();
    }, []);

    // Filter states based on search
    useEffect(() => {
        if (states.length > 0) {
            const filtered = states.filter(state =>
                state.name.toLowerCase().includes(stateSearch.toLowerCase())
            );
            setFilteredStates(filtered);
        }
    }, [stateSearch, states]);

    // Filter cities based on search
    useEffect(() => {
        if (cities.length > 0) {
            const filtered = cities.filter(city =>
                city.name.toLowerCase().includes(citySearch.toLowerCase())
            );
            setFilteredCities(filtered);
        }
    }, [citySearch, cities]);

    // Fetch cities when state is selected
    useEffect(() => {
        if (formData.stateId) {
            fetchCitiesByState(formData.stateId);
        } else {
            setCities([]);
            setFilteredCities([]);
        }
    }, [formData.stateId]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (stateRef.current && !stateRef.current.contains(event.target)) {
                setStateDropdownOpen(false);
            }
            if (cityRef.current && !cityRef.current.contains(event.target)) {
                setCityDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch all states from the provided API
    const fetchStates = async () => {
        setStatesLoading(true);
        try {
            // Using the provided API for Indian states
            const response = await fetch(`${API_BASE}/states/101.min.json`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch states');
            }

            const data = await response.json();
            // Transform the data to match your format
            const transformedStates = data.map(state => ({
                id: state.id,
                name: state.name
            }));
            setStates(transformedStates);
            setFilteredStates(transformedStates);
        } catch (error) {
            console.error("Error fetching states:", error);
            toast.error("Failed to load states. Please refresh the page.");
            setStates([]);
            setFilteredStates([]);
        } finally {
            setStatesLoading(false);
        }
    };

    // Fetch cities based on selected state ID from the provided API
    const fetchCitiesByState = async (stateId) => {
        setCitiesLoading(true);
        try {
            // Using the provided API for cities by state ID
            const response = await fetch(`${API_BASE}/cities/${stateId}.min.json`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }

            const data = await response.json();
            // The API returns array of objects with id and name
            setCities(data);
            setFilteredCities(data);
        } catch (error) {
            console.error("Error fetching cities:", error);
            toast.error("Failed to load cities");
            setCities([]);
            setFilteredCities([]);
        } finally {
            setCitiesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Add length restriction for pincode
        if (name === 'pincode' && value.length > 6) {
            return; // Don't update if exceeds 6 digits
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Clear city when state changes
        if (name === 'state') {
            setFormData(prev => ({
                ...prev,
                city: '',
                cityId: null,
                stateId: null,
                [name]: value
            }));
            setCitySearch('');
        }
    };

    const handleStateSelect = (state) => {
        setFormData(prev => ({ 
            ...prev, 
            state: state.name, 
            stateId: state.id,
            city: '', 
            cityId: null 
        }));
        setStateDropdownOpen(false);
        setStateSearch('');

        if (errors.state) {
            setErrors(prev => ({ ...prev, state: '' }));
        }
    };

    const handleCitySelect = (city) => {
        setFormData(prev => ({ 
            ...prev, 
            city: city.name,
            cityId: city.id 
        }));
        setCityDropdownOpen(false);
        setCitySearch('');

        if (errors.city) {
            setErrors(prev => ({ ...prev, city: '' }));
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

    const generateBeneficiaryId = () => {
        const prefix = 'BEN';
        const year = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${year}-${random}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Generate beneficiary ID (in real app, this would come from backend)
            const beneficiaryId = generateBeneficiaryId();
            
            // Show success message
            toast.success("Beneficiary registered successfully!");
            
            // Reset form
            setFormData({
                name: '',
                gender: '',
                dateOfBirth: '',
                address: '',
                city: '',
                cityId: null,
                state: '',
                stateId: null,
                pincode: ''
            });
            setErrors({});
            
            // Redirect to beneficiary list
            setTimeout(() => {
                navigate(PATHROUTES.beneficiaryList);
            }, 1500);
            
        } catch (error) {
            console.error('Error creating beneficiary:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(PATHROUTES.beneficiaryList);
    };

    const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

    return (
        <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            {/* Header with back button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleCancel}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                    disabled={isSubmitting}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Beneficiary</h1>
                    <p className="text-gray-600 dark:text-gray-400">Register a new beneficiary in the system</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                            <User className="text-primary-600 dark:text-primary-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name <RequiredStar />
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors dark:bg-gray-700 dark:text-white ${
                                        errors.name 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="Enter full name"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Gender <RequiredStar />
                            </label>
                            <div className="relative">
                                <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors appearance-none dark:bg-gray-700 dark:text-white ${
                                        errors.gender 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    <option value="" className="dark:bg-gray-700">Select Gender</option>
                                    <option value="male" className="dark:bg-gray-700">Male</option>
                                    <option value="female" className="dark:bg-gray-700">Female</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                            </div>
                            {errors.gender && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.gender}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date of Birth <RequiredStar />
                            </label>
                            <div className="relative">
                                <FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors dark:bg-gray-700 dark:text-white ${
                                        errors.dateOfBirth 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.dateOfBirth && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <MapPin className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Address Information</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Address Textarea */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Complete Address <RequiredStar />
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors dark:bg-gray-700 dark:text-white ${
                                    errors.address 
                                        ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                                placeholder="Enter complete address with landmark, street, etc."
                                disabled={isSubmitting}
                            />
                            {errors.address && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.address}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* State Dropdown - Custom */}
                            <div className="relative" ref={stateRef}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    State <RequiredStar />
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" size={18} />
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        readOnly
                                        className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                            errors.state 
                                                ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                        }`}
                                        placeholder={statesLoading ? "Loading states..." : "Select state"}
                                        onClick={() => !isSubmitting && !statesLoading && setStateDropdownOpen(!stateDropdownOpen)}
                                        disabled={isSubmitting || statesLoading}
                                    />
                                    <ChevronDown
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 ${!isSubmitting && !statesLoading ? 'cursor-pointer' : 'opacity-50'}`}
                                        size={20}
                                        onClick={() => !isSubmitting && !statesLoading && setStateDropdownOpen(!stateDropdownOpen)}
                                    />

                                    {stateDropdownOpen && !isSubmitting && !statesLoading && (
                                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/30 max-h-60 overflow-hidden">
                                            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                                <input
                                                    type="text"
                                                    value={stateSearch}
                                                    onChange={(e) => setStateSearch(e.target.value)}
                                                    placeholder="Search state..."
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {statesLoading ? (
                                                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                                                        Loading states...
                                                    </div>
                                                ) : filteredStates.length > 0 ? (
                                                    filteredStates.map(state => (
                                                        <div
                                                            key={state.id}
                                                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-gray-900 dark:text-white"
                                                            onClick={() => handleStateSelect(state)}
                                                        >
                                                            {state.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                                                        No states found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {statesLoading && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading states...</p>
                                )}
                                {errors.state && (
                                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.state}</p>
                                )}
                            </div>

                            {/* City Dropdown - Custom */}
                            <div className="relative" ref={cityRef}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    City <RequiredStar />
                                </label>
                                <div className="relative">
                                    <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" size={18} />
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        readOnly
                                        className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                            errors.city 
                                                ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                        } ${!formData.state ? 'bg-gray-100 dark:bg-gray-600/50' : ''}`}
                                        placeholder={!formData.state ? "Select state first" : (citiesLoading ? "Loading cities..." : "Select city")}
                                        onClick={() => {
                                            if (formData.state && !isSubmitting && !citiesLoading) {
                                                setCityDropdownOpen(!cityDropdownOpen);
                                            }
                                        }}
                                        disabled={!formData.state || isSubmitting || citiesLoading}
                                    />
                                    <ChevronDown
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 ${formData.state && !isSubmitting && !citiesLoading ? 'cursor-pointer' : 'opacity-50'}`}
                                        size={20}
                                        onClick={() => {
                                            if (formData.state && !isSubmitting && !citiesLoading) {
                                                setCityDropdownOpen(!cityDropdownOpen);
                                            }
                                        }}
                                    />

                                    {cityDropdownOpen && formData.state && !isSubmitting && !citiesLoading && (
                                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/30 max-h-60 overflow-hidden">
                                            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                                <input
                                                    type="text"
                                                    value={citySearch}
                                                    onChange={(e) => setCitySearch(e.target.value)}
                                                    placeholder="Search city..."
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {citiesLoading ? (
                                                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                                                        Loading cities...
                                                    </div>
                                                ) : filteredCities.length > 0 ? (
                                                    filteredCities.map(city => (
                                                        <div
                                                            key={city.id}
                                                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-gray-900 dark:text-white"
                                                            onClick={() => handleCitySelect(city)}
                                                        >
                                                            {city.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                                                        No cities found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!formData.state && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please select state first</p>
                                )}
                                {citiesLoading && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading cities...</p>
                                )}
                                {errors.city && (
                                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.city}</p>
                                )}
                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pincode <RequiredStar />
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        maxLength="6"
                                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors dark:bg-gray-700 dark:text-white ${
                                            errors.pincode 
                                                ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                        }`}
                                        placeholder="Enter 6-digit pincode"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.pincode && (
                                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.pincode}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || statesLoading || citiesLoading}
                        className="px-8 py-2.5 bg-primary-600 dark:from-primary-500 dark:to-secondary-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[200px] disabled:opacity-50 font-medium shadow-sm"
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
                            'Register Beneficiary'
                        )}
                    </button>
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

export default AddBeneficiary;