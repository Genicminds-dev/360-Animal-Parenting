import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaEdit,
    FaSortUp,
    FaSortDown,
    FaSort,
    FaUserPlus,
    FaUserCheck,
    FaUser,
    FaUserTimes,
    FaEye
} from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { HiOutlineTrash } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

// Icons from SellersList
import {
    Shield
} from "lucide-react";

import { Endpoints } from '../../services/api/EndPoint';
import api from '../../services/api/api';
import { PATHROUTES } from '../../routes/pathRoutes';
import FilterSection from '../../components/common/Filter/FilterSection';

const ManageUsersTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        adminUsers: 0,
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
        return Array.from(roles).map(role => ({
            value: role,
            label: role
        }));
    }, [users]);

    // Get unique status for dropdown
    const getStatusOptions = useMemo(() => {
        const statuses = new Set();
        users.forEach(user => {
            if (user.status && user.status !== 'NA') {
                statuses.add(user.status);
            }
        });
        return Array.from(statuses).map(status => ({
            value: status,
            label: status.charAt(0).toUpperCase() + status.slice(1)
        }));
    }, [users]);

    // Filter configuration
    const filterConfig = {
        fields: [
            {
                key: "role",
                label: "Select Role",
                type: "select",
                placeholder: "Select a role",
                options: getRoleOptions
            },
            {
                key: "status",
                label: "Select Status",
                type: "select",
                placeholder: "Select a status",
                options: getStatusOptions
            }
        ],
        dateRange: true,
        dateRangeConfig: {
            fromLabel: "Start Date",
            toLabel: "End Date",
        }
    };

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
            calculateStats(normalizedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(error.response?.data?.message || "Failed to fetch users");
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

    // Apply filters function
    const applyFilters = useCallback((newFilters) => {
        setFilters(newFilters);
        setSearchTerm(newFilters.search || "");
        setCurrentPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
        setSearchTerm("");
        setCurrentPage(1);
    }, []);

    // Date filtering function
    const isDateInRange = (dateString, startDate, endDate) => {
        if (!dateString || dateString === 'N/A') return false;

        const date = new Date(dateString);

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return date >= start && date <= end;
        } else if (startDate && !endDate) {
            const start = new Date(startDate);
            return date >= start;
        } else if (!startDate && endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return date <= end;
        }
        return true;
    };

    const filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const roleName = user.Role?.name?.toLowerCase() || "";

        // Search filter
        const matchesSearch = !searchTerm ? true :
            user.id?.toString().includes(searchTerm) ||
            fullName.includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            roleName.includes(searchTerm.toLowerCase());

        // Role filter
        const matchesRole = !filters.role ? true :
            user.Role?.name === filters.role;

        // Status filter
        const matchesStatus = !filters.status ? true :
            user.status === filters.status;

        // Date range filter
        const matchesDate = isDateInRange(
            user.createdAt,
            filters.fromDate,
            filters.toDate
        );

        return matchesSearch && matchesRole && matchesStatus && matchesDate;
    });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = sortConfig.key
        ? [...filteredUsers].sort((a, b) => {
            const getValue = (user, key) => {
                if (key === "name") return `${user.firstName || ''} ${user.lastName || ''}`;
                if (key === "role") return user.Role?.name || "";
                if (key === "createdAt") {
                    return user.createdAt ? new Date(user.createdAt).getTime() : 0;
                }
                return user[key];
            };

            const aValue = getValue(a, sortConfig.key);
            const bValue = getValue(b, sortConfig.key);

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        })
        : [...filteredUsers].sort((a, b) => (a.id || 0) - (b.id || 0));

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedUsers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedUsers.map(user => user.id));
        }
    };

    const handleDeleteClick = (target) => {
        setDeleteTarget(target);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            if (deleteTarget === 'selected') {
                const result = await deleteMultipleUsers(selectedIds);
                if (result.successful > 0) {
                    const updatedUsers = users.filter(user => !selectedIds.includes(user.id));
                    setUsers(updatedUsers);
                    calculateStats(updatedUsers);
                    toast.success(`${result.successful} user(s) deleted successfully`);
                    if (result.failed > 0) {
                        toast.error(`${result.failed} user(s) failed to delete`);
                    }
                }
                setSelectedIds([]);
            } else {
                await deleteUser(deleteTarget);
                const updatedUsers = users.filter(user => user.id !== deleteTarget);
                setUsers(updatedUsers);
                calculateStats(updatedUsers);
                toast.success('User deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || "Failed to delete user");
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setDeleteTarget(null);
        }
    };

    // NAVIGATION HANDLERS
    const handleEditUser = (user) => {
        navigate(`${PATHROUTES.editUsers}/${user.id}`, { state: { user } });
    };

    const handleViewUser = (user) => {
        navigate(`${PATHROUTES.viewUsers}/${user.id}`);
    };

    const handleAddUser = () => {
        navigate(PATHROUTES.addUsers);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
        return sortConfig.direction === 'asc'
            ? <FaSortUp className="ml-1 text-gray-600" />
            : <FaSortDown className="ml-1 text-gray-600" />;
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
        setShowItemsPerPageDropdown(false);
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
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #111827;">Users Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
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
          ${searchTerm ? `<div class="filter-info"><strong>Search:</strong> ${searchTerm}</div>` : ''}
          
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

    return (
        <>
            <div className="space-y-6 bg-gray-50">
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: "#363636",
                            color: "#fff",
                        },
                        success: {
                            style: {
                                background: "#10b981",
                            },
                        },
                        error: {
                            style: {
                                background: "#ef4444",
                            },
                        },
                    }}
                />

                {/* Header Section - SellersList style */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600">Manage all users and their access permissions</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                        >
                            <span>Refresh</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <button
                            onClick={handleAddUser}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
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
                            <FaUser className="text-blue-500 opacity-60" size={40} />
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

                {/* Filter Section - Using FilterSection component from HealthCheckupList */}
                <FilterSection
                    filterConfig={filterConfig}
                    onApplyFilters={applyFilters}
                    onClearFilters={clearFilters}
                    onExport={exportToCSV}
                    onPrint={printTable}
                    initialFilters={filters}
                    searchPlaceholder="Search by User ID, Name, Email or Role..."
                    enableSearch={true}
                    enableExport={true}
                    enablePrint={true}
                    enableBulkDelete={selectedIds.length > 0}
                    bulkDeleteLabel={`Delete (${selectedIds.length})`}
                    onBulkDelete={() => handleDeleteClick('selected')}
                />

                {/* Data Table - SellersList style */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-10 px-4 py-3 border-r border-gray-100">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedIds.length === paginatedUsers.length &&
                                                paginatedUsers.length > 0
                                            }
                                            onChange={toggleSelectAll}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/50"
                                            ref={(el) => {
                                                if (el) {
                                                    el.indeterminate =
                                                        selectedIds.length > 0 &&
                                                        selectedIds.length < paginatedUsers.length;
                                                }
                                            }}
                                        />
                                    </th>
                                    {[
                                        { key: 'id', label: 'User ID' },
                                        { key: 'name', label: 'Full Name' },
                                        { key: 'email', label: 'Email' },
                                        { key: 'role', label: 'Role' },
                                        { key: 'status', label: 'Status' },
                                        { key: 'createdAt', label: 'Created Date' }
                                    ].map((column) => (
                                        <th
                                            key={column.key}
                                            className={`px-4 py-3 border-r border-gray-100 text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors text-left`}
                                            onClick={() => requestSort(column.key)}
                                        >
                                            <div className={`flex items-center justify-start`}>
                                                {column.label}
                                                {getSortIcon(column.key)}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="10" className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                                                <div className="text-lg font-medium text-gray-500 mb-2">
                                                    Loading users...
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                                } hover:bg-blue-50/30 transition-colors ${selectedIds.includes(user.id) ? "!bg-blue-50" : ""
                                                }`}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(user.id)}
                                                    onChange={() => toggleSelect(user.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/50"
                                                />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium text-gray-800">
                                                        {user.id}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-800">
                                                        {user.firstName || ''} {user.lastName || ''}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium">{user.email || ''}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {user.Role?.name || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : user.status === "inactive"
                                                            ? "bg-pink-100 text-pink-800"
                                                            : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {user.status === "active"
                                                        ? "Active"
                                                        : user.status === "inactive"
                                                            ? "Inactive"
                                                            : "NA"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
                                                <span className="font-medium">
                                                    {user.createdAt && user.createdAt !== 'N/A'
                                                        ? new Date(user.createdAt).toLocaleDateString('en-GB')
                                                        : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewUser(user)}
                                                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        title="View User Details"
                                                    >
                                                        <FaEye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                                        title="Edit User"
                                                    >
                                                        <FaEdit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(user.id)}
                                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                                        title="Delete User"
                                                    >
                                                        <MdDelete className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="text-lg font-medium text-gray-500 mb-2">
                                                    No users found
                                                </div>
                                                <p className="text-sm text-gray-400 mb-6">
                                                    Try adjusting your search or filters
                                                </p>
                                                <button
                                                    onClick={handleAddUser}
                                                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm"
                                                >
                                                    <FaUserPlus /> Add Your First User
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - SellersList style */}
                    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                            <div className="text-center sm:text-left">
                                Showing{" "}
                                <span className="font-medium text-blue-600">
                                    {sortedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium text-blue-600">
                                    {Math.min(currentPage * itemsPerPage, sortedUsers.length)}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-blue-600">
                                    {sortedUsers.length}
                                </span>{" "}
                                users
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setShowItemsPerPageDropdown(!showItemsPerPageDropdown)
                                        }
                                        className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[5rem] bg-white"
                                    >
                                        <span>{itemsPerPage}</span>
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {showItemsPerPageDropdown && (
                                        <div className="absolute bottom-full mb-1 left-0 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-200 border-b-0 max-h-48 overflow-y-auto">
                                            {[5, 10, 20, 30, 50, 100].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleItemsPerPageChange(option)}
                                                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors border-b border-gray-200 last:border-b-0 ${itemsPerPage === option
                                                        ? "bg-blue-50 text-blue-600 font-medium"
                                                        : "text-gray-700"
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white whitespace-nowrap"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                        const pageNumber =
                                            totalPages <= 5
                                                ? i + 1
                                                : currentPage <= 3
                                                    ? i + 1
                                                    : currentPage >= totalPages - 2
                                                        ? totalPages - 4 + i
                                                        : currentPage - 2 + i;

                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={`px-3 py-2 border rounded-lg min-w-[2.5rem] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${currentPage === pageNumber
                                                    ? "bg-blue-600 text-white border-transparent"
                                                    : "border-gray-200 hover:bg-gray-50 bg-white"
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <span className="px-2 flex items-center text-gray-400">
                                            ...
                                        </span>
                                    )}

                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white"
                                        >
                                            {totalPages}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white whitespace-nowrap"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl mx-2">
                        <div className="flex justify-center mb-4 mt-6">
                            <div className="p-3 bg-red-50 rounded-full">
                                <HiOutlineTrash className="w-10 h-10 text-red-500" />
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Confirm Deletion
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed px-6">
                                {deleteTarget === 'selected'
                                    ? `You're about to delete ${selectedIds.length} selected user(s). This action is permanent and cannot be undone.`
                                    : "You're about to delete this user. This action is permanent and cannot be undone."}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-3 px-6 pb-6">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteTarget(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
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