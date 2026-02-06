import React, { useState } from 'react';
import { Users, User, MapPin, Phone, Mail, CreditCard, Camera, Upload } from 'lucide-react';

const FarmerRegistration = () => {
    const [formData, setFormData] = useState({
        // Personal Details
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        aadharNumber: '',
        dateOfBirth: '',

        // Address Details
        address: '',
        village: '',
        district: '',
        state: '',
        pincode: '',

        // Bank Details
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',

        // Additional Details
        farmingExperience: '',
        totalLand: '',
        existingAnimals: '',

        // Documents
        aadharCard: null,
        bankPassbook: null,
        photo: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Farmer registration submitted successfully!');
        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            mobile: '',
            email: '',
            aadharNumber: '',
            dateOfBirth: '',
            address: '',
            village: '',
            district: '',
            state: '',
            pincode: '',
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            accountHolderName: '',
            farmingExperience: '',
            totalLand: '',
            existingAnimals: '',
            aadharCard: null,
            bankPassbook: null,
            photo: null
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Farmer Registration</h1>
                <p className="text-gray-600">Register new farmers for animal procurement</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Details Card */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter first name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter last name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="Enter 10-digit mobile number"
                                    pattern="[0-9]{10}"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aadhar Number *
                            </label>
                            <input
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter 12-digit Aadhar number"
                                pattern="[0-9]{12}"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Address Details Card */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <MapPin className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Address Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Complete Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input-field min-h-[80px]"
                                placeholder="Enter complete address with landmarks"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Village/Town *
                            </label>
                            <input
                                type="text"
                                name="village"
                                value={formData.village}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter village/town"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                District *
                            </label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter district"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State *
                            </label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="input-field"
                                required
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
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                PIN Code *
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter 6-digit PIN code"
                                pattern="[0-9]{6}"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Bank Details Card */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <CreditCard className="text-purple-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Bank Details (for Payment)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name *
                            </label>
                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter bank name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number *
                            </label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter account number"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                IFSC Code *
                            </label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter IFSC code"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Holder Name *
                            </label>
                            <input
                                type="text"
                                name="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="As per bank records"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Details Card */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Users className="text-yellow-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Farming Experience (Years)
                            </label>
                            <input
                                type="number"
                                name="farmingExperience"
                                value={formData.farmingExperience}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter years"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Total Land (Acres)
                            </label>
                            <input
                                type="number"
                                name="totalLand"
                                value={formData.totalLand}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter land in acres"
                                min="0"
                                step="0.1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Existing Animals Count
                            </label>
                            <input
                                type="number"
                                name="existingAnimals"
                                value={formData.existingAnimals}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter number of animals"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Document Upload Card */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Camera className="text-red-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Document Upload</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aadhar Card *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                <p className="text-sm text-gray-600 mb-2">Upload Aadhar Card (PDF/Image)</p>
                                <input
                                    type="file"
                                    name="aadharCard"
                                    onChange={handleChange}
                                    className="hidden"
                                    id="aadharCard"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label
                                    htmlFor="aadharCard"
                                    className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-primary-100"
                                >
                                    Choose File
                                </label>
                                {formData.aadharCard && (
                                    <p className="text-xs text-green-600 mt-2">✓ {formData.aadharCard.name}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Passbook *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                <p className="text-sm text-gray-600 mb-2">Upload Passbook (PDF/Image)</p>
                                <input
                                    type="file"
                                    name="bankPassbook"
                                    onChange={handleChange}
                                    className="hidden"
                                    id="bankPassbook"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label
                                    htmlFor="bankPassbook"
                                    className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-primary-100"
                                >
                                    Choose File
                                </label>
                                {formData.bankPassbook && (
                                    <p className="text-xs text-green-600 mt-2">✓ {formData.bankPassbook.name}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Farmer Photo
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                                <Camera className="mx-auto text-gray-400 mb-2" size={24} />
                                <p className="text-sm text-gray-600 mb-2">Upload Photo (JPG/PNG)</p>
                                <input
                                    type="file"
                                    name="photo"
                                    onChange={handleChange}
                                    className="hidden"
                                    id="photo"
                                    accept=".jpg,.jpeg,.png"
                                />
                                <label
                                    htmlFor="photo"
                                    className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-primary-100"
                                >
                                    Choose File
                                </label>
                                {formData.photo && (
                                    <p className="text-xs text-green-600 mt-2">✓ {formData.photo.name}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                // Save as draft logic
                                localStorage.setItem('farmer_draft', JSON.stringify(formData));
                                alert('Saved as draft!');
                            }}
                            className="px-6 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Register Farmer
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FarmerRegistration;