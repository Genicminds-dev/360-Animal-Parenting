// pages/procurement/ProcurementView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaTimesCircle,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaFilePdf as FaFilePdfIcon,
  FaIdCard
} from "react-icons/fa";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Eye,
  FileText,
  Camera,
  Truck as TruckIcon2,
  Home as HomeIcon,
  Hand,
  ClipboardList,
  ImageOff,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  UserCheck,
  Award,
  CreditCard,
  Car,
  FileCheck,
  Activity,
  HeartPulse,
  Syringe,
  Stethoscope,
  Shield,
  Users,
  Map,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GiCow } from 'react-icons/gi';
import ProcurementPDFDownload from '../AnimalProcuredList/ProcurementPDFDownload';
import ProcurementExcelDownload from '../AnimalProcuredList/ProcurementExcelDownload';
import { formatDate } from '../../utils/helpers/formatters';
import api, { baseURLFile } from '../../services/api/api';

const ProcurementView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [procurement, setProcurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('source');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [downloading, setDownloading] = useState({ pdf: false, excel: false });

  useEffect(() => {
    fetchProcurementData();
  }, [id]);

  // Helper function to get full URL for files
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    // If it's already a full URL, return as is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    // Remove any leading slash to avoid double slashes
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    return `${baseURLFile}/${cleanPath}`;
  };

  // Transform API response to match the view component's expected structure
  const transformProcurementData = (apiData) => {
    const animal = apiData.procured_animal && apiData.procured_animal[0] ? apiData.procured_animal[0] : {};
    const logistic = apiData.logistic && apiData.logistic[0] ? apiData.logistic[0] : {};
    const quarantine = apiData.quarantine_center && apiData.quarantine_center[0] ? apiData.quarantine_center[0] : {};
    const handover = apiData.handover && apiData.handover[0] ? apiData.handover[0] : {};

    return {
      // Source & Procurement Officer
      procurementOfficer: apiData.users ? `${apiData.users.firstName} ${apiData.users.lastName} - ${apiData.users.mobile}` : "N/A",
      sourceType: apiData.sourceType || "N/A",
      sourceLocation: apiData.sourceLocation || "N/A",
      visitDate: apiData.visitDate,
      visitTime: apiData.visitTime,

      // Animal Details
      tagId: animal.tagId || "N/A",
      breed: animal.breed || "N/A",
      ageYears: animal.ageYears,
      ageMonths: animal.ageMonths,
      milkingCapacity: animal.milkingCapacity,
      isCalfIncluded: animal.isCalfIncluded ? "yes" : "no",
      physicalCheck: animal.physicalCheck || "N/A",
      fmdDisease: animal.fmdDisease || false,
      lsdDisease: animal.lsdDisease || false,
      animalPhotoFront: animal.animalPhotoFront,
      animalPhotoSide: animal.animalPhotoSide,
      animalPhotoRear: animal.animalPhotoRear,

      // Breeder Information
      breederName: apiData.breederName || "N/A",
      breederContact: apiData.breederContact || "N/A",

      // Health Record
      healthRecord: animal.healthRecord,

      // Logistics - Always include these fields even if null
      vehicleNo: logistic.vehicleNo || "N/A",
      driverName: logistic.driverName || "N/A",
      driverDesignation: logistic.driverDesignation || "N/A",
      driverMobile: logistic.driverMobile || "N/A",
      driverAadhar: logistic.driverAadhar || "N/A",
      drivingLicense: logistic.drivingLicense || "N/A",
      licenseCertificate: logistic.licenseCertificate,

      // Quarantine - Always include these fields even if null
      quarantineCenter: quarantine.quarantineCenter || "N/A",
      quarantineCenterPhoto: quarantine.quarantineCenterPhoto,
      quarantineHealthRecord: quarantine.quarantineHealthRecord,
      finalHealthClearance: quarantine.finalHealthClearance,

      // Handover - Always include these fields even if null
      handoverOfficer: handover.handoverOfficer || "N/A",
      beneficiaryId: handover.beneficiaryId || "N/A",
      beneficiaryLocation: handover.beneficiaryLocation || "N/A",
      handoverPhoto: handover.handoverPhoto,
      handoverDocument: handover.handoverDocument,
      handoverDate: handover.handoverDate,
      handoverTime: handover.handoverTime,

      // Metadata
      remarks: "", // Add remarks if available in your API
      createdAt: apiData.createdAt,
      updatedAt: new Date().toISOString(), // You might want to add updatedAt to your API response
      createdBy: apiData.users ? `${apiData.users.firstName} ${apiData.users.lastName}` : "N/A"
    };
  };

  const fetchProcurementData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/procured-animal/${id}`);

      if (response.data.success) {
        const transformedData = transformProcurementData(response.data.data);
        setProcurement(transformedData);
      } else {
        toast.error(response.data.message || "Failed to fetch procurement details");
      }
    } catch (error) {
      console.error('Error fetching procurement:', error);
      toast.error(error.response?.data?.message || "Failed to fetch procurement details");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const openImageModal = (imagePath, title) => {
    if (!imagePath) return;
    const imageUrl = getFileUrl(imagePath);
    setSelectedImage({ url: imageUrl, title });
    setShowImageModal(true);
  };

  const openDocumentModal = (documentPath, title) => {
    if (!documentPath) return;
    const documentUrl = getFileUrl(documentPath);
    setSelectedDocument({ url: documentUrl, title });
    setShowDocumentModal(true);
  };

  const openDocument = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const isPDFFile = (url) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().endsWith('.pdf');
  };

  const getDiseaseStatus = (hasDisease) => {
    return hasDisease ? (
      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs">
        <XCircle className="text-red-600" size={12} />
        Detected
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs">
        <CheckCircle2 className="text-green-600" size={12} />
        Not Detected
      </span>
    );
  };

    const formatTime = (timeStr) => {
    if (!timeStr) return "";

    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Procurement Details...</h3>
          <p className="text-gray-500">Please wait while we fetch the procurement information.</p>
        </div>
      </div>
    );
  }

  if (!procurement) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="p-4 bg-red-100 rounded-full mb-4 inline-block">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Procurement Not Found</h3>
          <p className="text-gray-500 mb-6">The requested procurement record could not be found.</p>
          <button
            onClick={handleBack}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-r from-gray-50 via-white to-gray-50">
      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
              }}
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimesCircle size={24} className="text-gray-600" />
            </button>
            <p className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {showDocumentModal && selectedDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setShowDocumentModal(false)}
        >
          <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-lg overflow-hidden">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => openDocument(selectedDocument.url)}
                className="p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
                title="Open in new tab"
              >
                <FaExternalLinkAlt size={16} />
              </button>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <FaTimesCircle size={20} className="text-gray-600" />
              </button>
            </div>
            {isPDFFile(selectedDocument.url) ? (
              <iframe
                src={selectedDocument.url}
                title={selectedDocument.title}
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FaFilePdfIcon size={64} className="text-red-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">{selectedDocument.title}</p>
                  <button
                    onClick={() => openDocument(selectedDocument.url)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Open Document
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Procurement Details</h1>
            <p className="text-sm text-gray-600 mt-1">Tag ID: {procurement.tagId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ProcurementPDFDownload
            procurement={procurement}
            downloading={downloading}
            setDownloading={setDownloading}
          />
          <ProcurementExcelDownload
            procurement={procurement}
            downloading={downloading}
            setDownloading={setDownloading}
          />
        </div>
      </div>

      {/* Tabs - Always show all tabs with "N/A" data */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("source")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "source"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center gap-2">
              <ClipboardList size={18} />
              Source & Animal
            </div>
          </button>
          <button
            onClick={() => setActiveTab("logistics")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "logistics"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center gap-2">
              <TruckIcon2 size={18} />
              Logistics
            </div>
          </button>
          <button
            onClick={() => setActiveTab("quarantine")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "quarantine"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center gap-2">
              <HomeIcon size={18} />
              Quarantine
            </div>
          </button>
          <button
            onClick={() => setActiveTab("handover")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "handover"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center gap-2">
              <Hand size={18} />
              Handover
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "source" && (
        <div className="grid grid-cols-1 gap-6">
          <DetailSection title="Source Visit Record" icon={<ClipboardList size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow
                label="Procurement Officer"
                value={procurement.procurementOfficer}
                icon={<User size={16} className="text-gray-400" />}
              />
              <DetailRow
                label="Source Type"
                value={procurement.sourceType}
                icon={<MapPin size={16} className="text-gray-400" />}
              />
              <DetailRow
                label="Source Location"
                value={procurement.sourceLocation}
                icon={<Map size={16} className="text-gray-400" />}
              />
              <DetailRow
                label="Visit Date"
                value={procurement.visitDate ? formatDate(procurement.visitDate) : 'N/A'}
                icon={<CalendarIcon size={16} className="text-gray-400" />}
              />
              <DetailRow
                label="Visit Time"
                value={formatTime(procurement.visitTime) || 'N/A'}
                icon={<ClockIcon size={16} className="text-gray-400" />}
              />
            </div>
          </DetailSection>

          <DetailSection title="Breeder Information" icon={<User size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow
                label="Breeder Name"
                value={procurement.breederName}
                icon={<UserCheck size={16} className="text-gray-400" />}
              />
              <DetailRow
                label="Contact Number"
                value={procurement.breederContact}
                icon={<Phone size={16} className="text-gray-400" />}
              />
            </div>
          </DetailSection>

          <DetailSection title="Animal Details" icon={<GiCow size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow
                label="Tag ID"
                value={procurement.tagId}
                icon={<FaIdCard size={16} className="text-gray-400" />}
              />
              <DetailRow
                label="Breed"
                value={procurement.breed}
                icon={<GiCow size={16} className="text-gray-400" />}
              />
              <DetailRow
                label="Age"
                value={`${procurement.ageYears || 0} years ${procurement.ageMonths || 0} months`}
                icon={<Calendar size={16} className="text-gray-400" />}
              />
              <DetailRow
                label="Milking Capacity"
                value={procurement.milkingCapacity ? `${procurement.milkingCapacity} L/day` : 'N/A'}
                icon={<Activity size={16} className="text-gray-400" />}
              />
              <DetailRow
                label="Calf Included"
                value={procurement.isCalfIncluded === 'yes' ? 'Yes' : 'No'}
                icon={<Users size={16} className="text-gray-400" />}
              />
            </div>

            <div className="mt-4">
              <DetailRow
                label="Physical Check Notes"
                value={procurement.physicalCheck}
                fullWidth
                icon={<Stethoscope size={16} className="text-gray-400" />}
              />
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
                <Shield size={14} />
                Disease Screening
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <HeartPulse size={16} className="text-gray-400" />
                    FMD (Foot & Mouth Disease)
                  </span>
                  {getDiseaseStatus(procurement.fmdDisease)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <Syringe size={16} className="text-gray-400" />
                    LSD (Lumpy Skin Disease)
                  </span>
                  {getDiseaseStatus(procurement.lsdDisease)}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-3 flex items-center gap-2">
                <Camera size={14} />
                Animal Photos
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                <ImageCard
                  image={procurement.animalPhotoFront}
                  title="Front View"
                  onClick={() => openImageModal(procurement.animalPhotoFront, "Front View")}
                  getFileUrl={getFileUrl}
                />
                <ImageCard
                  image={procurement.animalPhotoSide}
                  title="Side View"
                  onClick={() => openImageModal(procurement.animalPhotoSide, "Side View")}
                  getFileUrl={getFileUrl}
                />
                <ImageCard
                  image={procurement.animalPhotoRear}
                  title="Rear View"
                  onClick={() => openImageModal(procurement.animalPhotoRear, "Rear View")}
                  getFileUrl={getFileUrl}
                />
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Health & Vaccination Record" icon={<FileText size={20} />}>
            {procurement.healthRecord ? (
              <DocumentCard
                document={procurement.healthRecord}
                title="Health Record"
                type="pdf"
                onClick={() => openDocumentModal(procurement.healthRecord, "Health Record")}
                getFileUrl={getFileUrl}
              />
            ) : (
              <EmptyDocumentCard title="Health Record (Not Available)" />
            )}
          </DetailSection>
        </div>
      )}

      {activeTab === "logistics" && (
        <DetailSection title="Logistic & Transit Details" icon={<TruckIcon2 size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              label="Vehicle Number"
              value={procurement.vehicleNo}
              icon={<Car size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Driver Name"
              value={procurement.driverName}
              icon={<User size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Designation"
              value={procurement.driverDesignation}
              icon={<Award size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Mobile Number"
              value={procurement.driverMobile}
              icon={<Phone size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Aadhar Number"
              value={procurement.driverAadhar}
              icon={<CreditCard size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Driving License"
              value={procurement.drivingLicense}
              icon={<FileCheck size={16} className="text-gray-400" />}
            />
          </div>

          <div className="mt-6">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
              <Award size={14} />
              License Certificate
            </label>
            {procurement.licenseCertificate ? (
              <DocumentCard
                document={procurement.licenseCertificate}
                title="Driving License Certificate"
                type="pdf"
                onClick={() => openDocumentModal(procurement.licenseCertificate, "Driving License Certificate")}
                getFileUrl={getFileUrl}
              />
            ) : (
              <EmptyDocumentCard title="License Certificate (Not Available)" />
            )}
          </div>
        </DetailSection>
      )}

      {activeTab === "quarantine" && (
        <DetailSection title="Quarantine & Care Details" icon={<HomeIcon size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              label="Quarantine Center"
              value={procurement.quarantineCenter}
              icon={<Building2 size={16} className="text-gray-400" />}
            />
          </div>

          <div className="mt-6">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
              <Camera size={14} />
              Quarantine Center Photo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3">
              <ImageCard
                image={procurement.quarantineCenterPhoto}
                title="Quarantine Center"
                onClick={() => openImageModal(procurement.quarantineCenterPhoto, "Quarantine Center")}
                getFileUrl={getFileUrl}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-3 flex items-center gap-2">
              <FileText size={14} />
              Quarantine Documents
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {procurement.quarantineHealthRecord ? (
                <DocumentCard
                  document={procurement.quarantineHealthRecord}
                  title="Health Record"
                  type="pdf"
                  onClick={() => openDocumentModal(procurement.quarantineHealthRecord, "Quarantine Health Record")}
                  getFileUrl={getFileUrl}
                />
              ) : (
                <EmptyDocumentCard title="Health Record (Not Available)" />
              )}
              {procurement.finalHealthClearance ? (
                <DocumentCard
                  document={procurement.finalHealthClearance}
                  title="Final Health Clearance"
                  type="pdf"
                  onClick={() => openDocumentModal(procurement.finalHealthClearance, "Final Health Clearance")}
                  getFileUrl={getFileUrl}
                />
              ) : (
                <EmptyDocumentCard title="Final Health Clearance (Not Available)" />
              )}
            </div>
          </div>
        </DetailSection>
      )}

      {activeTab === "handover" && (
        <DetailSection title="Handover Details" icon={<Hand size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              label="Handover Officer"
              value={procurement.handoverOfficer}
              icon={<UserCheck size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Beneficiary ID"
              value={procurement.beneficiaryId}
              icon={<FaIdCard size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Beneficiary Location"
              value={procurement.beneficiaryLocation}
              icon={<MapPin size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Handover Date"
              value={procurement.handoverDate ? formatDate(procurement.handoverDate) : 'N/A'}
              icon={<CalendarIcon size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Handover Time"
              value={procurement.handoverTime || 'N/A'}
              icon={<ClockIcon size={16} className="text-gray-400" />}
            />
          </div>

          <div className="mt-6">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
              <Camera size={14} />
              Handover Photo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3">
              <ImageCard
                image={procurement.handoverPhoto}
                title="Handover with Beneficiary"
                onClick={() => openImageModal(procurement.handoverPhoto, "Handover with Beneficiary")}
                getFileUrl={getFileUrl}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
              <FileText size={14} />
              Handover Document
            </label>
            {procurement.handoverDocument ? (
              <DocumentCard
                document={procurement.handoverDocument}
                title="Handover Document"
                type="pdf"
                onClick={() => openDocumentModal(procurement.handoverDocument, "Handover Document")}
                getFileUrl={getFileUrl}
              />
            ) : (
              <EmptyDocumentCard title="Handover Document (Not Available)" />
            )}
          </div>
        </DetailSection>
      )}

      {procurement.remarks && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <FileText className="text-primary-600 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-medium text-primary-800 mb-1">Remarks</h4>
              <p className="text-sm text-primary-700">{procurement.remarks}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>
            <span className="font-medium">Created:</span> {formatDate(procurement.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400" />
          <span>
            <span className="font-medium">Updated:</span> {formatDate(procurement.updatedAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User size={14} className="text-gray-400" />
          <span>
            <span className="font-medium">Created By:</span> {procurement.createdBy}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper Components
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

const DetailRow = ({ label, value, fullWidth = false, icon }) => (
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
      {icon}
      {label}
    </label>
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800 break-words">
      {value || "N/A"}
    </div>
  </div>
);

const ImageCard = ({ image, title, onClick, getFileUrl }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = image ? getFileUrl(image) : null;

  if (!image || !imageUrl) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
        <div className="w-full h-32 flex flex-col items-center justify-center">
          <Camera className="text-gray-400 mb-2" size={32} />
          <p className="text-xs text-gray-500 text-center px-2">{title} (Not Available)</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {!imageError ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-32 bg-gray-100 flex flex-col items-center justify-center">
          <ImageOff className="text-gray-400 mb-1" size={24} />
          <span className="text-xs text-gray-500">Failed to load</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
        <p className="text-xs text-white font-medium">{title}</p>
      </div>
    </div>
  );
};

const DocumentCard = ({ document, title, type = 'pdf', onClick, getFileUrl }) => {
  const documentUrl = document ? getFileUrl(document) : null;

  if (!document || !documentUrl) {
    return (
      <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
        <FileText className="text-gray-400 mr-3 flex-shrink-0" size={24} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 truncate">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer hover:shadow-md"
      onClick={onClick}
    >
      {type === 'pdf' ? (
        <FaFilePdfIcon className="text-red-500 mr-3 flex-shrink-0" size={24} />
      ) : (
        <FileText className="text-primary-500 mr-3 flex-shrink-0" size={24} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500">{type === 'pdf' ? 'PDF Document' : 'Document'}</p>
      </div>
      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
        <Eye size={16} />
      </button>
    </div>
  );
};

const EmptyDocumentCard = ({ title }) => (
  <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
    <FileText className="text-gray-400 mr-3 flex-shrink-0" size={24} />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 truncate">{title}</p>
    </div>
  </div>
);

export default ProcurementView;