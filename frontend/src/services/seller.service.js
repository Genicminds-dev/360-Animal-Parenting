// services/sellerService.js
import api from './api';

const sellerService = {
  /**
   * 📋 GET: Fetch sellers with pagination, filters, and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search term
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort direction (asc/desc)
   * @param {Object} params.filters - Additional filters
   * 
   * 🎯 TO DO: Replace mock with actual API call
   */
  getSellers: async (params = {}) => {
    // 🔧 MOCK IMPLEMENTATION - Replace with real API
    console.log('📡 API Call: getSellers', params);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    const mockSellers = [
      {
        id: 1,
        uid: "SEL001",
        fullName: "Rajesh Kumar",
        mobileNumber: "9876543210",
        gender: "Male",
        state: "Maharashtra",
        city: "Mumbai",
        transactionId: "TXN202400001",
        upiId: "rajesh@upi",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        uid: "SEL002",
        fullName: "Priya Sharma",
        mobileNumber: "8765432109",
        gender: "Female",
        state: "Delhi",
        city: "New Delhi",
        transactionId: "NA",
        upiId: "priya.sharma@okhdfcbank",
        createdAt: "2024-01-20T14:45:00Z",
      },
      {
        id: 3,
        uid: "SEL003",
        fullName: "Mohan Singh",
        mobileNumber: "7654321098",
        gender: "Male",
        state: "Karnataka",
        city: "Bengaluru",
        transactionId: "TXN202400003",
        upiId: "NA",
        createdAt: "2024-01-25T09:15:00Z",
      },
      {
        id: 4,
        uid: "SEL004",
        fullName: "Anita Reddy",
        mobileNumber: "6543210987",
        gender: "Female",
        state: "Tamil Nadu",
        city: "Chennai",
        transactionId: "NA",
        upiId: "NA",
        createdAt: "2024-01-10T11:20:00Z",
      },
      {
        id: 5,
        uid: "SEL005",
        fullName: "Vikram Joshi",
        mobileNumber: "5432109876",
        gender: "Male",
        state: "Uttar Pradesh",
        city: "Lucknow",
        transactionId: "TXN202400005",
        upiId: "vikram.joshi@okaxis",
        createdAt: "2024-01-18T16:30:00Z",
      },
      {
        id: 6,
        uid: "SEL006",
        fullName: "Suresh Patel",
        mobileNumber: "4321098765",
        gender: "Male",
        state: "Maharashtra",
        city: "Pune",
        transactionId: "NA",
        upiId: "suresh.patel@okicici",
        createdAt: "2024-01-22T13:10:00Z",
      },
      {
        id: 7,
        uid: "SEL007",
        fullName: "Neha Gupta",
        mobileNumber: "3210987654",
        gender: "Female",
        state: "Karnataka",
        city: "Mysore",
        transactionId: "TXN202400007",
        upiId: "neha.gupta@okhdfcbank",
        createdAt: "2024-01-28T10:00:00Z",
      },
      {
        id: 8,
        uid: "SEL008",
        fullName: "Ramesh Iyer",
        mobileNumber: "2109876543",
        gender: "Male",
        state: "Delhi",
        city: "New Delhi",
        transactionId: "NA",
        upiId: "NA",
        createdAt: "2024-01-12T09:45:00Z",
      },
      {
        id: 9,
        uid: "SEL009",
        fullName: "Smita Malhotra",
        mobileNumber: "1098765432",
        gender: "Female",
        state: "Uttar Pradesh",
        city: "Agra",
        transactionId: "TXN202400009",
        upiId: "smita.malhotra@okaxis",
        createdAt: "2024-01-30T15:20:00Z",
      },
      {
        id: 10,
        uid: "SEL010",
        fullName: "Ajay Kapoor",
        mobileNumber: "9988776655",
        gender: "Male",
        state: "Tamil Nadu",
        city: "Coimbatore",
        transactionId: "NA",
        upiId: "ajay.kapoor@okicici",
        createdAt: "2024-01-14T12:00:00Z",
      },
      {
        id: 11,
        uid: "SEL011",
        fullName: "Kavita Singh",
        mobileNumber: "8877665544",
        gender: "Female",
        state: "Gujarat",
        city: "Ahmedabad",
        transactionId: "TXN202400011",
        upiId: "kavita@okhdfcbank",
        createdAt: "2024-02-01T11:30:00Z",
      },
      {
        id: 12,
        uid: "SEL012",
        fullName: "Amit Patel",
        mobileNumber: "7766554433",
        gender: "Male",
        state: "Gujarat",
        city: "Surat",
        transactionId: "NA",
        upiId: "amit.patel@okaxis",
        createdAt: "2024-02-03T14:15:00Z",
      },
    ];

    // Apply mock filtering based on params
    let filteredData = [...mockSellers];
    
    // Search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.uid.toLowerCase().includes(searchTerm) ||
        item.fullName.toLowerCase().includes(searchTerm) ||
        item.mobileNumber.includes(searchTerm) ||
        item.state.toLowerCase().includes(searchTerm) ||
        (item.city && item.city.toLowerCase().includes(searchTerm)) ||
        (item.upiId && item.upiId.toLowerCase().includes(searchTerm)) ||
        (item.transactionId && item.transactionId.toLowerCase().includes(searchTerm))
      );
    }

    // Gender filter
    if (params.filters?.gender) {
      filteredData = filteredData.filter(item => 
        item.gender === params.filters.gender
      );
    }

    // State filter
    if (params.filters?.state) {
      filteredData = filteredData.filter(item => 
        item.state === params.filters.state
      );
    }

    // Verification status filter
    if (params.filters?.verificationStatus) {
      if (params.filters.verificationStatus === 'verified') {
        filteredData = filteredData.filter(item => 
          item.transactionId !== "NA" || item.upiId !== "NA"
        );
      } else if (params.filters.verificationStatus === 'pending') {
        filteredData = filteredData.filter(item => 
          item.transactionId === "NA" && item.upiId === "NA"
        );
      }
    }

    // Transaction status filter
    if (params.filters?.hasTransaction) {
      if (params.filters.hasTransaction === 'yes') {
        filteredData = filteredData.filter(item => 
          item.transactionId !== "NA"
        );
      } else if (params.filters.hasTransaction === 'no') {
        filteredData = filteredData.filter(item => 
          item.transactionId === "NA"
        );
      }
    }

    // UPI status filter
    if (params.filters?.hasUpi) {
      if (params.filters.hasUpi === 'yes') {
        filteredData = filteredData.filter(item => 
          item.upiId !== "NA"
        );
      } else if (params.filters.hasUpi === 'no') {
        filteredData = filteredData.filter(item => 
          item.upiId === "NA"
        );
      }
    }

    // Date range filter
    if (params.filters?.fromDate || params.filters?.toDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.createdAt);
        
        if (params.filters.fromDate) {
          const fromDate = new Date(params.filters.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (itemDate < fromDate) return false;
        }
        
        if (params.filters.toDate) {
          const toDate = new Date(params.filters.toDate);
          toDate.setHours(23, 59, 59, 999);
          if (itemDate > toDate) return false;
        }
        
        return true;
      });
    }

    // Sorting
    if (params.sortBy) {
      const sortField = params.sortBy;
      const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
      
      filteredData.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === 'fullName') {
          aVal = a.fullName;
          bVal = b.fullName;
        } else if (sortField === 'createdAt') {
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
        }
        
        if (aVal < bVal) return -1 * sortOrder;
        if (aVal > bVal) return 1 * sortOrder;
        return 0;
      });
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filteredData.slice(start, end);

    return {
      data: paginatedData,
      total: filteredData.length,
      page,
      limit,
      totalPages: Math.ceil(filteredData.length / limit)
    };
  },

  /**
   * 📊 GET: Fetch seller dashboard statistics
   * 
   * 🎯 TO DO: Replace mock with actual API call
   */
  getStats: async () => {
    console.log('📡 API Call: getSellerStats');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalSellers: 150,
      maleSellers: 85,
      femaleSellers: 65,
      activeTransactions: 92,
      growthPercentage: "+12%",
      maleGrowth: "+8%",
      femaleGrowth: "+15%",
      transactionGrowth: "+22%"
    };
  },

  /**
   * 🗑️ DELETE: Delete a single seller
   * @param {string|number} id - Seller ID
   * 
   * 🎯 TO DO: Replace mock with actual API call
   */
  deleteSeller: async (id) => {
    console.log('📡 API Call: deleteSeller', id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { 
      success: true, 
      message: `Seller ${id} deleted successfully` 
    };
  },

  /**
   * 🗑️ DELETE: Bulk delete sellers
   * @param {Array} ids - Array of seller IDs
   * 
   * 🎯 TO DO: Replace mock with actual API call
   */
  bulkDeleteSellers: async (ids) => {
    console.log('📡 API Call: bulkDeleteSellers', ids);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { 
      success: true, 
      deletedCount: ids.length,
      message: `${ids.length} sellers deleted successfully` 
    };
  },

  /**
   * 📤 EXPORT: Export sellers data
   * @param {string} format - Export format (csv, excel, pdf)
   * @param {Object} filters - Applied filters
   * 
   * 🎯 TO DO: Replace mock with actual API call
   */
  exportSellers: async (format = 'csv', filters = {}) => {
    console.log('📡 API Call: exportSellers', format, filters);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock CSV content
    const headers = ['UID', 'Full Name', 'Mobile Number', 'Gender', 'State', 'City', 'Transaction ID', 'UPI ID', 'Registration Date'];
    const csvContent = headers.join(',') + '\n' + 
      'SEL001,Rajesh Kumar,9876543210,Male,Maharashtra,Mumbai,TXN202400001,rajesh@upi,2024-01-15\n' +
      'SEL002,Priya Sharma,8765432109,Female,Delhi,New Delhi,NA,priya.sharma@okhdfcbank,2024-01-20';
    
    return new Blob([csvContent], { type: 'text/csv' });
  },

  /**
   * 🖨️ PRINT: Get printable format
   * @param {Object} filters - Applied filters
   * 
   * 🎯 TO DO: Replace mock with actual API call
   */
  getPrintData: async (filters = {}) => {
    console.log('📡 API Call: getPrintData', filters);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Fetch all data for print
    const response = await sellerService.getSellers({ 
      ...filters, 
      limit: 1000 // Get more items for print
    });
    
    return {
      data: response.data,
      stats: {
        totalSellers: response.total,
        maleSellers: response.data.filter(s => s.gender === 'Male').length,
        femaleSellers: response.data.filter(s => s.gender === 'Female').length,
        activeTransactions: response.data.filter(s => s.transactionId !== 'NA').length
      }
    };
  },

  /**
   * ✅ GET: Verify seller
   * @param {string|number} id - Seller ID
   * 
   * 🎯 TO DO: Replace mock with actual API call
   */
  verifySeller: async (id) => {
    console.log('📡 API Call: verifySeller', id);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      message: `Seller ${id} verified successfully`
    };
  },

  /**
   * 📝 GET: Get seller details by ID
   * @param {string|number} id - Seller ID
   * 
   * 🎯 TO DO: Replace mock with actual API call
   */
  getSellerById: async (id) => {
    console.log('📡 API Call: getSellerById', id);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock data - find seller by id or uid
    const mockSellers = await sellerService.getSellers({ limit: 100 });
    return mockSellers.data.find(s => s.id === id || s.uid === id);
  }
};

export default sellerService;