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

const HealthCheckupForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { animalData } = location.state || {};

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
    healthCertificateName: ''
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
      setFormData(prev => ({
        ...prev,
        healthCertificate: file,
        healthCertificateName: file.name
      }));
    }
  };

  const handleVaccinationChange = (e) => {
    const { name, value } = e.target;
    setNewVaccination(prev => ({ ...prev, [name]: value }));
  };

  const addVaccination = () => {
    if (!newVaccination.vaccinationType && !newVaccination.vaccinationName && 
        !newVaccination.vaccinationDate && !newVaccination.batchNo) {
      toast.error("Please fill at least one vaccination detail");
      return;
    }

    setFormData(prev => ({
      ...prev,
      vaccinations: [...prev.vaccinations, { ...newVaccination, id: Date.now() }]
    }));

    setNewVaccination({
      vaccinationType: '',
      vaccinationName: '',
      vaccinationDate: '',
      batchNo: ''
    });
  };

  const removeVaccination = (id) => {
    setFormData(prev => ({
      ...prev,
      vaccinations: prev.vaccinations.filter(v => v.id !== id)
    }));
  };

  const removeHealthCertificate = () => {
    setFormData(prev => ({
      ...prev,
      healthCertificate: null,
      healthCertificateName: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate only mandatory fields
    const requiredFields = ['vetOfficer', 'checkDate', 'vetApproval'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all mandatory fields`);
      return;
    }
    
    console.log('Health check submitted:', formData);
    
    setTimeout(() => {
      toast.success(`Health check submitted successfully!`);
      navigate('/health-checkup');
    }, 1000);
  };

  const handleGoBack = () => {
    navigate('/health-checkup');
  };

  const selectedVet = veterinaryOfficers.find(vet => vet.id.toString() === formData.vetOfficer);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleGoBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Check Form</h1>
          <p className="text-gray-600">Record animal health examination details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Veterinary Officer and Check Date - Both Mandatory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-50 rounded-lg">
              <Stethoscope className="text-red-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Examination Details</h2>
          </div>

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
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vital Signs - Not Mandatory, No Stars */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Heart className="text-purple-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Vital Signs</h2>
          </div>

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
                />
              </div>
            </div>
          </div>
        </div>

        {/* Health Assessment - Not Mandatory, No Stars */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileText className="text-green-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Health Assessment</h2>
          </div>

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
              >
                <option value="">Select Mobility</option>
                <option value="Normal">Normal</option>
                <option value="Slightly Lame">Slightly Lame</option>
                <option value="Severely Lame">Severely Lame</option>
                <option value="Unable to Move">Unable to Move</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vaccination Details - Not Mandatory, No Stars */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="text-blue-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Vaccination Details</h2>
          </div>

          <div className="space-y-6">
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
                    />
                    <span className="ml-2 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.vaccinated === 'yes' && (
              <div className="space-y-4">
                {/* Add New Vaccination Form */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add Vaccination Record</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Vaccination Type</label>
                      <select
                        name="vaccinationType"
                        value={newVaccination.vaccinationType}
                        onChange={handleVaccinationChange}
                        className="w-full px-3 py-2 input-field text-sm"
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
                        />
                        <button
                          type="button"
                          onClick={addVaccination}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
                      <div key={vaccination.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                          <span className="text-sm">
                            <span className="font-medium">Type:</span> {vaccination.vaccinationType || 'N/A'}
                          </span>
                          <span className="text-sm">
                            <span className="font-medium">Name:</span> {vaccination.vaccinationName || 'N/A'}
                          </span>
                          <span className="text-sm">
                            <span className="font-medium">Date:</span> {vaccination.vaccinationDate || 'N/A'}
                          </span>
                          <span className="text-sm">
                            <span className="font-medium">Batch:</span> {vaccination.batchNo || 'N/A'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVaccination(vaccination.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
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
        </div>

        {/* Vet Approval - Mandatory with Star */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <CheckCircle className="text-indigo-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Veterinary Approval</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vet Approval Status <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                {[
                  { value: 'approved', label: 'Approved', color: 'text-green-600' },
                  { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
                  { value: 'pending', label: 'Pending', color: 'text-yellow-600' }
                ].map(option => (
                  <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="vetApproval"
                      value={option.value}
                      checked={formData.vetApproval === option.value}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                      required
                    />
                    <span className={`ml-2 font-medium ${option.color}`}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Remark Field - Not Mandatory */}
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
              ></textarea>
            </div>
          </div>
        </div>

        {/* Health Certificate Upload - Not Mandatory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-50 rounded-lg">
              <FileUp className="text-orange-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Health Certificate</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Health Certificate
            </label>
            <div className="space-y-4">
              {!formData.healthCertificate ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
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
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleGoBack}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to List</span>
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md hover:shadow-lg"
          >
            Submit Health Check
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthCheckupForm;