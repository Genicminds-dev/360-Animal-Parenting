import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  User, 
  Phone, 
  CreditCard, 
  Calendar,
  ArrowRight,
  Building,
  TrendingUp,
  FileText,
  Users
} from "lucide-react";
import FilterSection from "../../../components/common/Filter/FilterSection";
import DataTable from "../../../components/common/Table/DataTable";

// Mock data for agents - only with required fields
const MOCK_AGENTS = [
  {
    id: 1,
    uid: "CA0001",
    fullName: "Rajesh Kumar",
    mobile: "9876543210",
    aadharNumber: "123456789012",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    uid: "CA0002",
    fullName: "Priya Sharma",
    mobile: "8765432109",
    aadharNumber: "", // Empty for "N/A"
    createdAt: "2024-01-20T14:45:00Z",
  },
  {
    id: 3,
    uid: "CA0003",
    fullName: "Mohan Singh",
    mobile: "7654321098",
    aadharNumber: "234567890123",
    createdAt: "2024-01-25T09:15:00Z",
  },
  {
    id: 4,
    uid: "CA0004",
    fullName: "Anita Reddy",
    mobile: "6543210987",
    aadharNumber: "345678901234",
    createdAt: "2024-01-10T11:20:00Z",
  },
  {
    id: 5,
    uid: "CA0005",
    fullName: "Vikram Joshi",
    mobile: "5432109876",
    aadharNumber: "", // Empty for "N/A"
    createdAt: "2024-01-18T16:30:00Z",
  },
  {
    id: 6,
    uid: "CA0006",
    fullName: "Suresh Patel",
    mobile: "4321098765",
    aadharNumber: "456789012345",
    createdAt: "2024-01-22T13:10:00Z",
  },
  {
    id: 7,
    uid: "CA0007",
    fullName: "Neha Gupta",
    mobile: "3210987654",
    aadharNumber: "567890123456",
    createdAt: "2024-01-28T10:00:00Z",
  },
  {
    id: 8,
    uid: "CA0008",
    fullName: "Ramesh Iyer",
    mobile: "2109876543",
    aadharNumber: "", // Empty for "N/A"
    createdAt: "2024-01-12T15:45:00Z",
  },
  {
    id: 9,
    uid: "CA0009",
    fullName: "Smita Malhotra",
    mobile: "1098765432",
    aadharNumber: "678901234567",
    createdAt: "2024-01-30T12:30:00Z",
  },
  {
    id: 10,
    uid: "CA0010",
    fullName: "Ajay Kapoor",
    mobile: "0987654321",
    aadharNumber: "789012345678",
    createdAt: "2024-01-14T08:20:00Z",
  },
];

