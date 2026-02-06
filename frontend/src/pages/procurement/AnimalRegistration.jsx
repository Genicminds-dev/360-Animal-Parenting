import React, { useState } from 'react';
import { Camera, Tag, Scale, Calendar, MapPin, Upload, X } from 'lucide-react';
import { GiCow } from 'react-icons/gi';

const AnimalRegistration = () => {
  const [formData, setFormData] = useState({
    // Basic Details
    farmerId: '',
    animalType: '',
    breed: '',
    age: '',
    weight: '',
    color: '',
    
    // Identification
    tagNumber: '',
    rfidNumber: '',
    identificationMark: '',
    
    // Health Basic
    healthStatus: 'Good',
    lastVaccinationDate: '',
    
    // Photos
    frontPhoto: null,
    sidePhoto: null,
    backPhoto: null,
    
    // Additional Info
    procurementDate: '',
    location: '',
    remarks: ''
  });

  const [previewImages, setPreviewImages] = useState({
    frontPhoto: null,
    sidePhoto: null,
    backPhoto: null
  });

  const animalTypes = [
    'Cow',
    'Buffalo',
    'Goat',
    'Sheep',
    'Camel',
    'Horse',
    'Bull',
    'Ox'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
    setPreviewImages(prev => ({ ...prev, [fieldName]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Animal registration submitted:', formData);
    alert('Animal registration submitted successfully!');
    // Reset form
    setFormData({
      farmerId: '',
      animalType: '',
      breed: '',
      age: '',
      weight: '',
      color: '',
      tagNumber: '',
      rfidNumber: '',
      identificationMark: '',
      healthStatus: 'Good',
      lastVaccinationDate: '',
      frontPhoto: null,
      sidePhoto: null,
      backPhoto: null,
      procurementDate: '',
      location: '',
      remarks: ''
    });
    setPreviewImages({
      frontPhoto: null,
      sidePhoto: null,
      backPhoto: null
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Animal Registration</h1>
        <p className="text-gray-600">Register new animals for procurement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <GiCow className="text-green-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Basic Animal Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farmer ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="farmerId"
                  value={formData.farmerId}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter Farmer ID or select"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 text-sm font-medium"
                  onClick={() => alert('Open farmer search modal')}
                >
                  Search
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animal Type *
              </label>
              <select
                name="animalType"
                value={formData.animalType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Type</option>
                {animalTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breed *
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter breed name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age (Years) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter age"
                  min="0"
                  max="30"
                  step="0.5"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  years
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (KG) *
              </label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter weight"
                  min="0"
                  step="0.1"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  kg
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color/Pattern
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Black, Brown, White, Spotted"
              />
            </div>
          </div>
        </div>

        {/* Identification Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Tag className="text-blue-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Identification Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tag Number *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="tagNumber"
                  value={formData.tagNumber}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter tag number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RFID Number
              </label>
              <input
                type="text"
                name="rfidNumber"
                value={formData.rfidNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter RFID number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identification Marks
              </label>
              <textarea
                name="identificationMark"
                value={formData.identificationMark}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="Describe any special marks, scars, or features"
              />
            </div>
          </div>
        </div>

        {/* Health Basic Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-50 rounded-lg">
              <span className="text-red-600">🏥</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Basic Health Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Health Status *
              </label>
              <select
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Under Treatment">Under Treatment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Vaccination Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="lastVaccinationDate"
                  value={formData.lastVaccinationDate}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Animal Photos Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Camera className="text-purple-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Animal Photos (Optional)</h2>
            <span className="text-sm text-gray-500">Upload clear photos from different angles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Front Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Front View
              </label>
              <div className="relative">
                {previewImages.frontPhoto ? (
                  <div className="relative">
                    <img
                      src={previewImages.frontPhoto}
                      alt="Front view"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('frontPhoto')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors h-48 flex flex-col items-center justify-center">
                    <Camera className="text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-600">Front View</p>
                    <input
                      type="file"
                      name="frontPhoto"
                      onChange={handleChange}
                      className="hidden"
                      id="frontPhoto"
                      accept=".jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="frontPhoto"
                      className="mt-2 inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded text-sm font-medium cursor-pointer hover:bg-primary-100"
                    >
                      Upload
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Side Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Side View
              </label>
              <div className="relative">
                {previewImages.sidePhoto ? (
                  <div className="relative">
                    <img
                      src={previewImages.sidePhoto}
                      alt="Side view"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('sidePhoto')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors h-48 flex flex-col items-center justify-center">
                    <Camera className="text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-600">Side View</p>
                    <input
                      type="file"
                      name="sidePhoto"
                      onChange={handleChange}
                      className="hidden"
                      id="sidePhoto"
                      accept=".jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="sidePhoto"
                      className="mt-2 inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded text-sm font-medium cursor-pointer hover:bg-primary-100"
                    >
                      Upload
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Back Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Back View
              </label>
              <div className="relative">
                {previewImages.backPhoto ? (
                  <div className="relative">
                    <img
                      src={previewImages.backPhoto}
                      alt="Back view"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('backPhoto')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors h-48 flex flex-col items-center justify-center">
                    <Camera className="text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-600">Back View</p>
                    <input
                      type="file"
                      name="backPhoto"
                      onChange={handleChange}
                      className="hidden"
                      id="backPhoto"
                      accept=".jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="backPhoto"
                      className="mt-2 inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded text-sm font-medium cursor-pointer hover:bg-primary-100"
                    >
                      Upload
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <MapPin className="text-yellow-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procurement Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="procurementDate"
                  value={formData.procurementDate}
                  onChange={handleChange}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location/Holding Station
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter holding station or location"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks/Notes
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="Any additional notes or observations"
              />
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
                // Auto-fill with sample data for testing
                const sampleData = {
                  farmerId: 'FARM-12345',
                  animalType: 'Cow',
                  breed: 'Holstein Friesian',
                  age: '3.5',
                  weight: '450',
                  color: 'Black and White',
                  tagNumber: 'TAG-67890',
                  rfidNumber: 'RFID-112233',
                  identificationMark: 'White patch on forehead, scar on left ear',
                  healthStatus: 'Good',
                  lastVaccinationDate: '2024-01-15',
                  procurementDate: '2024-02-01',
                  location: 'Holding Station #2',
                  remarks: 'Healthy animal, good milk production'
                };
                setFormData(sampleData);
                alert('Sample data loaded for testing!');
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Load Sample Data
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Register Animal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnimalRegistration;