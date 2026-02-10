import React, { useState, useEffect, useRef } from 'react';
import { Camera, Tag, Scale, Calendar, MapPin, Upload, X, Search, ChevronDown, Video, RotateCw, Info } from 'lucide-react';
import { GiCow } from 'react-icons/gi';

const AnimalRegistration = () => {
  const [formData, setFormData] = useState({
    // Seller Details
    sellerName: '',
    sellerId: '',
    totalAnimals: '',

    // Animals Array - Only basic info initially
    animals: [{
      earTagId: '',
      animalType: '',
      breed: '',
      pricing: '',
      pregnancyStatus: '',
      calfTagId: '', // Only if milking

      // Advanced details
      advancedDetails: {
        hasAdvanced: false,
        numberOfPregnancies: '',
        ageYears: '',
        ageMonths: '',
        weight: '',
        milkPerDay: '',
        calfAgeYears: '',
        calfAgeMonths: '',
        commissionerAgent: '', // Moved to advanced details
        // Animal Photos
        frontPhoto: null,
        sidePhoto: null,
        backPhoto: null,
        // Animal Video
        animalVideo: null,
        // Single Calf Photo
        calfPhoto: null,
        // Calf Video
        calfVideo: null
      }
    }]
  });

  const [sellerDropdownOpen, setSellerDropdownOpen] = useState(false);
  const [sellerSearch, setSellerSearch] = useState('');
  const [agentDropdownOpen, setAgentDropdownOpen] = useState({});
  const [agentSearch, setAgentSearch] = useState({});
  const [animalTypeDropdownOpen, setAnimalTypeDropdownOpen] = useState({});
  const [animalTypeSearch, setAnimalTypeSearch] = useState({});
  const [breedDropdownOpen, setBreedDropdownOpen] = useState({});
  const [breedSearch, setBreedSearch] = useState({});

  // Track which animals have advanced details open
  const [advancedDetailsOpen, setAdvancedDetailsOpen] = useState({});

  // Track preview modals
  const [previewModal, setPreviewModal] = useState({ open: false, src: '', type: '', name: '' });

  // Refs for dropdown closing
  const sellerRef = useRef(null);
  const agentRefs = useRef([]);
  const animalTypeRefs = useRef([]);
  const breedRefs = useRef([]);

  // Dummy Data
  const sellers = [
    { id: 'V001', name: 'Rajesh Kumar', mobile: '9876543210' },
    { id: 'V002', name: 'Suresh Patel', mobile: '9876543211' },
    { id: 'V003', name: 'Mohan Singh', mobile: '9876543212' },
    { id: 'V004', name: 'Anil Sharma', mobile: '9876543213' },
    { id: 'V005', name: 'Vikram Verma', mobile: '9876543214' },
    { id: 'V006', name: 'Ramesh Gupta', mobile: '9876543215' },
    { id: 'V007', name: 'Harish Joshi', mobile: '9876543216' }
  ];

  // Commissioner Agents Data
  const commissionerAgents = [
    { id: 'CA001', name: 'Amit Patel', mobile: '9876500010' },
    { id: 'CA002', name: 'Rahul Sharma', mobile: '9876500011' },
    { id: 'CA003', name: 'Vijay Singh', mobile: '9876500012' },
    { id: 'CA004', name: 'Deepak Verma', mobile: '9876500013' },
    { id: 'CA005', name: 'Sanjay Gupta', mobile: '9876500014' },
    { id: 'CA006', name: 'Kumar Joshi', mobile: '9876500015' },
    { id: 'CA007', name: 'Arun Yadav', mobile: '9876500016' }
  ];

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

  const breedData = {
    'Cow': ['Holstein Friesian', 'Jersey', 'Sahiwal', 'Gir', 'Red Sindhi'],
    'Buffalo': ['Murrah', 'Nili-Ravi', 'Surti', 'Jaffarabadi', 'Bhadawari'],
    'Goat': ['Sirohi', 'Jamunapari', 'Beetal', 'Barbari', 'Osmanabadi'],
    'Sheep': ['Merino', 'Rambouillet', 'Dorset', 'Suffolk', 'Hampshire'],
    'Camel': ['Bikaneri', 'Jaisalmeri', 'Kachchhi', 'Marwari', 'Mewari'],
    'Horse': ['Marwari', 'Kathiawari', 'Manipuri', 'Zanskari', 'Spiti'],
    'Bull': ['Ongole', 'Kankrej', 'Hariana', 'Khillari', 'Amritmahal'],
    'Ox': ['Ongole', 'Kankrej', 'Hariana', 'Khillari', 'Amritmahal']
  };

  const pregnancyOptions = [
    { value: 'milking', label: 'Milking' },
    { value: 'pregnant', label: 'Pregnant' },
    { value: 'non-pregnant', label: 'Non-Pregnant' }
  ];

  // Age options
  const ageYears = Array.from({ length: 21 }, (_, i) => i);
  const ageMonths = Array.from({ length: 12 }, (_, i) => i);
  const calfAgeYears = Array.from({ length: 6 }, (_, i) => i);
  const calfAgeMonths = Array.from({ length: 12 }, (_, i) => i);

  // Filtered data based on search
  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(sellerSearch.toLowerCase()) ||
    seller.mobile.includes(sellerSearch)
  );

  const getFilteredAgents = (index) => {
    const search = agentSearch[index] || '';
    return commissionerAgents.filter(agent =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.mobile.includes(search)
    );
  };

  const getFilteredAnimalTypes = (index) => {
    const search = animalTypeSearch[index] || '';
    return animalTypes.filter(type =>
      type.toLowerCase().includes(search.toLowerCase())
    );
  };

  const getFilteredBreeds = (index) => {
    const search = breedSearch[index] || '';
    const animalType = formData.animals[index]?.animalType;
    if (!animalType || !breedData[animalType]) return [];
    return breedData[animalType].filter(breed =>
      breed.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sellerRef.current && !sellerRef.current.contains(event.target)) {
        setSellerDropdownOpen(false);
      }

      agentRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setAgentDropdownOpen(prev => ({ ...prev, [index]: false }));
        }
      });

      animalTypeRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setAnimalTypeDropdownOpen(prev => ({ ...prev, [index]: false }));
        }
      });

      breedRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setBreedDropdownOpen(prev => ({ ...prev, [index]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSellerSelect = (seller) => {
    setFormData(prev => ({
      ...prev,
      sellerName: seller.name,
      sellerId: seller.id
    }));
    setSellerDropdownOpen(false);
    setSellerSearch('');
  };

  const handleAgentSelect = (index, agent) => {
    const updatedAnimals = [...formData.animals];
    updatedAnimals[index].advancedDetails.commissionerAgent = `${agent.name} (${agent.mobile})`;
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
    setAgentDropdownOpen(prev => ({ ...prev, [index]: false }));
    setAgentSearch(prev => ({ ...prev, [index]: '' }));
  };

  const handleAnimalChange = (index, field, value) => {
    const updatedAnimals = [...formData.animals];

    if (field === 'animalType') {
      updatedAnimals[index] = {
        ...updatedAnimals[index],
        [field]: value,
        breed: '',
        calfTagId: ''
      };
    } else if (field === 'pregnancyStatus') {
      updatedAnimals[index] = {
        ...updatedAnimals[index],
        [field]: value,
        calfTagId: value === 'milking' ? updatedAnimals[index].calfTagId : ''
      };

      // Reset calf advanced details if not milking
      if (value !== 'milking') {
        updatedAnimals[index].advancedDetails = {
          ...updatedAnimals[index].advancedDetails,
          calfAgeYears: '',
          calfAgeMonths: '',
          calfPhoto: null,
          calfVideo: null
        };
      }
    } else {
      updatedAnimals[index] = {
        ...updatedAnimals[index],
        [field]: value
      };
    }

    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
  };

  const handleAdvancedDetailsChange = (index, field, value) => {
    const updatedAnimals = [...formData.animals];

    if (field === 'ageYears' || field === 'ageMonths') {
      updatedAnimals[index].advancedDetails[field] = value;

      // Validate calf age
      if (updatedAnimals[index].pregnancyStatus === 'milking') {
        const animalTotalMonths = (parseInt(updatedAnimals[index].advancedDetails.ageYears) || 0) * 12 +
          (parseInt(updatedAnimals[index].advancedDetails.ageMonths) || 0);
        const calfTotalMonths = (parseInt(updatedAnimals[index].advancedDetails.calfAgeYears) || 0) * 12 +
          (parseInt(updatedAnimals[index].advancedDetails.calfAgeMonths) || 0);

        if (calfTotalMonths >= animalTotalMonths - 24) {
          updatedAnimals[index].advancedDetails.calfAgeYears = '';
          updatedAnimals[index].advancedDetails.calfAgeMonths = '';
        }
      }
    } else if (field === 'calfAgeYears' || field === 'calfAgeMonths') {
      const animalAge = updatedAnimals[index].advancedDetails;
      const newCalfAgeYears = field === 'calfAgeYears' ? value : animalAge.calfAgeYears;
      const newCalfAgeMonths = field === 'calfAgeMonths' ? value : animalAge.calfAgeMonths;

      const animalTotalMonths = (parseInt(animalAge.ageYears) || 0) * 12 + (parseInt(animalAge.ageMonths) || 0);
      const calfTotalMonths = (parseInt(newCalfAgeYears) || 0) * 12 + (parseInt(newCalfAgeMonths) || 0);

      if (calfTotalMonths < animalTotalMonths - 24 || isNaN(calfTotalMonths)) {
        updatedAnimals[index].advancedDetails[field] = value;
      } else {
        alert('Calf must be at least 2 years younger than the animal');
        return;
      }
    } else {
      updatedAnimals[index].advancedDetails[field] = value;
    }

    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
  };

  const handleMediaUpload = (animalIndex, field, file) => {
    const updatedAnimals = [...formData.animals];

    // Create object with file data
    const fileData = {
      file: file,
      name: file.name,
      type: file.type,
      size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
      uploadedAt: new Date().toISOString()
    };

    // For images and videos, create preview
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        fileData.preview = reader.result;
        updatedAnimals[animalIndex].advancedDetails[field] = fileData;
        setFormData(prev => ({ ...prev, animals: updatedAnimals }));
      };
      reader.readAsDataURL(file);
    } else {
      updatedAnimals[animalIndex].advancedDetails[field] = fileData;
      setFormData(prev => ({ ...prev, animals: updatedAnimals }));
    }
  };

  const removeMedia = (animalIndex, field) => {
    const updatedAnimals = [...formData.animals];
    updatedAnimals[animalIndex].advancedDetails[field] = null;
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
  };

  const openPreview = (src, type, name) => {
    setPreviewModal({ open: true, src, type, name });
  };

  const closePreview = () => {
    setPreviewModal({ open: false, src: '', type: '', name: '' });
  };

  const addAnimal = () => {
    if (formData.animals.length >= parseInt(formData.totalAnimals)) {
      alert(`You can only add ${formData.totalAnimals} animals as specified.`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      animals: [...prev.animals, {
        earTagId: '',
        animalType: '',
        breed: '',
        pricing: '',
        pregnancyStatus: '',
        calfTagId: '',
        advancedDetails: {
          hasAdvanced: false,
          numberOfPregnancies: '',
          ageYears: '',
          ageMonths: '',
          weight: '',
          milkPerDay: '',
          calfAgeYears: '',
          calfAgeMonths: '',
          commissionerAgent: '',
          frontPhoto: null,
          sidePhoto: null,
          backPhoto: null,
          animalVideo: null,
          calfPhoto: null,
          calfVideo: null
        }
      }]
    }));
  };

  const removeAnimal = (index) => {
    if (formData.animals.length === 1) return;

    const updatedAnimals = formData.animals.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));

    // Remove from advanced details open state
    setAdvancedDetailsOpen(prev => {
      const newState = { ...prev };
      delete newState[index];
      // Shift indices for animals after the removed one
      Object.keys(newState).forEach(key => {
        if (parseInt(key) > index) {
          newState[parseInt(key) - 1] = newState[key];
          delete newState[key];
        }
      });
      return newState;
    });
  };

  const toggleAdvancedDetails = (index) => {
    setAdvancedDetailsOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));

    // Mark this animal as having advanced details
    const updatedAnimals = [...formData.animals];
    updatedAnimals[index].advancedDetails.hasAdvanced = !advancedDetailsOpen[index];
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
  };

  const validateForm = () => {
    const errors = [];

    // Validate seller
    if (!formData.sellerId) errors.push('Please select a seller');

    // Validate Total Animals
    if (!formData.totalAnimals || parseInt(formData.totalAnimals) <= 0) {
      errors.push('Total Animals must be a positive number');
    }

    // Validate each animal's basic info
    formData.animals.forEach((animal, index) => {
      const animalNum = index + 1;

      if (!animal.earTagId) errors.push(`Animal ${animalNum}: Ear Tag ID is required`);
      if (!animal.animalType) errors.push(`Animal ${animalNum}: Animal Type is required`);
      if (!animal.breed) errors.push(`Animal ${animalNum}: Breed is required`);
      if (!animal.pricing || parseInt(animal.pricing) <= 0) {
        errors.push(`Animal ${animalNum}: Valid Pricing is required`);
      }
      if (!animal.pregnancyStatus) errors.push(`Animal ${animalNum}: Pregnancy Status is required`);

      if (animal.pregnancyStatus === 'milking' && !animal.calfTagId) {
        errors.push(`Animal ${animalNum}: Calf Tag ID is required for milking animals`);
      }
    });

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }

    // Show summary of what's being submitted
    const basicAnimalsCount = formData.animals.length;
    const advancedAnimalsCount = formData.animals.filter(a => a.advancedDetails.hasAdvanced).length;

    alert(`✅ Registration Successful!\n\n` +
      `Seller: ${formData.sellerName}\n` +
      `Total Animals: ${formData.totalAnimals}\n` +
      `Basic Details: ${basicAnimalsCount} animals\n` +
      `Advanced Details: ${advancedAnimalsCount} animals\n\n` +
      `Data submitted successfully!`);

    console.log('Form submitted:', formData);

    // Reset form
    setFormData({
      sellerName: '',
      sellerId: '',
      totalAnimals: '',
      animals: [{
        earTagId: '',
        animalType: '',
        breed: '',
        pricing: '',
        pregnancyStatus: '',
        calfTagId: '',
        advancedDetails: {
          hasAdvanced: false,
          numberOfPregnancies: '',
          ageYears: '',
          ageMonths: '',
          weight: '',
          milkPerDay: '',
          calfAgeYears: '',
          calfAgeMonths: '',
          commissionerAgent: '',
          frontPhoto: null,
          sidePhoto: null,
          backPhoto: null,
          animalVideo: null,
          calfPhoto: null,
          calfVideo: null
        }
      }]
    });

    setAdvancedDetailsOpen({});
    setSellerSearch('');
    setAgentSearch({});
    setAnimalTypeSearch({});
    setBreedSearch({});
  };

  const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

  // Check if seller details are filled
  const isSellerDetailsFilled = formData.sellerId && formData.totalAnimals;

  return (
    <div className="space-y-6 p-4">
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Animal Registration</h1>
        <p className="text-gray-600">Register new seller for animal procurement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seller Selection Card */}
        <div className="card bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Search className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Step 1: Select Seller</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative" ref={sellerRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seller Name <RequiredStar />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.sellerName}
                  readOnly
                  className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                  placeholder="Click to select seller"
                  onClick={() => setSellerDropdownOpen(!sellerDropdownOpen)}
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setSellerDropdownOpen(!sellerDropdownOpen)}
                />

                {sellerDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        value={sellerSearch}
                        onChange={(e) => setSellerSearch(e.target.value)}
                        placeholder="Search seller by name or mobile..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredSellers.length > 0 ? (
                        filteredSellers.map(seller => (
                          <div
                            key={seller.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSellerSelect(seller)}
                          >
                            <div className="font-medium text-gray-900">{seller.name}</div>
                            <div className="text-sm text-gray-500">{seller.mobile}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No sellers found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Number of Animals <RequiredStar />
              </label>
              <input
                type="number"
                value={formData.totalAnimals}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > 0) {
                    setFormData(prev => ({ ...prev, totalAnimals: value }));
                    // If value is less than current animals, remove extra animals
                    if (value < prev.animals.length) {
                      const updatedAnimals = prev.animals.slice(0, value);
                      setFormData(prev => ({ ...prev, animals: updatedAnimals }));

                      // Reset advanced details state
                      const newAdvancedState = {};
                      updatedAnimals.forEach((_, i) => {
                        if (advancedDetailsOpen[i]) {
                          newAdvancedState[i] = true;
                        }
                      });
                      setAdvancedDetailsOpen(newAdvancedState);
                    }
                  } else if (e.target.value === '') {
                    setFormData(prev => ({ ...prev, totalAnimals: '' }));
                  }
                }}
                className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="How many animals?"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Animal Details - Only show if seller details are filled */}
        {isSellerDetailsFilled ? (
          <>
            {formData.animals.map((animal, index) => (
              <div key={index} className="card bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <GiCow className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Animal {index + 1} Details
                      </h2>
                      <p className="text-sm text-gray-500">
                        Fill basic information first
                      </p>
                    </div>
                  </div>
                  {formData.animals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAnimal(index)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Remove Animal
                    </button>
                  )}
                </div>

                {/* Basic Details Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Basic Details (Required)</h3>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      5 fields to fill
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Ear Tag ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ear Tag ID <RequiredStar />
                      </label>
                      <input
                        type="text"
                        value={animal.earTagId}
                        onChange={(e) => handleAnimalChange(index, 'earTagId', e.target.value)}
                        className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter Ear Tag ID"
                        required
                      />
                    </div>

                    {/* Animal Type */}
                    <div className="relative" ref={el => animalTypeRefs.current[index] = el}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Animal Type <RequiredStar />
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={animal.animalType}
                          readOnly
                          className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                          placeholder="Select animal type"
                          onClick={() => setAnimalTypeDropdownOpen(prev => ({ ...prev, [index]: !prev[index] }))}
                          required
                        />
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                          onClick={() => setAnimalTypeDropdownOpen(prev => ({ ...prev, [index]: !prev[index] }))}
                        />

                        {animalTypeDropdownOpen[index] && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                            <div className="p-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={animalTypeSearch[index] || ''}
                                onChange={(e) => setAnimalTypeSearch(prev => ({ ...prev, [index]: e.target.value }))}
                                placeholder="Search animal type..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {getFilteredAnimalTypes(index).map(type => (
                                <div
                                  key={type}
                                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  onClick={() => {
                                    handleAnimalChange(index, 'animalType', type);
                                    setAnimalTypeDropdownOpen(prev => ({ ...prev, [index]: false }));
                                    setAnimalTypeSearch(prev => ({ ...prev, [index]: '' }));
                                  }}
                                >
                                  {type}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Breed */}
                    <div className="relative" ref={el => breedRefs.current[index] = el}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Breed <RequiredStar />
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={animal.breed}
                          readOnly
                          disabled={!animal.animalType}
                          className={`input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer ${!animal.animalType ? 'bg-gray-50' : ''}`}
                          placeholder={animal.animalType ? "Select breed" : "Select animal type first"}
                          onClick={() => animal.animalType && setBreedDropdownOpen(prev => ({ ...prev, [index]: !prev[index] }))}
                          required
                        />
                        {animal.animalType && (
                          <ChevronDown
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setBreedDropdownOpen(prev => ({ ...prev, [index]: !prev[index] }))}
                          />
                        )}

                        {breedDropdownOpen[index] && animal.animalType && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                            <div className="p-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={breedSearch[index] || ''}
                                onChange={(e) => setBreedSearch(prev => ({ ...prev, [index]: e.target.value }))}
                                placeholder="Search breed..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {getFilteredBreeds(index).map(breed => (
                                <div
                                  key={breed}
                                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  onClick={() => {
                                    handleAnimalChange(index, 'breed', breed);
                                    setBreedDropdownOpen(prev => ({ ...prev, [index]: false }));
                                    setBreedSearch(prev => ({ ...prev, [index]: '' }));
                                  }}
                                >
                                  {breed}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pricing (₹) <RequiredStar />
                      </label>
                      <input
                        type="number"
                        value={animal.pricing}
                        onChange={(e) => {
                          const value = e.target.value === '' ? '' : parseInt(e.target.value);
                          if (value === '' || value > 0) {
                            handleAnimalChange(index, 'pricing', value);
                          }
                        }}
                        className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter price"
                        min="1"
                        required
                      />
                    </div>

                    {/* Pregnancy Status - Horizontal Layout */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pregnancy Status <RequiredStar />
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {pregnancyOptions.map(option => (
                          <label key={option.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`pregnancyStatus-${index}`}
                              value={option.value}
                              checked={animal.pregnancyStatus === option.value}
                              onChange={(e) => handleAnimalChange(index, 'pregnancyStatus', e.target.value)}
                              className="text-primary-600 focus:ring-primary-500"
                              required
                            />
                            <span className="text-sm capitalize">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Calf Tag ID (Conditional) */}
                    {animal.pregnancyStatus === 'milking' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Calf Tag ID <RequiredStar />
                        </label>
                        <input
                          type="text"
                          value={animal.calfTagId}
                          onChange={(e) => handleAnimalChange(index, 'calfTagId', e.target.value)}
                          className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter Calf Tag ID"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Add More Details Button */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Want to add more details?</h4>
                      <p className="text-sm text-gray-500">
                        Photos, weight, age, milk production, etc.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAdvancedDetails(index)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${advancedDetailsOpen[index]
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                        }`}
                    >
                      {advancedDetailsOpen[index] ? 'Hide Details' : 'Add More Details'}
                    </button>
                  </div>
                  {/* Advanced Details (Collapsible) */}
                  {advancedDetailsOpen[index] && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-4">Additional Details</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Number of Pregnancies */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Pregnancies
                          </label>
                          <input
                            type="number"
                            value={animal.advancedDetails.numberOfPregnancies}
                            onChange={(e) => {
                              const value = e.target.value === '' ? '' : parseInt(e.target.value);
                              if (value === '' || (value >= 0 && value <= 8)) {
                                handleAdvancedDetailsChange(index, 'numberOfPregnancies', value);
                              }
                            }}
                            className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="0-8"
                            min="0"
                            max="8"
                          />
                        </div>

                        {/* Age */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Age
                          </label>
                          <div className="flex space-x-2">
                            <select
                              value={animal.advancedDetails.ageYears}
                              onChange={(e) => handleAdvancedDetailsChange(index, 'ageYears', e.target.value)}
                              className="input-field flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="">Years</option>
                              {ageYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                            <select
                              value={animal.advancedDetails.ageMonths}
                              onChange={(e) => handleAdvancedDetailsChange(index, 'ageMonths', e.target.value)}
                              className="input-field flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="">Months</option>
                              {ageMonths.map(month => (
                                <option key={month} value={month}>{month}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Weight */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weight (KG)
                          </label>
                          <input
                            type="number"
                            value={animal.advancedDetails.weight}
                            onChange={(e) => {
                              const value = e.target.value === '' ? '' : parseInt(e.target.value);
                              if (value === '' || (value > 0 && value <= 700)) {
                                handleAdvancedDetailsChange(index, 'weight', value);
                              }
                            }}
                            className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="1-700 kg"
                            min="1"
                            max="700"
                          />
                        </div>

                        {/* Milk per Day */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Milk per Day (Liters)
                          </label>
                          <input
                            type="number"
                            value={animal.advancedDetails.milkPerDay}
                            onChange={(e) => {
                              const value = e.target.value === '' ? '' : parseInt(e.target.value);
                              if (value === '' || (value > 0 && value <= 25)) {
                                handleAdvancedDetailsChange(index, 'milkPerDay', value);
                              }
                            }}
                            className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="1-25 liters"
                            min="1"
                            max="25"
                          />
                        </div>
                      </div>

                      {/* Commissioner Agent and Calf Age in one row (Conditional) */}
                      <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          {/* Commissioner Agent – ALWAYS visible */}
                          <div className="relative" ref={el => agentRefs.current[index] = el}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Commissioner Agent
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={animal.advancedDetails.commissionerAgent}
                                readOnly
                                className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                                placeholder="Select commissioner agent"
                                onClick={() =>
                                  setAgentDropdownOpen(prev => ({
                                    ...prev,
                                    [index]: !prev[index]
                                  }))
                                }
                              />
                              <ChevronDown
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                onClick={() =>
                                  setAgentDropdownOpen(prev => ({
                                    ...prev,
                                    [index]: !prev[index]
                                  }))
                                }
                              />

                              {agentDropdownOpen[index] && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                                  <div className="p-2 border-b border-gray-200">
                                    <input
                                      type="text"
                                      value={agentSearch[index] || ''}
                                      onChange={(e) =>
                                        setAgentSearch(prev => ({
                                          ...prev,
                                          [index]: e.target.value
                                        }))
                                      }
                                      placeholder="Search agent by name or mobile..."
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      autoFocus
                                    />
                                  </div>

                                  <div className="max-h-48 overflow-y-auto">
                                    {getFilteredAgents(index).length > 0 ? (
                                      getFilteredAgents(index).map(agent => (
                                        <div
                                          key={agent.id}
                                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                          onClick={() => handleAgentSelect(index, agent)}
                                        >
                                          <div className="font-medium text-gray-900">
                                            {agent.name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {agent.mobile}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-4 py-3 text-gray-500 text-center">
                                        No agents found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Calf Age – ONLY when milking */}
                          {animal.pregnancyStatus === 'milking' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Calf Age
                              </label>
                              <div className="flex space-x-2">
                                <select
                                  value={animal.advancedDetails.calfAgeYears}
                                  onChange={(e) =>
                                    handleAdvancedDetailsChange(
                                      index,
                                      'calfAgeYears',
                                      e.target.value
                                    )
                                  }
                                  className="input-field flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                  <option value="">Years</option>
                                  {calfAgeYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                  ))}
                                </select>

                                <select
                                  value={animal.advancedDetails.calfAgeMonths}
                                  onChange={(e) =>
                                    handleAdvancedDetailsChange(
                                      index,
                                      'calfAgeMonths',
                                      e.target.value
                                    )
                                  }
                                  className="input-field flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                  <option value="">Months</option>
                                  {calfAgeMonths.map(month => (
                                    <option key={month} value={month}>{month}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>


                      {/* Animal Media Section - Combined Photos and Video */}
                      <div className="mt-8">
                        <div className="flex items-center space-x-2 mb-4">
                          <Camera className="text-gray-600" size={20} />
                          <h5 className="font-medium text-gray-900">Animal Media</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Photos - 3 columns */}
                          <div className="md:col-span-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <MediaUploadBox
                                type="photo"
                                preview={animal.advancedDetails.frontPhoto?.preview}
                                label="Front"
                                onUpload={(file) => handleMediaUpload(index, 'frontPhoto', file)}
                                onRemove={() => removeMedia(index, 'frontPhoto')}
                              />
                              <MediaUploadBox
                                type="photo"
                                preview={animal.advancedDetails.sidePhoto?.preview}
                                label="Side"
                                onUpload={(file) => handleMediaUpload(index, 'sidePhoto', file)}
                                onRemove={() => removeMedia(index, 'sidePhoto')}
                              />
                              <MediaUploadBox
                                type="photo"
                                preview={animal.advancedDetails.backPhoto?.preview}
                                label="Back"
                                onUpload={(file) => handleMediaUpload(index, 'backPhoto', file)}
                                onRemove={() => removeMedia(index, 'backPhoto')}
                              />
                            </div>
                          </div>

                          {/* Video - 1 column */}
                          <div>
                            <MediaUploadBox
                              type="video"
                              preview={animal.advancedDetails.animalVideo?.preview}
                              label="Animal Video"
                              instructions="Front → Left → Back → Right → Front"
                              onUpload={(file) => handleMediaUpload(index, 'animalVideo', file)}
                              onRemove={() => removeMedia(index, 'animalVideo')}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Calf Media Section (Conditional) - Now with only one photo */}
                      {animal.pregnancyStatus === 'milking' && (
                        <>
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center space-x-2 mb-4">
                              <Camera className="text-gray-600" size={20} />
                              <h5 className="font-medium text-gray-900">Calf Media</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              {/* Calf Photo - Single photo now */}
                              <div>
                                <MediaUploadBox
                                  type="photo"
                                  preview={animal.advancedDetails.calfPhoto?.preview}
                                  label="Calf Photo"
                                  onUpload={(file) => handleMediaUpload(index, 'calfPhoto', file)}
                                  onRemove={() => removeMedia(index, 'calfPhoto')}
                                />
                              </div>

                              {/* Calf Video - 1 column */}
                              <div>
                                <MediaUploadBox
                                  type="video"
                                  preview={animal.advancedDetails.calfVideo?.preview}
                                  label="Calf Video"
                                  instructions="Front → Left → Back → Right → Front"
                                  onUpload={(file) => handleMediaUpload(index, 'calfVideo', file)}
                                  onRemove={() => removeMedia(index, 'calfVideo')}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add More Animal Button */}
            {formData.totalAnimals && parseInt(formData.totalAnimals) > 1 &&
              formData.animals.length < parseInt(formData.totalAnimals) && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={addAnimal}
                    className="px-6 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 font-medium transition-colors"
                  >
                    + Add Animal {formData.animals.length + 1} of {formData.totalAnimals}
                  </button>
                </div>
              )}
          </>
        ) : (
          <div className="card bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <GiCow className="text-gray-300" size={64} />
              <h3 className="text-lg font-semibold text-gray-700">Start with seller Details</h3>
              <p className="text-gray-500 max-w-md">
                First, select a seller and specify how many animals you want to register.
                Then you'll fill basic details for each animal.
              </p>
            </div>
          </div>
        )}

        {/* Form Actions - Only show if seller details are filled */}
        {isSellerDetailsFilled && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <strong>Tip:</strong> You can submit with just basic details!
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure? All entered data will be lost.')) {
                    window.history.back();
                  }
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Register Animal
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

// Media Upload Component (as per your requested design)
const MediaUploadBox = ({ type, preview, onUpload, onRemove, label, instructions }) => {
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

  return (
    <div className="relative">
      {preview ? (
        <div className="relative">
          {type === 'photo' ? (
            <img
              src={preview}
              alt={label}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="relative">
              <video
                src={preview}
                className="w-full h-48 object-cover rounded-lg"
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
            <>
              <Video className="text-gray-400 mb-2" size={24} />
              {instructions && (
                <div className="text-xs text-gray-500 flex items-center justify-center">
                  <RotateCw size={10} className="mr-1" />
                  {instructions}
                </div>
              )}
            </>
          )}

          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-xs text-gray-500 mb-3">Click to upload</p>
          <input
            type="file"
            accept={type === 'photo' ? 'image/*' : 'video/*'}
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${label}-${Date.now()}`}
          />
          <label
            htmlFor={`upload-${label}-${Date.now()}`}
            className="px-3 py-1 bg-primary-50 text-primary-700 rounded text-sm font-medium cursor-pointer hover:bg-primary-100"
          >
            Upload
          </label>
        </div>
      )}
    </div>
  );
};

export default AnimalRegistration;