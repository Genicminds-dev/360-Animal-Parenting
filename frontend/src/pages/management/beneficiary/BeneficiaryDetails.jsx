import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
    User, MapPin, Calendar, Phone, Mail, Home, 
    Map, Globe, Hash, ArrowLeft, Eye, Tag,
    FileText, Clock, ChevronDown, Building, Users,
    Activity, HeartPulse, Shield, Download, Printer
} from 'lucide-react';
import { FaVenusMars, FaBirthdayCake, FaRegAddressCard } from 'react-icons/fa';
import { GiCow } from 'react-icons/gi';
import { PATHROUTES } from "../../../routes/pathRoutes";

// Sample handover data for this beneficiary (in real app, this would come from API)
const sampleHandoverData = {
    "BEN-2024-001": [
        {
            uid: "HOV-2024-001",
            handoverOfficerName: "Rajesh Kumar",
            handoverOfficerMobile: "9876543210",
            doNumber: "DO-2024-001",
            animalEarTag: "TAG-0001",
            animalType: "Cow",
            date: "2024-02-10",
            status: "inprogress"
        },
        {
            uid: "HOV-2024-002",
            handoverOfficerName: "Priya Sharma",
            handoverOfficerMobile: "9876543211",
            doNumber: "DO-2024-002",
            animalEarTag: "TAG-0002",
            animalType: "Buffalo",
            date: "2024-02-12",
            status: "completed"
        }
    ],
    "BEN-2024-002": [
        {
            uid: "HOV-2024-003",
            handoverOfficerName: "Amit Patel",
            handoverOfficerMobile: "9876543212",
            doNumber: "DO-2024-003",
            animalEarTag: "TAG-0003",
            animalType: "Cow",
            date: "2024-02-14",
            status: "inprogress"
        }
    ],
    "BEN-2024-003": [
        {
            uid: "HOV-2024-004",
            handoverOfficerName: "Sneha Reddy",
            handoverOfficerMobile: "9876543213",
            doNumber: "DO-2024-004",
            animalEarTag: "TAG-0004",
            animalType: "Buffalo",
            date: "2024-02-18",
            status: "completed"
        },
        {
            uid: "HOV-2024-005",
            handoverOfficerName: "Vikram Singh",
            handoverOfficerMobile: "9876543214",
            doNumber: "DO-2024-005",
            animalEarTag: "TAG-0005",
            animalType: "Cow",
            date: "2024-02-22",
            status: "inprogress"
        }
    ],
    "BEN-2024-004": [
        {
            uid: "HOV-2024-006",
            handoverOfficerName: "Anil Gupta",
            handoverOfficerMobile: "9876543215",
            doNumber: "DO-2024-006",
            animalEarTag: "TAG-0006",
            animalType: "Cow",
            date: "2024-03-01",
            status: "completed"
        }
    ],
    "BEN-2024-005": [
        {
            uid: "HOV-2024-007",
            handoverOfficerName: "Rohit Verma",
            handoverOfficerMobile: "9876543216",
            doNumber: "DO-2024-007",
            animalEarTag: "TAG-0007",
            animalType: "Buffalo",
            date: "2024-03-05",
            status: "inprogress"
        },
        {
            uid: "HOV-2024-008",
            handoverOfficerName: "Neha Singh",
            handoverOfficerMobile: "9876543217",
            doNumber: "DO-2024-008",
            animalEarTag: "TAG-0008",
            animalType: "Cow",
            date: "2024-03-06",
            status: "completed"
        }
    ],
    "BEN-2024-006": [
        {
            uid: "HOV-2024-009",
            handoverOfficerName: "Karan Mehta",
            handoverOfficerMobile: "9876543218",
            doNumber: "DO-2024-009",
            animalEarTag: "TAG-0009",
            animalType: "Cow",
            date: "2024-03-10",
            status: "inprogress"
        }
    ],
    "BEN-2024-007": [
        {
            uid: "HOV-2024-010",
            handoverOfficerName: "Pooja Nair",
            handoverOfficerMobile: "9876543219",
            doNumber: "DO-2024-010",
            animalEarTag: "TAG-0010",
            animalType: "Buffalo",
            date: "2024-03-12",
            status: "completed"
        },
        {
            uid: "HOV-2024-011",
            handoverOfficerName: "Deepak Yadav",
            handoverOfficerMobile: "9876543220",
            doNumber: "DO-2024-011",
            animalEarTag: "TAG-0011",
            animalType: "Cow",
            date: "2024-03-15",
            status: "inprogress"
        }
    ]
};

// Sample animal data for this beneficiary (in real app, this would come from API)
const sampleAnimalData = {
    "BEN-2024-001": [
        {
            earTagId: "TAG-0001",
            breed: "Gir",
            gender: "Female",
            calvingStatus: "milking",
            lactation: "3",
            ageYears: 5,
            ageMonths: 2,
            animalType: "Cow",
            registrationDate: "2024-01-15"
        },
        {
            earTagId: "TAG-0002",
            breed: "Murrah",
            gender: "Female",
            calvingStatus: "pregnant",
            lactation: "2",
            ageYears: 4,
            ageMonths: 0,
            animalType: "Buffalo",
            registrationDate: "2024-01-18"
        }
    ],
    "BEN-2024-002": [
        {
            earTagId: "TAG-0003",
            breed: "Holstein Friesian",
            gender: "Female",
            calvingStatus: "non-pregnant",
            lactation: "1",
            ageYears: 3,
            ageMonths: 6,
            animalType: "Cow",
            registrationDate: "2024-01-20"
        }
    ],
    "BEN-2024-003": [
        {
            earTagId: "TAG-0004",
            breed: "Jersey Cross",
            gender: "Female",
            calvingStatus: "milking",
            lactation: "4",
            ageYears: 7,
            ageMonths: 3,
            animalType: "Cow",
            registrationDate: "2024-01-22"
        },
        {
            earTagId: "TAG-0005",
            breed: "Sahiwal",
            gender: "Female",
            calvingStatus: "pregnant",
            lactation: "0",
            ageYears: 2,
            ageMonths: 8,
            animalType: "Cow",
            registrationDate: "2024-01-25"
        }
    ],
    "BEN-2024-004": [
        {
            earTagId: "TAG-0006",
            breed: "Gir",
            gender: "Female",
            calvingStatus: "milking",
            lactation: "2",
            ageYears: 4,
            ageMonths: 5,
            animalType: "Cow",
            registrationDate: "2024-02-01"
        }
    ],
    "BEN-2024-005": [
        {
            earTagId: "TAG-0007",
            breed: "Murrah",
            gender: "Female",
            calvingStatus: "pregnant",
            lactation: "3",
            ageYears: 6,
            ageMonths: 1,
            animalType: "Buffalo",
            registrationDate: "2024-02-05"
        },
        {
            earTagId: "TAG-0008",
            breed: "Jersey",
            gender: "Female",
            calvingStatus: "milking",
            lactation: "2",
            ageYears: 5,
            ageMonths: 0,
            animalType: "Cow",
            registrationDate: "2024-02-08"
        }
    ],
    "BEN-2024-006": [
        {
            earTagId: "TAG-0009",
            breed: "Sahiwal",
            gender: "Female",
            calvingStatus: "non-pregnant",
            lactation: "1",
            ageYears: 3,
            ageMonths: 9,
            animalType: "Cow",
            registrationDate: "2024-02-12"
        }
    ],
    "BEN-2024-007": [
        {
            earTagId: "TAG-0010",
            breed: "Murrah",
            gender: "Female",
            calvingStatus: "milking",
            lactation: "4",
            ageYears: 7,
            ageMonths: 2,
            animalType: "Buffalo",
            registrationDate: "2024-02-15"
        },
        {
            earTagId: "TAG-0011",
            breed: "Gir",
            gender: "Female",
            calvingStatus: "pregnant",
            lactation: "1",
            ageYears: 3,
            ageMonths: 4,
            animalType: "Cow",
            registrationDate: "2024-02-18"
        }
    ]
};