const AgentsList = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [filteredAgents, setFilteredAgents] = useState(MOCK_AGENTS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({
    totalAgents: 0,
    withAadhar: 0,
    withoutAadhar: 0,
  });

  // Fetch agents
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate stats
      const withAadharCount = MOCK_AGENTS.filter(a => a.aadharNumber && a.aadharNumber !== "").length;
      const withoutAadharCount = MOCK_AGENTS.length - withAadharCount;
      
      setStats({
        totalAgents: MOCK_AGENTS.length,
        withAadhar: withAadharCount,
        withoutAadhar: withoutAadharCount,
      });
      
      setAgents(MOCK_AGENTS);
      setFilteredAgents(MOCK_AGENTS);
      
    } catch (error) {
      toast.error("Failed to fetch agents");
      setAgents([]);
      setFilteredAgents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Apply filters function
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...MOCK_AGENTS];
    
    // Apply search filter
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(agent =>
        agent.fullName.toLowerCase().includes(searchTerm) ||
        agent.uid.toLowerCase().includes(searchTerm) ||
        agent.mobile.includes(searchTerm) ||
        (agent.aadharNumber && agent.aadharNumber.includes(searchTerm))
      );
    }
    
    // Apply aadhar filter
    if (newFilters.hasAadhar) {
      filtered = filtered.filter(agent => 
        newFilters.hasAadhar === 'yes' 
          ? agent.aadharNumber && agent.aadharNumber !== ""
          : !agent.aadharNumber || agent.aadharNumber === ""
      );
    }
    
    // Apply date range filter
    if (newFilters.fromDate || newFilters.toDate) {
      filtered = filtered.filter(agent => {
        const agentDate = new Date(agent.createdAt);
        
        if (newFilters.fromDate) {
          const fromDate = new Date(newFilters.fromDate);
          if (agentDate < fromDate) return false;
        }
        
        if (newFilters.toDate) {
          const toDate = new Date(newFilters.toDate);
          toDate.setHours(23, 59, 59, 999); // End of day
          if (agentDate > toDate) return false;
        }
        
        return true;
      });
    }
    
    setFilteredAgents(filtered);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setFilteredAgents(MOCK_AGENTS);
  }, []);

  // Table columns - ONLY THE 5 SPECIFIED FIELDS
  const columns = [
    { 
      key: "uid", 
      label: "Commission Agent ID",
      render: (item) => (
        <div className="flex items-center gap-3">
            <div className="font-medium items-center text-gray-900">{item.uid}</div>
        </div>
      )
    },
    { 
      key: "fullName", 
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <Users className="text-green-600" size={18} />
          </div> */}
          <div>
            <div className="font-medium text-gray-900">{item.fullName}</div>
          </div>
        </div>
      )
    },
    { 
      key: "mobile", 
      label: "Phone",
      render: (item) => (
        <div className="flex items-center gap-2">
          {/* <Phone className="text-gray-400" size={16} /> */}
          <div className="font-medium text-gray-900">{item.mobile}</div>
        </div>
      )
    },
    { 
      key: "aadharNumber", 
      label: "Aadhar Number",
      render: (item) => {
        const hasAadhar = item.aadharNumber && item.aadharNumber !== "";
        
        return (
          <div className="flex items-center gap-2">
            <CreditCard className={hasAadhar ? "text-green-500" : "text-gray-400"} size={16} />
            <div>
              {hasAadhar ? (
                <>
                  <div className="font-medium text-gray-900">
                    {item.aadharNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                  </div>
                  <div className="text-xs text-green-600">Provided</div>
                </>
              ) : (
                <>
                  <div className="font-medium text-gray-400 italic">N/A</div>
                  <div className="text-xs text-yellow-600">Not provided</div>
                </>
              )}
            </div>
          </div>
        );
      }
    },
    { 
      key: "createdAt", 
      label: "Created At",
      render: (item) => {
        const date = new Date(item.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        
        return (
          <div className="flex items-center gap-2">
            <div>
              <div className="font-medium text-gray-900">{formattedDate}</div>
              <div className="text-xs text-gray-500">
                {date.toLocaleTimeString}
              </div>
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
        key: "hasAadhar",
        label: "Aadhar Status",
        type: "select",
        options: [
          { value: "", label: "All" },
          { value: "yes", label: "With Aadhar" },
          { value: "no", label: "Without Aadhar" },
        ],
      },
    ],
    dateRange: true,
  };

  // Event handlers
  const handleAddNew = () => {
    navigate("/agents/register");
  };

  const handleEdit = (agent) => {
    toast.success(`Editing agent: ${agent.fullName}`);
    navigate(`/agents/edit/${agent.uid}`, { state: { agent } });
  };

//   const handleView = (agent) => {
//     toast.success(`Viewing agent: ${agent.fullName}`);
//     navigate(`/agents/view/${agent.uid}`, { state: { agent } });
//   };
const handleView = (agent) => {
    navigate(`/management/agent-details/${agent.uid}`, { 
      state: { agent } 
    });
  };


  const handleDelete = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setAgents(prev => prev.filter(agent => agent.id !== id));
      setFilteredAgents(prev => prev.filter(agent => agent.id !== id));
      
      toast.success("Agent deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete agent");
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from local state
      setAgents(prev => prev.filter(agent => !ids.includes(agent.id)));
      setFilteredAgents(prev => prev.filter(agent => !ids.includes(agent.id)));
      
      toast.success(`${ids.length} agents deleted successfully!`);
    } catch (error) {
      toast.error("Failed to delete agents");
    }
  };

  const handleExport = () => {
    // CSV Export with only required fields
    const csvContent = [
      ["Agent ID", "Full Name", "Mobile", "Aadhar Number", "Created At"],
      ...filteredAgents.map(a => [
        a.uid, 
        a.fullName, 
        a.mobile, 
        a.aadharNumber || "N/A", 
        new Date(a.createdAt).toLocaleString()
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commission-agents-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success("Agents data exported successfully!");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Commission Agents Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .stat-box { background: #f8fafc; padding: 15px; border-radius: 8px; width: 30%; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Commission Agents Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat-box"><strong>Total Agents:</strong> ${stats.totalAgents}</div>
            <div class="stat-box"><strong>With Aadhar:</strong> ${stats.withAadhar}</div>
            <div class="stat-box"><strong>Without Aadhar:</strong> ${stats.withoutAadhar}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Full Name</th>
                <th>Mobile Number</th>
                <th>Aadhar Number</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAgents.map(agent => `
                <tr>
                  <td>${agent.uid}</td>
                  <td>${agent.fullName}</td>
                  <td>${agent.mobile}</td>
                  <td>${agent.aadharNumber || "N/A"}</td>
                  <td>${new Date(agent.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Report generated by Commission Agent Management System</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    toast.success("Printing agents report...");
  };

  const handleRefresh = () => {
    toast.success("Refreshing agents data...");
    fetchAgents();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commission Agents</h1>
          <p className="text-gray-600">Manage commission agents for animal procurement</p>
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
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <Building className="text-blue-600" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+12%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.totalAgents}</h3>
          <p className="text-gray-600">Total Agents</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <CreditCard className="text-green-600" size={24} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} />
              <span className="ml-1">+8%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.withAadhar}</h3>
          <p className="text-gray-600">With Aadhar</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
              <FileText className="text-yellow-600" size={24} />
            </div>
            <div className="flex items-center text-sm text-red-600">
              <TrendingUp size={16} />
              <span className="ml-1">+5%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.withoutAadhar}</h3>
          <p className="text-gray-600">Without Aadhar</p>
        </div>
      </div> */}

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
        searchPlaceholder="Search by Agent ID, Name, Mobile, Aadhar..."
        
        // Only search enabled
        enableSearch={true}
        enableFilters={false}
        enableExport={true}
        enablePrint={true}
        enableBulkDelete={true}
      />

      {/* Data Table - Only showing 5 required fields */}
      <DataTable
        columns={columns}
        data={filteredAgents}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        addButtonLabel="Add New Agent"
        onAdd={handleAddNew}
        emptyStateMessage="No commission agents found. Try adjusting your filters or add new agents."
        loadingMessage="Loading agents data..."
        enableSelection={true}
        enableExport={true}
        enablePrint={true}
        enablePagination={true}
        enableBulkDelete={true}
      />
    </div>
  );
};

export default AgentsList;