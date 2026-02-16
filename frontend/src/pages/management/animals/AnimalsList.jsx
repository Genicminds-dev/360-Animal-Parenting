// // pages/animals/AnimalsList.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   Weight,
//   Calendar,
//   User,
//   Phone,
//   TrendingUp,
//   ArrowRight,
//   Camera,
//   Video,
//   CheckCircle,
//   XCircle,
//   IndianRupee,
//   HeartPulse,
//   Eye,
//   Pencil,
//   Trash2,
//   Beef,
//   Rabbit,
//   Bird,
//   Baby,
//   Milk,
//   Scale,
//   CircleDot,
//   Circle,
//   GitCompare,
//   Package,
//   Users,
//   Building,
//   MapPin,
//   Search
// } from "lucide-react";
// import FilterSection from "../../../components/common/Filter/FilterSection";
// import DataTable from "../../../components/common/Table/DataTable";

// // Mock data for animals - using uid instead of animalId
// const MOCK_ANIMALS = [
//   {
//     id: 1,
//     uid: "ANM001",
//     earTagId: "TAG-001",
//     vendorName: "Rajesh Kumar",
//     vendorId: "V001",
//     vendorMobile: "9876543210",
//     animalType: "Cow",
//     breed: "Holstein Friesian",
//     pricing: "₹85,000",
//     pregnancyStatus: "Milking",
//     calfTagId: "CALF001",
//     numberOfPregnancies: 3,
//     ageYears: 5,
//     ageMonths: 2,
//     weight: "450 kg",
//     milkPerDay: "12 liters",
//     calfAgeYears: 1,
//     calfAgeMonths: 6,
//     createdAt: "2024-01-15T10:30:00Z",
//     hasFrontPhoto: true,
//     hasSidePhoto: true,
//     hasBackPhoto: true,
//     hasAnimalVideo: true,
//     hasCalfPhoto: true,
//     hasCalfVideo: false
//   },
//   {
//     id: 2,
//     uid: "ANM002",
//     earTagId: "TAG-002",
//     vendorName: "Suresh Patel",
//     vendorId: "V002",
//     vendorMobile: "9876543211",
//     animalType: "Buffalo",
//     breed: "Murrah",
//     pricing: "₹95,000",
//     pregnancyStatus: "Pregnant",
//     calfTagId: "",
//     numberOfPregnancies: 2,
//     ageYears: 4,
//     ageMonths: 0,
//     weight: "550 kg",
//     milkPerDay: "10 liters",
//     calfAgeYears: "",
//     calfAgeMonths: "",
//     createdAt: "2024-01-20T14:45:00Z",
//     hasFrontPhoto: true,
//     hasSidePhoto: true,
//     hasBackPhoto: true,
//     hasAnimalVideo: false,
//     hasCalfPhoto: false,
//     hasCalfVideo: false
//   },
//   {
//     id: 3,
//     uid: "ANM003",
//     earTagId: "TAG-003",
//     vendorName: "Mohan Singh",
//     vendorId: "V003",
//     vendorMobile: "9876543212",
//     animalType: "Goat",
//     breed: "Sirohi",
//     pricing: "₹12,000",
//     pregnancyStatus: "Non-Pregnant",
//     calfTagId: "",
//     numberOfPregnancies: 0,
//     ageYears: 2,
//     ageMonths: 6,
//     weight: "35 kg",
//     milkPerDay: "2 liters",
//     calfAgeYears: "",
//     calfAgeMonths: "",
//     createdAt: "2024-01-25T09:15:00Z",
//     hasFrontPhoto: true,
//     hasSidePhoto: true,
//     hasBackPhoto: false,
//     hasAnimalVideo: false,
//     hasCalfPhoto: false,
//     hasCalfVideo: false
//   },
//   {
//     id: 4,
//     uid: "ANM004",
//     earTagId: "TAG-004",
//     vendorName: "Anil Sharma",
//     vendorId: "V004",
//     vendorMobile: "9876543213",
//     animalType: "Cow",
//     breed: "Jersey",
//     pricing: "₹65,000",
//     pregnancyStatus: "Milking",
//     calfTagId: "CALF002",
//     numberOfPregnancies: 4,
//     ageYears: 6,
//     ageMonths: 0,
//     weight: "400 kg",
//     milkPerDay: "15 liters",
//     calfAgeYears: 2,
//     calfAgeMonths: 0,
//     createdAt: "2024-01-10T11:20:00Z",
//     hasFrontPhoto: true,
//     hasSidePhoto: true,
//     hasBackPhoto: true,
//     hasAnimalVideo: true,
//     hasCalfPhoto: true,
//     hasCalfVideo: true
//   },
//   {
//     id: 5,
//     uid: "ANM005",
//     earTagId: "TAG-005",
//     vendorName: "Vikram Verma",
//     vendorId: "V005",
//     vendorMobile: "9876543214",
//     animalType: "Sheep",
//     breed: "Merino",
//     pricing: "₹8,000",
//     pregnancyStatus: "Pregnant",
//     calfTagId: "",
//     numberOfPregnancies: 1,
//     ageYears: 3,
//     ageMonths: 0,
//     weight: "45 kg",
//     milkPerDay: "1 liter",
//     calfAgeYears: "",
//     calfAgeMonths: "",
//     createdAt: "2024-01-18T16:30:00Z",
//     hasFrontPhoto: true,
//     hasSidePhoto: false,
//     hasBackPhoto: true,
//     hasAnimalVideo: false,
//     hasCalfPhoto: false,
//     hasCalfVideo: false
//   },
//   {
//     id: 6,
//     uid: "ANM006",
//     earTagId: "TAG-006",
//     vendorName: "Ramesh Gupta",
//     vendorId: "V006",
//     vendorMobile: "9876543215",
//     animalType: "Camel",
//     breed: "Bikaneri",
//     pricing: "₹1,20,000",
//     pregnancyStatus: "Non-Pregnant",
//     calfTagId: "",
//     numberOfPregnancies: 0,
//     ageYears: 8,
//     ageMonths: 0,
//     weight: "650 kg",
//     milkPerDay: "5 liters",
//     calfAgeYears: "",
//     calfAgeMonths: "",
//     createdAt: "2024-01-22T13:10:00Z",
//     hasFrontPhoto: true,
//     hasSidePhoto: true,
//     hasBackPhoto: true,
//     hasAnimalVideo: false,
//     hasCalfPhoto: false,
//     hasCalfVideo: false
//   },
//   {
//     id: 7,
//     uid: "ANM007",
//     earTagId: "TAG-007",
//     vendorName: "Harish Joshi",
//     vendorId: "V007",
//     vendorMobile: "9876543216",
//     animalType: "Horse",
//     breed: "Marwari",
//     pricing: "₹2,50,000",
//     pregnancyStatus: "Pregnant",
//     calfTagId: "",
//     numberOfPregnancies: 2,
//     ageYears: 7,
//     ageMonths: 3,
//     weight: "500 kg",
//     milkPerDay: "N/A",
//     calfAgeYears: "",
//     calfAgeMonths: "",
//     createdAt: "2024-01-28T10:00:00Z",
//     hasFrontPhoto: true,
//     hasSidePhoto: true,
//     hasBackPhoto: true,
//     hasAnimalVideo: true,
//     hasCalfPhoto: false,
//     hasCalfVideo: false
//   },
// ];

