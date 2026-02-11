// pages/sellers/ViewSeller.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  CreditCard,
  Camera,
  Building,
  FileText,
  Hash,
  CircleDollarSign,
  Calendar,
  CheckCircle
} from "lucide-react";

const SellerDetails = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const location = useLocation();

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  // Mock data matching the registration form fields
  const MOCK_SELLERS = [
    {
      uid: "SEL001",
      // Personal Details
      fullName: "Rajesh Kumar",
      mobile: "9876543210",
      gender: "male",
      profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      aadharNumber: "123456789012",
      
      // Address Details
      address: "123 Main Street, Near City Mall",
      state: "MH",
      district: "Mumbai",
      pincode: "400001",
      village: "Mumbai City",
      
      // Bank Details
      bankName: "State Bank of India",
      accountNumber: "12345678901234",
      ifscCode: "SBIN0001234",
      upiId: "rajesh.kumar@oksbi",
      
      // System fields
      createdAt: "2024-01-15T10:30:00Z",
      status: "Active"
    },
    {
      uid: "SEL002",
      fullName: "Priya Sharma",
      mobile: "8765432109",
      gender: "female",
      profilePhoto: null,
      aadharNumber: "",
      address: "456 Park Avenue, Sector 21",
      state: "DL",
      district: "Delhi",
      pincode: "110001",
      village: "New Delhi",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
      createdAt: "2024-01-20T14:45:00Z",
      status: "Active"
    },
    {
      uid: "SEL003",
      fullName: "Mohan Singh",
      mobile: "7654321098",
      gender: "male",
      profilePhoto: null,
      aadharNumber: "234567890123",
      address: "789 Gandhi Nagar",
      state: "RJ",
      district: "Jaipur",
      pincode: "302001",
      village: "Jaipur",
      bankName: "HDFC Bank",
      accountNumber: "23456789012345",
      ifscCode: "HDFC0001234",
      upiId: "mohan.singh@hdfcbank",
      createdAt: "2024-01-25T09:15:00Z",
      status: "Active"
    }
  ];

  // Load seller data
  useEffect(() => {
    const loadSellerData = async () => {
      setLoading(true);
      
      try {
        // Check if seller data was passed in state
        if (location.state?.seller) {
          setSeller(location.state.seller);
        } else if (uid) {
          await fetchSellerData(uid);
        } else {
          toast.error("No seller ID provided");
          navigate("/sellers");
        }
      } catch (error) {
        console.error("Error loading seller data:", error);
        toast.error("Failed to load seller details");
      } finally {
        setLoading(false);
      }
    };

    loadSellerData();
  }, [uid, location.state, navigate]);

  // Fetch seller data function
  const fetchSellerData = async (uid) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundSeller = MOCK_SELLERS.find(s => s.uid === uid);
      
      if (foundSeller) {
        setSeller(foundSeller);
      } else {
        toast.error("Seller not found");
        navigate("/sellers");
      }
    } catch (error) {
      console.error("Error fetching seller data:", error);
      toast.error("Failed to load seller details");
    }
  };

  // Helper functions
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

  const getGenderDisplay = (gender) => {
    const genders = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other'
    };
    return genders[gender] || gender || "Not provided";
  };

  const getStateDisplay = (stateCode) => {
    const states = {
      'UP': 'Uttar Pradesh',
      'MH': 'Maharashtra',
      'RJ': 'Rajasthan',
      'MP': 'Madhya Pradesh',
      'KA': 'Karnataka',
      'TN': 'Tamil Nadu',
      'GJ': 'Gujarat',
      'AP': 'Andhra Pradesh',
      'WB': 'West Bengal',
      'PB': 'Punjab',
      'DL': 'Delhi'
    };
    return states[stateCode] || stateCode || "Not provided";
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Seller Details...</h3>
          <p className="text-gray-500">Please wait while we fetch the seller information.</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="p-4 bg-blue-100 rounded-full mb-4 inline-block">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Seller Not Found</h3>
          <p className="text-gray-500 mb-6">No seller data found in the system.</p>
          <button
            onClick={() => navigate("/sellers")}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Sellers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50">
      <Toaster position="top-center" />

      {/* Header Section - Only Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/sellers")}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Details</h1>
          <p className="text-gray-600">View complete seller information</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {seller.profilePhoto ? (
                <img
                  src={seller.profilePhoto}
                  alt={seller.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Seller";
                  }}
                />
              ) : (
                <User className="text-gray-400" size={40} />
              )}
            </div>
          </div>

          {/* Seller Basic Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {seller.fullName}
                </h3>
                <p className="text-gray-600 mt-1">
                  Seller ID: {seller.uid} • {seller.status}
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  seller.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {seller.status || "Active"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Phone className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Mobile: <span className="font-medium">{seller.mobile}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Registered: <span className="font-medium">{formatDate(seller.createdAt)}</span>
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
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "personal"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              Personal Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "address"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              Address Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("bank")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "bank"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <CreditCard size={18} />
              Bank Details
            </div>
          </button>
        </nav>
      </div>

      {/* Personal Details Tab */}
      {activeTab === "personal" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <DetailSection title="Personal Information" icon={<User size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Full Name" value={seller.fullName} />
              <DetailRow label="Mobile Number" value={seller.mobile} />
              <DetailRow label="Gender" value={getGenderDisplay(seller.gender)} />
              <DetailRow label="Aadhar Number" value={seller.aadharNumber || "Not provided"} />
            </div>
          </DetailSection>

          {/* Registration Information */}
          <DetailSection title="Registration Information" icon={<Calendar size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Seller ID" value={seller.uid} />
              <DetailRow label="Registration Date" value={formatDate(seller.createdAt)} />
              <DetailRow label="Status" value={seller.status} />
            </div>
          </DetailSection>
        </div>
      )}

      {/* Address Details Tab */}
      {activeTab === "address" && (
        <DetailSection title="Address Details" icon={<MapPin size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailRow label="Complete Address" value={seller.address} fullWidth />
            <DetailRow label="State" value={getStateDisplay(seller.state)} />
            <DetailRow label="District" value={seller.district || "Not provided"} />
            <DetailRow label="PIN Code" value={seller.pincode || "Not provided"} />
            <DetailRow label="Village/Town" value={seller.village || "Not provided"} />
          </div>
        </DetailSection>
      )}

      {/* Bank Details Tab */}
      {activeTab === "bank" && (
        <DetailSection title="Bank Details" icon={<CreditCard size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailRow label="Bank Name" value={seller.bankName || "Not provided"} />
            <DetailRow label="Account Number" value={seller.accountNumber || "Not provided"} />
            <DetailRow label="IFSC Code" value={seller.ifscCode || "Not provided"} />
            <DetailRow label="UPI ID" value={seller.upiId || "Not provided"} />
          </div>
          
          {/* Show if any bank details exist */}
          {(seller.bankName || seller.accountNumber || seller.ifscCode || seller.upiId) ? (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-sm text-green-700">
                  Bank details provided by seller
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  No bank details provided by seller
                </span>
              </div>
            </div>
          )}
        </DetailSection>
      )}
    </div>
  );
};

// Reusable Components - Pure view only, no edit functionality
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
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
      {label}
    </label>
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800 break-words">
      {value || "Not provided"}
    </div>
  </div>
);

export default SellerDetails;