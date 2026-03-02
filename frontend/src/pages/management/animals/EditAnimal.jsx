// pages/animals/EditAnimal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  Camera, X, ChevronDown, Save, ArrowLeft 
} from 'lucide-react';

const EditAnimal = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState({
    earTagId: '',
    breed: '',
    gender: '',
    lactation: '',
    ageYears: '',
    ageMonths: '',
    calvingStatus: '',
    calfTagId: '',
    calfGender: '',
    calvingDate: '',
    examDate: '',
    examineBy: '',
    receivingDate: '',
    remark: '',
    frontImage: null,
    sideImage: null,
    rearImage: null,
    video: null
  });

  const [breedDropdownOpen, setBreedDropdownOpen] = useState(false);
  const [breedSearch, setBreedSearch] = useState('');
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [calfGenderDropdownOpen, setCalfGenderDropdownOpen] = useState(false);
  const [calvingStatusDropdownOpen, setCalvingStatusDropdownOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState({ open: false, src: '', type: '', name: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breedRef = useRef(null);
  const genderRef = useRef(null);
  const calfGenderRef = useRef(null);
  const calvingStatusRef = useRef(null);

  // Dummy Data
  const breedOptions = ['Gir', 'Sahiwal', 'Jersey Cross', 'HF-Cross'];
  const genderOptions = ['Male', 'Female'];
  const calvingStatusOptions = ['Milking', 'Pregnant'];

  const ageYears = Array.from({ length: 21 }, (_, i) => i);
  const ageMonths = Array.from({ length: 12 }, (_, i) => i);

  // Load animal data
  useEffect(() => {
    const loadAnimalData = async () => {
      setLoading(true);
      
      try {
        if (location.state?.animal) {
          const animalData = location.state.animal;
          
          setFormData({
            earTagId: animalData.earTagId || '',
            breed: animalData.breed || '',
            gender: animalData.gender || '',
            lactation: animalData.lactation?.toString() || '',
            ageYears: animalData.ageYears?.toString() || '',
            ageMonths: animalData.ageMonths?.toString() || '',
            calvingStatus: animalData.calvingStatus?.toLowerCase() || '',
            calfTagId: animalData.calfTagId || '',
            calfGender: animalData.calfGender || '',
            calvingDate: animalData.calvingDate || '',
            examDate: animalData.examDate || '',
            examineBy: animalData.examineBy || '',
            receivingDate: animalData.receivingDate || '',
            remark: animalData.remark || '',
            frontImage: animalData.frontImage || null,
            sideImage: animalData.sideImage || null,
            rearImage: animalData.rearImage || null,
            video: animalData.video || null
          });
        } else if (uid) {
          toast.error("No animal data provided");
          navigate("/animals");
        } else {
          toast.error("No animal ID provided");
          navigate("/animals");
        }
      } catch (error) {
        console.error("Error loading animal data:", error);
        toast.error("Failed to load animal details");
      } finally {
        setLoading(false);
      }
    };

    loadAnimalData();
  }, [uid, location.state, navigate]);

  // Filtered breeds based on search
  const filteredBreeds = breedOptions.filter(breed =>
    breed.toLowerCase().includes(breedSearch.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (breedRef.current && !breedRef.current.contains(event.target)) {
        setBreedDropdownOpen(false);
      }
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setGenderDropdownOpen(false);
      }
      if (calfGenderRef.current && !calfGenderRef.current.contains(event.target)) {
        setCalfGenderDropdownOpen(false);
      }
      if (calvingStatusRef.current && !calvingStatusRef.current.contains(event.target)) {
        setCalvingStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMediaUpload = (field, file) => {
    const fileData = {
      file: file,
      name: file.name,
      type: file.type,
      size: (file.size / 1024 / 1024).toFixed(2),
      uploadedAt: new Date().toISOString()
    };

    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        fileData.preview = reader.result;
        setFormData(prev => ({
          ...prev,
          [field]: fileData
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: fileData
      }));
    }
  };

  const removeMedia = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const openPreview = (src, type, name) => {
    setPreviewModal({ open: true, src, type, name });
  };

  const closePreview = () => {
    setPreviewModal({ open: false, src: '', type: '', name: '' });
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.earTagId) errors.push('Ear Tag ID is required');
    if (!formData.breed) errors.push('Breed is required');
    if (!formData.gender) errors.push('Gender is required');
    if (!formData.calvingStatus) errors.push('Calving Status is required');

    if (formData.calvingStatus === 'milking') {
      if (!formData.calfTagId) errors.push('Calf Tag ID is required for milking animals');
      if (!formData.calfGender) errors.push('Calf Gender is required for milking animals');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedAnimal = {
        ...location.state.animal,
        earTagId: formData.earTagId,
        breed: formData.breed,
        gender: formData.gender,
        lactation: formData.lactation || '',
        ageYears: formData.ageYears || '',
        ageMonths: formData.ageMonths || '',
        calvingStatus: formData.calvingStatus,
        calfTagId: formData.calvingStatus === 'milking' ? formData.calfTagId : '',
        calfGender: formData.calvingStatus === 'milking' ? formData.calfGender : '',
        calvingDate: formData.calvingDate || '',
        examDate: formData.examDate || '',
        examineBy: formData.examineBy || '',
        receivingDate: formData.receivingDate || '',
        remark: formData.remark || '',
        frontImage: formData.frontImage,
        sideImage: formData.sideImage,
        rearImage: formData.rearImage,
        video: formData.video,
        updatedAt: new Date().toISOString()
      };

      toast.success('Animal updated successfully!');

      navigate(`/management/animal-details/${uid}`, {
        state: { animal: updatedAnimal }
      });

    } catch (error) {
      console.error("Error updating animal:", error);
      toast.error("Failed to update animal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/management/animal-details/${uid}`);
  };

  const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Animal Details...</h3>
          <p className="text-gray-500">Please wait while we fetch the animal information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Modal */}
      {previewModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">{previewModal.name}</h3>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">
              {previewModal.type.startsWith('image/') ? (
                <img
                  src={previewModal.src}
                  alt="Preview"
                  className="w-full h-auto rounded"
                />
              ) : previewModal.type.startsWith('video/') ? (
                <video
                  src={previewModal.src}
                  controls
                  className="w-full rounded"
                  autoPlay
                />
              ) : (
                <div className="text-center py-8">
                  <X size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Animal</h1>
          <p className="text-gray-600">Update animal information for {formData.earTagId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Animal Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Animal Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Ear Tag ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ear Tag ID <RequiredStar />
              </label>
              <input
                type="text"
                value={formData.earTagId}
                onChange={(e) => handleInputChange('earTagId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter Ear Tag ID"
                required
              />
            </div>

            {/* 2. Breed */}
            <div className="relative" ref={breedRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breed <RequiredStar />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.breed}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer bg-white"
                  placeholder="Select breed"
                  onClick={() => setBreedDropdownOpen(!breedDropdownOpen)}
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  size={20}
                  onClick={() => setBreedDropdownOpen(!breedDropdownOpen)}
                />

                {breedDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        value={breedSearch}
                        onChange={(e) => setBreedSearch(e.target.value)}
                        placeholder="Search breed..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredBreeds.length > 0 ? (
                        filteredBreeds.map(breed => (
                          <div
                            key={breed}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              handleInputChange('breed', breed);
                              setBreedDropdownOpen(false);
                              setBreedSearch('');
                            }}
                          >
                            {breed}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No breeds found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Gender */}
            <div className="relative" ref={genderRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <RequiredStar />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.gender}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer bg-white"
                  placeholder="Select gender"
                  onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  size={20}
                  onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                />

                {genderDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {genderOptions.map(gender => (
                      <div
                        key={gender}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          handleInputChange('gender', gender);
                          setGenderDropdownOpen(false);
                        }}
                      >
                        {gender}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Lactation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lactation (Number)
              </label>
              <input
                type="number"
                value={formData.lactation}
                onChange={(e) => handleInputChange('lactation', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter lactation number"
                min="0"
                max="20"
              />
            </div>

            {/* 5. Age (Years & Months) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <div className="flex space-x-2">
                <select
                  value={formData.ageYears}
                  onChange={(e) => handleInputChange('ageYears', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="">Years</option>
                  {ageYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select
                  value={formData.ageMonths}
                  onChange={(e) => handleInputChange('ageMonths', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="">Months</option>
                  {ageMonths.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6. Calving Status */}
            <div className="relative" ref={calvingStatusRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calving Status <RequiredStar />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.calvingStatus}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer bg-white"
                  placeholder="Select calving status"
                  onClick={() => setCalvingStatusDropdownOpen(!calvingStatusDropdownOpen)}
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  size={20}
                  onClick={() => setCalvingStatusDropdownOpen(!calvingStatusDropdownOpen)}
                />

                {calvingStatusDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {calvingStatusOptions.map(status => (
                      <div
                        key={status}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 capitalize"
                        onClick={() => {
                          handleInputChange('calvingStatus', status.toLowerCase());
                          setCalvingStatusDropdownOpen(false);
                        }}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conditional fields for Milking */}
          {formData.calvingStatus === 'milking' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              {/* Calf Tag ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calf Tag ID <RequiredStar />
                </label>
                <input
                  type="text"
                  value={formData.calfTagId}
                  onChange={(e) => handleInputChange('calfTagId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter Calf Tag ID"
                  required
                />
              </div>

              {/* Calf Gender */}
              <div className="relative" ref={calfGenderRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calf Gender <RequiredStar />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.calfGender}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer bg-white"
                    placeholder="Select calf gender"
                    onClick={() => setCalfGenderDropdownOpen(!calfGenderDropdownOpen)}
                    required
                  />
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    size={20}
                    onClick={() => setCalfGenderDropdownOpen(!calfGenderDropdownOpen)}
                  />

                  {calfGenderDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {genderOptions.map(gender => (
                        <div
                          key={gender}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            handleInputChange('calfGender', gender);
                            setCalfGenderDropdownOpen(false);
                          }}
                        >
                          {gender}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Date Fields */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
            {/* 7. Calving Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calving Date
              </label>
              <input
                type="date"
                value={formData.calvingDate}
                onChange={(e) => handleInputChange('calvingDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* 8. Exam Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Date
              </label>
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => handleInputChange('examDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* 9. Examine By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Examine By
              </label>
              <input
                type="text"
                value={formData.examineBy}
                onChange={(e) => handleInputChange('examineBy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter examiner name"
              />
            </div>

            {/* 10. Receiving Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiving Date
              </label>
              <input
                type="date"
                value={formData.receivingDate}
                onChange={(e) => handleInputChange('receivingDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* 11. Remark */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remark
            </label>
            <textarea
              value={formData.remark}
              onChange={(e) => handleInputChange('remark', e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter any remarks..."
            />
          </div>

          {/* Media Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 12. Front Image */}
              <MediaUploadBox
                type="photo"
                preview={formData.frontImage?.preview}
                label="Front Image"
                onUpload={(file) => handleMediaUpload('frontImage', file)}
                onRemove={() => removeMedia('frontImage')}
                onPreview={openPreview}
              />

              {/* 13. Side Image */}
              <MediaUploadBox
                type="photo"
                preview={formData.sideImage?.preview}
                label="Side Image"
                onUpload={(file) => handleMediaUpload('sideImage', file)}
                onRemove={() => removeMedia('sideImage')}
                onPreview={openPreview}
              />

              {/* 14. Rear Image */}
              <MediaUploadBox
                type="photo"
                preview={formData.rearImage?.preview}
                label="Rear Image"
                onUpload={(file) => handleMediaUpload('rearImage', file)}
                onRemove={() => removeMedia('rearImage')}
                onPreview={openPreview}
              />

              {/* 15. Video */}
              <MediaUploadBox
                type="video"
                preview={formData.video?.preview}
                label="Video"
                instructions="Front → Left → Back → Right → Front"
                onUpload={(file) => handleMediaUpload('video', file)}
                onRemove={() => removeMedia('video')}
                onPreview={openPreview}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <strong>Note:</strong> Fields marked with <span className="text-red-500">*</span> are required
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update Animal
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Media Upload Component
const MediaUploadBox = ({ type, preview, onUpload, onRemove, onPreview, label, instructions }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'photo' && !file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      onUpload(file);
    }
  };

  const inputId = `upload-${label}-${Date.now()}`;

  return (
    <div className="relative">
      {preview ? (
        <div className="relative">
          {type === 'photo' ? (
            <img
              src={preview}
              alt={label}
              className="w-full h-48 object-cover rounded-lg cursor-pointer"
              onClick={() => onPreview(preview, 'image/jpeg', label)}
            />
          ) : (
            <div className="relative">
              <video
                src={preview}
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                onClick={() => onPreview(preview, 'video/mp4', label)}
                controls
              />
              {instructions && (
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
                  {instructions}
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors h-48 flex flex-col items-center justify-center">
          {type === 'photo' ? (
            <Camera className="text-gray-400 mb-2" size={24} />
          ) : (
            <Camera className="text-gray-400 mb-2" size={24} />
          )}
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-xs text-gray-500 mb-3">Click to upload</p>
          <input
            type="file"
            accept={type === 'photo' ? 'image/*' : 'video/*'}
            onChange={handleFileChange}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className="px-3 py-1 bg-primary-50 text-primary-700 rounded text-sm font-medium cursor-pointer hover:bg-primary-100"
          >
            Upload
          </label>
        </div>
      )}
    </div>
  );
};

export default EditAnimal;