import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFLayout {
  constructor(doc, data, summary) {
    this.doc = doc;
    this.data = data;
    this.summary = summary;
    this.pageWidth = doc.internal.pageSize.width;
    this.pageHeight = doc.internal.pageSize.height;
    this.margin = 14;
    this.contentWidth = this.pageWidth - (2 * this.margin);
  }

  // Generate complete PDF
  async generate() {
    this.addHeader();
    this.addSummaryCards();
    await this.addMainTable();
    this.addFooter();
    return this.doc;
  }

  // Add header section
  addHeader() {
    // Header background
    this.doc.setFillColor(37, 92, 148);
    this.doc.rect(0, 0, this.pageWidth, 35, 'F');

    // Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ANIMAL MANAGEMENT SYSTEM', this.margin, 20);

    // Subtitle
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(
      `Comprehensive Animal Report • Generated on: ${new Date().toLocaleString()}`,
      this.margin,
      28
    );

    // Reset text color
    this.doc.setTextColor(0, 0, 0);
  }

  // Add summary cards
  addSummaryCards() {
    const cards = [
      { 
        label: 'Total Animals', 
        value: this.summary.totalAnimals || 0,
        icon: '🐄',
        color: [63, 143, 6]
      },
      { 
        label: 'Total Breeds', 
        value: this.summary.totalBreeds || 0,
        icon: '🧬',
        color: [37, 92, 148]
      },
      { 
        label: 'Pregnant', 
        value: this.summary.activePregnant || 0,
        icon: '🤰',
        color: [219, 39, 119]
      },
      { 
        label: 'Last Added', 
        value: this.summary.lastAddedDate 
          ? new Date(this.summary.lastAddedDate).toLocaleDateString() 
          : 'N/A',
        icon: '📅',
        color: [147, 51, 234]
      }
    ];

    const cardWidth = (this.contentWidth - 30) / 4;
    let xPos = this.margin;

    cards.forEach((card, index) => {
      // Card background
      this.doc.setFillColor(249, 250, 251);
      this.doc.setDrawColor(229, 231, 235);
      this.doc.roundedRect(xPos, 45, cardWidth, 35, 3, 3, 'FD');

      // Icon (using text for now, can be replaced with actual icons)
      this.doc.setFontSize(14);
      this.doc.setTextColor(card.color[0], card.color[1], card.color[2]);
      this.doc.text(card.icon, xPos + 5, 55);

      // Label
      this.doc.setFontSize(8);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(card.label, xPos + 5, 65);

      // Value
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(card.color[0], card.color[1], card.color[2]);
      this.doc.text(card.value.toString(), xPos + 5, 75);

      xPos += cardWidth + 10;
    });

    // Reset position
    this.doc.setTextColor(0, 0, 0);
  }

  // Add main data table
  async addMainTable() {
    const tableData = this.data.map(animal => [
      animal.uid || 'N/A',
      animal.earTagId || 'N/A',
      animal.breed || 'N/A',
      animal.animalType || 'N/A',
      animal.milkData || '0',
      this.formatPregnancyStatus(animal.pregnancyStatus),
      this.formatDate(animal.createdAt)
    ]);

    this.doc.autoTable({
      startY: 90,
      head: [['Animal ID', 'Ear Tag', 'Breed', 'Type', 'Milk (L)', 'Pregnancy', 'Created Date']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        halign: 'center'
      },
      headStyles: {
        fillColor: [63, 143, 6],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 18 },
        5: { cellWidth: 25 },
        6: { cellWidth: 28 }
      },
      didDrawPage: (data) => {
        this.addFooter(data.pageCount);
      }
    });
  }

  // Format pregnancy status
  formatPregnancyStatus(status) {
    if (!status) return 'N/A';
    return status === 'pregnant' ? 'Pregnant' : 
           status === 'not_pregnant' ? 'Not Pregnant' : status;
  }

  // Format date
  formatDate(date) {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  }

  // Add footer with page numbers
  addFooter(pageCount) {
    const totalPages = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);
      
      // Page number
      this.doc.text(
        `Page ${i} of ${totalPages}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );

      // Copyright
      this.doc.setFontSize(7);
      this.doc.text(
        `© ${new Date().getFullYear()} Animal Management System`,
        this.pageWidth / 2,
        this.pageHeight - 5,
        { align: 'center' }
      );
    }
  }
}

// Export function to create PDF
export const createPDF = async (data, summary) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const layout = new PDFLayout(doc, data, summary);
  return await layout.generate();
};

export default PDFLayout;