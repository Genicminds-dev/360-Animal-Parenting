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
  const { earTagId } = useParams(); // Using earTagId as the unique identifier
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
    animalEarTagId: "", // Changed from animalId to animalEarTagId
    medicalInsuranceCertificate: null,
    certificateFile: null,
    fileName: "",
  });

  // ============= UPDATED MOCK ANIMAL DATA WITH BENEFICIARY FIELDS =============
  const MOCK_ANIMALS = [
    {
      // Animal 1 - Milking Cow with Calf
      earTagId: "TAG-001",
      
      // Animal Details from EditAnimal.jsx
      breed: "Gir",
      gender: "Female",
      lactation: "3",
      ageYears: 5,
      ageMonths: 2,
      calvingStatus: "milking",
      calfTagId: "CALF-001",
      calfGender: "Female",
      calvingDate: "2024-02-15",
      examDate: "2024-03-10",
      examineBy: "Dr. Rajesh Kumar",
      receivingDate: "2024-01-15",
      remark: "Healthy animal, good milk production. Regular deworming done. Animal is responding well to feed and shows no signs of stress.",
      
      // Media fields
      frontImage: {
        preview: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
        name: "front_image.jpg",
        type: "image/jpeg",
        size: "2.3 MB"
      },
      sideImage: {
        preview: "https://images.unsplash.com/photo-1547722700-57de53c5c0e7?w=400",
        name: "side_image.jpg",
        type: "image/jpeg",
        size: "1.8 MB"
      },
      rearImage: {
        preview: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=400",
        name: "rear_image.jpg",
        type: "image/jpeg",
        size: "2.1 MB"
      },
      video: {
        preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        name: "animal_360_video.mp4",
        type: "video/mp4",
        size: "15.6 MB",
        instructions: "Front → Left → Back → Right → Front"
      },
      
      // Beneficiary Details (replacing vendor details)
      beneficiaryId: "BEN001",
      beneficiaryName: "Rajesh Kumar",
      beneficiaryMobile: "9876543210",
      doNumber: "DO-2024-001",
      
      // Additional view-only fields
      createdAt: "2024-01-15T10:30:00Z",
      status: "Registered",
      healthStatus: "Healthy",
      lastHealthCheck: "2024-03-15"
    },
    {
      // Animal 2 - Pregnant Buffalo
      earTagId: "TAG-002",
      
      // Animal Details from EditAnimal.jsx
      breed: "Murrah",
      gender: "Female",
      lactation: "2",
      ageYears: 4,
      ageMonths: 0,
      calvingStatus: "pregnant",
      calfTagId: "",
      calfGender: "",
      calvingDate: "2024-06-15", // Expected calving date
      examDate: "2024-03-05",
      examineBy: "Dr. Priya Sharma",
      receivingDate: "2024-01-20",
      remark: "Pregnant - expected delivery in June 2024. Regular checkup required. Animal is in good health with normal vital signs.",
      
      // Media fields - Some animals may have missing media
      frontImage: {
        preview: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=400",
        name: "buffalo_front.jpg",
        type: "image/jpeg",
        size: "1.9 MB"
      },
      sideImage: null,
      rearImage: null,
      video: null,
      
      // Beneficiary Details
      beneficiaryId: "BEN002",
      beneficiaryName: "Suresh Patel",
      beneficiaryMobile: "9876543211",
      doNumber: "DO-2024-002",
      
      // Additional view-only fields
      createdAt: "2024-01-20T14:45:00Z",
      status: "Verified",
      healthStatus: "Healthy",
      lastHealthCheck: "2024-03-05"
    },
    {
      // Animal 3 - Non-Pregnant Young Cow
      earTagId: "TAG-003",
      
      // Animal Details from EditAnimal.jsx
      breed: "Holstein Friesian",
      gender: "Female",
      lactation: "1",
      ageYears: 3,
      ageMonths: 6,
      calvingStatus: "non-pregnant",
      calfTagId: "",
      calfGender: "",
      calvingDate: "",
      examDate: "2024-03-01",
      examineBy: "Dr. Amit Patel",
      receivingDate: "2024-02-10",
      remark: "Young animal, first lactation expected soon. Healthy condition. Vaccination schedule up to date.",
      
      // Media fields - Minimal media
      frontImage: {
        preview: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
        name: "cow_front.jpg",
        type: "image/jpeg",
        size: "2.0 MB"
      },
      sideImage: null,
      rearImage: null,
      video: null,
      
      // Beneficiary Details
      beneficiaryId: "BEN003",
      beneficiaryName: "Mohan Singh",
      beneficiaryMobile: "9876543212",
      doNumber: "DO-2024-003",
      
      // Additional view-only fields
      createdAt: "2024-02-10T09:15:00Z",
      status: "Registered",
      healthStatus: "Healthy",
      lastHealthCheck: "2024-03-01"
    },
    {
      // Animal 4 - Milking Cow with Male Calf
      earTagId: "TAG-004",
      
      // Animal Details from EditAnimal.jsx
      breed: "Jersey Cross",
      gender: "Female",
      lactation: "4",
      ageYears: 7,
      ageMonths: 3,
      calvingStatus: "milking",
      calfTagId: "CALF-004",
      calfGender: "Male",
      calvingDate: "2024-01-10",
      examDate: "2024-02-20",
      examineBy: "Dr. Sunita Reddy",
      receivingDate: "2023-12-05",
      remark: "High milk yield animal. Producing 15 liters/day. Calf is healthy and active.",
      
      // Media fields
      frontImage: {
        preview: "https://images.unsplash.com/photo-1547722700-57de53c5c0e7?w=400",
        name: "jersey_front.jpg",
        type: "image/jpeg",
        size: "2.2 MB"
      },
      sideImage: {
        preview: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=400",
        name: "jersey_side.jpg",
        type: "image/jpeg",
        size: "1.7 MB"
      },
      rearImage: null,
      video: null,
      
      // Beneficiary Details
      beneficiaryId: "BEN004",
      beneficiaryName: "Harpreet Singh",
      beneficiaryMobile: "9876543213",
      doNumber: "DO-2024-004",
      
      // Additional view-only fields
      createdAt: "2023-12-05T11:20:00Z",
      status: "Active",
      healthStatus: "Excellent",
      lastHealthCheck: "2024-02-20"
    },
    {
      // Animal 5 - Pregnant Cow - No Media
      earTagId: "TAG-005",
      
      // Animal Details from EditAnimal.jsx
      breed: "Sahiwal",
      gender: "Female",
      lactation: "0",
      ageYears: 2,
      ageMonths: 8,
      calvingStatus: "pregnant",
      calfTagId: "",
      calfGender: "",
      calvingDate: "2024-08-20",
      examDate: "2024-03-15",
      examineBy: "Dr. Vikram Singh",
      receivingDate: "2024-02-28",
      remark: "First pregnancy. Young animal, needs extra care and nutrition. Regular monitoring required.",
      
      // Media fields - No media uploaded
      frontImage: null,
      sideImage: null,
      rearImage: null,
      video: null,
      
      // Beneficiary Details
      beneficiaryId: "BEN005",
      beneficiaryName: "Amit Kumar",
      beneficiaryMobile: "9876543214",
      doNumber: "DO-2024-005",
      
      // Additional view-only fields
      createdAt: "2024-02-28T16:30:00Z",
      status: "Under Observation",
      healthStatus: "Good",
      lastHealthCheck: "2024-03-15"
    }
  ];

  // ============= COMPREHENSIVE MOCK HEALTH CHECKUPS DATA =============
  const MOCK_HEALTH_CHECKUPS = {
    "TAG-001": [
      {
        id: 101,
        vetOfficer: "1",
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
          }
        ],
        vetApproval: "approved",
        remark: "Animal is in excellent health condition. All vitals normal.",
        healthCertificateName: "health_certificate_mar15.pdf",
        healthCertificate: null,
        submittedAt: "2024-03-15T10:30:00Z"
      },
      {
        id: 102,
        vetOfficer: "2",
        checkDate: "2024-02-28",
        temperature: "38.8",
        heartRate: "75",
        generalCondition: "Good",
        appetite: "Good",
        hydration: "Adequate",
        mobility: "Normal",
        vaccinated: "yes",
        vaccinations: [
          {
            id: 1002,
            vaccinationType: "LSD",
            vaccinationName: "Lumpy Skin Disease Vaccine",
            vaccinationDate: "2024-02-28",
            batchNo: "LSD67890"
          }
        ],
        vetApproval: "approved",
        remark: "Routine checkup completed. Vaccination administered.",
        healthCertificateName: "",
        healthCertificate: null,
        submittedAt: "2024-02-28T14:20:00Z"
      }
    ],
    "TAG-002": [
      {
        id: 201,
        vetOfficer: "1",
        checkDate: "2024-03-05",
        temperature: "38.6",
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
            vaccinationDate: "2024-03-05",
            batchNo: "FMD12345"
          }
        ],
        vetApproval: "approved",
        remark: "Pregnant buffalo (6 months), regular checkup required. All vitals normal.",
        healthCertificateName: "pregnant_buffalo_mar05.pdf",
        healthCertificate: null,
        submittedAt: "2024-03-05T14:20:00Z"
      }
    ],
    "TAG-003": [
      {
        id: 301,
        vetOfficer: "3",
        checkDate: "2024-03-01",
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
            vaccinationDate: "2024-03-01",
            batchNo: "FMD13579"
          }
        ],
        vetApproval: "approved",
        remark: "Young healthy cow, 3 years old. No issues detected.",
        healthCertificateName: "first_checkup_mar01.pdf",
        healthCertificate: null,
        submittedAt: "2024-03-01T13:50:00Z"
      }
    ],
    "TAG-004": [
      {
        id: 401,
        vetOfficer: "4",
        checkDate: "2024-02-20",
        temperature: "38.7",
        heartRate: "74",
        generalCondition: "Excellent",
        appetite: "Good",
        hydration: "Good",
        mobility: "Normal",
        vaccinated: "yes",
        vaccinations: [
          {
            id: 4001,
            vaccinationType: "FMD",
            vaccinationName: "Foot and Mouth Disease Vaccine",
            vaccinationDate: "2024-02-20",
            batchNo: "FMD24680"
          }
        ],
        vetApproval: "approved",
        remark: "High milk producer. All parameters normal.",
        healthCertificateName: "",
        healthCertificate: null,
        submittedAt: "2024-02-20T11:15:00Z"
      }
    ],
    "TAG-005": [] // No health checkups yet
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
        animalEarTagId: "TAG-001",
        fileName: "insurance_certificate_jan15.pdf",
        medicalInsuranceCertificate: null,
        createdAt: "2024-01-15T11:30:00Z"
      }
    ],
    "TAG-002": [],
    "TAG-003": [],
    "TAG-004": [
      {
        id: 1002,
        certificateNo: "INS002",
        issueDate: "2024-02-10",
        policyNumber: "POL789012",
        ownerName: "Harpreet Singh",
        animalName: "Laxmi",
        species: "Cow",
        animalEarTagId: "TAG-004",
        fileName: "insurance_certificate_feb10.pdf",
        medicalInsuranceCertificate: null,
        createdAt: "2024-02-10T09:45:00Z"
      }
    ],
    "TAG-005": []
  };

  // Load animal data
  useEffect(() => {
    const loadAnimalData = async () => {
      setLoading(true);
      
      try {
        // Check if animal data was passed via location state
        if (location.state?.animal) {
          setAnimal(location.state.animal);
          loadInsurances(location.state.animal.earTagId);
          loadHealthCheckups(location.state.animal.earTagId);
        } 
        // Otherwise fetch by earTagId from URL
        else if (earTagId) {
          await fetchAnimalData(earTagId);
        } 
        else {
          toast.error("No Ear Tag ID provided");
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
  }, [earTagId, location.state, navigate]);

  // Fetch animal data function using earTagId
  const fetchAnimalData = async (earTagId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find animal by earTagId (case insensitive)
      const foundAnimal = MOCK_ANIMALS.find(a => 
        a.earTagId.toLowerCase() === earTagId.toLowerCase()
      );
      
      if (foundAnimal) {
        setAnimal(foundAnimal);
        loadInsurances(foundAnimal.earTagId);
        loadHealthCheckups(foundAnimal.earTagId);
      } else {
        toast.error(`Animal with Ear Tag ID ${earTagId} not found`);
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
        animalTagId: animal.earTagId,
        sellerName: animal.beneficiaryName,
        sellerMobile: animal.beneficiaryMobile,
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
        animalTagId: animal.earTagId,
        sellerName: animal.beneficiaryName,
        sellerMobile: animal.beneficiaryMobile,
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
    const updatedCheckups = healthCheckups.map(checkup => 
      checkup.id === editingCheckupId ? { ...checkup, ...editFormData } : checkup
    );
    
    setHealthCheckups(updatedCheckups);
    
    if (animal?.earTagId) {
      localStorage.setItem(
        `healthCheckups_${animal.earTagId}`,
        JSON.stringify(updatedCheckups)
      );
    }
    
    setEditingCheckupId(null);
    setEditFormData({});
    
    toast.success("Health checkup updated successfully!");
  };

  const cancelInlineEdit = () => {
    setEditingCheckupId(null);
    setEditFormData({});
  };

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
      animalEarTagId: insuranceForm.animalEarTagId || animal?.earTagId || "",
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
      animalEarTagId: "",
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
      animalEarTagId: insurance.animalEarTagId,
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

  // Navigate to beneficiary details
  const navigateToBeneficiaryDetails = () => {
    if (animal?.beneficiaryId) {
      navigate(`/beneficiaries/${animal.beneficiaryId}`);
    }
  };

  // Utility Functions
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
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
    switch(status?.toLowerCase()) {
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

  if (!animal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="p-4 bg-primary-100 rounded-full mb-4 inline-block">
            <GiCow className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Animal Not Found</h3>
          <p className="text-gray-500 mb-6">No animal data found in the system.</p>
          <button
            onClick={() => navigate("/management/animals")}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Animals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-r from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/management/animals")}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Animal Details</h1>
            <p className="text-gray-600">View complete animal information</p>
          </div>
        </div>
      </div>

      {/* Profile Header - Using Ear Tag ID as primary identifier */}
      <div className="bg-white rounded-xl shadow-md p-3">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-4 border-white shadow-lg flex items-center justify-center">
              <GiCow className="text-primary-600" size={40} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="text-primary-500" size={20} />
                  {animal.earTagId}
                </h3>
                <p className="text-gray-600 text-sm font-medium mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <GiCow size={16} className="text-gray-400" />
                    {animal.breed}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 capitalize">
                    <User size={16} className="text-gray-400" />
                    {animal.gender}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} className="text-gray-400" />
                    Age: {animal.ageYears}Y {animal.ageMonths}M
                  </span>
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                  animal.calvingStatus === 'milking' ? "bg-primary-100 text-primary-800" :
                  animal.calvingStatus === 'pregnant' ? "bg-pink-100 text-pink-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {animal.calvingStatus === 'milking' && <Milk size={16} />}
                  {animal.calvingStatus === 'pregnant' && <HeartPulse size={16} />}
                  {getPregnancyStatusLabel(animal.calvingStatus)}
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
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <GiCow size={18} />
              Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("beneficiary")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "beneficiary"
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Building size={18} />
              Beneficiary
            </div>
          </button>
          <button
            onClick={() => setActiveTab("healthCheckups")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "healthCheckups"
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <HeartPulse size={18} />
              Health Checkups
              {healthCheckups.length > 0 && (
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">
                  {healthCheckups.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("insurance")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "insurance"
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={18} />
              Insurance
              {insurances.length > 0 && (
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">
                  {insurances.length}
                </span>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* ============= UPDATED DETAILS TAB CONTENT ============= */}
      {/* Details Tab Content - With fields matching EditAnimal.jsx */}
      {activeTab === "details" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <DetailSection title="Animal Information" icon={<GiCow size={20} />}>
                <div className="space-y-4">
                  <DetailRow label="Ear Tag ID" value={animal.earTagId || "Not provided"} />
                  <DetailRow label="Breed" value={animal.breed || "Not provided"} />
                  <DetailRow label="Gender" value={animal.gender || "Not provided"} />
                  <DetailRow label="Calving Status" value={getPregnancyStatusLabel(animal.calvingStatus)} />
                  <DetailRow label="Lactation" value={animal.lactation || "Not provided"} />
                  <DetailRow label="Age" value={animal.ageYears !== undefined && animal.ageMonths !== undefined 
                    ? `${animal.ageYears} years ${animal.ageMonths} months`
                    : "Not provided"} />
                  <DetailRow label="Calving Date" value={formatDate(animal.calvingDate)} />
                  <DetailRow label="Exam Date" value={formatDate(animal.examDate)} />
                  <DetailRow label="Examine By" value={animal.examineBy || "Not provided"} />
                  <DetailRow label="Receiving Date" value={formatDate(animal.receivingDate)} />
                </div>
              </DetailSection>
            </div>

            <div className="space-y-6">
              {/* Calf Details - Only show if calving status is 'milking' */}
              {animal.calvingStatus === 'milking' && (
                <DetailSection title="Calf Details" icon={<Baby size={20} />}>
                  <div className="space-y-4">
                    <DetailRow label="Calf Tag ID" value={animal.calfTagId || "Not provided"} />
                    <DetailRow label="Calf Gender" value={animal.calfGender || "Not provided"} />
                  </div>
                </DetailSection>
              )}

                <DetailSection title="Remark" icon={<Baby size={20} />}>
                  <div className="space-y-4">
                  <DetailRow label="" value={animal.remark || "Not provided"} fullWidth />
                  </div>
                </DetailSection>

              {/* Media Section */}
              <DetailSection title="Media Gallery" icon={<Camera size={20} />}>
                <div className="space-y-6">
                  {/* Animal Photos */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Animal Photos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Front Image", field: "frontImage", data: animal.frontImage },
                        { label: "Side Image", field: "sideImage", data: animal.sideImage },
                        { label: "Rear Image", field: "rearImage", data: animal.rearImage },
                      ].map((img, i) => (
                        <div key={i} className="text-center">
                          <p className="text-xs text-gray-500 mb-1">{img.label}</p>
                          {img.data?.preview ? (
                            <div className="relative group">
                              <img
                                src={img.data.preview}
                                alt={img.label}
                                className="h-32 w-full object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                                onClick={() => window.open(img.data.preview, '_blank')}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                }}
                              />
                              {img.data.name && (
                                <p className="text-xs text-gray-500 mt-1 truncate">{img.data.name}</p>
                              )}
                            </div>
                          ) : (
                            <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                              <Camera className="text-gray-300" size={20} />
                              <span className="ml-1 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Animal Video */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-2">Animal 360° Video</h4>
                    {animal.video?.preview ? (
                      <div>
                        <video 
                          controls 
                          src={animal.video.preview} 
                          className="rounded-lg w-full border border-gray-200 max-h-48"
                        />
                        {animal.video.instructions && (
                          <p className="text-xs text-gray-500 mt-2 italic">📋 {animal.video.instructions}</p>
                        )}
                        {animal.video.name && (
                          <p className="text-xs text-gray-500 mt-1">{animal.video.name} ({animal.video.size})</p>
                        )}
                      </div>
                    ) : (
                      <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <Video className="text-gray-300" size={24} />
                        <span className="ml-2 text-sm">No video available</span>
                      </div>
                    )}
                  </div>
                </div>
              </DetailSection>
            </div>
          </div>
        </div>
      )}

      {/* BENEFICIARY TAB - UPDATED with Beneficiary ID, DO Number, Name, Mobile, and Action */}
      {activeTab === "beneficiary" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Beneficiary Details</h3>
                <p className="text-gray-600 mt-1">Beneficiary information for this animal</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiary ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DO Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {animal.beneficiaryName ? (
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{animal.beneficiaryId || "Not provided"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{animal.doNumber || "Not provided"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{animal.beneficiaryName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{animal.beneficiaryMobile || "Not provided"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={navigateToBeneficiaryDetails}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
                        >
                          <Eye size={16} /> View Details
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-primary-100 rounded-full mb-4">
                            <Building className="w-12 h-12 text-primary-600" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-500 mb-2">No beneficiary information</h3>
                          <p className="text-gray-400 text-sm mb-6">Beneficiary information is not available for this animal.</p>
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

      {/* HEALTH CHECKUPS TAB - Keep existing health checkups code */}
      {activeTab === "healthCheckups" && (
        <div className="space-y-6">
          {/* ... existing health checkups code ... */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Routine Health Checkups</h2>
              <p className="text-sm text-gray-600 mt-1">
                Complete history of veterinary examinations
              </p>
            </div>
            <button
              onClick={navigateToHealthCheckForm}
              className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2 shadow-md"
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
                      </div>

                      {/* Vital Signs */}
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
                            checkup.generalCondition === 'Good' ? 'bg-gradient-to-br from-primary-50 to-cyan-50 border-primary-200' :
                            checkup.generalCondition === 'Fair' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' :
                            'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                          }`}>
                            <div className={`p-1.5 bg-white rounded-full shadow-sm ${
                              checkup.generalCondition === 'Excellent' ? 'text-green-600' :
                              checkup.generalCondition === 'Good' ? 'text-primary-600' :
                              checkup.generalCondition === 'Fair' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              <Stethoscope size={14} />
                            </div>
                            <div>
                              <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">Condition</span>
                              <p className={`text-sm font-bold leading-tight ${
                                checkup.generalCondition === 'Excellent' ? 'text-green-700' :
                                checkup.generalCondition === 'Good' ? 'text-primary-700' :
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

                      {/* Vaccination Records */}
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

                      {/* Remark */}
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
                            <span className="flex items-center gap-1 text-primary-600">
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter species"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Animal Ear Tag ID
                      </label>
                      <input
                        type="text"
                        name="animalEarTagId"
                        value={insuranceForm.animalEarTagId || animal?.earTagId || ""}
                        onChange={handleInsuranceInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                        placeholder="Animal Ear Tag ID"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Medical Insurance Certificate
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
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
                          <FileCheck className="text-3xl text-primary-600" />
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
                    className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
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
                  className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Insurance
                </button>
              </div>

              {insurances.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-4 bg-primary-100 rounded-full mb-4">
                      <FileCheck className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No Insurance Records Found</h3>
                    <p className="text-gray-400 text-sm mb-6">Add medical insurance information for this animal</p>
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
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
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
                        <DetailRow label="Animal Ear Tag ID" value={insurance.animalEarTagId || "N/A"} />
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
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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
        <div className="p-2 bg-primary-50 rounded-lg">
          <span className="text-primary-600">{icon}</span>
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