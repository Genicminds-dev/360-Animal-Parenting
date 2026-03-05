import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    Calendar,
    ArrowRight,
    HeartPulse,
    Milk,
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    Minus,
    Eye,
    Package,
    CalendarClock,
} from "lucide-react";
import { GiCow } from "react-icons/gi";
import { BiSearch } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { HiOutlineTrash } from 'react-icons/hi';
import DataTable from "../../../components/common/Table/DataTable";
import { PATHROUTES } from "../../../routes/pathRoutes";

// Mock data for procurement batches
const MOCK_PROCUREMENT_BATCHES = [
    {
        id: "BATCH-001",
        batchId: "PRC-2024-001",
        batchSize: 6,
        procurementOfficer: "John Doe",
        broker: "Rajesh Kumar",
        sourceType: "Bazaar",
        sourceLocation: "Mumbai Market",
        date: "2024-01-15",
        time: "10:30",
        animals: [
            {
                earTagId: "TAG-001",
                breed: "Gir",
                calvingStatus: "Milking",
                gender: "Female"
            },
            {
                earTagId: "TAG-002",
                breed: "Sahiwal",
                calvingStatus: "Pregnant",
                gender: "Female"
            },
            {
                earTagId: "TAG-003",
                breed: "Jersey Cross",
                calvingStatus: "Milking",
                gender: "Female"
            },
            {
                earTagId: "TAG-004",
                breed: "Jersey Cross",
                calvingStatus: "Milking",
                gender: "Female"
            },
            {
                earTagId: "TAG-005",
                breed: "Jersey Cross",
                calvingStatus: "Milking",
                gender: "Female"
            },
            {
                earTagId: "TAG-006",
                breed: "Jersey Cross",
                calvingStatus: "Milking",
                gender: "Female"
            }
        ],
        vehicleNo: "MH-01-AB-1234",
        holdingStation: "Central Holding Station",
        placeFrom: "Mumbai Market",
        placeTo: "Main Farm",
        createdAt: "2024-01-15T10:30:00Z"
    },
    {
        id: "BATCH-002",
        batchId: "PRC-2024-002",
        batchSize: 2,
        procurementOfficer: "Jane Smith",
        broker: "Suresh Patel",
        sourceType: "Farm",
        sourceLocation: "Pune Dairy Farm",
        date: "2024-01-20",
        time: "14:45",
        animals: [
            {
                earTagId: "TAG-004",
                breed: "Murrah",
                calvingStatus: "Milking",
                gender: "Female"
            },
            {
                earTagId: "TAG-005",
                breed: "Gir",
                calvingStatus: "Pregnant",
                gender: "Female"
            }
        ],
        vehicleNo: "MH-02-CD-5678",
        holdingStation: "North Holding Station",
        placeFrom: "Pune Dairy Farm",
        placeTo: "North Farm",
        createdAt: "2024-01-20T14:45:00Z"
    },
    {
        id: "BATCH-003",
        batchId: "PRC-2024-003",
        batchSize: 4,
        procurementOfficer: "Mike Johnson",
        broker: "Amit Singh",
        sourceType: "Bazaar",
        sourceLocation: "Nagpur Market",
        date: "2024-01-25",
        time: "09:15",
        animals: [
            {
                earTagId: "TAG-006",
                breed: "HF-Cross",
                calvingStatus: "Milking",
                gender: "Female"
            },
            {
                earTagId: "TAG-007",
                breed: "Gir",
                calvingStatus: "Pregnant",
                gender: "Female"
            },
            {
                earTagId: "TAG-008",
                breed: "Sahiwal",
                calvingStatus: "Milking",
                gender: "Female"
            },
            {
                earTagId: "TAG-009",
                breed: "Jersey Cross",
                calvingStatus: "Pregnant",
                gender: "Female"
            }
        ],
        vehicleNo: "MH-03-EF-9012",
        holdingStation: "East Holding Station",
        placeFrom: "Nagpur Market",
        placeTo: "East Farm",
        createdAt: "2024-01-25T09:15:00Z"
    }
];

