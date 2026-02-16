// hooks/useAnimalData.js
// This hook abstracts ALL data logic - teammates just use this hook

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import animalService from '../services/animal.service';


const useAnimalData = () => {
  const [stats, setStats] = useState({
    totalAnimals: 0,
    totalValue: 0,
    milkingAnimals: 0,
    pregnantAnimals: 0,
  });
  
  const [loading, setLoading] = useState(false);

  // 🔄 FETCH ANIMALS - With all parameters
  const fetchAnimals = useCallback(async (params = {}) => {
    try {
      const response = await animalService.getAnimals(params);
      return response;
    } catch (error) {
      toast.error('Failed to fetch animals');
      throw error;
    }
  }, []);

  // 📊 FETCH STATS
  const fetchStats = useCallback(async () => {
    try {
      const data = await animalService.getStats();
      setStats(data);
      return data;
    } catch (error) {
      toast.error('Failed to fetch statistics');
      throw error;
    }
  }, []);

  // 🗑️ DELETE SINGLE
  const deleteAnimal = useCallback(async (id) => {
    try {
      await animalService.deleteAnimal(id);
      toast.success('Animal deleted successfully!');
      await fetchStats(); // Refresh stats
      return true;
    } catch (error) {
      toast.error('Failed to delete animal');
      throw error;
    }
  }, [fetchStats]);

  // 🗑️ DELETE BULK
  const bulkDeleteAnimals = useCallback(async (ids) => {
    try {
      const result = await animalService.bulkDeleteAnimals(ids);
      toast.success(`${ids.length} animals deleted successfully!`);
      await fetchStats(); // Refresh stats
      return result;
    } catch (error) {
      toast.error('Failed to delete animals');
      throw error;
    }
  }, [fetchStats]);

  // 📤 EXPORT
  const exportAnimals = useCallback(async (format = 'csv') => {
    try {
      const blob = await animalService.exportAnimals(format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `animals-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Animals exported successfully!');
    } catch (error) {
      toast.error('Failed to export animals');
    }
  }, []);

  // 🖨️ PRINT
  const printAnimals = useCallback(async () => {
    try {
      const data = await animalService.getPrintData();
      
      // Open print window
      const printWindow = window.open('', '_blank');
      // ... print logic
      printWindow.print();
      
      toast.success('Print ready!');
    } catch (error) {
      toast.error('Failed to prepare print data');
    }
  }, []);

  return {
    // Data
    stats,
    loading,
    
    // Functions
    fetchAnimals,
    fetchStats,
    deleteAnimal,
    bulkDeleteAnimals,
    exportAnimals,
    printAnimals,
    
    // Setters
    setLoading
  };
};

export default useAnimalData;