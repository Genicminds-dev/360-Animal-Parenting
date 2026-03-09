import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    ArrowRight,
    ChevronUp,
    ChevronDown,
    Minus,
    Filter,
    X,
    Calendar
} from "lucide-react";
import {
    FaUserPlus,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi";
import DataTable from "../../../components/common/Table/DataTable";
import { PATHROUTES } from "../../../routes/pathRoutes";

const sampleBeneficiaryData = [
    {
        uid: "BEN-2024-001",
        name: "Ramesh Kumar",
        gender: "male",
        dateOfBirth: "1985-06-15",
        address: "123 Main Street, Near City Park",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        createdAt: "2024-01-15T10:30:00Z"
    },
    {
        uid: "BEN-2024-002",
        name: "Sunita Sharma",
        gender: "female",
        dateOfBirth: "1990-08-22",
        address: "456 Lake View Apartments, Andheri East",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400069",
        createdAt: "2024-01-18T11:45:00Z"
    },
    {
        uid: "BEN-2024-003",
        name: "Amit Patel",
        gender: "male",
        dateOfBirth: "1978-03-10",
        address: "789 Green Park Colony",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        createdAt: "2024-01-20T09:15:00Z"
    },
    {
        uid: "BEN-2024-004",
        name: "Priya Singh",
        gender: "female",
        dateOfBirth: "1995-12-05",
        address: "234 Rajajinagar, 3rd Block",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560010",
        createdAt: "2024-01-22T14:20:00Z"
    },
    {
        uid: "BEN-2024-005",
        name: "Mohammed Khan",
        gender: "male",
        dateOfBirth: "1982-09-18",
        address: "567 Charminar Road",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500002",
        createdAt: "2024-01-25T16:00:00Z"
    },
    {
        uid: "BEN-2024-006",
        name: "Lakshmi Devi",
        gender: "female",
        dateOfBirth: "1988-07-30",
        address: "890 T Nagar, 10th Main",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600017",
        createdAt: "2024-01-28T12:10:00Z"
    },
    {
        uid: "BEN-2024-007",
        name: "Suresh Reddy",
        gender: "male",
        dateOfBirth: "1975-11-12",
        address: "123 Banjara Hills, Road No 3",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500034",
        createdAt: "2024-02-01T13:30:00Z"
    }
];

const BeneficiaryList = () => {
    const navigate = useNavigate();
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statesLoading, setStatesLoading] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const searchTimeoutRef = useRef(null);

    const [showFilters, setShowFilters] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        gender: "",
        state: "",
        fromDate: "",
        toDate: ""
    });
    const [filters, setFilters] = useState({
        gender: "",
        state: "",
        fromDate: "",
        toDate: ""
    });
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});
    
    // Dropdown states for filters
    const [stateFilterDropdownOpen, setStateFilterDropdownOpen] = useState(false);
    const [stateFilterSearch, setStateFilterSearch] = useState('');
    
    // Refs for dropdown click outside handling
    const stateFilterRef = useRef(null);
    
    // States data from API
    const [states, setStates] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10
    });

    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState(new Set());

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [sortCycle, setSortCycle] = useState({
        key: "createdAt",
        step: 2,
    });

    // API base URL from the provided endpoints
    const API_BASE = 'https://hapilocations.web.app';

    // Fetch all states on component mount
    useEffect(() => {
        fetchStates();
    }, []);

    // Filter states based on search
    useEffect(() => {
        if (states.length > 0) {
            const filtered = states.filter(state =>
                state.name.toLowerCase().includes(stateFilterSearch.toLowerCase())
            );
            setFilteredStates(filtered);
        }
    }, [stateFilterSearch, states]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (stateFilterRef.current && !stateFilterRef.current.contains(event.target)) {
                setStateFilterDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setTempFilters(filters);

        const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
        setIsFilterApplied(hasAppliedFilters);
        setAppliedFilters(filters);
    }, [filters]);

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

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    };

    const getCurrentDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    // Fetch all states from the provided API
    const fetchStates = async () => {
        setStatesLoading(true);
        try {
            // Using the provided API for Indian states
            const response = await fetch(`${API_BASE}/states/101.min.json`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch states');
            }

            const data = await response.json();
            // Transform the data to match your format
            const transformedStates = data.map(state => ({
                id: state.id,
                name: state.name
            }));
            setStates(transformedStates);
            setFilteredStates(transformedStates);
        } catch (error) {
            console.error("Error fetching states:", error);
            toast.error("Failed to load states. Please refresh the page.");
            setStates([]);
            setFilteredStates([]);
        } finally {
            setStatesLoading(false);
        }
    };

    // Load beneficiaries from sample data
    const loadBeneficiaries = useCallback(() => {
        setLoading(true);
        try {
            // Simulate API delay
            setTimeout(() => {
                const beneficiariesData = sampleBeneficiaryData.map(beneficiary => ({
                    ...beneficiary,
                    uid: getValue(beneficiary.uid),
                    name: getValue(beneficiary.name),
                    gender: getValue(beneficiary.gender),
                    dateOfBirth: getValue(beneficiary.dateOfBirth),
                    address: getValue(beneficiary.address),
                    city: getValue(beneficiary.city),
                    state: getValue(beneficiary.state),
                    pincode: getValue(beneficiary.pincode),
                    age: calculateAge(beneficiary.dateOfBirth),
                    fullAddress: `${beneficiary.address}, ${beneficiary.city}, ${beneficiary.state} - ${beneficiary.pincode}`,
                    createdAt: beneficiary.createdAt
                }));

                setBeneficiaries(beneficiariesData);
                setFilteredBeneficiaries(beneficiariesData);

                setPagination({
                    currentPage: 1,
                    totalPages: Math.ceil(beneficiariesData.length / 10),
                    totalRecords: beneficiariesData.length,
                    limit: 10
                });

                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error loading beneficiaries:', error);
            toast.error("Failed to load beneficiary records");
            setBeneficiaries([]);
            setFilteredBeneficiaries([]);
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadBeneficiaries();
    }, [loadBeneficiaries]);

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
    const applyFilters = useCallback((filterValues, beneficiariesData = beneficiaries) => {
        let filtered = [...beneficiariesData];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(beneficiary =>
                beneficiary.uid.toLowerCase().includes(searchLower) ||
                beneficiary.name.toLowerCase().includes(searchLower) ||
                beneficiary.city?.toLowerCase().includes(searchLower) ||
                beneficiary.state?.toLowerCase().includes(searchLower) ||
                beneficiary.pincode?.includes(searchLower) ||
                beneficiary.fullAddress?.toLowerCase().includes(searchLower)
            );
        }

        // Apply gender filter
        if (filterValues.gender) {
            filtered = filtered.filter(beneficiary => beneficiary.gender === filterValues.gender);
        }

        // Apply state filter
        if (filterValues.state) {
            filtered = filtered.filter(beneficiary => beneficiary.state === filterValues.state);
        }

        // Apply date range filter
        if (filterValues.fromDate || filterValues.toDate) {
            filtered = filtered.filter(beneficiary => {
                const beneficiaryDate = new Date(beneficiary.createdAt);

                if (filterValues.fromDate) {
                    const fromDate = new Date(filterValues.fromDate);
                    fromDate.setHours(0, 0, 0, 0);
                    if (beneficiaryDate < fromDate) return false;
                }

                if (filterValues.toDate) {
                    const toDate = new Date(filterValues.toDate);
                    toDate.setHours(23, 59, 59, 999);
                    if (beneficiaryDate > toDate) return false;
                }

                return true;
            });
        }

        setFilteredBeneficiaries(filtered);

        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            totalRecords: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.limit)
        }));

    }, [searchTerm, beneficiaries]);

    // Fetch when search term changes
    useEffect(() => {
        if (beneficiaries.length > 0) {
            applyFilters(filters);
        }
    }, [searchTerm, filters, applyFilters, beneficiaries]);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setTempFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleStateFilterSelect = (state) => {
        setTempFilters(prev => ({ 
            ...prev, 
            state: state.name
        }));
        setStateFilterDropdownOpen(false);
        setStateFilterSearch('');
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
        applyFilters(tempFilters, beneficiaries);
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
        applyFilters(emptyFilters, beneficiaries);
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
    const sortedBeneficiaries = useMemo(() => {
        if (sortCycle.step === 0) {
            return filteredBeneficiaries;
        }

        return [...filteredBeneficiaries].sort((a, b) => {
            const key = sortCycle.key;
            let aValue = a[key] ?? "";
            let bValue = b[key] ?? "";

            if (sortCycle.step === 1) {
                if (key === 'dateOfBirth' || key === 'createdAt') {
                    return new Date(aValue) - new Date(bValue);
                }
                if (key === 'age') {
                    return aValue - bValue;
                }
                return String(aValue).localeCompare(String(bValue));
            } else {
                if (key === 'dateOfBirth' || key === 'createdAt') {
                    return new Date(bValue) - new Date(aValue);
                }
                if (key === 'age') {
                    return bValue - aValue;
                }
                return String(bValue).localeCompare(String(aValue));
            }
        });
    }, [filteredBeneficiaries, sortCycle]);

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

    // Get gender badge
    const getGenderBadge = (gender) => {
        switch (gender?.toLowerCase()) {
            case 'male':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'female':
                return 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Table columns
    const columns = useMemo(() => [
        {
            key: "uid",
            label: "Beneficiary ID",
            sortable: true,
            onSort: () => requestSort('uid'),
            sortIcon: getSortIcon('uid'),
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{item.uid}</div>
                    </div>
                </div>
            )
        },
        {
            key: "name",
            label: "Name",
            sortable: true,
            onSort: () => requestSort('name'),
            sortIcon: getSortIcon('name'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                </div>
            )
        },
        {
            key: "gender",
            label: "Gender",
            sortable: true,
            onSort: () => requestSort('gender'),
            sortIcon: getSortIcon('gender'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getGenderBadge(item.gender)}`}>
                        {item.gender?.charAt(0).toUpperCase() + item.gender?.slice(1) || 'Unknown'}
                    </span>
                </div>
            )
        },
        {
            key: "dateOfBirth",
            label: "DOB & Age",
            sortable: true,
            onSort: () => requestSort('dateOfBirth'),
            sortIcon: getSortIcon('dateOfBirth'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{formatDate(item.dateOfBirth)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Age: {item.age} years</div>
                    </div>
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
                <div className="flex items-center gap-2">
                    <span className="dark:text-gray-300">{item.city}</span>
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
                <span className="text-gray-700 dark:text-gray-300">{item.state}</span>
            )
        },
        {
            key: "createdAt",
            label: "Created At",
            sortable: true,
            onSort: () => requestSort('createdAt'),
            sortIcon: getSortIcon('createdAt'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300">{formatDate(item.createdAt)}</span>
                </div>
            )
        },
    ], [getSortIcon, requestSort]);

    // Selection handlers
    const toggleSelectBeneficiary = (uid) => {
        if (!uid) return;
        setSelectedBeneficiaries((prev) => {
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
        if (selectedBeneficiaries.size === filteredBeneficiaries.length && filteredBeneficiaries.length > 0) {
            setSelectedBeneficiaries(new Set());
        } else {
            setSelectedBeneficiaries(new Set(filteredBeneficiaries.map(beneficiary => beneficiary.uid).filter(Boolean)));
        }
    };

    // Event handlers
    const handleAddBeneficiary = () => {
        navigate(PATHROUTES.addBeneficiary);
    };

    const handleEdit = (beneficiary) => {
        navigate(`${PATHROUTES.editBeneficiary}/${beneficiary.uid}`, {
            state: beneficiary
        });
    };

    const handleView = (beneficiary) => {
        navigate(`${PATHROUTES.beneficiaryDetails}/${beneficiary.uid}`, {
            state: beneficiary
        });
    };

    const handleDelete = (uid) => {
        if (!uid) {
            toast.error("Cannot delete beneficiary record: Invalid ID");
            return;
        }
        setDeleteTarget("single");
        setDeleteId(uid);
        setShowDeleteModal(true);
    };

    const handleBulkDelete = () => {
        if (selectedBeneficiaries.size === 0) {
            toast.error("Please select beneficiary records to delete");
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
                // Remove selected beneficiaries from state
                setBeneficiaries(prev => prev.filter(b => !selectedBeneficiaries.has(b.uid)));
                setFilteredBeneficiaries(prev => prev.filter(b => !selectedBeneficiaries.has(b.uid)));

                toast.success(`${selectedBeneficiaries.size} beneficiary record(s) deleted successfully!`);
                setSelectedBeneficiaries(new Set());

            } else if (deleteTarget === "single" && deleteId) {
                // Remove single beneficiary from state
                setBeneficiaries(prev => prev.filter(b => b.uid !== deleteId));
                setFilteredBeneficiaries(prev => prev.filter(b => b.uid !== deleteId));

                toast.success("Beneficiary deleted successfully!");
                setSelectedBeneficiaries(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(deleteId);
                    return newSet;
                });
            }

            // Update pagination
            setPagination(prev => ({
                ...prev,
                totalRecords: beneficiaries.length - (deleteTarget === "selected" ? selectedBeneficiaries.size : 1),
                totalPages: Math.ceil((beneficiaries.length - (deleteTarget === "selected" ? selectedBeneficiaries.size : 1)) / prev.limit)
            }));

        } catch (error) {
            console.error("Error in delete operation:", error);
            toast.error("Failed to delete beneficiary record");
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
        loadBeneficiaries();
    };

    const totalDisplayedRecords = filteredBeneficiaries.length;

    // Get filter display text
    const getFilterDisplayText = () => {
        const parts = [];
        if (appliedFilters.gender) parts.push(`Gender: ${appliedFilters.gender}`);
        if (appliedFilters.state) parts.push(`State: ${appliedFilters.state}`);
        if (appliedFilters.fromDate) parts.push(`From: ${appliedFilters.fromDate}`);
        if (appliedFilters.toDate) parts.push(`To: ${appliedFilters.toDate}`);
        return parts.join(', ');
    };

    return (
        <>
            <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Beneficiaries</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage beneficiary records and their information</p>
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
                            onClick={handleAddBeneficiary}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
                        >
                            <FaUserPlus className="w-4 h-4" />
                            <span>Add Beneficiary</span>
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
                                    placeholder="Search by ID, Name, City, State, Pincode..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                            {filteredBeneficiaries.length} found
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
                            {selectedBeneficiaries.size > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdDelete className="w-4 h-4" />
                                    Delete ({selectedBeneficiaries.size})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-5 bg-primary-50/50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800 transition-colors duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Gender Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors duration-300"
                                        value={tempFilters.gender || ""}
                                        onChange={(e) => handleFilterChange("gender", e.target.value)}
                                    >
                                        <option value="">All Genders</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>

                                {/* State Filter - Custom Dropdown */}
                                <div className="relative" ref={stateFilterRef}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        State
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={tempFilters.state}
                                            readOnly
                                            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                                                !tempFilters.state ? 'text-gray-500 dark:text-gray-400' : ''
                                            } ${statesLoading ? 'bg-gray-100 dark:bg-gray-600 cursor-wait' : 'cursor-pointer'}`}
                                            placeholder={statesLoading ? "Loading states..." : "Select State"}
                                            onClick={() => !statesLoading && setStateFilterDropdownOpen(!stateFilterDropdownOpen)}
                                            disabled={statesLoading}
                                        />
                                        <ChevronDown
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 ${!statesLoading ? 'cursor-pointer' : 'opacity-50'}`}
                                            size={20}
                                            onClick={() => !statesLoading && setStateFilterDropdownOpen(!stateFilterDropdownOpen)}
                                        />

                                        {stateFilterDropdownOpen && !statesLoading && (
                                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/30 max-h-60 overflow-hidden">
                                                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                                    <input
                                                        type="text"
                                                        value={stateFilterSearch}
                                                        onChange={(e) => setStateFilterSearch(e.target.value)}
                                                        placeholder="Search state..."
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="max-h-48 overflow-y-auto">
                                                    {statesLoading ? (
                                                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                                                            Loading states...
                                                        </div>
                                                    ) : filteredStates.length > 0 ? (
                                                        <>
                                                            <div
                                                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-gray-900 dark:text-white"
                                                                onClick={() => {
                                                                    handleFilterChange("state", "");
                                                                    setStateFilterDropdownOpen(false);
                                                                    setStateFilterSearch('');
                                                                }}
                                                            >
                                                                All States
                                                            </div>
                                                            {filteredStates.map(state => (
                                                                <div
                                                                    key={state.id}
                                                                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-gray-900 dark:text-white"
                                                                    onClick={() => handleStateFilterSelect(state)}
                                                                >
                                                                    {state.name}
                                                                </div>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                                                            No states found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {statesLoading && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading states...</p>
                                    )}
                                </div>

                                {/* From Date Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        From Date
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

                                {/* To Date Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        To Date
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
                                                {getFilterDisplayText()}
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
                    data={sortedBeneficiaries.slice(
                        (pagination.currentPage - 1) * pagination.limit,
                        pagination.currentPage * pagination.limit
                    )}
                    loading={loading}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                    addButtonLabel="Add New Beneficiary"
                    emptyStateMessage="No beneficiary records found. Try adjusting your search or filters."
                    loadingMessage="Loading beneficiary records..."
                    enableSelection={true}
                    enablePagination={true}
                    selectedRows={selectedBeneficiaries}
                    onSelectRow={toggleSelectBeneficiary}
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
                                    ? `You're about to delete ${selectedBeneficiaries.size} selected beneficiary record(s). This action cannot be undone.`
                                    : "You're about to delete this beneficiary record. This action cannot be undone."}
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

export default BeneficiaryList;