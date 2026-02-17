// pages/procurement/ViewProcurement.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, MapPin, Calendar, Tag, Beef,
  Droplet, Baby, Eye, FileText, Camera, Truck, Home,
  Hand, Download, CheckCircle, XCircle, Clock, Image,
  Video, File, Edit, Printer, Share2
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../services/api/api';
import { PATHROUTES } from '../../routes/pathRoutes';

const ViewProcurement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [procurement, setProcurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with API call
  const MOCK_PROCUREMENT = {
    id: 1,
    procurementId: "PROC001",
    procurementOfficer: { id: 1, name: "Rajesh Kumar", mobile: "9876543210" },
    sourceType: "Farm",
    sourceLocation: "Green Valley Farm, Pune",
    visitDate: "2024-03-15",
    visitTime: "10:30",
    breederName: "Suresh Patil",
    breederContact: "9876543211",
    animals: [
      {
        id: 1,
        tagId: "TAG-001",
        breed: "Gir",
        ageYears: 5,
        ageMonths: 2,
        milkingCapacity: 12,
        isCalfIncluded: "no",
        physicalCheck: "Healthy, bright eyes, no abnormalities",
        diseases: { fmd: false, lsd: false },
        photos: {
          front: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
          side: "https://images.unsplash.com/photo-1547722700-57de53c5c0e7",
          rear: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9"
        }
      }
    ],
    healthRecords: [
      { name: "vaccination_record.pdf", url: "#" },
      { name: "health_certificate.pdf", url: "#" }
    ],
    logistic: {
      vehicleNo: "MH12AB1234",
      driverName: "Ramesh Yadav",
      driverDesignation: "Driver",
      driverMobile: "9876543212",
      driverAadhar: "123456789012",
      drivingLicense: "DL1234567890",
      licenseCertificate: "license.pdf"
    },
    quarantine: {
      centerName: "Central Quarantine Center, Pune",
      centerPhoto: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
      healthRecords: [
        { name: "quarantine_health_1.pdf", url: "#" },
        { name: "quarantine_health_2.pdf", url: "#" }
      ],
      finalClearance: "final_clearance.pdf"
    },
    handover: {
      officerName: "Priya Sharma",
      beneficiaryId: "BEN001",
      location: "Village Sunderpur, District Pune",
      photo: "https://images.unsplash.com/photo-1593113598335-9c5c5a6b4b4b",
      dateTime: "2024-03-20T14:30",
      document: "handover_doc.pdf"
    },
    status: "Completed",
    currentStep: 4,
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-20T14:30:00Z"
  };

  useEffect(() => {
    loadProcurementData();
  }, [id]);

  const loadProcurementData = async () => {
    setLoading(true);
    try {
      // API call
      // const response = await api.get(`${Endpoints.GET_PROCUREMENT}/${id}`);
      // if (response.data.success) {
      //   setProcurement(response.data.data);
      // }
      
      // Using mock data
      setTimeout(() => {
        setProcurement(MOCK_PROCUREMENT);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading procurement:', error);
      toast.error('Failed to load procurement details');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'In Transit': { color: 'bg-blue-100 text-blue-800', icon: Truck },
      'In Quarantine': { color: 'bg-yellow-100 text-yellow-800', icon: Home },
      'Pending': { color: 'bg-gray-100 text-gray-800', icon: Clock },
      'Rejected': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${config.color}`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading procurement details...</p>
        </div>
      </div>
    );
  }

  if (!procurement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="p-4 bg-red-100 rounded-full mb-4 inline-block">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Procurement Not Found</h3>
          <p className="text-gray-500 mb-6">The procurement record you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(PATHROUTES.procurementList)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#363636", color: "#fff" },
          success: { style: { background: "#10b981" } },
          error: { style: { background: "#ef4444" } },
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(PATHROUTES.procurementList)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Procurement Details</h1>
            <p className="text-gray-600">View complete procurement information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(PATHROUTES.procurementForm, { 
              state: { procurementData: procurement, isEdit: true } 
            })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{procurement.procurementId}</h2>
              {getStatusBadge(procurement.status)}
            </div>
            <p className="text-gray-600">Created on {formatDateTime(procurement.createdAt)}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDateTime(procurement.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {['Source Visit', 'Logistic & Transit', 'Quarantine & Care', 'Handover'].map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="relative">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${index + 1 <= procurement.currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {index + 1 <= procurement.currentStep ? <CheckCircle size={20} /> : index + 1}
                  </div>
                </div>
                {index < 3 && (
                  <div className={`
                    w-24 h-1 mx-2
                    ${index + 1 < procurement.currentStep ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-center w-24">Source Visit</span>
            <span className="text-center w-24">Logistics</span>
            <span className="text-center w-24">Quarantine</span>
            <span className="text-center w-24">Handover</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2 overflow-x-auto">
          {['overview', 'animals', 'logistics', 'quarantine', 'handover'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap capitalize ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Source Visit Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Source Visit Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Officer</p>
                  <p className="font-medium">{procurement.procurementOfficer.name}</p>
                  <p className="text-sm text-gray-600">{procurement.procurementOfficer.mobile}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Source</p>
                  <p className="font-medium">{procurement.sourceType}</p>
                  <p className="text-sm text-gray-600">{procurement.sourceLocation}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Visit Date/Time</p>
                  <p className="font-medium">{formatDate(procurement.visitDate)}</p>
                  <p className="text-sm text-gray-600">{procurement.visitTime}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Breeder</p>
                  <p className="font-medium">{procurement.breederName}</p>
                  <p className="text-sm text-gray-600">{procurement.breederContact}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Beef className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Animals</p>
                    <p className="text-2xl font-bold">{procurement.animals.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Health Records</p>
                    <p className="text-2xl font-bold">{procurement.healthRecords.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CheckCircle className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progress</p>
                    <p className="text-2xl font-bold">{procurement.currentStep}/4</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle size={12} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Handover completed</p>
                    <p className="text-xs text-gray-500">{formatDateTime(procurement.handover.dateTime)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle size={12} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Quarantine clearance issued</p>
                    <p className="text-xs text-gray-500">20 Mar 2024, 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Truck size={12} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vehicle dispatched</p>
                    <p className="text-xs text-gray-500">18 Mar 2024, 09:15 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Animals Tab */}
        {activeTab === 'animals' && (
          <div className="space-y-6">
            {procurement.animals.map((animal, index) => (
              <div key={animal.id} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Animal #{index + 1} - {animal.tagId}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Animal Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Breed</p>
                        <p className="font-medium">{animal.breed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Age</p>
                        <p className="font-medium">{animal.ageYears} years {animal.ageMonths} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Milking Capacity</p>
                        <p className="font-medium">{animal.milkingCapacity} Ltr/day</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Calf Included</p>
                        <p className="font-medium capitalize">{animal.isCalfIncluded}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Physical Check</p>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{animal.physicalCheck}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Disease Check</p>
                      <div className="flex gap-4">
                        <span className={`px-2 py-1 rounded text-xs ${animal.diseases.fmd ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                          FMD {animal.diseases.fmd ? '(Yes)' : '(No)'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${animal.diseases.lsd ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                          LSD {animal.diseases.lsd ? '(Yes)' : '(No)'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animal Photos */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Animal Photos</p>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(animal.photos).map(([position, url]) => (
                        <div key={position} className="text-center">
                          <p className="text-xs capitalize mb-1">{position}</p>
                          {url ? (
                            <img
                              src={url}
                              alt={position}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/150?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-full h-24 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                              <Camera className="text-gray-400" size={20} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Health Records */}
            {procurement.healthRecords.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health & Vaccination Records</h3>
                <div className="space-y-2">
                  {procurement.healthRecords.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" />
                        <span>{record.name}</span>
                      </div>
                      <a
                        href={record.url}
                        download
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Logistics Tab */}
        {activeTab === 'logistics' && procurement.logistic && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={20} className="text-orange-600" />
              Logistic & Transit Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Vehicle Number</p>
                <p className="font-medium text-lg">{procurement.logistic.vehicleNo}</p>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-700 mb-3">Driver Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{procurement.logistic.driverName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Designation</p>
                    <p className="font-medium">{procurement.logistic.driverDesignation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile</p>
                    <p className="font-medium">{procurement.logistic.driverMobile}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Aadhar</p>
                    <p className="font-medium">{procurement.logistic.driverAadhar || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Driving License</p>
                <p className="font-medium">{procurement.logistic.drivingLicense || 'N/A'}</p>
              </div>
              
              {procurement.logistic.licenseCertificate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">License Certificate</p>
                  <a
                    href={procurement.logistic.licenseCertificate}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    Download Certificate
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quarantine Tab */}
        {activeTab === 'quarantine' && procurement.quarantine && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home size={20} className="text-yellow-600" />
                Quarantine & Care Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Quarantine Center</p>
                  <p className="font-medium text-lg">{procurement.quarantine.centerName}</p>
                </div>
                
                {procurement.quarantine.centerPhoto && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Center Photo</p>
                    <img
                      src={procurement.quarantine.centerPhoto}
                      alt="Quarantine Center"
                      className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 mb-2">Health Records</p>
                  <div className="space-y-2">
                    {procurement.quarantine.healthRecords.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-600" />
                          <span>{record.name}</span>
                        </div>
                        <a
                          href={record.url}
                          download
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                
                {procurement.quarantine.finalClearance && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-2">Final Health Clearance</p>
                    <a
                      href={procurement.quarantine.finalClearance}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download size={16} />
                      Download Clearance Document
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Handover Tab */}
        {activeTab === 'handover' && procurement.handover && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Hand size={20} className="text-indigo-600" />
              Handover Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Handover Officer</p>
                <p className="font-medium text-lg">{procurement.handover.officerName}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Beneficiary ID</p>
                <p className="font-medium">{procurement.handover.beneficiaryId}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-medium">{procurement.handover.location}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                <p className="font-medium">{formatDateTime(procurement.handover.dateTime)}</p>
              </div>
              
              {procurement.handover.photo && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 mb-2">Handover Photo</p>
                  <div className="relative">
                    <img
                      src={procurement.handover.photo}
                      alt="Handover"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Note: Photo shows Beneficiary and Animal Ear Tag ID clearly
                    </p>
                  </div>
                </div>
              )}
              
              {procurement.handover.document && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 mb-2">Handover Document</p>
                  <a
                    href={procurement.handover.document}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Download size={16} />
                    Download Handover Document
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProcurement;