// pages/agents/ViewAgent.jsx
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
import { PATHROUTES } from "../../../routes/pathRoutes";

const AgentDetails = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const location = useLocation();

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  // Mock agent data matching ONLY the registration form fields
  const MOCK_AGENTS = [
    {
      uid: "CA0001",
      fullName: "Rajesh Kumar",
      mobile: "9876543210",
      aadharNumber: "123456789012",
      profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      aadharDocument: {
        fileType: "pdf",
        fileName: "Aadhaar_Rajesh_Kumar.pdf",
        fileSize: "2.4 MB",
        uploadDate: "2024-01-15T10:30:00Z",
        url: "/dummy-aadhar.pdf"
      },
      createdAt: "2024-01-15T10:30:00Z",
      status: "Active"
    },
    {
      uid: "CA0002",
      fullName: "Priya Sharma",
      mobile: "8765432109",
      aadharNumber: "",
      profilePhoto: null,
      aadharDocument: null,
      createdAt: "2024-01-20T14:45:00Z",
      status: "Active"
    }
  ];

  // Load agent data
  useEffect(() => {
    const loadAgentData = async () => {
      setLoading(true);
      
      try {
        // Check if agent data was passed in state
        if (location.state?.agent) {
          setAgent(location.state.agent);
        } else if (uid) {
          await fetchAgentData(uid);
        } else {
          toast.error("No agent ID provided");
          navigate("/agents");
        }
      } catch (error) {
        console.error("Error loading agent data:", error);
        toast.error("Failed to load agent details");
      } finally {
        setLoading(false);
      }
    };

    loadAgentData();
  }, [uid, location.state, navigate]);

  // Fetch agent data function
  const fetchAgentData = async (uid) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundAgent = MOCK_AGENTS.find(a => a.uid === uid);
      
      if (foundAgent) {
        setAgent(foundAgent);
      } else {
        toast.error("Agent not found");
        navigate("/agents");
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
      toast.error("Failed to load agent details");
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

  const isPDFFile = (fileName) => {
    return fileName?.toLowerCase().endsWith(".pdf");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Agent Details...</h3>
          <p className="text-gray-500">Please wait while we fetch the agent information.</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="p-4 bg-blue-100 rounded-full mb-4 inline-block">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Agent Not Found</h3>
          <p className="text-gray-500 mb-6">No agent data found in the system.</p>
          <button
            onClick={() => navigate("/agents")}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Agents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50">
      <Toaster position="top-center" />

      {/* Header Section - SIMPLIFIED */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(PATHROUTES.agentsList)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Details</h1>
          <p className="text-gray-600">View complete agent information</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {agent.profilePhoto ? (
                <img
                  src={agent.profilePhoto}
                  alt={agent.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Agent";
                  }}
                />
              ) : (
                <User className="text-gray-400" size={40} />
              )}
            </div>
          </div>

          {/* Agent Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {agent.fullName}
                </h3>
                <p className="text-gray-600 mt-1">
                  Agent ID: {agent.uid} • {agent.status}
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  agent.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {agent.status || "Active"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Phone className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Mobile: <span className="font-medium">{agent.mobile}</span>
                </span>
              </div>

              {agent.aadharNumber && (
                <div className="flex items-center gap-2">
                  <CreditCard className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-600">
                    Aadhar: <span className="font-medium">{agent.aadharNumber}</span>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Registered: <span className="font-medium">{formatDate(agent.createdAt)}</span>
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
              <User size={18} />
              Personal Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "documents"
                ? "border-blue-600 text-blue-700"
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

      {/* Details Tab Content - SIMPLIFIED without edit buttons */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <DetailSection title="Personal Information" icon={<User size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Full Name" value={agent.fullName} />
              <DetailRow label="Mobile Number" value={agent.mobile} />
              <DetailRow label="Aadhar Number" value={agent.aadharNumber || "Not provided"} />
            </div>
          </DetailSection>

          {/* Registration Information */}
          <DetailSection title="Registration Information" icon={<Calendar size={20} />}>
            <div className="space-y-4">
              <DetailRow label="Agent ID" value={agent.uid} />
              <DetailRow label="Registration Date" value={formatDate(agent.createdAt)} />
              <DetailRow label="Status" value={agent.status} />
            </div>
          </DetailSection>
        </div>
      )}

      {/* Documents Tab Content */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {agent.aadharDocument ? (
            <DetailSection title="Aadhar Document" icon={<FileText size={20} />}>
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      agent.aadharDocument.fileType === "pdf" 
                        ? "bg-red-100 text-red-600" 
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {agent.aadharDocument.fileType === "pdf" ? (
                        <File size={20} />
                      ) : (
                        <Camera size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {agent.aadharDocument.fileName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {formatDate(agent.aadharDocument.uploadDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => window.open(agent.aadharDocument.url, '_blank')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Eye size={14} />
                    View Document
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = agent.aadharDocument.url;
                      link.download = agent.aadharDocument.fileName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
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
                <div className="p-4 bg-blue-100 rounded-full mb-4">
                  <FileText className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  No Documents Found
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Aadhar document not uploaded for this agent
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Reusable Components - SIMPLIFIED
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

export default AgentDetails;