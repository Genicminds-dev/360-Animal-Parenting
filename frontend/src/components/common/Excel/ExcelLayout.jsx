import * as XLSX from 'xlsx';

class ExcelLayout {
  constructor(data, summary) {
    this.data = data;
    this.summary = summary;
    this.workbook = XLSX.utils.book_new();
  }

  // Generate complete Excel workbook
  generate() {
    this.addMainSheet();
    this.addSummarySheet();
    this.addStatisticsSheet();
    this.addBreedAnalysisSheet();
    return this.workbook;
  }

  // Main data sheet
  addMainSheet() {
    // Prepare detailed data
    const detailedData = this.data.map(animal => ({
      'Animal ID': animal.uid || 'N/A',
      'Ear Tag ID': animal.earTagId || 'N/A',
      'Breed': animal.breed || 'N/A',
      'Animal Type': animal.animalType || 'N/A',
      'Milk Yield (L)': animal.milkData || '0',
      'Pregnancy Status': this.formatPregnancyStatus(animal.pregnancyStatus),
      'No. of Pregnancies': animal.numberOfPregnancy || '0',
      'Age (months)': animal.age || '0',
      'Weight (kg)': animal.weight || '0',
      'Date of Birth': this.formatDate(animal.dob),
      'SNB ID': animal.snb_id || 'N/A',
      'Calf Ear Tag': animal.calfEarTagId || 'N/A',
      'Calf Gender': animal.calfGender || 'N/A',
      'Calf DOB': this.formatDate(animal.calfDob),
      'Pricing (₹)': this.formatCurrency(animal.pricing),
      'Vendor ID': animal.vendorId || 'N/A',
      'Quarantine ID': animal.quarantineId || 'N/A',
      'Created Date': this.formatDate(animal.createdAt),
      'Last Updated': this.formatDate(animal.updatedAt)
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(detailedData);

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Animal ID
      { wch: 15 }, // Ear Tag ID
      { wch: 15 }, // Breed
      { wch: 12 }, // Animal Type
      { wch: 12 }, // Milk Yield
      { wch: 15 }, // Pregnancy Status
      { wch: 18 }, // No. of Pregnancies
      { wch: 12 }, // Age
      { wch: 10 }, // Weight
      { wch: 12 }, // DOB
      { wch: 12 }, // SNB ID
      { wch: 15 }, // Calf Ear Tag
      { wch: 12 }, // Calf Gender
      { wch: 12 }, // Calf DOB
      { wch: 15 }, // Pricing
      { wch: 15 }, // Vendor ID
      { wch: 15 }, // Quarantine ID
      { wch: 12 }, // Created Date
      { wch: 12 }  // Last Updated
    ];

    // Add title and metadata
    XLSX.utils.sheet_add_aoa(ws, [
      ['ANIMAL MANAGEMENT SYSTEM - DETAILED REPORT'],
      [`Generated on: ${new Date().toLocaleString()}`],
      []
    ], { origin: 'A1' });

    XLSX.utils.book_append_sheet(this.workbook, ws, 'Animal Data');
  }

  // Summary sheet
  addSummarySheet() {
    const summaryData = [
      ['ANIMAL MANAGEMENT SYSTEM - SUMMARY REPORT'],
      [`Generated on: ${new Date().toLocaleString()}`],
      [],
      ['METRICS', 'VALUE'],
      ['Total Animals', this.summary.totalAnimals || 0],
      ['Total Breeds', this.summary.totalBreeds || 0],
      ['Pregnant Animals', this.summary.activePregnant || 0],
      ['Last Added Date', this.formatDate(this.summary.lastAddedDate)],
      [],
      ['DISTRIBUTION BY BREED'],
      ['Breed', 'Count', 'Percentage']
    ];

    // Calculate breed distribution
    const breedCount = {};
    this.data.forEach(animal => {
      const breed = animal.breed || 'Unknown';
      breedCount[breed] = (breedCount[breed] || 0) + 1;
    });

    Object.entries(breedCount).forEach(([breed, count]) => {
      const percentage = ((count / this.data.length) * 100).toFixed(2);
      summaryData.push([breed, count, `${percentage}%`]);
    });

    summaryData.push(
      [],
      ['DISTRIBUTION BY ANIMAL TYPE'],
      ['Type', 'Count', 'Percentage']
    );

    // Calculate type distribution
    const typeCount = {};
    this.data.forEach(animal => {
      const type = animal.animalType || 'Unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    Object.entries(typeCount).forEach(([type, count]) => {
      const percentage = ((count / this.data.length) * 100).toFixed(2);
      summaryData.push([type, count, `${percentage}%`]);
    });

    summaryData.push(
      [],
      ['PREGNANCY STATUS'],
      ['Status', 'Count', 'Percentage']
    );

    // Calculate pregnancy distribution
    const pregnancyCount = {};
    this.data.forEach(animal => {
      const status = animal.pregnancyStatus || 'Unknown';
      const displayStatus = this.formatPregnancyStatus(status);
      pregnancyCount[displayStatus] = (pregnancyCount[displayStatus] || 0) + 1;
    });

    Object.entries(pregnancyCount).forEach(([status, count]) => {
      const percentage = ((count / this.data.length) * 100).toFixed(2);
      summaryData.push([status, count, `${percentage}%`]);
    });

    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 12 }];
    
    XLSX.utils.book_append_sheet(this.workbook, ws, 'Summary');
  }

  // Statistics sheet
  addStatisticsSheet() {
    const milkData = this.data.map(a => parseFloat(a.milkData) || 0).filter(v => v > 0);
    const weightData = this.data.map(a => parseFloat(a.weight) || 0).filter(v => v > 0);
    const ageData = this.data.map(a => parseFloat(a.age) || 0).filter(v => v > 0);

    const statsData = [
      ['STATISTICAL ANALYSIS REPORT'],
      [`Generated on: ${new Date().toLocaleString()}`],
      [],
      ['MILK PRODUCTION STATISTICS (Liters)'],
      ['Metric', 'Value'],
      ['Average', this.calculateAverage(milkData)],
      ['Maximum', this.calculateMax(milkData)],
      ['Minimum', this.calculateMin(milkData)],
      ['Total', this.calculateSum(milkData)],
      ['Median', this.calculateMedian(milkData)],
      ['Standard Deviation', this.calculateStdDev(milkData)],
      [],
      ['WEIGHT STATISTICS (kg)'],
      ['Metric', 'Value'],
      ['Average', this.calculateAverage(weightData)],
      ['Maximum', this.calculateMax(weightData)],
      ['Minimum', this.calculateMin(weightData)],
      ['Total', this.calculateSum(weightData)],
      ['Median', this.calculateMedian(weightData)],
      ['Standard Deviation', this.calculateStdDev(weightData)],
      [],
      ['AGE STATISTICS (months)'],
      ['Metric', 'Value'],
      ['Average', this.calculateAverage(ageData)],
      ['Maximum', this.calculateMax(ageData)],
      ['Minimum', this.calculateMin(ageData)],
      ['Median', this.calculateMedian(ageData)],
      ['Standard Deviation', this.calculateStdDev(ageData)]
    ];

    const ws = XLSX.utils.aoa_to_sheet(statsData);
    ws['!cols'] = [{ wch: 30 }, { wch: 15 }];
    
    XLSX.utils.book_append_sheet(this.workbook, ws, 'Statistics');
  }

  // Breed analysis sheet
  addBreedAnalysisSheet() {
    const breeds = [...new Set(this.data.map(a => a.breed).filter(Boolean))];
    const analysisData = [
      ['BREED-WISE ANALYSIS REPORT'],
      [`Generated on: ${new Date().toLocaleString()}`],
      [],
      ['Breed', 'Count', 'Avg Milk (L)', 'Avg Weight (kg)', 'Pregnant', 'Not Pregnant']
    ];

    breeds.forEach(breed => {
      const breedAnimals = this.data.filter(a => a.breed === breed);
      const count = breedAnimals.length;
      const avgMilk = this.calculateAverage(breedAnimals.map(a => parseFloat(a.milkData) || 0));
      const avgWeight = this.calculateAverage(breedAnimals.map(a => parseFloat(a.weight) || 0));
      const pregnant = breedAnimals.filter(a => a.pregnancyStatus === 'pregnant').length;
      const notPregnant = breedAnimals.filter(a => a.pregnancyStatus === 'not_pregnant').length;

      analysisData.push([breed, count, avgMilk, avgWeight, pregnant, notPregnant]);
    });

    const ws = XLSX.utils.aoa_to_sheet(analysisData);
    ws['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }];
    
    XLSX.utils.book_append_sheet(this.workbook, ws, 'Breed Analysis');
  }

  // Helper functions
  formatPregnancyStatus(status) {
    if (!status) return 'N/A';
    return status === 'pregnant' ? 'Pregnant' : 
           status === 'not_pregnant' ? 'Not Pregnant' : status;
  }

  formatDate(date) {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  }

  formatCurrency(value) {
    if (!value || value === '0') return '₹0';
    return `₹${parseFloat(value).toLocaleString('en-IN')}`;
  }

  calculateAverage(values) {
    if (values.length === 0) return '0.00';
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  }

  calculateMax(values) {
    if (values.length === 0) return '0.00';
    return Math.max(...values).toFixed(2);
  }

  calculateMin(values) {
    if (values.length === 0) return '0.00';
    return Math.min(...values).toFixed(2);
  }

  calculateSum(values) {
    if (values.length === 0) return '0.00';
    return values.reduce((a, b) => a + b, 0).toFixed(2);
  }

  calculateMedian(values) {
    if (values.length === 0) return '0.00';
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
    }
    return sorted[mid].toFixed(2);
  }

  calculateStdDev(values) {
    if (values.length < 2) return '0.00';
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquareDiff).toFixed(2);
  }
}

// Export function to create Excel
export const createExcel = (data, summary) => {
  const layout = new ExcelLayout(data, summary);
  return layout.generate();
};

export default ExcelLayout;