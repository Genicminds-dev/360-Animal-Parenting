// pages/animals/AnimalsList.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Weight,
  Calendar,
  User,
  Phone,
  TrendingUp,
  ArrowRight,
  Camera,
  Video,
  CheckCircle,
  XCircle,
  IndianRupee,
  HeartPulse,
  Eye,
  Pencil,
  Trash2,
  Beef,
  Rabbit,
  Bird,
  Baby,
  Milk,
  Scale,
  CircleDot,
  Circle,
  GitCompare,
  Package,
  Users,
  Building,
  MapPin,
  Search
} from "lucide-react";
import FilterSection from "../../../components/common/Filter/FilterSection";
import DataTable from "../../../components/common/Table/DataTable";

// Mock data for animals - using uid instead of animalId
const MOCK_ANIMALS = [
  {
    id: 1,
    uid: "ANM001",
    earTagId: "TAG-001",
    vendorName: "Rajesh Kumar",
    vendorId: "V001",
    vendorMobile: "9876543210",
    animalType: "Cow",
    breed: "Holstein Friesian",
    pricing: "₹85,000",
    pregnancyStatus: "Milking",
    calfTagId: "CALF001",
    numberOfPregnancies: 3,
    ageYears: 5,
    ageMonths: 2,
    weight: "450 kg",
    milkPerDay: "12 liters",
    calfAgeYears: 1,
    calfAgeMonths: 6,
    createdAt: "2024-01-15T10:30:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: true,
    hasCalfPhoto: true,
    hasCalfVideo: false
  },
  {
    id: 2,
    uid: "ANM002",
    earTagId: "TAG-002",
    vendorName: "Suresh Patel",
    vendorId: "V002",
    vendorMobile: "9876543211",
    animalType: "Buffalo",
    breed: "Murrah",
    pricing: "₹95,000",
    pregnancyStatus: "Pregnant",
    calfTagId: "",
    numberOfPregnancies: 2,
    ageYears: 4,
    ageMonths: 0,
    weight: "550 kg",
    milkPerDay: "10 liters",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-01-20T14:45:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: false,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
  {
    id: 3,
    uid: "ANM003",
    earTagId: "TAG-003",
    vendorName: "Mohan Singh",
    vendorId: "V003",
    vendorMobile: "9876543212",
    animalType: "Goat",
    breed: "Sirohi",
    pricing: "₹12,000",
    pregnancyStatus: "Non-Pregnant",
    calfTagId: "",
    numberOfPregnancies: 0,
    ageYears: 2,
    ageMonths: 6,
    weight: "35 kg",
    milkPerDay: "2 liters",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-01-25T09:15:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: false,
    hasAnimalVideo: false,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
  {
    id: 4,
    uid: "ANM004",
    earTagId: "TAG-004",
    vendorName: "Anil Sharma",
    vendorId: "V004",
    vendorMobile: "9876543213",
    animalType: "Cow",
    breed: "Jersey",
    pricing: "₹65,000",
    pregnancyStatus: "Milking",
    calfTagId: "CALF002",
    numberOfPregnancies: 4,
    ageYears: 6,
    ageMonths: 0,
    weight: "400 kg",
    milkPerDay: "15 liters",
    calfAgeYears: 2,
    calfAgeMonths: 0,
    createdAt: "2024-01-10T11:20:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: true,
    hasCalfPhoto: true,
    hasCalfVideo: true
  },
  {
    id: 5,
    uid: "ANM005",
    earTagId: "TAG-005",
    vendorName: "Vikram Verma",
    vendorId: "V005",
    vendorMobile: "9876543214",
    animalType: "Sheep",
    breed: "Merino",
    pricing: "₹8,000",
    pregnancyStatus: "Pregnant",
    calfTagId: "",
    numberOfPregnancies: 1,
    ageYears: 3,
    ageMonths: 0,
    weight: "45 kg",
    milkPerDay: "1 liter",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-01-18T16:30:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: false,
    hasBackPhoto: true,
    hasAnimalVideo: false,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
  {
    id: 6,
    uid: "ANM006",
    earTagId: "TAG-006",
    vendorName: "Ramesh Gupta",
    vendorId: "V006",
    vendorMobile: "9876543215",
    animalType: "Camel",
    breed: "Bikaneri",
    pricing: "₹1,20,000",
    pregnancyStatus: "Non-Pregnant",
    calfTagId: "",
    numberOfPregnancies: 0,
    ageYears: 8,
    ageMonths: 0,
    weight: "650 kg",
    milkPerDay: "5 liters",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-01-22T13:10:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: false,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
  {
    id: 7,
    uid: "ANM007",
    earTagId: "TAG-007",
    vendorName: "Harish Joshi",
    vendorId: "V007",
    vendorMobile: "9876543216",
    animalType: "Horse",
    breed: "Marwari",
    pricing: "₹2,50,000",
    pregnancyStatus: "Pregnant",
    calfTagId: "",
    numberOfPregnancies: 2,
    ageYears: 7,
    ageMonths: 3,
    weight: "500 kg",
    milkPerDay: "N/A",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-01-28T10:00:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: true,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
];

const AnimalsList = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState(MOCK_ANIMALS);
  const [filteredAnimals, setFilteredAnimals] = useState(MOCK_ANIMALS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({
    totalAnimals: 0,
    totalValue: 0,
    milkingAnimals: 0,
    pregnantAnimals: 0,
  });

  // Fetch animals with simulated API call
  const fetchAnimals = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Calculate stats from mock data
      const totalValue = MOCK_ANIMALS.reduce((sum, animal) => {
        const price = parseInt(animal.pricing.replace(/[^0-9]/g, ''));
        return sum + (price || 0);
      }, 0);
      
      const milkingCount = MOCK_ANIMALS.filter(a => a.pregnancyStatus === "Milking").length;
      const pregnantCount = MOCK_ANIMALS.filter(a => a.pregnancyStatus === "Pregnant").length;
      
      setStats({
        totalAnimals: MOCK_ANIMALS.length,
        totalValue: totalValue,
        milkingAnimals: milkingCount,
        pregnantAnimals: pregnantCount,
      });
      
      setAnimals(MOCK_ANIMALS);
      setFilteredAnimals(MOCK_ANIMALS);
      
    } catch (error) {
      toast.error("Failed to fetch animals");
      setAnimals([]);
      setFilteredAnimals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  // Apply filters function
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...MOCK_ANIMALS];
    
    // Apply search filter
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(animal =>
        animal.earTagId.toLowerCase().includes(searchTerm) ||
        animal.uid.toLowerCase().includes(searchTerm) ||
        animal.vendorName.toLowerCase().includes(searchTerm) ||
        animal.animalType.toLowerCase().includes(searchTerm) ||
        animal.breed.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply animal type filter
    if (newFilters.animalType) {
      filtered = filtered.filter(animal => animal.animalType === newFilters.animalType);
    }
    
    // Apply pregnancy status filter
    if (newFilters.pregnancyStatus) {
      filtered = filtered.filter(animal => animal.pregnancyStatus === newFilters.pregnancyStatus);
    }
    
    // Apply status filter
    if (newFilters.status) {
      filtered = filtered.filter(animal => animal.status === newFilters.status);
    }
    
    // Apply date range filter
    if (newFilters.fromDate || newFilters.toDate) {
      filtered = filtered.filter(animal => {
        const animalDate = new Date(animal.createdAt);
        
        if (newFilters.fromDate) {
          const fromDate = new Date(newFilters.fromDate);
          if (animalDate < fromDate) return false;
        }
        
        if (newFilters.toDate) {
          const toDate = new Date(newFilters.toDate);
          toDate.setHours(23, 59, 59, 999); // End of day
          if (animalDate > toDate) return false;
        }
        
        return true;
      });
    }
    
    setFilteredAnimals(filtered);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setFilteredAnimals(MOCK_ANIMALS);
  }, []);

  // Get pregnancy status badge
  const getPregnancyBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'milking':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Milk className="mr-1" size={12} />
            Milking
          </span>
        );
      case 'pregnant':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            <HeartPulse className="mr-1" size={12} />
            Pregnant
          </span>
        );
      case 'non-pregnant':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Circle className="mr-1" size={12} />
            Not Pregnant
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  // Table columns for animals - REMOVED vendor details, pricing, media columns
  const columns = [
    { 
      key: "uid", 
      label: "Animal ID",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium text-gray-900">{item.uid}</div>
            <div className="text-xs text-gray-500">Ear Tag: {item.earTagId}</div>
          </div>
        </div>
      )
    },
    { 
      key: "animalType", 
      label: "Animal Details",
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.animalType}</div>
          <div className="text-sm text-gray-600">{item.breed}</div>
          {/* Removed Age: 5 years 2 months display */}
        </div>
      )
    },
    { 
      key: "pregnancyStatus", 
      label: "Pregnancy/Milking",
      render: (item) => (
        <div>
          {getPregnancyBadge(item.pregnancyStatus)}
          {/* Removed calfTagId, numberOfPregnancies, and age display */}
        </div>
      )
    },
    { 
      key: "physicalAttributes", 
      label: "Physical Info",
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <Scale className="text-gray-400" size={14} />
            <span className="text-gray-900">{item.weight}</span>
          </div>
          {item.milkPerDay && item.milkPerDay !== "N/A" && (
            <div className="flex items-center gap-2 mt-1">
              <Milk className="text-gray-400" size={14} />
              <span className="text-gray-900">{item.milkPerDay}</span>
            </div>
          )}
        </div>
      )
    },
    { 
      key: "createdAt", 
      label: "Created",
      render: (item) => {
        const date = new Date(item.createdAt);
        return (
          <div>
            <div className="font-medium text-gray-900">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        );
      }
    },
  ];

  // Filter configuration
  const filterConfig = {
    fields: [
      {
        key: "animalType",
        label: "Animal Type",
        type: "select",
        options: [
          { value: "", label: "All Types" },
          { value: "Cow", label: "Cow" },
          { value: "Buffalo", label: "Buffalo" },
          { value: "Goat", label: "Goat" },
          { value: "Sheep", label: "Sheep" },
          { value: "Camel", label: "Camel" },
          { value: "Horse", label: "Horse" },
          { value: "Bull", label: "Bull" },
          { value: "Ox", label: "Ox" },
        ],
      },
      {
        key: "pregnancyStatus",
        label: "Pregnancy Status",
        type: "select",
        options: [
          { value: "", label: "All Status" },
          { value: "Milking", label: "Milking" },
          { value: "Pregnant", label: "Pregnant" },
          { value: "Non-Pregnant", label: "Non-Pregnant" },
        ],
      }
    ],
    dateRange: true,
  };

  // Event handlers
  const handleAddNew = () => {
    navigate("/animals/register");
  };

  const handleEdit = (animal) => {
    toast.success(`Editing animal: ${animal.uid}`);
    navigate(`/animals/edit/${animal.uid}`, { state: { animal } });
  };
  
  const handleView = (animal) => {
    navigate(`/management/animal-details/${animal.uid}`, { 
      state: { animal } 
    });
  };

  const handleDelete = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setAnimals(prev => prev.filter(animal => animal.id !== id));
      setFilteredAnimals(prev => prev.filter(animal => animal.id !== id));
      
      toast.success("Animal deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete animal");
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from local state
      setAnimals(prev => prev.filter(animal => !ids.includes(animal.id)));
      setFilteredAnimals(prev => prev.filter(animal => !ids.includes(animal.id)));
      
      toast.success(`${ids.length} animals deleted successfully!`);
    } catch (error) {
      toast.error("Failed to delete animals");
    }
  };

  const handleExport = () => {
    // CSV Export - Updated to match new columns
    const csvContent = [
      ["Animal ID", "Ear Tag", "Animal Type", "Breed", "Pregnancy Status", "Weight", "Milk/Day", "Commission Agent", "Status", "Created Date"],
      ...filteredAnimals.map(a => [
        a.uid, 
        a.earTagId, 
        a.animalType, 
        a.breed, 
        a.pregnancyStatus,
        a.weight,
        a.milkPerDay,
        a.commissionAgentName,
        a.status,
        new Date(a.createdAt).toLocaleString()
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success("Animals data exported successfully!");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Animals Registration Report</title>
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
            <h1>Animals Registration Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat-box"><strong>Total Animals:</strong> ${stats.totalAnimals}</div>
            <div class="stat-box"><strong>Total Value:</strong> ₹${stats.totalValue.toLocaleString()}</div>
            <div class="stat-box"><strong>Milking Animals:</strong> ${stats.milkingAnimals}</div>
            <div class="stat-box"><strong>Pregnant Animals:</strong> ${stats.pregnantAnimals}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Animal ID</th>
                <th>Ear Tag</th>
                <th>Type</th>
                <th>Breed</th>
                <th>Pregnancy Status</th>
                <th>Weight</th>
                <th>Milk/Day</th>
                <th>Commission Agent</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAnimals.map(animal => `
                <tr>
                  <td>${animal.uid}</td>
                  <td>${animal.earTagId}</td>
                  <td>${animal.animalType}</td>
                  <td>${animal.breed}</td>
                  <td>${animal.pregnancyStatus}</td>
                  <td>${animal.weight}</td>
                  <td>${animal.milkPerDay}</td>
                  <td>${new Date(animal.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Report generated by Animal Management System</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    toast.success("Printing animals report...");
  };

  const handleRefresh = () => {
    toast.success("Refreshing animals data...");
    fetchAnimals();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Animal Details</h1>
          <p className="text-gray-600">View and manage all registered animals</p>
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
          <button 
            onClick={handleAddNew}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center space-x-2"
          >
            <Beef size={16} />
            <span>Register New Animal</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <Beef className="text-blue-600" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+15%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.totalAnimals}</h3>
          <p className="text-gray-600">Total Animals</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <IndianRupee className="text-green-600" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+22%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{formatCurrency(stats.totalValue)}</h3>
          <p className="text-gray-600">Total Value</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <Milk className="text-purple-600" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+8%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.milkingAnimals}</h3>
          <p className="text-gray-600">Milking Animals</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100">
              <HeartPulse className="text-pink-600" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+12%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.pregnantAnimals}</h3>
          <p className="text-gray-600">Pregnant Animals</p>
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
        searchPlaceholder="Search by Animal ID, Ear Tag, Vendor, Type, Breed..."
        enableSearch={true}
        enableExport={true}
        enablePrint={true}
        enableBulkDelete={true}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredAnimals}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        addButtonLabel="Register New Animal"
        onAdd={handleAddNew}
        emptyStateMessage="No animals found. Try adjusting your filters or register new animals."
        loadingMessage="Loading animals data..."
        enableSelection={true}
        enableExport={true}
        enablePrint={true}
        enablePagination={true}
        enableBulkDelete={true}
      />
    </div>
  );
};

export default AnimalsList;