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
    X,
    User,
    Tag,
    FileText,
    Clock
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
import { PATHROUTES } from "../../../routes/pathRoutes";

// Sample JSON data for handover records
const sampleHandoverData = [
    {
        uid: "HOV-2024-001",
        handoverOfficerId: "1",
        handoverOfficerName: "Rajesh Kumar",
        handoverOfficerMobile: "9876543210",
        beneficiaryId: "BEN-2024-001",
        doNumber: "DO-2024-001",
        animalEarTagId: "1",
        animalEarTag: "TAG-0001",
        animalType: "Cow",
        date: "2024-02-10",
        time: "10:30",
        status: "inprogress",
        image: null,
        video: null,
        finalHandoverDocument: null,
        createdAt: "2024-02-10T10:30:00Z"
    },
    {
        uid: "HOV-2024-002",
        handoverOfficerId: "2",
        handoverOfficerName: "Priya Sharma",
        handoverOfficerMobile: "9876543211",
        beneficiaryId: "BEN-2024-002",
        doNumber: "DO-2024-002",
        animalEarTagId: "2",
        animalEarTag: "TAG-0002",
        animalType: "Buffalo",
        date: "2024-02-12",
        time: "11:45",
        status: "completed",
        image: null,
        video: null,
        finalHandoverDocument: "document1.pdf",
        createdAt: "2024-02-12T11:45:00Z"
    },
    {
        uid: "HOV-2024-003",
        handoverOfficerId: "3",
        handoverOfficerName: "Amit Patel",
        handoverOfficerMobile: "9876543212",
        beneficiaryId: "BEN-2024-003",
        doNumber: "DO-2024-003",
        animalEarTagId: "3",
        animalEarTag: "TAG-0003",
        animalType: "Cow",
        date: "2024-02-14",
        time: "09:15",
        status: "inprogress",
        image: null,
        video: null,
        finalHandoverDocument: null,
        createdAt: "2024-02-14T09:15:00Z"
    },
    {
        uid: "HOV-2024-004",
        handoverOfficerId: "4",
        handoverOfficerName: "Sneha Reddy",
        handoverOfficerMobile: "9876543213",
        beneficiaryId: "BEN-2024-004",
        doNumber: "DO-2024-004",
        animalEarTagId: "4",
        animalEarTag: "TAG-0004",
        animalType: "Buffalo",
        date: "2024-02-18",
        time: "14:20",
        status: "completed",
        image: null,
        video: null,
        finalHandoverDocument: "document2.pdf",
        createdAt: "2024-02-18T14:20:00Z"
    },
    {
        uid: "HOV-2024-005",
        handoverOfficerId: "5",
        handoverOfficerName: "Vikram Singh",
        handoverOfficerMobile: "9876543214",
        beneficiaryId: "BEN-2024-005",
        doNumber: "DO-2024-005",
        animalEarTagId: "5",
        animalEarTag: "TAG-0005",
        animalType: "Cow",
        date: "2024-02-22",
        time: "16:00",
        status: "inprogress",
        image: null,
        video: null,
        finalHandoverDocument: null,
        createdAt: "2024-02-22T16:00:00Z"
    }
];

