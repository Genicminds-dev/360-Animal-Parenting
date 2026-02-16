// components/common/Table/TableWithFilter.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Filter,
  X,
  Calendar,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  Search,
  Stethoscope,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { BiSearch } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaSort } from "react-icons/fa";

const TableWithFilter = ({
  // Core props
  title,
  description,
  data = [],
  loading = false,
  
  // Table configuration
  columns = [],
  idField = "id",
  uidField = "uid",
  
  // Filter configuration
  filterConfig = {
    fields: [],
    dateRange: false,
  },
  
  // Stats configuration
  stats = [],
  statsCards = null, // Custom stats cards component
  
  // Callbacks
  onAdd,
  onEdit,
  onView,
  onDelete,
  onBulkDelete,
  onHealthCheck,
  onRefresh,
  onExport,
  onPrint,
  
  // Button labels
  addButtonLabel = "Add New",
  healthCheckLabel = "Health Check",
  
  // Placeholders
  searchPlaceholder = "Search...",
  emptyStateMessage = "No data found",
  loadingMessage = "Loading...",
  
  // Options
  enableSearch = true,
  enableFilters = true,
  enableExport = true,
  enablePrint = true,
  enableBulkDelete = true,
  enableSelection = true,
  enablePagination = true,
  enableHealthCheck = false,
  enableStats = true,
  autoApply = true, // Changed default to false
  
  // Pagination
  itemsPerPageOptions = [5, 10, 20, 30, 50, 100],
  
  // Custom renderers
  renderCell,
  renderActions,
  renderEmptyState,
  renderStats,
}) => {
  const navigate = useNavigate();
  
  // ============ FILTER STATE ============
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilters, setTempFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  
  // ============ TABLE STATE ============
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1] || 10);
  const [sortConfig, setSortConfig] = useState({
    key: columns[0]?.key || idField,
    direction: "asc",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);
  
  // ============ FILTERED DATA ============
  const [filteredData, setFilteredData] = useState(data);
  
  // Update filtered data when original data changes
  useEffect(() => {
    applyFiltersToData(appliedFilters, data);
  }, [data]);
  
  // ============ FILTER FUNCTIONS ============
  
  // Initialize filters
  useEffect(() => {
    const initialFilterState = {};
    
    filterConfig.fields.forEach(field => {
      initialFilterState[field.key] = "";
    });
    
    if (filterConfig.dateRange) {
      initialFilterState.fromDate = "";
      initialFilterState.toDate = "";
    }
    
    setTempFilters(initialFilterState);
  }, [filterConfig]);

  useEffect(() => {
    return () => {
        if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        }
    };
    }, []);
  
  // Apply filters to data
  const applyFiltersToData = useCallback((filters, sourceData) => {
    let filtered = [...sourceData];
    
    // Apply search filter
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(item => {
        // Search across common fields
        return Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm)
        );
      });
    }
    
    // Apply field filters
    filterConfig.fields.forEach(field => {
      if (filters[field.key]) {
        filtered = filtered.filter(item => 
          item[field.key] === filters[field.key]
        );
      }
    });
    
    // Apply date range filter
    if (filterConfig.dateRange) {
      if (filters.fromDate || filters.toDate) {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.createdAt || item.date || item.updatedAt);
          
          if (filters.fromDate) {
            const fromDate = new Date(filters.fromDate);
            fromDate.setHours(0, 0, 0, 0);
            if (itemDate < fromDate) return false;
          }
          
          if (filters.toDate) {
            const toDate = new Date(filters.toDate);
            toDate.setHours(23, 59, 59, 999);
            if (itemDate > toDate) return false;
          }
          
          return true;
        });
      }
    }
    
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
    return filtered;
  }, [filterConfig]);
  
  // Handle filter changes (now only updates temp state, doesn't apply)
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...tempFilters, [key]: value };
    setTempFilters(updatedFilters);
  };
  
  // Handle search change (now only updates temp state, doesn't apply)
const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);
  
  // If autoApply is true, apply filters with debounce
  if (autoApply) {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout to apply filters after typing stops
    searchTimeoutRef.current = setTimeout(() => {
      const filtersToApply = { 
        search: value, 
        ...tempFilters 
      };
      
      // Remove empty values
      Object.keys(filtersToApply).forEach(key => {
        if (filtersToApply[key] === "" || filtersToApply[key] === null || filtersToApply[key] === undefined) {
          delete filtersToApply[key];
        }
      });
      
      setAppliedFilters(filtersToApply);
      applyFiltersToData(filtersToApply, data);
      setIsFilterApplied(Object.keys(filtersToApply).length > 0);
    }, 500); // 500ms debounce
  }
};
  
  // Apply filters - now only called when Apply button is clicked
  const handleApplyFilters = () => {
    const filtersToApply = { 
      search: searchTerm, 
      ...tempFilters 
    };
    
    // Remove empty values
    Object.keys(filtersToApply).forEach(key => {
      if (filtersToApply[key] === "" || filtersToApply[key] === null || filtersToApply[key] === undefined) {
        delete filtersToApply[key];
      }
    });
    
    setAppliedFilters(filtersToApply);
    applyFiltersToData(filtersToApply, data);
    setIsFilterApplied(Object.keys(filtersToApply).length > 0);
    setShowFilters(false);
  };
  
  // Clear filters
  const handleClearFilters = () => {
    const emptyFilters = {};
    filterConfig.fields.forEach(field => {
      emptyFilters[field.key] = "";
    });
    if (filterConfig.dateRange) {
      emptyFilters.fromDate = "";
      emptyFilters.toDate = "";
    }
    
    setTempFilters(emptyFilters);
    setSearchTerm("");
    setAppliedFilters({});
    applyFiltersToData({}, data);
    setIsFilterApplied(false);
    setShowFilters(false);
    setSelectedItems(new Set());
  };
  
  // ============ TABLE FUNCTIONS ============
  
  // Get item ID
  const getItemId = useCallback((item) => {
    return item[idField] || item[uidField];
  }, [idField, uidField]);
  
  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      const aValue = a[key];
      const bValue = b[key];
      
      if (aValue === bValue) return 0;
      if (aValue == null) return 1 * direction;
      if (bValue == null) return -1 * direction;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return (aValue - bValue) * direction;
      }
      
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [filteredData, sortConfig]);
  
  // Pagination
  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, enablePagination]);
  
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  // Selection handlers
  const toggleSelectItem = useCallback((item) => {
    const id = getItemId(item);
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, [getItemId]);
  
  const toggleSelectAll = useCallback(() => {
    const currentPageIds = paginatedData.map(item => getItemId(item)).filter(Boolean);
    
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      const allSelected = currentPageIds.every(id => prev.has(id));
      
      if (allSelected) {
        currentPageIds.forEach(id => newSet.delete(id));
      } else {
        currentPageIds.forEach(id => newSet.add(id));
      }
      
      return newSet;
    });
  }, [paginatedData, getItemId]);
  
  const isAllSelected = useMemo(() => {
    if (paginatedData.length === 0) return false;
    const currentPageIds = paginatedData.map(item => getItemId(item));
    return currentPageIds.every(id => selectedItems.has(id));
  }, [paginatedData, selectedItems, getItemId]);
  
  const isIndeterminate = useMemo(() => {
    if (paginatedData.length === 0) return false;
    const currentPageIds = paginatedData.map(item => getItemId(item));
    const selectedCount = currentPageIds.filter(id => selectedItems.has(id)).length;
    return selectedCount > 0 && selectedCount < currentPageIds.length;
  }, [paginatedData, selectedItems, getItemId]);
  
  // Sort handlers
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" size={14} />;
    return sortConfig.direction === "asc"
      ? <ChevronUp className="ml-1 text-blue-600" size={16} />
      : <ChevronDown className="ml-1 text-blue-600" size={16} />;
  };
  
  // Delete handlers
  const handleDeleteClick = (item) => {
    const id = getItemId(item);
    setDeleteTarget("single");
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  
  const handleBulkDeleteClick = () => {
    if (selectedItems.size === 0) {
      toast.error("Please select items to delete");
      return;
    }
    setDeleteTarget("selected");
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      if (deleteTarget === "selected") {
        if (onBulkDelete) {
          await onBulkDelete(Array.from(selectedItems));
          setSelectedItems(new Set());
        }
      } else if (deleteId && onDelete) {
        await onDelete(deleteId);
      }
      toast.success("Operation completed successfully!");
    } catch (error) {
      toast.error("Operation failed: " + error.message);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteId(null);
    }
  };
  
  // Refresh handler
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    handleClearFilters();
    toast.success("Data refreshed!");
  };
  
  // Default renderers
  const defaultRenderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key] || "N/A";
  };
  
  const defaultRenderActions = (item) => (
    <div className="flex items-center space-x-2">
      {enableHealthCheck && onHealthCheck && (
        <button
          onClick={() => onHealthCheck(item)}
          className="p-2 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 hover:text-indigo-900 flex items-center space-x-2 transition-colors duration-200"
          title={healthCheckLabel}
        >
          <Stethoscope size={14} />
          <span>{healthCheckLabel}</span>
        </button>
      )}
      {onView && (
        <button
          onClick={() => onView(item)}
          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={() => onEdit(item)}
          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
          title="Edit"
        >
          <Edit size={16} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => handleDeleteClick(item)}
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
  
  const defaultRenderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Search className="w-12 h-12 text-gray-300 mb-4" />
      <div className="text-lg font-medium text-gray-500 mb-2">
        {emptyStateMessage}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-2"
        >
          Add New
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
  
  // Updated Stats Cards with the requested design
  const defaultRenderStats = () => {
    if (!stats || stats.length === 0) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          // Get icon color class based on index or custom color
          const getIconColor = () => {
            if (stat.iconColor) return stat.iconColor;
            const colors = ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-pink-500'];
            return colors[index % colors.length];
          };
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between">
                {stat.icon && (
                  <stat.icon className={`${getIconColor()} opacity-60`} size={40} />
                )}
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-600">{stat.title}</p>
                </div>
              </div>
              {stat.trend && (
                <div className="mt-2 flex items-center justify-end text-sm text-green-600">
                  <TrendingUp size={16} />
                  <span className="ml-1">{stat.trend}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };
  
  // Determine if we should show actions column
  const showActionsColumn = onView || onEdit || onDelete || enableHealthCheck;
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      {(title || description || onAdd || onRefresh) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
            {description && <p className="text-gray-600">{description}</p>}
          </div>
          <div className="flex items-center space-x-4">
            {onRefresh && (
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center space-x-2"
              >
                <span>Refresh</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            {onAdd && (
              <button 
                onClick={onAdd}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center space-x-2"
              >
                <span>{addButtonLabel}</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Stats Cards - Updated with new design */}
      {enableStats && (renderStats || defaultRenderStats)()}
      
      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          {/* Left Side: Search and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            {enableSearch && (
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BiSearch className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50/50"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            )}
            
            {/* Filter Toggle Button */}
            {enableFilters && filterConfig.fields.length > 0 && (
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
            )}
          </div>
          
          {/* Right Side: Action Buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
            {/* Bulk Delete Button */}
            {enableBulkDelete && selectedItems.size > 0 && onBulkDelete && (
              <button
                onClick={handleBulkDeleteClick}
                className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
              >
                <MdDelete className="w-4 h-4" />
                Delete ({selectedItems.size})
              </button>
            )}
            
            {/* Export Button */}
            {enableExport && onExport && (
              <button
                onClick={onExport}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            
            {/* Print Button */}
            {enablePrint && onPrint && (
              <button
                onClick={onPrint}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm hover:shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            )}
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && filterConfig.fields.length > 0 && (
          <div className="mb-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filterConfig.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      value={tempFilters[field.key] || ""}
                      onChange={(e) => handleFilterChange(field.key, e.target.value)}
                    >
                      <option value="">All {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      value={tempFilters[field.key] || ""}
                      onChange={(e) => handleFilterChange(field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
              
              {filterConfig.dateRange && (
                <>
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
                </>
              )}
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
                        Object.keys(appliedFilters).filter(k => k !== 'search' && appliedFilters[k]).map(key => {
                          if (key === 'fromDate' || key === 'toDate') {
                            return key === 'fromDate' ? `From: ${appliedFilters[key]}` : `To: ${appliedFilters[key]}`;
                          }
                          return `${key}: ${appliedFilters[key]}`;
                        }).join(', ')}
                      {appliedFilters.search && (
                        <span className="ml-1">Search: "{appliedFilters.search}"</span>
                      )}
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
                  onClick={() => setShowFilters(false)}
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
        
        {/* Active Filters Bar */}
        {isFilterApplied && !showFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Active filters:</span>
            {Object.keys(appliedFilters).map(key => {
            if (key === 'search') return null;
            
            // Find the field label from filterConfig
            const fieldConfig = filterConfig.fields.find(f => f.key === key);
            const fieldLabel = fieldConfig?.label || key;
            
            // Format date range labels
            let displayLabel = fieldLabel;
            if (key === 'fromDate') displayLabel = 'From Date';
            if (key === 'toDate') displayLabel = 'To Date';
            
            return (
                <span key={key} className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-200">
                {displayLabel}: {appliedFilters[key]}
                <button 
                    onClick={() => {
                    const newFilters = { ...appliedFilters };
                    delete newFilters[key];
                    setTempFilters({ ...tempFilters, [key]: "" });
                    setAppliedFilters(newFilters);
                    applyFiltersToData(newFilters, data);
                    setIsFilterApplied(Object.keys(newFilters).length > 0);
                    }}
                    className="ml-1 hover:text-blue-900"
                >
                    <X size={12} />
                </button>
                </span>
            );
            })}
            {appliedFilters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-200">
                Search: "{appliedFilters.search}"
                <button 
                onClick={() => {
                    const newFilters = { ...appliedFilters };
                    delete newFilters.search;
                    setSearchTerm("");
                    setAppliedFilters(newFilters);
                    applyFiltersToData(newFilters, data);
                    setIsFilterApplied(Object.keys(newFilters).length > 0);
                }}
                className="ml-1 hover:text-blue-900"
                >
                <X size={12} />
                </button>
            </span>
            )}
            <button
            onClick={handleClearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
            Clear all
            </button>
        </div>
        )}
      </div>
      
      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {enableSelection && (
                  <th className="w-12 px-4 py-3 border-r border-gray-100 text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        ref={input => {
                          if (input) {
                            input.indeterminate = isIndeterminate;
                          }
                        }}
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 border-r border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors text-left"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
                {showActionsColumn && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (enableSelection ? 1 : 0) + (showActionsColumn ? 1 : 0)} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <div className="text-lg font-medium text-gray-500 mb-2">
                        {loadingMessage}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => {
                  const itemId = getItemId(item);
                  return (
                    <tr
                      key={itemId || idx}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        selectedItems.has(itemId) ? "bg-blue-50/50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      {enableSelection && (
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(itemId)}
                            onChange={() => toggleSelectItem(item)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r border-gray-100"
                        >
                          {(renderCell || defaultRenderCell)(item, col)}
                        </td>
                      ))}
                      {showActionsColumn && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center justify-center">
                            {(renderActions || defaultRenderActions)(item)}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + (enableSelection ? 1 : 0) + (showActionsColumn ? 1 : 0)} className="px-4 py-12 text-center">
                    {(renderEmptyState || defaultRenderEmptyState)()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {enablePagination && sortedData.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <div className="text-center sm:text-left">
                Showing{" "}
                <span className="font-medium text-blue-700">
                  {sortedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-blue-700">
                  {Math.min(currentPage * itemsPerPage, sortedData.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-blue-700">
                  {sortedData.length}
                </span>{" "}
                items
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                    className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[5rem] bg-white"
                  >
                    <span>{itemsPerPage}</span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                  
                  {showItemsPerPageDropdown && (
                    <div className="absolute bottom-full mb-1 left-0 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-200 border-b-0 max-h-48 overflow-y-auto">
                      {itemsPerPageOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setItemsPerPage(option);
                            setShowItemsPerPageDropdown(false);
                            setCurrentPage(1);
                          }}
                          className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors border-b border-gray-200 last:border-b-0 ${
                            itemsPerPage === option
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
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white whitespace-nowrap"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 border rounded-lg min-w-[2.5rem] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-transparent"
                            : "border-gray-300 hover:bg-gray-50 bg-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2 flex items-center text-gray-400">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white whitespace-nowrap"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl mx-2">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-100 rounded-full">
                  <Trash2 className="w-12 h-12 text-red-600" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {deleteTarget === "selected"
                    ? `You're about to delete ${selectedItems.size} selected item(s). This action cannot be undone.`
                    : "You're about to delete this item. This action cannot be undone."}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                    setDeleteId(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableWithFilter;