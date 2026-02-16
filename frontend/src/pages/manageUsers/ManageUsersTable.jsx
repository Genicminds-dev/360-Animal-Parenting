// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     FaEdit,
//     FaSortUp,
//     FaSortDown,
//     FaSort,
//     FaUserPlus,
//     FaUserCheck,
//     FaUser,
//     FaUserTimes,
//     FaEye
// } from 'react-icons/fa';
// import { MdDelete } from 'react-icons/md';
// import { HiOutlineTrash } from 'react-icons/hi';
// import { toast, Toaster } from 'react-hot-toast';

// // Icons from SellersList
// import {
//     Shield
// } from "lucide-react";

// import { Endpoints } from '../../services/api/EndPoint';
// import api from '../../services/api/api';
// import { PATHROUTES } from '../../routes/pathRoutes';
// import FilterSection from '../../components/common/Filter/FilterSection';

// const ManageUsersTable = () => {
//     const [users, setUsers] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedIds, setSelectedIds] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteTarget, setDeleteTarget] = useState(null);
//     const [itemsPerPage, setItemsPerPage] = useState(10);
//     const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
//     const [filters, setFilters] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState({
//         totalUsers: 0,
//         activeUsers: 0,
//         inactiveUsers: 0,
//         adminUsers: 0,
//     });

//     const navigate = useNavigate();

//     // Get unique roles for dropdown
//     const getRoleOptions = useMemo(() => {
//         const roles = new Set();
//         users.forEach(user => {
//             if (user.Role?.name) {
//                 roles.add(user.Role.name);
//             }
//         });
//         return Array.from(roles).map(role => ({
//             value: role,
//             label: role
//         }));
//     }, [users]);

//     // Get unique status for dropdown
//     const getStatusOptions = useMemo(() => {
//         const statuses = new Set();
//         users.forEach(user => {
//             if (user.status && user.status !== 'NA') {
//                 statuses.add(user.status);
//             }
//         });
//         return Array.from(statuses).map(status => ({
//             value: status,
//             label: status.charAt(0).toUpperCase() + status.slice(1)
//         }));
//     }, [users]);

//     // Filter configuration
//     const filterConfig = {
//         fields: [
//             {
//                 key: "role",
//                 label: "Select Role",
//                 type: "select",
//                 placeholder: "Select a role",
//                 options: getRoleOptions
//             },
//             {
//                 key: "status",
//                 label: "Select Status",
//                 type: "select",
//                 placeholder: "Select a status",
//                 options: getStatusOptions
//             }
//         ],
//         dateRange: true,
//         dateRangeConfig: {
//             fromLabel: "Start Date",
//             toLabel: "End Date",
//         }
//     };

//     // API functions directly in component
//     const fetchUsers = async () => {
//         try {
//             setLoading(true);
//             const response = await api.get(Endpoints.GET_USERS);

//             const apiUsers = Array.isArray(response.data.data)
//                 ? response.data.data
//                 : [response.data.data];

//             const normalizedUsers = apiUsers.map(user => ({
//                 ...user,
//                 id: user.id || user.uid,
//                 status: user.status ?? "NA",
//                 createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A'
//             }));

//             setUsers(normalizedUsers);
//             calculateStats(normalizedUsers);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             toast.error(error.response?.data?.message || "Failed to fetch users");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteUser = async (userId) => {
//         try {
//             const response = await api.delete(Endpoints.DELETE_USER(userId));
//             return response.data;
//         } catch (error) {
//             console.error('Error deleting user:', error);
//             throw error;
//         }
//     };

//     const deleteMultipleUsers = async (userIds) => {
//         try {
//             const deletePromises = userIds.map(id => deleteUser(id));
//             const results = await Promise.allSettled(deletePromises);

//             const successful = results.filter(r => r.status === 'fulfilled').length;
//             const failed = results.filter(r => r.status === 'rejected').length;

//             return { successful, failed };
//         } catch (error) {
//             console.error('Error in bulk delete:', error);
//             throw error;
//         }
//     };

//     // Fetch users on component mount
//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     // Calculate statistics
//     const calculateStats = (usersData) => {
//         const totalUsers = usersData.length;
//         const activeUsers = usersData.filter(user => user.status === 'active').length;
//         const inactiveUsers = usersData.filter(user => user.status === 'inactive').length;
//         const adminUsers = usersData.filter(user => user.Role?.name === 'Admin').length;

