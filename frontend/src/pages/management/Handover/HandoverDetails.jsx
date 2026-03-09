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
  Clock,
  Tag,
  Image,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader
} from "lucide-react";
import { PATHROUTES } from "../../../routes/pathRoutes";

// Sample handover data for demonstration
const sampleHandoverData = {
  "HOV-2024-001": {
    uid: "HOV-2024-001",
    handoverOfficerId: "1",
    handoverOfficerName: "Rajesh Kumar",
    handoverOfficerMobile: "9876543210",
    beneficiaryId: "BEN-2024-001",
    beneficiaryName: "Sunita Devi",
    doNumber: "DO-2024-001",
    animalEarTagId: "TAG-0001",
    animalEarTag: "TAG-0001",
    animalType: "Cow",
    animalBreed: "Gir",
    date: "2024-03-15",
    time: "10:30",
    status: "inprogress",
    location: "Village Ramgarh, District Jaipur",
    image: "/sample/handover-image-1.jpg",
    video: "/sample/handover-video-1.mp4",
    finalHandoverDocument: "/sample/handover-doc-1.pdf",
    remarks: "Animal health check completed. Vaccination given.",
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:00Z"
  },
  "HOV-2024-002": {
    uid: "HOV-2024-002",
    handoverOfficerId: "2",
    handoverOfficerName: "Priya Sharma",
    handoverOfficerMobile: "9876543211",
    beneficiaryId: "BEN-2024-002",
    beneficiaryName: "Ramesh Kumar",
    doNumber: "DO-2024-002",
    animalEarTagId: "TAG-0002",
    animalEarTag: "TAG-0002",
    animalType: "Buffalo",
    animalBreed: "Murrah",
    date: "2024-03-16",
    time: "11:45",
    status: "completed",
    location: "Village Sanganer, District Jaipur",
    image: "/sample/handover-image-2.jpg",
    video: "/sample/handover-video-2.mp4",
    finalHandoverDocument: "/sample/handover-doc-2.pdf",
    remarks: "Successfully handed over. All documents signed.",
    createdAt: "2024-03-16T11:45:00Z",
    updatedAt: "2024-03-16T14:30:00Z"
  },
  "HOV-2024-003": {
    uid: "HOV-2024-003",
    handoverOfficerId: "3",
    handoverOfficerName: "Amit Patel",
    handoverOfficerMobile: "9876543212",
    beneficiaryId: "BEN-2024-003",
    beneficiaryName: "Lakshmi Bai",
    doNumber: "DO-2024-003",
    animalEarTagId: "TAG-0003",
    animalEarTag: "TAG-0003",
    animalType: "Cow",
    animalBreed: "Tharparkar",
    date: "2024-03-17",
    time: "09:15",
    status: "pending",
    location: "Village Chomu, District Jaipur",
    image: null,
    video: null,
    finalHandoverDocument: null,
    remarks: "Awaiting beneficiary signature.",
    createdAt: "2024-03-17T09:15:00Z",
    updatedAt: "2024-03-17T09:15:00Z"
  }
};

