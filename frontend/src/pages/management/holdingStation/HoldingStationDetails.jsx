// pages/holding-station/HoldingStationDetails.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
    ArrowLeft,
    Building2,
    MapPin,
    Calendar,
    Image as ImageIcon,
    Video,
    Eye,
    Home,
    Camera,
    X,
    Phone,
    Mail,
    User,
    Clock,
    Info
} from "lucide-react";
import { PATHROUTES } from "../../../routes/pathRoutes";

const HoldingStationDetails = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const location = useLocation();

    const [station, setStation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mediaError, setMediaError] = useState({
        photo: false,
        video: false
    });
    const [mediaPreview, setMediaPreview] = useState(null);
    const [previewType, setPreviewType] = useState(null);

    // Load station data from location state
    useEffect(() => {
        const loadStationData = async () => {
            setLoading(true);

            try {
                // Check if station data was passed in state (from list page)
                // Try both 'stationData' and 'station' for backward compatibility
                const stationData = location.state?.stationData || location.state?.station;

                if (stationData) {
                    console.log("Loading station data:", stationData);
                    setStation(stationData);

                    // Don't automatically set media preview
                    setMediaPreview(null);
                    setPreviewType(null);
                } else {
                    // If no data in state, try to fetch from API using the uid
                    console.error("No station data provided in state");
                    toast.error("No station data provided");
                    // Optionally, you could navigate back after a delay
                    setTimeout(() => {
                        navigate(PATHROUTES.holdingStationList);
                    }, 2000);
                }
            } catch (error) {
                console.error("Error loading station data:", error);
                toast.error("Failed to load station details");
            } finally {
                setLoading(false);
            }
        };

        loadStationData();
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
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return dateString;
        }
    };

    const handleMediaError = (type) => {
        setMediaError(prev => ({ ...prev, [type]: true }));
    };

    const handleViewMedia = (type, url) => {
        if (url) {
            setMediaPreview(url);
            setPreviewType(type);
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }
    };

    const handleClosePreview = () => {
        setMediaPreview(null);
        setPreviewType(null);
        // Restore body scrolling
        document.body.style.overflow = 'unset';
    };

    const handleGoBack = () => {
        navigate(PATHROUTES.holdingStationList);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Station Details...</h3>
                    <p className="text-gray-500">Please wait while we fetch the holding station information.</p>
                </div>
            </div>
        );
    }

    if (!station) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="p-4 bg-primary-100 rounded-full mb-4 inline-block">
                        <Building2 className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Station Not Found</h3>
                    <p className="text-gray-500 mb-6">No holding station data found in the system.</p>
                    <button
                        onClick={handleGoBack}
                        className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} />
                        Back to Holding Stations
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleGoBack}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Go back to list"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Holding Station Details</h1>
                        <p className="text-gray-600">View complete holding station information</p>
                    </div>
                </div>

                {/* Station Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Station Icon/Image - Fixed size thumbnail */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                {station.photoUrl && !mediaError.photo ? (
                                    <img
                                        src={station.photoUrl}
                                        alt={station.name}
                                        className="w-full h-full object-cover"
                                        onError={() => handleMediaError('photo')}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <Building2 className="text-primary-600 w-8 h-8 md:w-10 md:h-10" />
                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                            {station.photoUrl ? 'No Image' : 'No Photo'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Station Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {station.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Station ID: {station.uid || station.id}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm mt-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-gray-400" size={16} />
                                    <span className="text-sm text-gray-600">
                                        Location: <span className="font-medium">{station.city}, {station.state} - {station.pinCode}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="text-gray-400" size={16} />
                                    <span className="text-sm text-gray-600">
                                        Created: <span className="font-medium">{formatDate(station.createdAt)}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Single Tab Content - All Details */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    {/* Station Details Section */}
                    <div className="space-y-8">
                        {/* Basic Information */}
                        <DetailSection title="Basic Information" icon={<Building2 size={20} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailRow label="Station ID" value={station.uid || station.id} />
                                <DetailRow label="Station Name" value={station.name} />
                                <DetailRow label="Created Date" value={formatDate(station.createdAt)} />
                                {station.updatedAt && (
                                    <DetailRow label="Last Updated" value={formatDate(station.updatedAt)} />
                                )}
                            </div>
                        </DetailSection>

                        {/* Address Information */}
                        <DetailSection title="Address Information" icon={<MapPin size={20} />}>
                            <div className="space-y-6">
                                <DetailRow label="Full Address" value={station.address || "No address provided"} />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <DetailRow label="State" value={station.state} />
                                    <DetailRow label="City" value={station.city} />
                                    <DetailRow label="PIN Code" value={station.pinCode} />
                                </div>
                            </div>
                        </DetailSection>

                        {/* Media Gallery */}
                        {(station.hasPhoto || station.hasVideo) && (
                            <DetailSection title="Media Gallery" icon={<ImageIcon size={20} />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Photo Section */}
                                    {station.hasPhoto && station.photoUrl && !mediaError.photo && (
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                                                    <ImageIcon size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Station Photograph</p>
                                                    <p className="text-xs text-gray-500">
                                                        Uploaded on: {formatDate(station.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Image Preview */}
                                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-3">
                                                <div className="flex items-center justify-center p-2" style={{ height: '200px' }}>
                                                    <img
                                                        src={station.photoUrl}
                                                        alt={station.name}
                                                        className="max-w-full max-h-[180px] w-auto h-auto object-contain rounded cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => handleViewMedia('photo', station.photoUrl)}
                                                        onError={() => handleMediaError('photo')}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleViewMedia('photo', station.photoUrl)}
                                                className="w-full px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center justify-center gap-2"
                                            >
                                                <Eye size={14} />
                                                View Full Screen
                                            </button>
                                        </div>
                                    )}

                                    {/* Video Section */}
                                    {station.hasVideo && station.videoUrl && !mediaError.video && (
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-red-100 text-red-600">
                                                    <Video size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Station Video Tour</p>
                                                    <p className="text-xs text-gray-500">
                                                        Uploaded on: {formatDate(station.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Video Preview */}
                                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-3">
                                                <div className="flex items-center justify-center p-2" style={{ height: '200px' }}>
                                                    <video
                                                        src={station.videoUrl}
                                                        controls
                                                        className="max-w-full max-h-[180px] w-auto h-auto rounded"
                                                        onError={() => handleMediaError('video')}
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleViewMedia('video', station.videoUrl)}
                                                className="w-full px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center justify-center gap-2"
                                            >
                                                <Eye size={14} />
                                                Watch Video
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </DetailSection>
                        )}

                        {/* Additional Information (if available) */}
                        {(station.contactPerson || station.contactNumber || station.email || station.description) && (
                            <DetailSection title="Additional Information" icon={<Info size={20} />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {station.contactPerson && (
                                        <DetailRow label="Contact Person" value={station.contactPerson} />
                                    )}
                                    {station.contactNumber && (
                                        <DetailRow label="Contact Number" value={station.contactNumber} />
                                    )}
                                    {station.email && (
                                        <DetailRow label="Email" value={station.email} />
                                    )}
                                    {station.description && (
                                        <div className="md:col-span-2">
                                            <DetailRow label="Description" value={station.description} />
                                        </div>
                                    )}
                                </div>
                            </DetailSection>
                        )}

                        {/* System Information */}
                        <DetailSection title="System Information" icon={<Clock size={20} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailRow label="Created At" value={formatDate(station.createdAt)} />
                                <DetailRow label="Last Updated" value={formatDate(station.updatedAt || station.createdAt)} />
                                {station.createdBy && (
                                    <DetailRow label="Created By" value={station.createdBy} />
                                )}
                                {station.updatedBy && (
                                    <DetailRow label="Updated By" value={station.updatedBy} />
                                )}
                            </div>
                        </DetailSection>
                    </div>
                </div>
            </div>

            {/* Media Preview Modal - Full screen view */}
            {mediaPreview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-95"
                    style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    onClick={handleClosePreview}
                >
                    <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        {/* Close button */}
                        <button
                            onClick={handleClosePreview}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 bg-black bg-opacity-50 rounded-full z-10"
                        >
                            <X size={24} />
                        </button>

                        {/* Media content */}
                        <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                            {previewType === 'photo' ? (
                                <img
                                    src={mediaPreview}
                                    alt={station?.name}
                                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                                />
                            ) : (
                                <video
                                    src={mediaPreview}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[90vh] w-auto h-auto"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Reusable Components
const DetailSection = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
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

export default HoldingStationDetails;