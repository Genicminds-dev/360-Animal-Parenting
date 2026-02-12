// pages/health-checkup/HealthCheckForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    Heart,
    FileText,
    CheckCircle,
    Thermometer,
    Calendar,
    Stethoscope,
    ArrowLeft,
    Plus,
    Trash2,
    User,
    Phone,
    FileUp,
    Upload
} from "lucide-react";
import { PATHROUTES } from "../../routes/pathRoutes";

const HealthCheckupForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { animalData } = location.state || {};

    // Add isSubmitting state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Veterinary officers data
    const veterinaryOfficers = [
        { id: 1, name: "Dr. Rajesh Kumar", mobile: "9876543210" },
        { id: 2, name: "Dr. Priya Sharma", mobile: "8765432109" },
        { id: 3, name: "Dr. Amit Patel", mobile: "7654321098" },
        { id: 4, name: "Dr. Sunita Reddy", mobile: "6543210987" },
        { id: 5, name: "Dr. Vikram Singh", mobile: "5432109876" },
    ];

    const [formData, setFormData] = useState({
        // Basic Info
        vetOfficer: '',
        checkDate: new Date().toISOString().split('T')[0],

        // Vital Signs (Not Mandatory)
        temperature: '',
        heartRate: '',

        // Health Assessment (Not Mandatory)
        generalCondition: '',
        appetite: '',
        hydration: '',
        mobility: '',

        // Vaccination (Not Mandatory)
        vaccinated: 'no',
        vaccinations: [],

        // Vet Approval (Mandatory)
        vetApproval: 'pending',
        // Remark Field (Not Mandatory)
        remark: '',

        // Health Certificate Upload (Not Mandatory)
        healthCertificate: null,
        healthCertificateName: '',

        // Animal Info from previous page
        animalId: '',
        animalTagId: '',
        sellerName: ''
    });

    const [newVaccination, setNewVaccination] = useState({
        vaccinationType: '',
        vaccinationName: '',
        vaccinationDate: '',
        batchNo: ''
    });

    useEffect(() => {
        if (animalData) {
            setFormData(prev => ({
                ...prev,
                animalId: animalData.animalId || '',
                animalTagId: animalData.animalTagId || '',
                sellerName: animalData.sellerName || ''
            }));
        }
    }, [animalData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }
            
            // Check file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Please upload only PDF, JPEG, or PNG files");
                return;
            }

            setFormData(prev => ({
                ...prev,
                healthCertificate: file,
                healthCertificateName: file.name
            }));
            
            toast.success("File uploaded successfully");
        }
    };

    const handleVaccinationChange = (e) => {
        const { name, value } = e.target;
        setNewVaccination(prev => ({ ...prev, [name]: value }));
    };

    const addVaccination = () => {
        // Check if at least one field is filled
        const hasData = newVaccination.vaccinationType || 
                       newVaccination.vaccinationName || 
                       newVaccination.vaccinationDate || 
                       newVaccination.batchNo;
        
        if (!hasData) {
            toast.error("Please fill at least one vaccination detail");
            return;
        }

        // Validate date if provided
        if (newVaccination.vaccinationDate) {
            const selectedDate = new Date(newVaccination.vaccinationDate);
            const today = new Date();
            if (selectedDate > today) {
                toast.error("Vaccination date cannot be in the future");
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            vaccinations: [...prev.vaccinations, { 
                ...newVaccination, 
                id: Date.now(),
                vaccinationType: newVaccination.vaccinationType || 'N/A',
                vaccinationName: newVaccination.vaccinationName || 'N/A',
                vaccinationDate: newVaccination.vaccinationDate || 'N/A',
                batchNo: newVaccination.batchNo || 'N/A'
            }]
        }));

        setNewVaccination({
            vaccinationType: '',
            vaccinationName: '',
            vaccinationDate: '',
            batchNo: ''
        });

        toast.success("Vaccination record added");
    };

    const removeVaccination = (id) => {
        setFormData(prev => ({
            ...prev,
            vaccinations: prev.vaccinations.filter(v => v.id !== id)
        }));
        toast.success("Vaccination record removed");
    };

    const removeHealthCertificate = () => {
        setFormData(prev => ({
            ...prev,
            healthCertificate: null,
            healthCertificateName: ''
        }));
        toast.success("Health certificate removed");
    };

    const validateForm = () => {
        // Validate only mandatory fields
        if (!formData.vetOfficer) {
            toast.error("Please select a Veterinary Officer");
            return false;
        }
        if (!formData.checkDate) {
            toast.error("Please select Check Date");
            return false;
        }
        if (!formData.vetApproval) {
            toast.error("Please select Vet Approval Status");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Here you would typically send the data to your backend
            console.log('Health check submitted:', {
                ...formData,
                // Convert file to base64 or FormData for actual API
                healthCertificate: formData.healthCertificate ? {
                    name: formData.healthCertificate.name,
                    type: formData.healthCertificate.type,
                    size: formData.healthCertificate.size
                } : null
            });

            toast.success('Health check submitted successfully!');
            navigate('/health-checkup');
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit health check. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        navigate(PATHROUTES.healthCheckupList);
    };

    const selectedVet = veterinaryOfficers.find(vet => vet.id.toString() === formData.vetOfficer);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isSubmitting}
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Health CheckUp Form</h1>
                    <p className="text-gray-600">Record animal health examination details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Single Combined Form Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-8">
                        {/* Animal Information - Display Only */}
                        {formData.animalId && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-blue-800 mb-2">Animal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-xs text-blue-600">Animal ID</span>
                                        <p className="font-medium text-blue-900">{formData.animalId}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-blue-600">Tag ID</span>
                                        <p className="font-medium text-blue-900">{formData.animalTagId}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-blue-600">Seller Name</span>
                                        <p className="font-medium text-blue-900">{formData.sellerName}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Row 1: Examination Details (Mandatory) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Veterinary Officer Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        name="vetOfficer"
                                        value={formData.vetOfficer}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 input-field"
                                        required
                                        disabled={isSubmitting}
                                    >
                                        <option value="">Select Veterinary Officer</option>
                                        {veterinaryOfficers.map(vet => (
                                            <option key={vet.id} value={vet.id}>
                                                {vet.name} - {vet.mobile}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Check Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="checkDate"
                                        value={formData.checkDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 input-field"
                                        required
                                        disabled={isSubmitting}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Vital Signs (Optional) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Temperature (°C)
                                </label>
                                <div className="relative">
                                    <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        name="temperature"
                                        value={formData.temperature}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 input-field"
                                        placeholder="Enter temperature"
                                        step="0.1"
                                        min="35"
                                        max="42"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Heart Rate (BPM)
                                </label>
                                <div className="relative">
                                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        name="heartRate"
                                        value={formData.heartRate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 input-field"
                                        placeholder="Enter heart rate"
                                        min="40"
                                        max="120"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Health Assessment (Optional) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    General Condition
                                </label>
                                <select
                                    name="generalCondition"
                                    value={formData.generalCondition}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 input-field"
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select General Condition</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Poor">Poor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appetite
                                </label>
                                <select
                                    name="appetite"
                                    value={formData.appetite}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 input-field"
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select Appetite</option>
                                    <option value="Good">Good</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Poor">Poor</option>
                                    <option value="None">None</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hydration
                                </label>
                                <select
                                    name="hydration"
                                    value={formData.hydration}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 input-field"
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select Hydration</option>
                                    <option value="Good">Good</option>
                                    <option value="Adequate">Adequate</option>
                                    <option value="Dehydrated">Dehydrated</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobility
                                </label>
                                <select
                                    name="mobility"
                                    value={formData.mobility}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 input-field"
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select Mobility</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Slightly Lame">Slightly Lame</option>
                                    <option value="Severely Lame">Severely Lame</option>
                                    <option value="Unable to Move">Unable to Move</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 4: Vaccination Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Is the animal vaccinated?
                                </label>
                                <div className="flex space-x-4">
                                    {['yes', 'no'].map(option => (
                                        <label key={option} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="vaccinated"
                                                value={option}
                                                checked={formData.vaccinated === option}
                                                onChange={handleChange}
                                                className="text-red-600 focus:ring-red-500"
                                                disabled={isSubmitting}
                                            />
                                            <span className="ml-2 capitalize">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {formData.vaccinated === 'yes' && (
                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                    {/* Add New Vaccination Form */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Add Vaccination Record</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Vaccination Type</label>
                                                <select
                                                    name="vaccinationType"
                                                    value={newVaccination.vaccinationType}
                                                    onChange={handleVaccinationChange}
                                                    className="w-full px-3 py-2 input-field text-sm"
                                                    disabled={isSubmitting}
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="LSD">LSD Vaccination</option>
                                                    <option value="FMD">FMD Vaccination</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Vaccination Name</label>
                                                <input
                                                    type="text"
                                                    name="vaccinationName"
                                                    value={newVaccination.vaccinationName}
                                                    onChange={handleVaccinationChange}
                                                    className="w-full px-3 py-2 input-field text-sm"
                                                    placeholder="Enter vaccine name"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Vaccination Date</label>
                                                <input
                                                    type="date"
                                                    name="vaccinationDate"
                                                    value={newVaccination.vaccinationDate}
                                                    onChange={handleVaccinationChange}
                                                    className="w-full px-3 py-2 input-field text-sm"
                                                    disabled={isSubmitting}
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Batch No.</label>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        name="batchNo"
                                                        value={newVaccination.batchNo}
                                                        onChange={handleVaccinationChange}
                                                        className="flex-1 px-3 py-2 input-field text-sm"
                                                        placeholder="Enter batch no"
                                                        disabled={isSubmitting}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addVaccination}
                                                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Display Added Vaccinations */}
                                    {formData.vaccinations.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-gray-700">Added Vaccinations</h3>
                                            {formData.vaccinations.map((vaccination) => (
                                                <div key={vaccination.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                                                        <span className="text-sm">
                                                            <span className="font-medium">Type:</span> {vaccination.vaccinationType}
                                                        </span>
                                                        <span className="text-sm">
                                                            <span className="font-medium">Name:</span> {vaccination.vaccinationName}
                                                        </span>
                                                        <span className="text-sm">
                                                            <span className="font-medium">Date:</span> {vaccination.vaccinationDate}
                                                        </span>
                                                        <span className="text-sm">
                                                            <span className="font-medium">Batch:</span> {vaccination.batchNo}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVaccination(vaccination.id)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Row 5: Vet Approval (Mandatory) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vet Approval Status <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { value: 'approved', label: 'Approved', color: 'text-green-600' },
                                    { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
                                    { value: 'pending', label: 'Pending', color: 'text-yellow-600' }
                                ].map(option => (
                                    <label key={option.value} className={`flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <input
                                            type="radio"
                                            name="vetApproval"
                                            value={option.value}
                                            checked={formData.vetApproval === option.value}
                                            onChange={handleChange}
                                            className="text-red-600 focus:ring-red-500"
                                            required
                                            disabled={isSubmitting}
                                        />
                                        <span className={`ml-2 font-medium ${option.color}`}>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Row 6: Remark Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Remark
                            </label>
                            <textarea
                                name="remark"
                                value={formData.remark}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 input-field"
                                placeholder="Enter any additional remarks or comments..."
                                disabled={isSubmitting}
                            ></textarea>
                        </div>

                        {/* Row 7: Health Certificate Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Health Certificate
                            </label>
                            <div className="space-y-4">
                                {!formData.healthCertificate ? (
                                    <div className="flex items-center justify-center w-full">
                                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                <p className="mb-1 text-sm text-gray-700">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PDF, JPEG, PNG (MAX. 5MB)
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                disabled={isSubmitting}
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="text-gray-500" size={20} />
                                            <span className="text-sm font-medium text-gray-700">
                                                {formData.healthCertificateName}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeHealthCertificate}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500">
                                    This field is optional. You can upload health certificate documents here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[120px]  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            'Submit Health Check'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HealthCheckupForm;