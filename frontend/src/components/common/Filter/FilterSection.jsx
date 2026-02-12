import { useState, useEffect, useRef } from "react";
import { Filter, X, Calendar, Download, Printer } from "lucide-react";
import { BiSearch } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const FilterSection = ({
  // Configuration
  filterConfig = {
    fields: [],
    dateRange: false,
  },
  
  // Callbacks
  onApplyFilters,
  onFilterChange, // Add this prop
  onClearFilters,
  onExport,
  onPrint,
  onBulkDelete,
  
  // State
  initialFilters = {},
  selectedCount = 0,
  searchPlaceholder = "Search...",
  
  // Options
  enableSearch = true,
  enableFilters = true,
  enableExport = true,
  enablePrint = true,
  enableBulkDelete = true,
  autoApply = false, // Add this prop with default false
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilters, setTempFilters] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  
  const searchTimeoutRef = useRef(null);

  // Initialize filters from initialFilters
  useEffect(() => {
    const initialFilterState = { ...initialFilters };
    
    // Ensure all fields have default values
    filterConfig.fields.forEach(field => {
      if (!(field.key in initialFilterState)) {
        initialFilterState[field.key] = "";
      }
    });
    
    if (filterConfig.dateRange) {
      if (!('fromDate' in initialFilterState)) initialFilterState.fromDate = "";
      if (!('toDate' in initialFilterState)) initialFilterState.toDate = "";
    }
    
    setTempFilters(initialFilterState);
    setSearchTerm(initialFilters.search || "");
    setAppliedFilters(initialFilters);
    
    // Check if any filters are applied
    const hasAppliedFilters = Object.keys(initialFilters).length > 0 && 
      !(Object.keys(initialFilters).length === 1 && 'search' in initialFilters && !initialFilters.search);
    setIsFilterApplied(hasAppliedFilters);
  }, [filterConfig, initialFilters]);

  // Handle search with debounce - only auto-apply if autoApply is true
  useEffect(() => {
    if (autoApply) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (onApplyFilters) {
          const filtersToApply = { search: searchTerm, ...tempFilters };
          onApplyFilters(filtersToApply);
          setAppliedFilters(filtersToApply);
        }
      }, 500);

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }
  }, [searchTerm, tempFilters, onApplyFilters, autoApply]);

  // Handle filter changes - notify parent without applying
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...tempFilters, [key]: value };
    setTempFilters(updatedFilters);
    
    // Call onFilterChange if provided (for non-auto-apply mode)
    if (onFilterChange) {
      onFilterChange({ search: searchTerm, ...updatedFilters });
    }
  };

  const handleApplyFilters = () => {
    const filtersToApply = { search: searchTerm, ...tempFilters };
    
    // Remove empty filters
    Object.keys(filtersToApply).forEach(key => {
      if (filtersToApply[key] === "" || filtersToApply[key] === null || filtersToApply[key] === undefined) {
        delete filtersToApply[key];
      }
    });
    
    if (onApplyFilters) {
      onApplyFilters(filtersToApply);
    }
    setAppliedFilters(filtersToApply);
    setIsFilterApplied(true);
    setShowFilters(false);
  };

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
    setIsFilterApplied(false);
    setAppliedFilters({});
    
    if (onClearFilters) {
      onClearFilters();
    }
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (onFilterChange) {
                    onFilterChange({ search: e.target.value, ...tempFilters });
                  }
                  // Auto-apply search only if autoApply is true
                  if (autoApply && onApplyFilters) {
                    if (searchTimeoutRef.current) {
                      clearTimeout(searchTimeoutRef.current);
                    }
                    searchTimeoutRef.current = setTimeout(() => {
                      onApplyFilters({ search: e.target.value, ...tempFilters });
                    }, 500);
                  }
                }}
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
          {enableBulkDelete && selectedCount > 0 && onBulkDelete && (
            <button
              onClick={onBulkDelete}
              className="px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
            >
              <MdDelete className="w-4 h-4" />
              Delete ({selectedCount})
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
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
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
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
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
                      onChange={(e) =>
                        handleFilterChange("fromDate", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFilterChange("toDate", e.target.value)
                      }
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
    </div>
  );
};

export default FilterSection;