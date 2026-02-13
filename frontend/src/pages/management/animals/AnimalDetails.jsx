// pages/animals/ViewAnimal.jsx (with navigation to HealthCheckupForm)
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  Activity,
  AlertCircle,
  XCircle,
  ArrowLeft,
  User,
  Building,
  Beef,
  Tag,
  Calendar,
  Eye,
  FileText,
  IndianRupee,
  Phone,
  HeartPulse,
  Camera,
  Video,
  Shield,
  FileCheck,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Download,
  Scale,
  Milk,
  Baby,
  File,
  Stethoscope,
  Heart,
  Thermometer,
  CheckCircle,
  Clock,
} from "lucide-react";
import { GiCow } from "react-icons/gi";

const AnimalDetails = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const location = useLocation();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [insurances, setInsurances] = useState([]);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [editingInsuranceId, setEditingInsuranceId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, type: null });
  
  // Health Checkups state - for displaying records only
  const [healthCheckups, setHealthCheckups] = useState([]);
  const [editingCheckupId, setEditingCheckupId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Veterinary officers data - matching HealthCheckForm
  const veterinaryOfficers = [
    { id: 1, name: "Dr. Rajesh Kumar", mobile: "9876543210" },
    { id: 2, name: "Dr. Priya Sharma", mobile: "8765432109" },
    { id: 3, name: "Dr. Amit Patel", mobile: "7654321098" },
    { id: 4, name: "Dr. Sunita Reddy", mobile: "6543210987" },
    { id: 5, name: "Dr. Vikram Singh", mobile: "5432109876" },
  ];

  // Insurance Form State
  const [insuranceForm, setInsuranceForm] = useState({
    certificateNo: "",
    issueDate: "",
    policyNumber: "",
    ownerName: "",
    animalName: "",
    species: "",
    animalId: "",
    medicalInsuranceCertificate: null,
    certificateFile: null,
    fileName: "",
  });

  // Mock animal data - Using consistent earTagId format (TAG-XXX) to match HealthCheckupList
  const MOCK_ANIMAL_DATA = {
    id: 1,
    uid: "ANM001",
    // Vendor Details
    vendorName: "Rajesh Kumar",
    vendorId: "V001",
    vendorMobile: "9876543210",
    
    // Animal Details
    earTagId: "TAG-001",
    animalType: "Cow",
    breed: "Holstein Friesian",
    pricing: "₹85,000",
    pregnancyStatus: "milking",
    calfTagId: "CALF001",
    numberOfPregnancies: 3,
    ageYears: 5,
    ageMonths: 2,
    weight: "450 kg",
    milkPerDay: "12 liters",
    calfAgeYears: 1,
    calfAgeMonths: 6,
    commissionAgentName: "Amit Singh",
    commissionAgentId: "CA001",
    
    // Media fields
    frontPhoto: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
    sidePhoto: "https://images.unsplash.com/photo-1547722700-57de53c5c0e7?w=400",
    backPhoto: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=400",
    animalVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    calfPhoto: "https://images.unsplash.com/photo-1597848212624-e6f1f5d6f7d0?w=400",
    calfVideo: null,
    
    // Additional view-only fields
    createdAt: "2024-01-15T10:30:00Z",
    status: "Registered",
    healthStatus: "Healthy",
    lastHealthCheck: "2024-02-15"
  };

  // Mock animals array
  const MOCK_ANIMALS = [
    MOCK_ANIMAL_DATA,
    {
      id: 2,
      uid: "ANM002",
      earTagId: "TAG-002",
      vendorName: "Suresh Patel",
      vendorId: "V002",
      vendorMobile: "9876543211",
      animalType: "Buffalo",
      breed: "Murrah",
      pricing: "₹95,000",
      pregnancyStatus: "pregnant",
      calfTagId: "",
      numberOfPregnancies: 2,
      ageYears: 4,
      ageMonths: 0,
      weight: "550 kg",
      milkPerDay: "10 liters",
      calfAgeYears: "",
      calfAgeMonths: "",
      commissionAgentName: "Ravi Kumar",
      commissionAgentId: "CA002",
      createdAt: "2024-01-20T14:45:00Z",
      status: "Verified",
      healthStatus: "Healthy",
      lastHealthCheck: "2024-02-10"
    },
    {
      id: 3,
      uid: "ANM003",
      earTagId: "TAG-003",
      vendorName: "Mohan Singh",
      vendorId: "V003",
      vendorMobile: "9876543212",
      animalType: "Cow",
      breed: "Gir",
      pricing: "₹75,000",
      pregnancyStatus: "non-pregnant",
      calfTagId: "",
      numberOfPregnancies: 1,
      ageYears: 3,
      ageMonths: 6,
      weight: "400 kg",
      milkPerDay: "8 liters",
      calfAgeYears: "",
      calfAgeMonths: "",
      commissionAgentName: "Priya Singh",
      commissionAgentId: "CA003",
      createdAt: "2024-02-10T09:15:00Z",
      status: "Registered",
      healthStatus: "Healthy",
      lastHealthCheck: "2024-03-01"
    }
  ];

  // EXPANDED MOCK HEALTH CHECKUPS DATA - To test the design
// ============= COMPREHENSIVE MOCK HEALTH CHECKUPS DATA =============
// Add this to your ViewAnimal.jsx component, replace the existing MOCK_HEALTH_CHECKUPS

const MOCK_HEALTH_CHECKUPS = {
  "TAG-001": [
    // 1. COMPLETE CHECKUP - All fields filled, approved, multiple vaccinations
    {
      id: 101,
      vetOfficer: "1", // Dr. Rajesh Kumar
      checkDate: "2024-03-15",
      temperature: "38.5",
      heartRate: "72",
      generalCondition: "Excellent",
      appetite: "Good",
      hydration: "Good",
      mobility: "Normal",
      vaccinated: "yes",
      vaccinations: [
        {
          id: 1001,
          vaccinationType: "FMD",
          vaccinationName: "Foot and Mouth Disease Vaccine",
          vaccinationDate: "2024-03-15",
          batchNo: "FMD12345"
        },
        {
          id: 1002,
          vaccinationType: "LSD",
          vaccinationName: "Lumpy Skin Disease Vaccine",
          vaccinationDate: "2024-03-15",
          batchNo: "LSD67890"
        }
      ],
      vetApproval: "approved",
      remark: "Animal is in excellent health condition. Both vaccinations administered successfully. No signs of illness or distress. Recommended next checkup in 3 months.",
      healthCertificateName: "health_certificate_mar15_2024.pdf",
      healthCertificate: null,
      submittedAt: "2024-03-15T10:30:00Z"
    },
    
    // 2. PENDING APPROVAL - Recent checkup waiting for approval
    {
      id: 102,
      vetOfficer: "2", // Dr. Priya Sharma
      checkDate: "2024-03-10",
      temperature: "38.8",
      heartRate: "75",
      generalCondition: "Good",
      appetite: "Good",
      hydration: "Adequate",
      mobility: "Normal",
      vaccinated: "yes",
      vaccinations: [
        {
          id: 1003,
          vaccinationType: "FMD",
          vaccinationName: "Foot and Mouth Disease Vaccine",
          vaccinationDate: "2024-03-10",
          batchNo: "FMD98765"
        }
      ],
      vetApproval: "pending",
      remark: "Routine checkup completed. Vaccination administered. Awaiting approval from senior veterinarian.",
      healthCertificateName: "pending_certificate_mar10.pdf",
      healthCertificate: null,
      submittedAt: "2024-03-10T14:20:00Z"
    },
    
    // 3. REJECTED - With health issues detected
    {
      id: 103,
      vetOfficer: "3", // Dr. Amit Patel
      checkDate: "2024-02-28",
      temperature: "39.5", // High fever
      heartRate: "85", // Elevated heart rate
      generalCondition: "Poor",
      appetite: "Poor",
      hydration: "Dehydrated",
      mobility: "Severely Lame",
      vaccinated: "no",
      vaccinations: [],
      vetApproval: "rejected",
      remark: "Animal showing severe signs of infection. High temperature, lameness in right hind leg, reduced appetite. Treatment prescribed: Antibiotics (Amoxicillin 10ml daily for 7 days), Anti-inflammatory medication. Immediate recheck required in 3 days.",
      healthCertificateName: "",
      healthCertificate: null,
      submittedAt: "2024-02-28T09:15:00Z"
    },
    
    // 4. BASIC CHECKUP - Only mandatory fields, no vaccinations
    {
      id: 104,
      vetOfficer: "4", // Dr. Sunita Reddy
      checkDate: "2024-02-15",
      temperature: "", // Not recorded
      heartRate: "", // Not recorded
      generalCondition: "Fair",
      appetite: "Moderate",
      hydration: "Adequate",
      mobility: "Normal",
      vaccinated: "no",
      vaccinations: [],
      vetApproval: "approved",
      remark: "Quick health assessment. Animal appears generally healthy but showing mild signs of stress. No vaccinations administered today.",
      healthCertificateName: "",
      healthCertificate: null,
      submittedAt: "2024-02-15T11:45:00Z"
    },
    
    // 5. PREGNANCY CHECKUP - Special case with pregnancy remarks
    {
      id: 105,
      vetOfficer: "1", // Dr. Rajesh Kumar
      checkDate: "2024-02-01",
      temperature: "38.6",
      heartRate: "74",
      generalCondition: "Good",
      appetite: "Good",
      hydration: "Good",
      mobility: "Normal",
      vaccinated: "yes",
      vaccinations: [
        {
          id: 1004,
          vaccinationType: "Other",
          vaccinationName: "Pregnancy Vitamin Supplement",
          vaccinationDate: "2024-02-01",
          batchNo: "VIT78901"
        }
      ],
      vetApproval: "approved",
      remark: "Pregnancy confirmed - approximately 4 months. Animal in good health. Prescribed prenatal vitamins. Next checkup recommended in 30 days for pregnancy monitoring.",
      healthCertificateName: "pregnancy_certificate_feb1.pdf",
      healthCertificate: null,
      submittedAt: "2024-02-01T13:20:00Z"
    },
    
    // 6. CALF CHECKUP - For milking animals with calf
    {
      id: 106,
      vetOfficer: "5", // Dr. Vikram Singh
      checkDate: "2024-01-20",
      temperature: "38.7",
      heartRate: "76",
      generalCondition: "Good",
      appetite: "Good",
      hydration: "Good",
      mobility: "Normal",
      vaccinated: "yes",
      vaccinations: [
        {
          id: 1005,
          vaccinationType: "FMD",
          vaccinationName: "Foot and Mouth Disease Vaccine",
          vaccinationDate: "2024-01-20",
          batchNo: "FMD45678"
        }
      ],
      vetApproval: "approved",
      remark: "Mother and calf both healthy. Milk production stable at 12 liters/day. Calf weighing 45kg, active and feeding well.",
      healthCertificateName: "calf_health_jan20.pdf",
      healthCertificate: null,
      submittedAt: "2024-01-20T10:00:00Z"
    },
    
    // 7. EMERGENCY CHECKUP - After hours, urgent care
    {
      id: 107,
      vetOfficer: "2", // Dr. Priya Sharma
      checkDate: "2024-01-05",
      temperature: "40.2", // Very high fever
      heartRate: "92", // Very high heart rate
      generalCondition: "Critical",
      appetite: "None",
      hydration: "Severely Dehydrated",
      mobility: "Unable to Move",
      vaccinated: "no",
      vaccinations: [],
      vetApproval: "approved",
      remark: "EMERGENCY: Animal found unable to stand, high fever, labored breathing. Administered IV fluids, antibiotics, and antipyretics. Hospitalized for 24 hours observation. Condition stabilized. Follow-up required in 48 hours.",
      healthCertificateName: "emergency_treatment_jan5.pdf",
      healthCertificate: null,
      submittedAt: "2024-01-05T22:30:00Z"
    },
    
    // 8. ROUTINE CHECKUP - Minimal data, no remark
    {
      id: 108,
      vetOfficer: "3", // Dr. Amit Patel
      checkDate: "2023-12-10",
      temperature: "38.4",
      heartRate: "71",
      generalCondition: "Good",
      appetite: "",
      hydration: "",
      mobility: "",
      vaccinated: "yes",
      vaccinations: [
        {
          id: 1006,
          vaccinationType: "LSD",
          vaccinationName: "Lumpy Skin Disease Vaccine",
          vaccinationDate: "2023-12-10",
          batchNo: "LSD13579"
        }
      ],
      vetApproval: "approved",
      remark: "",
      healthCertificateName: "",
      healthCertificate: null,
      submittedAt: "2023-12-10T15:50:00Z"
    },
    
    // 9. FOLLOW-UP CHECKUP - After previous rejection
    {
      id: 109,
      vetOfficer: "3", // Dr. Amit Patel
      checkDate: "2024-03-05",
      temperature: "38.3",
      heartRate: "70",
      generalCondition: "Good",
      appetite: "Good",
      hydration: "Good",
      mobility: "Slightly Lame", // Improving but not fully recovered
      vaccinated: "yes",
      vaccinations: [
        {
          id: 1007,
          vaccinationType: "FMD",
          vaccinationName: "Foot and Mouth Disease Vaccine",
          vaccinationDate: "2024-03-05",
          batchNo: "FMD24680"
        }
      ],
      vetApproval: "approved",
      remark: "FOLLOW-UP: Animal has recovered well from previous infection. Temperature normal, appetite returned, still slight lameness but improving. Cleared for normal activities. Continue prescribed supplements for 2 more weeks.",
      healthCertificateName: "followup_certificate_mar5.pdf",
      healthCertificate: null,
      submittedAt: "2024-03-05T16:10:00Z"
    },
    
    // 10. VACCINATION ONLY - Quick visit just for vaccine
    {
      id: 110,
      vetOfficer: "4", // Dr. Sunita Reddy
      checkDate: "2024-03-18",
      temperature: "38.6",
      heartRate: "73",
      generalCondition: "",
      appetite: "",
      hydration: "",
      mobility: "",
      vaccinated: "yes",
      vaccinations: [
        {
          id: 1008,
          vaccinationType: "FMD",
          vaccinationName: "Foot and Mouth Disease Vaccine - Booster",
          vaccinationDate: "2024-03-18",
          batchNo: "FMD36912"
        }
      ],
      vetApproval: "approved",
      remark: "Booster vaccination only. Animal healthy, no examination needed.",
      healthCertificateName: "booster_vaccination_mar18.pdf",
      healthCertificate: null,
      submittedAt: "2024-03-18T09:30:00Z"
    }
  ],
  
  "TAG-002": [
    // Buffalo with pregnancy
    {
      id: 201,
      vetOfficer: "1",
      checkDate: "2024-03-10",
      temperature: "38.8",
      heartRate: "73",
      generalCondition: "Good",
      appetite: "Good",
      hydration: "Good",
      mobility: "Normal",
      vaccinated: "yes",
      vaccinations: [
        {
          id: 2001,
          vaccinationType: "FMD",
          vaccinationName: "Foot and Mouth Disease Vaccine",
          vaccinationDate: "2024-03-10",
          batchNo: "FMD12345"
        }
      ],
      vetApproval: "approved",
      remark: "Pregnant buffalo (6 months), regular checkup required. All vitals normal. Fetal heartbeat strong. Recommended calcium supplements.",
      healthCertificateName: "pregnant_buffalo_mar10.pdf",
      healthCertificate: null,
      submittedAt: "2024-03-10T14:20:00Z"
    },
    {
      id: 202,
      vetOfficer: "2",
      checkDate: "2024-01-15",
      temperature: "38.6",
      heartRate: "71",
      generalCondition: "Good",
      appetite: "Good",
      hydration: "Good",
      mobility: "Normal",
      vaccinated: "yes",
      vaccinations: [
        {
          id: 2002,
          vaccinationType: "LSD",
          vaccinationName: "Lumpy Skin Disease Vaccine",
          vaccinationDate: "2024-01-15",
          batchNo: "LSD24680"
        }
      ],
      vetApproval: "approved",
      remark: "Pregnancy confirmed. Estimated delivery in 3 months (April 2024).",
      healthCertificateName: "",
      healthCertificate: null,
      submittedAt: "2024-01-15T10:45:00Z"
    }
  ],
  
  "TAG-003": [
    // Young cow, first checkup
    {
      id: 301,
      vetOfficer: "3",
      checkDate: "2024-02-28",
      temperature: "38.4",
      heartRate: "69",
      generalCondition: "Excellent",
      appetite: "Good",
      hydration: "Good",
      mobility: "Normal",
      vaccinated: "yes",
      vaccinations: [
        {
          id: 3001,
          vaccinationType: "FMD",
          vaccinationName: "Foot and Mouth Disease Vaccine",
          vaccinationDate: "2024-02-28",
          batchNo: "FMD13579"
        }
      ],
      vetApproval: "approved",
      remark: "First health checkup. Young healthy cow, 3 years old. No issues detected. Vaccination administered.",
      healthCertificateName: "first_checkup_feb28.pdf",
      healthCertificate: null,
      submittedAt: "2024-02-28T13:50:00Z"
    }
  ],
  
  "TAG-004": [], // Empty array - no checkups
  "TAG-005": [] // Empty array - no checkups
};

  // Mock Insurance data
  const MOCK_INSURANCES = {
    "TAG-001": [
      {
        id: 1001,
        certificateNo: "INS001",
        issueDate: "2024-01-15",
        policyNumber: "POL123456",
        ownerName: "Rajesh Kumar",
        animalName: "Ganga",
        species: "Cow",
        animalId: "ANM001",
        fileName: "insurance_certificate_jan15.pdf",
        medicalInsuranceCertificate: null,
        createdAt: "2024-01-15T11:30:00Z"
      }
    ],
    "TAG-002": [],
    "TAG-003": []
  };

  // Load animal data
  useEffect(() => {
    const loadAnimalData = async () => {
      setLoading(true);
      
      try {
        if (location.state?.animal) {
          setAnimal(location.state.animal);
          loadInsurances(location.state.animal.earTagId);
          loadHealthCheckups(location.state.animal.earTagId);
        } else if (uid) {
          await fetchAnimalData(uid);
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

  // Fetch animal data function
  const fetchAnimalData = async (uid) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundAnimal = MOCK_ANIMALS.find(a => a.uid === uid);
      
      if (foundAnimal) {
        setAnimal(foundAnimal);
        loadInsurances(foundAnimal.earTagId);
        loadHealthCheckups(foundAnimal.earTagId);
      } else {
        toast.error("Animal not found");
        navigate("/management/animals");
      }
    } catch (error) {
      console.error("Error fetching animal data:", error);
      toast.error("Failed to load animal details");
    }
  };

  // Load insurances from localStorage or mock data
  const loadInsurances = (earTagId) => {
    const savedInsurances = localStorage.getItem(`insurances_${earTagId}`);
    
    if (savedInsurances) {
      setInsurances(JSON.parse(savedInsurances));
    } else {
      const mockInsurances = MOCK_INSURANCES[earTagId] || [];
      setInsurances(mockInsurances);
      if (mockInsurances.length > 0) {
        localStorage.setItem(`insurances_${earTagId}`, JSON.stringify(mockInsurances));
      }
    }
  };

  // Load health checkups from localStorage or mock data
  const loadHealthCheckups = (earTagId) => {
    const savedCheckups = localStorage.getItem(`healthCheckups_${earTagId}`);
    
    if (savedCheckups) {
      setHealthCheckups(JSON.parse(savedCheckups));
    } else {
      const mockCheckups = MOCK_HEALTH_CHECKUPS[earTagId] || [];
      setHealthCheckups(mockCheckups);
      if (mockCheckups.length > 0) {
        localStorage.setItem(`healthCheckups_${earTagId}`, JSON.stringify(mockCheckups));
      }
    }
  };

  // Save health checkups to localStorage
  useEffect(() => {
    if (animal?.earTagId) {
      localStorage.setItem(
        `healthCheckups_${animal.earTagId}`,
        JSON.stringify(healthCheckups)
      );
    }
  }, [healthCheckups, animal?.earTagId]);

  // Save insurances to localStorage
  useEffect(() => {
    if (animal?.earTagId) {
      localStorage.setItem(
        `insurances_${animal.earTagId}`,
        JSON.stringify(insurances)
      );
    }
  }, [insurances, animal?.earTagId]);

  // ============= NAVIGATION TO HEALTH CHECKUP FORM =============
  // Navigate to Add Health Checkup Form
  const navigateToHealthCheckForm = () => {
    if (animal) {
      const animalData = {
        id: animal.id,
        animalId: animal.uid,
        animalTagId: animal.earTagId,
        sellerName: animal.vendorName,
        sellerMobile: animal.vendorMobile,
        checkupDate: new Date().toISOString(),
        status: "Scheduled"
      };
      
      console.log("Navigating to add health checkup form with animalData:", animalData);
      
      navigate('/health-checkup/form/new', {
        state: {
          animalData: animalData
        }
      });
    }
  };

  // Navigate to Edit Health Checkup Form
  const navigateToEditHealthCheckup = (checkup) => {
    if (animal) {
      const animalData = {
        id: animal.id,
        animalId: animal.uid,
        animalTagId: animal.earTagId,
        sellerName: animal.vendorName,
        sellerMobile: animal.vendorMobile,
        checkupDate: checkup.checkDate,
        status: checkup.vetApproval
      };
      
      console.log("Navigating to edit health checkup form with:", { animalData, checkup });
      
      navigate('/health-checkup/form/edit', {
        state: {
          animalData: animalData,
          healthCheckupData: checkup
        }
      });
    }
  };

  // ============= INLINE EDIT HANDLERS =============
const startInlineEdit = (checkup) => {
  setEditingCheckupId(checkup.id);
  setEditFormData({
    id: checkup.id,
    vetOfficer: checkup.vetOfficer || '',
    checkDate: checkup.checkDate || '',
    temperature: checkup.temperature || '',
    heartRate: checkup.heartRate || '',
    generalCondition: checkup.generalCondition || '',
    appetite: checkup.appetite || '',
    hydration: checkup.hydration || '',
    mobility: checkup.mobility || '',
    vaccinated: checkup.vaccinated || 'no',
    vaccinations: checkup.vaccinations || [],
    vetApproval: checkup.vetApproval || 'pending',
    remark: checkup.remark || '',
    healthCertificateName: checkup.healthCertificateName || ''
  });
};

const handleEditInputChange = (e) => {
  const { name, value } = e.target;
  setEditFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleEditVaccinationChange = (index, field, value) => {
  setEditFormData(prev => {
    const updatedVaccinations = [...prev.vaccinations];
    updatedVaccinations[index] = {
      ...updatedVaccinations[index],
      [field]: value
    };
    return {
      ...prev,
      vaccinations: updatedVaccinations
    };
  });
};

const addEditVaccination = () => {
  setEditFormData(prev => ({
    ...prev,
    vaccinations: [
      ...prev.vaccinations,
      {
        id: Date.now(),
        vaccinationType: '',
        vaccinationName: '',
        vaccinationDate: '',
        batchNo: ''
      }
    ]
  }));
};

const removeEditVaccination = (index) => {
  setEditFormData(prev => ({
    ...prev,
    vaccinations: prev.vaccinations.filter((_, i) => i !== index)
  }));
};

const saveInlineEdit = () => {
  // Update the health checkups array
  const updatedCheckups = healthCheckups.map(checkup => 
    checkup.id === editingCheckupId ? { ...checkup, ...editFormData } : checkup
  );
  
  setHealthCheckups(updatedCheckups);
  
  // Save to localStorage
  if (animal?.earTagId) {
    localStorage.setItem(
      `healthCheckups_${animal.earTagId}`,
      JSON.stringify(updatedCheckups)
    );
  }
  
  // Exit edit mode
  setEditingCheckupId(null);
  setEditFormData({});
  
  toast.success("Health checkup updated successfully!");
};

const cancelInlineEdit = () => {
  setEditingCheckupId(null);
  setEditFormData({});
};
  // ============================================================

  // INSURANCE FORM HANDLERS
  const handleInsuranceInputChange = (e) => {
    const { name, value } = e.target;
    setInsuranceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInsuranceFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInsuranceForm((prev) => ({
          ...prev,
          medicalInsuranceCertificate: reader.result,
          certificateFile: file,
          fileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInsurance = () => {
    if (
      !insuranceForm.certificateNo ||
      !insuranceForm.policyNumber ||
      !insuranceForm.issueDate
    ) {
      toast.error(
        "Please fill in required fields: Certificate No, Policy Number, and Issue Date"
      );
      return;
    }

    const newInsurance = {
      id: editingInsuranceId || Date.now().toString(),
      certificateNo: insuranceForm.certificateNo,
      issueDate: insuranceForm.issueDate,
      policyNumber: insuranceForm.policyNumber,
      ownerName: insuranceForm.ownerName || "",
      animalName: insuranceForm.animalName || "",
      species: insuranceForm.species || "",
      animalId: insuranceForm.animalId || animal?.uid || "",
      fileName: insuranceForm.fileName,
      medicalInsuranceCertificate: insuranceForm.medicalInsuranceCertificate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingInsuranceId) {
      setInsurances((prev) =>
        prev.map((ins) => (ins.id === editingInsuranceId ? newInsurance : ins))
      );
      setEditingInsuranceId(null);
      toast.success("Insurance updated successfully!");
    } else {
      setInsurances((prev) => [...prev, newInsurance]);
      toast.success("Insurance added successfully!");
    }

    resetInsuranceForm();
    setShowInsuranceForm(false);
  };

  const resetInsuranceForm = () => {
    setInsuranceForm({
      certificateNo: "",
      issueDate: "",
      policyNumber: "",
      ownerName: "",
      animalName: "",
      species: "",
      animalId: "",
      medicalInsuranceCertificate: null,
      certificateFile: null,
      fileName: "",
    });
  };

  const handleEditInsurance = (insurance) => {
    setInsuranceForm({
      certificateNo: insurance.certificateNo,
      issueDate: insurance.issueDate,
      policyNumber: insurance.policyNumber,
      ownerName: insurance.ownerName,
      animalName: insurance.animalName,
      species: insurance.species,
      animalId: insurance.animalId,
      medicalInsuranceCertificate: insurance.medicalInsuranceCertificate,
      certificateFile: null,
      fileName: insurance.fileName,
    });
    setEditingInsuranceId(insurance.id);
    setShowInsuranceForm(true);
  };

  const confirmDeleteInsurance = (id) => {
    setDeleteModal({ show: true, id, type: 'insurance' });
  };

  const handleDeleteInsurance = () => {
    if (deleteModal.id) {
      const updatedInsurances = insurances.filter(
        (ins) => ins.id !== deleteModal.id
      );
      setInsurances(updatedInsurances);
      toast.success("Insurance deleted successfully!");
    }
    setDeleteModal({ show: false, id: null, type: null });
  };

  const confirmDeleteHealthCheckup = (id) => {
    setDeleteModal({ show: true, id, type: 'healthCheckup' });
  };

  const handleDeleteHealthCheckup = () => {
    if (deleteModal.id) {
      const updatedCheckups = healthCheckups.filter(
        checkup => checkup.id !== deleteModal.id
      );
      setHealthCheckups(updatedCheckups);
      toast.success("Health checkup deleted successfully!");
    }
    setDeleteModal({ show: false, id: null, type: null });
  };

  const handleCancelInsuranceForm = () => {
    setShowInsuranceForm(false);
    setEditingInsuranceId(null);
    resetInsuranceForm();
  };

  // Global delete handler
  const handleDelete = () => {
    if (deleteModal.type === 'insurance') {
      handleDeleteInsurance();
    } else if (deleteModal.type === 'healthCheckup') {
      handleDeleteHealthCheckup();
    }
  };

  // View health checkup details (placeholder for future implementation)
  const viewHealthCheckupDetails = (checkup) => {
    toast.info("View details - Coming soon");
  };

  // Utility Functions
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not provided";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateTimeString;
    }
  };

  const isPDFFile = (fileName) => {
    return fileName?.toLowerCase().endsWith(".pdf");
  };

  const getPregnancyStatusLabel = (status) => {
    switch(status) {
      case 'milking': return 'Milking';
      case 'pregnant': return 'Pregnant';
      case 'non-pregnant': return 'Non-Pregnant';
      default: return status || 'Not provided';
    }
  };

  const getVetApprovalBadge = (status) => {
    switch(status) {
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: X, label: 'Rejected' };
      case 'pending':
      default:
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' };
    }
  };

  const getVetNameById = (vetId) => {
    if (!vetId) return 'Not specified';
    const vet = veterinaryOfficers.find(v => v.id.toString() === vetId.toString());
    return vet ? vet.name : 'Unknown';
  };

  const getVetMobileById = (vetId) => {
    if (!vetId) return '';
    const vet = veterinaryOfficers.find(v => v.id.toString() === vetId.toString());
    return vet ? vet.mobile : '';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Animal Details...</h3>
          <p className="text-gray-500">Please wait while we fetch the animal information.</p>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="p-4 bg-blue-100 rounded-full mb-4 inline-block">
            <GiCow className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Animal Not Found</h3>
          <p className="text-gray-500 mb-6">No animal data found in the system.</p>
          <button
            onClick={() => navigate("/management/animals")}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Animals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/management/animals")}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Animal Details</h1>
            <p className="text-gray-600">View complete animal information</p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {animal.frontPhoto ? (
                <img
                  src={animal.frontPhoto}
                  alt="Animal"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/150?text=Animal";
                  }}
                />
              ) : (
                <GiCow className="text-gray-400" size={40} />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {animal.uid}
                </h3>
                <p className="text-gray-600 mt-1">
                  {animal.breed} • {animal.animalType} • {animal.ageYears} years {animal.ageMonths} months
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  animal.status === "Registered" ? "bg-blue-100 text-blue-800" :
                  animal.status === "Verified" ? "bg-green-100 text-green-800" :
                  animal.status === "Sold" ? "bg-purple-100 text-purple-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {animal.status || "Registered"}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  animal.pregnancyStatus === 'milking' ? "bg-blue-100 text-blue-800" :
                  animal.pregnancyStatus === 'pregnant' ? "bg-pink-100 text-pink-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {getPregnancyStatusLabel(animal.pregnancyStatus)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Tag className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Ear Tag: <span className="font-medium">{animal.earTagId}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <IndianRupee className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Price: <span className="font-medium">{animal.pricing}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Milk className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Milk: <span className="font-medium">{animal.milkPerDay} liters/day</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "details"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <GiCow size={18} />
              Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("vendor")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "vendor"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Building size={18} />
              Vendor
            </div>
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "media"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Camera size={18} />
              Media
            </div>
          </button>
          <button
            onClick={() => setActiveTab("healthCheckups")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "healthCheckups"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <HeartPulse size={18} />
              Health Checkups
              {healthCheckups.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {healthCheckups.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("insurance")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "insurance"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={18} />
              Insurance
              {insurances.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {insurances.length}
                </span>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* Details Tab Content */}
      {activeTab === "details" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <DetailSection title="Basic Information" icon={<GiCow size={20} />}>
                <div className="space-y-4">
                  <DetailRow label="Animal ID" value={animal.uid || "Not provided"} />
                  <DetailRow label="Animal Type" value={animal.animalType || "Not provided"} />
                  <DetailRow label="Breed" value={animal.breed || "Not provided"} />
                  <DetailRow label="Age" value={animal.ageYears !== undefined && animal.ageMonths !== undefined 
                    ? `${animal.ageYears} years ${animal.ageMonths} months`
                    : "Not provided"} />
                  <DetailRow label="Weight" value={animal.weight ? `${animal.weight} kg` : "Not provided"} />
                  <DetailRow label="Milk Production" value={animal.milkPerDay ? `${animal.milkPerDay} liters/day` : "Not provided"} />
                  <DetailRow label="Price" value={animal.pricing || "Not provided"} />
                  <DetailRow label="Pregnancy Status" value={getPregnancyStatusLabel(animal.pregnancyStatus)} />
                  <DetailRow label="Number of Pregnancies" value={animal.numberOfPregnancies || "Not provided"} />
                </div>
              </DetailSection>

              {animal.commissionAgentName && (
                <DetailSection title="Commission Agent" icon={<User size={20} />}>
                  <div className="space-y-4">
                    <DetailRow label="Agent Name" value={animal.commissionAgentName || "Not provided"} />
                    <DetailRow label="Agent ID" value={animal.commissionAgentId || "Not provided"} />
                  </div>
                </DetailSection>
              )}
            </div>

            <div className="space-y-6">
              {animal.pregnancyStatus === 'milking' && (
                <DetailSection title="Calf Details" icon={<Baby size={20} />}>
                  <div className="space-y-4">
                    <DetailRow label="Calf Tag ID" value={animal.calfTagId || "Not provided"} />
                    <DetailRow label="Calf Age" value={animal.calfAgeYears !== undefined && animal.calfAgeMonths !== undefined
                      ? `${animal.calfAgeYears} years ${animal.calfAgeMonths} months`
                      : "Not provided"} />
                  </div>
                </DetailSection>
              )}

              <DetailSection title="Health Information" icon={<HeartPulse size={20} />}>
                <div className="space-y-4">
                  <DetailRow label="Health Status" value={animal.healthStatus || "Healthy"} />
                  <DetailRow label="Last Health Check" value={formatDate(animal.lastHealthCheck)} />
                  <DetailRow label="Total Health Checkups" value={healthCheckups.length.toString()} />
                </div>
              </DetailSection>

              <DetailSection title="Registration Details" icon={<Calendar size={20} />}>
                <div className="space-y-4">
                  <DetailRow label="Registration Date" value={formatDate(animal.createdAt)} />
                  <DetailRow label="Status" value={animal.status || "Registered"} />
                </div>
              </DetailSection>
            </div>
          </div>
        </div>
      )}

      {/* VENDOR TAB */}
      {activeTab === "vendor" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vendor Details</h3>
                <p className="text-gray-600 mt-1">Vendor who supplied this animal</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {animal.vendorName ? (
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{animal.vendorId || "V001"}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{animal.vendorName}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{animal.vendorMobile || "9876543210"}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/vendors/${animal.vendorId || 'V001'}`)}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <Building className="w-12 h-12 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-500 mb-2">No vendor information</h3>
                          <p className="text-gray-400 text-sm mb-6">Vendor information is not available for this animal.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MEDIA TAB */}
      {activeTab === "media" && (
        <div className="space-y-6">
          <DetailSection title="Animal Media" icon={<Camera size={20} />}>
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-4">Animal Photos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Front View", field: "frontPhoto", src: animal.frontPhoto },
                    { label: "Side View", field: "sidePhoto", src: animal.sidePhoto },
                    { label: "Back View", field: "backPhoto", src: animal.backPhoto },
                  ].map((img, i) => (
                    <div key={i} className="text-center">
                      <p className="text-sm text-gray-600 mb-2">{img.label}</p>
                      {img.src ? (
                        <img
                          src={img.src}
                          alt={img.label}
                          className="h-48 w-full object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="h-48 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                          <Camera className="text-gray-300" size={24} />
                          <span className="ml-2">No photo</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Animal 360° Video</h4>
                {animal.animalVideo ? (
                  <video controls src={animal.animalVideo} className="rounded-lg w-full border border-gray-200" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <Video className="text-gray-300" size={24} />
                    <span className="ml-2">No video available</span>
                  </div>
                )}
              </div>

              {animal.pregnancyStatus === 'milking' && (
                <>
                  <h4 className="text-md font-medium text-gray-700 mt-4">Calf Media</h4>
                  {animal.calfPhoto && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Calf Photo</p>
                      <img
                        src={animal.calfPhoto}
                        alt="Calf"
                        className="h-48 w-full object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>
                  )}
                  {animal.calfVideo && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Calf 360° Video</p>
                      <video controls src={animal.calfVideo} className="rounded-lg w-full border border-gray-200" />
                    </div>
                  )}
                </>
              )}
            </div>
          </DetailSection>
        </div>
      )}

      {/* HEALTH CHECKUPS TAB */}
      {activeTab === "healthCheckups" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Routine Health Checkups</h2>
              <p className="text-sm text-gray-600 mt-1">
                Complete history of veterinary examinations
              </p>
            </div>
            <button
              onClick={navigateToHealthCheckForm}
              className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2 shadow-md"
            >
              <Plus size={16} />
              Add Health Checkup
            </button>
          </div>

          {healthCheckups.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-primary-100 rounded-full mb-4">
                  <HeartPulse className="w-12 h-12 text-secondary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  No Health Checkup Records Found
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  This animal hasn't had any health checkups yet
                </p>
                <button
                  onClick={navigateToHealthCheckForm}
                  className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Add First Health Checkup
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {healthCheckups
                .sort((a, b) => new Date(b.checkDate) - new Date(a.checkDate))
                .map((checkup) => {
                  const approvalBadge = getVetApprovalBadge(checkup.vetApproval);
                  const ApprovalIcon = approvalBadge.icon;
                  const isEditing = editingCheckupId === checkup.id;
                  
                  if (isEditing) {
                    return (
                      <div key={checkup.id} className="border border-blue-300 rounded-lg p-4 bg-blue-50 shadow-sm">
                        {/* Edit Mode Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-base font-semibold text-blue-800">Edit Health Checkup</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={saveInlineEdit}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center gap-1"
                            >
                              <Check size={14} />
                              Save
                            </button>
                            <button
                              onClick={cancelInlineEdit}
                              className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs font-medium flex items-center gap-1"
                            >
                              <X size={14} />
                              Cancel
                            </button>
                          </div>
                        </div>

                        {/* Edit Form - Compact Version */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Vet Officer</label>
                            <select
                              name="vetOfficer"
                              value={editFormData.vetOfficer}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select</option>
                              {veterinaryOfficers.map(vet => (
                                <option key={vet.id} value={vet.id}>{vet.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Check Date</label>
                            <input
                              type="date"
                              name="checkDate"
                              value={editFormData.checkDate}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Temperature</label>
                            <input
                              type="text"
                              name="temperature"
                              value={editFormData.temperature}
                              onChange={handleEditInputChange}
                              placeholder="°C"
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Heart Rate</label>
                            <input
                              type="text"
                              name="heartRate"
                              value={editFormData.heartRate}
                              onChange={handleEditInputChange}
                              placeholder="BPM"
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Condition</label>
                            <select
                              name="generalCondition"
                              value={editFormData.generalCondition}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="Excellent">Excellent</option>
                              <option value="Good">Good</option>
                              <option value="Fair">Fair</option>
                              <option value="Poor">Poor</option>
                              <option value="Critical">Critical</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Mobility</label>
                            <select
                              name="mobility"
                              value={editFormData.mobility}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="Normal">Normal</option>
                              <option value="Slightly Lame">Slightly Lame</option>
                              <option value="Severely Lame">Severely Lame</option>
                              <option value="Unable to Move">Unable to Move</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Appetite</label>
                            <select
                              name="appetite"
                              value={editFormData.appetite}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="Good">Good</option>
                              <option value="Moderate">Moderate</option>
                              <option value="Poor">Poor</option>
                              <option value="None">None</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Hydration</label>
                            <select
                              name="hydration"
                              value={editFormData.hydration}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="Good">Good</option>
                              <option value="Adequate">Adequate</option>
                              <option value="Dehydrated">Dehydrated</option>
                              <option value="Severely Dehydrated">Severely Dehydrated</option>
                            </select>
                          </div>
                        </div>

                        {/* Vaccination Section in Edit Mode */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-gray-700">Vaccinations</label>
                            <button
                              onClick={addEditVaccination}
                              className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs flex items-center gap-1"
                            >
                              <Plus size={12} /> Add
                            </button>
                          </div>
                          {editFormData.vaccinations?.map((vaccination, index) => (
                            <div key={vaccination.id || index} className="flex items-center gap-2 mb-2 bg-white p-2 rounded-lg border border-gray-200">
                              <input
                                type="text"
                                placeholder="Type"
                                value={vaccination.vaccinationType}
                                onChange={(e) => handleEditVaccinationChange(index, 'vaccinationType', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                              <input
                                type="text"
                                placeholder="Name"
                                value={vaccination.vaccinationName}
                                onChange={(e) => handleEditVaccinationChange(index, 'vaccinationName', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                              <input
                                type="date"
                                value={vaccination.vaccinationDate}
                                onChange={(e) => handleEditVaccinationChange(index, 'vaccinationDate', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                              <input
                                type="text"
                                placeholder="Batch No"
                                value={vaccination.batchNo}
                                onChange={(e) => handleEditVaccinationChange(index, 'batchNo', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                              <button
                                onClick={() => removeEditVaccination(index)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Remark in Edit Mode */}
                        <div className="mb-2">
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Remark</label>
                          <textarea
                            name="remark"
                            value={editFormData.remark}
                            onChange={handleEditInputChange}
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter remarks..."
                          />
                        </div>

                        {/* Approval Status in Edit Mode */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Vet Approval</label>
                          <div className="flex gap-3">
                            {['approved', 'rejected', 'pending'].map(status => (
                              <label key={status} className="flex items-center gap-1">
                                <input
                                  type="radio"
                                  name="vetApproval"
                                  value={status}
                                  checked={editFormData.vetApproval === status}
                                  onChange={handleEditInputChange}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm capitalize">{status}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // View Mode - Compact Card (your existing card design)
                  return (
                    <div
                      key={checkup.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-semibold text-gray-900">
                            {formatDate(checkup.checkDate)}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${approvalBadge.color}`}>
                            <ApprovalIcon size={10} />
                            {approvalBadge.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getVetNameById(checkup.vetOfficer)}
                          </span>
                        </div>
                        <button
                          onClick={() => startInlineEdit(checkup)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors self-end sm:self-auto"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>

                      {/* Vital Signs - Enhanced Design */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {checkup.temperature && (
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                            <div className="p-1.5 bg-white rounded-full shadow-sm">
                              <Thermometer size={14} className="text-orange-500" />
                            </div>
                            <div>
                              <span className="text-[10px] font-medium text-orange-600 uppercase tracking-wider">Temp</span>
                              <p className="text-sm font-bold text-gray-800 leading-tight">{checkup.temperature}°C</p>
                            </div>
                          </div>
                        )}
                        
                        {checkup.heartRate && (
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-100">
                            <div className="p-1.5 bg-white rounded-full shadow-sm">
                              <Heart size={14} className="text-red-500" />
                            </div>
                            <div>
                              <span className="text-[10px] font-medium text-red-600 uppercase tracking-wider">Heart Rate</span>
                              <p className="text-sm font-bold text-gray-800 leading-tight">{checkup.heartRate} <span className="text-xs font-normal text-gray-500">BPM</span></p>
                            </div>
                          </div>
                        )}
                        
                        {checkup.generalCondition && (
                          <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                            checkup.generalCondition === 'Excellent' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' :
                            checkup.generalCondition === 'Good' ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200' :
                            checkup.generalCondition === 'Fair' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' :
                            'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                          }`}>
                            <div className={`p-1.5 bg-white rounded-full shadow-sm ${
                              checkup.generalCondition === 'Excellent' ? 'text-green-600' :
                              checkup.generalCondition === 'Good' ? 'text-blue-600' :
                              checkup.generalCondition === 'Fair' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              <Stethoscope size={14} />
                            </div>
                            <div>
                              <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">Condition</span>
                              <p className={`text-sm font-bold leading-tight ${
                                checkup.generalCondition === 'Excellent' ? 'text-green-700' :
                                checkup.generalCondition === 'Good' ? 'text-blue-700' :
                                checkup.generalCondition === 'Fair' ? 'text-yellow-700' :
                                'text-red-700'
                              }`}>
                                {checkup.generalCondition}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {checkup.mobility && (
                          <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                            checkup.mobility === 'Normal' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' :
                            checkup.mobility === 'Slightly Lame' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' :
                            checkup.mobility === 'Severely Lame' ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200' :
                            'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                          }`}>
                            <div className={`p-1.5 bg-white rounded-full shadow-sm ${
                              checkup.mobility === 'Normal' ? 'text-green-600' :
                              checkup.mobility === 'Slightly Lame' ? 'text-yellow-600' :
                              checkup.mobility === 'Severely Lame' ? 'text-orange-600' :
                              'text-red-600'
                            }`}>
                              {checkup.mobility === 'Normal' ? <Activity size={14} /> : 
                              checkup.mobility === 'Unable to Move' ? <XCircle size={14} /> : 
                              <AlertCircle size={14} />}
                            </div>
                            <div>
                              <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">Mobility</span>
                              <p className={`text-sm font-bold leading-tight ${
                                checkup.mobility === 'Normal' ? 'text-green-700' :
                                checkup.mobility === 'Slightly Lame' ? 'text-yellow-700' :
                                checkup.mobility === 'Severely Lame' ? 'text-orange-700' :
                                'text-red-700'
                              }`}>
                                {checkup.mobility}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Vaccination Records - Scrollable */}
                      {checkup.vaccinations?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <FileText size={12} />
                            Vaccinations ({checkup.vaccinations.length})
                          </p>
                          <div className="max-h-24 overflow-y-auto pr-1 space-y-1.5">
                            {checkup.vaccinations.map((vaccination) => (
                              <div key={vaccination.id} className="bg-gray-50 p-2 rounded border border-gray-100 text-xs">
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                  <span className="text-gray-600">
                                    <span className="font-medium">Type:</span> {vaccination.vaccinationType}
                                  </span>
                                  <span className="text-gray-600">
                                    <span className="font-medium">Name:</span> {vaccination.vaccinationName}
                                  </span>
                                  <span className="text-gray-600">
                                    <span className="font-medium">Date:</span> {vaccination.vaccinationDate}
                                  </span>
                                  <span className="text-gray-600">
                                    <span className="font-medium">Batch:</span> {vaccination.batchNo}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Remark - Scrollable */}
                      {checkup.remark && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Remark:</p>
                          <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-100 max-h-16 overflow-y-auto text-xs text-gray-700">
                            {checkup.remark}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          {checkup.vaccinated === 'yes' ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle size={12} />
                              Vaccinated
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-500">
                              <X size={12} />
                              Not Vaccinated
                            </span>
                          )}
                          {checkup.healthCertificateName && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <FileText size={12} />
                              Certificate
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400">
                          {formatDateTime(checkup.submittedAt || checkup.checkDate)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* INSURANCE TAB */}
      {activeTab === "insurance" && (
        <div className="space-y-6">
          {showInsuranceForm ? (
            <DetailSection
              title={editingInsuranceId ? "Edit Insurance" : "Add New Insurance"}
              icon={<FileCheck size={20} />}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate No *
                      </label>
                      <input
                        type="text"
                        name="certificateNo"
                        value={insuranceForm.certificateNo}
                        onChange={handleInsuranceInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter certificate number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        name="issueDate"
                        value={insuranceForm.issueDate}
                        onChange={handleInsuranceInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Policy Number *
                      </label>
                      <input
                        type="text"
                        name="policyNumber"
                        value={insuranceForm.policyNumber}
                        onChange={handleInsuranceInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter policy number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={insuranceForm.ownerName}
                        onChange={handleInsuranceInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter owner name"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Animal Name
                      </label>
                      <input
                        type="text"
                        name="animalName"
                        value={insuranceForm.animalName}
                        onChange={handleInsuranceInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter animal name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Species
                      </label>
                      <input
                        type="text"
                        name="species"
                        value={insuranceForm.species}
                        onChange={handleInsuranceInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter species"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Animal ID
                      </label>
                      <input
                        type="text"
                        name="animalId"
                        value={insuranceForm.animalId}
                        onChange={handleInsuranceInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter animal ID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Medical Insurance Certificate
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleInsuranceFileChange}
                          className="hidden"
                          id="insuranceFile"
                        />
                        <label
                          htmlFor="insuranceFile"
                          className="cursor-pointer flex flex-col items-center gap-3"
                        >
                          <FileCheck className="text-3xl text-blue-600" />
                          <div>
                            <span className="block text-sm font-medium text-gray-700">
                              {insuranceForm.fileName || "Click to upload certificate"}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              PDF, JPG, PNG up to 10MB
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCancelInsuranceForm}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveInsurance}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Check size={16} />
                    {editingInsuranceId ? "Update Insurance" : "Save Insurance"}
                  </button>
                </div>
              </div>
            </DetailSection>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Medical Insurance</h2>
                <button
                  onClick={() => setShowInsuranceForm(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Insurance
                </button>
              </div>

              {insurances.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-4 bg-primary-100 rounded-full mb-4">
                      <FileCheck className="w-12 h-12 text-secondary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No Insurance Records Found</h3>
                    <p className="text-gray-400 text-sm mb-6">Add medical insurance information for this animal</p>
                    <button
                      onClick={() => setShowInsuranceForm(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                      Add Insurance
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {insurances.map((insurance) => (
                    <div
                      key={insurance.id}
                      className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div className="min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 break-words">
                            Certificate #{insurance.certificateNo}
                          </h4>
                          <p className="text-sm text-gray-500 break-words mt-1">
                            Policy: {insurance.policyNumber} • Issued: {formatDate(insurance.issueDate)}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditInsurance(insurance)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => confirmDeleteInsurance(insurance.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <DetailRow label="Owner Name" value={insurance.ownerName || "N/A"} />
                        <DetailRow label="Animal Name" value={insurance.animalName || "N/A"} />
                        <DetailRow label="Species" value={insurance.species || "N/A"} />
                        <DetailRow label="Animal ID" value={insurance.animalId || "N/A"} />
                        <DetailRow label="Certificate No" value={insurance.certificateNo} />
                        <DetailRow label="Policy Number" value={insurance.policyNumber} />
                        <DetailRow label="Issue Date" value={formatDate(insurance.issueDate)} />
                        <DetailRow label="Certificate File" value={insurance.fileName || "N/A"} />
                      </div>

                      {insurance.medicalInsuranceCertificate && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Certificate Preview:</p>
                          <div className="border rounded-lg p-4 bg-gray-50">
                            {isPDFFile(insurance.fileName) ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                  <File className="text-red-500 text-2xl flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-medium text-base truncate">{insurance.fileName}</p>
                                    <p className="text-sm text-gray-500">PDF Document</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Link
                                    to={insurance.medicalInsuranceCertificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  >
                                    <Eye size={16} /> View PDF
                                  </Link>
                                  <Link
                                    to={insurance.medicalInsuranceCertificate}
                                    download={insurance.fileName}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                  >
                                    <Download size={16} /> Download
                                  </Link>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <img
                                  src={insurance.medicalInsuranceCertificate}
                                  alt="Insurance Certificate"
                                  className="w-full max-w-md rounded-lg border mx-auto"
                                />
                                <div className="flex gap-2">
                                  <Link
                                    to={insurance.medicalInsuranceCertificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  >
                                    <Eye size={16} /> View Full Size
                                  </Link>
                                  <Link
                                    to={insurance.medicalInsuranceCertificate}
                                    download={insurance.fileName}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                  >
                                    <Download size={16} /> Download
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete {deleteModal.type === 'insurance' ? 'Insurance Record' : 'Health Checkup Record'}
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this {deleteModal.type === 'insurance' ? 'insurance' : 'health checkup'} record? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, id: null, type: null })}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Components
const DetailSection = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <span className="text-blue-600">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const DetailRow = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
      {label}
    </label>
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800 break-words">
      {value || "Not provided"}
    </div>
  </div>
);

export default AnimalDetails;