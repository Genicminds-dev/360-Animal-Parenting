import React, { useState } from 'react';
import { Heart, FileText, CheckCircle, XCircle, Thermometer, Calendar, Stethoscope } from 'lucide-react';

const HealthCheck = () => {
  const [formData, setFormData] = useState({
    animalId: '',
    vetName: '',
    checkDate: '',
    temperature: '',
    heartRate: '',
    respirationRate: '',
    
    // Health Status
    generalCondition: 'Good',
    appetite: 'Good',
    hydration: 'Good',
    mobility: 'Good',
    
    // Vaccination Details
    vaccinated: 'yes',
    vaccinationName: '',
    vaccinationDate: '',
    nextVaccinationDate: '',
    
    // Diseases & Symptoms
    diseases: '',
    symptoms: '',
    treatmentGiven: '',
    
    // Vet Approval
    vetApproval: 'pending',
    approvalRemarks: '',
    
    // Additional Info
    recommendations: '',
    followupDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Health check submitted:', formData);
    alert('Health check submitted successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health Check</h1>
        <p className="text-gray-600">Record animal health examination details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-50 rounded-lg">
              <Stethoscope className="text-red-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animal ID/Tag Number *
              </label>
              <input
                type="text"
                name="animalId"
                value={formData.animalId}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter Animal ID or Tag Number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Veterinary Officer Name *
              </label>
              <input
                type="text"
                name="vetName"
                value={formData.vetName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter vet name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="checkDate"
                  value={formData.checkDate}
                  onChange={handleChange}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Heart className="text-purple-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Vital Signs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°C) *
              </label>
              <div className="relative">
                <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter temperature"
                  min="30"
                  max="45"
                  step="0.1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heart Rate (BPM) *
              </label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter heart rate"
                  min="30"
                  max="120"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respiration Rate (BPM) *
              </label>
              <input
                type="number"
                name="respirationRate"
                value={formData.respirationRate}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter respiration rate"
                min="10"
                max="60"
                required
              />
            </div>
          </div>
        </div>

        {/* Health Assessment */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileText className="text-green-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Health Assessment</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'generalCondition', label: 'General Condition', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
              { name: 'appetite', label: 'Appetite', options: ['Good', 'Moderate', 'Poor', 'None'] },
              { name: 'hydration', label: 'Hydration', options: ['Good', 'Adequate', 'Dehydrated'] },
              { name: 'mobility', label: 'Mobility', options: ['Normal', 'Slightly Lame', 'Severely Lame', 'Unable to Move'] }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} *
                </label>
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Vaccination Details */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="text-blue-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Vaccination Details</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is the animal vaccinated? *
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
                      className="text-primary-600 focus:ring-primary-500"
                      required
                    />
                    <span className="ml-2 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.vaccinated === 'yes' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vaccination Name *
                  </label>
                  <select
                    name="vaccinationName"
                    value={formData.vaccinationName}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select Vaccine</option>
                    <option value="Foot and Mouth Disease">Foot and Mouth Disease</option>
                    <option value="Brucellosis">Brucellosis</option>
                    <option value="Black Quarter">Black Quarter</option>
                    <option value="Hemorrhagic Septicemia">Hemorrhagic Septicemia</option>
                    <option value="Anthrax">Anthrax</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vaccination Date *
                  </label>
                  <input
                    type="date"
                    name="vaccinationDate"
                    value={formData.vaccinationDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Vaccination Date
                  </label>
                  <input
                    type="date"
                    name="nextVaccinationDate"
                    value={formData.nextVaccinationDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Diseases & Treatment */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <XCircle className="text-yellow-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Diseases & Treatment</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diseases Observed (if any)
              </label>
              <textarea
                name="diseases"
                value={formData.diseases}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="List any diseases observed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="Describe any symptoms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment Given
              </label>
              <textarea
                name="treatmentGiven"
                value={formData.treatmentGiven}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="Describe treatment administered"
              />
            </div>
          </div>
        </div>

        {/* Vet Approval */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <CheckCircle className="text-indigo-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Veterinary Approval</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vet Approval Status *
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'approved', label: 'Approved', color: 'text-green-600' },
                  { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
                  { value: 'pending', label: 'Pending', color: 'text-yellow-600' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="vetApproval"
                      value={option.value}
                      checked={formData.vetApproval === option.value}
                      onChange={handleChange}
                      className="text-primary-600 focus:ring-primary-500"
                      required
                    />
                    <span className={`ml-2 ${option.color}`}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Remarks
              </label>
              <textarea
                name="approvalRemarks"
                value={formData.approvalRemarks}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="Enter any remarks or comments"
              />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-teal-50 rounded-lg">
              <FileText className="text-teal-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Recommendations & Follow-up</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendations
              </label>
              <textarea
                name="recommendations"
                value={formData.recommendations}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="Enter recommendations for care"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  name="followupDate"
                  value={formData.followupDate}
                  onChange={handleChange}
                  className="input-field"
                />
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
                const sampleData = {
                  animalId: 'TAG-67890',
                  vetName: 'Dr. Sharma',
                  checkDate: '2024-02-01',
                  temperature: '38.5',
                  heartRate: '65',
                  respirationRate: '25',
                  generalCondition: 'Good',
                  appetite: 'Good',
                  hydration: 'Good',
                  mobility: 'Normal',
                  vaccinated: 'yes',
                  vaccinationName: 'Foot and Mouth Disease',
                  vaccinationDate: '2024-01-15',
                  nextVaccinationDate: '2024-07-15',
                  vetApproval: 'approved',
                  approvalRemarks: 'Animal is healthy and fit for procurement'
                };
                setFormData(sampleData);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Load Sample
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Submit Health Check
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HealthCheck;