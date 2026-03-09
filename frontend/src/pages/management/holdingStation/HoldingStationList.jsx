// pages/holding-station/HoldingStationList.jsx
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
    Building2,
    MapPin
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

// Dummy data for holding stations
const DUMMY_HOLDING_STATIONS = [
    {
        id: "HS001",
        uid: "HS001",
        name: "Green Valley Holding Station",
        state: "Maharashtra",
        city: "Pune",
        pinCode: "411001",
        address: "Green Valley Complex, Near Pune Railway Station, Shivajinagar, Pune - 411001",
        photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        hasPhoto: true,
        hasVideo: true,
        photoUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        createdAt: "2024-01-15T10:30:00Z"
    },
    {
        id: "HS002",
        uid: "HS002",
        name: "Sunrise Animal Care Center",
        state: "Gujarat",
        city: "Ahmedabad",
        pinCode: "380001",
        address: "Sunrise Complex, Near Sabarmati Riverfront, Ellisbridge, Ahmedabad - 380001",
        photo: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        video: null,
        hasPhoto: true,
        hasVideo: false,
        photoUrl: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        videoUrl: null,
        createdAt: "2024-02-20T14:45:00Z"
    },
    {
        id: "HS003",
        uid: "HS003",
        name: "Royal Holding Facility",
        state: "Rajasthan",
        city: "Jaipur",
        pinCode: "302001",
        address: "Royal Enclave, Near Hawa Mahal, Pink City, Jaipur - 302001",
        photo: null,
        video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
        hasPhoto: false,
        hasVideo: true,
        photoUrl: null,
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
        createdAt: "2024-03-10T09:15:00Z"
    },
    {
        id: "HS004",
        uid: "HS004",
        name: "Mumbai Animal Shelter",
        state: "Maharashtra",
        city: "Mumbai",
        pinCode: "400001",
        address: "Marine Lines, Mumbai - 400001",
        photo: null,
        video: null,
        hasPhoto: false,
        hasVideo: false,
        photoUrl: null,
        videoUrl: null,
        createdAt: "2024-04-05T11:20:00Z"
    },
    {
        id: "HS005",
        uid: "HS005",
        name: "Delhi Pet Care Center",
        state: "Delhi",
        city: "New Delhi",
        pinCode: "110001",
        address: "Connaught Place, New Delhi - 110001",
        photo: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        video: null,
        hasPhoto: true,
        hasVideo: false,
        photoUrl: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        videoUrl: null,
        createdAt: "2024-05-12T09:30:00Z"
    }
];

const HoldingStationList = () => {
    const navigate = useNavigate();
    const [stations, setStations] = useState([]);
    const [filteredStations, setFilteredStations] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search state - separate input and debounced term
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const searchTimeoutRef = useRef(null);

    // Filter UI state
    const [showFilters, setShowFilters] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        state: "",
        city: "",
        fromDate: "",
        toDate: ""
    });
    const [filters, setFilters] = useState({
        state: "",
        city: "",
        fromDate: "",
        toDate: ""
    });
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10
    });

    // Selection state
    const [selectedStations, setSelectedStations] = useState(new Set());

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

    // Load dummy data on component mount
    useEffect(() => {
        loadDummyData();
    }, []);

    // Initialize tempFilters when filters change
    useEffect(() => {
        setTempFilters(filters);

        // Check if any filters are applied
        const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
        setIsFilterApplied(hasAppliedFilters);
        setAppliedFilters(filters);
    }, [filters]);

    // Load dummy data function
    const loadDummyData = () => {
        setLoading(true);
        setTimeout(() => {
            const formattedData = DUMMY_HOLDING_STATIONS.map(station => ({
                ...station,
                id: station.uid,
                name: station.name,
                state: station.state,
                city: station.city,
                pinCode: station.pinCode,
                address: station.address,
                hasPhoto: station.hasPhoto,
                hasVideo: station.hasVideo,
                photoUrl: station.photoUrl,
                videoUrl: station.videoUrl
            }));

            setStations(formattedData);
            setFilteredStations(formattedData);
            setPagination(prev => ({
                ...prev,
                totalRecords: formattedData.length,
                totalPages: Math.ceil(formattedData.length / prev.limit)
            }));
            setLoading(false);
        }, 1000); // Simulate loading delay
    };

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
    const applyFilters = useCallback((filterValues, stationsData = stations) => {
        let filtered = [...stationsData];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(station =>
                station.uid.toLowerCase().includes(searchLower) ||
                station.name.toLowerCase().includes(searchLower) ||
                station.state.toLowerCase().includes(searchLower) ||
                station.city.toLowerCase().includes(searchLower)
            );
        }

        // Apply state filter
        if (filterValues.state) {
            filtered = filtered.filter(station =>
                station.state.toLowerCase() === filterValues.state.toLowerCase()
            );
        }

        // Apply city filter
        if (filterValues.city) {
            filtered = filtered.filter(station =>
                station.city.toLowerCase() === filterValues.city.toLowerCase()
            );
        }

        // Apply date range filter
        if (filterValues.fromDate || filterValues.toDate) {
            filtered = filtered.filter(station => {
                const stationDate = new Date(station.createdAt);

                if (filterValues.fromDate) {
                    const fromDate = new Date(filterValues.fromDate);
                    fromDate.setHours(0, 0, 0, 0);
                    if (stationDate < fromDate) return false;
                }

                if (filterValues.toDate) {
                    const toDate = new Date(filterValues.toDate);
                    toDate.setHours(23, 59, 59, 999);
                    if (stationDate > toDate) return false;
                }

                return true;
            });
        }

        setFilteredStations(filtered);

        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            totalRecords: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.limit)
        }));

    }, [searchTerm, stations]);

    // Apply filters when search term or filters change
    useEffect(() => {
        if (stations.length > 0) {
            applyFilters(filters);
        }
    }, [searchTerm, filters, applyFilters, stations]);

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
        applyFilters(tempFilters, stations);
        setAppliedFilters(tempFilters);

        // Check if any filters are applied
        const hasAppliedFilters = Object.keys(tempFilters).some(key => tempFilters[key] !== "");
        setIsFilterApplied(hasAppliedFilters);

        setShowFilters(false);
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            state: "",
            city: "",
            fromDate: "",
            toDate: ""
        };
        setTempFilters(emptyFilters);
        setFilters(emptyFilters);
        setAppliedFilters({});
        setIsFilterApplied(false);
        applyFilters(emptyFilters, stations);
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
    const sortedStations = useMemo(() => {
        if (sortCycle.step === 0) {
            return filteredStations;
        }

        return [...filteredStations].sort((a, b) => {
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
    }, [filteredStations, sortCycle]);

    // Get sort icon
    const getSortIcon = useCallback(
        (key) => {
            if (sortCycle.key !== key) {
                return <Minus className="ml-1 text-gray-400 dark:text-gray-500" size={16} />;
            }

            if (sortCycle.step === 0) {
                return <Minus className="ml-1 text-gray-400 dark:text-gray-500" size={16} />;
            } else if (sortCycle.step === 1) {
                return <ChevronUp className="ml-1 text-gray-600 dark:text-gray-300" size={16} />;
            } else {
                return <ChevronDown className="ml-1 text-gray-600 dark:text-gray-300" size={16} />;
            }
        },
        [sortCycle]
    );

    // Get all unique states and cities for filter dropdowns
    const uniqueStates = useMemo(() => {
        const states = new Set(stations.map(station => station.state).filter(Boolean));
        return Array.from(states).sort();
    }, [stations]);

    const uniqueCities = useMemo(() => {
        const cities = new Set(stations.map(station => station.city).filter(Boolean));
        return Array.from(cities).sort();
    }, [stations]);

    // Table columns - Only Station ID, Station Name, State, City, Created At
    const columns = useMemo(() => [
        {
            key: "uid",
            label: "Station ID",
            sortable: true,
            onSort: () => requestSort('uid'),
            sortIcon: getSortIcon('uid'),
            render: (item) => (
                <div className="font-medium text-primary-600 dark:text-primary-400">{item.uid}</div>
            )
        },
        {
            key: "name",
            label: "Station Name",
            sortable: true,
            onSort: () => requestSort('name'),
            sortIcon: getSortIcon('name'),
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                        <Building2 className="text-primary-600 dark:text-primary-400" size={18} />
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{item.name}</div>
                </div>
            )
        },
        {
            key: "state",
            label: "State",
            sortable: true,
            onSort: () => requestSort('state'),
            sortIcon: getSortIcon('state'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className="text-gray-800 dark:text-gray-200">{item.state}</span>
                </div>
            )
        },
        {
            key: "city",
            label: "City",
            sortable: true,
            onSort: () => requestSort('city'),
            sortIcon: getSortIcon('city'),
            render: (item) => (
                <span className="text-gray-800 dark:text-gray-200">{item.city}</span>
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
                    <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{formattedDate}</div>
                    </div>
                );
            }
        },
    ], [getSortIcon, requestSort]);

    // Selection handlers
    const toggleSelectStation = (uid) => {
        if (!uid) return;
        setSelectedStations((prev) => {
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
        if (selectedStations.size === filteredStations.length && filteredStations.length > 0) {
            setSelectedStations(new Set());
        } else {
            setSelectedStations(new Set(filteredStations.map(station => station.uid).filter(Boolean)));
        }
    };

    // Event handlers
    const handleAddStation = () => {
        navigate(PATHROUTES.addHoldingStation);
    };

    const handleEdit = (station) => {
        navigate(`${PATHROUTES.editHoldingStation}/${station.uid}`, {
            state: { station }
        });
    };

    const handleView = (station) => {
        navigate(`${PATHROUTES.holdingStationDetails}/${station.uid}`, {
            state: { station }
        });
    };

    const handleDelete = (uid) => {
        if (!uid) {
            toast.error("Cannot delete holding station: Invalid station ID");
            return;
        }
        setDeleteTarget("single");
        setDeleteId(uid);
        setShowDeleteModal(true);
    };

    const handleBulkDelete = () => {
        if (selectedStations.size === 0) {
            toast.error("Please select holding stations to delete");
            return;
        }
        setDeleteTarget("selected");
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        // Prevent double submission
        if (isDeleting) return;

        setIsDeleting(true);
        setLoading(true);

        // Simulate API call with timeout
        setTimeout(() => {
            try {
                if (deleteTarget === "selected") {
                    // Filter out selected stations
                    const remainingStations = stations.filter(
                        station => !selectedStations.has(station.uid)
                    );

                    setStations(remainingStations);

                    // Update filtered stations based on current filters
                    const newFilteredStations = remainingStations.filter(station => {
                        // Re-apply current filters
                        let passesFilter = true;

                        if (filters.state && station.state !== filters.state) {
                            passesFilter = false;
                        }

                        if (filters.city && station.city !== filters.city) {
                            passesFilter = false;
                        }

                        return passesFilter;
                    });

                    setFilteredStations(newFilteredStations);

                    // Update pagination
                    setPagination(prev => ({
                        ...prev,
                        totalRecords: newFilteredStations.length,
                        totalPages: Math.ceil(newFilteredStations.length / prev.limit)
                    }));

                    setSelectedStations(new Set());
                    toast.success(`${selectedStations.size} holding station(s) deleted successfully!`);

                } else if (deleteTarget === "single" && deleteId) {
                    // Remove single station
                    const remainingStations = stations.filter(
                        station => station.uid !== deleteId
                    );

                    setStations(remainingStations);

                    // Update filtered stations
                    const newFilteredStations = remainingStations.filter(station => {
                        // Re-apply current filters
                        let passesFilter = true;

                        if (filters.state && station.state !== filters.state) {
                            passesFilter = false;
                        }

                        if (filters.city && station.city !== filters.city) {
                            passesFilter = false;
                        }

                        return passesFilter;
                    });

                    setFilteredStations(newFilteredStations);

                    // Update pagination
                    setPagination(prev => ({
                        ...prev,
                        totalRecords: newFilteredStations.length,
                        totalPages: Math.ceil(newFilteredStations.length / prev.limit)
                    }));

                    setSelectedStations((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(deleteId);
                        return newSet;
                    });

                    toast.success("Holding station deleted successfully!");
                }
            } catch (error) {
                console.error("Error in delete operation:", error);
                toast.error("Failed to delete holding station");
            } finally {
                setShowDeleteModal(false);
                setDeleteTarget(null);
                setDeleteId(null);
                setIsDeleting(false);
                setLoading(false);
            }
        }, 1000); // Simulate API delay
    };

    const handleRefresh = () => {
        toast.success("Refreshing holding stations data...");
        loadDummyData();
    };

    const getCurrentDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    const totalDisplayedRecords = pagination.totalRecords;

    return (
        <>
            <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Holding Stations</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage holding stations for animal care and temporary housing</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            <span>Refresh</span>
                            <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={handleAddStation}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
                        >
                            <FaUserPlus className="w-4 h-4" />
                            <span>Add Holding Station</span>
                        </button>
                    </div>
                </div>

                {/* Search and Action Menu */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {/* Left Side: Search and Filter Toggle */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search Input */}
                            <div className="relative w-full sm:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiSearch className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by ID, Name, State, City..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                            {filteredStations.length} found
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
                                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                }`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {isFilterApplied && (
                                    <span className="ml-1 px-1.5 py-0.5 bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-300 rounded-full text-xs">
                                        •
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Right Side: Action Buttons */}
                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
                            {/* Bulk Delete Button */}
                            {selectedStations.size > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdDelete className="w-4 h-4" />
                                    Delete ({selectedStations.size})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-5 bg-primary-50/50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800 transition-colors duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* State Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        State
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors duration-300"
                                        value={tempFilters.state || ""}
                                        onChange={(e) => handleFilterChange("state", e.target.value)}
                                    >
                                        <option value="">All States</option>
                                        {uniqueStates.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        City
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors duration-300"
                                        value={tempFilters.city || ""}
                                        onChange={(e) => handleFilterChange("city", e.target.value)}
                                    >
                                        <option value="">All Cities</option>
                                        {uniqueCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        From
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors duration-300"
                                            value={tempFilters.fromDate || ""}
                                            max={getCurrentDate()}
                                            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        To
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors duration-300"
                                            value={tempFilters.toDate || ""}
                                            max={getCurrentDate()}
                                            min={tempFilters.fromDate || undefined}
                                            onChange={(e) => handleFilterChange("toDate", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400 w-full xs:w-auto">
                                    {isFilterApplied && (
                                        <div className="flex flex-wrap items-center gap-2 bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/20 px-3 py-2 rounded-lg border border-primary-200 dark:border-primary-700">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs">
                                                <Filter className="w-3 h-3 mr-1" />
                                                Filters Applied
                                            </span>
                                            <span className="text-primary-700 dark:text-primary-300 text-xs">
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
                                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 whitespace-nowrap"
                                    >
                                        <X size={14} className="inline mr-1" />
                                        Clear All
                                    </button>
                                    <button
                                        onClick={handleCancelFilters}
                                        className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors border border-primary-300 dark:border-primary-600 whitespace-nowrap"
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
                    data={sortedStations.slice(
                        (pagination.currentPage - 1) * pagination.limit,
                        pagination.currentPage * pagination.limit
                    )}
                    loading={loading}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                    addButtonLabel="Add New Holding Station"
                    emptyStateMessage="No holding stations found. Try adjusting your search or filters."
                    loadingMessage="Loading holding stations data..."
                    enableSelection={true}
                    enablePagination={true}
                    selectedRows={selectedStations}
                    onSelectRow={toggleSelectStation}
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-opacity-70 overflow-y-auto transition-colors duration-300"
                    style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-md shadow-xl mx-2 transition-colors duration-300">
                        <div className="flex justify-center mb-4 mt-4">
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full">
                                <HiOutlineTrash className="w-10 h-10 text-red-500 dark:text-red-400" />
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                                Confirm Deletion
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed p-3">
                                {deleteTarget === "selected"
                                    ? `You're about to delete ${selectedStations.size} selected holding station(s). This action cannot be undone.`
                                    : "You're about to delete this holding station. This action cannot be undone."}
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
                                className="flex-1 px-2 sm:px-5 py-1 border sm:py-2 border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-sm font-medium focus:outline-none"
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

export default HoldingStationList;