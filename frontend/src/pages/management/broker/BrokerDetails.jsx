import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Phone,
  Camera,
  FileText,
  Eye,
  File,
  Download,
  Calendar,
  CreditCard
} from "lucide-react";
import { Endpoints } from "../../../services/api/EndPoint";
import { PATHROUTES } from "../../../routes/pathRoutes";
import api, { baseURLFile } from "../../../services/api/api";

const BrokerDetails = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const location = useLocation();

  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [imageError, setImageError] = useState({
    profile: false,
    document: false
  });
  const [documentPreview, setDocumentPreview] = useState(null);

  // Helper function to get full URL for files
  const getFullFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${baseURLFile}${path}`;
  };

  // Load broker data from API
  useEffect(() => {
    const loadBrokerData = async () => {
      setLoading(true);
      
      try {
        // Check if broker data was passed in state (from list page)
        if (location.state?.broker) {
          const brokerData = location.state.broker;
          setBroker(brokerData);
          
          // Set document preview if exists with full URL
          if (brokerData.aadhaarFile) {
            setDocumentPreview(getFullFileUrl(brokerData.aadhaarFile));
          }
        } else if (uid) {
          await fetchBrokerData(uid);
        } else {
          toast.error("No broker ID provided");
          navigate(PATHROUTES.brokerList);
        }
      } catch (error) {
        console.error("Error loading broker data:", error);
        toast.error("Failed to load broker details");
      } finally {
        setLoading(false);
      }
    };

    loadBrokerData();
  }, [uid, location.state, navigate]);

  const fetchBrokerData = async (brokerUid) => {
    try {
      const response = await api.get(Endpoints.GET_BROKER_BY_ID(brokerUid));
      
      if (response.data.success) {
        const brokerData = response.data.data;
        
        // Transform API response to match component's expected format
        const transformedBroker = {
          uid: brokerData.uid,
          fullName: brokerData.name || '',
          mobile: brokerData.phone || '',
          aadharNumber: brokerData.aadhaarNumber || null,
          profilePhoto: getFullFileUrl(brokerData.profileImg),
          aadharDocument: brokerData.aadhaarFile ? {
            fileName: brokerData.aadhaarFile.split('/').pop() || 'Aadhar Document',
            uploadDate: brokerData.createdAt,
            url: getFullFileUrl(brokerData.aadhaarFile)
          } : null,
          createdAt: brokerData.createdAt
        };
        
        setBroker(transformedBroker);
        
        // Set document preview with full URL
        if (brokerData.aadhaarFile) {
          setDocumentPreview(getFullFileUrl(brokerData.aadhaarFile));
        }
      } else {
        toast.error(response.data.message || "Broker not found");
        navigate(PATHROUTES.brokerList);
      }
    } catch (error) {
      console.error("Error fetching broker data:", error);
      toast.error(error?.response?.data?.message || "Failed to load broker details");
      navigate(PATHROUTES.brokerList);
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

  const isPDFFile = (url) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf');
  };

  const isImageFile = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  };

  const handleViewDocument = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleDownloadDocument = (url, fileName) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'aadhar-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageError = (type) => {
    setImageError(prev => ({ ...prev, [type]: true }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Broker Details...</h3>
          <p className="text-gray-500">Please wait while we fetch the broker information.</p>
        </div>
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="p-4 bg-primary-100 rounded-full mb-4 inline-block">
            <User className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Broker Not Found</h3>
          <p className="text-gray-500 mb-6">No broker data found in the system.</p>
          <button
            onClick={() => navigate(PATHROUTES.brokerList)}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Brokers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-r from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(PATHROUTES.brokerList)}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Broker Details</h1>
          <p className="text-gray-600">View complete broker information</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {broker.profilePhoto && !imageError.profile ? (
                <img
                  src={broker.profilePhoto}
                  alt={broker.fullName}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError('profile')}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <User className="text-gray-400" size={40} />
                  <p className="text-xs text-gray-500 mt-1">
                    {broker.profilePhoto ? 'Failed to load' : 'No Photo'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Broker Info */}
          <div className="flex-1">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {broker.fullName}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Broker ID: {broker.uid}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm mt-2">
              <div className="flex items-center gap-2">
                <Phone className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Mobile: <span className="font-medium">{broker.mobile}</span>
                </span>
              </div>

              {broker.aadharNumber && (
                <div className="flex items-center gap-2">
                  <CreditCard className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-600">
                    Aadhar: <span className="font-medium">{broker.aadharNumber}</span>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Registered: <span className="font-medium">{formatDate(broker.createdAt)}</span>
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
              <User size={18} />
              Personal Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "documents"
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              Documents
            </div>
          </button>
        </nav>
      </div>

      {/* Details Tab Content */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <DetailSection title="Personal Information" icon={<User size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Full Name" value={broker.fullName} />
              <DetailRow label="Mobile Number" value={broker.mobile} />
              <DetailRow label="Aadhar Number" value={broker.aadharNumber || "Not provided"} />
            </div>
          </DetailSection>

          {/* Registration Information */}
          <DetailSection title="Registration Information" icon={<Calendar size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Broker ID" value={broker.uid} />
              <DetailRow label="Registration Date" value={formatDate(broker.createdAt)} />
            </div>
          </DetailSection>
        </div>
      )}

      {/* Documents Tab Content */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {broker.aadharDocument ? (
            <DetailSection title="Aadhar Document" icon={<FileText size={20} />}>
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      isPDFFile(broker.aadharDocument.url) 
                        ? "bg-red-100 text-red-600" 
                        : "bg-primary-100 text-primary-600"
                    }`}>
                      {isPDFFile(broker.aadharDocument.url) ? (
                        <File size={20} />
                      ) : (
                        <Camera size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 break-all max-w-xs">
                        {broker.aadharDocument.fileName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {formatDate(broker.aadharDocument.uploadDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                {isImageFile(broker.aadharDocument.url) && documentPreview && !imageError.document && (
                  <div className="mt-4 mb-4 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-2 bg-gray-50 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Document Preview</p>
                    </div>
                    <div className="p-4 flex items-center justify-center bg-gray-50">
                      <img 
                        src={documentPreview} 
                        alt="Aadhar Preview" 
                        className="max-w-full max-h-64 object-contain rounded"
                        onError={() => setImageError(prev => ({ ...prev, document: true }))}
                      />
                    </div>
                  </div>
                )}

                {/* Show error message if image failed to load */}
                {isImageFile(broker.aadharDocument.url) && imageError.document && (
                  <div className="mt-4 text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <Camera className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-sm text-gray-700 font-medium mb-2">
                      Failed to load image preview
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Click view button to open the document
                    </p>
                  </div>
                )}

                {/* PDF Preview Info */}
                {isPDFFile(broker.aadharDocument.url) && (
                  <div className="mt-4 text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <File className="mx-auto text-red-400 mb-3" size={48} />
                    <p className="text-sm text-gray-700 font-medium mb-2">
                      {broker.aadharDocument.fileName}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      This is a PDF document. Click view to open.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDocument(broker.aadharDocument.url)}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Eye size={14} />
                    View Document
                  </button>
                  <button
                    onClick={() => handleDownloadDocument(broker.aadharDocument.url, broker.aadharDocument.fileName)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
            </DetailSection>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-primary-100 rounded-full mb-4">
                  <FileText className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  No Documents Found
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Aadhar document not uploaded for this broker
                </p>
              </div>
            </div>
          )}
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

const DetailRow = ({ label, value }) => (
  <div>
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
      {label}
    </label>
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800 break-words">
      {value || "Not provided"}
    </div>
  </div>
);

export default BrokerDetails;