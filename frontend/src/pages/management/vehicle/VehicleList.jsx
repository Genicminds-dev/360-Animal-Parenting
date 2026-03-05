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
    Truck,
    User,
    Users
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

// Dummy data for vehicles
const DUMMY_VEHICLES = [
    {
        id: "VEH001",
        uid: "VEH001",
        vehicleType: "Ambulance",
        vehicleNumber: "MH12AB1234",
        vehicleSize: "2.5",
        driverName: "Rajesh Kumar",
        driverMobile: "9876543210",
        driverAadhar: "123456789012",
        driverDL: "MH12-1234567890",
        helperName: "Suresh Yadav",
        helperMobile: "8765432109",
        helperAadhar: "234567890123",
        vehiclePhotoUrl: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        driverPhotoUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1160&q=80",
        rcDocumentUrl: "#",
        insuranceDocumentUrl: "#",
        hasVehiclePhoto: true,
        hasDriverPhoto: true,
        hasHelperPhoto: false,
        hasRC: true,
        hasInsurance: true,
        createdAt: "2024-01-15T10:30:00Z"
    },
    {
        id: "VEH002",
        uid: "VEH002",
        vehicleType: "Animal Transport Van",
        vehicleNumber: "GJ01CD5678",
        vehicleSize: "3.0",
        driverName: "Mahesh Patel",
        driverMobile: "9988776655",
        driverAadhar: "345678901234",
        driverDL: "GJ01-2345678901",
        helperName: "",
        helperMobile: "",
        helperAadhar: "",
        vehiclePhotoUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        driverPhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        rcDocumentUrl: "#",
        insuranceDocumentUrl: "#",
        hasVehiclePhoto: true,
        hasDriverPhoto: true,
        hasHelperPhoto: false,
        hasRC: true,
        hasInsurance: true,
        createdAt: "2024-02-20T14:45:00Z"
    },
    {
        id: "VEH003",
        uid: "VEH003",
        vehicleType: "Pickup Truck",
        vehicleNumber: "RJ14EF9012",
        vehicleSize: "1.5",
        driverName: "Ramesh Choudhary",
        driverMobile: "8877665544",
        driverAadhar: "456789012345",
        driverDL: "RJ14-3456789012",
        helperName: "Gopal Singh",
        helperMobile: "7766554433",
        helperAadhar: "567890123456",
        vehiclePhotoUrl: "https://images.unsplash.com/photo-1597604540206-6f0e200ffca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        driverPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        helperPhotoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1160&q=80",
        rcDocumentUrl: "#",
        insuranceDocumentUrl: "#",
        hasVehiclePhoto: true,
        hasDriverPhoto: true,
        hasHelperPhoto: true,
        hasRC: true,
        hasInsurance: true,
        createdAt: "2024-03-10T09:15:00Z"
    },
    {
        id: "VEH004",
        uid: "VEH004",
        vehicleType: "Cattle Carrier",
        vehicleNumber: "MP09GH3456",
        vehicleSize: "5.0",
        driverName: "Dinesh Yadav",
        driverMobile: "7799886655",
        driverAadhar: "678901234567",
        driverDL: "MP09-4567890123",
        helperName: "Mukesh Sharma",
        helperMobile: "6688775544",
        helperAadhar: "789012345678",
        vehiclePhotoUrl: "https://images.unsplash.com/photo-1607604276286-ae5cf8d52b63?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        driverPhotoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        helperPhotoUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        rcDocumentUrl: "#",
        insuranceDocumentUrl: "#",
        hasVehiclePhoto: true,
        hasDriverPhoto: true,
        hasHelperPhoto: true,
        hasRC: true,
        hasInsurance: true,
        createdAt: "2024-04-05T11:20:00Z"
    },
    {
        id: "VEH005",
        uid: "VEH005",
        vehicleType: "Small Van",
        vehicleNumber: "DL07IJ7890",
        vehicleSize: "1.0",
        driverName: "Sanjay Gupta",
        driverMobile: "9900112233",
        driverAadhar: "890123456789",
        driverDL: "DL07-5678901234",
        helperName: "",
        helperMobile: "",
        helperAadhar: "",
        vehiclePhotoUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
        driverPhotoUrl: "https://images.unsplash.com/photo-1531427186111-7a6c3a9c7e9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        rcDocumentUrl: "#",
        insuranceDocumentUrl: "#",
        hasVehiclePhoto: true,
        hasDriverPhoto: true,
        hasHelperPhoto: false,
        hasRC: true,
        hasInsurance: true,
        createdAt: "2024-05-12T09:30:00Z"
    }
];