//         setStats({
//             totalUsers,
//             activeUsers,
//             inactiveUsers,
//             adminUsers,
//         });
//     };

//     // Apply filters function
//     const applyFilters = useCallback((newFilters) => {
//         setFilters(newFilters);
//         setSearchTerm(newFilters.search || "");
//         setCurrentPage(1);
//     }, []);

//     const clearFilters = useCallback(() => {
//         setFilters({});
//         setSearchTerm("");
//         setCurrentPage(1);
//     }, []);

//     // Date filtering function
//     const isDateInRange = (dateString, startDate, endDate) => {
//         if (!dateString || dateString === 'N/A') return false;

//         const date = new Date(dateString);

//         if (startDate && endDate) {
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//             end.setHours(23, 59, 59, 999);
//             return date >= start && date <= end;
//         } else if (startDate && !endDate) {
//             const start = new Date(startDate);
//             return date >= start;
//         } else if (!startDate && endDate) {
//             const end = new Date(endDate);
//             end.setHours(23, 59, 59, 999);
//             return date <= end;
//         }
//         return true;
//     };

//     const filteredUsers = users.filter((user) => {
//         const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
//         const roleName = user.Role?.name?.toLowerCase() || "";

//         // Search filter
//         const matchesSearch = !searchTerm ? true :
//             user.id?.toString().includes(searchTerm) ||
//             fullName.includes(searchTerm.toLowerCase()) ||
//             user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             roleName.includes(searchTerm.toLowerCase());

//         // Role filter
//         const matchesRole = !filters.role ? true :
//             user.Role?.name === filters.role;

//         // Status filter
//         const matchesStatus = !filters.status ? true :
//             user.status === filters.status;

//         // Date range filter
//         const matchesDate = isDateInRange(
//             user.createdAt,
//             filters.fromDate,
//             filters.toDate
//         );

//         return matchesSearch && matchesRole && matchesStatus && matchesDate;
//     });

//     const requestSort = (key) => {
//         let direction = 'asc';
//         if (sortConfig.key === key && sortConfig.direction === 'asc') {
//             direction = 'desc';
//         }
//         setSortConfig({ key, direction });
//     };

//     const sortedUsers = sortConfig.key
//         ? [...filteredUsers].sort((a, b) => {
//             const getValue = (user, key) => {
//                 if (key === "name") return `${user.firstName || ''} ${user.lastName || ''}`;
//                 if (key === "role") return user.Role?.name || "";
//                 if (key === "createdAt") {
//                     return user.createdAt ? new Date(user.createdAt).getTime() : 0;
//                 }
//                 return user[key];
//             };

//             const aValue = getValue(a, sortConfig.key);
//             const bValue = getValue(b, sortConfig.key);

//             if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
//             if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
//             return 0;
//         })
//         : [...filteredUsers].sort((a, b) => (a.id || 0) - (b.id || 0));

//     const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
//     const paginatedUsers = sortedUsers.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     const toggleSelect = (id) => {
//         setSelectedIds((prev) =>
//             prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//         );
//     };

//     const toggleSelectAll = () => {
//         if (selectedIds.length === paginatedUsers.length) {
//             setSelectedIds([]);
//         } else {
//             setSelectedIds(paginatedUsers.map(user => user.id));
//         }
//     };

//     const handleDeleteClick = (target) => {
//         setDeleteTarget(target);
//         setShowDeleteModal(true);
//     };

//     const confirmDelete = async () => {
//         try {
//             setLoading(true);
//             if (deleteTarget === 'selected') {
//                 const result = await deleteMultipleUsers(selectedIds);
//                 if (result.successful > 0) {
//                     const updatedUsers = users.filter(user => !selectedIds.includes(user.id));
//                     setUsers(updatedUsers);
//                     calculateStats(updatedUsers);
//                     toast.success(`${result.successful} user(s) deleted successfully`);
//                     if (result.failed > 0) {
//                         toast.error(`${result.failed} user(s) failed to delete`);
//                     }
//                 }
//                 setSelectedIds([]);
//             } else {
//                 await deleteUser(deleteTarget);
//                 const updatedUsers = users.filter(user => user.id !== deleteTarget);
//                 setUsers(updatedUsers);
//                 calculateStats(updatedUsers);
//                 toast.success('User deleted successfully');
//             }
//         } catch (error) {
//             console.error('Error deleting user:', error);
//             toast.error(error.response?.data?.message || "Failed to delete user");
//         } finally {
//             setLoading(false);
//             setShowDeleteModal(false);
//             setDeleteTarget(null);
//         }
//     };

