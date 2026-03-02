import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserPlus,
    FaDownload,
    FaPrint
} from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { HiOutlineTrash } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { toast, Toaster } from 'react-hot-toast';
import {
    Shield,
    Filter,
    X,
    Calendar,
    CheckCircle,
    XCircle,
    Layers,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Minus
} from "lucide-react";

import DataTable from '../../components/common/Table/DataTable';
import { Endpoints } from '../../services/api/EndPoint';
import api from '../../services/api/api';
import { PATHROUTES } from '../../routes/pathRoutes';

const ManageSchemesTable = () => {
    const [schemes, setSchemes] = useState([]);
    const [filteredSchemes, setFilteredSchemes] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const searchTimeoutRef = useRef(null);
    const toastShownRef = useRef(false); // Toast ko sirf ek baar dikhane ke liye

    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter UI state
    const [showFilters, setShowFilters] = useState(false);
    const [tempFilters, setTempFilters] = useState({});
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});

    // Selection state
    const [selectedIds, setSelectedIds] = useState(new Set());

    const [stats, setStats] = useState({
        totalSchemes: 0,
        activeSchemes: 0,
        inactiveSchemes: 0,
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10
    });

    const navigate = useNavigate();

    const LOCAL_SCHEMES_DATA = [
        { id: 1, schemeName: "Pradhan Mantri Jan Dhan Yojana", status: "active", createdAt: "2024-01-15" },
        { id: 2, schemeName: "Sukanya Samriddhi Yojana", status: "active", createdAt: "2024-01-20" },
        { id: 3, schemeName: "Atal Pension Yojana", status: "active", createdAt: "2024-02-01" },
        { id: 4, schemeName: "Pradhan Mantri Jeevan Jyoti Yojana", status: "inactive", createdAt: "2024-02-10" },
        { id: 5, schemeName: "Pradhan Mantri Suraksha Bima Yojana", status: "active", createdAt: "2024-02-15" },
        { id: 6, schemeName: "National Pension System", status: "active", createdAt: "2024-03-01" },
        { id: 7, schemeName: "Ayushman Bharat Yojana", status: "active", createdAt: "2024-03-10" },
        { id: 8, schemeName: "PM Kisan Samman Nidhi", status: "inactive", createdAt: "2024-03-15" },
        { id: 9, schemeName: "Ujjwala Yojana", status: "active", createdAt: "2024-04-01" },
        { id: 10, schemeName: "Swachh Bharat Mission", status: "active", createdAt: "2024-04-10" },
        { id: 11, schemeName: "Digital India Mission", status: "active", createdAt: "2024-04-15" },
        { id: 12, schemeName: "Make in India", status: "inactive", createdAt: "2024-05-01" },
        { id: 13, schemeName: "Startup India", status: "active", createdAt: "2024-05-10" },
        { id: 14, schemeName: "Standup India", status: "active", createdAt: "2024-05-15" },
        { id: 15, schemeName: "PM Awas Yojana", status: "active", createdAt: "2024-06-01" },
        { id: 16, schemeName: "PM Gram Sadak Yojana", status: "inactive", createdAt: "2024-06-10" },
        { id: 17, schemeName: "Jal Jeevan Mission", status: "active", createdAt: "2024-06-15" },
        { id: 18, schemeName: "PM Poshan Shakti Nirman", status: "active", createdAt: "2024-07-01" },
        { id: 19, schemeName: "National Health Mission", status: "active", createdAt: "2024-07-10" },
        { id: 20, schemeName: "Beti Bachao Beti Padhao", status: "inactive", createdAt: "2024-07-15" },
        { id: 21, schemeName: "POSHAN Abhiyaan", status: "active", createdAt: "2024-08-01" },
        { id: 22, schemeName: "Rashtriya Swasthya Bima Yojana", status: "active", createdAt: "2024-08-10" },
        { id: 23, schemeName: "PM Garib Kalyan Yojana", status: "active", createdAt: "2024-08-15" },
        { id: 24, schemeName: "One Nation One Ration Card", status: "inactive", createdAt: "2024-09-01" },
        { id: 25, schemeName: "PM Street Vendor's AtmaNirbhar Nidhi", status: "active", createdAt: "2024-09-10" }
    ];

    const getStatusOptions = useMemo(() => {
        const statuses = new Set();
        schemes.forEach(scheme => {
            if (scheme.status) {
                statuses.add(scheme.status);
            }
        });
        return Array.from(statuses).sort();
    }, [schemes]);

    const fetchSchemes = async () => {
        try {
            setLoading(true);

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const normalizedSchemes = LOCAL_SCHEMES_DATA.map(scheme => ({
                ...scheme,
                createdAt: scheme.createdAt || new Date().toISOString().split('T')[0]
            }));

            setSchemes(normalizedSchemes);
            setFilteredSchemes(normalizedSchemes);
            calculateStats(normalizedSchemes);

            setPagination(prev => ({
                ...prev,
                totalRecords: normalizedSchemes.length,
                totalPages: Math.ceil(normalizedSchemes.length / prev.limit)
            }));
        } catch (error) {
            console.error('Error fetching schemes:', error);
            toast.error("Failed to fetch schemes");
            setSchemes([]);
            setFilteredSchemes([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteScheme = async (schemeId) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const updatedSchemes = schemes.filter(scheme => scheme.id !== schemeId);
            setSchemes(updatedSchemes);

            return { success: true };
        } catch (error) {
            console.error('Error deleting scheme:', error);
            throw error;
        }
    };

    // Bulk delete function
    const deleteMultipleSchemes = async (schemeIds) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const successful = schemeIds.length;
            const failed = 0;

            const updatedSchemes = schemes.filter(scheme => !schemeIds.includes(scheme.id));
            setSchemes(updatedSchemes);

            return { successful, failed };
        } catch (error) {
            console.error('Error in bulk delete:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchSchemes();

        // Cleanup function
        return () => {
            toastShownRef.current = false;
        };
    }, []);

    // Calculate statistics
    const calculateStats = (schemesData) => {
        const totalSchemes = schemesData.length;
        const activeSchemes = schemesData.filter(scheme => scheme.status === 'active').length;
        const inactiveSchemes = schemesData.filter(scheme => scheme.status === 'inactive').length;

        setStats({
            totalSchemes,
            activeSchemes,
            inactiveSchemes,
        });
    };

    useEffect(() => {
        setTempFilters(filters);
        const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
        setIsFilterApplied(hasAppliedFilters);
        setAppliedFilters(filters);
    }, [filters]);

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

    // Apply filters function - FIXED: Ab search mein index ki jagah id use kar rahe hain
    const applyFilters = useCallback((filterValues) => {
        let filtered = [...schemes];

        // Apply search filter - FIXED: Ab id ko string mein convert karke search kar rahe hain
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter((scheme) => {
                // Search in scheme name
                const schemeNameMatch = scheme.schemeName?.toLowerCase().includes(searchLower);

                // Search in ID (jo ki unique hai)
                const idMatch = scheme.id.toString().includes(searchTerm);

                return schemeNameMatch || idMatch;
            });
        }

        if (filterValues.status) {
            filtered = filtered.filter(scheme => scheme.status === filterValues.status);
        }

        setFilteredSchemes(filtered);

        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            totalRecords: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.limit)
        }));
    }, [schemes, searchTerm]);

    useEffect(() => {
        applyFilters(filters);
    }, [searchTerm, filters, applyFilters]);

    const handleFilterChange = (key, value) => {
        setTempFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
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

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
        applyFilters(filters);
    };

    // Sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedSchemes = useMemo(() => {
        if (!sortConfig.key) return filteredSchemes;

        return [...filteredSchemes].sort((a, b) => {
            const getValue = (scheme, key) => {
                if (key === "schemeName") return scheme.schemeName || "";
                if (key === "createdAt") {
                    return scheme.createdAt ? new Date(scheme.createdAt).getTime() : 0;
                }
                return scheme[key];
            };

            const aValue = getValue(a, sortConfig.key);
            const bValue = getValue(b, sortConfig.key);

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredSchemes, sortConfig]);

    const getSortIcon = useCallback(
        (key) => {
            if (sortConfig.key !== key) {
                return <Minus className="ml-1 text-gray-400" size={16} />;
            }

            if (sortConfig.key === key && sortConfig.direction === 'asc') {
                return <ChevronUp className="ml-1 text-gray-600" size={16} />;
            } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
                return <ChevronDown className="ml-1 text-gray-600" size={16} />;
            } else {
                return <Minus className="ml-1 text-gray-400" size={16} />;
            }
        },
        [sortConfig]
    );

    // Selection handlers
    const toggleSelectScheme = (id) => {
        if (!id) return;
        setSelectedIds((prev) => {
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
        const allIds = filteredSchemes.map(scheme => scheme.id).filter(Boolean);
        if (selectedIds.size === allIds.length && allIds.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(allIds));
        }
    };

    const handleEditScheme = (scheme) => {
        navigate(`${PATHROUTES.editScheme}/${scheme.id}`, { state: { scheme } });
    };

    const handleAddScheme = () => {
        navigate(PATHROUTES.addScheme);
    };

    // Delete handlers
    const handleDeleteClick = (id) => {
        const scheme = schemes.find(s => s.id === id);
        if (!scheme) {
            toast.error("Cannot delete scheme: Invalid scheme ID");
            return;
        }
        setDeleteTarget("single");
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleBulkDelete = (ids) => {
        if (!ids || ids.size === 0) {
            toast.error("Please select schemes to delete");
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

            if (deleteTarget === 'selected') {
                const result = await deleteMultipleSchemes(deleteId);
                if (result.successful > 0) {
                    const updatedSchemes = schemes.filter(scheme => !deleteId.includes(scheme.id));
                    setSchemes(updatedSchemes);

                    setFilteredSchemes(updatedSchemes.filter(scheme => {
                        let include = true;
                        if (filters.status && scheme.status !== filters.status) include = false;

                        return include;
                    }));

                    calculateStats(updatedSchemes);

                    setPagination(prev => ({
                        ...prev,
                        totalRecords: updatedSchemes.length,
                        totalPages: Math.ceil(updatedSchemes.length / prev.limit)
                    }));

                    toast.success(`${result.successful} scheme(s) deleted successfully`);
                }
                setSelectedIds(new Set());
            } else {
                await deleteScheme(deleteId);
                const updatedSchemes = schemes.filter(scheme => scheme.id !== deleteId);
                setSchemes(updatedSchemes);

                setFilteredSchemes(updatedSchemes.filter(scheme => {
                    let include = true;
                    if (filters.status && scheme.status !== filters.status) include = false;

                    return include;
                }));

                calculateStats(updatedSchemes);

                setPagination(prev => ({
                    ...prev,
                    totalRecords: updatedSchemes.length,
                    totalPages: Math.ceil(updatedSchemes.length / prev.limit)
                }));

                setSelectedIds((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(deleteId);
                    return newSet;
                });

                toast.success('Scheme deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting scheme:', error);
            toast.error(error.response?.data?.message || "Failed to delete scheme");
        } finally {
            setLoading(false);
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleteId(null);
        }
    };

    const handleRefresh = () => {
        toastShownRef.current = false;
        toast.success("Refreshing data...");
        fetchSchemes();
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handleLimitChange = (newLimit) => {
        setItemsPerPage(newLimit);
        setPagination(prev => ({
            ...prev,
            limit: newLimit,
            currentPage: 1,
            totalPages: Math.ceil(prev.totalRecords / newLimit)
        }));
    };

    const columns = useMemo(() => [
        {
            key: "srNo",
            label: "Sr. No.",
            sortable: false,
            headerCenter: true,
            render: (item) => item.id
        },
        {
            key: "schemeName",
            label: "Scheme Name",
            sortable: true,
            onSort: () => requestSort('schemeName'),
            sortIcon: getSortIcon('schemeName'),
            render: (item) => (
                <span className="font-medium text-gray-800">
                    {item.schemeName || ''}
                </span>
            )
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            headerCenter: true,
            onSort: () => requestSort('status'),
            sortIcon: getSortIcon('status'),
            render: (item) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'N/A'}
                </span>
            )
        },
        {
            key: "createdAt",
            label: "Created Date",
            sortable: true,
            headerCenter: true,   // 👈 center enabled
            onSort: () => requestSort('createdAt'),
            sortIcon: getSortIcon('createdAt'),
            render: (item) => item.createdAt || 'N/A'
        }
    ], [getSortIcon, requestSort]);

    const totalDisplayedRecords = filteredSchemes.length;

    return (
        <>
            <div className="space-y-6 bg-gray-50 dark:bg-gray-900">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Scheme Management</h1>
                        <p className="text-gray-600">Manage all government schemes</p>
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
                            onClick={handleAddScheme}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
                        >
                            <FaUserPlus className="w-4 h-4" />
                            <span>Add Scheme</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Schemes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.totalSchemes}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Layers className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Schemes</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.activeSchemes}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Inactive Schemes</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {stats.inactiveSchemes}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {/* Left Side: Search */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search Input */}
                            <div className="relative w-full sm:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Scheme Name..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {sortedSchemes.length} found
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
                            {selectedIds.size > 0 && (
                                <button
                                    onClick={() => handleBulkDelete(selectedIds)}
                                    className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdDelete className="w-4 h-4" />
                                    Delete ({selectedIds.size})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-5 bg-primary-50/50 rounded-xl border border-primary-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Status
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                                        value={tempFilters.status || ""}
                                        onChange={(e) => handleFilterChange("status", e.target.value)}
                                    >
                                        <option value="">All Statuses</option>
                                        {getStatusOptions.map(status => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
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

                <DataTable
                    columns={columns}
                    data={sortedSchemes}
                    loading={loading}
                    onEdit={handleEditScheme}
                    onDelete={handleDeleteClick}
                    onBulkDelete={handleBulkDelete}
                    addButtonLabel="Add New Scheme"
                    emptyStateMessage="No schemes found. Try adjusting your search or filters."
                    loadingMessage="Loading schemes data..."
                    enableSelection={true}
                    enablePagination={true}
                    selectedRows={selectedIds}
                    onSelectRow={toggleSelectScheme}
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
                                    ? `You're about to delete ${deleteId?.length || 0} selected scheme(s). This action cannot be undone.`
                                    : "You're about to delete this scheme. This action cannot be undone."}
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

export default ManageSchemesTable;