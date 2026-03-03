import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Minus,
  Calendar,
  Filter,
  X
} from "lucide-react";
import {
  FaDownload,
  FaPrint,
  FaUserPlus
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi";
import DataTable from "../../../components/common/Table/DataTable";
import api from "../../../services/api/api";
import { Endpoints } from "../../../services/api/EndPoint";
import { PATHROUTES } from "../../../routes/pathRoutes";

const BrokersList = () => {
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search state - separate input and debounced term
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);

  // Filter UI state
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({});
  const [filters, setFilters] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  });

  // Selection state
  const [selectedBrokers, setSelectedBrokers] = useState(new Set());

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sorting state
  const [sortCycle, setSortCycle] = useState({
    key: "createdAt",
    step: 2, // 0: normal, 1: asc, 2: desc
  });

  // Initialize tempFilters when component mounts
  useEffect(() => {
    setTempFilters(filters);

    // Check if any filters are applied
    const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);
    setAppliedFilters(filters);
  }, [filters]);

  // Helper function to handle null/undefined values
  const getValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "N/A" ||
      value === "null" ||
      value === "undefined"
    ) {
      return "";
    }
    return String(value).trim();
  };

  // Fetch brokers with API
  const fetchBrokers = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      console.log("Fetching with search:", search);

      const url = `${Endpoints.GET_BROKER}?page=${page}&limit=${pagination.limit}&search=${encodeURIComponent(search)}`;
      console.log("API URL:", url);

      const response = await api.get(url);

      if (response.data.success) {
        const brokersData = response.data.data.map(broker => ({
          id: broker.uid,
          uid: getValue(broker.uid),
          fullName: getValue(broker.name),
          mobile: getValue(broker.phone),
          aadharNumber: broker.aadhaarNumber,
          profileImg: broker.profileImg,
          aadhaarFile: broker.aadhaarFile,
          createdAt: broker.createdAt
        }));

        setBrokers(brokersData);
        setFilteredBrokers(brokersData);

        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalRecords: response.data.pagination.totalRecords,
          limit: response.data.pagination.limit
        });
      }
    } catch (error) {
      console.error('Error fetching brokers:', error);
      toast.error("Failed to fetch brokers");
      setBrokers([]);
      setFilteredBrokers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      console.log("Setting search term to:", searchInput);
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
  const applyFilters = useCallback((filterValues, brokersData = brokers) => {
    let filtered = [...brokersData];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(broker =>
        broker.uid.toLowerCase().includes(searchLower) ||
        broker.fullName.toLowerCase().includes(searchLower) ||
        broker.mobile.toLowerCase().includes(searchLower) ||
        (broker.aadharNumber && broker.aadharNumber.toLowerCase().includes(searchLower))
      );
    }

    // Apply aadhar availability filter
    if (filterValues.aadharStatus) {
      if (filterValues.aadharStatus === 'with') {
        filtered = filtered.filter(broker => broker.aadharNumber && broker.aadharNumber !== "" && broker.aadharNumber !== null);
      } else if (filterValues.aadharStatus === 'without') {
        filtered = filtered.filter(broker => !broker.aadharNumber || broker.aadharNumber === "" || broker.aadharNumber === null);
      }
    }

    // Apply date range filter
    if (filterValues.fromDate || filterValues.toDate) {
      filtered = filtered.filter(broker => {
        const brokerDate = new Date(broker.createdAt);

        if (filterValues.fromDate) {
          const fromDate = new Date(filterValues.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (brokerDate < fromDate) return false;
        }

        if (filterValues.toDate) {
          const toDate = new Date(filterValues.toDate);
          toDate.setHours(23, 59, 59, 999);
          if (brokerDate > toDate) return false;
        }

        return true;
      });
    }

    setFilteredBrokers(filtered);

    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalRecords: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.limit)
    }));

  }, [searchTerm, brokers]);

  // Fetch when search term changes
  useEffect(() => {
    if (brokers.length > 0) {
      applyFilters(filters);
    }
  }, [searchTerm, filters, applyFilters, brokers]);

  // Fetch when search term or pagination changes
  useEffect(() => {
    fetchBrokers(pagination.currentPage, searchTerm);
  }, [searchTerm, pagination.currentPage, pagination.limit, fetchBrokers]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("Search input changed:", value);
    setSearchInput(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    fetchBrokers(1, "");
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

    setFilters(tempFilters);
    applyFilters(tempFilters, brokers);
    setAppliedFilters(tempFilters);

    // Check if any filters are applied
    const hasAppliedFilters = Object.keys(tempFilters).some(key => tempFilters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);

    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      aadharStatus: "",
      fromDate: "",
      toDate: ""
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setAppliedFilters({});
    setIsFilterApplied(false);
    applyFilters(emptyFilters, brokers);
    setShowFilters(false);
  };

  const handleCancelFilters = () => {
    setTempFilters(filters);
    setShowFilters(false);
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

  // Sorting handler
  const requestSort = useCallback((key) => {
    setSortCycle((prev) => {
      if (prev.key !== key) {
        return { key, step: 1 };
      }
      const nextStep = (prev.step + 1) % 3;
      return { key, step: nextStep };
    });
  }, []);

  // Apply sorting to data
  const sortedBrokers = useMemo(() => {
    if (sortCycle.step === 0) {
      return filteredBrokers;
    }

    return [...filteredBrokers].sort((a, b) => {
      const key = sortCycle.key;
      let aValue = a[key] ?? "";
      let bValue = b[key] ?? "";

      if (key === 'aadharNumber') {
        aValue = aValue || '';
        bValue = bValue || '';
      }

      if (sortCycle.step === 1) {
        if (key === 'createdAt') {
          return new Date(aValue) - new Date(bValue);
        }
        return String(aValue).localeCompare(String(bValue));
      } else {
        if (key === 'createdAt') {
          return new Date(bValue) - new Date(aValue);
        }
        return String(bValue).localeCompare(String(aValue));
      }
    });
  }, [filteredBrokers, sortCycle]);

  // Get sort icon
  const getSortIcon = useCallback(
    (key) => {
      if (sortCycle.key !== key) {
        return <Minus className="ml-1 text-gray-400" size={16} />;
      }

      if (sortCycle.step === 0) {
        return <Minus className="ml-1 text-gray-400" size={16} />;
      } else if (sortCycle.step === 1) {
        return <ChevronUp className="ml-1 text-gray-600" size={16} />;
      } else {
        return <ChevronDown className="ml-1 text-gray-600" size={16} />;
      }
    },
    [sortCycle]
  );

  // Table columns
  const columns = useMemo(() => [
    {
      key: "uid",
      label: "Broker ID",
      sortable: true,
      onSort: () => requestSort('uid'),
      sortIcon: getSortIcon('uid'),
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="font-medium text-gray-900">{item.uid}</div>
        </div>
      )
    },
    {
      key: "fullName",
      label: "Name",
      sortable: true,
      onSort: () => requestSort('fullName'),
      sortIcon: getSortIcon('fullName'),
      render: (item) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium text-gray-900">{item.fullName}</div>
          </div>
        </div>
      )
    },
    {
      key: "mobile",
      label: "Phone",
      sortable: true,
      onSort: () => requestSort('mobile'),
      sortIcon: getSortIcon('mobile'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="font-medium text-gray-900">{item.mobile}</div>
        </div>
      )
    },
    {
      key: "aadharNumber",
      label: "Aadhar Number",
      sortable: true,
      onSort: () => requestSort('aadharNumber'),
      sortIcon: getSortIcon('aadharNumber'),
      render: (item) => {
        const hasAadhar = item.aadharNumber && item.aadharNumber !== "" && item.aadharNumber !== null;

        return (
          <div className="flex items-center gap-2">
            <div>
              {hasAadhar ? (
                <div className="font-medium text-gray-900">
                  {item.aadharNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                </div>
              ) : (
                <div className="font-medium text-gray-400 italic">N/A</div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      onSort: () => requestSort('createdAt'),
      sortIcon: getSortIcon('createdAt'),
      render: (item) => {
        const date = new Date(item.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });

        return (
          <div className="flex items-center gap-2">
            <div>
              <div className="font-medium text-gray-900">{formattedDate}</div>
            </div>
          </div>
        );
      }
    },
  ], [getSortIcon, requestSort]);

  // Selection handlers
  const toggleSelectBroker = (uid) => {
    if (!uid) return;
    setSelectedBrokers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uid)) {
        newSet.delete(uid);
      } else {
        newSet.add(uid);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedBrokers.size === filteredBrokers.length && filteredBrokers.length > 0) {
      setSelectedBrokers(new Set());
    } else {
      setSelectedBrokers(new Set(filteredBrokers.map(broker => broker.uid).filter(Boolean)));
    }
  };

  // Event handlers
  const handleAddBroker = () => {
    navigate(PATHROUTES.brokerRegistration);
  };

  const handleEdit = (broker) => {
    navigate(`${PATHROUTES.editBroker}/${broker.id}`, {
      state: {
        uid: broker.uid,
        fullName: broker.fullName,
        mobile: broker.mobile,
        aadharNumber: broker.aadharNumber,
        profileImg: broker.profileImg,
        aadhaarFile: broker.aadhaarFile
      }
    });
  };

  const handleView = (broker) => {
    navigate(`${PATHROUTES.brokerDetails}/${broker.uid}`, {
      state: { broker }
    });
  };

  const handleDelete = (uid) => {
    if (!uid) {
      toast.error("Cannot delete broker: Invalid broker ID");
      return;
    }
    setDeleteTarget("single");
    setDeleteId(uid);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedBrokers.size === 0) {
      toast.error("Please select brokers to delete");
      return;
    }
    setDeleteTarget("selected");
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // Prevent double submission
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      setLoading(true);

      if (deleteTarget === "selected") {
        const deletePromises = Array.from(selectedBrokers).map((uid) =>
          uid ? api.delete(Endpoints.DELETE_BROKER(uid)) : Promise.reject(new Error("Invalid broker ID"))
        );

        const results = await Promise.allSettled(deletePromises);

        const successfulDeletes = results.filter(r => r.status === 'fulfilled');

        if (successfulDeletes.length > 0) {
          await fetchBrokers(pagination.currentPage, searchTerm);

          const successfulUids = successfulDeletes.map((_, index) =>
            Array.from(selectedBrokers)[index]
          ).filter(Boolean);

          setSelectedBrokers(prev => {
            const newSet = new Set(prev);
            successfulUids.forEach(uid => newSet.delete(uid));
            return newSet;
          });

          toast.success(`${successfulDeletes.length} broker(s) deleted successfully!`);
        }

      } else if (deleteTarget === "single" && deleteId) {
        await api.delete(Endpoints.DELETE_BROKER(deleteId));
        await fetchBrokers(pagination.currentPage, searchTerm);
        setSelectedBrokers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deleteId);
          return newSet;
        });
        toast.success("Broker deleted successfully!");
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error(error?.response?.data?.message || "Failed to delete broker");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteId(null);
      setIsDeleting(false);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    toast.success("Refreshing brokers data...");
    fetchBrokers(pagination.currentPage, searchTerm);
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const totalDisplayedRecords = pagination.totalRecords;

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Broker</h1>
            <p className="text-gray-600">Manage Brokers for animal procurement</p>
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
            <button
              onClick={handleAddBroker}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
            >
              <FaUserPlus className="w-4 h-4" />
              <span>Add Broker</span>
            </button>
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
                  placeholder="Search by Broker ID, Name, Mobile, Aadhar..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {filteredBrokers.length} found
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
              {selectedBrokers.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                >
                  <MdDelete className="w-4 h-4" />
                  Delete ({selectedBrokers.size})
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-5 bg-primary-50/50 rounded-xl border border-primary-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Aadhar Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Status
                  </label>
                  <select
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                    value={tempFilters.aadharStatus || ""}
                    onChange={(e) => handleFilterChange("aadharStatus", e.target.value)}
                  >
                    <option value="">All Brokers</option>
                    <option value="with">With Aadhar</option>
                    <option value="without">Without Aadhar</option>
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
                            if (key === 'aadharStatus') {
                              return `Aadhar: ${appliedFilters[key] === 'with' ? 'With' : 'Without'}`;
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
          data={sortedBrokers}
          loading={loading}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          addButtonLabel="Add New Broker"
          emptyStateMessage="No Brokers found. Try adjusting your search or filters."
          loadingMessage="Loading brokers data..."
          enableSelection={true}
          enablePagination={true}
          selectedRows={selectedBrokers}
          onSelectRow={toggleSelectBroker}
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
                  ? `You're about to delete ${selectedBrokers.size} selected broker(s). This action cannot be undone.`
                  : "You're about to delete this broker. This action cannot be undone."}
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

export default BrokersList;