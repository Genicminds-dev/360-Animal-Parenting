import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Minus
} from "lucide-react";
import { 
  FaDownload, 
  FaPrint, 
  FaEye, 
  FaEdit 
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi";
import FilterSection from "../../../components/common/Filter/FilterSection";
import DataTable from "../../../components/common/Table/DataTable";
import api from "../../../services/api/api";
import { Endpoints } from "../../../services/api/EndPoint";
import { PATHROUTES } from "../../../routes/pathRoutes";

const AgentsList = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
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
    totalAgents: 0,
    withAadhar: 0,
    withoutAadhar: 0,
  });
  
  // Selection state
  const [selectedAgents, setSelectedAgents] = useState(new Set());
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // Added to prevent double submission
  
  // Sorting state - exactly like vendor example
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

  // Fetch agents with API - search and pagination
  const fetchAgents = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      console.log("Fetching with search:", search);
      
      const url = `${Endpoints.GET_AGENT}?page=${page}&limit=${pagination.limit}&search=${encodeURIComponent(search)}`;
      console.log("API URL:", url);
      
      const response = await api.get(url);
      
      if (response.data.success) {
        const agentsData = response.data.data.map(agent => ({
          id: agent.uid,
          uid: getValue(agent.uid),
          fullName: getValue(agent.name),
          mobile: getValue(agent.phone),
          aadharNumber: agent.aadhaarNumber,
          profileImg: agent.profileImg,
          aadhaarFile: agent.aadhaarFile,
          createdAt: agent.createdAt
        }));
        
        setAgents(agentsData);
        setFilteredAgents(agentsData);
        
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalRecords: response.data.pagination.totalRecords,
          limit: response.data.pagination.limit
        });
        
        const withAadharCount = agentsData.filter(a => a.aadharNumber && a.aadharNumber !== "" && a.aadharNumber !== null).length;
        const withoutAadharCount = agentsData.length - withAadharCount;
        
        setStats({
          totalAgents: response.data.summary?.totalAgents || agentsData.length,
          withAadhar: withAadharCount,
          withoutAadhar: withoutAadharCount,
        });
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error("Failed to fetch agents");
      setAgents([]);
      setFilteredAgents([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  // Debounce search - EXACTLY like vendor example
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

  // Fetch when search term or pagination changes
  useEffect(() => {
    fetchAgents(pagination.currentPage, searchTerm);
  }, [searchTerm, pagination.currentPage, pagination.limit, fetchAgents]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("Search input changed:", value);
    setSearchInput(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    fetchAgents(1, "");
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

  // Sorting handler - EXACTLY like vendor example (3-step cycle)
  const requestSort = useCallback((key) => {
    setSortCycle((prev) => {
      if (prev.key !== key) {
        // Different column, start with ascending
        return { key, step: 1 };
      }

      // Same column, cycle through steps: 1→2→0→1
      const nextStep = (prev.step + 1) % 3;
      return { key, step: nextStep };
    });
  }, []);

  // Apply sorting to data - EXACTLY like vendor example
  const sortedAgents = useMemo(() => {
    if (sortCycle.step === 0) {
      // Normal - no sorting, use original order
      return filteredAgents;
    }

    return [...filteredAgents].sort((a, b) => {
      const key = sortCycle.key;
      let aValue = a[key] ?? "";
      let bValue = b[key] ?? "";

      // Handle null values for aadharNumber
      if (key === 'aadharNumber') {
        aValue = aValue || '';
        bValue = bValue || '';
      }

      if (sortCycle.step === 1) {
        // Ascending
        if (key === 'createdAt') {
          return new Date(aValue) - new Date(bValue);
        }
        return String(aValue).localeCompare(String(bValue));
      } else {
        // Descending
        if (key === 'createdAt') {
          return new Date(bValue) - new Date(aValue);
        }
        return String(bValue).localeCompare(String(aValue));
      }
    });
  }, [filteredAgents, sortCycle]);

  // Get sort icon - EXACTLY like vendor example
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
      label: "Commission Agent ID",
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
      key: "fullName", 
      label: "Name",
      sortable: true,
      onSort: () => requestSort('fullName'),
      sortIcon: getSortIcon('fullName'),
      render: (item) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium text-gray-900">{item.fullName}</div>
          </div>
        </div>
      )
    },
    { 
      key: "mobile", 
      label: "Phone",
      sortable: true,
      onSort: () => requestSort('mobile'),
      sortIcon: getSortIcon('mobile'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="font-medium text-gray-900">{item.mobile}</div>
        </div>
      )
    },
    { 
      key: "aadharNumber", 
      label: "Aadhar Number",
      sortable: true,
      onSort: () => requestSort('aadharNumber'),
      sortIcon: getSortIcon('aadharNumber'),
      render: (item) => {
        const hasAadhar = item.aadharNumber && item.aadharNumber !== "" && item.aadharNumber !== null;
        
        return (
          <div className="flex items-center gap-2">
            <div>
              {hasAadhar ? (
                <div className="font-medium text-gray-900">
                  {item.aadharNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                </div>
              ) : (
                <div className="font-medium text-gray-400 italic">N/A</div>
              )}
            </div>
          </div>
        );
      }
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
            <div>
              <div className="font-medium text-gray-900">{formattedDate}</div>
            </div>
          </div>
        );
      }
    },
  ], [getSortIcon, requestSort]);

  // Selection handlers
  const toggleSelectAgent = (uid) => {
    if (!uid) return;
    setSelectedAgents((prev) => {
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
    if (selectedAgents.size === filteredAgents.length && filteredAgents.length > 0) {
      setSelectedAgents(new Set());
    } else {
      setSelectedAgents(new Set(filteredAgents.map(agent => agent.uid).filter(Boolean)));
    }
  };

  // Event handlers
  const handleEdit = (agent) => {
      navigate(`${PATHROUTES.editAgent.replace(':uid', agent.uid)}`, { 
      state: { 
        uid: agent.uid,
        fullName: agent.fullName,
        mobile: agent.mobile,
        aadharNumber: agent.aadharNumber,
        profileImg: agent.profileImg,
        aadhaarFile: agent.aadhaarFile
      } 
    });
  };

  const handleView = (agent) => {
    navigate(`${PATHROUTES.agentDetails.replace(':uid', agent.uid)}`, { 
      state: { uid: agent.uid }
    });
  };

  const handleDelete = (uid) => {
    if (!uid) {
      toast.error("Cannot delete agent: Invalid agent ID");
      return;
    }
    setDeleteTarget("single");
    setDeleteId(uid);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedAgents.size === 0) {
      toast.error("Please select agents to delete");
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
      
      if (deleteTarget === "selected") {
        const deletePromises = Array.from(selectedAgents).map((uid) =>
          uid ? api.delete(Endpoints.DELETE_AGENT(uid)) : Promise.reject(new Error("Invalid agent ID"))
        );

        const results = await Promise.allSettled(deletePromises);
        
        const successfulDeletes = results.filter(r => r.status === 'fulfilled');
        
        if (successfulDeletes.length > 0) {
          await fetchAgents(pagination.currentPage, searchTerm);
          
          const successfulUids = successfulDeletes.map((_, index) => 
            Array.from(selectedAgents)[index]
          ).filter(Boolean);
          
          setSelectedAgents(prev => {
            const newSet = new Set(prev);
            successfulUids.forEach(uid => newSet.delete(uid));
            return newSet;
          });
          
          toast.success(`${successfulDeletes.length} agent(s) deleted successfully!`);
        }

      } else if (deleteTarget === "single" && deleteId) {
        await api.delete(Endpoints.DELETE_AGENT(deleteId));
        await fetchAgents(pagination.currentPage, searchTerm);
        setSelectedAgents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deleteId);
          return newSet;
        });
        toast.success("Agent deleted successfully!");
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error(error?.response?.data?.message || "Failed to delete agent");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteId(null);
      setLoading(false);
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Agent ID", "Full Name", "Mobile", "Aadhar Number", "Created At"],
      ...sortedAgents.map(a => [
        a.uid, 
        a.fullName, 
        a.mobile, 
        a.aadharNumber || "N/A", 
        new Date(a.createdAt).toLocaleString()
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commission-agents-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Agents data exported successfully!");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Commission Agents Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .stat-box { background: #f8fafc; padding: 15px; border-radius: 8px; width: 30%; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Commission Agents Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            ${searchTerm ? `<p style="color: #666; font-style: italic;">Search: "${searchTerm}" - ${sortedAgents.length} results found</p>` : ''}
          </div>
          
          <div class="stats">
            <div class="stat-box"><strong>Total Agents:</strong> ${stats.totalAgents}</div>
            <div class="stat-box"><strong>With Aadhar:</strong> ${stats.withAadhar}</div>
            <div class="stat-box"><strong>Without Aadhar:</strong> ${stats.withoutAadhar}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Full Name</th>
                <th>Mobile Number</th>
                <th>Aadhar Number</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${sortedAgents.map(agent => `
                <tr>
                  <td>${agent.uid}</td>
                  <td>${agent.fullName}</td>
                  <td>${agent.mobile}</td>
                  <td>${agent.aadharNumber || "N/A"}</td>
                  <td>${new Date(agent.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Report generated by Commission Agent Management System</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    toast.success("Printing agents report...");
  };

  const handleRefresh = () => {
    toast.success("Refreshing agents data...");
    fetchAgents(pagination.currentPage, searchTerm);
  };

  // Filter configuration - completely disabled
  const filterConfig = {
    fields: [],
    dateRange: false
  };

  const totalDisplayedRecords = pagination.totalRecords;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commission Agents</h1>
          <p className="text-gray-600">Manage commission agents for animal procurement</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          disabled={loading}
        >
          <span>Refresh</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Search and Action Menu - Like vendor example */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Agent ID, Name, Mobile, Aadhar..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm bg-gray-50/50"
                value={searchInput}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {sortedAgents.length} found
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
            {selectedAgents.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2.5 bg-gradient-to-tr from-red-600 to-red-800 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
              >
                <MdDelete className="w-4 h-4" />
                Delete ({selectedAgents.size})
              </button>
            )}
            <button
              onClick={handleExport}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
            >
              <FaDownload className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
            >
              <FaPrint className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedAgents}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        addButtonLabel="Add New Agent"
        emptyStateMessage="No commission agents found. Try adjusting your search."
        loadingMessage="Loading agents data..."
        enableSelection={true}
        enableExport={true}
        enablePrint={true}
        enablePagination={true}
        enableBulkDelete={true}
        selectedRows={selectedAgents}
        onSelectRow={toggleSelectAgent}
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
        // Hide the add button in DataTable if it has one
        hideAddButton={true}
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
                  ? `You're about to delete ${selectedAgents.size} selected agent(s). This action cannot be undone.`
                  : "You're about to delete this agent. This action cannot be undone."}
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

export default AgentsList;