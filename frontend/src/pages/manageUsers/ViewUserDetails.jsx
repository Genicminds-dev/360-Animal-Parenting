import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaUser,
    FaLock,
    FaCheckCircle,
    FaTimesCircle,
    FaCalendarAlt,
    FaArrowLeft,
    FaHistory,
    FaClock,
    FaBan,
    FaPhone,
    FaEnvelope,
    FaShieldAlt
} from "react-icons/fa";
import { Endpoints } from "../../services/api/EndPoint";
import api, { baseURLFile } from "../../services/api/api";
import { PATHROUTES } from "../../routes/pathRoutes";
import { ArrowLeft } from "lucide-react";


export default function ViewUserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("personal");

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);

                // Direct API call instead of UserService
                const response = await api.get(Endpoints.GET_USER_BY_ID(id));

                if (response.data?.success) {
                    const userData = response.data.data;

                    setUser(userData);
                } else {
                    toast.error(response.data?.message || "User not found!");
                    navigate(PATHROUTES.manageUsers);
                }
            } catch (error) {
                console.error("Error loading user:", error);

                // Detailed error handling
                if (error.response) {
                    // Server responded with error status
                    const errorMessage = error.response.data?.message ||
                        error.response.data?.error ||
                        `Server error: ${error.response.status}`;
                    toast.error(errorMessage);
                    console.error("Error response data:", error.response.data);
                } else if (error.request) {
                    // Request made but no response
                    toast.error("Network error. Please check your connection.");
                    console.error("No response received:", error.request);
                } else {
                    // Other errors
                    toast.error("An error occurred while loading user details");
                    console.error("Error message:", error.message);
                }

                // Navigate back after a short delay to show the error message
                setTimeout(() => {
                    navigate(PATHROUTES.manageUsers);
                }, 2000);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadUser();
        } else {
            toast.error("Invalid user ID");
            navigate(PATHROUTES.manageUsers);
        }
    }, [id, navigate]);

    // Helper functions
    const getFileUrl = (filePath) => {
        if (!filePath) return null;
        return filePath.startsWith("http")
            ? filePath
            : `${baseURLFile}/${filePath}`;
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === "") {
            return "Not provided";
        }
        return value;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not provided";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return dateString;
        }
    };

    const getStatusDisplay = (userData) => {
        let status = "active";

        if (userData?.status) {
            status = userData.status;
        } else if (userData?.isActive === false) {
            status = "inactive";
        } else if (userData?.isActive === true) {
            status = "active";
        }

        const statusMap = {
            active: {
                label: "Active",
                color: "text-green-800",
                bg: "bg-green-100"
            },
            inactive: {
                label: "Inactive",
                color: "text-red-800",
                bg: "bg-red-100"
            },
            suspended: {
                label: "Suspended",
                color: "text-yellow-800",
                bg: "bg-yellow-100"
            },
            pending: {
                label: "Pending",
                color: "text-blue-800",
                bg: "bg-blue-100"
            },
            blocked: {
                label: "Blocked",
                color: "text-red-800",
                bg: "bg-red-200"
            },
        };

        return statusMap[status] || {
            label: "Unknown",
            color: "text-gray-800",
            bg: "bg-gray-100"
        };
    };

    const getRoleDisplay = (userData) => {
        if (userData.roleId === 1 || userData.Role?.name === "Super Admin") {
            return { name: "Super Admin", level: "Full System Access", color: "text-purple-800", bg: "bg-purple-100" };
        } else if (userData.roleId === 2 || userData.Role?.name === "Admin") {
            return { name: "Admin", level: "Admin Access", color: "text-blue-800", bg: "bg-blue-100" };
        } else if (userData.roleId === 3 || userData.Role?.name === "Manager") {
            return { name: "Manager", level: "Limited Access", color: "text-green-800", bg: "bg-green-100" };
        } else {
            return { name: "Standard User", level: "Restricted Access", color: "text-gray-800", bg: "bg-gray-100" };
        }
    };

    const getDaysActive = () => {
        if (!user?.createdAt) return 0;
        const created = new Date(user.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Loading User Details...</h3>
                    <p className="text-gray-500">Please wait while we fetch the user information.</p>
                </div>
            </div>
        );
    }

    // User not found state
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="p-4 bg-blue-100 rounded-full mb-4 inline-block">
                        <FaUser className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">User Not Found</h3>
                    <p className="text-gray-500 mb-6">The requested user could not be found.</p>
                    <button
                        onClick={() => navigate(PATHROUTES.manageUsers)}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                    >
                        <FaArrowLeft size={16} />
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    const statusDisplay = getStatusDisplay(user);
    const roleDisplay = getRoleDisplay(user);
    const daysActive = getDaysActive();

    return (
        <div className="space-y-6 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            {/* Header Section - Only Back Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(PATHROUTES.manageUsers)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                        <p className="text-gray-600">View complete user information</p>
                    </div>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex md:flex-row items-start md:items-center gap-6">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                            {user.profileImg ? (
                                <img
                                    src={getFileUrl(user.profileImg)}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/150?text=User";
                                    }}
                                />
                            ) : user.profilePicture ? (
                                <img
                                    src={getFileUrl(user.profilePicture)}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/150?text=User";
                                    }}
                                />
                            ) : (
                                <FaUser className="text-gray-400" size={40} />
                            )}
                        </div>
                    </div>

                    {/* User Basic Info */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            {/* Left Section */}
                            <div className="min-w-0">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                                    {user.firstName} {user.lastName}
                                </h3>

                                <p className="text-gray-600 mt-1 flex items-center gap-2">
                                    <FaShieldAlt className="text-gray-400 shrink-0" size={16} />
                                    <span className="text-sm">
                                        Role: <span className="font-medium text-gray-800">{roleDisplay.name}</span>
                                    </span>
                                </p>
                            </div>

                            {/* Right Section */}
                            <div className="flex flex-col items-start md:items-end gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${statusDisplay.bg} ${statusDisplay.color}`}
                                >
                                    {statusDisplay.label}
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
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "personal"
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <FaUser size={18} />
                            Personal Details
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("role")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "role"
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <FaLock size={18} />
                            Role & Permissions
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("activity")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "activity"
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <FaHistory size={18} />
                            Activity Timeline
                        </div>
                    </button>
                </nav>
            </div>

            {/* Personal Details Tab */}
            {activeTab === "personal" && (
                <div className="grid grid-cols-1 gap-6">
                    {/* Personal Information - Two Column Layout */}
                    <DetailSection title="Personal Information" icon={<FaUser size={20} />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailRow label="First Name" value={formatValue(user.firstName)} />
                            <DetailRow label="Last Name" value={formatValue(user.lastName)} />
                            {user.username && <DetailRow label="Username" value={formatValue(user.username)} />}
                            <DetailRow label="Email Address" value={formatValue(user.email)} />
                            {user.mobile && <DetailRow label="Mobile Number" value={formatValue(user.mobile)} />}
                            {user.phone && !user.mobile && <DetailRow label="Phone Number" value={formatValue(user.phone)} />}
                            {!user.mobile && !user.phone && <DetailRow label="Phone Number" value="Not provided" />}
                        </div>
                    </DetailSection>
                </div>
            )}

            {/* Role & Permissions Tab */}
            {activeTab === "role" && (
                <DetailSection title="Role & Permissions" icon={<FaLock size={20} />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailRow label="Role Name" value={roleDisplay.name} />
                        <DetailRow label="Access Level" value={roleDisplay.level} />
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FaShieldAlt className="text-blue-600" size={20} />
                            <span className="text-sm text-blue-700">
                                This user has {roleDisplay.level.toLowerCase()} privileges in the system
                            </span>
                        </div>
                    </div>
                </DetailSection>
            )}

            {/* Activity Timeline Tab */}
            {activeTab === "activity" && (
                <DetailSection title="Activity Timeline" icon={<FaHistory size={20} />}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-600" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Account Created</p>
                                    <p className="text-xs text-gray-500">When this user was added to the system</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-800">{formatDate(user.createdAt)}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-blue-600" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Last Updated</p>
                                    <p className="text-xs text-gray-500">When this user's information was last modified</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-800">{formatDate(user.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </DetailSection>
            )}
        </div>
    );
}

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