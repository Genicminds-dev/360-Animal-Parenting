// hooks/useSellerData.js
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import sellerService from '../services/seller.service';

const useSellerData = () => {
  const [stats, setStats] = useState({
    totalSellers: 0,
    maleSellers: 0,
    femaleSellers: 0,
    activeTransactions: 0,
    growthPercentage: "+0%",
    maleGrowth: "+0%",
    femaleGrowth: "+0%",
    transactionGrowth: "+0%"
  });
  
  const [loading, setLoading] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  /**
   * 🔄 FETCH SELLERS - With pagination, filters, sorting
   */
  const fetchSellers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await sellerService.getSellers(params);
      return response;
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Failed to fetch sellers. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📊 FETCH STATS - Dashboard statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      const data = await sellerService.getStats();
      setStats(data);
      return data;
    } catch (error) {
      console.error('Error fetching seller stats:', error);
      toast.error('Failed to fetch statistics. Please try again.');
      throw error;
    }
  }, []);

  /**
   * 🗑️ DELETE SINGLE SELLER
   */
  const deleteSeller = useCallback(async (id) => {
    try {
      await sellerService.deleteSeller(id);
      toast.success('Seller deleted successfully!');
      await fetchStats(); // Refresh stats after delete
      return true;
    } catch (error) {
      console.error('Error deleting seller:', error);
      toast.error(error.response?.data?.message || 'Failed to delete seller');
      throw error;
    }
  }, [fetchStats]);

  /**
   * 🗑️ DELETE BULK SELLERS
   */
  const bulkDeleteSellers = useCallback(async (ids) => {
    try {
      const result = await sellerService.bulkDeleteSellers(ids);
      toast.success(`${ids.length} sellers deleted successfully!`);
      await fetchStats(); // Refresh stats after bulk delete
      return result;
    } catch (error) {
      console.error('Error bulk deleting sellers:', error);
      toast.error(error.response?.data?.message || 'Failed to delete sellers');
      throw error;
    }
  }, [fetchStats]);

  /**
   * 📤 EXPORT SELLERS
   */
  const exportSellers = useCallback(async (format = 'csv') => {
    try {
      const blob = await sellerService.exportSellers(format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sellers-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Sellers exported successfully!');
    } catch (error) {
      console.error('Error exporting sellers:', error);
      toast.error('Failed to export sellers. Please try again.');
    }
  }, []);

  /**
   * 🖨️ PRINT SELLERS REPORT
   */
  const printSellers = useCallback(async () => {
    try {
      const data = await sellerService.getPrintData();
      
      // Generate HTML table from data
      const tableRows = data.data.map(seller => `
        <tr>
          <td>${seller.uid}</td>
          <td>${seller.fullName}</td>
          <td>${seller.mobileNumber}</td>
          <td>${seller.gender}</td>
          <td>${seller.state}</td>
          <td>${seller.city || '-'}</td>
          <td>${seller.transactionId !== 'NA' ? seller.transactionId : seller.upiId !== 'NA' ? seller.upiId : 'N/A'}</td>
          <td>${new Date(seller.createdAt).toLocaleDateString()}</td>
        </tr>
      `).join('');
      
      // Open print window
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Sellers Report</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 30px; 
                margin: 0;
                color: #333;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #4f46e5;
                padding-bottom: 20px;
              }
              h1 { 
                color: #1e40af; 
                margin-bottom: 10px;
                font-size: 28px;
              }
              .stats-container { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 30px; 
                gap: 20px;
              }
              .stat-box { 
                background: #f8fafc; 
                padding: 20px; 
                border-radius: 8px; 
                flex: 1;
                border: 1px solid #e2e8f0;
              }
              .stat-label { 
                color: #64748b; 
                font-size: 14px;
                margin-bottom: 5px;
              }
              .stat-value { 
                color: #0f172a; 
                font-size: 24px; 
                font-weight: bold; 
              }
              table { 
                border-collapse: collapse; 
                width: 100%; 
                margin-top: 20px; 
                font-size: 12px;
              }
              th { 
                background: #4f46e5; 
                color: white; 
                padding: 12px; 
                text-align: left; 
                font-weight: 600;
              }
              td { 
                border: 1px solid #e2e8f0; 
                padding: 10px; 
                text-align: left; 
              }
              tr:nth-child(even) { 
                background: #f8fafc; 
              }
              .footer { 
                margin-top: 40px; 
                text-align: center; 
                color: #64748b; 
                font-size: 12px;
                border-top: 1px solid #e2e8f0;
                padding-top: 20px;
              }
              @media print {
                .no-print { display: none; }
                body { padding: 20px; }
                th { background: #4f46e5 !important; color: white !important; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📋 Sellers Management Report</h1>
              <p style="color: #64748b; font-size: 14px;">
                Generated on: ${new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} at ${new Date().toLocaleTimeString()}
              </p>
            </div>
            
            <div class="stats-container">
              <div class="stat-box">
                <div class="stat-label">Total Sellers</div>
                <div class="stat-value">${data.stats.totalSellers}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Male Sellers</div>
                <div class="stat-value">${data.stats.maleSellers}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Female Sellers</div>
                <div class="stat-value">${data.stats.femaleSellers}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Active Transactions</div>
                <div class="stat-value">${data.stats.activeTransactions}</div>
              </div>
            </div>
            
            <h3 style="color: #1e40af; margin-bottom: 15px;">Seller Details</h3>
            
            <table>
              <thead>
                <tr>
                  <th>Seller ID</th>
                  <th>Full Name</th>
                  <th>Mobile</th>
                  <th>Gender</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Payment Info</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div class="footer">
              <p>This is a system-generated report from the Seller Management System.</p>
              <p>Total records: ${data.data.length} | Report ID: RPT-${new Date().getTime()}</p>
            </div>
            
            <div class="no-print" style="text-align: center; margin-top: 30px;">
              <button onclick="window.print();window.close();" 
                style="background: #4f46e5; color: white; border: none; padding: 12px 30px; 
                       border-radius: 6px; font-size: 14px; cursor: pointer;">
                🖨️ Print Report
              </button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      toast.success('Print ready!');
    } catch (error) {
      console.error('Error preparing print data:', error);
      toast.error('Failed to prepare print data. Please try again.');
    }
  }, []);

  /**
   * ✅ VERIFY SELLER
   */
  const verifySeller = useCallback(async (id) => {
    try {
      const result = await sellerService.verifySeller(id);
      toast.success('Seller verified successfully!');
      await fetchStats();
      return result;
    } catch (error) {
      console.error('Error verifying seller:', error);
      toast.error('Failed to verify seller. Please try again.');
      throw error;
    }
  }, [fetchStats]);

  /**
   * 🔍 GET SELLER BY ID
   */
  const getSellerById = useCallback(async (id) => {
    try {
      const seller = await sellerService.getSellerById(id);
      setSelectedSeller(seller);
      return seller;
    } catch (error) {
      console.error('Error fetching seller details:', error);
      toast.error('Failed to fetch seller details.');
      throw error;
    }
  }, []);

  /**
   * 🔄 REFRESH ALL DATA
   */
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        fetchStats(),
        // TableWithFilter will automatically refetch data
      ]);
      toast.success('Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [fetchStats]);

  return {
    // State
    stats,
    loading,
    selectedSeller,
    
    // Functions
    fetchSellers,
    fetchStats,
    deleteSeller,
    bulkDeleteSellers,
    exportSellers,
    printSellers,
    verifySeller,
    getSellerById,
    refreshData,
    
    // Setters
    setLoading,
    setSelectedSeller
  };
};

export default useSellerData;