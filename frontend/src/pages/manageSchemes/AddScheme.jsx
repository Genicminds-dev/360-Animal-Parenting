import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Calendar, Clock, Upload, FileText,
    X, Eye, File, Search, ChevronDown, Image, Video,
    CheckCircle, AlertCircle, Camera, DollarSign,
    Percent, Hash, Type, BookOpen, Save, ArrowLeft
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { PATHROUTES } from '../../routes/pathRoutes';

const AddScheme = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        schemeName: '',
        status: 'active'
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.schemeName.trim()) {
            newErrors.schemeName = 'Scheme name is required';
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
            toast.success('Scheme created successfully!');

            // Redirect to scheme list page
            setTimeout(() => {
                navigate(PATHROUTES.schemeList);
            }, 1500);

        } catch (error) {
            console.error('Error creating scheme:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(PATHROUTES.schemeList);
    };

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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Scheme</h1>
                    <p className="text-gray-600 dark:text-gray-400">Add a new scheme to the system</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Scheme Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                            <BookOpen className="text-primary-600 dark:text-primary-400" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Scheme Details</h2>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Scheme Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="schemeName"
                                    value={formData.schemeName}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                        errors.schemeName 
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="Enter scheme name (e.g., PM Kisan Samman Nidhi)"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {errors.schemeName && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.schemeName}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Indicator - Hidden */}
                <input type="hidden" name="status" value="active" />

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Create Scheme
                            </>
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

export default AddScheme;