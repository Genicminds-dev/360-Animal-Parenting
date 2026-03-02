import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserPlus,
    FaUserCheck,
    FaUser,
    FaUserTimes,
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
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Minus
} from "lucide-react";

import DataTable from '../../components/common/Table/DataTable';
import { Endpoints } from '../../services/api/EndPoint';
import api from '../../services/api/api';
import { PATHROUTES } from '../../routes/pathRoutes';

const ManageUsersTable = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    
    // Search state - separate input and debounced term
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const searchTimeoutRef = useRef(null);

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
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        adminUsers: 0,
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10
    });

    const navigate = useNavigate();

    // Get unique roles for dropdown
    const getRoleOptions = useMemo(() => {
        const roles = new Set();
        users.forEach(user => {
            if (user.Role?.name) {
                roles.add(user.Role.name);
            }
        });
        return Array.from(roles).sort();
    }, [users]);

    // Get unique status for dropdown
    const getStatusOptions = useMemo(() => {
        const statuses = new Set();
        users.forEach(user => {
            if (user.status && user.status !== 'NA') {
                statuses.add(user.status);
            }
        });
        return Array.from(statuses).sort();
    }, [users]);

    // API functions directly in component
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get(Endpoints.GET_USERS);

            const apiUsers = Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data];

            const normalizedUsers = apiUsers.map(user => ({
                ...user,
                id: user.id || user.uid,
                status: user.status ?? "NA",
                createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A'
            }));

            setUsers(normalizedUsers);
            setFilteredUsers(normalizedUsers);
            calculateStats(normalizedUsers);
            
            setPagination(prev => ({
                ...prev,
                totalRecords: normalizedUsers.length,
                totalPages: Math.ceil(normalizedUsers.length / prev.limit)
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(error.response?.data?.message || "Failed to fetch users");
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await api.delete(Endpoints.DELETE_USER(userId));
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    };

    const deleteMultipleUsers = async (userIds) => {
        try {
            const deletePromises = userIds.map(id => deleteUser(id));
            const results = await Promise.allSettled(deletePromises);

            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;

            return { successful, failed };
        } catch (error) {
            console.error('Error in bulk delete:', error);
            throw error;
        }
    };

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Calculate statistics
    const calculateStats = (usersData) => {
        const totalUsers = usersData.length;
        const activeUsers = usersData.filter(user => user.status === 'active').length;
        const inactiveUsers = usersData.filter(user => user.status === 'inactive').length;
        const adminUsers = usersData.filter(user => user.Role?.name === 'Admin').length;

        setStats({
            totalUsers,
            activeUsers,
            inactiveUsers,
            adminUsers,
        });
    };

    // Initialize tempFilters when component mounts
    useEffect(() => {
        setTempFilters(filters);

        // Check if any filters are applied
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

    // Apply filters function
    const applyFilters = useCallback((filterValues) => {
        let filtered = [...users];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter((user) => {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
                const roleName = user.Role?.name?.toLowerCase() || "";
                return user.id?.toString().includes(searchTerm) ||
                    fullName.includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    roleName.includes(searchLower);
            });
        }

        // Apply role filter
        if (filterValues.role) {
            filtered = filtered.filter(user => user.Role?.name === filterValues.role);
        }

        // Apply status filter
        if (filterValues.status) {
            filtered = filtered.filter(user => user.status === filterValues.status);
        }

        // Apply date range filter
        if (filterValues.fromDate || filterValues.toDate) {
            filtered = filtered.filter(user => {
                if (!user.createdAt || user.createdAt === 'N/A') return false;
                
                const userDate = new Date(user.createdAt);

                if (filterValues.fromDate) {
                    const fromDate = new Date(filterValues.fromDate);
                    fromDate.setHours(0, 0, 0, 0);
                    if (userDate < fromDate) return false;
                }

                if (filterValues.toDate) {
                    const toDate = new Date(filterValues.toDate);
                    toDate.setHours(23, 59, 59, 999);
                    if (userDate > toDate) return false;
                }

                return true;
            });
        }

        setFilteredUsers(filtered);
        
        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            totalRecords: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.limit)
        }));
    }, [users, searchTerm]);

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
            role: "",
            status: "",
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
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = useMemo(() => {
        if (!sortConfig.key) return filteredUsers;

        return [...filteredUsers].sort((a, b) => {
            const getValue = (user, key) => {
                if (key === "name") return `${user.firstName || ''} ${user.lastName || ''}`;
                if (key === "role") return user.Role?.name || "";
                if (key === "createdAt") {
                    return user.createdAt && user.createdAt !== 'N/A' ? new Date(user.createdAt).getTime() : 0;
                }
                return user[key];
            };

            const aValue = getValue(a, sortConfig.key);
            const bValue = getValue(b, sortConfig.key);

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredUsers, sortConfig]);

    // Get sort icon
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
    const toggleSelectUser = (id) => {
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
        const allIds = filteredUsers.map(user => user.id).filter(Boolean);
        if (selectedIds.size === allIds.length && allIds.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(allIds));
        }
    };

    // Navigation handlers
    const handleEditUser = (user) => {
        navigate(`${PATHROUTES.editUsers}/${user.id}`, { state: { user } });
    };

    const handleViewUser = (user) => {
        navigate(`${PATHROUTES.viewUsers}/${user.id}`);
    };

    const handleAddUser = () => {
        navigate(PATHROUTES.addUsers);
    };

    // Delete handlers
    const handleDeleteClick = (id) => {
        const user = users.find(u => u.id === id);
        if (!user) {
            toast.error("Cannot delete user: Invalid user ID");
            return;
        }
        setDeleteTarget("single");
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleBulkDelete = (ids) => {
        if (!ids || ids.size === 0) {
            toast.error("Please select users to delete");
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
                const result = await deleteMultipleUsers(deleteId);
                if (result.successful > 0) {
                    const updatedUsers = users.filter(user => !deleteId.includes(user.id));
                    setUsers(updatedUsers);
                    setFilteredUsers(updatedUsers.filter(user => {
                        // Re-apply current filters to filtered list
                        let include = true;
                        
                        if (filters.role && user.Role?.name !== filters.role) include = false;
                        if (filters.status && user.status !== filters.status) include = false;
                        
                        // Date range check would go here if needed
                        
                        return include;
                    }));
                    
                    calculateStats(updatedUsers);
                    
                    setPagination(prev => ({
                        ...prev,
                        totalRecords: updatedUsers.length,
                        totalPages: Math.ceil(updatedUsers.length / prev.limit)
                    }));
                    
                    toast.success(`${result.successful} user(s) deleted successfully`);
                    if (result.failed > 0) {
                        toast.error(`${result.failed} user(s) failed to delete`);
                    }
                }
                setSelectedIds(new Set());
            } else {
                await deleteUser(deleteId);
                const updatedUsers = users.filter(user => user.id !== deleteId);
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers.filter(user => {
                    // Re-apply current filters
                    let include = true;
                    
                    if (filters.role && user.Role?.name !== filters.role) include = false;
                    if (filters.status && user.status !== filters.status) include = false;
                    
                    return include;
                }));
                
                calculateStats(updatedUsers);
                
                setPagination(prev => ({
                    ...prev,
                    totalRecords: updatedUsers.length,
                    totalPages: Math.ceil(updatedUsers.length / prev.limit)
                }));
                
                // Remove from selection if present
                setSelectedIds((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(deleteId);
                    return newSet;
                });
                
                toast.success('User deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || "Failed to delete user");
        } finally {
            setLoading(false);
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleteId(null);
        }
    };

    // Export functions
    const exportToCSV = () => {
        const headers = ["User ID", "Name", "Email", "Role", "Status", "Created Date"];
        const csvContent = [
            headers.join(","),
            ...sortedUsers.map((user) =>
                [
                    user.id,
                    `${user.firstName || ''} ${user.lastName || ''}`,
                    user.email || '',
                    user.Role?.name || "N/A",
                    user.status || "N/A",
                    user.createdAt
                ].map(field => `"${field}"`).join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Data exported to CSV!");
    };

    const printTable = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Users Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
                        th { background-color: #f3f4f6; font-weight: bold; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .stats { display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; }
                        .stat-box { background: #f8fafc; padding: 10px 15px; border-radius: 8px; margin: 5px; min-width: 150px; }
                        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                        .status-active { background-color: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 11px; }
                        .status-inactive { background-color: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size: 11px; }
                        .filter-info { background-color: #f0f9ff; padding: 10px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid #0ea5e9; }
                        ${searchTerm ? '.search-info { color: #666; font-style: italic; margin-top: 10px; }' : ''}
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 style="color: #111827;">Users Report</h1>
                        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                        ${searchTerm ? `<p class="search-info">Search: "${searchTerm}" - ${sortedUsers.length} results found</p>` : ''}
                    </div>
                    
                    ${(filters.fromDate || filters.toDate) ? `
                    <div class="filter-info">
                        <strong>Date Range:</strong> 
                        ${filters.fromDate ? `From: ${filters.fromDate}` : ''}
                        ${filters.fromDate && filters.toDate ? ' to ' : ''}
                        ${filters.toDate ? `To: ${filters.toDate}` : ''}
                    </div>
                    ` : ''}
                    
                    ${filters.role ? `<div class="filter-info"><strong>Role:</strong> ${filters.role}</div>` : ''}
                    ${filters.status ? `<div class="filter-info"><strong>Status:</strong> ${filters.status}</div>` : ''}
                    
                    <div class="stats">
                        <div class="stat-box"><strong>Total Users:</strong> ${stats.totalUsers}</div>
                        <div class="stat-box"><strong>Active Users:</strong> ${stats.activeUsers}</div>
                        <div class="stat-box"><strong>Inactive Users:</strong> ${stats.inactiveUsers}</div>
                        <div class="stat-box"><strong>Admin Users:</strong> ${stats.adminUsers}</div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedUsers
                                .map(
                                    (user) => `
                                <tr>
                                    <td>${user.id || ''}</td>
                                    <td>${user.firstName || ''} ${user.lastName || ''}</td>
                                    <td>${user.email || ''}</td>
                                    <td>${user.Role?.name || "N/A"}</td>
                                    <td>
                                        <span class="status-${user.status || "na"}">
                                            ${user.status || "NA"}
                                        </span>
                                    </td>
                                    <td>${user.createdAt}</td>
                                </tr>
                            `
                                )
                                .join("")}
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <p>Report generated by User Management System | ${sortedUsers.length} users displayed</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleRefresh = () => {
        toast.success("Refreshing data...");
        fetchUsers();
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

    const getCurrentDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    // Table columns
    const columns = useMemo(() => [
        {
            key: "id",
            label: "User ID",
            sortable: true,
            onSort: () => requestSort('id'),
            sortIcon: getSortIcon('id'),
            render: (item) => (
                <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-800">{item.id}</span>
                </div>
            )
        },
        {
            key: "name",
            label: "Full Name",
            sortable: true,
            onSort: () => requestSort('name'),
            sortIcon: getSortIcon('name'),
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                        {item.firstName || ''} {item.lastName || ''}
                    </span>
                </div>
            )
        },
        {
            key: "email",
            label: "Email",
            sortable: true,
            onSort: () => requestSort('email'),
            sortIcon: getSortIcon('email'),
            render: (item) => (
                <div className="flex items-center gap-1">
                    <span className="font-medium">{item.email || ''}</span>
                </div>
            )
        },
        {
            key: "role",
            label: "Role",
            sortable: true,
            onSort: () => requestSort('role'),
            sortIcon: getSortIcon('role'),
            render: (item) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {item.Role?.name || "N/A"}
                </span>
            )
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            onSort: () => requestSort('status'),
            sortIcon: getSortIcon('status'),
            render: (item) => {
                const getStatusStyle = (status) => {
                    switch (status?.toLowerCase()) {
                        case 'active': return { bg: 'bg-green-100', text: 'text-green-800' };
                        case 'inactive': return { bg: 'bg-pink-100', text: 'text-pink-800' };
                        default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
                    }
                };

                const style = getStatusStyle(item.status);

                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                        {item.status === "active" ? "Active" : item.status === "inactive" ? "Inactive" : "NA"}
                    </span>
                );
            }
        },
        {
            key: "createdAt",
            label: "Created Date",
            sortable: true,
            onSort: () => requestSort('createdAt'),
            sortIcon: getSortIcon('createdAt'),
            render: (item) => {
                const date = item.createdAt && item.createdAt !== 'N/A' ? new Date(item.createdAt) : null;
                const formattedDate = date ? date.toLocaleDateString('en-GB') : 'N/A';

                return (
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{formattedDate}</span>
                    </div>
                );
            }
        }
    ], [getSortIcon, requestSort]);

    const totalDisplayedRecords = filteredUsers.length;

    return (
        <>
            <div className="space-y-6 bg-gray-50 dark:bg-gray-900">
                {/* Header Section - SellersList style */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600">Manage all users and their access permissions</p>
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
                            onClick={handleAddUser}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
                        >
                            <FaUserPlus className="w-4 h-4" />
                            <span>Add User</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards - SellersList style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start justify-between">
                            <FaUser className="text-primary-500 opacity-60" size={40} />
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                                <p className="text-gray-600">Total Users</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start justify-between">
                            <FaUserCheck className="text-green-500 opacity-60" size={40} />
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
                                <p className="text-gray-600">Active Users</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start justify-between">
                            <FaUserTimes className="text-pink-500 opacity-60" size={40} />
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.inactiveUsers}</h3>
                                <p className="text-gray-600">Inactive Users</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start justify-between">
                            <Shield className="text-purple-500 opacity-60" size={40} />
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.adminUsers}</h3>
                                <p className="text-gray-600">Admin Users</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Action Menu - SellersList style */}
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
                                    placeholder="Search by User ID, Name, Email or Role..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {sortedUsers.length} found
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
                            {selectedIds.size > 0 && (
                                <button
                                    onClick={() => handleBulkDelete(selectedIds)}
                                    className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdDelete className="w-4 h-4" />
                                    Delete ({selectedIds.size})
                                </button>
                            )}

                            {/* Export Button */}
                            <button
                                onClick={exportToCSV}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
                            >
                                <FaDownload className="w-4 h-4" />
                                Export
                            </button>

                            {/* Print Button */}
                            <button
                                onClick={printTable}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
                            >
                                <FaPrint className="w-4 h-4" />
                                Print
                            </button>
                        </div>
                    </div>

                    {/* Filters Panel - SellersList style */}
                    {showFilters && (
                        <div className="mt-4 p-5 bg-primary-50/50 rounded-xl border border-primary-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Role Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Role
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                                        value={tempFilters.role || ""}
                                        onChange={(e) => handleFilterChange("role", e.target.value)}
                                    >
                                        <option value="">All Roles</option>
                                        {getRoleOptions.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
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

                {/* Data Table - Using DataTable component */}
                <DataTable
                    columns={columns}
                    data={sortedUsers}
                    loading={loading}
                    onEdit={handleEditUser}
                    onView={handleViewUser}
                    onDelete={handleDeleteClick}
                    onBulkDelete={handleBulkDelete}
                    addButtonLabel="Add New User"
                    emptyStateMessage="No users found. Try adjusting your search or filters."
                    loadingMessage="Loading users data..."
                    enableSelection={true}
                    enablePagination={true}
                    selectedRows={selectedIds}
                    onSelectRow={toggleSelectUser}
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

            {/* Delete Confirmation Modal - SellersList style */}
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
                                    ? `You're about to delete ${deleteId?.length || 0} selected user(s). This action cannot be undone.`
                                    : "You're about to delete this user. This action cannot be undone."}
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

export default ManageUsersTable;