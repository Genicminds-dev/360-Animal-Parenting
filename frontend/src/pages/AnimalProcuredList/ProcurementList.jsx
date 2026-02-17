// pages/procurement/ProcurementList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Eye, Pencil, Trash2, Search, Filter,
  Calendar, User, Truck, Home, Hand, ChevronLeft,
  ChevronRight, Download, MoreVertical, CheckCircle,
  XCircle, Clock, AlertCircle, FileText
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../services/api/api';
import { Endpoints } from '../../services/api/EndPoint';
import { PATHROUTES } from '../../routes/pathRoutes';

const ProcurementList = () => {
  const navigate = useNavigate();
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [viewModal, setViewModal] = useState({ show: false, data: null });

  // Mock Data
  const MOCK_PROCUREMENTS = [
    {
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
        { tagId: "TAG-001", breed: "Gir", age: "5 years", milkingCapacity: "12" }
      ],
      status: "Completed",
      currentStep: 4,
      createdAt: "2024-03-15T10:30:00Z"
    },
    {
      id: 2,
      procurementId: "PROC002",
      procurementOfficer: { id: 2, name: "Priya Sharma", mobile: "8765432109" },
      sourceType: "Bazaar",
      sourceLocation: "Animal Market, Nagpur",
      visitDate: "2024-03-14",
      visitTime: "09:15",
      breederName: "Mohan Singh",
      breederContact: "8765432112",
      animals: [
        { tagId: "TAG-002", breed: "Sahiwal", age: "3 years", milkingCapacity: "8" },
        { tagId: "TAG-003", breed: "Jersey", age: "4 years", milkingCapacity: "10" }
      ],
      status: "In Transit",
      currentStep: 2,
      createdAt: "2024-03-14T09:15:00Z"
    },
    {
      id: 3,
      procurementId: "PROC003",
      procurementOfficer: { id: 3, name: "Amit Patel", mobile: "7654321098" },
      sourceType: "Farm",
      sourceLocation: "Dairy Farm, Ahmednagar",
      visitDate: "2024-03-13",
      visitTime: "14:45",
            breederName: "Rajendra Yadav",
      breederContact: "7654321123",
      animals: [
        { tagId: "TAG-004", breed: "Murrah", age: "6 years", milkingCapacity: "15" }
      ],
      status: "In Quarantine",
      currentStep: 3,
      createdAt: "2024-03-13T14:45:00Z"
    },
    {
      id: 4,
      procurementId: "PROC004",
      procurementOfficer: { id: 4, name: "Sunita Reddy", mobile: "6543210987" },
      sourceType: "Bazaar",
      sourceLocation: "Livestock Market, Aurangabad",
      visitDate: "2024-03-12",
      visitTime: "11:30",
      breederName: "Kavita Deshmukh",
      breederContact: "6543211234",
      animals: [
        { tagId: "TAG-005", breed: "Holstein Friesian", age: "4 years", milkingCapacity: "18" },
        { tagId: "TAG-006", breed: "Gir", age: "5 years", milkingCapacity: "14" }
      ],
      status: "Pending",
      currentStep: 1,
      createdAt: "2024-03-12T11:30:00Z"
    },
    {
      id: 5,
      procurementId: "PROC005",
      procurementOfficer: { id: 5, name: "Vikram Singh", mobile: "5432109876" },
      sourceType: "Farm",
      sourceLocation: "Organic Dairy, Nashik",
      visitDate: "2024-03-11",
      visitTime: "16:20",
      breederName: "Harish Chavan",
      breederContact: "5432109877",
      animals: [
        { tagId: "TAG-007", breed: "Jersey", age: "3 years", milkingCapacity: "9" }
      ],
      status: "Completed",
      currentStep: 4,
      createdAt: "2024-03-11T16:20:00Z"
    }
  ];

  useEffect(() => {
    loadProcurements();
  }, []);

  const loadProcurements = async () => {
    setLoading(true);
    try {
      // Try to fetch from API first
      // const response = await api.get(Endpoints.GET_PROCUREMENTS);
      // if (response.data.success) {
      //   setProcurements(response.data.data);
      // } else {
      //   // Fallback to mock data
      //   setProcurements(MOCK_PROCUREMENTS);
      // }
      
      // Using mock data for now
      setTimeout(() => {
        setProcurements(MOCK_PROCUREMENTS);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading procurements:', error);
      setProcurements(MOCK_PROCUREMENTS);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      // API call to delete
      // await api.delete(`${Endpoints.DELETE_PROCUREMENT}/${id}`);
      
      // Mock delete
      setProcurements(prev => prev.filter(p => p.id !== id));
      toast.success('Procurement record deleted successfully');
      setDeleteModal({ show: false, id: null });
    } catch (error) {
      console.error('Error deleting procurement:', error);
      toast.error('Failed to delete procurement record');
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${config.color}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  const getStepIndicator = (step) => {
    const steps = ['Source', 'Logistic', 'Quarantine', 'Handover'];
    return (
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs
              ${i + 1 <= step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
            `}>
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-4 h-0.5 ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const filteredProcurements = procurements.filter(proc => {
    const matchesSearch = 
      proc.procurementId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.sourceLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.breederName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.procurementOfficer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProcurements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProcurements.length / itemsPerPage);

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
          <p className="text-gray-600">Loading procurement records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procurement Management</h1>
          <p className="text-gray-600 mt-1">Manage animal procurement records</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, location, breeder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="In Quarantine">In Quarantine</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breeder</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animals</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((proc) => (
                  <tr key={proc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{proc.procurementId}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proc.procurementOfficer.name}</div>
                      <div className="text-xs text-gray-500">{proc.procurementOfficer.mobile}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{proc.sourceLocation}</div>
                      <div className="text-xs text-gray-500">{proc.sourceType}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{proc.breederName}</div>
                      <div className="text-xs text-gray-500">{proc.breederContact}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {proc.animals.length} animal{proc.animals.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {proc.animals.map(a => a.tagId).join(', ')}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(proc.visitDate)}</div>
                      <div className="text-xs text-gray-500">{proc.visitTime}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getStepIndicator(proc.currentStep)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(proc.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewModal({ show: true, data: proc })}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(PATHROUTES.procurementForm, { 
                            state: { procurementData: proc, isEdit: true } 
                          })}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, id: proc.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="text-gray-400 mb-3" size={48} />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">No procurement records found</h3>
                      <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProcurements.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredProcurements.length)}
              </span>{' '}
              of <span className="font-medium">{filteredProcurements.length}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModal.show && viewModal.data && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Procurement Details</h2>
                <button
                  onClick={() => setViewModal({ show: false, data: null })}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Procurement ID</p>
                      <p className="text-sm font-medium">{viewModal.data.procurementId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <div className="mt-1">{getStatusBadge(viewModal.data.status)}</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="text-sm">{formatDateTime(viewModal.data.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Step</p>
                      <p className="text-sm">Step {viewModal.data.currentStep} of 4</p>
                    </div>
                  </div>
                </div>

                {/* Source Visit */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    Source Visit Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Officer</p>
                      <p className="text-sm font-medium">{viewModal.data.procurementOfficer.name}</p>
                      <p className="text-xs text-gray-500">{viewModal.data.procurementOfficer.mobile}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Source Type</p>
                      <p className="text-sm">{viewModal.data.sourceType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm">{viewModal.data.sourceLocation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Visit Date/Time</p>
                      <p className="text-sm">{formatDate(viewModal.data.visitDate)} {viewModal.data.visitTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Breeder</p>
                      <p className="text-sm">{viewModal.data.breederName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Breeder Contact</p>
                      <p className="text-sm">{viewModal.data.breederContact}</p>
                    </div>
                  </div>
                </div>

                {/* Animals */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Beef size={18} className="text-green-600" />
                    Animal Details
                  </h3>
                  <div className="space-y-3">
                    {viewModal.data.animals.map((animal, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Tag ID</p>
                            <p className="text-sm font-medium">{animal.tagId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Breed</p>
                            <p className="text-sm">{animal.breed}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Age</p>
                            <p className="text-sm">{animal.age}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Milking Capacity</p>
                            <p className="text-sm">{animal.milkingCapacity} Ltr/day</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Progress Status</h3>
                  <div className="space-y-3">
                    {['Source Visit', 'Logistic & Transit', 'Quarantine & Care', 'Handover'].map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${index + 1 <= viewModal.data.currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                        `}>
                          {index + 1 <= viewModal.data.currentStep ? <CheckCircle size={16} /> : index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{step}</p>
                          <p className="text-xs text-gray-500">
                            {index + 1 <= viewModal.data.currentStep ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setViewModal({ show: false, data: null })}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Procurement Record</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this procurement record? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, id: null })}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.id)}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementList;