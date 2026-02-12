// pages/sellers/SellersList.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  MapPin,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Store,
  Shield,
  Building,
  DollarSign,
  User,
  Phone,
  CreditCard,
  Smartphone,
} from "lucide-react";
import FilterSection from "../../../components/common/Filter/FilterSection";
import DataTable from "../../../components/common/Table/DataTable";
import { PATHROUTES } from "../../../routes/pathRoutes";

// Mock data - FRONTEND ONLY with uid as primary identifier
const MOCK_SELLERS = [
  {
    id: 1,
    uid: "SEL001",
    fullName: "Rajesh Kumar",
    mobileNumber: "9876543210",
    gender: "Male",
    state: "Maharashtra",
    transactionId: "TXN202400001",
    upiId: "rajesh@upi",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    uid: "SEL002",
    fullName: "Priya Sharma",
    mobileNumber: "8765432109",
    gender: "Female",
    state: "Delhi",
    transactionId: "NA",
    upiId: "priya.sharma@okhdfcbank",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    uid: "SEL003",
    fullName: "Mohan Singh",
    mobileNumber: "7654321098",
    gender: "Male",
    state: "Karnataka",
    transactionId: "TXN202400003",
    upiId: "NA",
    createdAt: "2024-01-25",
  },
  {
    id: 4,
    uid: "SEL004",
    fullName: "Anita Reddy",
    mobileNumber: "6543210987",
    gender: "Female",
    state: "Tamil Nadu",
    transactionId: "NA",
    upiId: "NA",
    createdAt: "2024-01-10",
  },
  {
    id: 5,
    uid: "SEL005",
    fullName: "Vikram Joshi",
    mobileNumber: "5432109876",
    gender: "Male",
    state: "Uttar Pradesh",
    transactionId: "TXN202400005",
    upiId: "vikram.joshi@okaxis",
    createdAt: "2024-01-18",
  },
  {
    id: 6,
    uid: "SEL006",
    fullName: "Suresh Patel",
    mobileNumber: "4321098765",
    gender: "Male",
    state: "Maharashtra",
    transactionId: "NA",
    upiId: "suresh.patel@okicici",
    createdAt: "2024-01-22",
  },
  {
    id: 7,
    uid: "SEL007",
    fullName: "Neha Gupta",
    mobileNumber: "3210987654",
    gender: "Female",
    state: "Karnataka",
    transactionId: "TXN202400007",
    upiId: "neha.gupta@okhdfcbank",
    createdAt: "2024-01-28",
  },
  {
    id: 8,
    uid: "SEL008",
    fullName: "Ramesh Iyer",
    mobileNumber: "2109876543",
    gender: "Male",
    state: "Delhi",
    transactionId: "NA",
    upiId: "NA",
    createdAt: "2024-01-12",
  },
  {
    id: 9,
    uid: "SEL009",
    fullName: "Smita Malhotra",
    mobileNumber: "1098765432",
    gender: "Female",
    state: "Uttar Pradesh",
    transactionId: "TXN202400009",
    upiId: "smita.malhotra@okaxis",
    createdAt: "2024-01-30",
  },
  {
    id: 10,
    uid: "SEL010",
    fullName: "Ajay Kapoor",
    mobileNumber: "0987654321",
    gender: "Male",
    state: "Tamil Nadu",
    transactionId: "NA",
    upiId: "ajay.kapoor@okicici",
    createdAt: "2024-01-14",
  },
];

