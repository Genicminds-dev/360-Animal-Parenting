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
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilters, setTempFilters] = useState(initialFilters);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  
  const searchTimeoutRef = useRef(null);

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

  // Search debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (onApplyFilters) {
        onApplyFilters({ search: searchTerm, ...tempFilters });
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, tempFilters, onApplyFilters]);

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({ search: searchTerm, ...tempFilters });
    }
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
    
    if (onClearFilters) {
      onClearFilters();
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                      setTempFilters(prev => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
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
                      setTempFilters(prev => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
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
                        setTempFilters(prev => ({
                          ...prev,
                          fromDate: e.target.value,
                        }))
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
                        setTempFilters(prev => ({
                          ...prev,
                          toDate: e.target.value,
                        }))
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
                  {(tempFilters.status ||
                    tempFilters.state ||
                    tempFilters.fromDate ||
                    tempFilters.toDate) && (
                    <span className="text-blue-700 text-xs">
                      {tempFilters.status && `Status: ${tempFilters.status}`}
                      {tempFilters.state &&
                        `${tempFilters.status ? ", " : ""}State: ${tempFilters.state
                        }`}
                      {(tempFilters.fromDate || tempFilters.toDate) &&
                        `${tempFilters.status || tempFilters.state ? ", " : ""
                        }Date: ${tempFilters.fromDate || "Beginning"} to ${tempFilters.toDate || "Current"
                        }`}
                    </span>
                  )}
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