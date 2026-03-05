import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, User, Syringe, Shield, AlertCircle, ChevronLeft, ArrowLeft } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../../services/api/api';
import { PATHROUTES } from '../../../routes/pathRoutes';
import { Endpoints } from '../../../services/api/EndPoint';

const VaccinationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const batch = location.state?.batch;

    const [formData, setFormData] = useState({
        // Brucella Screening
        brucellaDate: '',
        brucellaResult: '',

        // FMD Vaccination
        fmdBy: '',
        fmdDate: '',
        fmdBatchNo: '',
        fmdExpiryDate: '',

        // LSD Vaccination
        lsdBy: '',
        lsdDate: '',
        lsdBatchNo: '',
        lsdExpiryDate: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if no batch data
    React.useEffect(() => {
        if (!batch) {
            toast.error('No batch data found');
            navigate(PATHROUTES.batchList);
        }
    }, [batch, navigate]);

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

        // Brucella Screening validation
        if (!formData.brucellaDate) {
            newErrors.brucellaDate = 'Brucella screening date is required';
        }
        if (!formData.brucellaResult) {
            newErrors.brucellaResult = 'Please select Brucella screening result';
        }

        // FMD Vaccination validation
        if (!formData.fmdBy) {
            newErrors.fmdBy = 'FMD administered by is required';
        }
        if (!formData.fmdDate) {
            newErrors.fmdDate = 'FMD vaccination date is required';
        }
        if (!formData.fmdBatchNo) {
            newErrors.fmdBatchNo = 'FMD batch number is required';
        }
        if (!formData.fmdExpiryDate) {
            newErrors.fmdExpiryDate = 'FMD expiry date is required';
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiryDate = new Date(formData.fmdExpiryDate);
            if (expiryDate < today) {
                newErrors.fmdExpiryDate = 'Expiry date cannot be in the past';
            }
        }

        // LSD Vaccination validation
        if (!formData.lsdBy) {
            newErrors.lsdBy = 'LSD administered by is required';
        }
        if (!formData.lsdDate) {
            newErrors.lsdDate = 'LSD vaccination date is required';
        }
        if (!formData.lsdBatchNo) {
            newErrors.lsdBatchNo = 'LSD batch number is required';
        }
        if (!formData.lsdExpiryDate) {
            newErrors.lsdExpiryDate = 'LSD expiry date is required';
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiryDate = new Date(formData.lsdExpiryDate);
            if (expiryDate < today) {
                newErrors.lsdExpiryDate = 'Expiry date cannot be in the past';
            }
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

            // Prepare data for API
            const vaccinationData = {
                batchId: batch.batchId,
                animals: batch.animals.map(animal => ({
                    earTagId: animal.earTagId,
                    brucellaScreening: {
                        date: formData.brucellaDate,
                        result: formData.brucellaResult
                    },
                    fmdVaccination: {
                        administeredBy: formData.fmdBy,
                        date: formData.fmdDate,
                        batchNo: formData.fmdBatchNo,
                        expiryDate: formData.fmdExpiryDate
                    },
                    lsdVaccination: {
                        administeredBy: formData.lsdBy,
                        date: formData.lsdDate,
                        batchNo: formData.lsdBatchNo,
                        expiryDate: formData.lsdExpiryDate
                    }
                }))
            };

            // Make API call
            const response = await api.post(Endpoints.UPDATE_VACCINATION, vaccinationData);

            if (response.data.success) {
                toast.success('Vaccination details updated successfully!');

                // Navigate back to batch list after a short delay
                setTimeout(() => {
                    navigate(PATHROUTES.batchList);
                }, 1500);
            } else {
                toast.error(response.data.message || 'Failed to update vaccination details');
            }
        } catch (error) {
            console.error('Error updating vaccination:', error);

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

    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    if (!batch) {
        return null;
    }

    const handleCancel = () => {
        navigate(PATHROUTES.animalBatches);
    };


    return (
        <div className="space-y-6">

            {/* Header */}
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
                        <h1 className="text-2xl font-bold text-gray-900">Vaccination Details</h1>
                        <p className="text-gray-600">Update vaccination records for Batch: <span className='text-primary-600 text-sm font-medium'>{batch.batchId}</span></p>
                    </div>
                </div>
            </div>

            {/* Batch Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <span className="text-xs text-gray-500">Procurement Officer</span>
                        <p className="font-medium text-gray-900">{batch.procurementOfficer}</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500">Broker</span>
                        <p className="font-medium text-gray-900">{batch.broker}</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500">Source Location</span>
                        <p className="font-medium text-gray-900">{batch.sourceLocation}</p>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Batch Size: {batch.batchSize}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600 font-medium">Ear Tag IDs:</span>
                        <p className="text-sm text-gray-900 font-medium">
                            {batch.animals.map(a => a.earTagId).join(', ')}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Brucella Screening Section */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Shield className="text-purple-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Brucella Screening Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    name="brucellaDate"
                                    value={formData.brucellaDate}
                                    onChange={handleChange}
                                    max={getCurrentDate()}
                                    className={`input-field pl-10 ${errors.brucellaDate ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.brucellaDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.brucellaDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Result <span className="text-red-500">*</span>
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="brucellaResult"
                                        value="Negative"
                                        checked={formData.brucellaResult === 'Negative'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary-600"
                                        disabled={isSubmitting}
                                    />
                                    <span className="text-sm text-gray-700">Negative</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="brucellaResult"
                                        value="Positive"
                                        checked={formData.brucellaResult === 'Positive'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary-600"
                                        disabled={isSubmitting}
                                    />
                                    <span className="text-sm text-gray-700">Positive</span>
                                </label>
                            </div>
                            {errors.brucellaResult && (
                                <p className="text-red-500 text-xs mt-1">{errors.brucellaResult}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* FMD Vaccination Section */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Syringe className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">FMD Vaccination Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Administered By <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fmdBy"
                                value={formData.fmdBy}
                                onChange={handleChange}
                                className={`input-field ${errors.fmdBy ? 'border-red-500' : ''}`}
                                placeholder="Enter name of person/admin"
                                disabled={isSubmitting}
                            />
                            {errors.fmdBy && (
                                <p className="text-red-500 text-xs mt-1">{errors.fmdBy}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    name="fmdDate"
                                    value={formData.fmdDate}
                                    onChange={handleChange}
                                    max={getCurrentDate()}
                                    className={`input-field pl-10 ${errors.fmdDate ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.fmdDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.fmdDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Batch No. <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fmdBatchNo"
                                value={formData.fmdBatchNo}
                                onChange={handleChange}
                                className={`input-field ${errors.fmdBatchNo ? 'border-red-500' : ''}`}
                                placeholder="Enter batch number"
                                disabled={isSubmitting}
                            />
                            {errors.fmdBatchNo && (
                                <p className="text-red-500 text-xs mt-1">{errors.fmdBatchNo}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    name="fmdExpiryDate"
                                    value={formData.fmdExpiryDate}
                                    onChange={handleChange}
                                    min={getCurrentDate()}
                                    className={`input-field pl-10 ${errors.fmdExpiryDate ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.fmdExpiryDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.fmdExpiryDate}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* LSD Vaccination Section */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Syringe className="text-orange-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">LSD Vaccination Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Administered By <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lsdBy"
                                value={formData.lsdBy}
                                onChange={handleChange}
                                className={`input-field ${errors.lsdBy ? 'border-red-500' : ''}`}
                                placeholder="Enter name of person/admin"
                                disabled={isSubmitting}
                            />
                            {errors.lsdBy && (
                                <p className="text-red-500 text-xs mt-1">{errors.lsdBy}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    name="lsdDate"
                                    value={formData.lsdDate}
                                    onChange={handleChange}
                                    max={getCurrentDate()}
                                    className={`input-field pl-10 ${errors.lsdDate ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.lsdDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.lsdDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Batch No. <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lsdBatchNo"
                                value={formData.lsdBatchNo}
                                onChange={handleChange}
                                className={`input-field ${errors.lsdBatchNo ? 'border-red-500' : ''}`}
                                placeholder="Enter batch number"
                                disabled={isSubmitting}
                            />
                            {errors.lsdBatchNo && (
                                <p className="text-red-500 text-xs mt-1">{errors.lsdBatchNo}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    name="lsdExpiryDate"
                                    value={formData.lsdExpiryDate}
                                    onChange={handleChange}
                                    min={getCurrentDate()}
                                    className={`input-field pl-10 ${errors.lsdExpiryDate ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.lsdExpiryDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.lsdExpiryDate}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
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
                        className={`px-6 py-2 bg-primary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[120px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Vaccination Details'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VaccinationForm;