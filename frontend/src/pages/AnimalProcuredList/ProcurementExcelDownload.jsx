// components/ProcurementExcelDownload.jsx
import React from 'react';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { formatDate, formatSimpleDate, formatValue, formatYesNo } from '../../utils/helpers/formatters';
import { FileSpreadsheet, Loader2 } from 'lucide-react';

const ProcurementExcelDownload = ({ procurement, downloading, setDownloading }) => {

    // Helper to apply cell styles
    const applyCellStyle = (ws, cellRef, style) => {
        if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
        ws[cellRef].s = style;
    };

    // Color system matching PDF (lighter blue theme)
    const colors = {
        primaryBlue: '40A4DF',    // Lighter blue
        darkBlue: '0284C7',       // Original blue for contrast
        gold: 'FFD700',           // Gold/yellow
        charcoal: '1E1E1E',       // Body text
        slate: '464646',          // Labels
        lightBlue: 'EBF5FF',      // Very light blue background
        midBlue: 'ADD8E6',        // Light medium blue
        white: 'FFFFFF',
        silver: 'C0C0C0',
        successGreen: '27AE60',
        warningOrange: 'E67E22',
        errorRed: 'E74C3C'
    };

    // Comprehensive styles matching PDF design
    const styles = {
        // Main title (like PDF header)
        mainTitle: {
            font: { bold: true, sz: 20, color: { rgb: colors.white } },
            fill: { fgColor: { rgb: colors.primaryBlue } },
            alignment: { horizontal: "left", vertical: "center" },
            border: {
                top: { style: "medium", color: { rgb: colors.gold } },
                bottom: { style: "medium", color: { rgb: colors.gold } },
                left: { style: "medium", color: { rgb: colors.gold } },
                right: { style: "medium", color: { rgb: colors.gold } }
            }
        },
        // Subtitle in header
        subTitle: {
            font: { sz: 10, color: { rgb: colors.white } },
            fill: { fgColor: { rgb: colors.primaryBlue } },
            alignment: { horizontal: "left", vertical: "center" }
        },
        // Meta information in header
        metaLabel: {
            font: { bold: true, sz: 8, color: { rgb: colors.white } },
            fill: { fgColor: { rgb: colors.primaryBlue } },
            alignment: { horizontal: "left", vertical: "center" }
        },
        metaValue: {
            font: { sz: 8, color: { rgb: colors.white } },
            fill: { fgColor: { rgb: colors.primaryBlue } },
            alignment: { horizontal: "left", vertical: "center" }
        },
        // Section header with gold accent (matching PDF)
        sectionHeader: {
            font: { bold: true, sz: 12, color: { rgb: colors.white } },
            fill: { fgColor: { rgb: colors.primaryBlue } },
            alignment: { horizontal: "left", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: colors.gold } },
                bottom: { style: "thin", color: { rgb: colors.gold } },
                left: { style: "thin", color: { rgb: colors.gold } },
                right: { style: "thin", color: { rgb: colors.gold } }
            }
        },
        // Column headers (field names)
        columnHeader: {
            font: { bold: true, sz: 10, color: { rgb: colors.white } },
            fill: { fgColor: { rgb: colors.darkBlue } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: colors.midBlue } },
                bottom: { style: "thin", color: { rgb: colors.midBlue } },
                left: { style: "thin", color: { rgb: colors.midBlue } },
                right: { style: "thin", color: { rgb: colors.midBlue } }
            }
        },
        // Label style (bold, slate color)
        label: {
            font: { bold: true, sz: 10, color: { rgb: colors.slate } },
            fill: { fgColor: { rgb: colors.lightBlue } },
            alignment: { horizontal: "left", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: colors.midBlue } },
                bottom: { style: "thin", color: { rgb: colors.midBlue } },
                left: { style: "thin", color: { rgb: colors.midBlue } },
                right: { style: "thin", color: { rgb: colors.midBlue } }
            }
        },
        // Value style (normal text, charcoal)
        value: {
            font: { sz: 10, color: { rgb: colors.charcoal } },
            fill: { fgColor: { rgb: colors.white } },
            alignment: { horizontal: "left", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: colors.midBlue } },
                bottom: { style: "thin", color: { rgb: colors.midBlue } },
                left: { style: "thin", color: { rgb: colors.midBlue } },
                right: { style: "thin", color: { rgb: colors.midBlue } }
            }
        },
        // Alternating row style (light blue background)
        alternateValue: {
            font: { sz: 10, color: { rgb: colors.charcoal } },
            fill: { fgColor: { rgb: colors.lightBlue } },
            alignment: { horizontal: "left", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: colors.midBlue } },
                bottom: { style: "thin", color: { rgb: colors.midBlue } },
                left: { style: "thin", color: { rgb: colors.midBlue } },
                right: { style: "thin", color: { rgb: colors.midBlue } }
            }
        },
        // Status indicators
        success: {
            font: { bold: true, sz: 10, color: { rgb: colors.successGreen } },
            alignment: { horizontal: "center", vertical: "center" }
        },
        warning: {
            font: { bold: true, sz: 10, color: { rgb: colors.warningOrange } },
            alignment: { horizontal: "center", vertical: "center" }
        },
        error: {
            font: { bold: true, sz: 10, color: { rgb: colors.errorRed } },
            alignment: { horizontal: "center", vertical: "center" }
        },
        // Gold accent cell
        goldAccent: {
            fill: { fgColor: { rgb: colors.gold } },
            alignment: { horizontal: "center", vertical: "center" }
        }
    };

    const handleExcelDownload = () => {
        if (!procurement) {
            toast.error("No data to download");
            return;
        }

        setDownloading(prev => ({ ...prev, excel: true }));
        toast.loading('Generating Excel file...', { id: 'excel-download' });

        try {
            const wb = XLSX.utils.book_new();

            // ==================== MAIN REPORT SHEET ====================
            const reportData = [];
            const merges = [];

            // HEADER SECTION (matching PDF)
            reportData.push(
                ['360° ANIMAL PARENTING', '', '', '', '', ''],
                ['Animal Report', '', '', '', '', ''],
                ['', '', '', '', '', ''],
                ['TAG ID', 'DATE GENERATED', 'OFFICER', '', '', ''],
                [
                    procurement.tagId || '—',
                    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                    procurement.procurementOfficer || '—',
                    '', '', ''
                ],
                ['', '', '', '', '', ''] // Spacing
            );

            // Add gold accent row (decorative)
            reportData.push(['', '', '', '', '', '']);

            // Helper function to add a section horizontally
            const addHorizontalSection = (title, items) => {
                // Section header with gold accent
                reportData.push([title, '', '', '', '', '']);

                // Add column headers (field names)
                const headers = items.map(item => item.label);
                while (headers.length < 6) headers.push('');
                reportData.push(headers);

                // Add values
                const values = items.map(item => {
                    if (item.value === undefined || item.value === null || item.value === '') return '—';
                    return item.value;
                });
                while (values.length < 6) values.push('');
                reportData.push(values);

                // Add empty row for spacing
                reportData.push(['', '', '', '', '', '']);
            };

            // SOURCE VISIT SECTION
            addHorizontalSection('SOURCE VISIT', [
                { label: 'Officer', value: procurement.procurementOfficer },
                { label: 'Source Type', value: procurement.sourceType === 'bazaar' ? 'Bazaar' : 'Farm' },
                { label: 'Location', value: procurement.sourceLocation },
                { label: 'Visit Date', value: formatSimpleDate(procurement.visitDate) },
                { label: 'Visit Time', value: procurement.visitTime },
                { label: '', value: '' }
            ]);

            // BREEDER INFORMATION
            if (procurement.breederName || procurement.breederContact) {
                addHorizontalSection('BREEDER INFORMATION', [
                    { label: 'Breeder Name', value: procurement.breederName },
                    { label: 'Breeder Contact', value: procurement.breederContact },
                    { label: '', value: '' },
                    { label: '', value: '' },
                    { label: '', value: '' },
                    { label: '', value: '' }
                ]);
            }

            // ANIMAL DETAILS
            const ageText = (procurement.ageYears || procurement.ageMonths)
                ? `${procurement.ageYears || 0} years  ${procurement.ageMonths || 0} months`
                : '—';

            addHorizontalSection('ANIMAL DETAILS', [
                { label: 'Breed', value: procurement.breed },
                { label: 'Age', value: ageText },
                { label: 'Milking Capacity', value: procurement.milkingCapacity ? `${procurement.milkingCapacity} L/day` : '—' },
                { label: 'Calf Included', value: procurement.isCalfIncluded ? 'Yes' : 'No' },
                { label: 'Physical Check', value: procurement.physicalCheck },
                { label: '', value: '' }
            ]);

            // DISEASE SCREENING
            addHorizontalSection('DISEASE SCREENING', [
                { label: 'FMD Status', value: procurement.fmdDisease ? 'Detected' : 'Not Detected' },
                { label: 'LSD Status', value: procurement.lsdDisease ? 'Detected' : 'Not Detected' },
                { label: '', value: '' },
                { label: '', value: '' },
                { label: '', value: '' },
                { label: '', value: '' }
            ]);

            // HEALTH RECORD
            if (procurement.healthRecord) {
                addHorizontalSection('HEALTH RECORD', [
                    { label: 'Record Status', value: 'Available' },
                    { label: '', value: '' },
                    { label: '', value: '' },
                    { label: '', value: '' },
                    { label: '', value: '' },
                    { label: '', value: '' }
                ]);
            }

            // LOGISTICS
            if (procurement.vehicleNo) {
                addHorizontalSection('LOGISTICS', [
                    { label: 'Vehicle Number', value: procurement.vehicleNo },
                    { label: 'Driver Name', value: procurement.driverName },
                    { label: 'Driver Mobile', value: procurement.driverMobile },
                    { label: 'Driving License', value: procurement.drivingLicense },
                    { label: '', value: '' },
                    { label: '', value: '' }
                ]);
            }

            // QUARANTINE
            if (procurement.quarantineCenter) {
                addHorizontalSection('QUARANTINE', [
                    { label: 'Quarantine Center', value: procurement.quarantineCenter },
                    { label: 'Health Record', value: procurement.quarantineHealthRecord ? 'Available' : 'Not Available' },
                    { label: 'Final Clearance', value: procurement.finalHealthClearance ? 'Cleared' : 'Pending' },
                    { label: '', value: '' },
                    { label: '', value: '' },
                    { label: '', value: '' }
                ]);
            }

            // HANDOVER DETAILS
            if (procurement.handoverOfficer) {
                addHorizontalSection('HANDOVER DETAILS', [
                    { label: 'Handover Officer', value: procurement.handoverOfficer },
                    { label: 'Beneficiary ID', value: procurement.beneficiaryId },
                    { label: 'Beneficiary Location', value: procurement.beneficiaryLocation },
                    { label: 'Handover Date', value: formatSimpleDate(procurement.handoverDate) },
                    { label: 'Handover Time', value: procurement.handoverTime },
                    { label: '', value: '' }
                ]);
            }

            // DOCUMENTS SECTION
            const docItems = [];
            if (procurement.licenseCertificate) docItems.push({ label: 'License Certificate', value: 'Available' });
            if (procurement.handoverDocument) docItems.push({ label: 'Handover Document', value: 'Available' });

            if (docItems.length > 0) {
                while (docItems.length < 6) docItems.push({ label: '', value: '' });
                addHorizontalSection('DOCUMENTS', docItems);
            }

            // PHOTO CHECKLIST
            addHorizontalSection('PHOTO CHECKLIST', [
                { label: 'Front View', value: procurement.animalPhotoFront ? 'Uploaded' : 'Not Uploaded' },
                { label: 'Side View', value: procurement.animalPhotoSide ? 'Uploaded' : 'Not Uploaded' },
                { label: 'Rear View', value: procurement.animalPhotoRear ? 'Uploaded' : 'Not Uploaded' },
                { label: 'Quarantine Center', value: procurement.quarantineCenterPhoto ? 'Uploaded' : 'Not Uploaded' },
                { label: 'Handover Photo', value: procurement.handoverPhoto ? 'Uploaded' : 'Not Uploaded' },
                { label: '', value: '' }
            ]);

            // REMARKS
            if (procurement.remarks) {
                reportData.push(['REMARKS', '', '', '', '', '']);
                reportData.push(['Remarks', 'Details', '', '', '', '']);
                reportData.push([procurement.remarks, '', '', '', '', '']);
                reportData.push(['', '', '', '', '', '']);
            }

            // SYSTEM INFORMATION
            reportData.push(['SYSTEM INFORMATION', '', '', '', '', '']);
            reportData.push(['Created At', 'Updated At', 'Created By', '', '', '']);
            reportData.push([
                formatDate(procurement.createdAt),
                formatDate(procurement.updatedAt),
                procurement.createdBy || 'System',
                '', '', ''
            ]);

            // Create worksheet
            const ws = XLSX.utils.aoa_to_sheet(reportData);

            // Apply styles

            // Header merges
            merges.push(
                { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title
                { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Subtitle
                { s: { r: 3, c: 0 }, e: { r: 3, c: 0 } }, // TAG ID label
                { s: { r: 3, c: 1 }, e: { r: 3, c: 1 } }, // DATE GENERATED label
                { s: { r: 3, c: 2 }, e: { r: 3, c: 2 } }  // OFFICER label
            );

            // Style header rows
            // Row 0: Main title
            applyCellStyle(ws, 'A1', styles.mainTitle);

            // Row 1: Subtitle
            applyCellStyle(ws, 'A2', styles.subTitle);

            // Row 3: Meta labels
            for (let col = 0; col < 3; col++) {
                const cellRef = `${String.fromCharCode(65 + col)}4`;
                applyCellStyle(ws, cellRef, styles.metaLabel);
            }

            // Row 4: Meta values
            for (let col = 0; col < 3; col++) {
                const cellRef = `${String.fromCharCode(65 + col)}5`;
                applyCellStyle(ws, cellRef, styles.metaValue);
            }

            // Style all sections
            let rowIndex = 6; // Start after header
            while (rowIndex < reportData.length) {
                const cellValue = ws[`A${rowIndex + 1}`]?.v;

                // Style section headers (bold, colored background)
                if (cellValue && typeof cellValue === 'string' &&
                    (cellValue.includes('VISIT') || cellValue.includes('INFORMATION') ||
                        cellValue.includes('DETAILS') || cellValue.includes('SCREENING') ||
                        cellValue.includes('RECORD') || cellValue.includes('LOGISTICS') ||
                        cellValue.includes('QUARANTINE') || cellValue.includes('HANDOVER') ||
                        cellValue.includes('DOCUMENTS') || cellValue.includes('CHECKLIST') ||
                        cellValue.includes('REMARKS') || cellValue.includes('SYSTEM'))) {

                    // Style section header with gold border effect
                    applyCellStyle(ws, `A${rowIndex + 1}`, styles.sectionHeader);

                    // Add gold accent in first column (simulating PDF's gold strip)
                    applyCellStyle(ws, `A${rowIndex + 1}`, {
                        ...styles.sectionHeader,
                        fill: { fgColor: { rgb: colors.primaryBlue } }
                    });

                    // Add a small gold accent in an adjacent cell (simulating the gold strip)
                    if (!ws[`B${rowIndex + 1}`]) {
                        ws[`B${rowIndex + 1}`] = { t: 's', v: '' };
                    }
                    applyCellStyle(ws, `B${rowIndex + 1}`, {
                        fill: { fgColor: { rgb: colors.gold } },
                        alignment: { horizontal: "center", vertical: "center" }
                    });
                }

                // Style column headers (field labels row)
                if (rowIndex > 0) {
                    const prevRowValue = ws[`A${rowIndex}`]?.v;
                    if (prevRowValue && typeof prevRowValue === 'string' &&
                        (prevRowValue.includes('VISIT') || prevRowValue.includes('INFORMATION') ||
                            prevRowValue.includes('DETAILS') || prevRowValue.includes('SCREENING') ||
                            prevRowValue.includes('RECORD') || prevRowValue.includes('LOGISTICS') ||
                            prevRowValue.includes('QUARANTINE') || prevRowValue.includes('HANDOVER') ||
                            prevRowValue.includes('DOCUMENTS') || prevRowValue.includes('CHECKLIST'))) {

                        // This is the column headers row
                        for (let col = 0; col < 6; col++) {
                            const cellRef = `${String.fromCharCode(65 + col)}${rowIndex + 1}`;
                            if (ws[cellRef]?.v) {
                                applyCellStyle(ws, cellRef, styles.columnHeader);
                            }
                        }
                    }
                }

                // Style value rows with alternating background
                if (rowIndex > 6) {
                    const isValueRow = ws[`A${rowIndex + 1}`]?.v &&
                        !String(ws[`A${rowIndex + 1}`]?.v).includes('VISIT') &&
                        !String(ws[`A${rowIndex + 1}`]?.v).includes('DETAILS') &&
                        !String(ws[`A${rowIndex + 1}`]?.v).includes('SCREENING') &&
                        !String(ws[`A${rowIndex + 1}`]?.v).includes('RECORD') &&
                        !String(ws[`A${rowIndex + 1}`]?.v).includes('LOGISTICS') &&
                        !String(ws[`A${rowIndex + 1}`]?.v).includes('QUARANTINE') &&
                        !String(ws[`A${rowIndex + 1}`]?.v).includes('HANDOVER') &&
                        !String(ws[`A${rowIndex + 1}`]?.v).includes('DOCUMENTS') &&
                        !String(ws[`A${rowIndex + 1}`]?.v).includes('CHECKLIST');

                    if (isValueRow) {
                        // Check if this is a header row or value row
                        const isHeaderRow = ws[`A${rowIndex}`]?.v &&
                            String(ws[`A${rowIndex}`]?.v).includes('Officer') ||
                            String(ws[`A${rowIndex}`]?.v).includes('Breeder') ||
                            String(ws[`A${rowIndex}`]?.v).includes('Breed') ||
                            String(ws[`A${rowIndex}`]?.v).includes('FMD');

                        if (!isHeaderRow) {
                            for (let col = 0; col < 6; col++) {
                                const cellRef = `${String.fromCharCode(65 + col)}${rowIndex + 1}`;
                                if (ws[cellRef]?.v) {
                                    // Alternate row shading
                                    if (rowIndex % 2 === 0) {
                                        applyCellStyle(ws, cellRef, styles.value);
                                    } else {
                                        applyCellStyle(ws, cellRef, styles.alternateValue);
                                    }
                                }
                            }
                        }
                    }
                }

                rowIndex++;
            }

            // Apply status colors to specific values
            for (let row = 0; row < reportData.length; row++) {
                for (let col = 0; col < 6; col++) {
                    const cellRef = `${String.fromCharCode(65 + col)}${row + 1}`;
                    const cellValue = ws[cellRef]?.v;

                    if (cellValue && typeof cellValue === 'string') {
                        // Success status (green)
                        if (cellValue.includes('Uploaded') || cellValue.includes('Available') ||
                            cellValue.includes('Cleared') || cellValue === 'Yes' || cellValue === 'Detected') {
                            if (cellValue === 'Detected') {
                                // Warning for disease detection
                                applyCellStyle(ws, cellRef, { ...ws[cellRef]?.s, ...styles.warning });
                            } else {
                                applyCellStyle(ws, cellRef, { ...ws[cellRef]?.s, ...styles.success });
                            }
                        }
                        // Error status (red)
                        else if (cellValue.includes('Not Uploaded') || cellValue.includes('Not Available') ||
                            cellValue.includes('Pending') || cellValue === 'No' || cellValue === 'Not Detected') {
                            if (cellValue === 'Not Detected') {
                                // Good status for disease not detected
                                applyCellStyle(ws, cellRef, { ...ws[cellRef]?.s, ...styles.success });
                            } else {
                                applyCellStyle(ws, cellRef, { ...ws[cellRef]?.s, ...styles.error });
                            }
                        }
                    }
                }
            }

            // Apply all merges
            ws['!merges'] = merges;

            // Set column widths for better readability
            ws['!cols'] = [
                { wch: 22 }, // A
                { wch: 22 }, // B
                { wch: 22 }, // C
                { wch: 22 }, // D
                { wch: 22 }, // E
                { wch: 22 }  // F
            ];

            // Add footer with generation info
            const footerRow = reportData.length;
            ws[`A${footerRow + 1}`] = {
                t: 's',
                v: `Created: ${formatDate(procurement.createdAt)} | By: ${procurement.createdBy || 'System'} | Tag ID: ${procurement.tagId || '—'}`
            };

            // Merge footer cells
            merges.push({ s: { r: footerRow, c: 0 }, e: { r: footerRow, c: 5 } });

            // Style footer
            applyCellStyle(ws, `A${footerRow + 1}`, {
                font: { sz: 8, color: { rgb: colors.slate } },
                alignment: { horizontal: "left", vertical: "center" },
                fill: { fgColor: { rgb: colors.lightBlue } }
            });

            // Add the worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Animal Report');

            // ==================== DOCUMENTS SHEET ====================
            const docSheetData = [
                ['DOCUMENTS SUMMARY', '', ''],
                [`Generated: ${new Date().toLocaleString()}`, '', ''],
                [],
                ['Document Type', 'Status', 'File Name']
            ];

            const addDocRow = (type, url) => {
                if (url) {
                    const fileName = url.split('/').pop() || 'document';
                    docSheetData.push([type, '✓ Available', fileName]);
                } else {
                    docSheetData.push([type, '✗ Not Available', '-']);
                }
            };

            addDocRow('Health Record', procurement.healthRecord);
            addDocRow('License Certificate', procurement.licenseCertificate);
            addDocRow('Quarantine Health Record', procurement.quarantineHealthRecord);
            addDocRow('Final Health Clearance', procurement.finalHealthClearance);
            addDocRow('Handover Document', procurement.handoverDocument);

            const wsDocs = XLSX.utils.aoa_to_sheet(docSheetData);

            // Style documents sheet
            applyCellStyle(wsDocs, 'A1', {
                ...styles.mainTitle,
                font: { bold: true, sz: 16 },
                fill: { fgColor: { rgb: colors.primaryBlue } }
            });

            applyCellStyle(wsDocs, 'A2', { font: { italic: true, sz: 10 } });
            applyCellStyle(wsDocs, 'A4', styles.columnHeader);
            applyCellStyle(wsDocs, 'B4', styles.columnHeader);
            applyCellStyle(wsDocs, 'C4', styles.columnHeader);

            wsDocs['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
                { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }
            ];

            for (let i = 4; i < docSheetData.length; i++) {
                applyCellStyle(wsDocs, `A${i + 1}`, styles.label);
                applyCellStyle(wsDocs, `B${i + 1}`, styles.value);
                applyCellStyle(wsDocs, `C${i + 1}`, styles.value);

                const status = docSheetData[i][1];
                if (status && status.includes('✓')) {
                    applyCellStyle(wsDocs, `B${i + 1}`, { ...wsDocs[`B${i + 1}`]?.s, ...styles.success });
                } else if (status && status.includes('✗')) {
                    applyCellStyle(wsDocs, `B${i + 1}`, { ...wsDocs[`B${i + 1}`]?.s, ...styles.error });
                }
            }

            wsDocs['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 50 }];
            XLSX.utils.book_append_sheet(wb, wsDocs, 'Documents');

            // ==================== PHOTOGRAPHS SHEET ====================
            const photoSheetData = [
                ['PHOTOGRAPHS SUMMARY', '', ''],
                [`Generated: ${new Date().toLocaleString()}`, '', ''],
                [],
                ['Photo Type', 'Status', 'Preview URL']
            ];

            const addPhotoRow = (type, url) => {
                photoSheetData.push([type, url ? '✓ Available' : '✗ Not Available', url || '-']);
            };

            addPhotoRow('Animal Front View', procurement.animalPhotoFront);
            addPhotoRow('Animal Side View', procurement.animalPhotoSide);
            addPhotoRow('Animal Rear View', procurement.animalPhotoRear);
            addPhotoRow('Quarantine Center', procurement.quarantineCenterPhoto);
            addPhotoRow('Handover with Beneficiary', procurement.handoverPhoto);

            const wsPhotos = XLSX.utils.aoa_to_sheet(photoSheetData);

            // Style photos sheet
            applyCellStyle(wsPhotos, 'A1', {
                ...styles.mainTitle,
                font: { bold: true, sz: 16 },
                fill: { fgColor: { rgb: colors.primaryBlue } }
            });

            applyCellStyle(wsPhotos, 'A2', { font: { italic: true, sz: 10 } });
            applyCellStyle(wsPhotos, 'A4', styles.columnHeader);
            applyCellStyle(wsPhotos, 'B4', styles.columnHeader);
            applyCellStyle(wsPhotos, 'C4', styles.columnHeader);

            wsPhotos['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
                { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }
            ];

            for (let i = 4; i < photoSheetData.length; i++) {
                applyCellStyle(wsPhotos, `A${i + 1}`, styles.label);
                applyCellStyle(wsPhotos, `B${i + 1}`, styles.value);
                applyCellStyle(wsPhotos, `C${i + 1}`, styles.value);

                const status = photoSheetData[i][1];
                if (status && status.includes('✓')) {
                    applyCellStyle(wsPhotos, `B${i + 1}`, { ...wsPhotos[`B${i + 1}`]?.s, ...styles.success });
                } else if (status && status.includes('✗')) {
                    applyCellStyle(wsPhotos, `B${i + 1}`, { ...wsPhotos[`B${i + 1}`]?.s, ...styles.error });
                }
            }

            wsPhotos['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 70 }];
            XLSX.utils.book_append_sheet(wb, wsPhotos, 'Photographs');

            // Save the file
            XLSX.writeFile(wb, `360AP-Animal-Report-${procurement.tagId || 'details'}-${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Excel file downloaded successfully!', { id: 'excel-download' });

        } catch (error) {
            console.error('Excel generation error:', error);
            toast.error('Failed to generate Excel file', { id: 'excel-download' });
        } finally {
            setDownloading(prev => ({ ...prev, excel: false }));
        }
    };

    return (
        <button
            onClick={handleExcelDownload}
            disabled={downloading.excel}
            className={`
    flex items-center justify-center gap-2
    sm:px-4 px-2 py-1 rounded-lg border
    text-sm font-semibold
    transition
    ${downloading.excel
                    ? "border-gray-400 text-gray-400 cursor-not-allowed"
                    : "border-green-600 text-green-600 hover:bg-green-50"}
  `}
        >
            {downloading.excel ? (
                <Loader2 className="animate-spin" size={15} />
            ) : (
                <FileSpreadsheet size={15} />
            )}

            {/* Text hidden on small screen */}
            <span className="hidden sm:inline">
                {downloading.excel ? "Generating..." : "Excel"}
            </span>
        </button>
    );
};

export default ProcurementExcelDownload;