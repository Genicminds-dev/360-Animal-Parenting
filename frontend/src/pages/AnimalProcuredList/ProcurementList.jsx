// pages/procurement/ProcurementList.jsx
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
  const [deleteId, setDeleteId] = useState(null);

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
    limit: 10
  });

  // Mock Data updated to match form fields
  const MOCK_PROCUREMENTS = [
    {
      id: 1,
      animalId: "ANM001", // New field
      tagId: "TAG-001",
      procurementOfficer: "Rajesh Kumar",
      sourceType: "Farm",
      sourceLocation: "Green Valley Farm, Pune",
      visitDate: "2024-03-15",
      visitTime: "10:30",
      breederName: "Suresh Patil",
      breederContact: "9876543211",
      breed: "Gir",
      ageYears: "5",
      ageMonths: "6",
      milkingCapacity: "12",
      isCalfIncluded: "no",
      physicalCheck: "Healthy, active",
      fmdDisease: false,
      lsdDisease: false,
      vehicleNo: "MH31AB1234",
      driverName: "Ramesh Kumar",
      driverMobile: "9876543210",
      quarantineCenter: "Central Quarantine Center - Nagpur",
      handoverOfficer: "Priya Sharma",
      beneficiaryId: "BEN001",
      status: "Completed",
      createdAt: "2024-03-15T10:30:00Z"
    },
    {
      id: 2,
      animalId: "ANM002",
      tagId: "TAG-002",
      procurementOfficer: "Priya Sharma",
      sourceType: "Bazaar",
      sourceLocation: "Animal Market, Nagpur",
      visitDate: "2024-03-14",
      visitTime: "09:15",
      breederName: "Mohan Singh",
      breederContact: "8765432112",
      breed: "Sahiwal",
      ageYears: "3",
      ageMonths: "0",
      milkingCapacity: "8",
      isCalfIncluded: "yes",
      physicalCheck: "Good condition",
      fmdDisease: false,
      lsdDisease: false,
      vehicleNo: "MH31CD5678",
      driverName: "Suresh Yadav",
      driverMobile: "8765432109",
      quarantineCenter: "District Quarantine Facility - Pune",
      handoverOfficer: "Amit Patel",
      beneficiaryId: "BEN002",
      status: "In Transit",
      createdAt: "2024-03-14T09:15:00Z"
    },
    {
      id: 3,
      animalId: "ANM003",
      tagId: "TAG-003",
      procurementOfficer: "Amit Patel",
      sourceType: "Farm",
      sourceLocation: "Dairy Farm, Ahmednagar",
      visitDate: "2024-03-13",
      visitTime: "14:45",
      breederName: "Rajendra Yadav",
      breederContact: "7654321123",
      breed: "Jersey",
      ageYears: "4",
      ageMonths: "2",
      milkingCapacity: "10",
      isCalfIncluded: "no",
      physicalCheck: "Healthy",
      fmdDisease: false,
      lsdDisease: false,
      vehicleNo: "MH31EF9012",
      driverName: "Vikram Singh",
      driverMobile: "7654321098",
      quarantineCenter: "Regional Animal Care Center - Mumbai",
      handoverOfficer: "Sunita Reddy",
      beneficiaryId: "BEN003",
      status: "Completed",
      createdAt: "2024-03-13T14:45:00Z"
    },
    {
      id: 4,
      animalId: "ANM004",
      tagId: "TAG-004",
      procurementOfficer: "Sunita Reddy",
      sourceType: "Bazaar",
      sourceLocation: "Livestock Market, Aurangabad",
      visitDate: "2024-03-12",
      visitTime: "11:30",
      breederName: "Kavita Deshmukh",
      breederContact: "6543211234",
      breed: "Murrah",
      ageYears: "6",
      ageMonths: "0",
      milkingCapacity: "15",
      isCalfIncluded: "no",
      physicalCheck: "Good",
      fmdDisease: false,
      lsdDisease: false,
      vehicleNo: "MH31GH3456",
      driverName: "Rajesh Patil",
      driverMobile: "6543210987",
      quarantineCenter: "Central Quarantine Center - Nagpur",
      handoverOfficer: "Vikram Singh",
      beneficiaryId: "BEN004",
      status: "Pending",
      createdAt: "2024-03-12T11:30:00Z"
    },
    {
      id: 5,
      animalId: "ANM005",
      tagId: "TAG-005",
      procurementOfficer: "Vikram Singh",
      sourceType: "Farm",
      sourceLocation: "Organic Dairy, Nashik",
      visitDate: "2024-03-11",
      visitTime: "16:20",
      breederName: "Harish Chavan",
      breederContact: "5432109877",
      breed: "Holstein Friesian",
      ageYears: "3",
      ageMonths: "6",
      milkingCapacity: "18",
      isCalfIncluded: "yes",
      physicalCheck: "Excellent",
      fmdDisease: false,
      lsdDisease: false,
      vehicleNo: "MH31IJ7890",
      driverName: "Mohan Kumar",
      driverMobile: "5432109876",
      quarantineCenter: "Rural Quarantine Unit - Aurangabad",
      handoverOfficer: "Rajesh Kumar",
      beneficiaryId: "BEN005",
      status: "Completed",
      createdAt: "2024-03-11T16:20:00Z"
    }
  ];

  // Initialize tempFilters when component mounts
  useEffect(() => {
    setTempFilters(filters);
    const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);
    setAppliedFilters(filters);
  }, [filters]);

  // Load procurements
  useEffect(() => {
    loadProcurements();
  }, []);

  const loadProcurements = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      setProcurements(MOCK_PROCUREMENTS);
      setFilteredProcurements(MOCK_PROCUREMENTS);

      setPagination(prev => ({
        ...prev,
        totalRecords: MOCK_PROCUREMENTS.length,
        totalPages: Math.ceil(MOCK_PROCUREMENTS.length / prev.limit)
      }));

    } catch (error) {
      console.error('Error loading procurements:', error);
      toast.error("Failed to fetch procurements");
      setProcurements([]);
      setFilteredProcurements([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Apply filters function
  const applyFilters = useCallback((filterValues) => {
    let filtered = [...MOCK_PROCUREMENTS];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(proc =>
        proc.animalId?.toLowerCase().includes(searchLower) ||
        proc.tagId?.toLowerCase().includes(searchLower) ||
        proc.procurementOfficer?.toLowerCase().includes(searchLower) ||
        proc.breederName?.toLowerCase().includes(searchLower) ||
        proc.sourceLocation?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filterValues.status) {
      filtered = filtered.filter(proc => proc.status === filterValues.status);
    }

    // Apply source type filter
    if (filterValues.sourceType) {
      filtered = filtered.filter(proc => proc.sourceType === filterValues.sourceType);
    }

    // Apply breed filter
    if (filterValues.breed) {
      filtered = filtered.filter(proc => proc.breed === filterValues.breed);
    }

    // Apply date range filter
    if (filterValues.fromDate || filterValues.toDate) {
      filtered = filtered.filter(proc => {
        const procDate = new Date(proc.visitDate);

        if (filterValues.fromDate) {
          const fromDate = new Date(filterValues.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (procDate < fromDate) return false;
        }

        if (filterValues.toDate) {
          const toDate = new Date(filterValues.toDate);
          toDate.setHours(23, 59, 59, 999);
          if (procDate > toDate) return false;
        }

        return true;
      });
    }

    setFilteredProcurements(filtered);

    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalRecords: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.limit)
    }));

  }, [searchTerm]);

  // Fetch when search term changes
  useEffect(() => {
    applyFilters(filters);
  }, [searchTerm, filters, applyFilters]);

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

    setFilters(tempFilters);
    applyFilters(tempFilters);
    setAppliedFilters(tempFilters);

    const hasAppliedFilters = Object.keys(tempFilters).some(key => tempFilters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);

    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      status: "",
      sourceType: "",
      breed: "",
      fromDate: "",
      toDate: ""
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setAppliedFilters({});
    setIsFilterApplied(false);
    applyFilters(emptyFilters);
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
    applyFilters(filters);
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

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'In Transit': { color: 'bg-primary-100 text-primary-800', icon: Truck },
      'Pending': { color: 'bg-gray-100 text-gray-800', icon: Clock }
    };
    
    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="mr-1" size={12} />
        {status}
      </span>
    );
  };

  // Table columns - Updated with 7 columns as requested
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
              <div className="text-xs text-gray-500">{item.visitTime}</div>
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

  // Refactored Edit Handler
  const handleEdit = (procurement) => {
    navigate(`/procurement/edit/${procurement.animalId}`, { state: { procurement } });
  };

  // Refactored View Handler
  const handleView = (procurement) => {
    navigate(`${PATHROUTES.animalProcurementView}/${procurement.animalId}`, {
      state: { procurement }
    });
  };
  

  // Refactored Delete Handler
  const handleDelete = (id) => {
    const procurement = procurements.find(p => p.id === id);
    if (!procurement) {
      toast.error("Cannot delete procurement: Invalid procurement ID");
      return;
    }
    setDeleteTarget("single");
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Refactored Bulk Delete Handler
  const handleBulkDelete = (ids) => {
    if (!ids || ids.size === 0) {
      toast.error("Please select procurements to delete");
      return;
    }
    setDeleteTarget("selected");
    setDeleteId(Array.from(ids));
    setShowDeleteModal(true);
  };

  // Refactored Confirm Delete Handler
  const confirmDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      setLoading(true);

      if (deleteTarget === "selected") {
        // Simulate API call for bulk delete
        await new Promise(resolve => setTimeout(resolve, 800));

        // Remove from local state
        const idsToDelete = deleteId;
        setProcurements(prev => prev.filter(procurement => !idsToDelete.includes(procurement.id)));
        setFilteredProcurements(prev => prev.filter(procurement => !idsToDelete.includes(procurement.id)));

        // Clear selection
        setSelectedProcurements(new Set());

        // Update pagination
        setPagination(prev => ({
          ...prev,
          totalRecords: filteredProcurements.length - idsToDelete.length,
          totalPages: Math.ceil((filteredProcurements.length - idsToDelete.length) / prev.limit)
        }));

        toast.success(`${idsToDelete.length} procurement(s) deleted successfully!`);

      } else if (deleteTarget === "single" && deleteId) {
        // Simulate API call for single delete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Remove from local state
        setProcurements(prev => prev.filter(procurement => procurement.id !== deleteId));
        setFilteredProcurements(prev => prev.filter(procurement => procurement.id !== deleteId));

        // Remove from selection if present
        setSelectedProcurements((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deleteId);
          return newSet;
        });

        // Update pagination
        setPagination(prev => ({
          ...prev,
          totalRecords: filteredProcurements.length - 1,
          totalPages: Math.ceil((filteredProcurements.length - 1) / prev.limit)
        }));

        toast.success("Procurement deleted successfully!");
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("Failed to delete procurement");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteId(null);
      setIsDeleting(false);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      currentPage: 1,
      totalPages: Math.ceil(prev.totalRecords / newLimit)
    }));
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Get unique values for filter dropdowns
  const uniqueSourceTypes = useMemo(() => {
    const types = [...new Set(MOCK_PROCUREMENTS.map(p => p.sourceType))];
    return types.sort();
  }, []);

  const uniqueBreeds = useMemo(() => {
    const breeds = [...new Set(MOCK_PROCUREMENTS.map(p => p.breed))];
    return breeds.sort();
  }, []);

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
                    {filteredProcurements.length} found
                  </span>
                </div>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 text-sm transition-all justify-center md:justify-start ${
                showFilters
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                  value={tempFilters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

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
                  {uniqueSourceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
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
                  {uniqueBreeds.map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
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
        loading={loading}
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
          totalRecords: totalDisplayedRecords,
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
                  ? `You're about to delete ${deleteId?.length || 0} selected procurement(s). This action cannot be undone.`
                  : "You're about to delete this procurement record. This action cannot be undone."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 pb-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                  setDeleteId(null);
                  setIsDeleting(false);
                }}
                className="flex-1 px-2 sm:px-5 py-1 border sm:py-2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150 text-sm font-medium focus:outline-none"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-2 sm:px-5 py-1 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-150 text-sm font-medium focus:outline-none shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
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