const BatchLists = () => {
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [filteredBatches, setFilteredBatches] = useState([]);

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
    const [selectedBatches, setSelectedBatches] = useState(new Set());

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
        totalBatches: 0,
        totalAnimals: 0,
        lastBatchDate: null,
    });

    // Initialize tempFilters when component mounts
    useEffect(() => {
        setTempFilters(filters);

        // Check if any filters are applied
        const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
        setIsFilterApplied(hasAppliedFilters);
        setAppliedFilters(filters);
    }, [filters]);

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get the latest batch creation date
    const getLastBatchDate = useCallback((batchesData) => {
        if (!batchesData || batchesData.length === 0) return null;

        const dates = batchesData.map(batch => new Date(batch.createdAt).getTime());
        const latestDate = Math.max(...dates);
        return new Date(latestDate).toISOString();
    }, []);

    // Fetch batches with simulated API call
    const fetchBatches = useCallback(async () => {
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Calculate stats
            const totalAnimals = MOCK_PROCUREMENT_BATCHES.reduce((sum, batch) => sum + batch.batchSize, 0);
            const lastBatchDate = getLastBatchDate(MOCK_PROCUREMENT_BATCHES);

            setStats({
                totalBatches: MOCK_PROCUREMENT_BATCHES.length,
                totalAnimals: totalAnimals,
                lastBatchDate: lastBatchDate,
            });

            setBatches(MOCK_PROCUREMENT_BATCHES);
            setFilteredBatches(MOCK_PROCUREMENT_BATCHES);

            setPagination(prev => ({
                ...prev,
                totalRecords: MOCK_PROCUREMENT_BATCHES.length,
                totalPages: Math.ceil(MOCK_PROCUREMENT_BATCHES.length / prev.limit)
            }));

        } catch (error) {
            toast.error("Failed to fetch procurement batches");
            setBatches([]);
            setFilteredBatches([]);
        } finally {
            setLoading(false);
        }
    }, [getLastBatchDate]);

    useEffect(() => {
        fetchBatches();
    }, [fetchBatches]);

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
        let filtered = [...MOCK_PROCUREMENT_BATCHES];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(batch =>
                batch.batchId.toLowerCase().includes(searchLower) ||
                batch.procurementOfficer.toLowerCase().includes(searchLower) ||
                batch.broker.toLowerCase().includes(searchLower) ||
                batch.sourceLocation.toLowerCase().includes(searchLower) ||
                batch.animals.some(animal => animal.earTagId.toLowerCase().includes(searchLower))
            );
        }

        // Apply source type filter
        if (filterValues.sourceType) {
            filtered = filtered.filter(batch => batch.sourceType === filterValues.sourceType);
        }

        // Apply holding station filter
        if (filterValues.holdingStation) {
            filtered = filtered.filter(batch => batch.holdingStation.includes(filterValues.holdingStation));
        }

        // Apply date range filter
        if (filterValues.fromDate || filterValues.toDate) {
            filtered = filtered.filter(batch => {
                const batchDate = new Date(batch.createdAt);

                if (filterValues.fromDate) {
                    const fromDate = new Date(filterValues.fromDate);
                    fromDate.setHours(0, 0, 0, 0);
                    if (batchDate < fromDate) return false;
                }

                if (filterValues.toDate) {
                    const toDate = new Date(filterValues.toDate);
                    toDate.setHours(23, 59, 59, 999);
                    if (batchDate > toDate) return false;
                }

                return true;
            });
        }

        setFilteredBatches(filtered);

        // Update stats based on filtered data
        const totalAnimals = filtered.reduce((sum, batch) => sum + batch.batchSize, 0);
        const lastBatchDate = getLastBatchDate(filtered);

        setStats({
            totalBatches: filtered.length,
            totalAnimals: totalAnimals,
            lastBatchDate: lastBatchDate,
        });

        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            totalRecords: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.limit)
        }));

    }, [searchTerm, getLastBatchDate]);

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
            sourceType: "",
            holdingStation: "",
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
    const sortedBatches = useMemo(() => {
        if (!sortConfig.key || !sortConfig.direction) return filteredBatches;

        return [...filteredBatches].sort((a, b) => {
            const key = sortConfig.key;
            let aValue = a[key] ?? "";
            let bValue = b[key] ?? "";

            if (key === 'createdAt' || key === 'date') {
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
    }, [filteredBatches, sortConfig]);

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

    // Get ear tag IDs as comma-separated string
    const getEarTagIds = (animals) => {
        return animals.map(animal => animal.earTagId).join(', ');
    };

    // Table columns
    const columns = useMemo(() => [
        {
            key: "batchId",
            label: "Batch ID",
            sortable: true,
            onSort: () => requestSort('batchId'),
            sortIcon: getSortIcon('batchId'),
            render: (item) => (
                <div className="font-medium text-primary-600">{item.batchId}</div>
            )
        },
        {
            key: "batchSize",
            label: "Batch Size",
            sortable: true,
            onSort: () => requestSort('batchSize'),
            sortIcon: getSortIcon('batchSize'),
            render: (item) => (
                <div className="font-medium text-gray-800">
                    <span className="items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.batchSize} Animals
                    </span>
                </div>
            )
        },
        {
            key: "earTagIds",
            label: "Ear Tag IDs",
            sortable: false,
            render: (item) => (
                <div className="font-medium text-gray-800 text-sm break-words whitespace-normal line-clamp-3">
                    {getEarTagIds(item.animals)}
                </div>
            )
        },
        {
            key: "createdAt",
            label: "Created At",
            sortable: true,
            onSort: () => requestSort('createdAt'),
            sortIcon: getSortIcon('createdAt'),
            render: (item) => (
                <div className="font-medium text-gray-800 text-sm">
                    {formatDate(item.createdAt)}
                </div>
            )
        }
    ], [getSortIcon, requestSort]);

    // Selection handlers
    const toggleSelectBatch = (id) => {
        if (!id) return;
        setSelectedBatches((prev) => {
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
        const allIds = filteredBatches.map(batch => batch.id).filter(Boolean);
        if (selectedBatches.size === allIds.length && allIds.length > 0) {
            setSelectedBatches(new Set());
        } else {
            setSelectedBatches(new Set(allIds));
        }
    };

    const handleVaccination = (batch) => {
        navigate(`${PATHROUTES.vaccinationForm}/${batch.batchId}`, {
            state: { batch }
        });
    };

    // Event handlers
    const handleView = (batch) => {
        navigate(`${PATHROUTES.batchDetails}/${batch.batchId}`, {
            state: { batch }
        });
    };

    const handleDelete = (id) => {
        const batch = batches.find(b => b.id === id);
        if (!batch) {
            toast.error("Cannot delete batch: Invalid batch ID");
            return;
        }
        setDeleteTarget("single");
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleBulkDelete = (ids) => {
        if (!ids || ids.size === 0) {
            toast.error("Please select batches to delete");
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
                setBatches(prev => prev.filter(batch => !idsToDelete.includes(batch.id)));
                setFilteredBatches(prev => prev.filter(batch => !idsToDelete.includes(batch.id)));

                // Clear selection
                setSelectedBatches(new Set());

                // Update stats after deletion
                const remainingBatches = batches.filter(batch => !idsToDelete.includes(batch.id));
                const totalAnimals = remainingBatches.reduce((sum, batch) => sum + batch.batchSize, 0);
                const lastBatchDate = getLastBatchDate(remainingBatches);

                setStats({
                    totalBatches: remainingBatches.length,
                    totalAnimals: totalAnimals,
                    lastBatchDate: lastBatchDate,
                });

                // Update pagination
                setPagination(prev => ({
                    ...prev,
                    totalRecords: filteredBatches.length - idsToDelete.length,
                    totalPages: Math.ceil((filteredBatches.length - idsToDelete.length) / prev.limit)
                }));

                toast.success(`${idsToDelete.length} batch(es) deleted successfully!`);

            } else if (deleteTarget === "single" && deleteId) {
                // Simulate API call for single delete
                await new Promise(resolve => setTimeout(resolve, 500));

                // Remove from local state
                setBatches(prev => prev.filter(batch => batch.id !== deleteId));
                setFilteredBatches(prev => prev.filter(batch => batch.id !== deleteId));

                // Remove from selection if present
                setSelectedBatches((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(deleteId);
                    return newSet;
                });

                // Update stats after deletion
                const remainingBatches = batches.filter(batch => batch.id !== deleteId);
                const totalAnimals = remainingBatches.reduce((sum, batch) => sum + batch.batchSize, 0);
                const lastBatchDate = getLastBatchDate(remainingBatches);

                setStats({
                    totalBatches: remainingBatches.length,
                    totalAnimals: totalAnimals,
                    lastBatchDate: lastBatchDate,
                });

                // Update pagination
                setPagination(prev => ({
                    ...prev,
                    totalRecords: filteredBatches.length - 1,
                    totalPages: Math.ceil((filteredBatches.length - 1) / prev.limit)
                }));

                toast.success("Batch deleted successfully!");
            }
        } catch (error) {
            console.error("Error in delete operation:", error);
            toast.error("Failed to delete batch");
        } finally {
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleteId(null);
            setIsDeleting(false);
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        toast.success("Refreshing procurement data...");
        fetchBatches();
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
        const types = [...new Set(MOCK_PROCUREMENT_BATCHES.map(b => b.sourceType))];
        return types.sort();
    }, []);

    const totalDisplayedRecords = filteredBatches.length;

    return (
        <>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Animal Batch List</h1>
                        <p className="text-gray-600">View and manage all animal batches</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Batches */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start justify-between">
                            <div className="p-3 bg-primary-100 rounded-lg">
                                <Package className="text-primary-600" size={24} />
                            </div>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.totalBatches}</h3>
                                <p className="text-gray-600">Total Batches</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Animals */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start justify-between">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <GiCow className="text-green-600" size={24} />
                            </div>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.totalAnimals}</h3>
                                <p className="text-gray-600">Total Animals</p>
                            </div>
                        </div>
                    </div>

                    {/* Last Batch Creation Date */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start justify-between">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <CalendarClock className="text-purple-600" size={24} />
                            </div>
                            <div className="text-right">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {stats.lastBatchDate ? formatDate(stats.lastBatchDate) : 'No batches'}
                                </h3>
                                <p className="text-gray-600">Last Batch Created</p>
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
                                    placeholder="Search by Batch ID, Officer, Location, Ear Tag..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {filteredBatches.length} found
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
                            {selectedBatches.size > 0 && (
                                <button
                                    onClick={() => handleBulkDelete(selectedBatches)}
                                    className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdDelete className="w-4 h-4" />
                                    Delete ({selectedBatches.size})
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
                                        {uniqueSourceTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Holding Station Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Holding Station
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Search station..."
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                                        value={tempFilters.holdingStation || ""}
                                        onChange={(e) => handleFilterChange("holdingStation", e.target.value)}
                                    />
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
                    data={sortedBatches}
                    loading={loading}
                    onEdit={null}
                    onAddVaccine={handleVaccination}
                    enableVaccination={true}
                    vaccineLabel="Update Vaccination"
                    onView={handleView}
                    onDelete={handleDelete}
                    onBulkDelete={handleBulkDelete}
                    emptyStateMessage="No procurement batches found. Try adjusting your filters or create a new batch."
                    loadingMessage="Loading procurement data..."
                    enableSelection={true}
                    enablePagination={true}
                    selectedRows={selectedBatches}
                    onSelectRow={toggleSelectBatch}
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
                                    ? `You're about to delete ${deleteId?.length || 0} selected batch(es). This action cannot be undone.`
                                    : "You're about to delete this batch. This action cannot be undone."}
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

export default BatchLists;