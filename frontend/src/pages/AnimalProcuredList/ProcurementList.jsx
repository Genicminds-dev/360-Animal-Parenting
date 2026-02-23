import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Eye, Pencil, Trash2, Search, Filter, X,
  Calendar, User, Truck, Home, CheckCircle,
  XCircle, Clock, FileText, ChevronLeft, ChevronRight,
  Beef, Minus, ChevronDown, ChevronUp, Hash, Phone,
  MapPin, Tag, Droplet
} from 'lucide-react';
import { BiSearch } from 'react-icons/bi';
import { HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import DataTable from '../../components/common/Table/DataTable';
import { PATHROUTES } from '../../routes/pathRoutes';
import api from '../../services/api/api';

const ProcurementList = () => {
  const navigate = useNavigate();
  const [procurements, setProcurements] = useState([]);
  const [filteredProcurements, setFilteredProcurements] = useState([]);

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter UI state
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Selection state
  const [selectedProcurements, setSelectedProcurements] = useState(new Set());

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteIds, setDeleteIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "visitDate",
    direction: "desc",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 20
  });

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}, []);

  // Initialize tempFilters when component mounts
  useEffect(() => {
    setTempFilters(filters);
    const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);
    setAppliedFilters(filters);
  }, [filters]);

  // Load procurements on mount and when dependencies change
  useEffect(() => {
    loadProcurements();
  }, [pagination.currentPage, pagination.limit, searchTerm, filters]);

  

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(searchInput);
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);

  // Transform API response to match your frontend data structure
  const transformApiResponse = (apiData) => {
    return apiData.map(item => {
      // Get the first animal from procured_animal array
      const animal = item.procured_animal && item.procured_animal[0] ? item.procured_animal[0] : {};
      // Get the first logistic record
      const logistic = item.logistic && item.logistic[0] ? item.logistic[0] : {};
      // Get the first quarantine center record
      const quarantine = item.quarantine_center && item.quarantine_center[0] ? item.quarantine_center[0] : {};
      // Get the first handover record
      const handover = item.handover && item.handover[0] ? item.handover[0] : {};

      return {
        id: item.uid,
        uid: item.uid,
        animalId: item.uid,
        tagId: animal.tagId || "",
        procurementOfficer: item.users ? `${item.users.firstName} ${item.users.lastName}` : "",
        officerId: item.procurementOfficer,
        sourceType: item.sourceType || "",
        sourceLocation: item.sourceLocation || "",
        visitDate: item.visitDate,
        visitTime: item.visitTime,
        breederName: item.breederName || "",
        breederContact: item.breederContact || "",
        breed: animal.breed || "",
        ageYears: animal.ageYears,
        ageMonths: animal.ageMonths,
        milkingCapacity: animal.milkingCapacity,
        isCalfIncluded: animal.isCalfIncluded,
        physicalCheck: animal.physicalCheck || "",
        fmdDisease: animal.fmdDisease,
        lsdDisease: animal.lsdDisease,
        animalPhotoFront: animal.animalPhotoFront,
        animalPhotoSide: animal.animalPhotoSide,
        animalPhotoRear: animal.animalPhotoRear,
        healthRecord: animal.healthRecord,
        vehicleNo: logistic.vehicleNo || "",
        driverName: logistic.driverName || "",
        driverDesignation: logistic.driverDesignation || "",
        driverMobile: logistic.driverMobile || "",
        driverAadhar: logistic.driverAadhar || "",
        drivingLicense: logistic.drivingLicense || "",
        licenseCertificate: logistic.licenseCertificate,
        quarantineCenter: quarantine.quarantineCenter || "",
        quarantineCenterPhoto: quarantine.quarantineCenterPhoto,
        quarantineHealthRecord: quarantine.quarantineHealthRecord,
        finalHealthClearance: quarantine.finalHealthClearance,
        handoverOfficer: handover.handoverOfficer,
        beneficiaryId: handover.beneficiaryId || "",
        beneficiaryLocation: handover.beneficiaryLocation || "",
        handoverPhoto: handover.handoverPhoto,
        handoverDate: handover.handoverDate,
        handoverTime: handover.handoverTime,
        handoverDocument: handover.handoverDocument,
        createdAt: item.createdAt
      };
    });
  };

  // Load procurements from API
  const loadProcurements = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        search: searchTerm || ""
      });

      // Add filter parameters if they exist
      if (filters.sourceType) params.append('sourceType', filters.sourceType);
      if (filters.breed) params.append('breed', filters.breed);
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);

      const response = await api.get(`/admin/procured-animal?${params.toString()}`);

      if (response.data.success) {
        const transformedData = transformApiResponse(response.data.data);
        setProcurements(transformedData);
        setFilteredProcurements(transformedData);

        // Update pagination from API response
        if (response.data.pagination) {
          setPagination({
            currentPage: response.data.pagination.currentPage,
            totalPages: response.data.pagination.totalPages,
            totalRecords: response.data.pagination.totalRecords,
            limit: response.data.pagination.limit
          });
        }

        // Clear selections after successful load
        setSelectedProcurements(new Set());
      } else {
        toast.error(response.data.message || "Failed to fetch procurements");
      }
    } catch (error) {
      console.error('Error loading procurements:', error);
      toast.error(error.response?.data?.message || "Failed to fetch procurements");
      setProcurements([]);
      setFilteredProcurements([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Remove empty filters
    const filtersToApply = { ...tempFilters };
    Object.keys(filtersToApply).forEach(key => {
      if (filtersToApply[key] === "" || filtersToApply[key] === null || filtersToApply[key] === undefined) {
        delete filtersToApply[key];
      }
    });

    setFilters(filtersToApply);
    setAppliedFilters(filtersToApply);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page

    const hasAppliedFilters = Object.keys(filtersToApply).length > 0;
    setIsFilterApplied(hasAppliedFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {};
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setAppliedFilters({});
    setIsFilterApplied(false);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setShowFilters(false);
  };

  const handleCancelFilters = () => {
    setTempFilters(filters);
    setShowFilters(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Sorting
  const requestSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key: null, direction: null };
    });
  }, []);

  // Apply sorting to data
  const sortedProcurements = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredProcurements;

    return [...filteredProcurements].sort((a, b) => {
      const key = sortConfig.key;
      let aValue = a[key] ?? "";
      let bValue = b[key] ?? "";

      if (key === 'visitDate' || key === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProcurements, sortConfig]);

  // Get sort icon
  const getSortIcon = useCallback(
    (key) => {
      if (sortConfig.key !== key || !sortConfig.direction) {
        return <Minus className="ml-1 text-gray-400" size={16} />;
      }

      if (sortConfig.direction === "asc") {
        return <ChevronUp className="ml-1 text-gray-600" size={16} />;
      } else {
        return <ChevronDown className="ml-1 text-gray-600" size={16} />;
      }
    },
    [sortConfig]
  );

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

  // Table columns
  const columns = useMemo(() => [
    {
      key: "animalId",
      label: "Animal ID",
      sortable: true,
      onSort: () => requestSort('animalId'),
      sortIcon: getSortIcon('animalId'),
      render: (item) => (
        <div className="font-medium text-primary-600">{item.animalId}</div>
      )
    },
    {
      key: "tagId",
      label: "Tag ID",
      sortable: true,
      onSort: () => requestSort('tagId'),
      sortIcon: getSortIcon('tagId'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <Hash size={14} className="text-gray-400" />
          <span className="text-sm text-gray-900">{item.tagId}</span>
        </div>
      )
    },
    {
      key: "procurementOfficer",
      label: "Officer",
      sortable: true,
      onSort: () => requestSort('procurementOfficer'),
      sortIcon: getSortIcon('procurementOfficer'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <User size={14} className="text-gray-400" />
          <span className="text-sm text-gray-900">{item.procurementOfficer}</span>
        </div>
      )
    },
    {
      key: "breederName",
      label: "Breeder",
      sortable: true,
      onSort: () => requestSort('breederName'),
      sortIcon: getSortIcon('breederName'),
      render: (item) => (
        <div>
          <div className="text-sm text-gray-900">{item.breederName}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Phone size={10} />
            {item.breederContact}
          </div>
        </div>
      )
    },
    {
      key: "visitDate",
      label: "Date & Time",
      sortable: true,
      onSort: () => requestSort('visitDate'),
      sortIcon: getSortIcon('visitDate'),
      render: (item) => {
        const date = new Date(item.visitDate);
        return (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <div>
              <div className="text-sm text-gray-900">
                {date.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </div>
              <div className="text-xs text-gray-500">{formatTime(item.visitTime)}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: "breed",
      label: "Breed",
      sortable: true,
      onSort: () => requestSort('breed'),
      sortIcon: getSortIcon('breed'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-gray-400" />
          <span className="text-sm text-gray-900">{item.breed}</span>
        </div>
      )
    },
    {
      key: "sourceType",
      label: "Source Type",
      sortable: true,
      onSort: () => requestSort('sourceType'),
      sortIcon: getSortIcon('sourceType'),
      render: (item) => (
        <span className="text-sm text-gray-900">{item.sourceType}</span>
      )
    }
  ], [getSortIcon, requestSort]);

  // Selection handlers
  const toggleSelectProcurement = (id) => {
    if (!id) return;
    setSelectedProcurements((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    const allIds = filteredProcurements.map(proc => proc.id).filter(Boolean);
    if (selectedProcurements.size === allIds.length && allIds.length > 0) {
      setSelectedProcurements(new Set());
    } else {
      setSelectedProcurements(new Set(allIds));
    }
  };

  // Edit Handler - Pass complete procurement data to form
  const handleEdit = (procurement) => {
    navigate(PATHROUTES.editanimalProcurement, { 
      state: { 
        procurementData: procurement,
        isEdit: true 
      } 
    });
  };

  // View Handler - Navigate to view page with uid
  const handleView = (procurement) => {
    navigate(`${PATHROUTES.animalProcurementView}/${procurement.uid}`);
  };

  // Delete single procurement
  const handleDelete = (id) => {
    const procurement = procurements.find(p => p.id === id);
    if (!procurement) {
      toast.error("Cannot delete procurement: Invalid procurement ID");
      return;
    }
    setDeleteTarget("single");
    setDeleteIds([id]);
    setShowDeleteModal(true);
  };

  // Bulk Delete Handler
  const handleBulkDelete = (ids) => {
    if (!ids || ids.size === 0) {
      toast.error("Please select procurements to delete");
      return;
    }
    setDeleteTarget("selected");
    setDeleteIds(Array.from(ids));
    setShowDeleteModal(true);
  };

  // Confirm Delete Handler
  const confirmDelete = async () => {
    if (deleteLoading || deleteIds.length === 0) return;

    setDeleteLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const loadingToast = toast.loading(
        deleteTarget === "selected"
          ? `Deleting ${deleteIds.length} procurement(s)...`
          : "Deleting procurement..."
      );

      for (const uid of deleteIds) {
        try {
          const response = await api.delete(`/admin/procured-animal/${uid}?status=false`);

          if (response.data.success) {
            successCount++;
          } else {
            failCount++;
            console.error(`Failed to delete procurement ${uid}:`, response.data.message);
          }
        } catch (error) {
          failCount++;
          console.error(`Error deleting procurement ${uid}:`, error);
        }
      }

      toast.dismiss(loadingToast);

      if (successCount > 0) {
        if (deleteTarget === "selected") {
          if (failCount === 0) {
            toast.success(`Successfully deleted ${successCount} procurement(s)`);
          } else {
            toast.success(`Deleted ${successCount} procurement(s), ${failCount} failed`);
          }
        } else {
          if (failCount === 0) {
            toast.success("Procurement deleted successfully");
          } else {
            toast.error("Failed to delete procurement");
          }
        }
      } else if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} procurement(s)`);
      }

      await loadProcurements();

    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("An error occurred while deleting procurements");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteIds([]);
      setDeleteLoading(false);

      if (successCount > 0) {
        setSelectedProcurements(new Set());
      }
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      currentPage: 1
    }));
  };

  // Get current date for date inputs
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Get unique values for filter dropdowns from current data
  const uniqueSourceTypes = useMemo(() => {
    const types = [...new Set(procurements.map(p => p.sourceType).filter(Boolean))];
    return types.sort();
  }, [procurements]);

  const uniqueBreeds = useMemo(() => {
    const breeds = [...new Set(procurements.map(p => p.breed).filter(Boolean))];
    return breeds.sort();
  }, [procurements]);

  const totalDisplayedRecords = filteredProcurements.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procurement Management</h1>
          <p className="text-gray-600">Manage animal procurement records</p>
        </div>
        <button
          onClick={loadProcurements}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
          disabled={loading}
        >
          <span>Refresh</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Left Side: Search and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Animal ID, Tag ID, Officer..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50"
                value={searchInput}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {totalDisplayedRecords} found
                  </span>
                </div>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 text-sm transition-all justify-center md:justify-start ${showFilters
                ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white border-transparent"
                : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {isFilterApplied && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary-200 text-primary-800 rounded-full text-xs">
                  •
                </span>
              )}
            </button>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
            {/* Bulk Delete Button */}
            {selectedProcurements.size > 0 && (
              <button
                onClick={() => handleBulkDelete(selectedProcurements)}
                className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                disabled={loading || deleteLoading}
              >
                <HiOutlineTrash className="w-4 h-4" />
                Delete ({selectedProcurements.size})
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-5 bg-primary-50/50 rounded-xl border border-primary-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Source Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Type
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                  value={tempFilters.sourceType || ""}
                  onChange={(e) => handleFilterChange("sourceType", e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Farm">Farm</option>
                  <option value="Bazaar">Bazaar</option>
                </select>
              </div>

              {/* Breed Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                  value={tempFilters.breed || ""}
                  onChange={(e) => handleFilterChange("breed", e.target.value)}
                >
                  <option value="">All Breeds</option>
                  <option value="Gir">Gir</option>
                  <option value="Sahiwal">Sahiwal</option>
                  <option value="Jersey">Jersey</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date Range Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                    value={tempFilters.fromDate || ""}
                    max={getCurrentDate()}
                    onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                    value={tempFilters.toDate || ""}
                    max={getCurrentDate()}
                    min={tempFilters.fromDate || undefined}
                    onChange={(e) => handleFilterChange("toDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4">
              <div className="text-sm text-gray-600 w-full xs:w-auto">
                {isFilterApplied && (
                  <div className="flex flex-wrap items-center gap-2 bg-gradient-to-r from-primary-100 to-primary-50 px-3 py-2 rounded-lg border border-primary-200">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs">
                      <Filter className="w-3 h-3 mr-1" />
                      Filters Applied
                    </span>
                    <span className="text-primary-700 text-xs">
                      {Object.keys(appliedFilters).length > 0 &&
                        Object.keys(appliedFilters).filter(k => appliedFilters[k]).map(key => {
                          if (key === 'fromDate' || key === 'toDate') {
                            return key === 'fromDate' ? `From: ${appliedFilters[key]}` : `To: ${appliedFilters[key]}`;
                          }
                          return `${key}: ${appliedFilters[key]}`;
                        }).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 w-full xs:w-auto justify-start xs:justify-end">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300 whitespace-nowrap"
                >
                  <X size={14} className="inline mr-1" />
                  Clear All
                </button>
                <button
                  onClick={handleCancelFilters}
                  className="px-4 py-2 text-sm text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors border border-primary-300 whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedProcurements}
        loading={loading || deleteLoading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        addButtonLabel="Add Procurement"
        emptyStateMessage="No procurement records found. Try adjusting your filters or add new procurement."
        loadingMessage="Loading procurement data..."
        enableSelection={true}
        enablePagination={true}
        selectedRows={selectedProcurements}
        onSelectRow={toggleSelectProcurement}
        onSelectAll={toggleSelectAll}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalRecords: pagination.totalRecords,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
          limit: pagination.limit,
          limitOptions: [5, 10, 25, 50, 100]
        }}
        hideAddButton={true}
        disableInternalDeleteModal={true}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="relative w-full max-w-md bg-white rounded-md shadow-xl mx-2">
            <div className="flex justify-center mb-4 mt-4">
              <div className="p-3 bg-red-50 rounded-full">
                <HiOutlineTrash className="w-10 h-10 text-red-500" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed p-3">
                {deleteTarget === "selected"
                  ? `You're about to delete ${deleteIds?.length || 0} selected procurement(s). This action cannot be undone.`
                  : "You're about to delete this procurement record. This action cannot be undone."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 pb-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                  setDeleteIds([]);
                  setDeleteLoading(false);
                }}
                className="flex-1 px-2 sm:px-5 py-1 border sm:py-2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150 text-sm font-medium focus:outline-none"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 px-2 sm:px-5 py-1 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-150 text-sm font-medium focus:outline-none shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementList;