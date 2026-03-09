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

  // Callbacks
  onAdd,
  onEdit,
  onView,
  onDelete,
  onBulkDelete,
  onAddVaccine,

  // Customization
  addButtonLabel = "Add New",
  emptyStateMessage = "No data found",
  loadingMessage = "Loading...",

  // Custom renderers
  renderCell,
  renderActions,
  renderEmptyState,

  // Health Check specific props
  enableVaccination = false,
  vaccineLabel,

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
    direction: "desc",
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

  // Handlers
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400 dark:text-gray-500" size={14} />;
    return sortConfig.direction === "asc"
      ? <ChevronUp className="ml-1 text-primary-600 dark:text-primary-400" size={16} />
      : <ChevronDown className="ml-1 text-primary-600 dark:text-primary-400" size={16} />;
  };

  // Default renderers
  const defaultRenderCell = (item, column) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(item);
    }

    return value || "N/A";
  };

  // Default actions renderer
  const defaultRenderActions = (item) => (
    <div className="flex items-center space-x-2">
      {enableVaccination && onAddVaccine && (
        <button
          onClick={() => onAddVaccine(item)}
          className="p-2 rounded-md text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 hover:text-indigo-900 dark:hover:text-indigo-200 flex items-center space-x-2 transition-colors duration-200"
          title={vaccineLabel}
        >
          <Stethoscope size={14} />
          <span>{vaccineLabel}</span>
        </button>
      )}
      {onView && (
        <button
          onClick={() => onView(item)}
          className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={() => onEdit(item)}
          className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/40 transition-colors"
          title="Edit"
        >
          <Edit size={16} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(item.id || item.uid)}
          className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

  const defaultRenderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
      <div className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
        {emptyStateMessage}
      </div>
    </div>
  );

  // Determine if we should show actions column
  const showActionsColumn = onView || onEdit || onDelete || enableVaccination;

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
        }}
      />

      {/* Add Button - Only if not hidden */}
      {!hideAddButton && onAdd && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>{addButtonLabel}</span>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {enableSelection && (
                  <th className="w-12 px-4 py-3 border-r border-gray-100 dark:border-gray-600 text-center">
                    <input
                      type="checkbox"
                      checked={effectiveSelectedItems.size === filteredData.length && filteredData.length > 0}
                      onChange={effectiveOnSelectAll}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700"
                    />
                  </th>
                )}
                {columns.map((col) => {
                  const isCenter = col.headerCenter;

                  return (
                    <th
                      key={col.key}
                      className={`px-4 py-3 border-r border-gray-100 dark:border-gray-600 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${isCenter ? "text-center" : "text-left"
                        }`}
                      onClick={() => handleSort(col.key)}
                    >
                      <div className={`flex items-center ${isCenter ? "justify-center" : ""}`}>
                        {col.label}
                        {getSortIcon(col.key)}
                      </div>
                    </th>
                  );
                })}
                {showActionsColumn && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (enableSelection ? 1 : 0) + (showActionsColumn ? 1 : 0)} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400 mb-4"></div>
                      <div className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {loadingMessage}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors ${effectiveSelectedItems.has(item.id) ? "bg-primary-50 dark:bg-primary-900/20" : idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/30 dark:bg-gray-700/30"
                      }`}
                  >
                    {enableSelection && (
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 dark:border-gray-700 text-center">
                        <input
                          type="checkbox"
                          checked={effectiveSelectedItems.has(item.id || item.uid)}
                          onChange={() => effectiveOnSelectRow(item.id || item.uid)}
                          className="rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const isCenter = col.headerCenter;

                      return (
                        <td
                          key={col.key}
                          className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-gray-700 ${isCenter ? "text-center" : ""
                            }`}
                        >
                          <div className={isCenter ? "flex justify-center" : ""}>
                            {(renderCell || defaultRenderCell)(item, col)}
                          </div>
                        </td>
                      );
                    })}
                    {showActionsColumn && (
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
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
        {enablePagination && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="text-center sm:text-left">
                Showing{" "}
                <span className="font-medium text-primary-700 dark:text-primary-400">
                  {sortedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-primary-700 dark:text-primary-400">
                  {Math.min(currentPage * itemsPerPage, sortedData.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-primary-700 dark:text-primary-400">
                  {sortedData.length}
                </span>{" "}
                items
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                    className="flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 min-w-[5rem] bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <span>{itemsPerPage}</span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>

                  {showItemsPerPageDropdown && (
                    <div className="absolute bottom-full mb-1 left-0 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700 border-b-0 max-h-48 overflow-y-auto">
                      {itemsPerPageOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setItemsPerPage(option);
                            setShowItemsPerPageDropdown(false);
                            setCurrentPage(1);
                          }}
                          className={`block w-full text-left px-3 py-2 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${itemsPerPage === option
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium"
                            : "text-gray-700 dark:text-gray-300"
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
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNumber =
                      totalPages <= 5
                        ? i + 1
                        : currentPage <= 3
                          ? i + 1
                          : currentPage >= totalPages - 2
                            ? totalPages - 4 + i
                            : currentPage - 2 + i;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 border rounded-lg min-w-[2.5rem] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 ${currentPage === pageNumber
                          ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white border-transparent"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 flex items-center text-gray-400 dark:text-gray-500">...</span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800 ${currentPage === totalPages
                        ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white border-transparent"
                        : "text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap"
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