// const AnimalsList = () => {
//   const navigate = useNavigate();
//   const [animals, setAnimals] = useState(MOCK_ANIMALS);
//   const [filteredAnimals, setFilteredAnimals] = useState(MOCK_ANIMALS);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({});
//   const [stats, setStats] = useState({
//     totalAnimals: 0,
//     totalValue: 0,
//     milkingAnimals: 0,
//     pregnantAnimals: 0,
//   });

//   // Fetch animals with simulated API call
//   const fetchAnimals = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 800));

//       // Calculate stats from mock data
//       const totalValue = MOCK_ANIMALS.reduce((sum, animal) => {
//         const price = parseInt(animal.pricing.replace(/[^0-9]/g, ''));
//         return sum + (price || 0);
//       }, 0);

//       const milkingCount = MOCK_ANIMALS.filter(a => a.pregnancyStatus === "Milking").length;
//       const pregnantCount = MOCK_ANIMALS.filter(a => a.pregnancyStatus === "Pregnant").length;

//       setStats({
//         totalAnimals: MOCK_ANIMALS.length,
//         totalValue: totalValue,
//         milkingAnimals: milkingCount,
//         pregnantAnimals: pregnantCount,
//       });

//       setAnimals(MOCK_ANIMALS);
//       setFilteredAnimals(MOCK_ANIMALS);

//     } catch (error) {
//       toast.error("Failed to fetch animals");
//       setAnimals([]);
//       setFilteredAnimals([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAnimals();
//   }, [fetchAnimals]);

//   // Apply filters function
//   const applyFilters = useCallback((newFilters) => {
//     setFilters(newFilters);

//     let filtered = [...MOCK_ANIMALS];

//     // Apply search filter
//     if (newFilters.search) {
//       const searchTerm = newFilters.search.toLowerCase();
//       filtered = filtered.filter(animal =>
//         animal.earTagId.toLowerCase().includes(searchTerm) ||
//         animal.uid.toLowerCase().includes(searchTerm) ||
//         animal.vendorName.toLowerCase().includes(searchTerm) ||
//         animal.animalType.toLowerCase().includes(searchTerm) ||
//         animal.breed.toLowerCase().includes(searchTerm)
//       );
//     }

//     // Apply animal type filter
//     if (newFilters.animalType) {
//       filtered = filtered.filter(animal => animal.animalType === newFilters.animalType);
//     }