const VehicleList = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search state
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const searchTimeoutRef = useRef(null);

    // Filter UI state
    const [showFilters, setShowFilters] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        vehicleType: "",
        driverName: "",
        fromDate: "",
        toDate: ""
    });
    const [filters, setFilters] = useState({
        vehicleType: "",
        driverName: "",
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
    const [selectedVehicles, setSelectedVehicles] = useState(new Set());

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Sorting state
    const [sortCycle, setSortCycle] = useState({
        key: "createdAt",
        step: 2,
    });

    // Load dummy data
    useEffect(() => {
        loadDummyData();
    }, []);

    // Initialize tempFilters
    useEffect(() => {
        setTempFilters(filters);
        const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
        setIsFilterApplied(hasAppliedFilters);
        setAppliedFilters(filters);
    }, [filters]);

    // Load dummy data function
    const loadDummyData = () => {
        setLoading(true);
        setTimeout(() => {
            const formattedData = DUMMY_VEHICLES.map(vehicle => ({
                ...vehicle,
                id: vehicle.uid,
                vehicleNumber: vehicle.vehicleNumber,
                vehicleType: vehicle.vehicleType,
                vehicleSize: vehicle.vehicleSize,
                driverName: vehicle.driverName,
                driverMobile: vehicle.driverMobile,
                helperName: vehicle.helperName || 'No Helper',
                hasVehiclePhoto: vehicle.hasVehiclePhoto,
                hasDriverPhoto: vehicle.hasDriverPhoto,
                hasHelperPhoto: vehicle.hasHelperPhoto
            }));

            setVehicles(formattedData);
            setFilteredVehicles(formattedData);
            setPagination(prev => ({
                ...prev,
                totalRecords: formattedData.length,
                totalPages: Math.ceil(formattedData.length / prev.limit)
            }));
            setLoading(false);
        }, 1000);
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
    const applyFilters = useCallback((filterValues, vehiclesData = vehicles) => {
        let filtered = [...vehiclesData];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(vehicle =>
                vehicle.uid.toLowerCase().includes(searchLower) ||
                vehicle.vehicleNumber.toLowerCase().includes(searchLower) ||
                vehicle.vehicleType.toLowerCase().includes(searchLower) ||
                vehicle.driverName.toLowerCase().includes(searchLower)
            );
        }

        // Apply vehicle type filter
        if (filterValues.vehicleType) {
            filtered = filtered.filter(vehicle =>
                vehicle.vehicleType.toLowerCase() === filterValues.vehicleType.toLowerCase()
            );
        }

        // Apply driver name filter
        if (filterValues.driverName) {
            filtered = filtered.filter(vehicle =>
                vehicle.driverName.toLowerCase().includes(filterValues.driverName.toLowerCase())
            );
        }

        // Apply date range filter
        if (filterValues.fromDate || filterValues.toDate) {
            filtered = filtered.filter(vehicle => {
                const vehicleDate = new Date(vehicle.createdAt);

                if (filterValues.fromDate) {
                    const fromDate = new Date(filterValues.fromDate);
                    fromDate.setHours(0, 0, 0, 0);
                    if (vehicleDate < fromDate) return false;
                }

                if (filterValues.toDate) {
                    const toDate = new Date(filterValues.toDate);
                    toDate.setHours(23, 59, 59, 999);
                    if (vehicleDate > toDate) return false;
                }

                return true;
            });
        }

        setFilteredVehicles(filtered);
        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            totalRecords: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.limit)
        }));
    }, [searchTerm, vehicles]);

    // Apply filters when search term or filters change
    useEffect(() => {
        if (vehicles.length > 0) {
            applyFilters(filters);
        }
    }, [searchTerm, filters, applyFilters, vehicles]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
    };

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
        applyFilters(tempFilters, vehicles);
        setAppliedFilters(tempFilters);

        const hasAppliedFilters = Object.keys(tempFilters).some(key => tempFilters[key] !== "");
        setIsFilterApplied(hasAppliedFilters);
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            vehicleType: "",
            driverName: "",
            fromDate: "",
            toDate: ""
        };
        setTempFilters(emptyFilters);
        setFilters(emptyFilters);
        setAppliedFilters({});
        setIsFilterApplied(false);
        applyFilters(emptyFilters, vehicles);
        setShowFilters(false);
    };

    const handleCancelFilters = () => {
        setTempFilters(filters);
        setShowFilters(false);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handleLimitChange = (newLimit) => {
        setPagination(prev => ({
            ...prev,
            limit: newLimit,
            currentPage: 1
        }));
    };

    const requestSort = useCallback((key) => {
        setSortCycle((prev) => {
            if (prev.key !== key) {
                return { key, step: 1 };
            }
            const nextStep = (prev.step + 1) % 3;
            return { key, step: nextStep };
        });
    }, []);

    const sortedVehicles = useMemo(() => {
        if (sortCycle.step === 0) {
            return filteredVehicles;
        }

        return [...filteredVehicles].sort((a, b) => {
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
    }, [filteredVehicles, sortCycle]);

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

    const uniqueVehicleTypes = useMemo(() => {
        const types = new Set(vehicles.map(vehicle => vehicle.vehicleType).filter(Boolean));
        return Array.from(types).sort();
    }, [vehicles]);

    const columns = useMemo(() => [
        {
            key: "uid",
            label: "Vehicle ID.",
            sortable: true,
            onSort: () => requestSort('uid'),
            sortIcon: getSortIcon('uid'),
            render: (item) => (
                <div className="font-medium text-primary-600">{item.uid}</div>
            )
        },
        {
            key: "vehicleNumber",
            label: "Vehicle No.",
            sortable: true,
            onSort: () => requestSort('vehicleNumber'),
            sortIcon: getSortIcon('vehicleNumber'),
            render: (item) => (
                <div className="font-medium text-gray-800">{item.vehicleNumber}</div>
            )
        },
        {
            key: "vehicleType",
            label: "Vehicle Type",
            sortable: true,
            onSort: () => requestSort('vehicleType'),
            sortIcon: getSortIcon('vehicleType'),
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div>
                        <div className="font-medium text-gray-800">{item.vehicleType}</div>
                        <div className="text-xs text-gray-500">{item.vehicleSize} tons</div>
                    </div>
                </div>
            )
        },
        {
            key: "driverName",
            label: "Driver",
            sortable: true,
            onSort: () => requestSort('driverName'),
            sortIcon: getSortIcon('driverName'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className="text-gray-800">{item.driverName}</span>
                </div>
            )
        },
        {
            key: "helperName",
            label: "Helper",
            render: (item) => (
                <div className="flex items-center gap-2">
                    {item.helperName && item.helperName !== 'No Helper' ? (
                        <>
                            <span className="text-gray-800">{item.helperName}</span>
                        </>
                    ) : (
                        <span className="text-gray-400 text-sm">No Helper</span>
                    )}
                </div>
            )
        },
        {
            key: "createdAt",
            label: "Registered On",
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
                    <div className="text-gray-800">{formattedDate}</div>
                );
            }
        },
    ], [getSortIcon, requestSort]);

    const toggleSelectVehicle = (uid) => {
        if (!uid) return;
        setSelectedVehicles((prev) => {
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
        if (selectedVehicles.size === filteredVehicles.length && filteredVehicles.length > 0) {
            setSelectedVehicles(new Set());
        } else {
            setSelectedVehicles(new Set(filteredVehicles.map(vehicle => vehicle.uid).filter(Boolean)));
        }
    };

    const handleAddVehicle = () => {
        navigate(PATHROUTES.addVehicle);
    };

    const handleEdit = (vehicle) => {
        navigate(`${PATHROUTES.editVehicle}/${vehicle.uid}`, {
            state: { vehicle }
        });
    };

    const handleView = (vehicle) => {
        navigate(`${PATHROUTES.vehicleDetails}/${vehicle.uid}`, {
            state: { vehicle }
        });
    };

    const handleDelete = (uid) => {
        if (!uid) {
            toast.error("Cannot delete vehicle: Invalid vehicle ID");
            return;
        }
        setDeleteTarget("single");
        setDeleteId(uid);
        setShowDeleteModal(true);
    };

    const handleBulkDelete = () => {
        if (selectedVehicles.size === 0) {
            toast.error("Please select vehicles to delete");
            return;
        }
        setDeleteTarget("selected");
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        setLoading(true);

        setTimeout(() => {
            try {
                if (deleteTarget === "selected") {
                    const remainingVehicles = vehicles.filter(
                        vehicle => !selectedVehicles.has(vehicle.uid)
                    );

                    setVehicles(remainingVehicles);
                    
                    const newFilteredVehicles = remainingVehicles.filter(vehicle => {
                        let passesFilter = true;

                        if (filters.vehicleType && vehicle.vehicleType !== filters.vehicleType) {
                            passesFilter = false;
                        }

                        if (filters.driverName && !vehicle.driverName.toLowerCase().includes(filters.driverName.toLowerCase())) {
                            passesFilter = false;
                        }

                        return passesFilter;
                    });

                    setFilteredVehicles(newFilteredVehicles);

                    setPagination(prev => ({
                        ...prev,
                        totalRecords: newFilteredVehicles.length,
                        totalPages: Math.ceil(newFilteredVehicles.length / prev.limit)
                    }));

                    setSelectedVehicles(new Set());
                    toast.success(`${selectedVehicles.size} vehicle(s) deleted successfully!`);

                } else if (deleteTarget === "single" && deleteId) {
                    const remainingVehicles = vehicles.filter(
                        vehicle => vehicle.uid !== deleteId
                    );

                    setVehicles(remainingVehicles);

                    const newFilteredVehicles = remainingVehicles.filter(vehicle => {
                        let passesFilter = true;

                        if (filters.vehicleType && vehicle.vehicleType !== filters.vehicleType) {
                            passesFilter = false;
                        }

                        if (filters.driverName && !vehicle.driverName.toLowerCase().includes(filters.driverName.toLowerCase())) {
                            passesFilter = false;
                        }

                        return passesFilter;
                    });

                    setFilteredVehicles(newFilteredVehicles);

                    setPagination(prev => ({
                        ...prev,
                        totalRecords: newFilteredVehicles.length,
                        totalPages: Math.ceil(newFilteredVehicles.length / prev.limit)
                    }));

                    setSelectedVehicles((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(deleteId);
                        return newSet;
                    });

                    toast.success("Vehicle deleted successfully!");
                }
            } catch (error) {
                console.error("Error in delete operation:", error);
                toast.error("Failed to delete vehicle");
            } finally {
                setShowDeleteModal(false);
                setDeleteTarget(null);
                setDeleteId(null);
                setIsDeleting(false);
                setLoading(false);
            }
        }, 1000);
    };

    const handleRefresh = () => {
        toast.success("Refreshing vehicle data...");
        loadDummyData();
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
                        <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
                        <p className="text-gray-600">Manage vehicles for animal transportation</p>
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
                            onClick={handleAddVehicle}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
                        >
                            <FaUserPlus className="w-4 h-4" />
                            <span>Add Vehicle</span>
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
                                    placeholder="Search by Vehicle No., Type, Driver..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {filteredVehicles.length} found
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
                            {selectedVehicles.size > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdDelete className="w-4 h-4" />
                                    Delete ({selectedVehicles.size})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-5 bg-primary-50/50 rounded-xl border border-primary-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Vehicle Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vehicle Type
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                                        value={tempFilters.vehicleType || ""}
                                        onChange={(e) => handleFilterChange("vehicleType", e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        {uniqueVehicleTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Driver Name Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Driver Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                                        placeholder="Enter driver name"
                                        value={tempFilters.driverName || ""}
                                        onChange={(e) => handleFilterChange("driverName", e.target.value)}
                                    />
                                </div>

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
                    data={sortedVehicles.slice(
                        (pagination.currentPage - 1) * pagination.limit,
                        pagination.currentPage * pagination.limit
                    )}
                    loading={loading}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                    addButtonLabel="Add New Vehicle"
                    emptyStateMessage="No vehicles found. Try adjusting your search or filters."
                    loadingMessage="Loading vehicles data..."
                    enableSelection={true}
                    enablePagination={true}
                    selectedRows={selectedVehicles}
                    onSelectRow={toggleSelectVehicle}
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
                                    ? `You're about to delete ${selectedVehicles.size} selected vehicle(s). This action cannot be undone.`
                                    : "You're about to delete this vehicle. This action cannot be undone."}
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

export default VehicleList;