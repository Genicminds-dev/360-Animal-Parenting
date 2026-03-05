import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Calendar, Clock, Upload, FileText,
    X, Eye, File, Search, ChevronDown, Image, Video,
    CheckCircle, AlertCircle, Camera, DollarSign,
    Percent, Hash, Type, BookOpen, Save
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Scheme</h1>
                <p className="text-gray-600">Add a new scheme to the system</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Scheme Details Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <BookOpen className="text-primary-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Scheme Details</h2>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Scheme Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="schemeName"
                                    value={formData.schemeName}
                                    onChange={handleChange}
                                    className={`w-full pl-10 px-4 py-2 border ${errors.schemeName ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                                    placeholder="Enter scheme name (e.g., PM Kisan Samman Nidhi)"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {errors.schemeName && (
                                <p className="text-red-500 text-xs mt-1">{errors.schemeName}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Indicator - Hidden */}
                <input type="hidden" name="status" value="active" />

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
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
                        className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
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
        </div>
    );
};

export default AddScheme;