//     // Apply pregnancy status filter
//     if (newFilters.pregnancyStatus) {
//       filtered = filtered.filter(animal => animal.pregnancyStatus === newFilters.pregnancyStatus);
//     }

//     // Apply status filter
//     if (newFilters.status) {
//       filtered = filtered.filter(animal => animal.status === newFilters.status);
//     }

//     // Apply date range filter
//     if (newFilters.fromDate || newFilters.toDate) {
//       filtered = filtered.filter(animal => {
//         const animalDate = new Date(animal.createdAt);

//         if (newFilters.fromDate) {
//           const fromDate = new Date(newFilters.fromDate);
//           if (animalDate < fromDate) return false;
//         }

//         if (newFilters.toDate) {
//           const toDate = new Date(newFilters.toDate);
//           toDate.setHours(23, 59, 59, 999); // End of day
//           if (animalDate > toDate) return false;
//         }

//         return true;
//       });
//     }

//     setFilteredAnimals(filtered);
//   }, []);

//   const clearFilters = useCallback(() => {
//     setFilters({});
//     setFilteredAnimals(MOCK_ANIMALS);
//   }, []);

//   // Get pregnancy status badge
//   const getPregnancyBadge = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'milking':
//         return (
//           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//             <Milk className="mr-1" size={12} />
//             Milking
//           </span>
//         );
//       case 'pregnant':
//         return (
//           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//             <HeartPulse className="mr-1" size={12} />
//             Pregnant
//           </span>
//         );
//       case 'non-pregnant':
//         return (
//           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//             <Circle className="mr-1" size={12} />
//             Not Pregnant
//           </span>
//         );
//       default:
//         return (
//           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//             Unknown
//           </span>
//         );
//     }
//   };

//   // Table columns for animals - REMOVED vendor details, pricing, media columns
//   const columns = [
//     { 
//       key: "uid", 
//       label: "Animal ID",
//       render: (item) => (
//         <div className="flex items-center gap-3">
//           <div>
//             <div className="font-medium text-gray-900">{item.uid}</div>
//             <div className="text-xs text-gray-500">Ear Tag: {item.earTagId}</div>
//           </div>
//         </div>
//       )
//     },
//     { 
//       key: "animalType", 
//       label: "Animal Details",
//       render: (item) => (
//         <div>
//           <div className="font-medium text-gray-900">{item.animalType}</div>
//           <div className="text-sm text-gray-600">{item.breed}</div>
//           {/* Removed Age: 5 years 2 months display */}
//         </div>
//       )
//     },
//     { 
//       key: "pregnancyStatus", 
//       label: "Pregnancy/Milking",
//       render: (item) => (
//         <div>
//           {getPregnancyBadge(item.pregnancyStatus)}
//           {/* Removed calfTagId, numberOfPregnancies, and age display */}
//         </div>
//       )
//     },
//     { 
//       key: "physicalAttributes", 
//       label: "Physical Info",
//       render: (item) => (
//         <div>
//           <div className="flex items-center gap-2">
//             <Scale className="text-gray-400" size={14} />
//             <span className="text-gray-900">{item.weight}</span>
//           </div>
//           {item.milkPerDay && item.milkPerDay !== "N/A" && (
//             <div className="flex items-center gap-2 mt-1">
//               <Milk className="text-gray-400" size={14} />
//               <span className="text-gray-900">{item.milkPerDay}</span>
//             </div>
//           )}
//         </div>
//       )
//     },
//     { 
//       key: "createdAt", 
//       label: "Created",
//       render: (item) => {
//         const date = new Date(item.createdAt);
//         return (
//           <div>
//             <div className="font-medium text-gray-900">
//               {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//             </div>
//           </div>
//         );
//       }
//     },
//   ];

//   // Filter configuration
//   const filterConfig = {
//     fields: [
//       {
//         key: "animalType",
//         label: "Animal Type",
//         type: "select",
//         options: [
//           { value: "", label: "All Types" },
//           { value: "Cow", label: "Cow" },
//           { value: "Buffalo", label: "Buffalo" },
//           { value: "Goat", label: "Goat" },
//           { value: "Sheep", label: "Sheep" },
//           { value: "Camel", label: "Camel" },
//           { value: "Horse", label: "Horse" },
//           { value: "Bull", label: "Bull" },
//           { value: "Ox", label: "Ox" },
//         ],
//       },
//       {
//         key: "pregnancyStatus",
//         label: "Pregnancy Status",
//         type: "select",
//         options: [
//           { value: "", label: "All Status" },
//           { value: "Milking", label: "Milking" },
//           { value: "Pregnant", label: "Pregnant" },
//           { value: "Non-Pregnant", label: "Non-Pregnant" },
//         ],
//       }
//     ],
//     dateRange: true,
//   };

//   // Event handlers
//   const handleAddNew = () => {
//     navigate("/animals/register");
//   };

//   const handleEdit = (animal) => {
//     navigate(`/management/edit-animal/${animal.uid}`, { state: { animal } });
//   };