//     // NAVIGATION HANDLERS
//     const handleEditUser = (user) => {
//         navigate(`${PATHROUTES.editUsers}/${user.id}`, { state: { user } });
//     };

//     const handleViewUser = (user) => {
//         navigate(`${PATHROUTES.viewUsers}/${user.id}`);
//     };

//     const handleAddUser = () => {
//         navigate(PATHROUTES.addUsers);
//     };

//     const getSortIcon = (key) => {
//         if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
//         return sortConfig.direction === 'asc'
//             ? <FaSortUp className="ml-1 text-gray-600" />
//             : <FaSortDown className="ml-1 text-gray-600" />;
//     };

//     const handleItemsPerPageChange = (value) => {
//         setItemsPerPage(value);
//         setCurrentPage(1);
//         setShowItemsPerPageDropdown(false);
//     };

//     // Export functions
//     const exportToCSV = () => {
//         const headers = ["User ID", "Name", "Email", "Role", "Status", "Created Date"];
//         const csvContent = [
//             headers.join(","),
//             ...sortedUsers.map((user) =>
//                 [
//                     user.id,
//                     `${user.firstName || ''} ${user.lastName || ''}`,
//                     user.email || '',
//                     user.Role?.name || "N/A",
//                     user.status || "N/A",
//                     user.createdAt
//                 ].map(field => `"${field}"`).join(",")
//             ),
//         ].join("\n");

//         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
//         a.click();
//         window.URL.revokeObjectURL(url);
//         toast.success("Data exported to CSV!");
//     };

//     const printTable = () => {
//         const printWindow = window.open("", "_blank");
//         printWindow.document.write(`
//       <html>
//         <head>
//           <title>Users Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             table { border-collapse: collapse; width: 100%; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
//             th { background-color: #f3f4f6; font-weight: bold; }
//             .header { text-align: center; margin-bottom: 30px; }
//             .stats { display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; }
//             .stat-box { background: #f8fafc; padding: 10px 15px; border-radius: 8px; margin: 5px; min-width: 150px; }
//             .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
//             .status-active { background-color: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 11px; }
//             .status-inactive { background-color: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size: 11px; }
//             .filter-info { background-color: #f0f9ff; padding: 10px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid #0ea5e9; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1 style="color: #111827;">Users Report</h1>
//             <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
//           </div>
          
//           ${(filters.fromDate || filters.toDate) ? `
//           <div class="filter-info">
//             <strong>Date Range:</strong> 
//             ${filters.fromDate ? `From: ${filters.fromDate}` : ''}
//             ${filters.fromDate && filters.toDate ? ' to ' : ''}
//             ${filters.toDate ? `To: ${filters.toDate}` : ''}
//           </div>
//           ` : ''}
          
//           ${filters.role ? `<div class="filter-info"><strong>Role:</strong> ${filters.role}</div>` : ''}
//           ${filters.status ? `<div class="filter-info"><strong>Status:</strong> ${filters.status}</div>` : ''}
//           ${searchTerm ? `<div class="filter-info"><strong>Search:</strong> ${searchTerm}</div>` : ''}
          
//           <div class="stats">
//             <div class="stat-box"><strong>Total Users:</strong> ${stats.totalUsers}</div>
//             <div class="stat-box"><strong>Active Users:</strong> ${stats.activeUsers}</div>
//             <div class="stat-box"><strong>Inactive Users:</strong> ${stats.inactiveUsers}</div>
//             <div class="stat-box"><strong>Admin Users:</strong> ${stats.adminUsers}</div>
//           </div>
          
//           <table>
//             <thead>
//               <tr>
//                 <th>User ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th>Status</th>
//                 <th>Created Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${sortedUsers
//                 .map(
//                     (user) => `
//                 <tr>
//                   <td>${user.id || ''}</td>
//                   <td>${user.firstName || ''} ${user.lastName || ''}</td>
//                   <td>${user.email || ''}</td>
//                   <td>${user.Role?.name || "N/A"}</td>
//                   <td>
//                     <span class="status-${user.status || "na"}">
//                       ${user.status || "NA"}
//                     </span>
//                   </td>
//                   <td>${user.createdAt}</td>
//                 </tr>
//               `
//                 )
//                 .join("")}
//             </tbody>
//           </table>
          
//           <div class="footer">
//             <p>Report generated by User Management System | ${sortedUsers.length} users displayed</p>
//           </div>
//         </body>
//       </html>
//     `);
//         printWindow.document.close();
//         printWindow.print();
//     };

//     const handleRefresh = () => {
//         toast.success("Refreshing data...");
//         fetchUsers();
//     };

//     return (
//         <>
//             <div className="space-y-6 bg-gray-50">
//                 <Toaster
//                     position="top-center"
//                     toastOptions={{
//                         style: {
//                             background: "#363636",
//                             color: "#fff",
//                         },
//                         success: {
//                             style: {
//                                 background: "#10b981",
//                             },
//                         },
//                         error: {
//                             style: {
//                                 background: "#ef4444",
//                             },
//                         },
//                     }}
//                 />

//                 {/* Header Section - SellersList style */}
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
//                         <p className="text-gray-600">Manage all users and their access permissions</p>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <button
//                             onClick={handleRefresh}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
//                         >
//                             <span>Refresh</span>
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                             </svg>
//                         </button>
//                         <button
//                             onClick={handleAddUser}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
//                         >
//                             <FaUserPlus className="w-4 h-4" />
//                             <span>Add User</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Stats Cards - SellersList style */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//                         <div className="flex items-start justify-between">
//                             <FaUser className="text-blue-500 opacity-60" size={40} />
//                             <div className="text-right">
//                                 <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
//                                 <p className="text-gray-600">Total Users</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//                         <div className="flex items-start justify-between">
//                             <FaUserCheck className="text-green-500 opacity-60" size={40} />
//                             <div className="text-right">
//                                 <h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
//                                 <p className="text-gray-600">Active Users</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//                         <div className="flex items-start justify-between">
//                             <FaUserTimes className="text-pink-500 opacity-60" size={40} />
//                             <div className="text-right">
//                                 <h3 className="text-2xl font-bold text-gray-900">{stats.inactiveUsers}</h3>
//                                 <p className="text-gray-600">Inactive Users</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//                         <div className="flex items-start justify-between">
//                             <Shield className="text-purple-500 opacity-60" size={40} />
//                             <div className="text-right">
//                                 <h3 className="text-2xl font-bold text-gray-900">{stats.adminUsers}</h3>
//                                 <p className="text-gray-600">Admin Users</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Filter Section - Using FilterSection component from HealthCheckupList */}
//                 <FilterSection
//                     filterConfig={filterConfig}
//                     onApplyFilters={applyFilters}
//                     onClearFilters={clearFilters}
//                     onExport={exportToCSV}
//                     onPrint={printTable}
//                     initialFilters={filters}
//                     searchPlaceholder="Search by User ID, Name, Email or Role..."
//                     enableSearch={true}
//                     enableExport={true}
//                     enablePrint={true}
//                     enableBulkDelete={selectedIds.length > 0}
//                     bulkDeleteLabel={`Delete (${selectedIds.length})`}
//                     onBulkDelete={() => handleDeleteClick('selected')}
//                 />

//                 {/* Data Table - SellersList style */}
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="w-10 px-4 py-3 border-r border-gray-100">
//                                         <input
//                                             type="checkbox"
//                                             checked={
//                                                 selectedIds.length === paginatedUsers.length &&
//                                                 paginatedUsers.length > 0
//                                             }
//                                             onChange={toggleSelectAll}
//                                             className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/50"
//                                             ref={(el) => {
//                                                 if (el) {
//                                                     el.indeterminate =
//                                                         selectedIds.length > 0 &&
//                                                         selectedIds.length < paginatedUsers.length;
//                                                 }
//                                             }}
//                                         />
//                                     </th>
//                                     {[
//                                         { key: 'id', label: 'User ID' },
//                                         { key: 'name', label: 'Full Name' },
//                                         { key: 'email', label: 'Email' },
//                                         { key: 'role', label: 'Role' },
//                                         { key: 'status', label: 'Status' },
//                                         { key: 'createdAt', label: 'Created Date' }
//                                     ].map((column) => (
//                                         <th
//                                             key={column.key}
//                                             className={`px-4 py-3 border-r border-gray-100 text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors text-left`}
//                                             onClick={() => requestSort(column.key)}
//                                         >
//                                             <div className={`flex items-center justify-start`}>
//                                                 {column.label}
//                                                 {getSortIcon(column.key)}
//                                             </div>
//                                         </th>
//                                     ))}
//                                     <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>