const HandoverDetails = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const location = useLocation();

  const [handover, setHandover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [mediaError, setMediaError] = useState({
    image: false,
    video: false,
    document: false
  });

  // Load handover data
  useEffect(() => {
    const loadHandoverData = async () => {
      setLoading(true);
      
      try {
        // Check if handover data was passed in state (from list page)
        if (location.state) {
          const handoverData = location.state;
          setHandover(handoverData);
        } else if (uid) {
          // Simulate API call with sample data
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (sampleHandoverData[uid]) {
            setHandover(sampleHandoverData[uid]);
          } else {
            toast.error("Handover record not found");
            navigate(PATHROUTES.handoverList);
          }
        } else {
          toast.error("No handover ID provided");
          navigate(PATHROUTES.handoverList);
        }
      } catch (error) {
        console.error("Error loading handover data:", error);
        toast.error("Failed to load handover details");
      } finally {
        setLoading(false);
      }
    };

    loadHandoverData();
  }, [uid, location.state, navigate]);

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

  const formatTime = (timeString) => {
    if (!timeString) return "Not provided";
    try {
      // If time is in HH:MM format
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not provided";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return dateTimeString;
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800',
          icon: <CheckCircle size={16} className="text-green-600 dark:text-green-400" />,
          label: 'Completed'
        };
      case 'inprogress':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800',
          icon: <Loader size={16} className="text-blue-600 dark:text-blue-400" />,
          label: 'In Progress'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-800 dark:text-yellow-300',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400" />,
          label: 'Pending'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800',
          icon: <XCircle size={16} className="text-red-600 dark:text-red-400" />,
          label: 'Cancelled'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-800 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-600',
          icon: <AlertCircle size={16} className="text-gray-600 dark:text-gray-400" />,
          label: status || 'Unknown'
        };
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

  const isVideoFile = (url) => {
    if (!url) return false;
    return /\.(mp4|mov|avi|mkv)$/i.test(url);
  };

  const handleViewMedia = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleDownloadMedia = (url, fileName) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'handover-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleMediaError = (type) => {
    setMediaError(prev => ({ ...prev, [type]: true }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">Loading Handover Details...</h3>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the handover information.</p>
        </div>
      </div>
    );
  }

  if (!handover) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30">
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 inline-block">
            <FileText className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">Handover Record Not Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">No handover record found with the provided ID.</p>
          <button
            onClick={() => navigate(PATHROUTES.handoverList)}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Handover List
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(handover.status);

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(PATHROUTES.handoverList)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Handover Details</h1>
            <p className="text-gray-600 dark:text-gray-400">View complete handover information</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border}`}>
          {statusBadge.icon}
          <span className="text-sm font-medium">{statusBadge.label}</span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 p-6 transition-colors duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 border-4 border-white dark:border-gray-700 shadow-lg flex items-center justify-center">
              <FileText className="text-primary-600 dark:text-primary-400" size={40} />
            </div>
          </div>

          {/* Handover Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Handover ID: {handover.uid}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <User className="text-gray-400 dark:text-gray-500" size={16} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Officer: <span className="font-medium dark:text-gray-300">{handover.handoverOfficerName}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="text-gray-400 dark:text-gray-500" size={16} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Beneficiary: <span className="font-medium dark:text-gray-300">{handover.beneficiaryId}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400 dark:text-gray-500" size={16} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Date: <span className="font-medium dark:text-gray-300">{formatDate(handover.date)}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="text-gray-400 dark:text-gray-500" size={16} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Time: <span className="font-medium dark:text-gray-300">{formatTime(handover.time)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "details"
                ? "border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              Handover Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("beneficiary")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "beneficiary"
                ? "border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              Beneficiary Info
            </div>
          </button>
          <button
            onClick={() => setActiveTab("animal")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "animal"
                ? "border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <Tag size={18} />
              Animal Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "media"
                ? "border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <Camera size={18} />
              Media Files
            </div>
          </button>
        </nav>
      </div>

      {/* Details Tab Content */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Handover Information */}
          <DetailSection title="Handover Information" icon={<FileText size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Handover ID" value={handover.uid} />
              <DetailRow label="DO Number" value={handover.doNumber} />
              <DetailRow label="Handover Date" value={formatDate(handover.date)} />
              <DetailRow label="Handover Time" value={formatTime(handover.time)} />
              <DetailRow label="Status" value={statusBadge.label} />
            </div>
          </DetailSection>

          {/* Handover Officer Information */}
          <DetailSection title="Handover Officer" icon={<User size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Officer Name" value={handover.handoverOfficerName} />
              <DetailRow label="Mobile Number" value={handover.handoverOfficerMobile} />
            </div>
          </DetailSection>
        </div>
      )}

      {/* Beneficiary Tab Content */}
      {activeTab === "beneficiary" && (
        <div className="grid grid-cols-1 gap-6">
          <DetailSection title="Beneficiary Information" icon={<User size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Beneficiary ID" value={handover.beneficiaryId} />
              <DetailRow label="Beneficiary Name" value={handover.beneficiaryName || "Not provided"} />
              <DetailRow label="Location" value={handover.location || "Not provided"} />
            </div>
          </DetailSection>
        </div>
      )}

      {/* Animal Tab Content */}
      {activeTab === "animal" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailSection title="Animal Details" icon={<Tag size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Ear Tag ID" value={handover.animalEarTag} />
              <DetailRow label="Animal Type" value={handover.animalType || "Not provided"} />
              <DetailRow label="Animal Breed" value={handover.animalBreed || "Not provided"} />
            </div>
          </DetailSection>
        </div>
      )}

      {/* Media Tab Content */}
      {activeTab === "media" && (
        <div className="space-y-6">
          {/* Image Section */}
          {handover.image ? (
            <DetailSection title="Handover Image" icon={<Image size={20} />}>
              <MediaFileDisplay
                file={{ url: handover.image, type: 'image' }}
                fileName={`handover-image-${handover.uid}.jpg`}
                mediaError={mediaError.image}
                onView={handleViewMedia}
                onDownload={handleDownloadMedia}
                onError={() => handleMediaError('image')}
              />
            </DetailSection>
          ) : (
            <EmptyMediaSection title="Handover Image" icon={<Image size={20} />} />
          )}

          {/* Video Section */}
          {handover.video ? (
            <DetailSection title="Handover Video" icon={<Video size={20} />}>
              <MediaFileDisplay
                file={{ url: handover.video, type: 'video' }}
                fileName={`handover-video-${handover.uid}.mp4`}
                mediaError={mediaError.video}
                onView={handleViewMedia}
                onDownload={handleDownloadMedia}
                onError={() => handleMediaError('video')}
              />
            </DetailSection>
          ) : (
            <EmptyMediaSection title="Handover Video" icon={<Video size={20} />} />
          )}

          {/* Final Handover Document */}
          {handover.finalHandoverDocument ? (
            <DetailSection title="Final Handover Document" icon={<FileText size={20} />}>
              <MediaFileDisplay
                file={{ url: handover.finalHandoverDocument, type: 'document' }}
                fileName={`handover-document-${handover.uid}.pdf`}
                mediaError={mediaError.document}
                onView={handleViewMedia}
                onDownload={handleDownloadMedia}
                onError={() => handleMediaError('document')}
              />
            </DetailSection>
          ) : (
            <EmptyMediaSection title="Final Handover Document" icon={<FileText size={20} />} />
          )}
        </div>
      )}
      
      <Toaster 
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
        }}
      />
    </div>
  );
};

// Reusable Components
const DetailSection = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 overflow-hidden transition-colors duration-300">
    <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
          <span className="text-primary-600 dark:text-primary-400">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div>
    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
      {label}
    </label>
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 break-words">
      {value || "Not provided"}
    </div>
  </div>
);

const MediaFileDisplay = ({ file, fileName, mediaError, onView, onDownload, onError }) => {
  const isPDF = file.url.toLowerCase().includes('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file.url);
  const isVideo = /\.(mp4|mov|avi|mkv)$/i.test(file.url);

  const getIcon = () => {
    if (isPDF) return <File size={20} />;
    if (isVideo) return <Video size={20} />;
    return <Image size={20} />;
  };

  const getIconBg = () => {
    if (isPDF) return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    if (isVideo) return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
    return "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400";
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${getIconBg()}`}>
            {getIcon()}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white break-all max-w-xs">
              {fileName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isPDF ? 'PDF Document' : isVideo ? 'Video File' : 'Image File'}
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      {isImage && file.url && !mediaError && (
        <div className="mt-4 mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</p>
          </div>
          <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <img 
              src={file.url} 
              alt="Preview" 
              className="max-w-full max-h-64 object-contain rounded"
              onError={onError}
            />
          </div>
        </div>
      )}

      {/* Video Preview */}
      {isVideo && file.url && (
        <div className="mt-4 mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</p>
          </div>
          <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <video 
              src={file.url} 
              controls 
              className="max-w-full max-h-64 rounded"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {mediaError && (
        <div className="mt-4 text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          {isPDF ? (
            <File className="mx-auto text-red-400 dark:text-red-500 mb-3" size={48} />
          ) : isVideo ? (
            <Video className="mx-auto text-purple-400 dark:text-purple-500 mb-3" size={48} />
          ) : (
            <Image className="mx-auto text-gray-400 dark:text-gray-500 mb-3" size={48} />
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
            Failed to load preview
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Click view button to open the file
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onView(file.url)}
          className="flex-1 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Eye size={14} />
          View
        </button>
        <button
          onClick={() => onDownload(file.url, fileName)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Download size={14} />
          Download
        </button>
      </div>
    </div>
  );
};

const EmptyMediaSection = ({ title, icon }) => (
  <DetailSection title={title} icon={icon}>
    <div className="text-center p-8">
      <div className="flex flex-col items-center justify-center">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
          <span className="text-gray-500 dark:text-gray-400">{icon}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No file uploaded
        </p>
      </div>
    </div>
  </DetailSection>
);

export default HandoverDetails;