const HandoverList = () => {
    const navigate = useNavigate();
    const [handovers, setHandovers] = useState([]);
    const [filteredHandovers, setFilteredHandovers] = useState([]);
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
    const [selectedHandovers, setSelectedHandovers] = useState(new Set());

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

    // Load handovers from sample data
    const loadHandovers = useCallback(() => {
        setLoading(true);
        try {
            // Simulate API delay
            setTimeout(() => {
                const handoversData = sampleHandoverData.map(handover => ({
                    ...handover,
                    uid: getValue(handover.uid),
                    handoverOfficer: `${handover.handoverOfficerName} - ${handover.handoverOfficerMobile}`,
                    beneficiaryId: getValue(handover.beneficiaryId),
                    doNumber: getValue(handover.doNumber),
                    animalEarTag: handover.animalEarTag,
                    animalType: handover.animalType,
                    status: getValue(handover.status),
                    date: handover.date,
                    time: handover.time,
                    createdAt: handover.createdAt
                }));

                setHandovers(handoversData);
                setFilteredHandovers(handoversData);

                setPagination({
                    currentPage: 1,
                    totalPages: Math.ceil(handoversData.length / 10),
                    totalRecords: handoversData.length,
                    limit: 10
                });

                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error loading handovers:', error);
            toast.error("Failed to load handover records");
            setHandovers([]);
            setFilteredHandovers([]);
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadHandovers();
    }, [loadHandovers]);

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
    const applyFilters = useCallback((filterValues, handoversData = handovers) => {
        let filtered = [...handoversData];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(handover =>
                handover.uid.toLowerCase().includes(searchLower) ||
                handover.handoverOfficerName?.toLowerCase().includes(searchLower) ||
                handover.handoverOfficerMobile?.includes(searchLower) ||
                handover.beneficiaryId.toLowerCase().includes(searchLower) ||
                handover.doNumber.toLowerCase().includes(searchLower) ||
                handover.animalEarTag?.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (filterValues.status) {
            filtered = filtered.filter(handover => handover.status === filterValues.status);
        }

        setFilteredHandovers(filtered);

        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            totalRecords: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.limit)
        }));

    }, [searchTerm, handovers]);

    // Fetch when search term changes
    useEffect(() => {
        if (handovers.length > 0) {
            applyFilters(filters);
        }
    }, [searchTerm, filters, applyFilters, handovers]);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
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
        applyFilters(tempFilters, handovers);
        setAppliedFilters(tempFilters);

        // Check if any filters are applied
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
        applyFilters(emptyFilters, handovers);
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
    const sortedHandovers = useMemo(() => {
        if (sortCycle.step === 0) {
            return filteredHandovers;
        }

        return [...filteredHandovers].sort((a, b) => {
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
    }, [filteredHandovers, sortCycle]);

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

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inprogress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Table columns
    const columns = useMemo(() => [
        {
            key: "uid",
            label: "Handover ID",
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
            key: "handoverOfficer",
            label: "Handover Officer",
            sortable: true,
            onSort: () => requestSort('handoverOfficerName'),
            sortIcon: getSortIcon('handoverOfficerName'),
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-full">
                        <User size={16} className="text-primary-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{item.handoverOfficerName}</div>
                        <div className="text-xs text-gray-500">{item.handoverOfficerMobile}</div>
                    </div>
                </div>
            )
        },
        {
            key: "beneficiaryId",
            label: "Beneficiary ID",
            sortable: true,
            onSort: () => requestSort('beneficiaryId'),
            sortIcon: getSortIcon('beneficiaryId'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-900">{item.beneficiaryId}</div>
                </div>
            )
        },
        {
            key: "doNumber",
            label: "DO Number",
            sortable: true,
            onSort: () => requestSort('doNumber'),
            sortIcon: getSortIcon('doNumber'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400" />
                    <div className="font-medium text-gray-900">{item.doNumber}</div>
                </div>
            )
        },
        {
            key: "animalEarTag",
            label: "Animal Tag",
            sortable: true,
            onSort: () => requestSort('animalEarTag'),
            sortIcon: getSortIcon('animalEarTag'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Tag size={14} className="text-gray-400" />
                    <div>
                        <div className="font-medium text-gray-900">{item.animalEarTag}</div>
                        {item.animalType && (
                            <div className="text-xs text-gray-500">{item.animalType}</div>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            onSort: () => requestSort('status'),
            sortIcon: getSortIcon('status'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
                        {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Unknown'}
                    </span>
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
                const formattedTime = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return (
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <div>
                            <div className="font-medium text-gray-900">{formattedDate}</div>
                            <div className="text-xs text-gray-500">{formattedTime}</div>
                        </div>
                    </div>
                );
            }
        },
    ], [getSortIcon, requestSort]);

    // Selection handlers
    const toggleSelectHandover = (uid) => {
        if (!uid) return;
        setSelectedHandovers((prev) => {
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
        if (selectedHandovers.size === filteredHandovers.length && filteredHandovers.length > 0) {
            setSelectedHandovers(new Set());
        } else {
            setSelectedHandovers(new Set(filteredHandovers.map(handover => handover.uid).filter(Boolean)));
        }
    };

    // Event handlers
    const handleAddHandover = () => {
        navigate(PATHROUTES.addHandover);
    };

    const handleEdit = (handover) => {
        navigate(`${PATHROUTES.editHandover}/${handover.uid}`, {
            state: handover
        });
    };

    const handleView = (handover) => {
        navigate(`${PATHROUTES.handoverDetails}/${handover.uid}`, {
            state: handover
        });
    };

    const handleDelete = (uid) => {
        if (!uid) {
            toast.error("Cannot delete handover record: Invalid ID");
            return;
        }
        setDeleteTarget("single");
        setDeleteId(uid);
        setShowDeleteModal(true);
    };

    const handleBulkDelete = () => {
        if (selectedHandovers.size === 0) {
            toast.error("Please select handover records to delete");
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

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            if (deleteTarget === "selected") {
                // Remove selected handovers from state
                setHandovers(prev => prev.filter(h => !selectedHandovers.has(h.uid)));
                setFilteredHandovers(prev => prev.filter(h => !selectedHandovers.has(h.uid)));

                toast.success(`${selectedHandovers.size} handover record(s) deleted successfully!`);
                setSelectedHandovers(new Set());

            } else if (deleteTarget === "single" && deleteId) {
                // Remove single handover from state
                setHandovers(prev => prev.filter(h => h.uid !== deleteId));
                setFilteredHandovers(prev => prev.filter(h => h.uid !== deleteId));

                toast.success("Handover deleted successfully!");
                setSelectedHandovers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(deleteId);
                    return newSet;
                });
            }

            // Update pagination
            setPagination(prev => ({
                ...prev,
                totalRecords: handovers.length - (deleteTarget === "selected" ? selectedHandovers.size : 1),
                totalPages: Math.ceil((handovers.length - (deleteTarget === "selected" ? selectedHandovers.size : 1)) / prev.limit)
            }));

        } catch (error) {
            console.error("Error in delete operation:", error);
            toast.error("Failed to delete handover record");
        } finally {
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleteId(null);
            setIsDeleting(false);
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        toast.success("Refreshing data...");
        loadHandovers();
    };

    const getCurrentDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    const totalDisplayedRecords = filteredHandovers.length;

    return (
        <>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Handover</h1>
                        <p className="text-gray-600">Manage handover records for beneficiaries</p>
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
                            onClick={handleAddHandover}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
                        >
                            <FaUserPlus className="w-4 h-4" />
                            <span>Add Handover</span>
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
                                    placeholder="Search by ID, Officer, Beneficiary, DO Number..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {filteredHandovers.length} found
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
                            {selectedHandovers.size > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdDelete className="w-4 h-4" />
                                    Delete ({selectedHandovers.size})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-5 bg-primary-50/50 rounded-xl border border-primary-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        <option value="inprogress">In Progress</option>
                                        <option value="completed">Completed</option>
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
                                                        if (key === 'status') {
                                                            return `Status: ${appliedFilters[key]}`;
                                                        }
                                                        return `${key}: ${appliedFilters[key]}`;
                                                    }).filter(Boolean).join(', ')}
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
                    data={sortedHandovers.slice(
                        (pagination.currentPage - 1) * pagination.limit,
                        pagination.currentPage * pagination.limit
                    )}
                    loading={loading}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                    addButtonLabel="Add New Handover"
                    emptyStateMessage="No handover records found. Try adjusting your search or filters."
                    loadingMessage="Loading handover records..."
                    enableSelection={true}
                    enablePagination={true}
                    selectedRows={selectedHandovers}
                    onSelectRow={toggleSelectHandover}
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
                                    ? `You're about to delete ${selectedHandovers.size} selected handover record(s). This action cannot be undone.`
                                    : "You're about to delete this handover record. This action cannot be undone."}
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

export default HandoverList;