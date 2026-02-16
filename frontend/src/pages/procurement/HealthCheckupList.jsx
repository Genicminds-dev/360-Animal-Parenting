// // pages/health-checkup/HealthCheckupList.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { RefreshCw, Plus } from "lucide-react";
// import DataTable from "../../components/common/Table/DataTable";
// import FilterSection from "../../components/common/Filter/FilterSection";

// // Updated mock data with Animal Tag ID and Seller Mobile No
// const MOCK_HEALTH_CHECKUPS = [
//   {
//     id: 1,
//     animalId: "ANM001",
//     animalTagId: "TAG-001",
//     sellerName: "Rajesh Kumar",
//     sellerMobile: "9876543210",
//     checkupDate: "2024-02-15T10:30:00Z",
//     status: "Pending"
//   },
//   {
//     id: 2,
//     animalId: "ANM002",
//     animalTagId: "TAG-002",
//     sellerName: "Suresh Patel",
//     sellerMobile: "9876543211",
//     checkupDate: "2024-02-14T14:45:00Z",
//     status: "Completed"
//   },
//   {
//     id: 3,
//     animalId: "ANM003",
//     animalTagId: "TAG-003",
//     sellerName: "Mohan Singh",
//     sellerMobile: "9876543212",
//     checkupDate: "2024-02-16T09:15:00Z",
//     status: "Scheduled"
//   },
//   {
//     id: 4,
//     animalId: "ANM004",
//     animalTagId: "TAG-004",
//     sellerName: "Anil Sharma",
//     sellerMobile: "9876543213",
//     checkupDate: "2024-02-13T11:20:00Z",
//     status: "Completed"
//   },
//   {
//     id: 5,
//     animalId: "ANM005",
//     animalTagId: "TAG-005",
//     sellerName: "Vikram Verma",
//     sellerMobile: "9876543214",
//     checkupDate: "2024-02-17T16:30:00Z",
//     status: "Pending"
//   },
//   {
//     id: 6,
//     animalId: "ANM006",
//     animalTagId: "TAG-006",
//     sellerName: "Ramesh Gupta",
//     sellerMobile: "9876543215",
//     checkupDate: "2024-02-12T13:10:00Z",
//     status: "Completed"
//   },
//   {
//     id: 7,
//     animalId: "ANM007",
//     animalTagId: "TAG-007",
//     sellerName: "Harish Joshi",
//     sellerMobile: "9876543216",
//     checkupDate: "2024-02-18T10:00:00Z",
//     status: "Scheduled"
//   }
// ];

// // Get unique sellers for dropdown
// const getUniqueSellers = () => {
//   const uniqueSellers = [];
//   const sellerMap = new Map();

//   MOCK_HEALTH_CHECKUPS.forEach(checkup => {
//     const key = `${checkup.sellerName}-${checkup.sellerMobile}`;
//     if (!sellerMap.has(key)) {
//       sellerMap.set(key, {
//         name: checkup.sellerName,
//         mobile: checkup.sellerMobile
//       });
//       uniqueSellers.push({
//         value: key,
//         label: `${checkup.sellerName} (${checkup.sellerMobile})`,
//         name: checkup.sellerName,
//         mobile: checkup.sellerMobile
//       });
//     }
//   });

//   return uniqueSellers;
// };

// const HealthCheckupList = () => {
//   const navigate = useNavigate();
//   const [healthCheckups, setHealthCheckups] = useState(MOCK_HEALTH_CHECKUPS);
//   const [filteredCheckups, setFilteredCheckups] = useState(MOCK_HEALTH_CHECKUPS);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({});

//   // Fetch health checkups with simulated API call
//   const fetchHealthCheckups = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 800));

//       setHealthCheckups(MOCK_HEALTH_CHECKUPS);
//       setFilteredCheckups(MOCK_HEALTH_CHECKUPS);

//     } catch (error) {
//       toast.error("Failed to fetch health checkups");
//       setHealthCheckups([]);
//       setFilteredCheckups([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchHealthCheckups();
//   }, [fetchHealthCheckups]);

//   // Apply filters function
//   const applyFilters = useCallback((newFilters) => {
//     setFilters(newFilters);

//     let filtered = [...MOCK_HEALTH_CHECKUPS];

//     // Apply search filter
//     if (newFilters.search) {
//       const searchTerm = newFilters.search.toLowerCase();
//       filtered = filtered.filter(checkup =>
//         checkup.animalId.toLowerCase().includes(searchTerm) ||
//         checkup.animalTagId.toLowerCase().includes(searchTerm) ||
//         checkup.sellerName.toLowerCase().includes(searchTerm) ||
//         checkup.sellerMobile.includes(searchTerm)
//       );
//     }

//     // Apply seller filter
//     if (newFilters.seller) {
//       const selectedSeller = newFilters.seller;
//       filtered = filtered.filter(checkup =>
//         checkup.sellerName === selectedSeller.name &&
//         checkup.sellerMobile === selectedSeller.mobile
//       );
//     }

//     // Apply date range filter
//     if (newFilters.fromDate || newFilters.toDate) {
//       filtered = filtered.filter(checkup => {
//         const checkupDate = new Date(checkup.checkupDate);
//         checkupDate.setHours(0, 0, 0, 0);

//         if (newFilters.fromDate) {
//           const fromDate = new Date(newFilters.fromDate);
//           fromDate.setHours(0, 0, 0, 0);
//           if (checkupDate < fromDate) return false;
//         }

//         if (newFilters.toDate) {
//           const toDate = new Date(newFilters.toDate);
//           toDate.setHours(23, 59, 59, 999);
//           if (checkupDate > toDate) return false;
//         }

//         return true;
//       });
//     }

//     setFilteredCheckups(filtered);
//   }, []);

//   const clearFilters = useCallback(() => {
//     setFilters({});
//     setFilteredCheckups(MOCK_HEALTH_CHECKUPS);
//   }, []);

//   // Get record count badge
//   const getRecordCountBadge = () => {
//     const count = filteredCheckups.length;
//     return (
//       <span className="px-3 py-1 rounded-lg text-xs font-small text-blue-800">
//         {count} {count === 1 ? 'Record' : 'Records'}
//       </span>
//     );
//   };

//   // Table columns with Animal ID, Animal Tag ID, Seller Name, Seller Mobile, and Record Count
//   const columns = [
//     {
//       key: "animalId",
//       label: "Animal ID",
//       render: (item) => (
//         <div className="font-medium text-gray-900">{item.animalId}</div>
//       )
//     },
//     {
//       key: "animalTagId",
//       label: "Animal Tag ID",
//       render: (item) => (
//         <div className="font-medium text-gray-800">{item.animalTagId}</div>
//       )
//     },
//     {
//       key: "sellerName",
//       label: "Seller Name",
//       render: (item) => (
//         <div className="font-medium text-gray-900">{item.sellerName}</div>
//       )
//     },
//     {
//       key: "sellerMobile",
//       label: "Seller Mobile No.",
//       render: (item) => (
//         <div className="text-gray-700">{item.sellerMobile}</div>
//       )
//     },
//     {
//       key: "recordCount",
//       label: "No. of Records",
//       render: () => getRecordCountBadge()
//     }
//   ];

//   // Filter configuration with Seller dropdown and Date Range
//   const filterConfig = {
//     fields: [
//       {
//         key: "seller",
//         label: "Select Seller",
//         type: "select",
//         placeholder: "Select a seller",
//         options: getUniqueSellers()
//       }
//     ],
//     dateRange: true,
//     dateRangeConfig: {
//       fromLabel: "Start Date",
//       toLabel: "End Date",
//     }
//   };

//   // Handle Health Details button click - Navigate to new page
//   const handleHealthDetails = (checkup) => {
//     navigate(`/health-checkup/form/${checkup.id}`, {
//       state: {
//         animalData: checkup
//       }
//     });
//   };

//   const handleExport = () => {
//     // CSV Export
//     const csvContent = [
//       ["Animal ID", "Animal Tag ID", "Seller Name", "Seller Mobile No", "Checkup Date"],
//       ...filteredCheckups.map(c => [
//         c.animalId,
//         c.animalTagId,
//         c.sellerName,
//         c.sellerMobile,
//         new Date(c.checkupDate).toLocaleDateString()
//       ])
//     ].map(row => row.join(",")).join("\n");

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `health-checkups-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();

//     toast.success("Health checkups data exported successfully!");
//   };

//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Health Checkups Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             table { border-collapse: collapse; width: 100%; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
//             th { background-color: #f3f4f6; font-weight: bold; }
//             .header { text-align: center; margin-bottom: 30px; }
//             .record-count { background-color: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
//             .summary { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
//             .summary h3 { margin-top: 0; color: #1e293b; }
//             .summary p { margin: 5px 0; color: #475569; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Health Checkups Report</h1>
//             <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
//           </div>
          
//           <div class="summary">
//             <h3>Summary</h3>
//             <p>Total Records: <strong>${filteredCheckups.length}</strong></p>
//             <p>Date Range: 
//               <strong>
//                 ${filters.fromDate ? new Date(filters.fromDate).toLocaleDateString() : 'All dates'} 
//                 to 
//                 ${filters.toDate ? new Date(filters.toDate).toLocaleDateString() : 'All dates'}
//               </strong>
//             </p>
//             ${filters.seller ? `<p>Selected Seller: <strong>${filters.seller.name} (${filters.seller.mobile})</strong></p>` : ''}
//             ${filters.search ? `<p>Search Term: <strong>${filters.search}</strong></p>` : ''}
//           </div>
          
//           <table>
//             <thead>
//               <tr>
//                 <th>Animal ID</th>
//                 <th>Animal Tag ID</th>
//                 <th>Seller Name</th>
//                 <th>Seller Mobile No</th>
//                 <th>No. of Records</th>
//                 <th>Checkup Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${filteredCheckups.map(checkup => `
//                 <tr>
//                   <td>${checkup.animalId}</td>
//                   <td>${checkup.animalTagId}</td>
//                   <td>${checkup.sellerName}</td>
//                   <td>${checkup.sellerMobile}</td>
//                   <td><span class="record-count">1</span></td>
//                   <td>${new Date(checkup.checkupDate).toLocaleDateString()}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colspan="4" style="text-align: right; font-weight: bold;">Total:</td>
//                 <td style="font-weight: bold;"><span class="record-count">${filteredCheckups.length}</span></td>
//                 <td></td>
//               </tr>
//             </tfoot>
//           </table>
          
//           <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
//             <p>Report generated by Animal Health Management System</p>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();

//     toast.success("Printing health checkups report...");
//   };

//   const handleRefresh = () => {
//     toast.success("Refreshing health checkups data...");
//     fetchHealthCheckups();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Animal Health Checkups</h1>
//           <p className="text-gray-600">View animals and perform health checkups</p>
//         </div>
//           <button
//             onClick={handleRefresh}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
//           >
//             <RefreshCw size={16} />
//             <span>Refresh</span>
//           </button>
//       </div>

//       {/* Filter Section */}
//       <FilterSection
//         filterConfig={filterConfig}
//         onApplyFilters={applyFilters}
//         onClearFilters={clearFilters}
//         onExport={handleExport}
//         onPrint={handlePrint}
//         initialFilters={filters}
//         searchPlaceholder="Search by Animal ID, Tag ID, Seller Name or Mobile..."
//         enableSearch={true}
//         enableExport={true}
//         enablePrint={true}
//         enableBulkDelete={false}
//       />

//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={filteredCheckups}
//         loading={loading}
//         onExport={handleExport}
//         onPrint={handlePrint}
//         onHealthCheck={handleHealthDetails}
//         enableHealthCheck={true}
//         healthCheckLabel="Add Health Details"
//         addButtonLabel="New Health Checkup"
//         emptyStateMessage="No animals found for health checkup. Try adjusting your filters."
//         loadingMessage="Loading animal data..."
//         enableSelection={false}
//         enableExport={true}
//         enablePrint={true}
//         enablePagination={true}
//         enableBulkDelete={false}
//         enableDelete={false}
//       />
//     </div>
//   );
// };

// export default HealthCheckupList;