//   const handleView = (animal) => {
//     navigate(`/management/animal-details/${animal.uid}`, { 
//       state: { animal } 
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 500));

//       // Remove from local state
//       setAnimals(prev => prev.filter(animal => animal.id !== id));
//       setFilteredAnimals(prev => prev.filter(animal => animal.id !== id));

//       toast.success("Animal deleted successfully!");
//     } catch (error) {
//       toast.error("Failed to delete animal");
//     }
//   };

//   const handleBulkDelete = async (ids) => {
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 800));

//       // Remove from local state
//       setAnimals(prev => prev.filter(animal => !ids.includes(animal.id)));
//       setFilteredAnimals(prev => prev.filter(animal => !ids.includes(animal.id)));

//       toast.success(`${ids.length} animals deleted successfully!`);
//     } catch (error) {
//       toast.error("Failed to delete animals");
//     }
//   };

//   const handleExport = () => {
//     // CSV Export - Updated to match new columns
//     const csvContent = [
//       ["Animal ID", "Ear Tag", "Animal Type", "Breed", "Pregnancy Status", "Weight", "Milk/Day", "Commission Agent", "Status", "Created Date"],
//       ...filteredAnimals.map(a => [
//         a.uid, 
//         a.earTagId, 
//         a.animalType, 
//         a.breed, 
//         a.pregnancyStatus,
//         a.weight,
//         a.milkPerDay,
//         a.commissionAgentName,
//         a.status,
//         new Date(a.createdAt).toLocaleString()
//       ])
//     ].map(row => row.join(",")).join("\n");

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `animals-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();

//     toast.success("Animals data exported successfully!");
//   };

//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Animals Registration Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             table { border-collapse: collapse; width: 100%; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
//             th { background-color: #f3f4f6; font-weight: bold; }
//             .header { text-align: center; margin-bottom: 30px; }
//             .stats { display: flex; justify-content: space-between; margin-bottom: 20px; }
//             .stat-box { background: #f8fafc; padding: 15px; border-radius: 8px; width: 23%; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Animals Registration Report</h1>
//             <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
//           </div>

//           <div class="stats">
//             <div class="stat-box"><strong>Total Animals:</strong> ${stats.totalAnimals}</div>
//             <div class="stat-box"><strong>Total Value:</strong> ₹${stats.totalValue.toLocaleString()}</div>
//             <div class="stat-box"><strong>Milking Animals:</strong> ${stats.milkingAnimals}</div>
//             <div class="stat-box"><strong>Pregnant Animals:</strong> ${stats.pregnantAnimals}</div>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>Animal ID</th>
//                 <th>Ear Tag</th>
//                 <th>Type</th>
//                 <th>Breed</th>
//                 <th>Pregnancy Status</th>
//                 <th>Weight</th>
//                 <th>Milk/Day</th>
//                 <th>Commission Agent</th>
//                 <th>Created Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${filteredAnimals.map(animal => `
//                 <tr>
//                   <td>${animal.uid}</td>
//                   <td>${animal.earTagId}</td>
//                   <td>${animal.animalType}</td>
//                   <td>${animal.breed}</td>
//                   <td>${animal.pregnancyStatus}</td>
//                   <td>${animal.weight}</td>
//                   <td>${animal.milkPerDay}</td>
//                   <td>${new Date(animal.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
//             <p>Report generated by Animal Management System</p>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();

//     toast.success("Printing animals report...");
//   };

//   const handleRefresh = () => {
//     toast.success("Refreshing animals data...");
//     fetchAnimals();
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Animal Details</h1>
//           <p className="text-gray-600">View and manage all registered animals</p>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="text-right">
//             <p className="text-sm text-gray-500">Last sync</p>
//             <p className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
//           </div>
//           <button 
//             onClick={handleRefresh}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
//           >
//             <span>Refresh</span>
//             <ArrowRight size={16} />
//           </button>
//           <button 
//             onClick={handleAddNew}
//             className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center space-x-2"
//           >
//             <Beef size={16} />
//             <span>Register New Animal</span>
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-start justify-between">
//             <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
//               <Beef className="text-blue-600" size={24} />
//             </div>
//             <div className="flex items-center text-sm text-green-600">
//               <TrendingUp size={16} />
//               <span className="ml-1">+15%</span>
//             </div>
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.totalAnimals}</h3>
//           <p className="text-gray-600">Total Animals</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-start justify-between">
//             <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
//               <IndianRupee className="text-green-600" size={24} />
//             </div>
//             <div className="flex items-center text-sm text-green-600">
//               <TrendingUp size={16} />
//               <span className="ml-1">+22%</span>
//             </div>
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mt-4">{formatCurrency(stats.totalValue)}</h3>
//           <p className="text-gray-600">Total Value</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-start justify-between">
//             <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
//               <Milk className="text-purple-600" size={24} />
//             </div>
//             <div className="flex items-center text-sm text-green-600">
//               <TrendingUp size={16} />
//               <span className="ml-1">+8%</span>
//             </div>
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.milkingAnimals}</h3>
//           <p className="text-gray-600">Milking Animals</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-start justify-between">
//             <div className="p-3 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100">
//               <HeartPulse className="text-pink-600" size={24} />
//             </div>
//             <div className="flex items-center text-sm text-green-600">
//               <TrendingUp size={16} />
//               <span className="ml-1">+12%</span>
//             </div>
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.pregnantAnimals}</h3>
//           <p className="text-gray-600">Pregnant Animals</p>
//         </div>
//       </div>

