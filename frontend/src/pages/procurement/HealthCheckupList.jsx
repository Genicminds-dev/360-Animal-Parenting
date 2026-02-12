// pages/health-checkup/HealthCheckupList.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Plus, RefreshCw, Stethoscope } from "lucide-react";
import DataTable from "../../components/common/Table/DataTable";
import FilterSection from "../../components/common/Filter/FilterSection";

// Updated mock data with Animal Tag ID and Seller Mobile No
const MOCK_HEALTH_CHECKUPS = [
  {
    id: 1,
    animalId: "ANM001",
    animalTagId: "TAG-001",
    sellerName: "Rajesh Kumar",
    sellerMobile: "9876543210",
    checkupDate: "2024-02-15T10:30:00Z",
    status: "Pending"
  },
  {
    id: 2,
    animalId: "ANM002",
    animalTagId: "TAG-002",
    sellerName: "Suresh Patel",
    sellerMobile: "9876543211",
    checkupDate: "2024-02-14T14:45:00Z",
    status: "Completed"
  },
  {
    id: 3,
    animalId: "ANM003",
    animalTagId: "TAG-003",
    sellerName: "Mohan Singh",
    sellerMobile: "9876543212",
    checkupDate: "2024-02-16T09:15:00Z",
    status: "Scheduled"
  },
  {
    id: 4,
    animalId: "ANM004",
    animalTagId: "TAG-004",
    sellerName: "Anil Sharma",
    sellerMobile: "9876543213",
    checkupDate: "2024-02-13T11:20:00Z",
    status: "Completed"
  },
  {
    id: 5,
    animalId: "ANM005",
    animalTagId: "TAG-005",
    sellerName: "Vikram Verma",
    sellerMobile: "9876543214",
    checkupDate: "2024-02-17T16:30:00Z",
    status: "Pending"
  },
  {
    id: 6,
    animalId: "ANM006",
    animalTagId: "TAG-006",
    sellerName: "Ramesh Gupta",
    sellerMobile: "9876543215",
    checkupDate: "2024-02-12T13:10:00Z",
    status: "Completed"
  },
  {
    id: 7,
    animalId: "ANM007",
    animalTagId: "TAG-007",
    sellerName: "Harish Joshi",
    sellerMobile: "9876543216",
    checkupDate: "2024-02-18T10:00:00Z",
    status: "Scheduled"
  }
];

// Get unique sellers for dropdown
const getUniqueSellers = () => {
  const uniqueSellers = [];
  const sellerMap = new Map();
  
  MOCK_HEALTH_CHECKUPS.forEach(checkup => {
    const key = `${checkup.sellerName}-${checkup.sellerMobile}`;
    if (!sellerMap.has(key)) {
      sellerMap.set(key, {
        name: checkup.sellerName,
        mobile: checkup.sellerMobile
      });
      uniqueSellers.push({
        value: key,
        label: `${checkup.sellerName} (${checkup.sellerMobile})`,
        name: checkup.sellerName,
        mobile: checkup.sellerMobile
      });
    }
  });
  
  return uniqueSellers;
};

const HealthCheckupList = () => {
  const navigate = useNavigate();
  const [healthCheckups, setHealthCheckups] = useState(MOCK_HEALTH_CHECKUPS);
  const [filteredCheckups, setFilteredCheckups] = useState(MOCK_HEALTH_CHECKUPS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  
  // Store pending filters before Apply button is clicked
  const [pendingFilters, setPendingFilters] = useState({});

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

  // Apply filters function - only when Apply button is clicked
  const applyFilters = useCallback((newFilters) => {
    // Update the actual filters state
    setFilters(newFilters);
    
    // Also update pending filters to match
    setPendingFilters(newFilters);

    let filtered = [...MOCK_HEALTH_CHECKUPS];

    // Apply search filter
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(checkup =>
        checkup.animalId.toLowerCase().includes(searchTerm) ||
        checkup.animalTagId.toLowerCase().includes(searchTerm) ||
        checkup.sellerName.toLowerCase().includes(searchTerm) ||
        checkup.sellerMobile.includes(searchTerm)
      );
    }

    // Apply seller filter (based on selected seller from dropdown)
    if (newFilters.seller) {
      const selectedSeller = newFilters.seller;
      filtered = filtered.filter(checkup => 
        checkup.sellerName === selectedSeller.name && 
        checkup.sellerMobile === selectedSeller.mobile
      );
    }

    // Apply date range filter
    if (newFilters.fromDate || newFilters.toDate) {
      filtered = filtered.filter(checkup => {
        const checkupDate = new Date(checkup.checkupDate);

        if (newFilters.fromDate) {
          const fromDate = new Date(newFilters.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (checkupDate < fromDate) return false;
        }

        if (newFilters.toDate) {
          const toDate = new Date(newFilters.toDate);
          toDate.setHours(23, 59, 59, 999);
          if (checkupDate > toDate) return false;
        }

        return true;
      });
    }

    setFilteredCheckups(filtered);
  }, []);

  // Handle filter changes without applying them - just store pending filters
  const handleFilterChange = useCallback((newPendingFilters) => {
    setPendingFilters(newPendingFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPendingFilters({});
    setFilteredCheckups(MOCK_HEALTH_CHECKUPS);
  }, []);

  // Get record count badge
  const getRecordCountBadge = () => {
    const count = filteredCheckups.length;
    return (
      <span className="px-3 py-1 rounded-lg text-xs font-small text-blue-800">
        {count} {count === 1 ? 'Record' : 'Records'}
      </span>
    );
  };

  // Table columns with Animal ID, Animal Tag ID, Seller Name, Seller Mobile, and Record Count
  const columns = [
    {
      key: "animalId",
      label: "Animal ID",
      render: (item) => (
        <div className="font-medium text-gray-900">{item.animalId}</div>
      )
    },
    {
      key: "animalTagId",
      label: "Animal Tag ID",
      render: (item) => (
        <div className="font-medium text-gray-800">{item.animalTagId}</div>
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
      key: "sellerMobile",
      label: "Seller Mobile No.",
      render: (item) => (
        <div className="text-gray-700">{item.sellerMobile}</div>
      )
    },
    {
      key: "recordCount",
      label: "No. of Records",
      render: () => getRecordCountBadge()
    }
  ];

  // Filter configuration with Seller dropdown and Date Range
  const filterConfig = {
    fields: [
      {
        key: "seller",
        label: "Select Seller",
        type: "select",
        placeholder: "Select a seller",
        options: getUniqueSellers()
      }
    ],
    dateRange: true,
    dateRangeConfig: {
      fromLabel: "Start Date",
      toLabel: "End Date",
    }
  };

  // Event handlers
  const handleAddNew = () => {
    navigate("/health-checkup/register");
  };

  // Handle Health Details button click - Navigate to new page
  const handleHealthDetails = (checkup) => {
    navigate(`/health-checkup/form/${checkup.id}`, {
      state: {
        animalData: checkup
      }
    });
  };

  const handleExport = () => {
    // CSV Export
    const csvContent = [
      ["Animal ID", "Animal Tag ID", "Seller Name", "Seller Mobile No", "Checkup Date"],
      ...filteredCheckups.map(c => [
        c.animalId,
        c.animalTagId,
        c.sellerName,
        c.sellerMobile,
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
            .record-count { background-color: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .summary { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
            .summary h3 { margin-top: 0; color: #1e293b; }
            .summary p { margin: 5px 0; color: #475569; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Health Checkups Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Records: <strong>${filteredCheckups.length}</strong></p>
            <p>Date Range: 
              <strong>
                ${filters.fromDate ? new Date(filters.fromDate).toLocaleDateString() : 'All dates'} 
                to 
                ${filters.toDate ? new Date(filters.toDate).toLocaleDateString() : 'All dates'}
              </strong>
            </p>
            ${filters.seller ? `<p>Selected Seller: <strong>${filters.seller.name} (${filters.seller.mobile})</strong></p>` : ''}
            ${filters.search ? `<p>Search Term: <strong>${filters.search}</strong></p>` : ''}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Animal ID</th>
                <th>Animal Tag ID</th>
                <th>Seller Name</th>
                <th>Seller Mobile No</th>
                <th>No. of Records</th>
                <th>Checkup Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCheckups.map(checkup => `
                <tr>
                  <td>${checkup.animalId}</td>
                  <td>${checkup.animalTagId}</td>
                  <td>${checkup.sellerName}</td>
                  <td>${checkup.sellerMobile}</td>
                  <td><span class="record-count">1</span></td>
                  <td>${new Date(checkup.checkupDate).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align: right; font-weight: bold;">Total:</td>
                <td style="font-weight: bold;"><span class="record-count">${filteredCheckups.length}</span></td>
                <td></td>
              </tr>
            </tfoot>
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
          <h1 className="text-2xl font-bold text-gray-900">Animal Health Checkups</h1>
          <p className="text-gray-600">View animals and perform health checkups</p>
        </div>
        <div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>Refresh</span>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection
        filterConfig={filterConfig}
        onApplyFilters={applyFilters}
        onFilterChange={handleFilterChange} // Add this prop to capture filter changes without applying
        onClearFilters={clearFilters}
        onExport={handleExport}
        onPrint={handlePrint}
        selectedCount={0}
        initialFilters={pendingFilters} // Use pendingFilters instead of filters
        searchPlaceholder="Search by Animal ID, Tag ID, Seller Name or Mobile..."
        enableSearch={true}
        enableExport={true}
        enablePrint={true}
        enableBulkDelete={true}
        applyButtonLabel="Apply Filters" // Ensure the Apply button is clearly labeled
        autoApply={false} // Add this prop if FilterSection supports it
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCheckups}
        loading={loading}
        onHealthCheck={handleHealthDetails}
        enableHealthCheck={true}
        healthCheckLabel=" Add Health Details"
        addButtonLabel="New Health Checkup"
        onAdd={handleAddNew}
        emptyStateMessage="animals found for health checkup. Try adjusting your filters."
        loadingMessage="Loading animal data..."
        enableSelection={true}
        enablePagination={true}
      />
    </div>
  );
};

export default HealthCheckupList;