const BeneficiaryDetails = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const location = useLocation();
    
    const [beneficiary, setBeneficiary] = useState(null);
    const [handovers, setHandovers] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        const loadBeneficiaryData = async () => {
            setLoading(true);
            
            try {
                // Check if beneficiary data was passed via location.state
                if (location.state) {
                    console.log("Beneficiary data from state:", location.state);
                    const beneficiaryData = location.state;
                    setBeneficiary(beneficiaryData);
                    
                    // Fetch handover data for this beneficiary
                    const handoverData = sampleHandoverData[beneficiaryData.uid] || [];
                    setHandovers(handoverData);
                    
                    // Fetch animal data for this beneficiary
                    const animalData = sampleAnimalData[beneficiaryData.uid] || [];
                    setAnimals(animalData);
                } 
                // If no state, try to fetch by UID from params
                else if (uid) {
                    // In a real app, you would make an API call here
                    // For now, we'll show a message
                    toast.error("Beneficiary data not available. Please go back to list and try again.");
                    navigate(PATHROUTES.beneficiaryList);
                } 
                else {
                    toast.error("No beneficiary data found");
                    navigate(PATHROUTES.beneficiaryList);
                }
            } catch (error) {
                console.error("Error loading beneficiary data:", error);
                toast.error("Failed to load beneficiary details");
            } finally {
                setLoading(false);
            }
        };

        loadBeneficiaryData();
    }, [uid, location.state, navigate]);

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        } catch {
            return dateString;
        }
    };

    // Format datetime
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";
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

    // Get status badge
    const getStatusBadge = (status) => {
        switch(status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inprogress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Get calving status badge
    const getCalvingStatusBadge = (status) => {
        switch(status?.toLowerCase()) {
            case 'milking':
                return 'bg-primary-100 text-primary-800 border-primary-200';
            case 'pregnant':
                return 'bg-pink-100 text-pink-800 border-pink-200';
            case 'non-pregnant':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Navigate to handover details
    const navigateToHandoverDetails = (handoverUid) => {
        navigate(`${PATHROUTES.handoverDetails}/${handoverUid}`);
    };

    // Navigate to animal details
    const navigateToAnimalDetails = (earTagId) => {
        navigate(`/management/animals/${earTagId}`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Beneficiary Details...</h3>
                    <p className="text-gray-500">Please wait while we fetch the beneficiary information.</p>
                </div>
            </div>
        );
    }

    if (!beneficiary) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="p-4 bg-primary-100 rounded-full mb-4 inline-block">
                        <User className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Beneficiary Not Found</h3>
                    <p className="text-gray-500 mb-6">No beneficiary data found in the system.</p>
                    <button
                        onClick={() => navigate(PATHROUTES.beneficiaryList)}
                        className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} />
                        Back to Beneficiaries
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
                        onClick={() => navigate(PATHROUTES.beneficiaryList)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Beneficiary Details</h1>
                        <p className="text-gray-600">View complete beneficiary information</p>
                    </div>
                </div>
                
            </div>

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-4 border-white shadow-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary-600">
                                {beneficiary.name?.charAt(0)}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    {beneficiary.name}
                                </h3>
                                <p className="text-gray-600 text-sm font-medium mt-1 flex items-center gap-3 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <User size={16} className="text-gray-400" />
                                        ID: {beneficiary.uid}
                                    </span>
                                </p>
                            </div>
                            
                            <div className="mt-4 md:mt-0">
                                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    Active
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
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                            activeTab === "details"
                                ? "border-primary-600 text-primary-700"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <User size={18} />
                        Beneficiary Details
                    </button>
                    <button
                        onClick={() => setActiveTab("handovers")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                            activeTab === "handovers"
                                ? "border-primary-600 text-primary-700"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <FileText size={18} />
                        Handover Records
                        {handovers.length > 0 && (
                            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">
                                {handovers.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("animals")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                            activeTab === "animals"
                                ? "border-primary-600 text-primary-700"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <GiCow size={18} />
                        Animal Records
                        {animals.length > 0 && (
                            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">
                                {animals.length}
                            </span>
                        )}
                    </button>
                </nav>
            </div>

            {/* Beneficiary Details Tab */}
            {activeTab === "details" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <User className="text-primary-600" size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            <DetailRow 
                                label="Full Name" 
                                value={beneficiary.name} 
                                icon={<User size={16} className="text-gray-400" />}
                            />
                            <DetailRow 
                                label="Gender" 
                                value={beneficiary.gender?.charAt(0).toUpperCase() + beneficiary.gender?.slice(1)} 
                                icon={<FaVenusMars size={16} className="text-gray-400" />}
                            />
                            <DetailRow 
                                label="Date of Birth" 
                                value={beneficiary.dateOfBirth ? `${formatDate(beneficiary.dateOfBirth)} (Age: ${calculateAge(beneficiary.dateOfBirth)} years)` : 'Not provided'}
                                icon={<FaBirthdayCake size={16} className="text-gray-400" />}
                            />
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="text-green-600" size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            <DetailRow 
                                label="Complete Address" 
                                value={beneficiary.address || 'Not provided'} 
                                icon={<Home size={16} className="text-gray-400" />}
                            />
                            <DetailRow 
                                label="City" 
                                value={beneficiary.city || 'Not provided'} 
                                icon={<Map size={16} className="text-gray-400" />}
                            />
                            <DetailRow 
                                label="State" 
                                value={beneficiary.state || 'Not provided'} 
                                icon={<Globe size={16} className="text-gray-400" />}
                            />
                            <DetailRow 
                                label="Pincode" 
                                value={beneficiary.pincode || 'Not provided'} 
                                icon={<Hash size={16} className="text-gray-400" />}
                            />
                        </div>
                    </div>

                    {/* Additional Information (if available) */}
                    {(beneficiary.aadharNumber || beneficiary.panNumber) && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
                            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <FaRegAddressCard className="text-purple-600" size={20} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Identity Documents</h3>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {beneficiary.aadharNumber && (
                                        <DetailRow 
                                            label="Aadhar Number" 
                                            value={beneficiary.aadharNumber} 
                                            icon={<FileText size={16} className="text-gray-400" />}
                                        />
                                    )}
                                    {beneficiary.panNumber && (
                                        <DetailRow 
                                            label="PAN Number" 
                                            value={beneficiary.panNumber} 
                                            icon={<FileText size={16} className="text-gray-400" />}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Handover Records Tab */}
            {activeTab === "handovers" && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Handover Records</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Complete history of handovers for this beneficiary
                                </p>
                            </div>
                        </div>
                    </div>

                    {handovers.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="p-4 bg-primary-100 rounded-full mb-4">
                                    <FileText className="w-12 h-12 text-primary-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-500 mb-2">
                                    No Handover Records Found
                                </h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    This beneficiary hasn't had any handovers yet
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Handover ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Handover Officer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            DO Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Animal Tag
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {handovers.map((handover) => (
                                        <tr key={handover.uid} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {handover.uid}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {handover.handoverOfficerName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {handover.handoverOfficerMobile}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {handover.doNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {handover.animalEarTag}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {handover.animalType}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(handover.date)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(handover.status)}`}>
                                                    {handover.status?.charAt(0).toUpperCase() + handover.status?.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => navigateToHandoverDetails(handover.uid)}
                                                    className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Animal Records Tab */}
            {activeTab === "animals" && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Animal Records</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Animals owned by this beneficiary
                            </p>
                        </div>
                    </div>

                    {animals.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="p-4 bg-primary-100 rounded-full mb-4">
                                    <GiCow className="w-12 h-12 text-primary-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-500 mb-2">
                                    No Animal Records Found
                                </h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    This beneficiary doesn't have any animals yet
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ear Tag ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Breed
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Calving Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Animal Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Age
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {animals.map((animal) => (
                                        <tr key={animal.earTagId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {animal.earTagId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {animal.breed}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {animal.gender}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCalvingStatusBadge(animal.calvingStatus)}`}>
                                                    {animal.calvingStatus?.charAt(0).toUpperCase() + animal.calvingStatus?.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {animal.animalType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {animal.ageYears}Y {animal.ageMonths}M
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => navigateToAnimalDetails(animal.earTagId)}
                                                    className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Reusable DetailRow Component
const DetailRow = ({ label, value, icon }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex-shrink-0 mt-0.5">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {label}
            </p>
            <p className="text-sm font-medium text-gray-900 break-words mt-0.5">
                {value || "Not provided"}
            </p>
        </div>
    </div>
);

export default BeneficiaryDetails;