//                             <tbody className="bg-white divide-y divide-gray-100">
//                                 {loading ? (
//                                     <tr>
//                                         <td colSpan="10" className="px-4 py-12 text-center">
//                                             <div className="flex flex-col items-center justify-center">
//                                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
//                                                 <div className="text-lg font-medium text-gray-500 mb-2">
//                                                     Loading users...
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ) : paginatedUsers.length > 0 ? (
//                                     paginatedUsers.map((user, idx) => (
//                                         <tr
//                                             key={user.id}
//                                             className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
//                                                 } hover:bg-blue-50/30 transition-colors ${selectedIds.includes(user.id) ? "!bg-blue-50" : ""
//                                                 }`}
//                                         >
//                                             <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedIds.includes(user.id)}
//                                                     onChange={() => toggleSelect(user.id)}
//                                                     className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/50"
//                                                 />
//                                             </td>
//                                             <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
//                                                 <div className="flex items-center gap-1">
//                                                     <span className="font-medium text-gray-800">
//                                                         {user.id}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="font-medium text-gray-800">
//                                                         {user.firstName || ''} {user.lastName || ''}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
//                                                 <div className="flex items-center gap-1">
//                                                     <span className="font-medium">{user.email || ''}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
//                                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                                     {user.Role?.name || "N/A"}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
//                                                 <span
//                                                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "active"
//                                                         ? "bg-green-100 text-green-800"
//                                                         : user.status === "inactive"
//                                                             ? "bg-pink-100 text-pink-800"
//                                                             : "bg-gray-100 text-gray-600"
//                                                         }`}
//                                                 >
//                                                     {user.status === "active"
//                                                         ? "Active"
//                                                         : user.status === "inactive"
//                                                             ? "Inactive"
//                                                             : "NA"}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-sm text-gray-700">
//                                                 <span className="font-medium">
//                                                     {user.createdAt && user.createdAt !== 'N/A'
//                                                         ? new Date(user.createdAt).toLocaleDateString('en-GB')
//                                                         : 'N/A'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                                                 <div className="flex items-center justify-center space-x-2">
//                                                     <button
//                                                         onClick={() => handleViewUser(user)}
//                                                         className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                                                         title="View User Details"
//                                                     >
//                                                         <FaEye className="h-4 w-4" />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleEditUser(user)}
//                                                         className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
//                                                         title="Edit User"
//                                                     >
//                                                         <FaEdit className="h-4 w-4" />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDeleteClick(user.id)}
//                                                         className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
//                                                         title="Delete User"
//                                                     >
//                                                         <MdDelete className="h-4 w-4" />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="10" className="px-4 py-12 text-center">
//                                             <div className="flex flex-col items-center justify-center">
//                                                 <div className="text-lg font-medium text-gray-500 mb-2">
//                                                     No users found
//                                                 </div>
//                                                 <p className="text-sm text-gray-400 mb-6">
//                                                     Try adjusting your search or filters
//                                                 </p>
//                                                 <button
//                                                     onClick={handleAddUser}
//                                                     className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm"
//                                                 >
//                                                     <FaUserPlus /> Add Your First User
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination - SellersList style */}
//                     <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
//                         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
//                             <div className="text-center sm:text-left">
//                                 Showing{" "}
//                                 <span className="font-medium text-blue-600">
//                                     {sortedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
//                                 </span>{" "}
//                                 to{" "}
//                                 <span className="font-medium text-blue-600">
//                                     {Math.min(currentPage * itemsPerPage, sortedUsers.length)}
//                                 </span>{" "}
//                                 of{" "}
//                                 <span className="font-medium text-blue-600">
//                                     {sortedUsers.length}
//                                 </span>{" "}
//                                 users
//                             </div>

