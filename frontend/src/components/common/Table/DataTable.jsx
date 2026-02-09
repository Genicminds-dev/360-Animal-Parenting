// components/DataTable.jsx
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  FaSort,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import { toast, Toaster } from "react-hot-toast";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  Search,
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
  
  // Customization
  addButtonLabel = "Add New",
  emptyStateMessage = "No data found",
  loadingMessage = "Loading...",
  
  // Custom renderers
  renderCell,
  renderActions,
  renderEmptyState,
  
}) => {
  // State management
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1] || 10);
  const [sortConfig, setSortConfig] = useState({
    key: columns[0]?.key || "id",
    direction: "desc",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);

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
    if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" size={14} />;
    return sortConfig.direction === "asc" 
      ? <ChevronUp className="ml-1 text-blue-600" size={16} />
      : <ChevronDown className="ml-1 text-blue-600" size={16} />;
  };

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

  const handleDelete = (id) => {
    setDeleteTarget("single");
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = () => {
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
        }
      } else if (deleteId && onDelete) {
        await onDelete(deleteId);
      }
      setSelectedItems(new Set());
      toast.success("Operation completed successfully!");
    } catch (error) {
      toast.error("Operation failed: " + error.message);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteId(null);
    }
  };

  // Default renderers
  const defaultRenderCell = (item, column) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(item);
    }
    
    return value || "N/A";
  };

  const defaultRenderActions = (item) => (
    <div className="flex items-center space-x-2">
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
          onClick={() => handleDelete(item.id)}
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
        {emptyStateMessage}  {/* Fixed: removed searchTerm reference */}
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" />

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
                      checked={selectedItems.size === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
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
                {(onView || onEdit || onDelete) && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (enableSelection ? 1 : 0) + ((onView || onEdit || onDelete) ? 1 : 0)} className="px-4 py-12 text-center">
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
                    className={`hover:bg-gray-50/50 transition-colors ${
                      selectedItems.has(item.id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    {enableSelection && (
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-100 text-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
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
                    {(onView || onEdit || onDelete) && (
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
                  <td colSpan={columns.length + (enableSelection ? 1 : 0) + ((onView || onEdit || onDelete) ? 1 : 0)} className="px-4 py-12 text-center">
                    {(renderEmptyState || defaultRenderEmptyState)()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enablePagination && (
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
                items  {/* Fixed: removed searchTerm reference */}
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
                    <span className="px-2 flex items-center text-gray-400">...</span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                        currentPage === totalPages
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-transparent"
                          : ""
                      }`}
                    >
                      {totalPages}
                    </button>
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
    </>
  );
};

export default DataTable;