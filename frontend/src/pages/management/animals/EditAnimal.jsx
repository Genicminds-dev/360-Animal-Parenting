// pages/animals/EditAnimal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Camera, X, ChevronDown, Save, ArrowLeft, Building2, Upload, Eye, File, Image as ImageIcon, Video
} from 'lucide-react';
import { PATHROUTES } from '../../../routes/pathRoutes';

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

  const [errors, setErrors] = useState({});
  const [breedDropdownOpen, setBreedDropdownOpen] = useState(false);
  const [breedSearch, setBreedSearch] = useState('');
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [calfGenderDropdownOpen, setCalfGenderDropdownOpen] = useState(false);
  const [calvingStatusDropdownOpen, setCalvingStatusDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview states
  const [photoPreviews, setPhotoPreviews] = useState({
    frontImage: null,
    sideImage: null,
    rearImage: null
  });
  const [videoPreview, setVideoPreview] = useState(null);

  const breedRef = useRef(null);
  const genderRef = useRef(null);
  const calfGenderRef = useRef(null);
  const calvingStatusRef = useRef(null);

  // Dummy Data
  const breedOptions = ['Gir', 'Sahiwal', 'Jersey Cross', 'HF-Cross'];
  const genderOptions = ['Male', 'Female'];
  const calvingStatusOptions = ['Milking', 'Pregnant', 'Dry', 'Heifer'];

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

          // Set previews if images exist
          if (animalData.frontImage) setPhotoPreviews(prev => ({ ...prev, frontImage: animalData.frontImage }));
          if (animalData.sideImage) setPhotoPreviews(prev => ({ ...prev, sideImage: animalData.sideImage }));
          if (animalData.rearImage) setPhotoPreviews(prev => ({ ...prev, rearImage: animalData.rearImage }));
          if (animalData.video) setVideoPreview(animalData.video);
        } else if (uid) {
          toast.error("No animal data provided");
          navigate(PATHROUTES.procuredAnimals);
        } else {
          toast.error("No animal ID provided");
          navigate(PATHROUTES.procuredAnimals);
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

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      Object.values(photoPreviews).forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [photoPreviews, videoPreview]);

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
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMediaUpload = (field, file) => {
    // Validate file type
    if (field.includes('Image') && !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (field === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    setFormData(prev => ({ ...prev, [field]: file }));

    // Clear previous preview
    if (field.includes('Image') && photoPreviews[field]) {
      if (photoPreviews[field].startsWith('blob:')) {
        URL.revokeObjectURL(photoPreviews[field]);
      }
      setPhotoPreviews(prev => ({ ...prev, [field]: null }));
    }
    if (field === 'video' && videoPreview) {
      if (videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
      setVideoPreview(null);
    }

    // Set preview
    if (field.includes('Image') && file.type.startsWith('image/')) {
      setPhotoPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
    if (field === 'video' && file.type.startsWith('video/')) {
      setVideoPreview(URL.createObjectURL(file));
    }

    // Clear any error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removeMedia = (field) => {
    if (field.includes('Image')) {
      if (photoPreviews[field]) {
        if (photoPreviews[field].startsWith('blob:')) {
          URL.revokeObjectURL(photoPreviews[field]);
        }
        setPhotoPreviews(prev => ({ ...prev, [field]: null }));
      }
    } else if (field === 'video') {
      if (videoPreview) {
        if (videoPreview.startsWith('blob:')) {
          URL.revokeObjectURL(videoPreview);
        }
        setVideoPreview(null);
      }
    }
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const getDisplayFileName = (file, type) => {
    if (!file) return '';
    if (typeof file === 'string') return `Animal_${type}.jpg`;
    
    const extension = file.name.split('.').pop().toLowerCase();
    return `Animal_${type}.${extension}`;
  };

  const openMedia = (type, preview) => {
    if (preview) {
      window.open(preview, '_blank');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!formData.earTagId.trim()) {
      newErrors.earTagId = 'Ear Tag ID is required';
    }
    
    if (!formData.breed.trim()) {
      newErrors.breed = 'Breed is required';
    }
    
    if (!formData.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.calvingStatus.trim()) {
      newErrors.calvingStatus = 'Calving Status is required';
    }

    // Conditional validations for milking
    if (formData.calvingStatus === 'milking') {
      if (!formData.calfTagId.trim()) {
        newErrors.calfTagId = 'Calf Tag ID is required for milking animals';
      }
      if (!formData.calfGender.trim()) {
        newErrors.calfGender = 'Calf Gender is required for milking animals';
      }
    }

    // Additional validations
    if (formData.lactation && (parseInt(formData.lactation) < 0 || parseInt(formData.lactation) > 20)) {
      newErrors.lactation = 'Lactation number must be between 0 and 20';
    }

    if (formData.ageYears && (parseInt(formData.ageYears) < 0 || parseInt(formData.ageYears) > 20)) {
      newErrors.ageYears = 'Age years must be between 0 and 20';
    }

    if (formData.ageMonths && (parseInt(formData.ageMonths) < 0 || parseInt(formData.ageMonths) > 11)) {
      newErrors.ageMonths = 'Age months must be between 0 and 11';
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
      // Simulate API call
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
      
      // Clean up preview URLs
      Object.values(photoPreviews).forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }

      navigate(PATHROUTES.procuredAnimals);

    } catch (error) {
      console.error("Error updating animal:", error);
      toast.error("Failed to update animal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Clean up preview URLs
    Object.values(photoPreviews).forEach(preview => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });
    if (videoPreview && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }
    navigate(PATHROUTES.procuredAnimals);
  };

  const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Animal Details...</h3>
          <p className="text-gray-500">Please wait while we fetch the animal information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <p className="text-gray-600">Update animal information for <span className='text-primary-600 text-sm font-medium'>{formData.earTagId}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Animal Details Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Building2 className="text-primary-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Animal Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Ear Tag ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ear Tag ID <RequiredStar />
              </label>
              <input
                type="text"
                value={formData.earTagId}
                onChange={(e) => handleInputChange('earTagId', e.target.value)}
                className={`input-field ${errors.earTagId ? 'border-red-500' : ''}`}
                placeholder="Enter Ear Tag ID"
                disabled={isSubmitting}
              />
              {errors.earTagId && (
                <p className="text-red-500 text-xs mt-1">{errors.earTagId}</p>
              )}
            </div>

            {/* Breed */}
            <div className="relative" ref={breedRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breed <RequiredStar />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.breed}
                  readOnly
                  className={`input-field ${errors.breed ? 'border-red-500' : ''}`}
                  placeholder="Select breed"
                  onClick={() => !isSubmitting && setBreedDropdownOpen(!breedDropdownOpen)}
                  disabled={isSubmitting}
                />
                <ChevronDown
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${!isSubmitting ? 'cursor-pointer' : 'opacity-50'}`}
                  size={20}
                  onClick={() => !isSubmitting && setBreedDropdownOpen(!breedDropdownOpen)}
                />

                {breedDropdownOpen && !isSubmitting && (
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
              {errors.breed && (
                <p className="text-red-500 text-xs mt-1">{errors.breed}</p>
              )}
            </div>

            {/* Gender */}
            <div className="relative" ref={genderRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <RequiredStar />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.gender}
                  readOnly
                  className={`input-field ${errors.gender ? 'border-red-500' : ''}`}
                  placeholder="Select gender"
                  onClick={() => !isSubmitting && setGenderDropdownOpen(!genderDropdownOpen)}
                  disabled={isSubmitting}
                />
                <ChevronDown
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${!isSubmitting ? 'cursor-pointer' : 'opacity-50'}`}
                  size={20}
                  onClick={() => !isSubmitting && setGenderDropdownOpen(!genderDropdownOpen)}
                />

                {genderDropdownOpen && !isSubmitting && (
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
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Lactation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lactation (Number)
              </label>
              <input
                type="number"
                value={formData.lactation}
                onChange={(e) => handleInputChange('lactation', e.target.value)}
                className={`input-field ${errors.lactation ? 'border-red-500' : ''}`}
                placeholder="Enter lactation number"
                min="0"
                max="20"
                disabled={isSubmitting}
              />
              {errors.lactation && (
                <p className="text-red-500 text-xs mt-1">{errors.lactation}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <div className="flex space-x-2">
                <select
                  value={formData.ageYears}
                  onChange={(e) => handleInputChange('ageYears', e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white ${errors.ageYears ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={isSubmitting}
                >
                  <option value="">Years</option>
                  {ageYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select
                  value={formData.ageMonths}
                  onChange={(e) => handleInputChange('ageMonths', e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white ${errors.ageMonths ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={isSubmitting}
                >
                  <option value="">Months</option>
                  {ageMonths.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              {(errors.ageYears || errors.ageMonths) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ageYears || errors.ageMonths}
                </p>
              )}
            </div>

            {/* Calving Status */}
            <div className="relative" ref={calvingStatusRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calving Status <RequiredStar />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.calvingStatus}
                  readOnly
                  className={`input-field ${errors.calvingStatus ? 'border-red-500' : ''}`}
                  placeholder="Select calving status"
                  onClick={() => !isSubmitting && setCalvingStatusDropdownOpen(!calvingStatusDropdownOpen)}
                  disabled={isSubmitting}
                />
                <ChevronDown
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${!isSubmitting ? 'cursor-pointer' : 'opacity-50'}`}
                  size={20}
                  onClick={() => !isSubmitting && setCalvingStatusDropdownOpen(!calvingStatusDropdownOpen)}
                />

                {calvingStatusDropdownOpen && !isSubmitting && (
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
              {errors.calvingStatus && (
                <p className="text-red-500 text-xs mt-1">{errors.calvingStatus}</p>
              )}
            </div>

            {/* Conditional fields for Milking */}
            {formData.calvingStatus === 'milking' && (
              <>
                {/* Calf Tag ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calf Tag ID <RequiredStar />
                  </label>
                  <input
                    type="text"
                    value={formData.calfTagId}
                    onChange={(e) => handleInputChange('calfTagId', e.target.value)}
                    className={`input-field ${errors.calfTagId ? 'border-red-500' : ''}`}
                    placeholder="Enter Calf Tag ID"
                    disabled={isSubmitting}
                  />
                  {errors.calfTagId && (
                    <p className="text-red-500 text-xs mt-1">{errors.calfTagId}</p>
                  )}
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
                      className={`input-field ${errors.calfGender ? 'border-red-500' : ''}`}
                      placeholder="Select calf gender"
                      onClick={() => !isSubmitting && setCalfGenderDropdownOpen(!calfGenderDropdownOpen)}
                      disabled={isSubmitting}
                    />
                    <ChevronDown
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${!isSubmitting ? 'cursor-pointer' : 'opacity-50'}`}
                      size={20}
                      onClick={() => !isSubmitting && setCalfGenderDropdownOpen(!calfGenderDropdownOpen)}
                    />

                    {calfGenderDropdownOpen && !isSubmitting && (
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
                  {errors.calfGender && (
                    <p className="text-red-500 text-xs mt-1">{errors.calfGender}</p>
                  )}
                </div>
              </>
            )}

            {/* Calving Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calving Date
              </label>
              <input
                type="date"
                value={formData.calvingDate}
                onChange={(e) => handleInputChange('calvingDate', e.target.value)}
                className="input-field"
                disabled={isSubmitting}
              />
            </div>

            {/* Exam Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Date
              </label>
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => handleInputChange('examDate', e.target.value)}
                className="input-field"
                disabled={isSubmitting}
              />
            </div>

            {/* Examine By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Examine By
              </label>
              <input
                type="text"
                value={formData.examineBy}
                onChange={(e) => handleInputChange('examineBy', e.target.value)}
                className="input-field"
                placeholder="Enter examiner name"
                disabled={isSubmitting}
              />
            </div>

            {/* Receiving Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiving Date
              </label>
              <input
                type="date"
                value={formData.receivingDate}
                onChange={(e) => handleInputChange('receivingDate', e.target.value)}
                className="input-field"
                disabled={isSubmitting}
              />
            </div>

            {/* Remark */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remark
              </label>
              <textarea
                value={formData.remark}
                onChange={(e) => handleInputChange('remark', e.target.value)}
                rows="3"
                className="input-field"
                placeholder="Enter any remarks..."
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <Camera className="text-green-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Animal Media</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Front Image */}
            <MediaUploadBox
              field="frontImage"
              file={formData.frontImage}
              preview={photoPreviews.frontImage}
              label="Front Image"
              type="photo"
              onUpload={handleMediaUpload}
              onRemove={removeMedia}
              onOpen={openMedia}
              isSubmitting={isSubmitting}
              getDisplayFileName={getDisplayFileName}
            />

            {/* Side Image */}
            <MediaUploadBox
              field="sideImage"
              file={formData.sideImage}
              preview={photoPreviews.sideImage}
              label="Side Image"
              type="photo"
              onUpload={handleMediaUpload}
              onRemove={removeMedia}
              onOpen={openMedia}
              isSubmitting={isSubmitting}
              getDisplayFileName={getDisplayFileName}
            />

            {/* Rear Image */}
            <MediaUploadBox
              field="rearImage"
              file={formData.rearImage}
              preview={photoPreviews.rearImage}
              label="Rear Image"
              type="photo"
              onUpload={handleMediaUpload}
              onRemove={removeMedia}
              onOpen={openMedia}
              isSubmitting={isSubmitting}
              getDisplayFileName={getDisplayFileName}
            />

            {/* Video */}
            <MediaUploadBox
              field="video"
              file={formData.video}
              preview={videoPreview}
              label="Video"
              type="video"
              onUpload={handleMediaUpload}
              onRemove={removeMedia}
              onOpen={openMedia}
              isSubmitting={isSubmitting}
              getDisplayFileName={getDisplayFileName}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end pt-6 border-t border-gray-200">
          <div className="flex space-x-4">
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
              className={`px-6 py-2 bg-primary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
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
const MediaUploadBox = ({ 
  field, 
  file, 
  preview, 
  label, 
  type, 
  onUpload, 
  onRemove, 
  onOpen, 
  isSubmitting,
  getDisplayFileName 
}) => {
  const inputId = `upload-${field}-${Date.now()}`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(field, file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        {label}
      </label>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full">
          {file ? (
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${type === 'photo' ? 'bg-primary-100 text-primary-600' : 'bg-red-100 text-red-600'}`}>
                    {type === 'photo' ? <ImageIcon size={24} /> : <Video size={24} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getDisplayFileName(file, label.toLowerCase().replace(' ', '_'))}
                    </p>
                    <p className="text-sm text-gray-500">
                      {typeof file === 'object' && file.size ? `${Math.round(file.size / 1024)} KB` : 'Existing file'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => onOpen(type, preview)}
                    className={`p-2 ${type === 'photo' ? 'bg-primary-100 text-primary-600 hover:bg-primary-200' : 'bg-red-100 text-red-600 hover:bg-red-200'} rounded-lg transition-colors`}
                    title={`Preview ${label}`}
                    disabled={isSubmitting}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(field)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Remove"
                    disabled={isSubmitting}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {preview && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-2 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">{label} Preview</p>
                  </div>
                  <div className="p-4 flex items-center justify-center bg-gray-50">
                    {type === 'photo' ? (
                      <img
                        src={preview}
                        alt={label}
                        className="max-w-full max-h-48 object-contain rounded"
                      />
                    ) : (
                      <video
                        src={preview}
                        controls
                        className="max-w-full max-h-48 rounded"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <Upload className="text-gray-400 mb-3" size={32} />
                <p className="text-sm text-gray-700 mb-2 font-medium">
                  Upload {label}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {type === 'photo' ? 'Click to upload image' : 'Click to upload video'}
                </p>

                <label
                  htmlFor={inputId}
                  className={`px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Browse File
                </label>
              </div>
            </div>
          )}

          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id={inputId}
            accept={type === 'photo' ? 'image/*' : 'video/*'}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditAnimal;