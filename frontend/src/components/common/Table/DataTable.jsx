// components/common/Table/DataTable.jsx
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  FaSort,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  Search,
  Stethoscope,
} from "lucide-react";

const DataTable = ({
  // Table data
  columns,
  data,
  loading,

  // Pagination
  itemsPerPageOptions = [5, 10, 20, 30],
  enablePagination = true,

  // Features
  enableSelection = true,
  onSelectionChange, // CRITICAL: This prop is required for parent to get selected items

  // Callbacks
  onAdd,
  onEdit,
  onView,
  onDelete,
  onBulkDelete,
  onHealthCheck,
  onHealthCheck,

  // Customization
  addButtonLabel = "Add New",
  emptyStateMessage = "No data found",
  loadingMessage = "Loading...",

  // Custom renderers
  renderCell,
  renderActions,
  renderEmptyState,

  // Health Check specific props
  enableHealthCheck = false,
  healthCheckLabel,
  
  // Props for external selection management
  selectedRows,
  onSelectRow,
  onSelectAll,

  // Hide add button
  hideAddButton = false,

}) => {
  // State management
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1] || 10);
  const [sortConfig, setSortConfig] = useState({
    key: columns[0]?.key || "id",
    direction: "asc",
  });
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);

  // Define toggle functions before they are used
  const toggleSelectItem = (id) => {
    setSelectedItems(prev => {
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
    const allIds = filteredData.map(item => item.id);
    if (selectedItems.size === allIds.length && allIds.length > 0) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allIds));
    }
  };

  // Use external selection state if provided, otherwise use internal
  const effectiveSelectedItems = selectedRows || selectedItems;
  const effectiveOnSelectRow = onSelectRow || toggleSelectItem;
  const effectiveOnSelectAll = onSelectAll || toggleSelectAll;

  // Filter data - just pass through since filtering is done externally
  const filteredData = useMemo(() => {
    return data;
  }, [data]);

  // CRITICAL: Sync selected items with parent component whenever they change
  useEffect(() => {
    if (onSelectionChange) {
      const selectedArray = Array.from(selectedItems);
      onSelectionChange(selectedArray);
    }
  }, [selectedItems, onSelectionChange]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
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

      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [data, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, enablePagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // CRITICAL: Get item ID - handles both id and uid
  const getItemId = (item) => {
    return item.id || item.uid;
  };

  // CRITICAL: Toggle single item selection
  const toggleSelectItem = (item) => {
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
  };

  // CRITICAL: Toggle select all - FIXED to work with current page data
  const toggleSelectAll = () => {
    // Get all IDs from CURRENT PAGE data (not all data)
    const currentPageIds = paginatedData.map(item => getItemId(item)).filter(Boolean);
    
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      
      // Check if all items on current page are selected
      const allSelected = currentPageIds.every(id => prev.has(id));
      
      if (allSelected) {
        // Deselect all items on current page
        currentPageIds.forEach(id => newSet.delete(id));
      } else {
        // Select all items on current page
        currentPageIds.forEach(id => newSet.add(id));
      }
      
      return newSet;
    });
  };

  // Check if all items on current page are selected
  const isAllSelected = useMemo(() => {
    if (paginatedData.length === 0) return false;
    const currentPageIds = paginatedData.map(item => getItemId(item));
    return currentPageIds.every(id => selectedItems.has(id));
  }, [paginatedData, selectedItems]);

  // Check if some items are selected (for indeterminate state)
  const isIndeterminate = useMemo(() => {
    if (paginatedData.length === 0) return false;
    const currentPageIds = paginatedData.map(item => getItemId(item));
    const selectedCount = currentPageIds.filter(id => selectedItems.has(id)).length;
    return selectedCount > 0 && selectedCount < currentPageIds.length;
  }, [paginatedData, selectedItems]);

  // Handlers
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

  // Default renderers
  const defaultRenderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key] || "N/A";
  };

  // Default actions renderer
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
          onClick={() => onDelete(item.id)}
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
          <FaPlus size={14} />
          {addButtonLabel}
        </button>
      )}
    </div>
  );

  // Determine if we should show actions column
  const showActionsColumn = onView || onEdit || onDelete || enableHealthCheck;

  return (
    <>
      <Toaster position="top-center" />

      {/* Add Button - Only if not hidden */}
      {!hideAddButton && onAdd && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>{addButtonLabel}</span>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {enableSelection && (
                  <th className="w-12 px-4 py-3 border-r border-gray-100 text-center">
                    <input
                      type="checkbox"
                      checked={effectiveSelectedItems.size === filteredData.length && filteredData.length > 0}
                      onChange={effectiveOnSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
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
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className={`hover:bg-gray-50/50 transition-colors ${effectiveSelectedItems.has(item.id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                  >
                    {enableSelection && (
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-center">
                        <input
                          type="checkbox"
                          checked={effectiveSelectedItems.has(item.id)}
                          onChange={() => effectiveOnSelectRow(item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
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
                ))
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
    </>
  );
};

export default DataTable;