// pages/health-checkup/HealthCheckupList.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Filter,
  X,
  Calendar,
  RefreshCw,
} from "lucide-react";
import {
  FaDownload,
  FaPrint,
} from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import DataTable from "../../components/common/Table/DataTable";

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
  const [healthCheckups, setHealthCheckups] = useState([]);
  const [filteredCheckups, setFilteredCheckups] = useState([]);
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

  // Filter state
  const [filters, setFilters] = useState({
    seller: "",
    fromDate: "",
    toDate: ""
  });

  // Filter UI state
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Initialize tempFilters when component mounts
  useEffect(() => {
    setTempFilters(filters);

    // Check if any filters are applied
    const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);
    setAppliedFilters(filters);
  }, [filters]);

  // Fetch health checkups with simulated API call
  const fetchHealthCheckups = useCallback(async (search = "") => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Apply search filter
      let filtered = [...MOCK_HEALTH_CHECKUPS];

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(checkup =>
          checkup.animalId.toLowerCase().includes(searchLower) ||
          checkup.animalTagId.toLowerCase().includes(searchLower) ||
          checkup.sellerName.toLowerCase().includes(searchLower) ||
          checkup.sellerMobile.includes(searchLower)
        );
      }

      setHealthCheckups(filtered);
      setFilteredCheckups(filtered);

      setPagination(prev => ({
        ...prev,
        totalRecords: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.limit)
      }));

    } catch (error) {
      toast.error("Failed to fetch health checkups");
      setHealthCheckups([]);
      setFilteredCheckups([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Fetch when search term changes
  useEffect(() => {
    fetchHealthCheckups(searchTerm);
  }, [searchTerm, fetchHealthCheckups]);

  // Apply filters function
  const applyFilters = useCallback((filterValues) => {
    let filtered = [...MOCK_HEALTH_CHECKUPS];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(checkup =>
        checkup.animalId.toLowerCase().includes(searchLower) ||
        checkup.animalTagId.toLowerCase().includes(searchLower) ||
        checkup.sellerName.toLowerCase().includes(searchLower) ||
        checkup.sellerMobile.includes(searchLower)
      );
    }

    // Apply seller filter
    if (filterValues.seller) {
      const selectedSeller = filterValues.seller;
      filtered = filtered.filter(checkup =>
        checkup.sellerName === selectedSeller.name &&
        checkup.sellerMobile === selectedSeller.mobile
      );
    }

    // Apply date range filter
    if (filterValues.fromDate || filterValues.toDate) {
      filtered = filtered.filter(checkup => {
        const checkupDate = new Date(checkup.checkupDate);
        checkupDate.setHours(0, 0, 0, 0);

        if (filterValues.fromDate) {
          const fromDate = new Date(filterValues.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (checkupDate < fromDate) return false;
        }

        if (filterValues.toDate) {
          const toDate = new Date(filterValues.toDate);
          toDate.setHours(23, 59, 59, 999);
          if (checkupDate > toDate) return false;
        }

        return true;
      });
    }

    setFilteredCheckups(filtered);
    setHealthCheckups(filtered);

    // Update pagination
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalRecords: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.limit)
    }));

  }, [searchTerm]);

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
      seller: "",
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
    fetchHealthCheckups("");
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
      currentPage: 1,
      totalPages: Math.ceil(prev.totalRecords / newLimit)
    }));
  };

  // Get unique sellers for filter dropdown
  const uniqueSellers = useMemo(() => {
    return getUniqueSellers();
  }, []);

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

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
            ${searchTerm ? '.search-info { color: #666; font-style: italic; margin-top: 10px; }' : ''}
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Health Checkups Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            ${searchTerm ? `<p class="search-info">Search: "${searchTerm}" - ${filteredCheckups.length} results found</p>` : ''}
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Records: <strong>${filteredCheckups.length}</strong></p>
            <p>Date Range: 
              <strong>
                ${appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toLocaleDateString() : 'All dates'} 
                to 
                ${appliedFilters.toDate ? new Date(appliedFilters.toDate).toLocaleDateString() : 'All dates'}
              </strong>
            </p>
            ${appliedFilters.seller ? `<p>Selected Seller: <strong>${appliedFilters.seller.name} (${appliedFilters.seller.mobile})</strong></p>` : ''}
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
    fetchHealthCheckups(searchTerm);
  };

  const totalDisplayedRecords = filteredCheckups.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Animal Health Checkups</h1>
          <p className="text-gray-600">View animals and perform health checkups</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
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
                placeholder="Search by Animal ID, Tag ID, Seller Name or Mobile..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm bg-gray-50/50"
                value={searchInput}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {totalDisplayedRecords} found
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
            {/* Export Button */}
            <button
              onClick={handleExport}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
            >
              <FaDownload className="w-4 h-4" />
              Export
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
            >
              <FaPrint className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Seller Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Seller
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  value={tempFilters.seller?.value || ""}
                  onChange={(e) => {
                    const selected = uniqueSellers.find(s => s.value === e.target.value);
                    handleFilterChange("seller", selected || "");
                  }}
                >
                  <option value="">All Sellers</option>
                  {uniqueSellers.map(seller => (
                    <option key={seller.value} value={seller.value}>
                      {seller.label}
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
                          if (key === 'seller') {
                            return `Seller: ${appliedFilters[key]?.name}`;
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCheckups}
        loading={loading}
        onExport={handleExport}
        onPrint={handlePrint}
        onHealthCheck={handleHealthDetails}
        enableHealthCheck={true}
        healthCheckLabel="Add Health Details"
        addButtonLabel="New Health Checkup"
        emptyStateMessage="No animals found for health checkup. Try adjusting your search or filters."
        loadingMessage="Loading animal data..."
        enableSelection={false}
        enableExport={true}
        enablePrint={true}
        enablePagination={true}
        enableBulkDelete={false}
        enableDelete={false}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalRecords: totalDisplayedRecords,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
          limit: pagination.limit,
          limitOptions: [5, 10, 25, 50, 100]
        }}
      />
    </div>
  );
};

export default HealthCheckupList;