import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    Truck,
    Home,
    Tag,
    GitBranch,
    Package,
    Users,
    X,
    Syringe,
    Shield,
    BadgeCheck
} from 'lucide-react';
import { GiCow } from 'react-icons/gi';
import { Toaster, toast } from 'react-hot-toast';
import { PATHROUTES } from '../../../routes/pathRoutes';

const BatchDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const batch = location.state?.batch;

    // State for animal details modal
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [showAnimalModal, setShowAnimalModal] = useState(false);
    const [activeTab, setActiveTab] = useState("batch");

    // Redirect if no batch data
    React.useEffect(() => {
        if (!batch) {
            toast.error('No batch data found');
            navigate(PATHROUTES.batchList);
        }
    }, [batch, navigate]);

    if (!batch) {
        return null;
    }

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Format time function
    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return timeString;
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1);
    };

    // Handle view animal details
    const handleViewAnimal = (animal) => {
        setSelectedAnimal(animal);
        setShowAnimalModal(true);
    };

    // Get gender badge
    const getGenderBadge = (gender) => {
        return gender === 'Female' 
            ? 'bg-pink-100 text-pink-800' 
            : 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="space-y-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 min-h-screen">

            {/* Header Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleBack}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Batch Details</h1>
                    <p className="text-gray-600">View complete batch information</p>
                </div>
            </div>

            {/* Batch Header Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Batch Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-4 border-white shadow-lg flex items-center justify-center">
                            <Package className="text-primary-600" size={40} />
                        </div>
                    </div>

                    {/* Batch Info */}
                    <div className="flex-1">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Batch ID: {batch.batchId}
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-gray-400" size={16} />
                                <span className="text-sm text-gray-600">
                                    Date: <span className="font-medium">{formatDate(batch.date)}</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="text-gray-400" size={16} />
                                <span className="text-sm text-gray-600">
                                    Time: <span className="font-medium">{formatTime(batch.time)}</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="text-gray-400" size={16} />
                                <span className="text-sm text-gray-600">
                                    Batch Size: <span className="font-medium text-primary-600">{batch.batchSize} Animals</span>
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
                        onClick={() => setActiveTab("batch")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === "batch"
                                ? "border-primary-600 text-primary-700"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Package size={18} />
                            Batch Details
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("animals")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === "animals"
                                ? "border-primary-600 text-primary-700"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <GiCow size={18} />
                            Animals ({batch.batchSize})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("vaccination")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === "vaccination"
                                ? "border-primary-600 text-primary-700"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Syringe size={18} />
                            Vaccination Details
                        </div>
                    </button>
                </nav>
            </div>

            {/* Batch Details Tab */}
            {activeTab === "batch" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Procurement Details */}
                    <DetailSection title="Procurement Details" icon={<User size={20} />}>
                        <div className="space-y-4">
                            <DetailRow label="Procurement Officer" value={batch.procurementOfficer} />
                            <DetailRow label="Broker" value={batch.broker} />
                            <DetailRow label="Source Type" value={batch.sourceType} />
                            <DetailRow label="Source Location" value={batch.sourceLocation} />
                        </div>
                    </DetailSection>

                    {/* Transport Details */}
                    <DetailSection title="Transport Details" icon={<Truck size={20} />}>
                        <div className="space-y-4">
                            <DetailRow label="Vehicle Number" value={batch.vehicleNo} />
                            <DetailRow label="Holding Station" value={batch.holdingStation} />
                            <DetailRow label="Place From" value={batch.placeFrom} />
                            <DetailRow label="Place To" value={batch.placeTo} />
                        </div>
                    </DetailSection>
                </div>
            )}

            {/* Animals Tab */}
            {activeTab === "animals" && (
                <div className="space-y-6">
                    <DetailSection title="Animal Details" icon={<GiCow size={20} />}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            S.No
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ear Tag ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Breed
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Calving Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {batch.animals.map((animal, index) => (
                                        <tr 
                                            key={index} 
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => handleViewAnimal(animal)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Tag size={14} className="text-gray-400" />
                                                    <span className="font-mono font-medium text-primary-600">
                                                        {animal.earTagId}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {animal.breed}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getGenderBadge(animal.gender)}`}>
                                                    {animal.gender}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {animal.calvingStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DetailSection>
                </div>
            )}

            {/* Vaccination Tab */}
            {activeTab === "vaccination" && (
                <div className="space-y-6">
                    <DetailSection title="Vaccination Details" icon={<Syringe size={20} />}>
                        {!batch.brucellaDate && !batch.fmdBy && !batch.lsdBy ? (
                            <div className="text-center py-12">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="p-4 bg-primary-100 rounded-full mb-4">
                                        <BadgeCheck className="w-12 h-12 text-primary-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                                        No Vaccination Records
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        No vaccination records available for this batch
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Brucella Screening */}
                                {(batch.brucellaDate || batch.brucellaResult) && (
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Shield size={18} className="text-purple-600" />
                                            </div>
                                            <h3 className="text-md font-medium text-gray-800">Brucella Screening</h3>
                                        </div>
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <DetailRow label="Date" value={batch.brucellaDate || '-'} />
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                                                    Result
                                                </label>
                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    {batch.brucellaResult ? (
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                            batch.brucellaResult === 'Negative' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {batch.brucellaResult}
                                                        </span>
                                                    ) : '-'}
                                                </div>
                                            </div>
                                        </dl>
                                    </div>
                                )}

                                {/* FMD Vaccination */}
                                {(batch.fmdBy || batch.fmdDate) && (
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Syringe size={18} className="text-green-600" />
                                            </div>
                                            <h3 className="text-md font-medium text-gray-800">FMD Vaccination</h3>
                                        </div>
                                        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <DetailRow label="Administered By" value={batch.fmdBy || '-'} />
                                            <DetailRow label="Date" value={batch.fmdDate ? formatDate(batch.fmdDate) : '-'} />
                                            <DetailRow label="Batch No." value={batch.fmdBatchNo || '-'} />
                                            <DetailRow label="Expiry Date" value={batch.fmdExpiryDate ? formatDate(batch.fmdExpiryDate) : '-'} />
                                        </dl>
                                    </div>
                                )}

                                {/* LSD Vaccination */}
                                {(batch.lsdBy || batch.lsdDate) && (
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <Syringe size={18} className="text-orange-600" />
                                            </div>
                                            <h3 className="text-md font-medium text-gray-800">LSD Vaccination</h3>
                                        </div>
                                        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <DetailRow label="Administered By" value={batch.lsdBy || '-'} />
                                            <DetailRow label="Date" value={batch.lsdDate ? formatDate(batch.lsdDate) : '-'} />
                                            <DetailRow label="Batch No." value={batch.lsdBatchNo || '-'} />
                                            <DetailRow label="Expiry Date" value={batch.lsdExpiryDate ? formatDate(batch.lsdExpiryDate) : '-'} />
                                        </dl>
                                    </div>
                                )}
                            </div>
                        )}
                    </DetailSection>
                </div>
            )}

            {/* Animal Details Modal */}
            {showAnimalModal && selectedAnimal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Animal Details</h3>
                            <button
                                onClick={() => setShowAnimalModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                                        <GiCow className="text-primary-600" size={48} />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Ear Tag ID</p>
                                        <p className="font-mono font-medium text-gray-900">{selectedAnimal.earTagId}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Breed</p>
                                        <p className="font-medium text-gray-900">{selectedAnimal.breed}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Gender</p>
                                        <p className="font-medium text-gray-900">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getGenderBadge(selectedAnimal.gender)}`}>
                                                {selectedAnimal.gender}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Calving Status</p>
                                        <p className="font-medium text-gray-900">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {selectedAnimal.calvingStatus}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setShowAnimalModal(false)}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Reusable Components (copied from BrokerDetails)
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

export default BatchDetails;