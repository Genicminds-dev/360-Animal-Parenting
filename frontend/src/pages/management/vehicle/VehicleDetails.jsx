import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
    ArrowLeft,
    Truck,
    User,
    Users,
    Phone,
    IdCard,
    CreditCard,
    Calendar,
    Image as ImageIcon,
    Video,
    Eye,
    X,
    File,
    MapPin,
    Building2,
    Clock,
    Info
} from "lucide-react";
import { PATHROUTES } from "../../../routes/pathRoutes";

const VehicleDetails = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const location = useLocation();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mediaError, setMediaError] = useState({});
    const [mediaPreview, setMediaPreview] = useState(null);
    const [previewType, setPreviewType] = useState(null);

    // Load vehicle data from location state
    useEffect(() => {
        const loadVehicleData = async () => {
            setLoading(true);

            try {
                const vehicleData = location.state?.vehicleData || location.state?.vehicle;

                if (vehicleData) {
                    console.log("Loading vehicle data:", vehicleData);
                    setVehicle(vehicleData);
                    setMediaPreview(null);
                    setPreviewType(null);
                } else {
                    console.error("No vehicle data provided in state");
                    toast.error("No vehicle data provided");
                    setTimeout(() => {
                        navigate(PATHROUTES.vehiclesList);
                    }, 2000);
                }
            } catch (error) {
                console.error("Error loading vehicle data:", error);
                toast.error("Failed to load vehicle details");
            } finally {
                setLoading(false);
            }
        };

        loadVehicleData();
    }, [uid, location.state, navigate]);

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

    const formatAadhar = (aadhar) => {
        if (!aadhar) return "Not provided";
        // Format: XXXX XXXX XXXX
        return aadhar.replace(/(\d{4})/g, '$1 ').trim();
    };

    const formatMobile = (mobile) => {
        if (!mobile) return "Not provided";
        // Format: XXXXX-XXXXX
        return mobile.replace(/(\d{5})(\d{5})/, '$1-$2');
    };

    const handleMediaError = (type) => {
        setMediaError(prev => ({ ...prev, [type]: true }));
    };

    const handleViewMedia = (type, url) => {
        if (url) {
            setMediaPreview(url);
            setPreviewType(type);
            document.body.style.overflow = 'hidden';
        }
    };

    const handleClosePreview = () => {
        setMediaPreview(null);
        setPreviewType(null);
        document.body.style.overflow = 'unset';
    };

    const handleGoBack = () => {
        navigate(PATHROUTES.vehiclesList);
    };

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
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Vehicle Details...</h3>
                    <p className="text-gray-500">Please wait while we fetch the vehicle information.</p>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <div className="p-4 bg-primary-100 rounded-full mb-4 inline-block">
                        <Truck className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Vehicle Not Found</h3>
                    <p className="text-gray-500 mb-6">No vehicle data found in the system.</p>
                    <button
                        onClick={handleGoBack}
                        className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} />
                        Back to Vehicles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleGoBack}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Go back to list"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Vehicle Details</h1>
                            <p className="text-gray-600">View complete vehicle information</p>
                        </div>
                    </div>
                </div>

                {/* Vehicle Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Vehicle Icon/Image */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                {vehicle.vehiclePhotoUrl && !mediaError.vehiclePhoto ? (
                                    <img
                                        src={vehicle.vehiclePhotoUrl}
                                        alt={vehicle.vehicleNumber}
                                        className="w-full h-full object-cover"
                                        onError={() => handleMediaError('vehiclePhoto')}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <Truck className="text-primary-600 w-8 h-8 md:w-10 md:h-10" />
                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                            {vehicle.vehiclePhotoUrl ? 'No Image' : 'No Photo'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {vehicle.vehicleNumber}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Vehicle ID: {vehicle.uid || vehicle.id}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                    {vehicle.vehicleType}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm mt-4">
                                <div className="flex items-center gap-2">
                                    <Building2 className="text-gray-400" size={16} />
                                    <span className="text-sm text-gray-600">
                                        Size: <span className="font-medium">{vehicle.vehicleSize} tons</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="text-gray-400" size={16} />
                                    <span className="text-sm text-gray-600">
                                        Registered: <span className="font-medium">{formatDate(vehicle.createdAt)}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicle Details Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="space-y-8">
                        {/* Vehicle Information */}
                        <DetailSection title="Vehicle Information" icon={<Truck size={20} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailRow label="Vehicle ID" value={vehicle.uid || vehicle.id} />
                                <DetailRow label="Vehicle Number" value={vehicle.vehicleNumber} />
                                <DetailRow label="Vehicle Type" value={vehicle.vehicleType} />
                                <DetailRow label="Vehicle Size" value={`${vehicle.vehicleSize} tons`} />
                                <DetailRow label="Registration Date" value={formatDate(vehicle.createdAt)} />
                                {vehicle.updatedAt && (
                                    <DetailRow label="Last Updated" value={formatDate(vehicle.updatedAt)} />
                                )}
                            </div>
                        </DetailSection>

                        {/* Driver Information */}
                        <DetailSection title="Driver Information" icon={<User size={20} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailRow label="Driver Name" value={vehicle.driverName} />
                                <DetailRow label="Mobile Number" value={formatMobile(vehicle.driverMobile)} />
                                <DetailRow label="Aadhar Number" value={formatAadhar(vehicle.driverAadhar)} />
                                <DetailRow label="Driving License" value={vehicle.driverDL} />
                            </div>

                            {/* Driver Photo */}
                            {vehicle.driverPhotoUrl && !mediaError.driverPhoto && (
                                <div className="mt-4">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                                        Driver Photo
                                    </label>
                                    <div className="border border-gray-200 rounded-lg p-4 max-w-xs">
                                        <img
                                            src={vehicle.driverPhotoUrl}
                                            alt="Driver"
                                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => handleViewMedia('driverPhoto', vehicle.driverPhotoUrl)}
                                            onError={() => handleMediaError('driverPhoto')}
                                        />
                                    </div>
                                </div>
                            )}
                        </DetailSection>

                        {/* Helper Information (if exists) */}
                        {(vehicle.helperName || vehicle.helperMobile || vehicle.helperAadhar) && (
                            <DetailSection title="Helper Information" icon={<Users size={20} />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {vehicle.helperName && (
                                        <DetailRow label="Helper Name" value={vehicle.helperName} />
                                    )}
                                    {vehicle.helperMobile && (
                                        <DetailRow label="Mobile Number" value={formatMobile(vehicle.helperMobile)} />
                                    )}
                                    {vehicle.helperAadhar && (
                                        <DetailRow label="Aadhar Number" value={formatAadhar(vehicle.helperAadhar)} />
                                    )}
                                </div>

                                {/* Helper Photo */}
                                {vehicle.helperPhotoUrl && !mediaError.helperPhoto && (
                                    <div className="mt-4">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                                            Helper Photo
                                        </label>
                                        <div className="border border-gray-200 rounded-lg p-4 max-w-xs">
                                            <img
                                                src={vehicle.helperPhotoUrl}
                                                alt="Helper"
                                                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => handleViewMedia('helperPhoto', vehicle.helperPhotoUrl)}
                                                onError={() => handleMediaError('helperPhoto')}
                                            />
                                        </div>
                                    </div>
                                )}
                            </DetailSection>
                        )}

                        {/* Documents Section */}
                        {(vehicle.rcDocumentUrl || vehicle.insuranceDocumentUrl) && (
                            <DetailSection title="Vehicle Documents" icon={<File size={20} />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* RC Document */}
                                    {vehicle.rcDocumentUrl && !mediaError.rcDocument && (
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                                    <File size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">RC Document</p>
                                                    <p className="text-xs text-gray-500">
                                                        {vehicle.rcDocumentName || 'Registration Certificate'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleViewMedia('rcDocument', vehicle.rcDocumentUrl)}
                                                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                                            >
                                                <Eye size={14} />
                                                View Document
                                            </button>
                                        </div>
                                    )}

                                    {/* Insurance Document */}
                                    {vehicle.insuranceDocumentUrl && !mediaError.insuranceDocument && (
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                                                    <File size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Insurance Document</p>
                                                    <p className="text-xs text-gray-500">
                                                        {vehicle.insuranceDocumentName || 'Insurance Certificate'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleViewMedia('insuranceDocument', vehicle.insuranceDocumentUrl)}
                                                className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                                            >
                                                <Eye size={14} />
                                                View Document
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </DetailSection>
                        )}

                        {/* Vehicle Media Gallery */}
                        {(vehicle.vehicleVideoUrl) && (
                            <DetailSection title="Vehicle Media" icon={<Video size={20} />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Vehicle Video */}
                                    {vehicle.vehicleVideoUrl && !mediaError.vehicleVideo && (
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-red-100 text-red-600">
                                                    <Video size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Vehicle Video Tour</p>
                                                    <p className="text-xs text-gray-500">
                                                        Uploaded on: {formatDate(vehicle.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-3">
                                                <div className="flex items-center justify-center p-2" style={{ height: '200px' }}>
                                                    <video
                                                        src={vehicle.vehicleVideoUrl}
                                                        controls
                                                        className="max-w-full max-h-[180px] w-auto h-auto rounded"
                                                        onError={() => handleMediaError('vehicleVideo')}
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleViewMedia('video', vehicle.vehicleVideoUrl)}
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
                    </div>
                </div>
            </div>

            {/* Media Preview Modal */}
            {mediaPreview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-95"
                    style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    onClick={handleClosePreview}
                >
                    <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={handleClosePreview}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 bg-black bg-opacity-50 rounded-full z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                            {previewType?.includes('Photo') || previewType === 'rcDocument' || previewType === 'insuranceDocument' ? (
                                <img
                                    src={mediaPreview}
                                    alt="Preview"
                                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                                />
                            ) : previewType === 'video' || previewType === 'vehicleVideo' ? (
                                <video
                                    src={mediaPreview}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[90vh] w-auto h-auto"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <iframe
                                    src={mediaPreview}
                                    className="w-full h-full"
                                    title="Document Preview"
                                />
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

export default VehicleDetails;