//       {/* Filter Section */}
//       <FilterSection
//         filterConfig={filterConfig}
//         onApplyFilters={applyFilters}
//         onClearFilters={clearFilters}
//         onExport={handleExport}
//         onPrint={handlePrint}
//         onBulkDelete={() => handleBulkDelete(Array.from(new Set()))}
//         selectedCount={0}
//         initialFilters={filters}
//         searchPlaceholder="Search by Animal ID, Ear Tag, Vendor, Type, Breed..."
//         enableSearch={true}
//         enableExport={true}
//         enablePrint={true}
//         enableBulkDelete={true}
//       />

//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={filteredAnimals}
//         loading={loading}
//         onEdit={handleEdit}
//         onView={handleView}
//         onDelete={handleDelete}
//         onBulkDelete={handleBulkDelete}
//         addButtonLabel="Register New Animal"
//         onAdd={handleAddNew}
//         emptyStateMessage="No animals found. Try adjusting your filters or register new animals."
//         loadingMessage="Loading animals data..."
//         enableSelection={true}
//         enableExport={true}
//         enablePrint={true}
//         enablePagination={true}
//         enableBulkDelete={true}
//       />
//     </div>
//   );
// };

// export default AnimalsList;

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Milk,
  Scale,
  Circle,
  GitCompare,
  Package,
  Users,
  Building,
  MapPin,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Minus,
  BeefIcon
} from "lucide-react";
import { BiSearch } from 'react-icons/bi';
import { FaDownload, FaPrint } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { HiOutlineTrash } from 'react-icons/hi';
import DataTable from "../../../components/common/Table/DataTable";
import { GiCow } from "react-icons/gi";

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
  {
    id: 8,
    uid: "ANM008",
    earTagId: "TAG-008",
    vendorName: "Priya Sharma",
    vendorMobile: "9876543217",
    animalType: "Cow",
    breed: "Gir",
    pricing: "₹75,000",
    pregnancyStatus: "Milking",
    calfTagId: "",
    numberOfPregnancies: 2,
    ageYears: 4,
    ageMonths: 6,
    weight: "420 kg",
    milkPerDay: "14 liters",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-02-01T09:30:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: false,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
  {
    id: 9,
    uid: "ANM009",
    earTagId: "TAG-009",
    vendorName: "Amit Patel",
    vendorMobile: "9876543218",
    animalType: "Buffalo",
    breed: "Jaffarabadi",
    pricing: "₹1,10,000",
    pregnancyStatus: "Milking",
    calfTagId: "",
    numberOfPregnancies: 3,
    ageYears: 5,
    ageMonths: 0,
    weight: "600 kg",
    milkPerDay: "8 liters",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-02-05T11:45:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: false,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
  {
    id: 10,
    uid: "ANM010",
    earTagId: "TAG-010",
    vendorName: "Sunita Devi",
    vendorMobile: "9876543219",
    animalType: "Goat",
    breed: "Jamunapari",
    pricing: "₹15,000",
    pregnancyStatus: "Pregnant",
    calfTagId: "",
    numberOfPregnancies: 1,
    ageYears: 2,
    ageMonths: 0,
    weight: "40 kg",
    milkPerDay: "3 liters",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-02-08T14:20:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: false,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
  {
    id: 11,
    uid: "ANM011",
    earTagId: "TAG-011",
    vendorName: "Karan Singh",
    vendorMobile: "9876543220",
    animalType: "Cow",
    breed: "Sahiwal",
    pricing: "₹80,000",
    pregnancyStatus: "Non-Pregnant",
    calfTagId: "",
    numberOfPregnancies: 0,
    ageYears: 3,
    ageMonths: 6,
    weight: "380 kg",
    milkPerDay: "10 liters",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-02-10T10:15:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: false,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
  {
    id: 12,
    uid: "ANM012",
    earTagId: "TAG-012",
    vendorName: "Meera Reddy",
    vendorMobile: "9876543221",
    animalType: "Buffalo",
    breed: "Nagpuri",
    pricing: "₹88,000",
    pregnancyStatus: "Milking",
    calfTagId: "",
    numberOfPregnancies: 2,
    ageYears: 4,
    ageMonths: 2,
    weight: "520 kg",
    milkPerDay: "9 liters",
    calfAgeYears: "",
    calfAgeMonths: "",
    createdAt: "2024-02-12T16:00:00Z",
    hasFrontPhoto: true,
    hasSidePhoto: true,
    hasBackPhoto: true,
    hasAnimalVideo: false,
    hasCalfPhoto: false,
    hasCalfVideo: false
  },
];

const AnimalsList = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);

  // Search state - separate input and debounced term
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter UI state
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Selection state
  const [selectedAnimals, setSelectedAnimals] = useState(new Set());

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  });

  const [stats, setStats] = useState({
    totalAnimals: 0,
    numberOfBreeds: 0,
    milkingAnimals: 0,
    pregnantAnimals: 0,
  });

  // Initialize tempFilters when component mounts
  useEffect(() => {
    setTempFilters(filters);

    // Check if any filters are applied
    const hasAppliedFilters = Object.keys(filters).some(key => filters[key] !== "");
    setIsFilterApplied(hasAppliedFilters);
    setAppliedFilters(filters);
  }, [filters]);

  // Fetch animals with simulated API call
  const fetchAnimals = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Calculate unique breeds count
      const uniqueBreeds = new Set(MOCK_ANIMALS.map(a => a.breed));

      const milkingCount = MOCK_ANIMALS.filter(a => a.pregnancyStatus === "Milking").length;
      const pregnantCount = MOCK_ANIMALS.filter(a => a.pregnancyStatus === "Pregnant").length;

      setStats({
        totalAnimals: MOCK_ANIMALS.length,
        numberOfBreeds: uniqueBreeds.size,
        milkingAnimals: milkingCount,
        pregnantAnimals: pregnantCount,
      });

      setAnimals(MOCK_ANIMALS);
      setFilteredAnimals(MOCK_ANIMALS);

      setPagination(prev => ({
        ...prev,
        totalRecords: MOCK_ANIMALS.length,
        totalPages: Math.ceil(MOCK_ANIMALS.length / prev.limit)
      }));

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
    let filtered = [...MOCK_ANIMALS];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(animal =>
        animal.earTagId.toLowerCase().includes(searchLower) ||
        animal.uid.toLowerCase().includes(searchLower) ||
        animal.vendorName.toLowerCase().includes(searchLower) ||
        animal.animalType.toLowerCase().includes(searchLower) ||
        animal.breed.toLowerCase().includes(searchLower)
      );
    }

    // Apply animal type filter
    if (filterValues.animalType) {
      filtered = filtered.filter(animal => animal.animalType === filterValues.animalType);
    }

    // Apply pregnancy status filter
    if (filterValues.pregnancyStatus) {
      filtered = filtered.filter(animal => animal.pregnancyStatus === filterValues.pregnancyStatus);
    }

    // Apply date range filter
    if (filterValues.fromDate || filterValues.toDate) {
      filtered = filtered.filter(animal => {
        const animalDate = new Date(animal.createdAt);

        if (filterValues.fromDate) {
          const fromDate = new Date(filterValues.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (animalDate < fromDate) return false;
        }

        if (filterValues.toDate) {
          const toDate = new Date(filterValues.toDate);
          toDate.setHours(23, 59, 59, 999);
          if (animalDate > toDate) return false;
        }

        return true;
      });
    }

    setFilteredAnimals(filtered);

    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalRecords: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.limit)
    }));

  }, [searchTerm]);

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
      animalType: "",
      pregnancyStatus: "",
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
  const requestSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key: null, direction: null };
    });
  }, []);

  // Apply sorting to data
  const sortedAnimals = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredAnimals;

    return [...filteredAnimals].sort((a, b) => {
      const key = sortConfig.key;
      let aValue = a[key] ?? "";
      let bValue = b[key] ?? "";

      if (key === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (key === 'weight' || key === 'milkPerDay') {
        aValue = parseInt(String(aValue).replace(/[^0-9]/g, '')) || 0;
        bValue = parseInt(String(bValue).replace(/[^0-9]/g, '')) || 0;
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAnimals, sortConfig]);

  // Get sort icon
  const getSortIcon = useCallback(
    (key) => {
      if (sortConfig.key !== key || !sortConfig.direction) {
        return <Minus className="ml-1 text-gray-400" size={16} />;
      }

      if (sortConfig.direction === "asc") {
        return <ChevronUp className="ml-1 text-gray-600" size={16} />;
      } else {
        return <ChevronDown className="ml-1 text-gray-600" size={16} />;
      }
    },
    [sortConfig]
  );

  // Get pregnancy status badge
  const getPregnancyBadge = (status) => {
    switch (status?.toLowerCase()) {
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
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100">Unknown</span>
        );
    }
  }, []);

  // Table columns for animals
  // Table columns for animals - Simplified version
  const columns = useMemo(() => [
    {
      key: "uid",
      label: "Animal ID",
      sortable: true,
      onSort: () => requestSort('uid'),
      sortIcon: getSortIcon('uid'),
      render: (item) => (
        <div className="font-medium text-gray-900">{item.uid}</div>
      )
    },
    {
      key: "earTagId",
      label: "Ear Tag ID",
      sortable: true,
      onSort: () => requestSort('earTagId'),
      sortIcon: getSortIcon('earTagId'),
      render: (item) => (
        <div className="text-gray-900">{item.earTagId}</div>
      )
    },
    {
      key: "animalType",
      label: "Type",
      sortable: true,
      onSort: () => requestSort('animalType'),
      sortIcon: getSortIcon('animalType'),
      render: (item) => (
        <div className="text-gray-900">{item.animalType}</div>
      )
    },
    {
      key: "breed",
      label: "Breed",
      sortable: true,
      onSort: () => requestSort('breed'),
      sortIcon: getSortIcon('breed'),
      render: (item) => (
        <div>
          {getPregnancyBadge(item.pregnancyStatus)}
          {item.calfTagId && (
            <div className="text-xs text-gray-500 mt-1">Calf: {item.calfTagId}</div>
          )}
        </div>
        <div className="text-gray-900">{item.breed}</div>
      )
    },
    { 
      key: "physicalAttributes", 
      label: "Physical",
    {
      key: "pregnancyStatus",
      label: "Pregnancy",
      sortable: true,
      onSort: () => requestSort('pregnancyStatus'),
      sortIcon: getSortIcon('pregnancyStatus'),
      render: (item) => (
        <div>
          <div className="text-sm">{item.weight}</div>
          {item.milkPerDay && item.milkPerDay !== "N/A" && (
            <div className="text-xs text-gray-500">{item.milkPerDay} milk/day</div>
          )}
          {getPregnancyBadge(item.pregnancyStatus)}
        </div>
      )
    },
    { 
      key: "createdAt", 
      label: "Registered",
    {
      key: "createdAt",
      label: "Created Date",
      sortable: true,
      onSort: () => requestSort('createdAt'),
      sortIcon: getSortIcon('createdAt'),
      render: (item) => {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString('en-US', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
        return (
          <div className="text-gray-900">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        );
      }
    },
  ], [getPregnancyBadge]);
  ], [getSortIcon, requestSort]);

  // Selection handlers
  const toggleSelectAnimal = (id) => {
    if (!id) return;
    setSelectedAnimals((prev) => {
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
    const allIds = filteredAnimals.map(animal => animal.id).filter(Boolean);
    if (selectedAnimals.size === allIds.length && allIds.length > 0) {
      setSelectedAnimals(new Set());
    } else {
      setSelectedAnimals(new Set(allIds));
    }
  };

    // Event handlers
  const handleAddNew = () => {
    navigate("/procurement/animal-registration");
  };

  const handleEdit = (animal) => {
    navigate(`/management/edit-animal/${animal.uid}`, { state: { animal } });
  };

  const handleView = (animal) => {
    navigate(`/management/animal-details/${animal.uid}`, {
      state: { animal }
    });
  };

  const handleDelete = (id) => {
    const animal = animals.find(a => a.id === id);
    if (!animal) {
      toast.error("Cannot delete animal: Invalid animal ID");
      return;
    }
    setDeleteTarget("single");
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = (ids) => {
    if (!ids || ids.size === 0) {
      toast.error("Please select animals to delete");
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

      if (deleteTarget === "selected") {
        // Simulate API call for bulk delete
        await new Promise(resolve => setTimeout(resolve, 800));

        // Remove from local state
        const idsToDelete = deleteId;
        setAnimals(prev => prev.filter(animal => !idsToDelete.includes(animal.id)));
        setFilteredAnimals(prev => prev.filter(animal => !idsToDelete.includes(animal.id)));

        // Clear selection
        setSelectedAnimals(new Set());

        // Update stats after deletion
        const remainingAnimals = animals.filter(animal => !idsToDelete.includes(animal.id));
        const uniqueBreeds = new Set(remainingAnimals.map(a => a.breed));

        setStats(prev => ({
          ...prev,
          totalAnimals: remainingAnimals.length,
          numberOfBreeds: uniqueBreeds.size,
          milkingAnimals: remainingAnimals.filter(a => a.pregnancyStatus === "Milking").length,
          pregnantAnimals: remainingAnimals.filter(a => a.pregnancyStatus === "Pregnant").length,
        }));

        // Update pagination
        setPagination(prev => ({
          ...prev,
          totalRecords: filteredAnimals.length - idsToDelete.length,
          totalPages: Math.ceil((filteredAnimals.length - idsToDelete.length) / prev.limit)
        }));

        toast.success(`${idsToDelete.length} animal(s) deleted successfully!`);

      } else if (deleteTarget === "single" && deleteId) {
        // Simulate API call for single delete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Remove from local state
        setAnimals(prev => prev.filter(animal => animal.id !== deleteId));
        setFilteredAnimals(prev => prev.filter(animal => animal.id !== deleteId));

        // Remove from selection if present
        setSelectedAnimals((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deleteId);
          return newSet;
        });

        // Update stats after deletion
        const remainingAnimals = animals.filter(animal => animal.id !== deleteId);
        const uniqueBreeds = new Set(remainingAnimals.map(a => a.breed));

        setStats(prev => ({
          ...prev,
          totalAnimals: remainingAnimals.length,
          numberOfBreeds: uniqueBreeds.size,
          milkingAnimals: remainingAnimals.filter(a => a.pregnancyStatus === "Milking").length,
          pregnantAnimals: remainingAnimals.filter(a => a.pregnancyStatus === "Pregnant").length,
        }));

        // Update pagination
        setPagination(prev => ({
          ...prev,
          totalRecords: filteredAnimals.length - 1,
          totalPages: Math.ceil((filteredAnimals.length - 1) / prev.limit)
        }));

        toast.success("Animal deleted successfully!");
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("Failed to delete animal");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteId(null);
      setIsDeleting(false);
      setLoading(false);
    }
  };

  const handleExport = () => {
    // CSV Export - Updated to match new columns
    const csvContent = [
      ["Animal ID", "Ear Tag", "Animal Type", "Breed", "Pregnancy Status", "Weight", "Milk/Day", "Created Date"],
      ...filteredAnimals.map(a => [
        a.uid,
        a.earTagId,
        a.animalType,
        a.breed,
        a.pregnancyStatus,
        a.weight,
        a.milkPerDay,
        new Date(a.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

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
            ${searchTerm ? '.search-info { color: #666; font-style: italic; margin-top: 10px; }' : ''}
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Animals Registration Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            ${searchTerm ? `<p class="search-info">Search: "${searchTerm}" - ${filteredAnimals.length} results found</p>` : ''}
          </div>
          
          <div class="stats">
            <div class="stat-box"><strong>Total Animals:</strong> ${stats.totalAnimals}</div>
            <div class="stat-box"><strong>Number of Breeds:</strong> ${stats.numberOfBreeds}</div>
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

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (newLimit) => {
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

  // Get unique animal types for filter dropdown
  const uniqueAnimalTypes = useMemo(() => {
    const types = [...new Set(MOCK_ANIMALS.map(a => a.animalType))];
    return types.sort();
  }, []);

  const totalDisplayedRecords = filteredAnimals.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Animal Details</h1>
          <p className="text-gray-600">View and manage all registered animals</p>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Animals */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <GiCow className="text-blue-500 opacity-60" size={40} />
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalAnimals}</h3>
              <p className="text-gray-600">Total Animals</p>
            </div>
          </div>
        </div>

        {/* Number of Breeds */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <BeefIcon className="text-green-500 opacity-60" size={40} />
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900">{stats.numberOfBreeds}</h3>
              <p className="text-gray-600">Number of Breeds</p>
            </div>
          </div>
        </div>

        {/* Milking Animals */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <Milk className="text-purple-500 opacity-60" size={40} />
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900">{stats.milkingAnimals}</h3>
              <p className="text-gray-600">Milking Animals</p>
            </div>
          </div>
        </div>

        {/* Pregnant Animals */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <HeartPulse className="text-pink-500 opacity-60" size={40} />
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900">{stats.pregnantAnimals}</h3>
              <p className="text-gray-600">Pregnant Animals</p>
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
                placeholder="Search by Animal ID, Ear Tag, Vendor, Type, Breed..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm bg-gray-50/50"
                value={searchInput}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {filteredAnimals.length} found
                  </span>
                </div>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 text-sm transition-all justify-center md:justify-start ${showFilters
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
            {selectedAnimals.size > 0 && (
              <button
                onClick={() => handleBulkDelete(selectedAnimals)}
                className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
              >
                <MdDelete className="w-4 h-4" />
                Delete ({selectedAnimals.size})
              </button>
            )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Animal Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal Type
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  value={tempFilters.animalType || ""}
                  onChange={(e) => handleFilterChange("animalType", e.target.value)}
                >
                  <option value="">All Types</option>
                  {uniqueAnimalTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Pregnancy Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pregnancy Status
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  value={tempFilters.pregnancyStatus || ""}
                  onChange={(e) => handleFilterChange("pregnancyStatus", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Milking">Milking</option>
                  <option value="Pregnant">Pregnant</option>
                  <option value="Non-Pregnant">Non-Pregnant</option>
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedAnimals}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        addButtonLabel="Register New Animal"
        emptyStateMessage="No animals found. Try adjusting your filters or register new animals."
        loadingMessage="Loading animals data..."
        enableSelection={true}
        enablePagination={true}
        selectedRows={selectedAnimals}
        onSelectRow={toggleSelectAnimal}
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
                  ? `You're about to delete ${deleteId?.length || 0} selected animal(s). This action cannot be undone.`
                  : "You're about to delete this animal. This action cannot be undone."}
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

export default AnimalsList;