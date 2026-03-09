// pages/holding-station/HoldingStationRegistration.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
    Camera, X, ChevronDown, Save, ArrowLeft, MapPin, Building2, Upload, Eye, File, Image as ImageIcon, Video
} from 'lucide-react';
import { PATHROUTES } from '../../../routes/pathRoutes';
import api from '../../../services/api/api';
import { Endpoints } from '../../../services/api/EndPoint';

const AddHoldingStation = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        photo: null,
        video: null,
        state: '',
        city: '',
        pinCode: '',
        address: '',
        stateId: null,
        cityId: null
    });

    const [errors, setErrors] = useState({});
    const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const stateRef = useRef(null);
    const cityRef = useRef(null);

    // API base URL from the provided endpoints
    const API_BASE = 'https://hapilocations.web.app';

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
    
    // Clean up preview URLs
    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [photoPreview, videoPreview]);

    // Fetch all states from the provided API
    const fetchStates = async () => {
        setLoading(true);
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
            
            // Empty states array instead of fallback to ensure user knows there's an issue
            setStates([]);
            setFilteredStates([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch cities based on selected state ID from the provided API
    const fetchCitiesByState = async (stateId) => {
        setLoading(true);
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
            setLoading(false);
        }
    };

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

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Add length restriction for pin code
        if (name === 'pinCode' && value.length > 6) {
            return; // Don't update if exceeds 6 digits
        }

        if (files && files[0]) {
            const file = files[0];

            // Validate file type
            if (name === 'photo' && !file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            if (name === 'video' && !file.type.startsWith('video/')) {
                toast.error('Please select a video file');
                return;
            }

            setFormData(prev => ({ ...prev, [name]: file }));

            // Clear previous preview
            if (name === 'photo' && photoPreview) {
                URL.revokeObjectURL(photoPreview);
                setPhotoPreview(null);
            }
            if (name === 'video' && videoPreview) {
                URL.revokeObjectURL(videoPreview);
                setVideoPreview(null);
            }

            // Set preview
            if (name === 'photo' && file.type.startsWith('image/')) {
                setPhotoPreview(URL.createObjectURL(file));
            }
            if (name === 'video' && file.type.startsWith('video/')) {
                setVideoPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

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

    const removeMedia = (type) => {
        if (type === 'photo') {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
                setPhotoPreview(null);
            }
            setFormData(prev => ({ ...prev, photo: null }));
        } else if (type === 'video') {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
                setVideoPreview(null);
            }
            setFormData(prev => ({ ...prev, video: null }));
        }
    };

    const getDisplayFileName = (file, type) => {
        if (!file) return '';

        const extension = file.name.split('.').pop().toLowerCase();
        return `Station_${type}.${extension}`;
    };

    const openMedia = (type) => {
        if (type === 'photo' && photoPreview) {
            window.open(photoPreview, '_blank');
        } else if (type === 'video' && videoPreview) {
            window.open(videoPreview, '_blank');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required field validations
        if (!formData.name.trim()) {
            newErrors.name = 'Holding station name is required';
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.pinCode.trim()) {
            newErrors.pinCode = 'Pin code is required';
        } else if (!/^\d{6}$/.test(formData.pinCode)) {
            newErrors.pinCode = 'Pin code must be 6 digits';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
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
            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name.trim());
            formDataToSend.append('state', formData.state.trim());
            formDataToSend.append('stateId', formData.stateId);
            formDataToSend.append('city', formData.city.trim());
            formDataToSend.append('cityId', formData.cityId);
            formDataToSend.append('pinCode', formData.pinCode.trim());
            formDataToSend.append('address', formData.address.trim());

            // Append files only if they exist
            if (formData.photo) {
                formDataToSend.append('stationPhoto', formData.photo);
            }

            if (formData.video) {
                formDataToSend.append('stationVideo', formData.video);
            }

            // Make API call
            const response = await api.post(Endpoints.CREATE_HOLDING_STATION, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                // Show success toast
                toast.success(response.data.message || 'Holding station registered successfully!');

                // Clean up preview URLs
                if (photoPreview) {
                    URL.revokeObjectURL(photoPreview);
                }
                if (videoPreview) {
                    URL.revokeObjectURL(videoPreview);
                }

                // Reset form
                setFormData({
                    name: '',
                    photo: null,
                    video: null,
                    state: '',
                    city: '',
                    pinCode: '',
                    address: '',
                    stateId: null,
                    cityId: null
                });
                setErrors({});
                setPhotoPreview(null);
                setVideoPreview(null);

                // Navigate to holding stations list page after a short delay
                setTimeout(() => {
                    navigate(PATHROUTES.holdingStations);
                }, 1500);

            } else {
                // Handle API error messages
                const errorMessage = response.data.message || 'Failed to register holding station';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error registering holding station:', error);

            // Handle different error types
            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error.response) {
                // Server responded with error status
                errorMessage = error.response.data?.message || 'Server error occurred';
            } else if (error.request) {
                // Request was made but no response
                errorMessage = 'Network error. Please check your connection.';
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(PATHROUTES.holdingStationList);
    };

    const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Holding Station Registration</h1>
                    <p className="text-gray-600 dark:text-gray-400">Register new holding station for animal care</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Holding Station Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                            <Building2 className="text-primary-600 dark:text-primary-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Station Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Holding Station Name <RequiredStar />
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                    errors.name 
                                        ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                                placeholder="Enter holding station name"
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* State */}
                        <div className="relative" ref={stateRef}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                State <RequiredStar />
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    readOnly
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                        errors.state 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="Select state"
                                    onClick={() => !isSubmitting && setStateDropdownOpen(!stateDropdownOpen)}
                                    disabled={isSubmitting}
                                />
                                <ChevronDown
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 ${!isSubmitting ? 'cursor-pointer' : 'opacity-50'}`}
                                    size={20}
                                    onClick={() => !isSubmitting && setStateDropdownOpen(!stateDropdownOpen)}
                                />

                                {stateDropdownOpen && !isSubmitting && (
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
                                            {loading ? (
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
                            {errors.state && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.state}</p>
                            )}
                        </div>

                        {/* City */}
                        <div className="relative" ref={cityRef}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                City <RequiredStar />
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    readOnly
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                        errors.city 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    } ${!formData.state ? 'bg-gray-100 dark:bg-gray-600/50' : ''}`}
                                    placeholder={formData.state ? "Select city" : "Select state first"}
                                    onClick={() => {
                                        if (formData.state && !isSubmitting) {
                                            setCityDropdownOpen(!cityDropdownOpen);
                                        }
                                    }}
                                    disabled={!formData.state || isSubmitting}
                                />
                                <ChevronDown
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 ${!formData.state || isSubmitting ? 'opacity-50' : 'cursor-pointer'}`}
                                    size={20}
                                    onClick={() => {
                                        if (formData.state && !isSubmitting) {
                                            setCityDropdownOpen(!cityDropdownOpen);
                                        }
                                    }}
                                />

                                {cityDropdownOpen && formData.state && !isSubmitting && (
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
                                            {loading ? (
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
                            {errors.city && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.city}</p>
                            )}
                        </div>

                        {/* Pin Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pin Code <RequiredStar />
                            </label>
                            <input
                                type="text"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                maxLength={6}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                    errors.pinCode 
                                        ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                                placeholder="Enter 6-digit pin code"
                                disabled={isSubmitting}
                            />
                            {errors.pinCode && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.pinCode}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Address <RequiredStar />
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                    errors.address 
                                        ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                                placeholder="Enter complete address with landmark, area, etc."
                                disabled={isSubmitting}
                            />
                            {errors.address && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.address}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Media Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <Camera className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Station Media</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Photo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Station Photo
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full">
                                    {formData.photo ? (
                                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white break-all max-w-xs">
                                                            {getDisplayFileName(formData.photo, 'photo')}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {Math.round(formData.photo.size / 1024)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openMedia('photo')}
                                                        className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                                                        title="Preview Image"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedia('photo')}
                                                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        title="Remove"
                                                        disabled={isSubmitting}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {photoPreview && (
                                                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Photo Preview</p>
                                                    </div>
                                                    <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                        <img
                                                            src={photoPreview}
                                                            alt="Station Preview"
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
                                                    Upload Station Photo
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                    Upload photo of the holding station
                                                </p>

                                                <label
                                                    htmlFor="photoUpload"
                                                    className={`px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Browse File
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="photo"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="photoUpload"
                                        accept=".jpg,.jpeg,.png"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Video Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Station Video
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full">
                                    {formData.video ? (
                                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                                        <Video size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white break-all max-w-xs">
                                                            {getDisplayFileName(formData.video, 'video')}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {Math.round(formData.video.size / 1024)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openMedia('video')}
                                                        className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                                                        title="Play Video"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedia('video')}
                                                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        title="Remove"
                                                        disabled={isSubmitting}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {videoPreview && (
                                                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Preview</p>
                                                    </div>
                                                    <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                        <video
                                                            src={videoPreview}
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
                                                    Upload Station Video
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                    Show the facility from all angles
                                                </p>

                                                <label
                                                    htmlFor="videoUpload"
                                                    className={`px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Browse File
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="video"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="videoUpload"
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
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <Save size={16} className="mr-2" />
                                    Register Station
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

export default AddHoldingStation;