//                             <div className="flex flex-wrap items-center justify-center gap-2">
//                                 <div className="relative">
//                                     <button
//                                         onClick={() =>
//                                             setShowItemsPerPageDropdown(!showItemsPerPageDropdown)
//                                         }
//                                         className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[5rem] bg-white"
//                                     >
//                                         <span>{itemsPerPage}</span>
//                                         <svg
//                                             className="w-4 h-4 ml-2"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M19 9l-7 7-7-7"
//                                             />
//                                         </svg>
//                                     </button>

//                                     {showItemsPerPageDropdown && (
//                                         <div className="absolute bottom-full mb-1 left-0 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-200 border-b-0 max-h-48 overflow-y-auto">
//                                             {[5, 10, 20, 30, 50, 100].map((option) => (
//                                                 <button
//                                                     key={option}
//                                                     onClick={() => handleItemsPerPageChange(option)}
//                                                     className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors border-b border-gray-200 last:border-b-0 ${itemsPerPage === option
//                                                         ? "bg-blue-50 text-blue-600 font-medium"
//                                                         : "text-gray-700"
//                                                         }`}
//                                                 >
//                                                     {option}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="flex flex-wrap justify-center gap-2">
//                                     <button
//                                         onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
//                                         disabled={currentPage === 1}
//                                         className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white whitespace-nowrap"
//                                     >
//                                         Previous
//                                     </button>

//                                     {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
//                                         const pageNumber =
//                                             totalPages <= 5
//                                                 ? i + 1
//                                                 : currentPage <= 3
//                                                     ? i + 1
//                                                     : currentPage >= totalPages - 2
//                                                         ? totalPages - 4 + i
//                                                         : currentPage - 2 + i;

//                                         return (
//                                             <button
//                                                 key={pageNumber}
//                                                 onClick={() => setCurrentPage(pageNumber)}
//                                                 className={`px-3 py-2 border rounded-lg min-w-[2.5rem] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${currentPage === pageNumber
//                                                     ? "bg-blue-600 text-white border-transparent"
//                                                     : "border-gray-200 hover:bg-gray-50 bg-white"
//                                                     }`}
//                                             >
//                                                 {pageNumber}
//                                             </button>
//                                         );
//                                     })}

//                                     {totalPages > 5 && currentPage < totalPages - 2 && (
//                                         <span className="px-2 flex items-center text-gray-400">
//                                             ...
//                                         </span>
//                                     )}

//                                     {totalPages > 5 && currentPage < totalPages - 2 && (
//                                         <button
//                                             onClick={() => setCurrentPage(totalPages)}
//                                             className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white"
//                                         >
//                                             {totalPages}
//                                         </button>
//                                     )}

//                                     <button
//                                         onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
//                                         disabled={currentPage === totalPages || totalPages === 0}
//                                         className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white whitespace-nowrap"
//                                     >
//                                         Next
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Delete Confirmation Modal */}
//             {showDeleteModal && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
//                     <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl mx-2">
//                         <div className="flex justify-center mb-4 mt-6">
//                             <div className="p-3 bg-red-50 rounded-full">
//                                 <HiOutlineTrash className="w-10 h-10 text-red-500" />
//                             </div>
//                         </div>

//                         <div className="text-center mb-6">
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                                 Confirm Deletion
//                             </h3>
//                             <p className="text-gray-500 text-sm leading-relaxed px-6">
//                                 {deleteTarget === 'selected'
//                                     ? `You're about to delete ${selectedIds.length} selected user(s). This action is permanent and cannot be undone.`
//                                     : "You're about to delete this user. This action is permanent and cannot be undone."}
//                             </p>
//                         </div>

//                         <div className="flex flex-col sm:flex-row justify-center gap-3 px-6 pb-6">
//                             <button
//                                 onClick={() => {
//                                     setShowDeleteModal(false);
//                                     setDeleteTarget(null);
//                                 }}
//                                 className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmDelete}
//                                 disabled={loading}
//                                 className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm flex items-center justify-center gap-2"
//                             >
//                                 {loading ? (
//                                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                                 ) : (
//                                     <span>Delete</span>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ManageUsersTable;

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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                            disabled={loading}
                        >
                            <span>Refresh</span>
                            <ArrowRight size={16} />
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
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm bg-gray-50/50"
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
                        <div className="mt-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Role Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Role
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
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
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
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