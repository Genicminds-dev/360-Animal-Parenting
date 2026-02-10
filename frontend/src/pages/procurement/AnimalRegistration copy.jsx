import React, { useState, useEffect, useRef } from 'react';
import { Camera, Tag, Scale, Calendar, MapPin, Upload, X, Search, ChevronDown, Video, RotateCw, User } from 'lucide-react';
import { GiCow } from 'react-icons/gi';

const AnimalRegistration = () => {
  const [formData, setFormData] = useState({
    // Vendor Details
    vendorName: '',
    vendorId: '',
    
    // General Info
    totalAnimals: '',
    
    // Animals Array (for multiple animals)
    animals: [{
      earTagId: '',
      animalType: '',
      breed: '',
      pricing: '',
      pregnancyStatus: '',
      calfTagId: '',
      numberOfPregnancies: '',
      ageYears: '',
      ageMonths: '',
      weight: '',
      milkPerDay: '',
      calfAgeYears: '',
      calfAgeMonths: '',
      commissionAgentName: '',
      commissionAgentId: '',
      // Media
      frontPhoto: null,
      sidePhoto: null,
      backPhoto: null,
      animalVideo: null,
      calfPhoto: null,
      calfVideo: null
    }]
  });

  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [vendorSearch, setVendorSearch] = useState('');
  const [commissionAgentDropdownOpen, setCommissionAgentDropdownOpen] = useState({});
  const [commissionAgentSearch, setCommissionAgentSearch] = useState({});
  const [animalTypeDropdownOpen, setAnimalTypeDropdownOpen] = useState({});
  const [animalTypeSearch, setAnimalTypeSearch] = useState({});
  const [breedDropdownOpen, setBreedDropdownOpen] = useState({});
  const [breedSearch, setBreedSearch] = useState({});
  const [pregnancyStatusDropdownOpen, setPregnancyStatusDropdownOpen] = useState({});

  // Refs for dropdown closing
  const vendorRef = useRef(null);
  const commissionAgentRefs = useRef([]);
  const animalTypeRefs = useRef([]);
  const breedRefs = useRef([]);
  const pregnancyStatusRefs = useRef([]);

  // Dummy Data
  const vendors = [
    { id: 'V001', name: 'Rajesh Kumar', mobile: '9876543210' },
    { id: 'V002', name: 'Suresh Patel', mobile: '9876543211' },
    { id: 'V003', name: 'Mohan Singh', mobile: '9876543212' },
    { id: 'V004', name: 'Anil Sharma', mobile: '9876543213' },
    { id: 'V005', name: 'Vikram Verma', mobile: '9876543214' },
    { id: 'V006', name: 'Ramesh Gupta', mobile: '9876543215' },
    { id: 'V007', name: 'Harish Joshi', mobile: '9876543216' }
  ];

  const commissionAgents = [
    { id: 'CA001', name: 'Amit Singh', mobile: '9876543220' },
    { id: 'CA002', name: 'Ravi Kumar', mobile: '9876543221' },
    { id: 'CA003', name: 'Sunil Mehta', mobile: '9876543222' },
    { id: 'CA004', name: 'Prakash Jain', mobile: '9876543223' },
    { id: 'CA005', name: 'Deepak Sharma', mobile: '9876543224' },
    { id: 'CA006', name: 'Kunal Verma', mobile: '9876543225' },
    { id: 'CA007', name: 'Vishal Gupta', mobile: '9876543226' },
    { id: 'CA008', name: 'Nitin Patel', mobile: '9876543227' },
    { id: 'CA009', name: 'Manish Yadav', mobile: '9876543228' },
    { id: 'CA010', name: 'Sandeep Mishra', mobile: '9876543229' }
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

  // Age options - up to 20 years
  const ageYears = Array.from({ length: 21 }, (_, i) => i); // 0 to 20 years
  const ageMonths = Array.from({ length: 12 }, (_, i) => i); // 0 to 11 months

  // Calf age options - up to 5 years
  const calfAgeYears = Array.from({ length: 6 }, (_, i) => i); // 0 to 5 years
  const calfAgeMonths = Array.from({ length: 12 }, (_, i) => i); // 0 to 11 months

  // Filtered data based on search
  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
    vendor.mobile.includes(vendorSearch)
  );

  const getFilteredCommissionAgents = (index) => {
    const search = commissionAgentSearch[index] || '';
    return commissionAgents.filter(agent => 
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
      if (vendorRef.current && !vendorRef.current.contains(event.target)) {
        setVendorDropdownOpen(false);
      }

      commissionAgentRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setCommissionAgentDropdownOpen(prev => ({ ...prev, [index]: false }));
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

      pregnancyStatusRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setPregnancyStatusDropdownOpen(prev => ({ ...prev, [index]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVendorSelect = (vendor) => {
    setFormData(prev => ({
      ...prev,
      vendorName: vendor.name,
      vendorId: vendor.id
    }));
    setVendorDropdownOpen(false);
    setVendorSearch('');
  };

  const handleCommissionAgentSelect = (index, agent) => {
    const updatedAnimals = [...formData.animals];
    updatedAnimals[index] = {
      ...updatedAnimals[index],
      commissionAgentName: agent.name,
      commissionAgentId: agent.id
    };
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
    setCommissionAgentDropdownOpen(prev => ({ ...prev, [index]: false }));
    setCommissionAgentSearch(prev => ({ ...prev, [index]: '' }));
  };

  const handleAnimalChange = (index, field, value) => {
    const updatedAnimals = [...formData.animals];
    
    if (field === 'animalType') {
      // Reset breed when animal type changes
      updatedAnimals[index] = {
        ...updatedAnimals[index],
        [field]: value,
        breed: '',
        calfTagId: value ? updatedAnimals[index].calfTagId : ''
      };
    } else if (field === 'pregnancyStatus') {
      // Reset calfTagId if not milking
      updatedAnimals[index] = {
        ...updatedAnimals[index],
        [field]: value,
        calfTagId: value === 'milking' ? updatedAnimals[index].calfTagId : '',
        calfAgeYears: value === 'milking' ? updatedAnimals[index].calfAgeYears : '',
        calfAgeMonths: value === 'milking' ? updatedAnimals[index].calfAgeMonths : '',
        calfPhoto: value === 'milking' ? updatedAnimals[index].calfPhoto : null,
        calfVideo: value === 'milking' ? updatedAnimals[index].calfVideo : null
      };
    } else if (field === 'ageYears' || field === 'ageMonths') {
      // When animal age changes, validate calf age
      updatedAnimals[index] = {
        ...updatedAnimals[index],
        [field]: value
      };
      
      // If calf age exists and is now greater than or equal to animal age minus 2, reset it
      if (field === 'ageYears' || field === 'ageMonths') {
        const animalAge = updatedAnimals[index];
        const animalTotalMonths = (parseInt(animalAge.ageYears) || 0) * 12 + (parseInt(animalAge.ageMonths) || 0);
        const calfTotalMonths = (parseInt(animalAge.calfAgeYears) || 0) * 12 + (parseInt(animalAge.calfAgeMonths) || 0);
        
        // Calf must be at least 2 years younger than animal
        if (calfTotalMonths >= animalTotalMonths - 24) {
          updatedAnimals[index].calfAgeYears = '';
          updatedAnimals[index].calfAgeMonths = '';
        }
      }
    } else if (field === 'calfAgeYears' || field === 'calfAgeMonths') {
      // Validate calf age is at least 2 years younger than animal
      const animalAge = updatedAnimals[index];
      const newCalfAgeYears = field === 'calfAgeYears' ? value : animalAge.calfAgeYears;
      const newCalfAgeMonths = field === 'calfAgeMonths' ? value : animalAge.calfAgeMonths;
      
      const animalTotalMonths = (parseInt(animalAge.ageYears) || 0) * 12 + (parseInt(animalAge.ageMonths) || 0);
      const calfTotalMonths = (parseInt(newCalfAgeYears) || 0) * 12 + (parseInt(newCalfAgeMonths) || 0);
      
      // Check if calf is at least 2 years younger
      if (calfTotalMonths < animalTotalMonths - 24 || isNaN(calfTotalMonths)) {
        updatedAnimals[index] = {
          ...updatedAnimals[index],
          [field]: value
        };
      } else {
        // If not valid, show alert and don't update
        alert('Calf must be at least 2 years younger than the animal');
        return;
      }
    } else {
      updatedAnimals[index] = {
        ...updatedAnimals[index],
        [field]: value
      };
    }
    
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
  };

  const handleMediaUpload = (index, field, file) => {
    const updatedAnimals = [...formData.animals];
    updatedAnimals[index][field] = file;
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedPreviews = [...previewMedia];
      if (!updatedPreviews[index]) {
        updatedPreviews[index] = {};
      }
      updatedPreviews[index][field] = reader.result;
      setPreviewMedia(updatedPreviews);
    };
    
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      reader.readAsDataURL(file);
    }
  };

  const [previewMedia, setPreviewMedia] = useState([{}]);

  const removeMedia = (index, field) => {
    const updatedAnimals = [...formData.animals];
    updatedAnimals[index][field] = null;
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));

    const updatedPreviews = [...previewMedia];
    if (updatedPreviews[index]) {
      updatedPreviews[index][field] = null;
    }
    setPreviewMedia(updatedPreviews);
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
        numberOfPregnancies: '',
        ageYears: '',
        ageMonths: '',
        weight: '',
        milkPerDay: '',
        calfAgeYears: '',
        calfAgeMonths: '',
        commissionAgentName: '',
        commissionAgentId: '',
        frontPhoto: null,
        sidePhoto: null,
        backPhoto: null,
        animalVideo: null,
        calfPhoto: null,
        calfVideo: null
      }]
    }));
    
    setPreviewMedia(prev => [...prev, {}]);
  };

  const removeAnimal = (index) => {
    if (formData.animals.length === 1) return;
    
    const updatedAnimals = formData.animals.filter((_, i) => i !== index);
    const updatedPreviews = previewMedia.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
    setPreviewMedia(updatedPreviews);
  };

  const validateForm = () => {
    const errors = [];
    
    // Validate Vendor
    if (!formData.vendorId) errors.push('Please select a vendor');
    
    // Validate Total Animals
    if (!formData.totalAnimals || parseInt(formData.totalAnimals) <= 0) {
      errors.push('Total Animals must be a positive number');
    }
    
    // Validate each animal
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
      
      if (animal.numberOfPregnancies && (parseInt(animal.numberOfPregnancies) < 0 || parseInt(animal.numberOfPregnancies) > 8)) {
        errors.push(`Animal ${animalNum}: Number of Pregnancies must be between 0-8`);
      }
      
      if (animal.weight && (parseInt(animal.weight) <= 0 || parseInt(animal.weight) > 700)) {
        errors.push(`Animal ${animalNum}: Weight must be between 1-700 kg`);
      }
      if (!animal.milkPerDay || parseInt(animal.milkPerDay) <= 0 || parseInt(animal.milkPerDay) > 25) {
        errors.push(`Animal ${animalNum}: Milk per Day must be between 1-25 liters`);
      }
      
      // Validate calf age if provided (optional)
      if (animal.pregnancyStatus === 'milking' && (animal.calfAgeYears !== '' || animal.calfAgeMonths !== '')) {
        const animalTotalMonths = (parseInt(animal.ageYears) || 0) * 12 + (parseInt(animal.ageMonths) || 0);
        const calfTotalMonths = (parseInt(animal.calfAgeYears) || 0) * 12 + (parseInt(animal.calfAgeMonths) || 0);
        
        // Calf must be at least 2 years younger than animal
        if (calfTotalMonths >= animalTotalMonths - 24) {
          errors.push(`Animal ${animalNum}: Calf must be at least 2 years younger than the animal`);
        }
        
        // Calf max 5 years
        if (parseInt(animal.calfAgeYears) > 5) {
          errors.push(`Animal ${animalNum}: Calf age cannot exceed 5 years`);
        }
      }
      
      // Photo validation (required)
      if (!animal.frontPhoto) errors.push(`Animal ${animalNum}: Front Photo is required`);
      if (!animal.sidePhoto) errors.push(`Animal ${animalNum}: Side Photo is required`);
      if (!animal.backPhoto) errors.push(`Animal ${animalNum}: Back Photo is required`);
      
      // Video is optional, no validation needed
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
    
    console.log('Form submitted:', formData);
    alert('Animal registration submitted successfully!');
    
    // Reset form
    setFormData({
      vendorName: '',
      vendorId: '',
      totalAnimals: '',
      animals: [{
        earTagId: '',
        animalType: '',
        breed: '',
        pricing: '',
        pregnancyStatus: '',
        calfTagId: '',
        numberOfPregnancies: '',
        ageYears: '',
        ageMonths: '',
        weight: '',
        milkPerDay: '',
        calfAgeYears: '',
        calfAgeMonths: '',
        commissionAgentName: '',
        commissionAgentId: '',
        frontPhoto: null,
        sidePhoto: null,
        backPhoto: null,
        animalVideo: null,
        calfPhoto: null,
        calfVideo: null
      }]
    });
    
    setPreviewMedia([{}]);
    setVendorSearch('');
    setCommissionAgentSearch({});
    setAnimalTypeSearch({});
    setBreedSearch({});
  };

  const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

  // Check if vendor details are filled
  const isVendorDetailsFilled = formData.vendorId && formData.totalAnimals;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Animal Registration</h1>
        <p className="text-gray-600">Register new animals for procurement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Vendor Selection Card */}
        <div className="card bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Search className="text-blue-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Vendor Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative" ref={vendorRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name <RequiredStar />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.vendorName}
                  readOnly
                  className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                  placeholder="Select vendor"
                  onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
                  required
                />
                <ChevronDown 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
                />
                
                {vendorDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        value={vendorSearch}
                        onChange={(e) => setVendorSearch(e.target.value)}
                        placeholder="Search vendor by name or mobile..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredVendors.length > 0 ? (
                        filteredVendors.map(vendor => (
                          <div
                            key={vendor.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleVendorSelect(vendor)}
                          >
                            <div className="font-medium text-gray-900">{vendor.name}</div>
                            <div className="text-sm text-gray-500">{vendor.mobile}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No vendors found
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
                      setPreviewMedia(prev => prev.slice(0, value));
                    }
                  } else if (e.target.value === '') {
                    setFormData(prev => ({ ...prev, totalAnimals: '' }));
                  }
                }}
                className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter total animals"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Animal Details - Only show if vendor details are filled */}
        {isVendorDetailsFilled ? (
          <>
            {formData.animals.map((animal, index) => (
              <div key={index} className="card bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <GiCow className="text-green-600" size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Animal {index + 1} Details
                    </h2>
                  </div>
                  {formData.animals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAnimal(index)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

                  {/* Commission Agent */}
                  <div className="relative" ref={el => commissionAgentRefs.current[index] = el}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Agent
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={animal.commissionAgentName}
                        readOnly
                        className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                        placeholder="Select commission agent"
                        onClick={() => setCommissionAgentDropdownOpen(prev => ({ ...prev, [index]: !prev[index] }))}
                      />
                      <ChevronDown 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={() => setCommissionAgentDropdownOpen(prev => ({ ...prev, [index]: !prev[index] }))}
                      />
                      
                      {commissionAgentDropdownOpen[index] && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                          <div className="p-2 border-b border-gray-200">
                            <input
                              type="text"
                              value={commissionAgentSearch[index] || ''}
                              onChange={(e) => setCommissionAgentSearch(prev => ({ ...prev, [index]: e.target.value }))}
                              placeholder="Search agent by name or mobile..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                              autoFocus
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {getFilteredCommissionAgents(index).length > 0 ? (
                              getFilteredCommissionAgents(index).map(agent => (
                                <div
                                  key={agent.id}
                                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  onClick={() => handleCommissionAgentSelect(index, agent)}
                                >
                                  <div className="font-medium text-gray-900">{agent.name}</div>
                                  <div className="text-sm text-gray-500">{agent.mobile}</div>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500 text-center">
                                No commission agents found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
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
                </div>

                {/* Second Row - Pricing and Age Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

                  {/* Number of Pregnancies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Pregnancies
                    </label>
                    <input
                      type="number"
                      value={animal.numberOfPregnancies}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseInt(e.target.value);
                        if (value === '' || (value >= 0 && value <= 8)) {
                          handleAnimalChange(index, 'numberOfPregnancies', value);
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
                        value={animal.ageYears}
                        onChange={(e) => handleAnimalChange(index, 'ageYears', e.target.value)}
                        className="input-field flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                        style={{ 
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">Years</option>
                        {ageYears.map(year => (
                          <option key={year} value={year}>{year} Year{year !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      <select
                        value={animal.ageMonths}
                        onChange={(e) => handleAnimalChange(index, 'ageMonths', e.target.value)}
                        className="input-field flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                        style={{ 
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">Months</option>
                        {ageMonths.map(month => (
                          <option key={month} value={month}>{month} Month{month !== 1 ? 's' : ''}</option>
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
                      value={animal.weight}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseInt(e.target.value);
                        if (value === '' || (value > 0 && value <= 700)) {
                          handleAnimalChange(index, 'weight', value);
                        }
                      }}
                      className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="1-700 kg"
                      min="1"
                      max="700"
                    />
                  </div>
                </div>

                {/* Third Row - Milk per Day and Pregnancy Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Milk per Day */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Milk per Day (Liters) <RequiredStar />
                    </label>
                    <input
                      type="number"
                      value={animal.milkPerDay}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseInt(e.target.value);
                        if (value === '' || (value > 0 && value <= 25)) {
                          handleAnimalChange(index, 'milkPerDay', value);
                        }
                      }}
                      className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="1-25 liters"
                      min="1"
                      max="25"
                      required
                    />
                  </div>

                  {/* Pregnancy Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pregnancy Status <RequiredStar />
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {pregnancyOptions.map(option => (
                        <label
                          key={option.value}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            animal.pregnancyStatus === option.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`pregnancyStatus-${index}`}
                            value={option.value}
                            checked={animal.pregnancyStatus === option.value}
                            onChange={(e) => handleAnimalChange(index, 'pregnancyStatus', e.target.value)}
                            className="mr-3 text-primary-600 focus:ring-primary-500"
                            required
                          />
                          <span className="text-gray-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calf Tag ID (Conditional) */}
                {animal.pregnancyStatus === 'milking' && (
                  <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                      {/* Calf Age */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Calf Age
                        </label>
                        <div className="flex space-x-2">
                          <select
                            value={animal.calfAgeYears}
                            onChange={(e) => handleAnimalChange(index, 'calfAgeYears', e.target.value)}
                            className="input-field flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                            style={{ 
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em',
                              paddingRight: '2.5rem'
                            }}
                          >
                            <option value="">Years</option>
                            {calfAgeYears.map(year => (
                              <option key={year} value={year}>{year} Year{year !== 1 ? 's' : ''}</option>
                            ))}
                          </select>
                          <select
                            value={animal.calfAgeMonths}
                            onChange={(e) => handleAnimalChange(index, 'calfAgeMonths', e.target.value)}
                            className="input-field flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                            style={{ 
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em',
                              paddingRight: '2.5rem'
                            }}
                          >
                            <option value="">Months</option>
                            {calfAgeMonths.map(month => (
                              <option key={month} value={month}>{month} Month{month !== 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Upload - Animal */}
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Camera className="text-purple-600" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Animal Media Upload</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Front Photo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Front Photo <RequiredStar />
                      </label>
                      <MediaUploadBox
                        type="photo"
                        preview={previewMedia[index]?.frontPhoto}
                        onUpload={(file) => handleMediaUpload(index, 'frontPhoto', file)}
                        onRemove={() => removeMedia(index, 'frontPhoto')}
                        label="Front View"
                      />
                    </div>

                    {/* Side Photo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Side Photo <RequiredStar />
                      </label>
                      <MediaUploadBox
                        type="photo"
                        preview={previewMedia[index]?.sidePhoto}
                        onUpload={(file) => handleMediaUpload(index, 'sidePhoto', file)}
                        onRemove={() => removeMedia(index, 'sidePhoto')}
                        label="Side View"
                      />
                    </div>

                    {/* Back Photo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Back Photo <RequiredStar />
                      </label>
                      <MediaUploadBox
                        type="photo"
                        preview={previewMedia[index]?.backPhoto}
                        onUpload={(file) => handleMediaUpload(index, 'backPhoto', file)}
                        onRemove={() => removeMedia(index, 'backPhoto')}
                        label="Back View"
                      />
                    </div>

                    {/* Animal 360° Video */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        360° Video
                      </label>
                      <MediaUploadBox
                        type="video"
                        preview={previewMedia[index]?.animalVideo}
                        onUpload={(file) => handleMediaUpload(index, 'animalVideo', file)}
                        onRemove={() => removeMedia(index, 'animalVideo')}
                        label="360° View"
                        instructions="Front → Left → Back → Right → Front"
                      />
                    </div>
                  </div>

                  {/* Calf Media (Conditional) */}
                  {animal.pregnancyStatus === 'milking' && (
                    <>
                      <div className="flex items-center space-x-3 mb-6 mt-8">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Camera className="text-blue-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Calf Media Upload</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Calf Photo */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Calf Photo <RequiredStar />
                          </label>
                          <MediaUploadBox
                            type="photo"
                            preview={previewMedia[index]?.calfPhoto}
                            onUpload={(file) => handleMediaUpload(index, 'calfPhoto', file)}
                            onRemove={() => removeMedia(index, 'calfPhoto')}
                            label="Calf Photo"
                          />
                        </div>

                        {/* Calf 360° Video */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Calf 360° Video
                          </label>
                          <MediaUploadBox
                            type="video"
                            preview={previewMedia[index]?.calfVideo}
                            onUpload={(file) => handleMediaUpload(index, 'calfVideo', file)}
                            onRemove={() => removeMedia(index, 'calfVideo')}
                            label="Calf 360°"
                            instructions="Front → Left → Back → Right → Front"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add More Animal Button - Only show if totalAnimals > current animals count */}
            {formData.totalAnimals && parseInt(formData.totalAnimals) > 1 && 
             formData.animals.length < parseInt(formData.totalAnimals) && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addAnimal}
                  className="px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  + Add Another Animal ({formData.animals.length}/{formData.totalAnimals})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <GiCow className="text-gray-300" size={64} />
              <h3 className="text-lg font-semibold text-gray-700">Complete Vendor Details First</h3>
              <p className="text-gray-500 max-w-md">
                Please fill in the Vendor Name and Total Number of Animals above to start registering animal details.
              </p>
            </div>
          </div>
        )}

        {/* Form Actions - Only show if vendor details are filled */}
        {isVendorDetailsFilled && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Register Animals
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

// Media Upload Component
const MediaUploadBox = ({ type, preview, onUpload, onRemove, label, instructions }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
            <div className="mb-2">
              <Video className="text-gray-400 mb-1" size={24} />
              {instructions && (
                <div className="text-xs text-gray-500 flex items-center justify-center">
                  <RotateCw size={10} className="mr-1" />
                  {instructions}
                </div>
              )}
            </div>
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