const SellersList = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState(MOCK_SELLERS);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState(MOCK_SELLERS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({
    totalSellers: 0,
    maleSellers: 0,
    femaleSellers: 0,
    activeTransactions: 0,
  });

  // Fetch sellers with simulated API call
  const fetchSellers = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Calculate stats from mock data
      const maleCount = MOCK_SELLERS.filter(s => s.gender === "Male").length;
      const femaleCount = MOCK_SELLERS.filter(s => s.gender === "Female").length;
      const transactionCount = MOCK_SELLERS.filter(s => s.transactionId !== "NA").length;
      
      setStats({
        totalSellers: MOCK_SELLERS.length,
        maleSellers: maleCount,
        femaleSellers: femaleCount,
        activeTransactions: transactionCount,
      });
      
      setSellers(MOCK_SELLERS);
      setFilteredSellers(MOCK_SELLERS);
      
    } catch (error) {
      toast.error("Failed to fetch sellers");
      setSellers([]);
      setFilteredSellers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, []);

  // Apply filters function
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...MOCK_SELLERS];
    
    // Apply search filter
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.fullName.toLowerCase().includes(searchTerm) ||
        seller.uid.toLowerCase().includes(searchTerm) ||
        seller.mobileNumber.includes(searchTerm) ||
        seller.state.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply gender filter
    if (newFilters.gender) {
      filtered = filtered.filter(seller => seller.gender === newFilters.gender);
    }
    
    // Apply state filter
    if (newFilters.state) {
      filtered = filtered.filter(seller => seller.state === newFilters.state);
    }
    
    // Apply transaction filter
    if (newFilters.hasTransaction) {
      filtered = filtered.filter(seller => 
        newFilters.hasTransaction === 'yes' 
          ? seller.transactionId !== "NA"
          : seller.transactionId === "NA"
      );
    }
    
    // Apply date range filter
    if (newFilters.fromDate || newFilters.toDate) {
      filtered = filtered.filter(seller => {
        const sellerDate = new Date(seller.createdAt);
        
        if (newFilters.fromDate) {
          const fromDate = new Date(newFilters.fromDate);
          if (sellerDate < fromDate) return false;
        }
        
        if (newFilters.toDate) {
          const toDate = new Date(newFilters.toDate);
          if (sellerDate > toDate) return false;
        }
        
        return true;
      });
    }
    
    setFilteredSellers(filtered);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setFilteredSellers(MOCK_SELLERS);
  }, []);

  // Table columns - UPDATED to use uid instead of sellerId
  const columns = [
    { 
      key: "uid", 
      label: "Seller ID",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{item.uid}</span>
        </div>
      )
    },
    { 
      key: "fullName", 
      label: "Full Name",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{item.fullName}</span>
        </div>
      )
    },
    { 
      key: "mobileNumber", 
      label: "Mobile Number",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-center text-gray-900">{item.mobileNumber}</span>
        </div>
      )
    },
    { 
      key: "gender", 
      label: "Gender",
      render: (item) => {
        const getGenderStyle = (gender) => {
          switch(gender?.toLowerCase()) {
            case 'male': return { bg: 'bg-blue-100', text: 'text-blue-800', icon: '♂' };
            case 'female': return { bg: 'bg-pink-100', text: 'text-pink-800', icon: '♀' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '⚧' };
          }
        };
        
        const style = getGenderStyle(item.gender);
        
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            <span className="text-lg">{style.icon}</span>
            <span>{item.gender}</span>
          </span>
        );
      }
    },
    { 
      key: "state", 
      label: "State",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.state}</span>
        </div>
      )
    },
    { 
      key: "paymentInfo", 
      label: "Transaction/UPI ID",
      render: (item) => {
        const hasTransaction = item.transactionId !== "NA";
        const hasUpiId = item.upiId !== "NA";
        
        if (hasTransaction) {
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <CreditCard size={12} className="text-green-600" />
                <span className="text-xs font-medium text-green-700">Transaction ID:</span>
              </div>
              <span className="text-xs font-mono bg-green-50 text-green-800 px-2 py-1 rounded">
                {item.transactionId}
              </span>
            </div>
          );
        } else if (hasUpiId) {
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Smartphone size={12} className="text-purple-600" />
                <span className="text-xs font-medium text-purple-700">UPI ID:</span>
              </div>
              <span className="text-xs font-mono bg-purple-50 text-purple-800 px-2 py-1 rounded">
                {item.upiId}
              </span>
            </div>
          );
        } else {
          return (
            <span className="text-gray-400 italic">N/A</span>
          );
        }
      }
    },
  ];

  // Filter configuration
  const filterConfig = {
    fields: [
      {
        key: "gender",
        label: "Gender",
        type: "select",
        options: [
          { value: "", label: "All Genders" },
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ],
      },
      {
        key: "state",
        label: "State",
        type: "select",
        options: [
          { value: "", label: "All States" },
          { value: "Maharashtra", label: "Maharashtra" },
          { value: "Delhi", label: "Delhi" },
          { value: "Karnataka", label: "Karnataka" },
          { value: "Tamil Nadu", label: "Tamil Nadu" },
          { value: "Uttar Pradesh", label: "Uttar Pradesh" },
        ],
      },
      {
        key: "hasTransaction",
        label: "Has Transaction ID",
        type: "select",
        options: [
          { value: "", label: "All" },
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
    ],
    dateRange: true,
  };
  
// Event handlers - FIXED for DataTable
const handleView = (item) => {
  if (typeof item === 'string' || typeof item === 'number') {
    const seller = sellers.find(s => s.uid === item || s.id === item);
    if (seller) {
      navigate(`/management/seller-details/${seller.uid}`, { 
        state: { seller } 
      });
    }
  } else if (item?.uid) {
    navigate(`/management/seller-details/${item.uid}`, { 
      state: { seller: item } 
    });
  }
};

const handleEdit = (item) => {
  if (typeof item === 'string' || typeof item === 'number') {
    const seller = sellers.find(s => s.uid === item || s.id === item);
    if (seller) {
      navigate(`/management/edit-seller/${seller.uid}`, { 
        state: { seller } 
      });
    }
  } else if (item?.uid) {
    navigate(`/management/edit-seller/${item.uid}`, { 
      state: { seller: item } 
    });
  }
};

  const handleDelete = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state using id for deletion
      setSellers(prev => prev.filter(seller => seller.id !== id));
      setFilteredSellers(prev => prev.filter(seller => seller.id !== id));
      
      toast.success("Seller deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete seller");
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from local state using id for deletion
      setSellers(prev => prev.filter(seller => !ids.includes(seller.id)));
      setFilteredSellers(prev => prev.filter(seller => !ids.includes(seller.id)));
      
      toast.success(`${ids.length} sellers deleted successfully!`);
    } catch (error) {
      toast.error("Failed to delete sellers");
    }
  };

  const handleExport = () => {
    // CSV Export - UPDATED to use uid instead of sellerId
    const csvContent = [
      ["UID", "Full Name", "Mobile Number", "Gender", "State", "Transaction ID", "UPI ID"],
      ...filteredSellers.map(s => [
        s.uid, 
        s.fullName, 
        s.mobileNumber, 
        s.gender, 
        s.state, 
        s.transactionId !== "NA" ? s.transactionId : "N/A",
        s.upiId !== "NA" ? s.upiId : "N/A"
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sellers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success("Sellers data exported successfully!");
  };

  const handlePrint = () => {
    // Print functionality - UPDATED to use uid instead of sellerId
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Sellers List Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .stat-box { background: #f8fafc; padding: 15px; border-radius: 8px; width: 23%; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sellers List Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat-box"><strong>Total Sellers:</strong> ${stats.totalSellers}</div>
            <div class="stat-box"><strong>Male Sellers:</strong> ${stats.maleSellers}</div>
            <div class="stat-box"><strong>Female Sellers:</strong> ${stats.femaleSellers}</div>
            <div class="stat-box"><strong>Active Transactions:</strong> ${stats.activeTransactions}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>UID</th>
                <th>Full Name</th>
                <th>Mobile Number</th>
                <th>Gender</th>
                <th>State</th>
                <th>Transaction/UPI ID</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSellers.map(seller => `
                <tr>
                  <td>${seller.uid}</td>
                  <td>${seller.fullName}</td>
                  <td>${seller.mobileNumber}</td>
                  <td>${seller.gender}</td>
                  <td>${seller.state}</td>
                  <td>${seller.transactionId !== "NA" ? seller.transactionId : (seller.upiId !== "NA" ? seller.upiId : "N/A")}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Report generated by Seller Management System</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    toast.success("Printing sellers report...");
  };

  const handleRefresh = () => {
    toast.success("Refreshing data...");
    fetchSellers();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
          <p className="text-gray-600">View and manage all registered sellers</p>
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
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-blue-50">
              <Store className="text-blue-500" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+8%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.totalSellers}</h3>
          <p className="text-gray-600">Total Sellers</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-green-50">
              <User className="text-green-500" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+12%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.maleSellers}</h3>
          <p className="text-gray-600">Male Sellers</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-pink-50">
              <User className="text-pink-500" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+15%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.femaleSellers}</h3>
          <p className="text-gray-600">Female Sellers</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-purple-50">
              <CreditCard className="text-purple-500" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+22%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.activeTransactions}</h3>
          <p className="text-gray-600">Active Transactions</p>
        </div>
      </div>

      <FilterSection
        filterConfig={filterConfig}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        onExport={handleExport}
        onPrint={handlePrint}  
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedSellers.length}  
        initialFilters={filters}
        searchPlaceholder="Search by UID, Name, Mobile, State..."
        enableSearch={true}
        enableExport={true}      
        enablePrint={true}       
        enableBulkDelete={true}
      />

      <DataTable
        columns={columns}
        data={filteredSellers}
        loading={loading}
        getSelectedItems={() => selectedSellers}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
        onPrint={handlePrint}
        emptyStateMessage="No sellers found. Try adjusting your filters."
        loadingMessage="Loading sellers data..."
        enableSelection={true}
        enableExport={true}
        enablePrint={true}
        enablePagination={true}
        enableBulkDelete={true}
      />
    </div>
  );
};

export default SellersList;