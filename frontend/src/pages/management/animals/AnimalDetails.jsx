// pages/animals/ViewAnimal.jsx
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
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
  Search,
  Download,
  Scale,
  Milk,
  Baby,
  File
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
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

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

  // Mock animal data matching the registration form fields
  const MOCK_ANIMAL_DATA = {
    id: 1,
    uid: "ANM001",
    // Vendor Details
    vendorName: "Rajesh Kumar",
    vendorId: "V001",
    vendorMobile: "9876543210",
    
    // Animal Details (matching registration form)
    earTagId: "ET001",
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
    
    // Additional view-only fields (not in registration form)
    createdAt: "2024-01-15T10:30:00Z",
    status: "Registered",
    healthStatus: "Healthy",
    lastHealthCheck: "2024-02-15"
  };

  // Define MOCK_ANIMALS array with uid
  const MOCK_ANIMALS = [
    MOCK_ANIMAL_DATA,
    {
      id: 2,
      uid: "ANM002",
      earTagId: "ET002",
      vendorName: "Suresh Patel",
      vendorId: "V002",
      vendorMobile: "9876543211",
      animalType: "Buffalo",
      breed: "Murrah",
      pricing: "₹95,000",
      pregnancyStatus: "Pregnant",
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
    }
  ];

  // Load animal data
  useEffect(() => {
    const loadAnimalData = async () => {
      setLoading(true);
      
      try {
        // Check if animal data was passed in state
        if (location.state?.animal) {
          setAnimal(location.state.animal);
          
          // Load insurances for this animal
          const savedInsurances = localStorage.getItem(
            `insurances_${location.state.animal.earTagId}`
          );
          if (savedInsurances) {
            setInsurances(JSON.parse(savedInsurances));
          }
        } else if (uid) {
          // If no state but has uid, fetch the animal data
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
      // Replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find animal in MOCK_ANIMALS array by uid
      const foundAnimal = MOCK_ANIMALS.find(a => a.uid === uid);
      
      if (foundAnimal) {
        setAnimal(foundAnimal);
        
        // Load insurances for this animal
        const savedInsurances = localStorage.getItem(
          `insurances_${foundAnimal.earTagId}`
        );
        if (savedInsurances) {
          setInsurances(JSON.parse(savedInsurances));
        }
      } else {
        toast.error("Animal not found");
        navigate("/management/animals");
      }
    } catch (error) {
      console.error("Error fetching animal data:", error);
      toast.error("Failed to load animal details");
    }
  };

  // Save insurances to localStorage
  useEffect(() => {
    if (animal?.earTagId) {
      localStorage.setItem(
        `insurances_${animal.earTagId}`,
        JSON.stringify(insurances)
      );
    }
  }, [insurances, animal?.earTagId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInsuranceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
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
      animalId: insuranceForm.animalId || "",
      medicalInsuranceCertificate: insuranceForm.medicalInsuranceCertificate,
      fileName: insuranceForm.fileName,
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
    setShowInsuranceForm(false);
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
    setDeleteModal({ show: true, id });
  };

  const handleDeleteInsurance = () => {
    if (deleteModal.id) {
      const updatedInsurances = insurances.filter(
        (ins) => ins.id !== deleteModal.id
      );
      setInsurances(updatedInsurances);

      if (animal?.earTagId) {
        localStorage.setItem(
          `insurances_${animal.earTagId}`,
          JSON.stringify(updatedInsurances)
        );
      }
      toast.success("Insurance deleted successfully!");
    }
    setDeleteModal({ show: false, id: null });
  };

  const handleCancelForm = () => {
    setShowInsuranceForm(false);
    setEditingInsuranceId(null);
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
          <h3 className="text-xl font-bold text-gray-700 mb-2">Animal Not Found</h3>
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
          {/* Animal Image */}
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

          {/* Animal Info */}
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
            {/* Left Column: Basic & Identification Info */}
            <div className="space-y-6">
              {/* Basic Information */}
              <DetailSection
                title="Basic Information"
                icon={<GiCow size={20} />}
              >
                <div className="space-y-4">
                  <DetailRow
                    label="Animal ID"
                    value={animal.uid || "Not provided"}
                  />
                  <DetailRow
                    label="Animal Type"
                    value={animal.animalType || "Not provided"}
                  />
                  <DetailRow
                    label="Breed"
                    value={animal.breed || "Not provided"}
                  />
                  <DetailRow
                    label="Age"
                    value={animal.ageYears !== undefined && animal.ageMonths !== undefined 
                      ? `${animal.ageYears} years ${animal.ageMonths} months`
                      : "Not provided"}
                  />
                  <DetailRow
                    label="Weight"
                    value={animal.weight ? `${animal.weight} kg` : "Not provided"}
                  />
                  <DetailRow
                    label="Milk Production"
                    value={animal.milkPerDay ? `${animal.milkPerDay} liters/day` : "Not provided"}
                  />
                  <DetailRow
                    label="Price"
                    value={animal.pricing || "Not provided"}
                  />
                  <DetailRow
                    label="Pregnancy Status"
                    value={getPregnancyStatusLabel(animal.pregnancyStatus)}
                  />
                  <DetailRow
                    label="Number of Pregnancies"
                    value={animal.numberOfPregnancies || "Not provided"}
                  />
                </div>
              </DetailSection>

              {/* Commission Agent Details */}
              {animal.commissionAgentName && (
                <DetailSection
                  title="Commission Agent"
                  icon={<User size={20} />}
                >
                  <div className="space-y-4">
                    <DetailRow
                      label="Agent Name"
                      value={animal.commissionAgentName || "Not provided"}
                    />
                    <DetailRow
                      label="Agent ID"
                      value={animal.commissionAgentId || "Not provided"}
                    />
                  </div>
                </DetailSection>
              )}
            </div>

            {/* Right Column: Calf & Health Info */}
            <div className="space-y-6">
              {/* Calf Details - Only show if milking */}
              {animal.pregnancyStatus === 'milking' && (
                <DetailSection
                  title="Calf Details"
                  icon={<Baby size={20} />}
                >
                  <div className="space-y-4">
                    <DetailRow
                      label="Calf Tag ID"
                      value={animal.calfTagId || "Not provided"}
                    />
                    <DetailRow
                      label="Calf Age"
                      value={animal.calfAgeYears !== undefined && animal.calfAgeMonths !== undefined
                        ? `${animal.calfAgeYears} years ${animal.calfAgeMonths} months`
                        : "Not provided"}
                    />
                  </div>
                </DetailSection>
              )}

              {/* Health Information */}
              <DetailSection
                title="Health Information"
                icon={<HeartPulse size={20} />}
              >
                <div className="space-y-4">
                  <DetailRow
                    label="Health Status"
                    value={animal.healthStatus || "Healthy"}
                  />
                  <DetailRow
                    label="Last Health Check"
                    value={formatDate(animal.lastHealthCheck)}
                  />
                </div>
              </DetailSection>

              {/* Registration Details */}
              <DetailSection
                title="Registration Details"
                icon={<Calendar size={20} />}
              >
                <div className="space-y-4">
                  <DetailRow
                    label="Registration Date"
                    value={formatDate(animal.createdAt)}
                  />
                  <DetailRow
                    label="Status"
                    value={animal.status || "Registered"}
                  />
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
                <h3 className="text-lg font-semibold text-gray-900">
                  Vendor Details
                </h3>
                <p className="text-gray-600 mt-1">
                  Vendor who supplied this animal
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {animal.vendorName ? (
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {animal.vendorId || "V001"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {animal.vendorName}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {animal.vendorMobile || "9876543210"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          Active
                        </span>
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
                          <h3 className="text-lg font-medium text-gray-500 mb-2">
                            No vendor information
                          </h3>
                          <p className="text-gray-400 text-sm mb-6">
                            Vendor information is not available for this animal.
                          </p>
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
              {/* Animal Photos */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-4">Animal Photos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Front View", field: "frontPhoto", src: animal.frontPhoto },
                    { label: "Side View", field: "sidePhoto", src: animal.sidePhoto },
                    { label: "Back View", field: "backPhoto", src: animal.backPhoto },
                  ].map((img, i) => (
                    <div key={i} className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {img.label}
                      </p>
                      {img.src ? (
                        <img
                          src={img.src}
                          alt={img.label}
                          className="h-48 w-full object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/150?text=No+Image";
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

              {/* Animal Video */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Animal 360° Video</h4>
                {animal.animalVideo ? (
                  <video
                    controls
                    src={animal.animalVideo}
                    className="rounded-lg w-full border border-gray-200"
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <Video className="text-gray-300" size={24} />
                    <span className="ml-2">No video available</span>
                  </div>
                )}
              </div>

              {/* Calf Media - Only show if milking */}
              {animal.pregnancyStatus === 'milking' && (
                <>
                  <h4 className="text-md font-medium text-gray-700 mt-4">
                    Calf Media
                  </h4>

                  {/* Calf Photo */}
                  {animal.calfPhoto && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Calf Photo</p>
                      <img
                        src={animal.calfPhoto}
                        alt="Calf"
                        className="h-48 w-full object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>
                  )}

                  {/* Calf Video */}
                  {animal.calfVideo && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Calf 360° Video</p>
                      <video
                        controls
                        src={animal.calfVideo}
                        className="rounded-lg w-full border border-gray-200"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </DetailSection>
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                          onChange={handleFileChange}
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
                              {insuranceForm.fileName ||
                                "Click to upload certificate"}
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
                    onClick={handleCancelForm}
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
                    {editingInsuranceId
                      ? "Update Insurance"
                      : "Save Insurance"}
                  </button>
                </div>
              </div>
            </DetailSection>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Medical Insurance
                </h2>
                <button
                  onClick={() => setShowInsuranceForm(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Insurance
                </button>
              </div>

              {insurances.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                      <FileCheck className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      No Insurance Records Found
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Add medical insurance information for this animal
                    </p>
                    <button
                      onClick={() => setShowInsuranceForm(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
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
                            Policy: {insurance.policyNumber} • Issued:{" "}
                            {formatDate(insurance.issueDate)}
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
                        <DetailRow
                          label="Owner Name"
                          value={insurance.ownerName || "N/A"}
                        />
                        <DetailRow
                          label="Animal Name"
                          value={insurance.animalName || "N/A"}
                        />
                        <DetailRow label="Species" value={insurance.species || "N/A"} />
                        <DetailRow
                          label="Animal ID"
                          value={insurance.animalId || "N/A"}
                        />
                        <DetailRow
                          label="Certificate No"
                          value={insurance.certificateNo}
                        />
                        <DetailRow
                          label="Policy Number"
                          value={insurance.policyNumber}
                        />
                        <DetailRow
                          label="Issue Date"
                          value={formatDate(insurance.issueDate)}
                        />
                        <DetailRow
                          label="Certificate File"
                          value={insurance.fileName || "N/A"}
                        />
                      </div>

                      {insurance.medicalInsuranceCertificate && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Certificate Preview:
                          </p>
                          <div className="border rounded-lg p-4 bg-gray-50">
                            {isPDFFile(insurance.fileName) ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                  <File className="text-red-500 text-2xl flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-medium text-base truncate">
                                      {insurance.fileName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      PDF Document
                                    </p>
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
                Delete Insurance Record
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this insurance record? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, id: null })}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInsurance}
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