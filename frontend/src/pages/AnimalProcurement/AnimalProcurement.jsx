// pages/procurement/ProcurementForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  User, Phone, MapPin, Calendar, Tag,
  Droplet, Eye, FileText, Camera, Truck,
  IdCard, File, Upload, 
  X, Check, ChevronLeft, ChevronRight,
  AlertCircle, Home,
  Hand, Save, ArrowRight,
  CheckCircle, Clock, 
  HomeIcon, ClipboardList, 
  CreditCard, Hash,
  BadgeCheck, Truck as TruckIcon2,
  FileUp
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { PATHROUTES } from '../../routes/pathRoutes';
import { GiCow } from 'react-icons/gi';
import api from '../../services/api/api';

const AnimalProcurement = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const location = useLocation();
  const isEditMode = !!uid || location.state?.isEdit;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({});
  const [hoveredStep, setHoveredStep] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [procurementOfficers, setProcurementOfficers] = useState([]);
  const [isLoadingOfficers, setIsLoadingOfficers] = useState(false);

  // Helper function to get current date and time in local format
  const getCurrentDateTime = () => {
    const now = new Date();
    
    // Get date in YYYY-MM-DD format
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    
    // Get time in HH:MM format (24-hour)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    return { currentDate, currentTime };
  };

  // Form Data State with default date and time for visit fields only
  const { currentDate, currentTime } = getCurrentDateTime();
  
  const [formData, setFormData] = useState({
    // Step 1 - Source Visit Record (Required fields only)
    procurementOfficer: '',
    sourceType: '',
    sourceLocation: '',
    visitDate: currentDate,
    visitTime: currentTime,
    
    // Step 1 - Animal Details (Tag ID is required)
    tagId: '',
    breed: '',
    ageYears: '',
    ageMonths: '',
    milkingCapacity: '',
    isCalfIncluded: '',
    physicalCheck: '',
    fmdDisease: false,
    lsdDisease: false,
    animalPhotoFront: null,
    animalPhotoSide: null,
    animalPhotoRear: null,
    
    // Step 1 - Source Visit Record (continued)
    breederName: '',
    breederContact: '',
    
    // Step 1 - Health Records (Single file now)
    healthRecord: null,
    
    // Step 2 - Logistic & Transit
    vehicleNo: '',
    driverName: '',
    driverDesignation: '',
    driverMobile: '',
    driverAadhar: '',
    drivingLicense: '',
    licenseCertificate: null,
    
    // Step 3 - Quarantine & Care
    quarantineCenter: '',
    quarantineCenterPhoto: null,
    quarantineHealthRecord: null,
    finalHealthClearance: null,
    
    // Step 4 - Handover
    handoverOfficer: '',
    beneficiaryId: '',
    beneficiaryLocation: '',
    handoverPhoto: null,
    handoverDate: '',
    handoverTime: '',
    handoverDocument: null
  });

  // Fetch procurement officers on component mount
  useEffect(() => {
    fetchProcurementOfficers();
  }, []);

  // Fetch procurement officers
  const fetchProcurementOfficers = async () => {
    setIsLoadingOfficers(true);
    try {
      const response = await api.get('/admin/procurement-officers');
      if (response.data.success) {
        setProcurementOfficers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching procurement officers:', error);
      toast.error('Failed to load procurement officers');
    } finally {
      setIsLoadingOfficers(false);
    }
  };

  // Dropdown Options
  const breedOptions = [
    { value: "", label: "Select Breed", disabled: true },
    { value: "Gir", label: "Gir - Gujarat" },
    { value: "Sahiwal", label: "Sahiwal - Punjab" },
    { value: "Jersey", label: "Jersey - Foreign" },
    { value: "Other", label: "Other - Various" }
  ];

  const quarantineCenters = [
    { id: '', name: "Select Quarantine Center", disabled: true },
    { id: 1, name: "Central Quarantine Center - Nagpur" },
    { id: 2, name: "District Quarantine Facility - Pune" },
    { id: 3, name: "Regional Animal Care Center - Mumbai" },
    { id: 4, name: "Rural Quarantine Unit - Aurangabad" }
  ];

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadProcurementData();
    }
  }, [isEditMode, uid, location.state]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Success animation timeout
  useEffect(() => {
    if (showSuccessAnimation) {
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAnimation]);

  const loadProcurementData = () => {
    if (location.state?.procurementData) {
      // Transform the nested data structure back to flat form structure
      const data = location.state.procurementData;
      setFormData({
        // Source Visit
        procurementOfficer: data.sourceVisit?.procurementOfficer || '',
        sourceType: data.sourceVisit?.sourceType || '',
        sourceLocation: data.sourceVisit?.sourceLocation || '',
        visitDate: data.sourceVisit?.visitDate?.split('T')[0] || '',
        visitTime: data.sourceVisit?.visitTime || '',
        breederName: data.sourceVisit?.breederName || '',
        breederContact: data.sourceVisit?.breederContact || '',
        
        // Animal Details
        tagId: data.procuredAnimal?.tagId || '',
        breed: data.procuredAnimal?.breed || '',
        ageYears: data.procuredAnimal?.ageYears || '',
        ageMonths: data.procuredAnimal?.ageMonths || '',
        milkingCapacity: data.procuredAnimal?.milkingCapacity || '',
        isCalfIncluded: data.procuredAnimal?.isCalfIncluded ? 'yes' : 'no',
        physicalCheck: data.procuredAnimal?.physicalCheck || '',
        fmdDisease: data.procuredAnimal?.fmdDisease || false,
        lsdDisease: data.procuredAnimal?.lsdDisease || false,
        animalPhotoFront: data.procuredAnimal?.animalPhotoFront || null,
        animalPhotoSide: data.procuredAnimal?.animalPhotoSide || null,
        animalPhotoRear: data.procuredAnimal?.animalPhotoRear || null,
        healthRecord: data.procuredAnimal?.healthRecord || null,
        
        // Logistic
        vehicleNo: data.logistic?.vehicleNo || '',
        driverName: data.logistic?.driverName || '',
        driverDesignation: data.logistic?.driverDesignation || '',
        driverMobile: data.logistic?.driverMobile || '',
        driverAadhar: data.logistic?.driverAadhar || '',
        drivingLicense: data.logistic?.drivingLicense || '',
        licenseCertificate: data.logistic?.licenseCertificate || null,
        
        // Quarantine
        quarantineCenter: data.quarantine?.quarantineCenter || '',
        quarantineCenterPhoto: data.quarantine?.quarantineCenterPhoto || null,
        quarantineHealthRecord: data.quarantine?.quarantineHealthRecord || null,
        finalHealthClearance: data.quarantine?.finalHealthClearance || null,
        
        // Handover
        handoverOfficer: data.handover?.handoverOfficer || '',
        beneficiaryId: data.handover?.beneficiaryId || '',
        beneficiaryLocation: data.handover?.beneficiaryLocation || '',
        handoverPhoto: data.handover?.handoverPhoto || null,
        handoverDate: data.handover?.handoverDate || '',
        handoverTime: data.handover?.handoverTime || '',
        handoverDocument: data.handover?.handoverDocument || null
      });
    } else if (uid) {
      fetchProcurementByUid(uid);
    }
  };

  const fetchProcurementByUid = async (procurementUid) => {
    try {
      setIsSubmitting(true);
      const response = await api.get(`/admin/procured-animal/${procurementUid}`);
      if (response.data.success) {
        const data = response.data.data;
        setFormData({
          // Source Visit
          procurementOfficer: data.sourceVisit?.procurementOfficer || '',
          sourceType: data.sourceVisit?.sourceType || '',
          sourceLocation: data.sourceVisit?.sourceLocation || '',
          visitDate: data.sourceVisit?.visitDate?.split('T')[0] || '',
          visitTime: data.sourceVisit?.visitTime || '',
          breederName: data.sourceVisit?.breederName || '',
          breederContact: data.sourceVisit?.breederContact || '',
          
          // Animal Details
          tagId: data.procuredAnimal?.tagId || '',
          breed: data.procuredAnimal?.breed || '',
          ageYears: data.procuredAnimal?.ageYears || '',
          ageMonths: data.procuredAnimal?.ageMonths || '',
          milkingCapacity: data.procuredAnimal?.milkingCapacity || '',
          isCalfIncluded: data.procuredAnimal?.isCalfIncluded ? 'yes' : 'no',
          physicalCheck: data.procuredAnimal?.physicalCheck || '',
          fmdDisease: data.procuredAnimal?.fmdDisease || false,
          lsdDisease: data.procuredAnimal?.lsdDisease || false,
          animalPhotoFront: data.procuredAnimal?.animalPhotoFront || null,
          animalPhotoSide: data.procuredAnimal?.animalPhotoSide || null,
          animalPhotoRear: data.procuredAnimal?.animalPhotoRear || null,
          healthRecord: data.procuredAnimal?.healthRecord || null,
          
          // Logistic
          vehicleNo: data.logistic?.vehicleNo || '',
          driverName: data.logistic?.driverName || '',
          driverDesignation: data.logistic?.driverDesignation || '',
          driverMobile: data.logistic?.driverMobile || '',
          driverAadhar: data.logistic?.driverAadhar || '',
          drivingLicense: data.logistic?.drivingLicense || '',
          licenseCertificate: data.logistic?.licenseCertificate || null,
          
          // Quarantine
          quarantineCenter: data.quarantine?.quarantineCenter || '',
          quarantineCenterPhoto: data.quarantine?.quarantineCenterPhoto || null,
          quarantineHealthRecord: data.quarantine?.quarantineHealthRecord || null,
          finalHealthClearance: data.quarantine?.finalHealthClearance || null,
          
          // Handover
          handoverOfficer: data.handover?.handoverOfficer || '',
          beneficiaryId: data.handover?.beneficiaryId || '',
          beneficiaryLocation: data.handover?.beneficiaryLocation || '',
          handoverPhoto: data.handover?.handoverPhoto || null,
          handoverDate: data.handover?.handoverDate || '',
          handoverTime: data.handover?.handoverTime || '',
          handoverDocument: data.handover?.handoverDocument || null
        });
      }
    } catch (error) {
      console.error('Error fetching procurement:', error);
      toast.error('Failed to load procurement data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateAadhar = (aadhar) => {
    const aadharRegex = /^[0-9]{12}$/;
    return aadharRegex.test(aadhar);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Validation for mobile number
    if (name === 'breederContact' || name === 'driverMobile') {
      if (value && !/^\d*$/.test(value)) {
        return;
      }
      if (value.length > 10) {
        return;
      }
    }

    // Validation for Aadhar number
    if (name === 'driverAadhar') {
      if (value && !/^\d*$/.test(value)) {
        return;
      }
      if (value.length > 12) {
        return;
      }
    }

    // Validation for age fields
    if (name === 'ageYears' && value > 20) {
      toast.error('Age years cannot exceed 20');
      return;
    }
    if (name === 'ageMonths' && value > 11) {
      toast.error('Age months cannot exceed 11');
      return;
    }

    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    if (files && files[0]) {
      const file = files[0];
      
      const maxSize = file.type.startsWith('image/') ? 5 : 10;
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size should be less than ${maxSize}MB`);
        return;
      }

      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const validDocTypes = ['application/pdf', ...validImageTypes];
      const isValidType = name.includes('Photo') ? validImageTypes.includes(file.type) : validDocTypes.includes(file.type);
      
      if (!isValidType) {
        toast.error(name.includes('Photo') ? 'Please upload only image files' : 'Please upload only JPG, PNG or PDF files');
        return;
      }

      setFormData(prev => ({ ...prev, [name]: file }));
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrls(prev => ({ ...prev, [name]: url }));
      } else {
        setPreviewUrls(prev => ({ ...prev, [name]: null }));
      }
      
      // Clear error for this field if exists
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: e.target.checked }));
    } else if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear error for radio field
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    if (name === 'breederContact' && formData.breederContact && !validateMobile(formData.breederContact)) {
      setErrors(prev => ({ ...prev, [name]: 'Please enter a valid 10-digit mobile number' }));
    }
    if (name === 'driverMobile' && formData.driverMobile && !validateMobile(formData.driverMobile)) {
      setErrors(prev => ({ ...prev, [name]: 'Please enter a valid 10-digit mobile number' }));
    }
    if (name === 'driverAadhar' && formData.driverAadhar && !validateAadhar(formData.driverAadhar)) {
      setErrors(prev => ({ ...prev, [name]: 'Please enter a valid 12-digit Aadhar number' }));
    }
  };

  const removeFile = (fieldName) => {
    if (previewUrls[fieldName]) {
      URL.revokeObjectURL(previewUrls[fieldName]);
      setPreviewUrls(prev => {
        const newUrls = {...prev};
        delete newUrls[fieldName];
        return newUrls;
      });
    }
    setFormData(prev => ({ ...prev, [fieldName]: null }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.procurementOfficer) {
      newErrors.procurementOfficer = 'Procurement Officer is required';
    }
    if (!formData.sourceType) {
      newErrors.sourceType = 'Please select a source type';
    }
    if (!formData.sourceLocation) {
      newErrors.sourceLocation = 'Source Location is required';
    }
    if (!formData.breederName) {
      newErrors.breederName = 'Breeder Name is required';
    }
    if (!formData.breederContact) {
      newErrors.breederContact = 'Breeder Contact is required';
    } else if (!validateMobile(formData.breederContact)) {
      newErrors.breederContact = 'Please enter a valid 10-digit mobile number';
    }
    
    // Tag ID is required
    if (!formData.tagId) {
      newErrors.tagId = 'Animal Tag ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (formData.driverMobile && !validateMobile(formData.driverMobile)) {
      newErrors.driverMobile = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.driverAadhar && !validateAadhar(formData.driverAadhar)) {
      newErrors.driverAadhar = 'Please enter a valid 12-digit Aadhar number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    setErrors({});
    return true;
  };

  const validateStep4 = () => {
    setErrors({});
    return true;
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
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Mark all fields as touched to show errors
      const fieldsToTouch = {};
      if (currentStep === 1) {
        fieldsToTouch.procurementOfficer = true;
        fieldsToTouch.sourceType = true;
        fieldsToTouch.sourceLocation = true;
        fieldsToTouch.breederName = true;
        fieldsToTouch.breederContact = true;
        fieldsToTouch.tagId = true;
      } else if (currentStep === 2) {
        fieldsToTouch.driverMobile = true;
        fieldsToTouch.driverAadhar = true;
      }
      setTouchedFields(prev => ({ ...prev, ...fieldsToTouch }));
      
      // Show a single toast message
      toast.error('Please fill all required fields correctly');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // COMPLETE FIXED handleSubmit function
  const handleSubmit = async () => {
    if (!validateStep4()) {
      toast.error('Please check all fields for errors');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        
        // Skip null or undefined values
        if (value === null || value === undefined) {
          return;
        }
        
        // Check if it's a File object using property check (no instanceof)
        const isFileObject = value && 
                             typeof value === 'object' && 
                             'name' in value && 
                             'size' in value && 
                             'type' in value;
        
        // Handle File objects
        if (isFileObject) {
          formDataToSend.append(key, value);
        } 
        // Handle boolean values
        else if (typeof value === 'boolean') {
          formDataToSend.append(key, String(value));
        }
        // Handle numbers
        else if (typeof value === 'number') {
          formDataToSend.append(key, String(value));
        }
        // Handle non-empty strings
        else if (typeof value === 'string' && value.trim() !== '') {
          formDataToSend.append(key, value);
        }
        // Handle objects that might be file paths from API (don't send them)
        else if (typeof value === 'object') {
          // Skip objects that aren't Files (like file paths from API)
          console.log(`Skipping non-file object for field: ${key}`, value);
          return;
        }
        // Skip empty strings
        else if (typeof value === 'string' && value.trim() === '') {
          return;
        }
      });
      
      let response;
      
      if (isEditMode && uid) {
        // Update existing procurement
        response = await api.put(`/admin/procured-animal/${uid}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new procurement
        response = await api.post('/admin/procured-animal', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      if (response.data.success) {
        setShowSuccessAnimation(true);
        toast.success(isEditMode ? 'Procurement updated successfully!' : 'Procurement created successfully!');
        
        // Cleanup preview URLs
        Object.values(previewUrls).forEach(url => {
          if (url && typeof url === 'string' && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        
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
    Object.values(previewUrls).forEach(url => {
      if (url && typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    navigate(PATHROUTES.procurementList);
  };

  const getStepIcon = (step) => {
    switch(step) {
      case 1: return ClipboardList;
      case 2: return TruckIcon2;
      case 3: return HomeIcon;
      case 4: return Hand;
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
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />
      </div>

      <div className="relative flex justify-between">
        {[1, 2, 3, 4].map((step) => {
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
                {step === 1 && "Source & Animal"}
                {step === 2 && "Logistics"}
                {step === 3 && "Quarantine"}
                {step === 4 && "Handover"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Safe file check function - completely avoids instanceof
  const isFileObject = (value) => {
    if (!value || typeof value !== 'object') return false;
    
    // Check for common File object properties without using instanceof
    return (
      value !== null &&
      typeof value === 'object' &&
      'name' in value &&
      'size' in value &&
      'type' in value &&
      'lastModified' in value &&
      typeof value.name === 'string' &&
      typeof value.size === 'number' &&
      typeof value.type === 'string' &&
      typeof value.lastModified === 'number'
    );
  };

  // File Upload Component - FIXED VERSION
  const FileUploadField = ({ 
    field, 
    label, 
    accept = ".pdf,.jpg,.jpeg,.png", 
    maxSize = 5, 
    required = false,
    isImage = false,
    description = null
  }) => {
    const hasFile = formData[field] !== null && formData[field] !== undefined && formData[field] !== '';
    const file = formData[field];
    const previewUrl = previewUrls[field];
    
    // Safer check for file type
    const isFileLike = file && typeof file === 'object' && 'type' in file;
    const isImageFile = previewUrl || (isFileLike && file.type && file.type.startsWith('image/'));
    
    // Check if we have a valid file object
    const hasValidFile = hasFile && (previewUrl || (file && typeof file === 'object' && 'name' in file));

    const handleRemove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeFile(field);
    };

    if (hasValidFile) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 transition-all duration-300">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {previewUrl && isImageFile ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                    <img
                      src={previewUrl}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-50 to-indigo-50 border border-gray-200 flex items-center justify-center">
                    {file && file.type === 'application/pdf' ? (
                      <FileText size={32} className="text-red-500" />
                    ) : (
                      <File size={32} className="text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-gray-600 truncate max-w-[300px]">
                      {file && file.name ? file.name : 'Uploaded file'}
                    </p>
                    {file && file.size && (
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {previewUrl && isImageFile && (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={18} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {file && file.type && file.size && (
                  <div className="flex gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-lg">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
            <label className="flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 cursor-pointer py-1 hover:bg-primary-50 rounded-lg transition-colors">
              <Upload size={16} />
              <span>Replace file</span>
              <input
                type="file"
                name={field}
                onChange={handleChange}
                accept={accept}
                className="hidden"
              />
            </label>
          </div>
        </div>
      );
    }

    return (
      <label className="block cursor-pointer group">
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300 bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-50 rounded-full group-hover:bg-primary-100 transition-colors">
              {isImage ? (
                <Camera size={28} className="text-gray-400 group-hover:text-primary-500" />
              ) : (
                <FileUp size={28} className="text-gray-400 group-hover:text-primary-500" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                Click to upload {label.toLowerCase()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accept.replace(/\./g, '').toUpperCase()} • Max {maxSize}MB
              </p>
              {required && (
                <p className="text-xs text-red-500 mt-2">Required field</p>
              )}
              {description && (
                <p className="text-xs text-gray-400 mt-2">{description}</p>
              )}
            </div>
          </div>
        </div>
        <input
          type="file"
          name={field}
          onChange={handleChange}
          accept={accept}
          className="hidden"
        />
      </label>
    );
  };

  // Image Upload Component - FIXED VERSION
  const ImageUploadField = ({ field, label, required = false, description = null }) => {
    const hasFile = formData[field] !== null && formData[field] !== undefined && formData[field] !== '';
    const file = formData[field];
    const previewUrl = previewUrls[field];
    
    // Check if we have a valid file
    const hasValidFile = hasFile && (previewUrl || (file && typeof file === 'object'));

    const handleRemove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeFile(field);
    };

    if (hasValidFile && previewUrl) {
      return (
        <div className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white hover:border-primary-300 transition-all duration-300">
          <img
            src={previewUrl}
            alt={label}
            className="w-full h-40 object-cover"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-2">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 p-2 bg-white text-gray-700 rounded-full hover:bg-primary-500 hover:text-white"
              title="View"
            >
              <Eye size={16} />
            </a>
            <button
              type="button"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 p-2 bg-white text-red-600 rounded-full hover:bg-red-500 hover:text-white"
              title="Remove"
            >
              <X size={16} />
            </button>
          </div>

          <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs rounded-lg shadow-sm">
            {label}
          </div>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="cursor-pointer">
              <div className="p-1.5 bg-white rounded-full shadow-md hover:bg-primary-500 hover:text-white transition-colors">
                <Upload size={14} />
              </div>
              <input
                type="file"
                name={field}
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      );
    }

    return (
      <label className="block cursor-pointer group h-40">
        <div className="border-2 border-dashed border-gray-200 rounded-xl h-full flex flex-col items-center justify-center hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300 bg-white">
          <Camera size={28} className="text-gray-300 mb-2 group-hover:text-primary-500" />
          <span className="text-sm text-gray-600 group-hover:text-primary-600">Upload {label}</span>
          <span className="text-xs text-gray-400 mt-1">Click to browse</span>
          {required && <span className="text-xs text-red-500 mt-1">Required</span>}
          {description && (
            <span className="text-xs text-gray-400 mt-2 px-4 text-center">{description}</span>
          )}
        </div>
        <input
          type="file"
          name={field}
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    );
  };

  const renderFieldWithValidation = (field, label, IconComponent, type = 'text', placeholder = '', required = false, options = null) => {
    const hasError = errors[field] && touchedFields[field];
    
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            {IconComponent && <IconComponent size={18} className={hasError ? 'text-red-400' : 'text-gray-400'} />}
          </div>
          
          {options ? (
            <select
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-field pl-10 ${hasError ? "border-red-500 focus:ring-red-200" : ""}`}
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
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
              className={`input-field pl-10 ${hasError ? "border-red-500 focus:ring-red-200" : ""}`}
            />
          )}
        </div>
        {hasError && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Source Visit Record */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <User className="text-primary-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Source Visit Record</h2>
              <p className="text-sm text-gray-500">All fields in this section are required</p>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
                Required Section
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Procurement Officer - Integrated with API */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procurement Officer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="procurementOfficer"
                  value={formData.procurementOfficer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field pl-10 ${errors.procurementOfficer && touchedFields.procurementOfficer ? "border-red-500 focus:ring-red-200" : ""}`}
                  disabled={isLoadingOfficers}
                >
                  <option value="">{isLoadingOfficers ? 'Loading officers...' : 'Select Procurement Officer'}</option>
                  {procurementOfficers.map(officer => (
                    <option key={officer.id} value={officer.id}>
                      {officer.firstName} {officer.lastName} - {officer.mobile}
                    </option>
                  ))}
                </select>
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.procurementOfficer && touchedFields.procurementOfficer && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.procurementOfficer}
                </p>
              )}
            </div>

            {/* Source Type - Simple Radio Buttons like Calf Included */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="sourceType"
                    value="Bazaar"
                    checked={formData.sourceType === 'Bazaar'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm">Bazaar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="sourceType"
                    value="Farm"
                    checked={formData.sourceType === 'Farm'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm">Farm</span>
                </label>
              </div>
              {errors.sourceType && touchedFields.sourceType && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.sourceType}
                </p>
              )}
            </div>

            {/* Source Location */}
            <div>
              {renderFieldWithValidation('sourceLocation', 'Source Location', MapPin, 'text', 'Enter location', true)}
            </div>

            {/* Visit Date - Now with default value but still editable */}
            <div>
              {renderFieldWithValidation('visitDate', 'Visit Date', Calendar, 'date', '', false)}
            </div>

            {/* Visit Time - Now with default value but still editable */}
            <div>
              {renderFieldWithValidation('visitTime', 'Visit Time', Clock, 'time', '', false)}
            </div>

            {/* Breeder Name */}
            <div>
              {renderFieldWithValidation('breederName', 'Breeder Name', User, 'text', 'Enter breeder name', true)}
            </div>

            {/* Breeder Contact */}
            <div>
              {renderFieldWithValidation('breederContact', 'Breeder Contact', Phone, 'tel', 'Enter 10-digit mobile', true)}
            </div>
          </div>
        </div>
      </div>

      {/* Animal Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <GiCow className="text-green-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Animal Details</h2>
              <p className="text-sm text-gray-500">Only Tag ID is required, other fields are optional</p>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                Tag ID Required
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tag ID - Full width on mobile, half on larger screens */}
            <div className="lg:col-span-2">
              {renderFieldWithValidation('tagId', 'Animal Tag ID', Hash, 'text', 'Enter unique tag ID', true)}
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
              <div className="relative">
                <select
                  name="breed"
                  value={formData.breed || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                >
                  {breedOptions.map(breed => (
                    <option key={breed.value} value={breed.value} disabled={breed.disabled}>
                      {breed.label}
                    </option>
                  ))}
                </select>
                <Tag className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Age - Compact layout */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years</label>
                <input
                  type="number"
                  name="ageYears"
                  value={formData.ageYears || ''}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  className="input-field"
                  placeholder="Years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Months</label>
                <input
                  type="number"
                  name="ageMonths"
                  value={formData.ageMonths || ''}
                  onChange={handleChange}
                  min="0"
                  max="11"
                  className="input-field"
                  placeholder="Months"
                />
              </div>
            </div>

            {/* Milking Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Milking Capacity (L/day)</label>
              <div className="relative">
                <input
                  type="number"
                  name="milkingCapacity"
                  value={formData.milkingCapacity || ''}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  className="input-field pl-10"
                  placeholder="Liters"
                />
                <Droplet className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Calf Included */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calf Included?</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="isCalfIncluded"
                    value="yes"
                    checked={formData.isCalfIncluded === 'yes'}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="isCalfIncluded"
                    value="no"
                    checked={formData.isCalfIncluded === 'no'}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            {/* Physical Check - Full width */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Physical Check Observations</label>
              <textarea
                name="physicalCheck"
                value={formData.physicalCheck || ''}
                onChange={handleChange}
                rows="3"
                className="input-field"
                placeholder="Enter observations about animal's physical condition..."
              />
            </div>

            {/* Disease Check */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Disease Check</label>
              <div className="space-y-2 bg-gray-50 p-3 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    name="fmdDisease"
                    checked={formData.fmdDisease}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span className="text-sm">FMD (Foot & Mouth Disease)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    name="lsdDisease"
                    checked={formData.lsdDisease}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span className="text-sm">LSD (Lumpy Skin Disease)</span>
                </label>
              </div>
            </div>

            {/* Animal Photos */}
            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Animal Photos (Optional)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ImageUploadField field="animalPhotoFront" label="Front View" />
                <ImageUploadField field="animalPhotoSide" label="Side View" />
                <ImageUploadField field="animalPhotoRear" label="Rear View" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Records */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <FileText className="text-purple-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Health & Vaccination Record</h2>
              <p className="text-sm text-gray-500">Upload supporting document (Optional)</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <FileUploadField
            field="healthRecord"
            label="Health Record"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10}
            required={false}
            isImage={false}
            description="Upload health certificate or vaccination record"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Truck className="text-orange-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Logistic & Transit Details</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="vehicleNo"
                  value={formData.vehicleNo || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="e.g., MH31AB1234"
                />
                <Truck className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Driver Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="driverName"
                  value={formData.driverName || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter driver name"
                />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <input
                type="text"
                name="driverDesignation"
                value={formData.driverDesignation || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter designation"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="driverMobile"
                  value={formData.driverMobile || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="10"
                  className={`input-field pl-10 ${errors.driverMobile && touchedFields.driverMobile ? "border-red-500 focus:ring-red-200" : ""}`}
                  placeholder="Enter 10-digit mobile"
                />
                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.driverMobile && touchedFields.driverMobile && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.driverMobile}
                </p>
              )}
            </div>

            {/* Aadhar Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="driverAadhar"
                  value={formData.driverAadhar || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="12"
                  className={`input-field pl-10 ${errors.driverAadhar && touchedFields.driverAadhar ? "border-red-500 focus:ring-red-200" : ""}`}
                  placeholder="Enter 12-digit Aadhar"
                />
                <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.driverAadhar && touchedFields.driverAadhar && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.driverAadhar}
                </p>
              )}
            </div>

            {/* Driving License */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driving License No.
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="drivingLicense"
                  value={formData.drivingLicense || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter license number"
                />
                <IdCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* License Certificate Upload */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload License Certificate
              </label>
              <FileUploadField
                field="licenseCertificate"
                label="License Certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                required={false}
                isImage={false}
              />
            </div>
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
            <div className="p-2 bg-yellow-50 rounded-lg">
              <HomeIcon className="text-yellow-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Quarantine & Care Details</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quarantine Center */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quarantine Center
              </label>
              <select
                name="quarantineCenter"
                value={formData.quarantineCenter || ''}
                onChange={handleChange}
                className="input-field"
              >
                {quarantineCenters.map(center => (
                  <option key={center.id} value={center.name} disabled={center.disabled}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Center Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quarantine Center Photo
              </label>
              <ImageUploadField field="quarantineCenterPhoto" label="Center Photo" />
            </div>

            {/* Health Record Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Health Record
              </label>
              <FileUploadField
                field="quarantineHealthRecord"
                label="Health Record"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={10}
                required={false}
                isImage={false}
                description="Upload health checkup record during quarantine"
              />
            </div>

            {/* Final Health Clearance */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Health Clearance Record
              </label>
              <FileUploadField
                field="finalHealthClearance"
                label="Health Clearance"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={10}
                required={false}
                isImage={false}
                description="Upload final health clearance certificate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Hand className="text-indigo-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Handover Details</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Handover Officer - Integrated with same API */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handover Officer Name
              </label>
              <div className="relative">
                <select
                  name="handoverOfficer"
                  value={formData.handoverOfficer || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                  disabled={isLoadingOfficers}
                >
                  <option value="">Select Handover Officer</option>
                  {procurementOfficers.map(officer => (
                    <option key={officer.id} value={officer.id}>
                      {officer.firstName} {officer.lastName} - {officer.mobile}
                    </option>
                  ))}
                </select>
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Beneficiary ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="beneficiaryId"
                  value={formData.beneficiaryId || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter beneficiary ID"
                />
                <IdCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="beneficiaryLocation"
                  value={formData.beneficiaryLocation || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter location"
                />
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Handover Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handover Photo
              </label>
              <ImageUploadField 
                field="handoverPhoto" 
                label="Handover Photo"
                description="Show Beneficiary and Animal Ear Tag ID clearly"
              />
            </div>

            {/* Handover Date - Separate field, no default */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handover Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="handoverDate"
                  value={formData.handoverDate || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
                <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Handover Time - Separate field, no default */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handover Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  name="handoverTime"
                  value={formData.handoverTime || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
                <Clock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Handover Document */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handover Document
              </label>
              <FileUploadField
                field="handoverDocument"
                label="Handover Document"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={10}
                required={false}
                isImage={false}
                description="Upload handover certificate or acknowledgment"
              />
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>

      <Toaster
        position="top-center"
        toastOptions={{
          style: { 
            background: "#fff", 
            color: "#374151",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          success: { 
            style: { background: "#f0fdf4", color: "#166534" },
            icon: '✅',
          },
          error: { 
            style: { background: "#fef2f2", color: "#991b1b" },
            icon: '❌',
          },
          duration: 3000,
        }}
      />

      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 shadow-xl transform scale-110 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600">
                {isEditMode ? 'Procurement updated successfully' : 'Procurement created successfully'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Redirecting to list...</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideIn">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Animal Details' : 'Animal Registration'}
              </h1>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                <ClipboardList size={16} />
                {isEditMode ? 'Update the procurement details below' : 'Create a new animal procurement record'}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
              <BadgeCheck className="text-primary-500" size={20} />
              <span className="text-sm font-medium text-gray-700">
                {currentStep}/4 Steps
              </span>
            </div>
          </div>
        </div>

        {renderStepIndicator()}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

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
              
              {currentStep < 4 ? (
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
                      {isEditMode ? 'Update' : 'Submit'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-4 gap-4 text-center text-xs text-gray-400 mt-4">
            <div className={currentStep >= 1 ? 'text-primary-500 font-medium' : ''}>
              Source & Animal {currentStep > 1 && '✓'}
            </div>
            <div className={currentStep >= 2 ? 'text-primary-500 font-medium' : ''}>
              Logistics {currentStep > 2 && '✓'}
            </div>
            <div className={currentStep >= 3 ? 'text-primary-500 font-medium' : ''}>
              Quarantine {currentStep > 3 && '✓'}
            </div>
            <div className={currentStep >= 4 ? 'text-primary-500 font-medium' : ''}>
              Handover {currentStep > 4 && '✓'}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimalProcurement;