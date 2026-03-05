import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, MapPin, Calendar, Clock,
  Tag, Truck, Home, Users, GitBranch,
  X, Check, ChevronLeft, ChevronRight,
  AlertCircle, Save, ArrowRight,
  BadgeCheck, ClipboardList, Plus, Minus
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { PATHROUTES } from '../../../routes/pathRoutes';
import api from '../../../services/api/api';
import { Endpoints } from '../../../services/api/EndPoint';

const AnimalProcurement = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [procurementOfficers, setProcurementOfficers] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [holdingStations, setHoldingStations] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Helper function to get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    return { currentDate, currentTime };
  };

  const { currentDate, currentTime } = getCurrentDateTime();

  // Form Data State
  const [formData, setFormData] = useState({
    // Procurement Details
    procurementOfficer: '',
    broker: '',
    sourceType: '',
    sourceLocation: '',
    date: currentDate,
    time: currentTime,
    batchSize: '9', // Default batch size set to 9
    
    // Animals Array - will be populated based on batch size
    animals: [],
    
    // Transport Details
    vehicleNo: '',
    holdingStation: '',
    placeFrom: '',
    placeTo: ''
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Update animals array when batch size changes
  useEffect(() => {
    const batchSize = parseInt(formData.batchSize) || 0;
    const currentAnimals = formData.animals || [];
    
    if (batchSize > currentAnimals.length) {
      // Add new animal entries with default gender = "Female"
      const newAnimals = [...currentAnimals];
      for (let i = currentAnimals.length; i < batchSize; i++) {
        newAnimals.push({
          earTagId: '',
          breed: '',
          calvingStatus: '',
          gender: 'Female' // Default gender set to Female
        });
      }
      setFormData(prev => ({ ...prev, animals: newAnimals }));
    } else if (batchSize < currentAnimals.length) {
      // Remove excess animal entries
      setFormData(prev => ({ 
        ...prev, 
        animals: currentAnimals.slice(0, batchSize) 
      }));
    }
  }, [formData.batchSize]);

  const fetchDropdownData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch procurement officers
      const officersResponse = await api.get('/admin/procurement-officers');
      if (officersResponse.data.success) {
        setProcurementOfficers(officersResponse.data.data);
      }

      // Fetch brokers
      const brokersResponse = await api.get(Endpoints.GET_BROKER)
      if (brokersResponse.data.success) {
        setBrokers(brokersResponse.data.data);
      }

      // Fetch vehicles
      const vehiclesResponse = await api.get('/admin/vehicles');
      if (vehiclesResponse.data.success) {
        setVehicles(vehiclesResponse.data.data);
      }

      // Fetch holding stations
      const stationsResponse = await api.get('/admin/holding-stations');
      if (stationsResponse.data.success) {
        setHoldingStations(stationsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      toast.error('Failed to load form data');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Dropdown Options
  const breedOptions = [
    { value: "", label: "Select Breed", disabled: true },
    { value: "Gir", label: "Gir" },
    { value: "Sahiwal", label: "Sahiwal" },
    { value: "Jersey Cross", label: "Jersey Cross" },
    { value: "HF-Cross", label: "HF-Cross" }
  ];

  const calvingStatusOptions = [
    { value: "", label: "Select Status", disabled: true },
    { value: "Milking", label: "Milking" },
    { value: "Pregnant", label: "Pregnant" }
  ];

  const genderOptions = [
    { value: "", label: "Select Gender", disabled: true },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" }
  ];

  const sourceTypeOptions = [
    { value: "Bazaar", label: "Bazaar" },
    { value: "Farm", label: "Farm" }
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Validation for batch size
    if (name === 'batchSize') {
      if (value && !/^\d*$/.test(value)) return;
      if (parseInt(value) > 50) {
        toast.error('Batch size cannot exceed 50');
        return;
      }
    }

    setTouchedFields(prev => ({ ...prev, [name]: true }));
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAnimalChange = (index, field, value) => {
    const updatedAnimals = [...formData.animals];
    updatedAnimals[index] = {
      ...updatedAnimals[index],
      [field]: value
    };
    
    setFormData(prev => ({ ...prev, animals: updatedAnimals }));
    
    // Clear error for this specific animal field if exists
    const errorKey = `animal_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';
    
    switch(fieldName) {
      case 'procurementOfficer':
        if (!value) errorMessage = 'Procurement Officer is required';
        break;
      case 'broker':
        if (!value) errorMessage = 'Broker is required';
        break;
      case 'sourceType':
        if (!value) errorMessage = 'Please select a source type';
        break;
      case 'sourceLocation':
        if (!value) errorMessage = 'Source Location is required';
        break;
      case 'date':
        if (!value) errorMessage = 'Date is required';
        break;
      case 'time':
        if (!value) errorMessage = 'Time is required';
        break;
      case 'batchSize':
        if (!value) errorMessage = 'Batch size is required';
        else if (parseInt(value) < 1) errorMessage = 'Batch size must be at least 1';
        else if (parseInt(value) > 50) errorMessage = 'Batch size cannot exceed 50';
        break;
      case 'vehicleNo':
        if (!value) errorMessage = 'Vehicle number is required';
        break;
      case 'holdingStation':
        if (!value) errorMessage = 'Holding station is required';
        break;
      case 'placeFrom':
        if (!value) errorMessage = 'Source location is required';
        break;
      case 'placeTo':
        if (!value) errorMessage = 'Destination location is required';
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
    return !errorMessage;
  };

  const validateAnimalField = (index, field, value) => {
    let errorMessage = '';
    const fieldName = `animal_${index}_${field}`;
    
    switch(field) {
      case 'earTagId':
        if (!value) errorMessage = 'Ear Tag ID is required';
        break;
      case 'breed':
        if (!value) errorMessage = 'Breed is required';
        break;
      case 'calvingStatus':
        if (!value) errorMessage = 'Calving status is required';
        break;
      case 'gender':
        if (!value) errorMessage = 'Gender is required';
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
    return !errorMessage;
  };

  const handleAnimalBlur = (index, field, value) => {
    validateAnimalField(index, field, value);
  };

  const validateStep1 = () => {
    const newErrors = {};
    let isValid = true;
    
    // Required fields validation
    if (!formData.procurementOfficer) {
      newErrors.procurementOfficer = 'Procurement Officer is required';
      isValid = false;
    }
    if (!formData.broker) {
      newErrors.broker = 'Broker is required';
      isValid = false;
    }
    if (!formData.sourceType) {
      newErrors.sourceType = 'Please select a source type';
      isValid = false;
    }
    if (!formData.sourceLocation) {
      newErrors.sourceLocation = 'Source Location is required';
      isValid = false;
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
      isValid = false;
    }
    if (!formData.batchSize) {
      newErrors.batchSize = 'Batch size is required';
      isValid = false;
    } else if (parseInt(formData.batchSize) < 1) {
      newErrors.batchSize = 'Batch size must be at least 1';
      isValid = false;
    } else if (parseInt(formData.batchSize) > 50) {
      newErrors.batchSize = 'Batch size cannot exceed 50';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    // Mark all fields as touched to show errors
    const touched = {};
    Object.keys(newErrors).forEach(key => {
      touched[key] = true;
    });
    setTouchedFields(prev => ({ ...prev, ...touched }));
    
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all animal entries
    formData.animals.forEach((animal, index) => {
      if (!animal.earTagId) {
        newErrors[`animal_${index}_earTagId`] = 'Ear Tag ID is required';
        isValid = false;
      }
      if (!animal.breed) {
        newErrors[`animal_${index}_breed`] = 'Breed is required';
        isValid = false;
      }
      if (!animal.calvingStatus) {
        newErrors[`animal_${index}_calvingStatus`] = 'Calving status is required';
        isValid = false;
      }
      if (!animal.gender) {
        newErrors[`animal_${index}_gender`] = 'Gender is required';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    if (!isValid) {
      // Scroll to the first error
      setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    
    return isValid;
  };

  const validateStep3 = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!formData.vehicleNo) {
      newErrors.vehicleNo = 'Vehicle number is required';
      isValid = false;
    }
    if (!formData.holdingStation) {
      newErrors.holdingStation = 'Holding station is required';
      isValid = false;
    }
    if (!formData.placeFrom) {
      newErrors.placeFrom = 'Source location is required';
      isValid = false;
    }
    if (!formData.placeTo) {
      newErrors.placeTo = 'Destination location is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    // Mark all fields as touched to show errors
    const touched = {};
    Object.keys(newErrors).forEach(key => {
      touched[key] = true;
    });
    setTouchedFields(prev => ({ ...prev, ...touched }));
    
    return isValid;
  };

  const handleNext = () => {
    let isValid = false;
    
    switch(currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await api.post('/admin/procurement', formData);
      
      if (response.data.success) {
        toast.success('Procurement created successfully!');
        setTimeout(() => {
          navigate(PATHROUTES.procurementList);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(PATHROUTES.procurementList);
  };

  const getStepIcon = (step) => {
    switch(step) {
      case 1: return ClipboardList;
      case 2: return Users;
      case 3: return Truck;
      default: return Check;
    }
  };

  const getStepColor = (step, isActive, isCompleted) => {
    if (isCompleted) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (isActive) return 'bg-gradient-to-r from-primary-400 to-primary-500';
    if (hoveredStep === step) return 'bg-gradient-to-r from-gray-400 to-gray-500';
    return 'bg-gradient-to-r from-gray-200 to-gray-300';
  };

  const renderStepIndicator = () => (
    <div className="relative mb-12">
      <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />
      </div>

      <div className="relative flex justify-between">
        {[1, 2, 3].map((step) => {
          const StepIcon = getStepIcon(step);
          const isCompleted = currentStep > step;
          const isActive = currentStep === step;
          
          return (
            <div
              key={step}
              className="flex flex-col items-center"
              onMouseEnter={() => setHoveredStep(step)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div 
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  shadow-md transition-all duration-300 transform
                  ${getStepColor(step, isActive, isCompleted)}
                  ${isActive ? 'scale-110 ring-4 ring-primary-100' : ''}
                  ${hoveredStep === step ? 'scale-105' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="text-white" size={20} />
                ) : (
                  <StepIcon className="text-white" size={20} />
                )}
              </div>
              <span className={`
                mt-3 text-sm font-medium transition-colors duration-300
                ${isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
              `}>
                Step {step}
              </span>
              <span className="text-xs text-gray-400">
                {step === 1 && "Procurement Details"}
                {step === 2 && "Animal Details"}
                {step === 3 && "Transport Details"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderField = (field, label, Icon, type = 'text', placeholder = '', required = false, options = null) => {
    const hasError = errors[field] && touchedFields[field];
    
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            {Icon && <Icon size={18} className={hasError ? 'text-red-400' : 'text-gray-400'} />}
          </div>
          
          {options ? (
            <select
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                hasError 
                  ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              disabled={isLoadingData}
            >
              <option value="">Select {label}</option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                hasError 
                  ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            />
          )}
        </div>
        {hasError && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
            <AlertCircle size={12} />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <ClipboardList className="text-primary-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Procurement Details</h2>
              <p className="text-sm text-gray-500">All fields in this section are required</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Procurement Officer Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procurement Officer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="procurementOfficer"
                  value={formData.procurementOfficer || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                    errors.procurementOfficer && touchedFields.procurementOfficer 
                      ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={isLoadingData}
                >
                  <option value="">Select Procurement Officer</option>
                  {procurementOfficers.map(officer => (
                    <option key={officer.id} value={officer.id}>
                      {officer.firstName} {officer.lastName} - {officer.mobile}
                    </option>
                  ))}
                </select>
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.procurementOfficer && touchedFields.procurementOfficer && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle size={12} />
                  {errors.procurementOfficer}
                </p>
              )}
            </div>

            {/* Broker Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broker <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="broker"
                  value={formData.broker || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                    errors.broker && touchedFields.broker 
                      ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={isLoadingData}
                >
                  <option value="">Select Broker</option>
                  {brokers.map(broker => (
                    <option key={broker.id} value={broker.id}>
                      {broker.name} - {broker.phone}
                    </option>
                  ))}
                </select>
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.broker && touchedFields.broker && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle size={12} />
                  {errors.broker}
                </p>
              )}
            </div>

            {/* Source Type Radio Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 mt-2">
                {sourceTypeOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="sourceType"
                      value={option.value}
                      checked={formData.sourceType === option.value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.sourceType && touchedFields.sourceType && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle size={12} />
                  {errors.sourceType}
                </p>
              )}
            </div>

            {/* Source Location */}
            <div>
              {renderField('sourceLocation', 'Source Location', MapPin, 'text', 'Enter location', true)}
            </div>

            {/* Date - Now Required */}
            <div>
              {renderField('date', 'Date', Calendar, 'date', '', true)}
            </div>

            {/* Time - Now Required */}
            <div>
              {renderField('time', 'Time', Clock, 'time', '', true)}
            </div>

            {/* Batch Size - Default 9 */}
            <div>
              {renderField('batchSize', 'Batch Size', Users, 'number', 'Enter batch size', true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Animal Details</h2>
                <p className="text-sm text-gray-500">
                  Total Animals: {formData.animals.length}
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
              All fields required
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {formData.animals.map((animal, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-primary-300 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">{index + 1}</span>
                  </div>
                  <h3 className="font-medium text-gray-700">Animal #{index + 1}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Ear Tag ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ear Tag ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={animal.earTagId}
                        onChange={(e) => handleAnimalChange(index, 'earTagId', e.target.value)}
                        onBlur={(e) => handleAnimalBlur(index, 'earTagId', e.target.value)}
                        className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                          errors[`animal_${index}_earTagId`] 
                            ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        placeholder="Enter ear tag ID"
                      />
                      <Tag className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    </div>
                    {errors[`animal_${index}_earTagId`] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                        <AlertCircle size={12} />
                        {errors[`animal_${index}_earTagId`]}
                      </p>
                    )}
                  </div>

                  {/* Breed Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Breed <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={animal.breed}
                      onChange={(e) => handleAnimalChange(index, 'breed', e.target.value)}
                      onBlur={(e) => handleAnimalBlur(index, 'breed', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                        errors[`animal_${index}_breed`] 
                          ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {breedOptions.map(opt => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors[`animal_${index}_breed`] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                        <AlertCircle size={12} />
                        {errors[`animal_${index}_breed`]}
                      </p>
                    )}
                  </div>

                  {/* Calving Status Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calving Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={animal.calvingStatus}
                      onChange={(e) => handleAnimalChange(index, 'calvingStatus', e.target.value)}
                      onBlur={(e) => handleAnimalBlur(index, 'calvingStatus', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                        errors[`animal_${index}_calvingStatus`] 
                          ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {calvingStatusOptions.map(opt => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors[`animal_${index}_calvingStatus`] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                        <AlertCircle size={12} />
                        {errors[`animal_${index}_calvingStatus`]}
                      </p>
                    )}
                  </div>

                  {/* Gender Dropdown - Defaulted to Female */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={animal.gender}
                      onChange={(e) => handleAnimalChange(index, 'gender', e.target.value)}
                      onBlur={(e) => handleAnimalBlur(index, 'gender', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                        errors[`animal_${index}_gender`] 
                          ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {genderOptions.map(opt => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors[`animal_${index}_gender`] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                        <AlertCircle size={12} />
                        {errors[`animal_${index}_gender`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {formData.animals.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Users size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Enter batch size in previous step to add animals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Truck className="text-orange-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Transport Details</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Number Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle No. <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="vehicleNo"
                  value={formData.vehicleNo || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                    errors.vehicleNo && touchedFields.vehicleNo 
                      ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={isLoadingData}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.vehicleNo}>
                      {vehicle.vehicleNo} - {vehicle.type}
                    </option>
                  ))}
                </select>
                <Truck className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.vehicleNo && touchedFields.vehicleNo && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle size={12} />
                  {errors.vehicleNo}
                </p>
              )}
            </div>

            {/* Select Holding Station Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Holding Station <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="holdingStation"
                  value={formData.holdingStation || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                    errors.holdingStation && touchedFields.holdingStation 
                      ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={isLoadingData}
                >
                  <option value="">Select Holding Station</option>
                  {holdingStations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name} - {station.location}
                    </option>
                  ))}
                </select>
                <Home className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.holdingStation && touchedFields.holdingStation && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle size={12} />
                  {errors.holdingStation}
                </p>
              )}
            </div>

            {/* Place of Shifting - From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place of Shifting - From <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="placeFrom"
                  value={formData.placeFrom || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                    errors.placeFrom && touchedFields.placeFrom 
                      ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Enter source location"
                />
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.placeFrom && touchedFields.placeFrom && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle size={12} />
                  {errors.placeFrom}
                </p>
              )}
            </div>

            {/* Place of Shifting - To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place of Shifting - To <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="placeTo"
                  value={formData.placeTo || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none ${
                    errors.placeTo && touchedFields.placeTo 
                      ? "border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Enter destination location"
                />
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.placeTo && touchedFields.placeTo && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle size={12} />
                  {errors.placeTo}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <Toaster/>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideIn">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Animal Procurement
              </h1>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                <ClipboardList size={16} />
                Create a new animal procurement record
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
              <BadgeCheck className="text-primary-500" size={20} />
              <span className="text-sm font-medium text-gray-700">
                {currentStep}/3 Steps
              </span>
            </div>
          </div>
        </div>

        {renderStepIndicator()}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 bg-white rounded-2xl p-6 shadow-sm animate-slideIn">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center gap-2 font-medium"
              disabled={isSubmitting}
            >
              <X size={18} />
              Cancel
            </button>
            
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center gap-2 font-medium"
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-300 flex items-center gap-2 font-medium shadow-sm"
                  disabled={isSubmitting}
                >
                  Save & Next
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center gap-2 font-medium shadow-sm min-w-[140px] justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Submit
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimalProcurement;