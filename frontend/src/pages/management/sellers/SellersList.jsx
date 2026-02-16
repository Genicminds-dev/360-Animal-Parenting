// pages/sellers/SellersList.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Minus,
  Store,
  User,
  CreditCard,
  TrendingUp,
  Filter,
  X,
  Calendar,
} from "lucide-react";
import {
  FaDownload,
  FaPrint,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi";
import DataTable from "../../../components/common/Table/DataTable";
import { PATHROUTES } from "../../../routes/pathRoutes";

// Mock data - FRONTEND ONLY with uid as primary identifier
const MOCK_SELLERS = [
  {
    id: 1,
    uid: "SEL001",
    fullName: "Rajesh Kumar",
    mobileNumber: "9876543210",
    gender: "Male",
    state: "Maharashtra",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    uid: "SEL002",
    fullName: "Priya Sharma",
    mobileNumber: "8765432109",
    gender: "Female",
    state: "Delhi",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    uid: "SEL003",
    fullName: "Mohan Singh",
    mobileNumber: "7654321098",
    gender: "Male",
    state: "Karnataka",
    createdAt: "2024-01-25",
  },
  {
    id: 4,
    uid: "SEL004",
    fullName: "Anita Reddy",
    mobileNumber: "6543210987",
    gender: "Female",
    state: "Tamil Nadu",
    createdAt: "2024-01-10",
  },
  {
    id: 5,
    uid: "SEL005",
    fullName: "Vikram Joshi",
    mobileNumber: "5432109876",
    gender: "Male",
    state: "Uttar Pradesh",
    createdAt: "2024-01-18",
  },
];

const SellersList = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search state - separate input and debounced term
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  });

  const [stats, setStats] = useState({
    totalSellers: 0,
    maleSellers: 0,
    femaleSellers: 0,
    activeTransactions: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    gender: "",
    state: "",
    fromDate: "",
    toDate: ""
  });

  // Filter UI state
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Selection state - Store selected IDs (not UIDs) to match DataTable
  const [selectedSellers, setSelectedSellers] = useState(new Set());

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

  // Initialize tempFilters when component mounts
  useEffect(() => {
    setTempFilters(filters);

    // Check if any filters are applied
    const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);
    setAppliedFilters(filters);
  }, [filters]);

  // Fetch sellers with simulated API call
  const fetchSellers = useCallback(async (search = "") => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Apply search filter
      let filtered = [...MOCK_SELLERS];

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(seller =>
          seller.fullName.toLowerCase().includes(searchLower) ||
          seller.uid.toLowerCase().includes(searchLower) ||
          seller.mobileNumber.includes(searchLower) ||
          seller.state.toLowerCase().includes(searchLower)
        );
      }

      // Calculate stats from ORIGINAL data (MOCK_SELLERS), not filtered
      const maleCount = MOCK_SELLERS.filter(s => s.gender === "Male").length;
      const femaleCount = MOCK_SELLERS.filter(s => s.gender === "Female").length;
      const transactionCount = MOCK_SELLERS.filter(s => s.transactionId !== "NA").length;

      setStats({
        totalSellers: MOCK_SELLERS.length,
        maleSellers: maleCount,
        femaleSellers: femaleCount,
        activeTransactions: transactionCount,
      });

      setSellers(filtered);
      setFilteredSellers(filtered);

      setPagination(prev => ({
        ...prev,
        totalRecords: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.limit)
      }));

    } catch (error) {
      toast.error("Failed to fetch sellers");
      setSellers([]);
      setFilteredSellers([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Fetch when search term changes
  useEffect(() => {
    fetchSellers(searchTerm);
  }, [searchTerm, fetchSellers]);

  // Apply filters function
  const applyFilters = useCallback((filterValues) => {
    let filtered = [...MOCK_SELLERS];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.fullName.toLowerCase().includes(searchLower) ||
        seller.uid.toLowerCase().includes(searchLower) ||
        seller.mobileNumber.includes(searchLower) ||
        seller.state.toLowerCase().includes(searchLower)
      );
    }

    // Apply gender filter
    if (filterValues.gender) {
      filtered = filtered.filter(seller => seller.gender === filterValues.gender);
    }

    // Apply state filter
    if (filterValues.state) {
      filtered = filtered.filter(seller => seller.state === filterValues.state);
    }

    // Apply date range filter
    if (filterValues.fromDate || filterValues.toDate) {
      filtered = filtered.filter(seller => {
        const sellerDate = new Date(seller.createdAt);

        if (filterValues.fromDate) {
          const fromDate = new Date(filterValues.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (sellerDate < fromDate) return false;
        }

        if (filterValues.toDate) {
          const toDate = new Date(filterValues.toDate);
          toDate.setHours(23, 59, 59, 999);
          if (sellerDate > toDate) return false;
        }

        return true;
      });
    }

    setFilteredSellers(filtered);
    setSellers(filtered);

    // Update pagination
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalRecords: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.limit)
    }));

    // DO NOT update stats here - stats should remain showing total from original data

  }, [searchTerm]);

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
      gender: "",
      state: "",
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
    fetchSellers("");
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
      currentPage: 1,
      totalPages: Math.ceil(prev.totalRecords / newLimit)
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
  const sortedSellers = useMemo(() => {
    if (sortCycle.step === 0) {
      return filteredSellers;
    }

    return [...filteredSellers].sort((a, b) => {
      const key = sortCycle.key;
      let aValue = a[key] ?? "";
      let bValue = b[key] ?? "";

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
  }, [filteredSellers, sortCycle]);

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
      label: "Seller ID",
      sortable: true,
      onSort: () => requestSort('uid'),
      sortIcon: getSortIcon('uid'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{item.uid}</span>
        </div>
      )
    },
    {
      key: "fullName",
      label: "Full Name",
      sortable: true,
      onSort: () => requestSort('fullName'),
      sortIcon: getSortIcon('fullName'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{item.fullName}</span>
        </div>
      )
    },
    {
      key: "mobileNumber",
      label: "Mobile Number",
      sortable: true,
      onSort: () => requestSort('mobileNumber'),
      sortIcon: getSortIcon('mobileNumber'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-center text-gray-900">{item.mobileNumber}</span>
        </div>
      )
    },
    {
      key: "gender",
      label: "Gender",
      sortable: true,
      onSort: () => requestSort('gender'),
      sortIcon: getSortIcon('gender'),
      render: (item) => {
        const getGenderStyle = (gender) => {
          switch (gender?.toLowerCase()) {
            case 'male': return { bg: 'bg-blue-100', text: 'text-blue-800'};
            case 'female': return { bg: 'bg-pink-100', text: 'text-pink-800'};
            default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '⚧' };
          }
        };

        const style = getGenderStyle(item.gender);

        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            <span className="text-lg">{style.icon}</span>
            <span>{item.gender}</span>
          </span>
        );
      }
    },
    {
      key: "state",
      label: "State",
      sortable: true,
      onSort: () => requestSort('state'),
      sortIcon: getSortIcon('state'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.state}</span>
        </div>
      )
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
            <div className="font-medium text-gray-900">{formattedDate}</div>
          </div>
        );
      }
    },
  ], [getSortIcon, requestSort]);

  // Selection handlers - FIXED: Now working with IDs (not UIDs) to match DataTable
  const toggleSelectSeller = (id) => {
    if (!id) return;
    setSelectedSellers((prev) => {
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
    const allIds = filteredSellers.map(seller => seller.id).filter(Boolean);
    if (selectedSellers.size === allIds.length && allIds.length > 0) {
      setSelectedSellers(new Set());
    } else {
      setSelectedSellers(new Set(allIds));
    }
  };

  // Event handlers
  const handleView = (item) => {
    if (item?.uid) {
      navigate(`/management/seller-details/${item.uid}`, {
        state: { seller: item }
      });
    }
  };

  const handleEdit = (item) => {
    if (item?.uid) {
      navigate(`/management/edit-seller/${item.uid}`, {
        state: { seller: item }
      });
    }
  };

  // DataTable passes the item.id (not uid) to onDelete
  const handleDelete = (id) => {
    // Find the seller by id (the internal id, not uid)
    const seller = sellers.find(s => s.id === id);
    if (!seller) {
      toast.error("Cannot delete seller: Invalid seller ID");
      return;
    }
    setDeleteTarget("single");
    setDeleteId(id); // Store the id, not uid
    setShowDeleteModal(true);
  };

  // Bulk delete handler for DataTable
  const handleBulkDelete = (ids) => {
    if (!ids || ids.length === 0) {
      toast.error("Please select sellers to delete");
      return;
    }
    setDeleteTarget("selected");
    setDeleteId(ids); // Store the array of ids
    setShowDeleteModal(true);
  };

  // Confirm delete with proper id handling
  const confirmDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      setLoading(true);

      if (deleteTarget === "selected") {
        // Simulate API call for bulk delete
        await new Promise(resolve => setTimeout(resolve, 800));

        // Remove from local state using id
        const idsToDelete = deleteId; // This is the array of ids
        setSellers(prev => prev.filter(seller => !idsToDelete.includes(seller.id)));
        setFilteredSellers(prev => prev.filter(seller => !idsToDelete.includes(seller.id)));

        // Clear selection
        setSelectedSellers(new Set());

        // Update MOCK_SELLERS (in a real app, this would be an API call)
        // For demo purposes, we're just updating the UI state

        // Update pagination
        setPagination(prev => ({
          ...prev,
          totalRecords: filteredSellers.length - idsToDelete.length,
          totalPages: Math.ceil((filteredSellers.length - idsToDelete.length) / prev.limit)
        }));

        // DO NOT update stats here - they should remain showing total from original data

        toast.success(`${idsToDelete.length} seller(s) deleted successfully!`);

      } else if (deleteTarget === "single" && deleteId) {
        // Simulate API call for single delete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Remove from local state using id
        setSellers(prev => prev.filter(seller => seller.id !== deleteId));
        setFilteredSellers(prev => prev.filter(seller => seller.id !== deleteId));

        // Remove from selection if present
        setSelectedSellers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deleteId);
          return newSet;
        });

        // Update pagination
        setPagination(prev => ({
          ...prev,
          totalRecords: filteredSellers.length - 1,
          totalPages: Math.ceil((filteredSellers.length - 1) / prev.limit)
        }));

        // DO NOT update stats here - they should remain showing total from original data

        toast.success("Seller deleted successfully!");
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("Failed to delete seller");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteId(null);
      setIsDeleting(false);
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["UID", "Full Name", "Mobile Number", "Gender", "State", "Created At"],
      ...sortedSellers.map(s => [
        s.uid,
        s.fullName,
        s.mobileNumber,
        s.gender,
        s.state,
        new Date(s.createdAt).toLocaleString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sellers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Sellers data exported successfully!");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Sellers List Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .stat-box { background: #f8fafc; padding: 15px; border-radius: 8px; width: 23%; }
            ${searchTerm ? '.search-info { color: #666; font-style: italic; margin-top: 10px; }' : ''}
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sellers List Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            ${searchTerm ? `<p class="search-info">Search: "${searchTerm}" - ${sortedSellers.length} results found</p>` : ''}
          </div>
          
          <div class="stats">
            <div class="stat-box"><strong>Total Sellers:</strong> ${stats.totalSellers}</div>
            <div class="stat-box"><strong>Male Sellers:</strong> ${stats.maleSellers}</div>
            <div class="stat-box"><strong>Female Sellers:</strong> ${stats.femaleSellers}</div>
            <div class="stat-box"><strong>Active Transactions:</strong> ${stats.activeTransactions}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>UID</th>
                <th>Full Name</th>
                <th>Mobile Number</th>
                <th>Gender</th>
                <th>State</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              ${sortedSellers.map(seller => `
                <tr>
                  <td>${seller.uid}</td>
                  <td>${seller.fullName}</td>
                  <td>${seller.mobileNumber}</td>
                  <td>${seller.gender}</td>
                  <td>${seller.state}</td>
                  <td>${new Date(seller.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Report generated by Seller Management System</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    toast.success("Printing sellers report...");
  };

  const handleRefresh = () => {
    toast.success("Refreshing sellers data...");
    fetchSellers(searchTerm);
  };

  // Get unique states for filter dropdown
  const uniqueStates = useMemo(() => {
    const states = [...new Set(MOCK_SELLERS.map(s => s.state))];
    return states.sort();
  }, []);

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const totalDisplayedRecords = filteredSellers.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
          <p className="text-gray-600">View and manage all registered sellers</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            disabled={loading}
          >
            <span>Refresh</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats Cards - These now show ORIGINAL data from MOCK_SELLERS, not filtered data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Sellers */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <Store className="text-blue-500 opacity-60" size={40} />
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalSellers}</h3>
              <p className="text-gray-600">Total Sellers</p>
            </div>
          </div>
        </div>

        {/* Male Sellers */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <User className="text-green-500 opacity-60" size={40} />
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900">{stats.maleSellers}</h3>
              <p className="text-gray-600">Male Sellers</p>
            </div>
          </div>
        </div>

        {/* Female Sellers */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <User className="text-pink-500 opacity-60" size={40} />
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900">{stats.femaleSellers}</h3>
              <p className="text-gray-600">Female Sellers</p>
            </div>
          </div>
        </div>

        {/* Active Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <CreditCard className="text-purple-500 opacity-60" size={40} />
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeTransactions}</h3>
              <p className="text-gray-600">Active Transactions</p>
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
                placeholder="Search by UID, Name, Mobile, State..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm bg-gray-50/50"
                value={searchInput}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {sortedSellers.length} found
                  </span>
                </div>
              )}
            </div>

            {/* Filter Toggle Button - Design from FilterSection */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 text-sm transition-all justify-center md:justify-start ${showFilters
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-transparent"
                  : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {isFilterApplied && (
                <span className="ml-1 px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded-full text-xs">
                  •
                </span>
              )}
            </button>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
            {/* Bulk Delete Button - Now using selected IDs count directly */}
            {selectedSellers.size > 0 && (
              <button
                onClick={() => {
                  const selectedIds = Array.from(selectedSellers);
                  handleBulkDelete(selectedIds);
                }}
                className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
              >
                <MdDelete className="w-4 h-4" />
                Delete ({selectedSellers.size})
              </button>
            )}

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
            >
              <FaDownload className="w-4 h-4" />
              Export
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
            >
              <FaPrint className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Filters Panel - Exactly from FilterSection */}
        {showFilters && (
          <div className="mt-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  value={tempFilters.gender || ""}
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  value={tempFilters.state || ""}
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                >
                  <option value="">All States</option>
                  {uniqueStates.map(state => (
                    <option key={state} value={state}>{state}</option>
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
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
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
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
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
                  <div className="flex flex-wrap items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs">
                      <Filter className="w-3 h-3 mr-1" />
                      Filters Applied
                    </span>
                    <span className="text-blue-700 text-xs">
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
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-300 whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-md"
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
        data={sortedSellers}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        addButtonLabel="Add New Seller"
        emptyStateMessage="No sellers found. Try adjusting your search or filters."
        loadingMessage="Loading sellers data..."
        enableSelection={true}
        enableExport={true}
        enablePrint={true}
        enablePagination={true}
        enableBulkDelete={true}
        selectedRows={selectedSellers}
        onSelectRow={toggleSelectSeller}
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
                  ? `You're about to delete ${deleteId?.length || 0} selected seller(s). This action cannot be undone.`
                  : "You're about to delete this seller. This action cannot be undone."}
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

export default SellersList;



// // pages/sellers/SellersList.jsx
// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   ArrowRight,
//   ChevronUp,
//   ChevronDown,
//   Minus,
//   Store,
//   User,
//   CreditCard,
//   TrendingUp,
// } from "lucide-react";
// import {
//   FaDownload,
//   FaPrint,
// } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { BiSearch } from "react-icons/bi";
// import { HiOutlineTrash } from "react-icons/hi";
// import DataTable from "../../../components/common/Table/DataTable";
// import { PATHROUTES } from "../../../routes/pathRoutes";
// import FilterSection from "../../../components/common/Filter/FilterSection";

// // Mock data - FRONTEND ONLY with uid as primary identifier
// const MOCK_SELLERS = [
//   {
//     id: 1,
//     uid: "SEL001",
//     fullName: "Rajesh Kumar",
//     mobileNumber: "9876543210",
//     gender: "Male",
//     state: "Maharashtra",
//     createdAt: "2024-01-15",
//   },
//   {
//     id: 2,
//     uid: "SEL002",
//     fullName: "Priya Sharma",
//     mobileNumber: "8765432109",
//     gender: "Female",
//     state: "Delhi",
//     createdAt: "2024-01-20",
//   },
//   {
//     id: 3,
//     uid: "SEL003",
//     fullName: "Mohan Singh",
//     mobileNumber: "7654321098",
//     gender: "Male",
//     state: "Karnataka",
//     createdAt: "2024-01-25",
//   },
//   {
//     id: 4,
//     uid: "SEL004",
//     fullName: "Anita Reddy",
//     mobileNumber: "6543210987",
//     gender: "Female",
//     state: "Tamil Nadu",
//     createdAt: "2024-01-10",
//   },
//   {
//     id: 5,
//     uid: "SEL005",
//     fullName: "Vikram Joshi",
//     mobileNumber: "5432109876",
//     gender: "Male",
//     state: "Uttar Pradesh",
//     createdAt: "2024-01-18",
//   },
// ];

// const SellersList = () => {
//   const navigate = useNavigate();
//   const [sellers, setSellers] = useState([]);
//   const [filteredSellers, setFilteredSellers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Search state
//   const [searchInput, setSearchInput] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const searchTimeoutRef = useRef(null);

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalRecords: 0,
//     limit: 10
//   });

//   const [stats, setStats] = useState({
//     totalSellers: 0,
//     maleSellers: 0,
//     femaleSellers: 0,
//     activeTransactions: 0,
//   });

//   // Filter state
//   const [filters, setFilters] = useState({
//     gender: "",
//     state: "",
//     fromDate: "",
//     toDate: ""
//   });

//   // Filter UI state
//   const [showFilters, setShowFilters] = useState(false);

//   // Selection state
//   const [selectedSellers, setSelectedSellers] = useState(new Set());

//   // Delete modal state
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Sorting state
//   const [sortCycle, setSortCycle] = useState({
//     key: "createdAt",
//     step: 2, // 0: normal, 1: asc, 2: desc
//   });

//   // Filter configuration for FilterSection
//   const filterConfig = useMemo(() => {
//     // Get unique states for filter dropdown
//     const uniqueStates = [...new Set(MOCK_SELLERS.map(s => s.state))].sort();

//     return [
//       {
//         key: "gender",
//         label: "Gender",
//         type: "select",
//         options: [
//           { value: "Male", label: "Male" },
//           { value: "Female", label: "Female" },
//         ],
//       },
//       {
//         key: "state",
//         label: "State",
//         type: "select",
//         options: uniqueStates.map(state => ({ value: state, label: state })),
//       },
//       {
//         key: "fromDate",
//         label: "From Date",
//         type: "date",
//       },
//       {
//         key: "toDate",
//         label: "To Date",
//         type: "date",
//         min: filters.fromDate || undefined,
//       },
//     ];
//   }, [filters.fromDate]);

//   // Helper function to handle null/undefined values
//   const getValue = (value) => {
//     if (
//       value === null ||
//       value === undefined ||
//       value === "N/A" ||
//       value === "null" ||
//       value === "undefined"
//     ) {
//       return "";
//     }
//     return String(value).trim();
//   };

//   // Fetch sellers with simulated API call
//   const fetchSellers = useCallback(async (search = "") => {
//     setLoading(true);
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 800));

//       // Apply search filter
//       let filtered = [...MOCK_SELLERS];

//       if (search) {
//         const searchLower = search.toLowerCase();
//         filtered = filtered.filter(seller =>
//           seller.fullName.toLowerCase().includes(searchLower) ||
//           seller.uid.toLowerCase().includes(searchLower) ||
//           seller.mobileNumber.includes(searchLower) ||
//           seller.state.toLowerCase().includes(searchLower)
//         );
//       }

//       // Calculate stats from ORIGINAL data
//       const maleCount = MOCK_SELLERS.filter(s => s.gender === "Male").length;
//       const femaleCount = MOCK_SELLERS.filter(s => s.gender === "Female").length;
//       const transactionCount = MOCK_SELLERS.filter(s => s.transactionId !== "NA").length;

//       setStats({
//         totalSellers: MOCK_SELLERS.length,
//         maleSellers: maleCount,
//         femaleSellers: femaleCount,
//         activeTransactions: transactionCount,
//       });

//       setSellers(filtered);
//       setFilteredSellers(filtered);

//       setPagination(prev => ({
//         ...prev,
//         totalRecords: filtered.length,
//         totalPages: Math.ceil(filtered.length / prev.limit)
//       }));

//     } catch (error) {
//       toast.error("Failed to fetch sellers");
//       setSellers([]);
//       setFilteredSellers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Debounce search
//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       setSearchTerm(searchInput);
//       setPagination(prev => ({ ...prev, currentPage: 1 }));
//     }, 500);

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchInput]);

//   // Fetch when search term changes
//   useEffect(() => {
//     fetchSellers(searchTerm);
//   }, [searchTerm, fetchSellers]);

//   // Apply filters function
//   const applyFilters = useCallback((filterValues) => {
//     let filtered = [...MOCK_SELLERS];

//     // Apply search filter
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(seller =>
//         seller.fullName.toLowerCase().includes(searchLower) ||
//         seller.uid.toLowerCase().includes(searchLower) ||
//         seller.mobileNumber.includes(searchLower) ||
//         seller.state.toLowerCase().includes(searchLower)
//       );
//     }

//     // Apply gender filter
//     if (filterValues.gender) {
//       filtered = filtered.filter(seller => seller.gender === filterValues.gender);
//     }

//     // Apply state filter
//     if (filterValues.state) {
//       filtered = filtered.filter(seller => seller.state === filterValues.state);
//     }

//     // Apply date range filter
//     if (filterValues.fromDate || filterValues.toDate) {
//       filtered = filtered.filter(seller => {
//         const sellerDate = new Date(seller.createdAt);

//         if (filterValues.fromDate) {
//           const fromDate = new Date(filterValues.fromDate);
//           fromDate.setHours(0, 0, 0, 0);
//           if (sellerDate < fromDate) return false;
//         }

//         if (filterValues.toDate) {
//           const toDate = new Date(filterValues.toDate);
//           toDate.setHours(23, 59, 59, 999);
//           if (sellerDate > toDate) return false;
//         }

//         return true;
//       });
//     }

//     setFilteredSellers(filtered);
//     setSellers(filtered);

//     // Update pagination
//     setPagination(prev => ({
//       ...prev,
//       currentPage: 1,
//       totalRecords: filtered.length,
//       totalPages: Math.ceil(filtered.length / prev.limit)
//     }));

//   }, [searchTerm]);

//   // Filter handlers
//   const handleApplyFilters = (filterValues) => {
//     setFilters(filterValues);
//     applyFilters(filterValues);
//   };

//   const handleClearFilters = (emptyFilters) => {
//     setFilters(emptyFilters);
//     applyFilters(emptyFilters);
//   };

//   const handleCancelFilters = () => {
//     // Just close the panel without applying changes
//   };

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchInput(e.target.value);
//   };

//   // Clear search
//   const handleClearSearch = () => {
//     setSearchInput("");
//     setSearchTerm("");
//     fetchSellers("");
//   };

//   // Handle page change
//   const handlePageChange = (page) => {
//     setPagination(prev => ({ ...prev, currentPage: page }));
//   };

//   // Handle limit change
//   const handleLimitChange = (newLimit) => {
//     setPagination(prev => ({
//       ...prev,
//       limit: newLimit,
//       currentPage: 1,
//       totalPages: Math.ceil(prev.totalRecords / newLimit)
//     }));
//   };

//   // Sorting handler
//   const requestSort = useCallback((key) => {
//     setSortCycle((prev) => {
//       if (prev.key !== key) {
//         return { key, step: 1 };
//       }
//       const nextStep = (prev.step + 1) % 3;
//       return { key, step: nextStep };
//     });
//   }, []);

//   // Apply sorting to data
//   const sortedSellers = useMemo(() => {
//     if (sortCycle.step === 0) {
//       return filteredSellers;
//     }

//     return [...filteredSellers].sort((a, b) => {
//       const key = sortCycle.key;
//       let aValue = a[key] ?? "";
//       let bValue = b[key] ?? "";

//       if (sortCycle.step === 1) {
//         if (key === 'createdAt') {
//           return new Date(aValue) - new Date(bValue);
//         }
//         return String(aValue).localeCompare(String(bValue));
//       } else {
//         if (key === 'createdAt') {
//           return new Date(bValue) - new Date(aValue);
//         }
//         return String(bValue).localeCompare(String(aValue));
//       }
//     });
//   }, [filteredSellers, sortCycle]);

//   // Get sort icon
//   const getSortIcon = useCallback(
//     (key) => {
//       if (sortCycle.key !== key) {
//         return <Minus className="ml-1 text-gray-400" size={16} />;
//       }

//       if (sortCycle.step === 0) {
//         return <Minus className="ml-1 text-gray-400" size={16} />;
//       } else if (sortCycle.step === 1) {
//         return <ChevronUp className="ml-1 text-gray-600" size={16} />;
//       } else {
//         return <ChevronDown className="ml-1 text-gray-600" size={16} />;
//       }
//     },
//     [sortCycle]
//   );

//   // Table columns
//   const columns = useMemo(() => [
//     {
//       key: "uid",
//       label: "Seller ID",
//       sortable: true,
//       onSort: () => requestSort('uid'),
//       sortIcon: getSortIcon('uid'),
//       render: (item) => (
//         <div className="flex items-center gap-2">
//           <span className="font-medium text-gray-900">{item.uid}</span>
//         </div>
//       )
//     },
//     {
//       key: "fullName",
//       label: "Full Name",
//       sortable: true,
//       onSort: () => requestSort('fullName'),
//       sortIcon: getSortIcon('fullName'),
//       render: (item) => (
//         <div className="flex items-center gap-2">
//           <span className="font-medium text-gray-900">{item.fullName}</span>
//         </div>
//       )
//     },
//     {
//       key: "mobileNumber",
//       label: "Mobile Number",
//       sortable: true,
//       onSort: () => requestSort('mobileNumber'),
//       sortIcon: getSortIcon('mobileNumber'),
//       render: (item) => (
//         <div className="flex items-center gap-2">
//           <span className="font-medium text-center text-gray-900">{item.mobileNumber}</span>
//         </div>
//       )
//     },
//     {
//       key: "gender",
//       label: "Gender",
//       sortable: true,
//       onSort: () => requestSort('gender'),
//       sortIcon: getSortIcon('gender'),
//       render: (item) => {
//         const getGenderStyle = (gender) => {
//           switch (gender?.toLowerCase()) {
//             case 'male': return { bg: 'bg-blue-100', text: 'text-blue-800', icon: '♂' };
//             case 'female': return { bg: 'bg-pink-100', text: 'text-pink-800', icon: '♀' };
//             default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '⚧' };
//           }
//         };

//         const style = getGenderStyle(item.gender);

//         return (
//           <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
//             <span className="text-lg">{style.icon}</span>
//             <span>{item.gender}</span>
//           </span>
//         );
//       }
//     },
//     {
//       key: "state",
//       label: "State",
//       sortable: true,
//       onSort: () => requestSort('state'),
//       sortIcon: getSortIcon('state'),
//       render: (item) => (
//         <div className="flex items-center gap-2">
//           <span className="font-medium">{item.state}</span>
//         </div>
//       )
//     },
//     {
//       key: "createdAt",
//       label: "Created At",
//       sortable: true,
//       onSort: () => requestSort('createdAt'),
//       sortIcon: getSortIcon('createdAt'),
//       render: (item) => {
//         const date = new Date(item.createdAt);
//         const formattedDate = date.toLocaleDateString('en-US', {
//           day: 'numeric',
//           month: 'short',
//           year: 'numeric'
//         });

//         return (
//           <div className="flex items-center gap-2">
//             <div className="font-medium text-gray-900">{formattedDate}</div>
//           </div>
//         );
//       }
//     },
//   ], [getSortIcon, requestSort]);

//   // Selection handlers
//   const toggleSelectSeller = (id) => {
//     if (!id) return;
//     setSelectedSellers((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   const toggleSelectAll = () => {
//     const allIds = filteredSellers.map(seller => seller.id).filter(Boolean);
//     if (selectedSellers.size === allIds.length && allIds.length > 0) {
//       setSelectedSellers(new Set());
//     } else {
//       setSelectedSellers(new Set(allIds));
//     }
//   };

//   // Event handlers
//   const handleView = (item) => {
//     if (item?.uid) {
//       navigate(`/management/seller-details/${item.uid}`, {
//         state: { seller: item }
//       });
//     }
//   };

//   const handleEdit = (item) => {
//     if (item?.uid) {
//       navigate(`/management/edit-seller/${item.uid}`, {
//         state: { seller: item }
//       });
//     }
//   };

//   const handleDelete = (id) => {
//     const seller = sellers.find(s => s.id === id);
//     if (!seller) {
//       toast.error("Cannot delete seller: Invalid seller ID");
//       return;
//     }
//     setDeleteTarget("single");
//     setDeleteId(id);
//     setShowDeleteModal(true);
//   };

//   const handleBulkDelete = (ids) => {
//     if (!ids || ids.length === 0) {
//       toast.error("Please select sellers to delete");
//       return;
//     }
//     setDeleteTarget("selected");
//     setDeleteId(ids);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (isDeleting) return;

//     try {
//       setIsDeleting(true);
//       setLoading(true);

//       if (deleteTarget === "selected") {
//         await new Promise(resolve => setTimeout(resolve, 800));

//         const idsToDelete = deleteId;
//         setSellers(prev => prev.filter(seller => !idsToDelete.includes(seller.id)));
//         setFilteredSellers(prev => prev.filter(seller => !idsToDelete.includes(seller.id)));

//         setSelectedSellers(new Set());

//         setPagination(prev => ({
//           ...prev,
//           totalRecords: filteredSellers.length - idsToDelete.length,
//           totalPages: Math.ceil((filteredSellers.length - idsToDelete.length) / prev.limit)
//         }));

//         toast.success(`${idsToDelete.length} seller(s) deleted successfully!`);

//       } else if (deleteTarget === "single" && deleteId) {
//         await new Promise(resolve => setTimeout(resolve, 500));

//         setSellers(prev => prev.filter(seller => seller.id !== deleteId));
//         setFilteredSellers(prev => prev.filter(seller => seller.id !== deleteId));

//         setSelectedSellers((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(deleteId);
//           return newSet;
//         });

//         setPagination(prev => ({
//           ...prev,
//           totalRecords: filteredSellers.length - 1,
//           totalPages: Math.ceil((filteredSellers.length - 1) / prev.limit)
//         }));

//         toast.success("Seller deleted successfully!");
//       }
//     } catch (error) {
//       console.error("Error in delete operation:", error);
//       toast.error("Failed to delete seller");
//     } finally {
//       setShowDeleteModal(false);
//       setDeleteTarget(null);
//       setDeleteId(null);
//       setIsDeleting(false);
//       setLoading(false);
//     }
//   };

//   const handleExport = () => {
//     const csvContent = [
//       ["UID", "Full Name", "Mobile Number", "Gender", "State", "Created At"],
//       ...sortedSellers.map(s => [
//         s.uid,
//         s.fullName,
//         s.mobileNumber,
//         s.gender,
//         s.state,
//         new Date(s.createdAt).toLocaleString()
//       ])
//     ].map(row => row.join(",")).join("\n");

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `sellers-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//     toast.success("Sellers data exported successfully!");
//   };

//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Sellers List Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             table { border-collapse: collapse; width: 100%; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
//             th { background-color: #f3f4f6; font-weight: bold; }
//             .header { text-align: center; margin-bottom: 30px; }
//             .stats { display: flex; justify-content: space-between; margin-bottom: 20px; }
//             .stat-box { background: #f8fafc; padding: 15px; border-radius: 8px; width: 23%; }
//             ${searchTerm ? '.search-info { color: #666; font-style: italic; margin-top: 10px; }' : ''}
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Sellers List Report</h1>
//             <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
//             ${searchTerm ? `<p class="search-info">Search: "${searchTerm}" - ${sortedSellers.length} results found</p>` : ''}
//           </div>
          
//           <div class="stats">
//             <div class="stat-box"><strong>Total Sellers:</strong> ${stats.totalSellers}</div>
//             <div class="stat-box"><strong>Male Sellers:</strong> ${stats.maleSellers}</div>
//             <div class="stat-box"><strong>Female Sellers:</strong> ${stats.femaleSellers}</div>
//             <div class="stat-box"><strong>Active Transactions:</strong> ${stats.activeTransactions}</div>
//           </div>
          
//           <table>
//             <thead>
//               <tr>
//                 <th>UID</th>
//                 <th>Full Name</th>
//                 <th>Mobile Number</th>
//                 <th>Gender</th>
//                 <th>State</th>
//                 <th>Created At</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${sortedSellers.map(seller => `
//                 <tr>
//                   <td>${seller.uid}</td>
//                   <td>${seller.fullName}</td>
//                   <td>${seller.mobileNumber}</td>
//                   <td>${seller.gender}</td>
//                   <td>${seller.state}</td>
//                   <td>${new Date(seller.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
          
//           <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
//             <p>Report generated by Seller Management System</p>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//     toast.success("Printing sellers report...");
//   };

//   const handleRefresh = () => {
//     toast.success("Refreshing sellers data...");
//     fetchSellers(searchTerm);
//   };

//   const totalDisplayedRecords = filteredSellers.length;

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
//           <p className="text-gray-600">View and manage all registered sellers</p>
//         </div>
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={handleRefresh}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
//             disabled={loading}
//           >
//             <span>Refresh</span>
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-start justify-between">
//             <Store className="text-blue-500 opacity-60" size={40} />
//             <div className="text-right">
//               <h3 className="text-2xl font-bold text-gray-900">{stats.totalSellers}</h3>
//               <p className="text-gray-600">Total Sellers</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-start justify-between">
//             <User className="text-green-500 opacity-60" size={40} />
//             <div className="text-right">
//               <h3 className="text-2xl font-bold text-gray-900">{stats.maleSellers}</h3>
//               <p className="text-gray-600">Male Sellers</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-start justify-between">
//             <User className="text-pink-500 opacity-60" size={40} />
//             <div className="text-right">
//               <h3 className="text-2xl font-bold text-gray-900">{stats.femaleSellers}</h3>
//               <p className="text-gray-600">Female Sellers</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-start justify-between">
//             <CreditCard className="text-purple-500 opacity-60" size={40} />
//             <div className="text-right">
//               <h3 className="text-2xl font-bold text-gray-900">{stats.activeTransactions}</h3>
//               <p className="text-gray-600">Active Transactions</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search and Filter Section */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           {/* Left Side: Search and Filter */}
//           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//             {/* Search Input */}
//             <div className="relative w-full sm:w-80">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <BiSearch className="w-4 h-4 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by UID, Name, Mobile, State..."
//                 className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm bg-gray-50/50"
//                 value={searchInput}
//                 onChange={handleSearchChange}
//               />
//               {searchTerm && (
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                   <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                     {sortedSellers.length} found
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Filter Component */}
//             <FilterSection
//               filters={filterConfig}
//               initialFilters={filters}
//               isOpen={showFilters}
//               onToggle={setShowFilters}
//               onApply={handleApplyFilters}
//               onClear={handleClearFilters}
//               onCancel={handleCancelFilters}
//             />
//           </div>

//           {/* Right Side: Action Buttons */}
//           <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
//             {selectedSellers.size > 0 && (
//               <button
//                 onClick={() => {
//                   const selectedIds = Array.from(selectedSellers);
//                   handleBulkDelete(selectedIds);
//                 }}
//                 className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
//               >
//                 <MdDelete className="w-4 h-4" />
//                 Delete ({selectedSellers.size})
//               </button>
//             )}

//             <button
//               onClick={handleExport}
//               className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
//             >
//               <FaDownload className="w-4 h-4" />
//               Export
//             </button>

//             <button
//               onClick={handlePrint}
//               className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
//             >
//               <FaPrint className="w-4 h-4" />
//               Print
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={sortedSellers}
//         loading={loading}
//         onEdit={handleEdit}
//         onView={handleView}
//         onDelete={handleDelete}
//         onBulkDelete={handleBulkDelete}
//         addButtonLabel="Add New Seller"
//         emptyStateMessage="No sellers found. Try adjusting your search or filters."
//         loadingMessage="Loading sellers data..."
//         enableSelection={true}
//         enableExport={true}
//         enablePrint={true}
//         enablePagination={true}
//         enableBulkDelete={true}
//         selectedRows={selectedSellers}
//         onSelectRow={toggleSelectSeller}
//         onSelectAll={toggleSelectAll}
//         pagination={{
//           currentPage: pagination.currentPage,
//           totalPages: pagination.totalPages,
//           totalRecords: totalDisplayedRecords,
//           onPageChange: handlePageChange,
//           onLimitChange: handleLimitChange,
//           limit: pagination.limit,
//           limitOptions: [5, 10, 25, 50, 100]
//         }}
//         hideAddButton={true}
//         disableInternalDeleteModal={true}
//       />

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto"
//           style={{ top: 0, left: 0, right: 0, bottom: 0 }}
//         >
//           <div className="relative w-full max-w-md bg-white rounded-md shadow-xl mx-2">
//             <div className="flex justify-center mb-4 mt-4">
//               <div className="p-3 bg-red-50 rounded-full">
//                 <HiOutlineTrash className="w-10 h-10 text-red-500" />
//               </div>
//             </div>

//             <div className="text-center mb-6">
//               <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
//                 Confirm Deletion
//               </h3>
//               <p className="text-gray-500 text-sm sm:text-base leading-relaxed p-3">
//                 {deleteTarget === "selected"
//                   ? `You're about to delete ${deleteId?.length || 0} selected seller(s). This action cannot be undone.`
//                   : "You're about to delete this seller. This action cannot be undone."}
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 pb-4">
//               <button
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setDeleteTarget(null);
//                   setDeleteId(null);
//                   setIsDeleting(false);
//                 }}
//                 className="flex-1 px-2 sm:px-5 py-1 border sm:py-2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150 text-sm font-medium focus:outline-none"
//                 disabled={isDeleting}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 disabled={isDeleting}
//                 className="flex-1 px-2 sm:px-5 py-1 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-150 text-sm font-medium focus:outline-none shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isDeleting ? (
//                   <>
//                     <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                     <span>Deleting...</span>
//                   </>
//                 ) : (
//                   <span>Delete</span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// };

// export default SellersList;