import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Calendar,
  ArrowRight,
  HeartPulse,
  Milk,
  Circle,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Minus,
} from "lucide-react";
import { BiSearch } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { HiOutlineTrash } from 'react-icons/hi';
import DataTable from "../../../components/common/Table/DataTable";
import { GiCow } from "react-icons/gi";
import { PATHROUTES } from "../../../routes/pathRoutes";

// Mock data for animals - updated with gender field
const MOCK_ANIMALS = [
  {
    id: 1,
    earTagId: "TAG-001",
    vendorName: "Rajesh Kumar",
    vendorId: "V001",
    vendorMobile: "9876543210",
    animalType: "Cow",
    breed: "Gir",
    gender: "Female",
    pricing: "₹85,000",
    calvingStatus: "Milking",
    calfTagId: "CALF001",
    calfGender: "Female",
    lactation: 3,
    ageYears: 5,
    ageMonths: 2,
    calvingDate: "2024-12-15",
    examDate: "2024-12-20",
    examineBy: "Dr. Sharma",
    receivingDate: "2024-12-10",
    remark: "Healthy animal",
    createdAt: "2024-01-15T10:30:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasRearImage: true,
    hasVideo: true
  },
  {
    id: 2,
    earTagId: "TAG-002",
    vendorName: "Suresh Patel",
    vendorId: "V002",
    vendorMobile: "9876543211",
    animalType: "Buffalo",
    breed: "Murrah",
    gender: "Female",
    pricing: "₹95,000",
    calvingStatus: "Pregnant",
    calfTagId: "",
    calfGender: "",
    lactation: 2,
    ageYears: 4,
    ageMonths: 0,
    calvingDate: "",
    examDate: "2024-12-18",
    examineBy: "Dr. Patel",
    receivingDate: "2024-12-12",
    remark: "Due in 2 months",
    createdAt: "2024-01-20T14:45:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasRearImage: true,
    hasVideo: false
  },
  {
    id: 3,
    earTagId: "TAG-003",
    vendorName: "Mohan Singh",
    vendorId: "V003",
    vendorMobile: "9876543212",
    animalType: "Goat",
    breed: "Sirohi",
    gender: "Female",
    pricing: "₹12,000",
    calvingStatus: "Pregnant",
    calfTagId: "",
    calfGender: "",
    lactation: 0,
    ageYears: 2,
    ageMonths: 6,
    calvingDate: "",
    examDate: "2024-12-15",
    examineBy: "Dr. Singh",
    receivingDate: "2024-12-14",
    remark: "Young animal",
    createdAt: "2024-01-25T09:15:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasRearImage: false,
    hasVideo: false
  }
];

const ProcuredAnimals = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);

  // Search state - separate input and debounced term
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
  const [selectedAnimals, setSelectedAnimals] = useState(new Set());

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  });

  const [stats, setStats] = useState({
    totalAnimals: 0,
    numberOfBreeds: 0,
    milkingAnimals: 0,
    pregnantAnimals: 0,
  });

  // Initialize tempFilters when component mounts
  useEffect(() => {
    setTempFilters(filters);

    // Check if any filters are applied
    const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);
    setAppliedFilters(filters);
  }, [filters]);

  // Fetch animals with simulated API call
  const fetchAnimals = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Calculate unique breeds count
      const uniqueBreeds = new Set(MOCK_ANIMALS.map(a => a.breed));

      const milkingCount = MOCK_ANIMALS.filter(a => a.calvingStatus === "Milking").length;
      const pregnantCount = MOCK_ANIMALS.filter(a => a.calvingStatus === "Pregnant").length;

      setStats({
        totalAnimals: MOCK_ANIMALS.length,
        numberOfBreeds: uniqueBreeds.size,
        milkingAnimals: milkingCount,
        pregnantAnimals: pregnantCount,
      });

      setAnimals(MOCK_ANIMALS);
      setFilteredAnimals(MOCK_ANIMALS);

      setPagination(prev => ({
        ...prev,
        totalRecords: MOCK_ANIMALS.length,
        totalPages: Math.ceil(MOCK_ANIMALS.length / prev.limit)
      }));

    } catch (error) {
      toast.error("Failed to fetch animals");
      setAnimals([]);
      setFilteredAnimals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

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
    let filtered = [...MOCK_ANIMALS];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(animal =>
        animal.earTagId.toLowerCase().includes(searchLower) ||
        animal.breed.toLowerCase().includes(searchLower) ||
        animal.gender.toLowerCase().includes(searchLower) ||
        animal.calvingStatus.toLowerCase().includes(searchLower)
      );
    }

    // Apply animal type filter
    if (filterValues.animalType) {
      filtered = filtered.filter(animal => animal.animalType === filterValues.animalType);
    }

    // Apply calving status filter
    if (filterValues.calvingStatus) {
      filtered = filtered.filter(animal => animal.calvingStatus === filterValues.calvingStatus);
    }

    // Apply date range filter
    if (filterValues.fromDate || filterValues.toDate) {
      filtered = filtered.filter(animal => {
        const animalDate = new Date(animal.createdAt);

        if (filterValues.fromDate) {
          const fromDate = new Date(filterValues.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (animalDate < fromDate) return false;
        }

        if (filterValues.toDate) {
          const toDate = new Date(filterValues.toDate);
          toDate.setHours(23, 59, 59, 999);
          if (animalDate > toDate) return false;
        }

        return true;
      });
    }

    setFilteredAnimals(filtered);

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

    // Check if any filters are applied
    const hasAppliedFilters = Object.keys(tempFilters).some(key => tempFilters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);

    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      animalType: "",
      calvingStatus: "",
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
  const sortedAnimals = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredAnimals;

    return [...filteredAnimals].sort((a, b) => {
      const key = sortConfig.key;
      let aValue = a[key] ?? "";
      let bValue = b[key] ?? "";

      if (key === 'createdAt') {
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
  }, [filteredAnimals, sortConfig]);

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

  // Get calving status badge
  const getCalvingStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'milking':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            <Milk className="mr-1" size={12} />
            Milking
          </span>
        );
      case 'pregnant':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            <HeartPulse className="mr-1" size={12} />
            Pregnant
          </span>
        );
    }
  };

  // Table columns - Only Ear Tag ID, Breed, Gender, Calving Status, Action
  const columns = useMemo(() => [
    {
      key: "earTagId",
      label: "Ear Tag ID",
      sortable: true,
      onSort: () => requestSort('earTagId'),
      sortIcon: getSortIcon('earTagId'),
      render: (item) => (
        <div className="font-medium text-gray-900">{item.earTagId}</div>
      )
    },
    {
      key: "breed",
      label: "Breed",
      sortable: true,
      onSort: () => requestSort('breed'),
      sortIcon: getSortIcon('breed'),
      render: (item) => (
        <div className="text-gray-900">{item.breed}</div>
      )
    },
    {
      key: "gender",
      label: "Gender",
      sortable: true,
      onSort: () => requestSort('gender'),
      sortIcon: getSortIcon('gender'),
      render: (item) => (
        <div className="text-gray-900 capitalize">{item.gender}</div>
      )
    },
    {
      key: "calvingStatus",
      label: "Calving Status",
      sortable: true,
      onSort: () => requestSort('calvingStatus'),
      sortIcon: getSortIcon('calvingStatus'),
      render: (item) => (
        <div>
          {getCalvingStatusBadge(item.calvingStatus)}
        </div>
      )
    }
  ], [getSortIcon, requestSort]);

  // Selection handlers
  const toggleSelectAnimal = (id) => {
    if (!id) return;
    setSelectedAnimals((prev) => {
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
    const allIds = filteredAnimals.map(animal => animal.id).filter(Boolean);
    if (selectedAnimals.size === allIds.length && allIds.length > 0) {
      setSelectedAnimals(new Set());
    } else {
      setSelectedAnimals(new Set(allIds));
    }
  };

  // Event handlers
  const handleEdit = (animal) => {
    navigate(`${PATHROUTES.editAnimal}/${animal.earTagId}`, { state: { animal } });
  };

  const handleView = (animal) => {
    navigate(`${PATHROUTES.animalDetails}/${animal.earTagId}`, {
      state: { animal }
    });
  };

  const handleDelete = (id) => {
    const animal = animals.find(a => a.id === id);
    if (!animal) {
      toast.error("Cannot delete animal: Invalid animal ID");
      return;
    }
    setDeleteTarget("single");
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = (ids) => {
    if (!ids || ids.size === 0) {
      toast.error("Please select animals to delete");
      return;
    }
    setDeleteTarget("selected");
    setDeleteId(Array.from(ids));
    setShowDeleteModal(true);
  };

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
        setAnimals(prev => prev.filter(animal => !idsToDelete.includes(animal.id)));
        setFilteredAnimals(prev => prev.filter(animal => !idsToDelete.includes(animal.id)));

        // Clear selection
        setSelectedAnimals(new Set());

        // Update stats after deletion
        const remainingAnimals = animals.filter(animal => !idsToDelete.includes(animal.id));
        const uniqueBreeds = new Set(remainingAnimals.map(a => a.breed));

        setStats(prev => ({
          ...prev,
          totalAnimals: remainingAnimals.length,
          numberOfBreeds: uniqueBreeds.size,
          milkingAnimals: remainingAnimals.filter(a => a.calvingStatus === "Milking").length,
          pregnantAnimals: remainingAnimals.filter(a => a.calvingStatus === "Pregnant").length,
        }));

        // Update pagination
        setPagination(prev => ({
          ...prev,
          totalRecords: filteredAnimals.length - idsToDelete.length,
          totalPages: Math.ceil((filteredAnimals.length - idsToDelete.length) / prev.limit)
        }));

        toast.success(`${idsToDelete.length} animal(s) deleted successfully!`);

      } else if (deleteTarget === "single" && deleteId) {
        // Simulate API call for single delete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Remove from local state
        setAnimals(prev => prev.filter(animal => animal.id !== deleteId));
        setFilteredAnimals(prev => prev.filter(animal => animal.id !== deleteId));

        // Remove from selection if present
        setSelectedAnimals((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deleteId);
          return newSet;
        });

        // Update stats after deletion
        const remainingAnimals = animals.filter(animal => animal.id !== deleteId);
        const uniqueBreeds = new Set(remainingAnimals.map(a => a.breed));

        setStats(prev => ({
          ...prev,
          totalAnimals: remainingAnimals.length,
          numberOfBreeds: uniqueBreeds.size,
          milkingAnimals: remainingAnimals.filter(a => a.calvingStatus === "Milking").length,
          pregnantAnimals: remainingAnimals.filter(a => a.calvingStatus === "Pregnant").length,
        }));

        // Update pagination
        setPagination(prev => ({
          ...prev,
          totalRecords: filteredAnimals.length - 1,
          totalPages: Math.ceil((filteredAnimals.length - 1) / prev.limit)
        }));

        toast.success("Animal deleted successfully!");
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("Failed to delete animal");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteId(null);
      setIsDeleting(false);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    toast.success("Refreshing animals data...");
    fetchAnimals();
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
  const uniqueAnimalTypes = useMemo(() => {
    const types = [...new Set(MOCK_ANIMALS.map(a => a.animalType))];
    return types.sort();
  }, []);

  const totalDisplayedRecords = filteredAnimals.length;

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Procured Animal Lists</h1>
            <p className="text-gray-600">View and manage all registered animals</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
              disabled={loading}
            >
              <span>Refresh</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Animals */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <GiCow className="text-primary-500 opacity-60" size={40} />
              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalAnimals}</h3>
                <p className="text-gray-600">Total Animals</p>
              </div>
            </div>
          </div>

          {/* Number of Breeds */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <GiCow className="text-green-500 opacity-60" size={40} />
              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-900">{stats.numberOfBreeds}</h3>
                <p className="text-gray-600">Number of Breeds</p>
              </div>
            </div>
          </div>

          {/* Milking Animals */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <Milk className="text-purple-500 opacity-60" size={40} />
              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-900">{stats.milkingAnimals}</h3>
                <p className="text-gray-600">Milking Animals</p>
              </div>
            </div>
          </div>

          {/* Pregnant Animals */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <HeartPulse className="text-pink-500 opacity-60" size={40} />
              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-900">{stats.pregnantAnimals}</h3>
                <p className="text-gray-600">Pregnant Animals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Action Menu */}
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
                  placeholder="Search by Ear Tag, Breed, Gender, Status..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {filteredAnimals.length} found
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
              {selectedAnimals.size > 0 && (
                <button
                  onClick={() => handleBulkDelete(selectedAnimals)}
                  className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                >
                  <MdDelete className="w-4 h-4" />
                  Delete ({selectedAnimals.size})
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-5 bg-primary-50/50 rounded-xl border border-primary-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Animal Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Animal Type
                  </label>
                  <select
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                    value={tempFilters.animalType || ""}
                    onChange={(e) => handleFilterChange("animalType", e.target.value)}
                  >
                    <option value="">All Types</option>
                    {uniqueAnimalTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Calving Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calving Status
                  </label>
                  <select
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                    value={tempFilters.calvingStatus || ""}
                    onChange={(e) => handleFilterChange("calvingStatus", e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Milking">Milking</option>
                    <option value="Pregnant">Pregnant</option>
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
          data={sortedAnimals}
          loading={loading}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          addButtonLabel="Register New Animal"
          emptyStateMessage="No animals found. Try adjusting your filters or register new animals."
          loadingMessage="Loading animals data..."
          enableSelection={true}
          enablePagination={true}
          selectedRows={selectedAnimals}
          onSelectRow={toggleSelectAnimal}
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
      </div>

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
                  ? `You're about to delete ${deleteId?.length || 0} selected animal(s). This action cannot be undone.`
                  : "You're about to delete this animal. This action cannot be undone."}
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
    </>
  );
};

export default ProcuredAnimals;