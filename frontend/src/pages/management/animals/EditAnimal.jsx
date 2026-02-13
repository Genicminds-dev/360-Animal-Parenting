// pages/animals/EditAnimal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { 
  Camera, Tag, Scale, Calendar, MapPin, Upload, X, Search, 
  ChevronDown, Video, RotateCw, Info, ArrowLeft, Save 
} from 'lucide-react';
import { GiCow } from 'react-icons/gi';

const EditAnimal = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState({
    sellerName: '',
    sellerId: '',
    totalAnimals: 1,
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

  const [sellerDropdownOpen, setSellerDropdownOpen] = useState(false);
  const [sellerSearch, setSellerSearch] = useState('');
  const [agentDropdownOpen, setAgentDropdownOpen] = useState({});
  const [agentSearch, setAgentSearch] = useState({});
  const [animalTypeDropdownOpen, setAnimalTypeDropdownOpen] = useState({});
  const [animalTypeSearch, setAnimalTypeSearch] = useState({});
  const [breedDropdownOpen, setBreedDropdownOpen] = useState({});
  const [breedSearch, setBreedSearch] = useState({});
  const [advancedDetailsOpen, setAdvancedDetailsOpen] = useState({});
  const [previewModal, setPreviewModal] = useState({ open: false, src: '', type: '', name: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sellerRef = useRef(null);
  const agentRefs = useRef([]);
  const animalTypeRefs = useRef([]);
  const breedRefs = useRef([]);

  // Dummy Data - Same as registration form
  const sellers = [
    { id: 'V001', name: 'Rajesh Kumar', mobile: '9876543210' },
    { id: 'V002', name: 'Suresh Patel', mobile: '9876543211' },
    { id: 'V003', name: 'Mohan Singh', mobile: '9876543212' },
    { id: 'V004', name: 'Anil Sharma', mobile: '9876543213' },
    { id: 'V005', name: 'Vikram Verma', mobile: '9876543214' },
    { id: 'V006', name: 'Ramesh Gupta', mobile: '9876543215' },
    { id: 'V007', name: 'Harish Joshi', mobile: '9876543216' }
  ];

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
    'Cow', 'Buffalo', 'Goat', 'Sheep', 'Camel', 'Horse', 'Bull', 'Ox'
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

  const ageYears = Array.from({ length: 21 }, (_, i) => i);
  const ageMonths = Array.from({ length: 12 }, (_, i) => i);
  const calfAgeYears = Array.from({ length: 6 }, (_, i) => i);
  const calfAgeMonths = Array.from({ length: 12 }, (_, i) => i);

  // Load animal data
  useEffect(() => {
    const loadAnimalData = async () => {
      setLoading(true);
      
      try {
        if (location.state?.animal) {
          const animalData = location.state.animal;
          
          const pricingValue = animalData.pricing 
            ? animalData.pricing.replace(/[^0-9]/g, '') 
            : '';
          
          const weightValue = animalData.weight 
            ? animalData.weight.replace(/[^0-9]/g, '') 
            : '';
          
          const milkValue = animalData.milkPerDay && animalData.milkPerDay !== "N/A"
            ? animalData.milkPerDay.replace(/[^0-9]/g, '')
            : '';

          setFormData({
            sellerName: animalData.vendorName || '',
            sellerId: animalData.vendorId || '',
            totalAnimals: 1,
            animals: [{
              earTagId: animalData.earTagId || '',
              animalType: animalData.animalType || '',
              breed: animalData.breed || '',
              pricing: pricingValue,
              pregnancyStatus: animalData.pregnancyStatus?.toLowerCase() || '',
              calfTagId: animalData.calfTagId || '',
              advancedDetails: {
                hasAdvanced: !!(animalData.ageYears || animalData.weight || animalData.milkPerDay || animalData.calfTagId),
                numberOfPregnancies: animalData.numberOfPregnancies?.toString() || '',
                ageYears: animalData.ageYears?.toString() || '',
                ageMonths: animalData.ageMonths?.toString() || '',
                weight: weightValue,
                milkPerDay: milkValue,
                calfAgeYears: animalData.calfAgeYears?.toString() || '',
                calfAgeMonths: animalData.calfAgeMonths?.toString() || '',
                commissionerAgent: animalData.commissionerAgent || '',
                frontPhoto: animalData.hasFrontPhoto ? { 
                  preview: `https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400`,
                  name: 'front-view.jpg',
                  type: 'image/jpeg' 
                } : null,
                sidePhoto: animalData.hasSidePhoto ? { 
                  preview: `https://images.unsplash.com/photo-1547722700-57de53c5c0e7?w=400`,
                  name: 'side-view.jpg',
                  type: 'image/jpeg' 
                } : null,
                backPhoto: animalData.hasBackPhoto ? { 
                  preview: `https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=400`,
                  name: 'back-view.jpg',
                  type: 'image/jpeg' 
                } : null,
                animalVideo: animalData.hasAnimalVideo ? {
                  preview: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
                  name: 'animal-video.mp4',
                  type: 'video/mp4'
                } : null,
                calfPhoto: animalData.hasCalfPhoto ? {
                  preview: `https://images.unsplash.com/photo-1597848212624-e6f1f5d6f7d0?w=400`,
                  name: 'calf-photo.jpg',
                  type: 'image/jpeg'
                } : null,
                calfVideo: animalData.hasCalfVideo ? {
                  preview: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
                  name: 'calf-video.mp4',
                  type: 'video/mp4'
                } : null
              }
            }]
          });

          if (animalData.ageYears || animalData.weight || animalData.milkPerDay || animalData.calfTagId) {
            setAdvancedDetailsOpen({ 0: true });
          }
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

  const toggleAdvancedDetails = (index) => {
    setAdvancedDetailsOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));

    const updatedAnimals = [...formData.animals];
    updatedAnimals[index].advancedDetails.hasAdvanced = !advancedDetailsOpen[index];
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.sellerId) errors.push('Please select a seller');

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
        vendorName: formData.sellerName,
        vendorId: formData.sellerId,
        earTagId: formData.animals[0].earTagId,
        animalType: formData.animals[0].animalType,
        breed: formData.animals[0].breed,
        pricing: `₹${parseInt(formData.animals[0].pricing).toLocaleString('en-IN')}`,
        pregnancyStatus: formData.animals[0].pregnancyStatus.charAt(0).toUpperCase() + 
                         formData.animals[0].pregnancyStatus.slice(1),
        calfTagId: formData.animals[0].calfTagId || '',
        numberOfPregnancies: formData.animals[0].advancedDetails.numberOfPregnancies || 0,
        ageYears: formData.animals[0].advancedDetails.ageYears || '',
        ageMonths: formData.animals[0].advancedDetails.ageMonths || '',
        weight: formData.animals[0].advancedDetails.weight ? 
                `${formData.animals[0].advancedDetails.weight} kg` : '',
        milkPerDay: formData.animals[0].advancedDetails.milkPerDay ? 
                    `${formData.animals[0].advancedDetails.milkPerDay} liters` : 'N/A',
        calfAgeYears: formData.animals[0].advancedDetails.calfAgeYears || '',
        calfAgeMonths: formData.animals[0].advancedDetails.calfAgeMonths || '',
        commissionerAgent: formData.animals[0].advancedDetails.commissionerAgent,
        hasFrontPhoto: !!formData.animals[0].advancedDetails.frontPhoto,
        hasSidePhoto: !!formData.animals[0].advancedDetails.sidePhoto,
        hasBackPhoto: !!formData.animals[0].advancedDetails.backPhoto,
        hasAnimalVideo: !!formData.animals[0].advancedDetails.animalVideo,
        hasCalfPhoto: !!formData.animals[0].advancedDetails.calfPhoto,
        hasCalfVideo: !!formData.animals[0].advancedDetails.calfVideo,
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
    <div className="space-y-6 p-4">
      <Toaster position="top-center" />

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
        <h1 className="text-2xl font-bold text-gray-900">Edit Animal</h1>
        <p className="text-gray-600">
          Update animal information for {formData.animals[0]?.earTagId || uid}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seller Selection Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Search className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Seller Details</h2>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer bg-white"
                  placeholder="Click to select seller"
                  onClick={() => setSellerDropdownOpen(!sellerDropdownOpen)}
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  size={20}
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
          </div>
        </div>

        {/* Animal Details */}
        {formData.animals.map((animal, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <GiCow className="text-green-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Animal Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update animal information
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Details Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Basic Details</h3>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer bg-white"
                      placeholder="Select animal type"
                      onClick={() => setAnimalTypeDropdownOpen(prev => ({ ...prev, [index]: !prev[index] }))}
                      required
                    />
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                      size={20}
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
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer ${!animal.animalType ? 'bg-gray-50' : 'bg-white'}`}
                      placeholder={animal.animalType ? "Select breed" : "Select animal type first"}
                      onClick={() => animal.animalType && setBreedDropdownOpen(prev => ({ ...prev, [index]: !prev[index] }))}
                      required
                    />
                    {animal.animalType && (
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        size={20}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter price"
                    min="1"
                    required
                  />
                </div>

                {/* Pregnancy Status */}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    advancedDetailsOpen[index]
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  {advancedDetailsOpen[index] ? 'Hide Details' : 'Add More Details'}
                </button>
              </div>

              {/* Advanced Details */}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        >
                          <option value="">Years</option>
                          {ageYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <select
                          value={animal.advancedDetails.ageMonths}
                          onChange={(e) => handleAdvancedDetailsChange(index, 'ageMonths', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="1-25 liters"
                        min="1"
                        max="25"
                      />
                    </div>
                  </div>

                  {/* Commissioner Agent and Calf Age */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Commissioner Agent */}
                      <div className="relative" ref={el => agentRefs.current[index] = el}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commissioner Agent
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={animal.advancedDetails.commissionerAgent}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer bg-white"
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
                            size={20}
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
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
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
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
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

                  {/* Animal Media Section */}
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
                            onPreview={openPreview}
                          />
                          <MediaUploadBox
                            type="photo"
                            preview={animal.advancedDetails.sidePhoto?.preview}
                            label="Side"
                            onUpload={(file) => handleMediaUpload(index, 'sidePhoto', file)}
                            onRemove={() => removeMedia(index, 'sidePhoto')}
                            onPreview={openPreview}
                          />
                          <MediaUploadBox
                            type="photo"
                            preview={animal.advancedDetails.backPhoto?.preview}
                            label="Back"
                            onUpload={(file) => handleMediaUpload(index, 'backPhoto', file)}
                            onRemove={() => removeMedia(index, 'backPhoto')}
                            onPreview={openPreview}
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
                          onPreview={openPreview}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calf Media Section */}
                  {animal.pregnancyStatus === 'milking' && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-2 mb-4">
                        <Camera className="text-gray-600" size={20} />
                        <h5 className="font-medium text-gray-900">Calf Media</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Calf Photo */}
                        <div>
                          <MediaUploadBox
                            type="photo"
                            preview={animal.advancedDetails.calfPhoto?.preview}
                            label="Calf Photo"
                            onUpload={(file) => handleMediaUpload(index, 'calfPhoto', file)}
                            onRemove={() => removeMedia(index, 'calfPhoto')}
                            onPreview={openPreview}
                          />
                        </div>

                        {/* Calf Video */}
                        <div>
                          <MediaUploadBox
                            type="video"
                            preview={animal.advancedDetails.calfVideo?.preview}
                            label="Calf Video"
                            instructions="Front → Left → Back → Right → Front"
                            onUpload={(file) => handleMediaUpload(index, 'calfVideo', file)}
                            onRemove={() => removeMedia(index, 'calfVideo')}
                            onPreview={openPreview}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <strong>Tip:</strong> You can update with just basic details!
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

// Media Upload Component - EXACT match to registration form
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

export default EditAnimal;