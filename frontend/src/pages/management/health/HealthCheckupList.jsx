// pages/health-checkup/HealthCheckupList.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, Pencil, Plus, RefreshCw, Search } from "lucide-react";
import FilterSection from "../../../components/common/Filter/FilterSection";
import DataTable from "../../../components/common/Table/DataTable";

// Mock data for health checkups
const MOCK_HEALTH_CHECKUPS = [
  {
    id: 1,
    animalId: "ANM001",
    sellerName: "Rajesh Kumar",
    checkupDate: "2024-02-15T10:30:00Z",
    status: "Pending"
  },
  {
    id: 2,
    animalId: "ANM002",
    sellerName: "Suresh Patel",
    checkupDate: "2024-02-14T14:45:00Z",
    status: "Completed"
  },
  {
    id: 3,
    animalId: "ANM003",
    sellerName: "Mohan Singh",
    checkupDate: "2024-02-16T09:15:00Z",
    status: "Scheduled"
  },
  {
    id: 4,
    animalId: "ANM004",
    sellerName: "Anil Sharma",
    checkupDate: "2024-02-13T11:20:00Z",
    status: "Completed"
  },
  {
    id: 5,
    animalId: "ANM005",
    sellerName: "Vikram Verma",
    checkupDate: "2024-02-17T16:30:00Z",
    status: "Pending"
  },
  {
    id: 6,
    animalId: "ANM006",
    sellerName: "Ramesh Gupta",
    checkupDate: "2024-02-12T13:10:00Z",
    status: "Completed"
  },
  {
    id: 7,
    animalId: "ANM007",
    sellerName: "Harish Joshi",
    checkupDate: "2024-02-18T10:00:00Z",
    status: "Scheduled"
  }
];

const HealthCheckupList = () => {
  const navigate = useNavigate();
  const [healthCheckups, setHealthCheckups] = useState(MOCK_HEALTH_CHECKUPS);
  const [filteredCheckups, setFilteredCheckups] = useState(MOCK_HEALTH_CHECKUPS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  // Fetch health checkups with simulated API call
  const fetchHealthCheckups = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setHealthCheckups(MOCK_HEALTH_CHECKUPS);
      setFilteredCheckups(MOCK_HEALTH_CHECKUPS);
      
    } catch (error) {
      toast.error("Failed to fetch health checkups");
      setHealthCheckups([]);
      setFilteredCheckups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthCheckups();
  }, [fetchHealthCheckups]);

  // Apply filters function
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...MOCK_HEALTH_CHECKUPS];
    
    // Apply search filter
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(checkup =>
        checkup.animalId.toLowerCase().includes(searchTerm) ||
        checkup.sellerName.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (newFilters.status) {
      filtered = filtered.filter(checkup => checkup.status === newFilters.status);
    }
    
    // Apply date range filter
    if (newFilters.fromDate || newFilters.toDate) {
      filtered = filtered.filter(checkup => {
        const checkupDate = new Date(checkup.checkupDate);
        
        if (newFilters.fromDate) {
          const fromDate = new Date(newFilters.fromDate);
          if (checkupDate < fromDate) return false;
        }
        
        if (newFilters.toDate) {
          const toDate = new Date(newFilters.toDate);
          toDate.setHours(23, 59, 59, 999); // End of day
          if (checkupDate > toDate) return false;
        }
        
        return true;
      });
    }
    
    setFilteredCheckups(filtered);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setFilteredCheckups(MOCK_HEALTH_CHECKUPS);
  }, []);

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case 'scheduled':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Scheduled</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Table columns - Only Animal ID, Seller Name, and Actions
  const columns = [
    { 
      key: "animalId", 
      label: "Animal ID",
      render: (item) => (
        <div className="font-medium text-gray-900">{item.animalId}</div>
      )
    },
    { 
      key: "sellerName", 
      label: "Seller Name",
      render: (item) => (
        <div className="font-medium text-gray-900">{item.sellerName}</div>
      )
    },
    { 
      key: "actions", 
      label: "Actions",
      render: (item) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Checkup"
          >
            <Pencil size={18} />
          </button>
        </div>
      )
    },
  ];

  // Filter configuration
  const filterConfig = {
    fields: [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "", label: "All Status" },
          { value: "Pending", label: "Pending" },
          { value: "Scheduled", label: "Scheduled" },
          { value: "Completed", label: "Completed" },
        ],
      },
    ],
    dateRange: true,
  };

  // Event handlers
  const handleAddNew = () => {
    navigate("/health-checkup/register");
  };

  const handleEdit = (checkup) => {
    toast.success(`Editing health checkup for: ${checkup.animalId}`);
    navigate(`/health-checkup/edit/${checkup.id}`, { state: { checkup } });
  };
  
  const handleView = (checkup) => {
    navigate(`/health-checkup/details/${checkup.id}`, { 
      state: { checkup } 
    });
  };

  const handleDelete = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setHealthCheckups(prev => prev.filter(checkup => checkup.id !== id));
      setFilteredCheckups(prev => prev.filter(checkup => checkup.id !== id));
      
      toast.success("Health checkup deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete health checkup");
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from local state
      setHealthCheckups(prev => prev.filter(checkup => !ids.includes(checkup.id)));
      setFilteredCheckups(prev => prev.filter(checkup => !ids.includes(checkup.id)));
      
      toast.success(`${ids.length} health checkups deleted successfully!`);
    } catch (error) {
      toast.error("Failed to delete health checkups");
    }
  };

  const handleExport = () => {
    // CSV Export
    const csvContent = [
      ["Animal ID", "Seller Name", "Status", "Checkup Date"],
      ...filteredCheckups.map(c => [
        c.animalId, 
        c.sellerName,
        c.status,
        new Date(c.checkupDate).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-checkups-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success("Health checkups data exported successfully!");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Health Checkups Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Health Checkups Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Animal ID</th>
                <th>Seller Name</th>
                <th>Status</th>
                <th>Checkup Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCheckups.map(checkup => `
                <tr>
                  <td>${checkup.animalId}</td>
                  <td>${checkup.sellerName}</td>
                  <td>${checkup.status}</td>
                  <td>${new Date(checkup.checkupDate).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Report generated by Animal Health Management System</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    toast.success("Printing health checkups report...");
  };

  const handleRefresh = () => {
    toast.success("Refreshing health checkups data...");
    fetchHealthCheckups();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Checkups</h1>
          <p className="text-gray-600">View and manage animal health checkups</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last sync</p>
            <p className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>Refresh</span>
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={handleAddNew}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>New Checkup</span>
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection
        filterConfig={filterConfig}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        onExport={handleExport}
        onPrint={handlePrint}
        onBulkDelete={() => handleBulkDelete(Array.from(new Set()))}
        selectedCount={0}
        initialFilters={filters}
        searchPlaceholder="Search by Animal ID or Seller Name..."
        enableSearch={true}
        enableExport={true}
        enablePrint={true}
        enableBulkDelete={true}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCheckups}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        addButtonLabel="New Health Checkup"
        onAdd={handleAddNew}
        emptyStateMessage="No health checkups found. Try adjusting your filters or add new checkups."
        loadingMessage="Loading health checkups data..."
        enableSelection={true}
        enableExport={true}
        enablePrint={true}
        enablePagination={true}
        enableBulkDelete={true}
      />
    </div>
  );
};

export default HealthCheckupList;