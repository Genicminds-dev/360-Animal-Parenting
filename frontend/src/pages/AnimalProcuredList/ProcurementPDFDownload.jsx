// components/ProcurementPDFDownload.jsx
import React from 'react';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate, formatSimpleDate, formatValue, formatYesNo } from '../../utils/helpers/formatters';
import { FileText } from 'lucide-react';

const ProcurementPDFDownload = ({ procurement, downloading, setDownloading }) => {

    const handlePDFDownload = async () => {
        if (!procurement) {
            toast.error("No data to download");
            return;
        }

        setDownloading(prev => ({ ...prev, pdf: true }));
        toast.loading('Generating PDF...', { id: 'pdf-download' });

        try {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.width;   // 210
            const pageHeight = doc.internal.pageSize.height;  // 297
            const margin = 18;
            const contentW = pageWidth - margin * 2;
            let yPos = margin;

            // ── Color System - Lighter Blue Version ───────────────────────
            const C = {
                primaryBlue: [64, 164, 223],   // Lighter #0284C7 - More vibrant sky blue
                darkBlue: [2, 132, 199],    // Original #0284C7 for contrast
                lightBlue: [235, 245, 255],  // Very light blue for backgrounds (even lighter)
                midBlue: [173, 216, 250],  // Light medium blue for accents
                gold: [255, 215, 0],    // Gold/yellow for degree symbol and accents
                charcoal: [30, 30, 30],     // Body text
                slate: [70, 70, 70],     // Labels
                silver: [200, 200, 200],  // Dividers
                white: [255, 255, 255],
            };

            // ── Utility: set RGB fill ─────────────────────────────────────
            const fill = (c) => doc.setFillColor(c[0], c[1], c[2]);
            const stroke = (c) => doc.setDrawColor(c[0], c[1], c[2]);
            const text = (c) => doc.setTextColor(c[0], c[1], c[2]);

            // ── Page Break Guard ─────────────────────────────────────────
            let pageNum = 1;
            const footerH = 18;

            const checkBreak = (needed) => {
                if (yPos + needed > pageHeight - footerH - 6) {
                    drawFooter();
                    doc.addPage();
                    pageNum++;
                    drawPageHeader();
                    return true;
                }
                return false;
            };

            // ── Continuation Header (pages 2+) ───────────────────────────
            const drawPageHeader = () => {
                yPos = margin;
                // thin top bar
                fill(C.primaryBlue);
                doc.rect(0, 0, pageWidth, 8, 'F');
                text(C.white);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'bold');
                doc.text('360° ANIMAL PARENTING  |  ANIMAL REPORT', margin, 5.5);
                doc.setFont('helvetica', 'normal');
                doc.text(`Page ${pageNum}`, pageWidth - margin, 5.5, { align: 'right' });
                yPos = 14;
            };

            // ── Footer ───────────────────────────────────────────────────
            const drawFooter = () => {
                const fy = pageHeight - footerH;
                stroke(C.silver);
                doc.setLineWidth(0.3);
                doc.line(margin, fy, pageWidth - margin, fy);

                text(C.slate);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'normal');
                doc.text(
                    `Created: ${formatDate(procurement.createdAt)}   |   By: ${procurement.createdBy || 'System'}   |   Tag ID: ${procurement.tagId || '—'}`,
                    margin, fy + 5
                );
                doc.text(
                    `360° Animal Parenting  |  Confidential`,
                    pageWidth / 2, fy + 5, { align: 'center' }
                );
                doc.text(
                    `Page ${pageNum}`,
                    pageWidth - margin, fy + 5, { align: 'right' }
                );

                // second footer line
                text(C.silver);
                doc.setFontSize(6.5);
                doc.text(
                    'This document is auto-generated. Please verify data before use.',
                    pageWidth / 2, fy + 10, { align: 'center' }
                );
            };

            // ═══════════════════════════════════════════════════════════════
            // PAGE 1 — COVER HEADER
            // ═══════════════════════════════════════════════════════════════

            // Full-width primary blue header band (lighter version)
            const headerH = 52;
            fill(C.primaryBlue);
            doc.rect(0, 0, pageWidth, headerH, 'F');

            // Decorative right-side gold strip
            fill(C.gold);
            doc.rect(pageWidth - 6, 0, 6, headerH, 'F');

            // Brand title with degree icon
            text(C.white);
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('360° ANIMAL PARENTING', margin, 20);

            // Subtitle
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            text([255, 255, 255]); // Pure white for better contrast on lighter blue
            doc.text('Animal Report', margin, 29);

            // Horizontal gold rule
            fill(C.gold);
            doc.rect(margin, 33, 60, 0.8, 'F');

            // Meta row inside header
            text(C.white);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('TAG ID', margin, 43);
            doc.text('DATE GENERATED', margin + 60, 43);
            doc.text('OFFICER', margin + 120, 43);

            text([255, 255, 255]); // Pure white
            doc.setFont('helvetica', 'normal');
            doc.text(String(procurement.tagId || '—'), margin, 49);
            doc.text(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), margin + 60, 49);
            doc.text(String(procurement.procurementOfficer || '—'), margin + 120, 49);

            yPos = headerH + 10;

            // Set page background color (very light blue)
            doc.setPage(1);
            fill(C.lightBlue);
            doc.rect(0, headerH, pageWidth, pageHeight - headerH, 'F');

            // ═══════════════════════════════════════════════════════════════
            // SECTION RENDERER
            // ═══════════════════════════════════════════════════════════════

            /**
             * Renders a labelled section block:
             *   [ SECTION TITLE BAR ]
             *   label ................. value
             *   label ................. value
             */
            const addSection = (title, rows) => {
                if (!rows || rows.length === 0) return;

                // Filter empty
                const validRows = rows.filter(([, v]) => v && v !== '—' && v !== '' && v !== 'undefined' && v !== 'null');
                if (validRows.length === 0) return;

                // Estimate height: title bar 8 + rows * 8 + bottom gap 6
                const blockH = 10 + validRows.length * 8 + 8;
                checkBreak(blockH);

                // ── Title Bar ──
                fill(C.primaryBlue);
                doc.roundedRect(margin, yPos, contentW, 8, 1, 1, 'F');

                // Gold left accent
                fill(C.gold);
                doc.rect(margin, yPos, 3, 8, 'F');

                text(C.white);
                doc.setFontSize(8.5);
                doc.setFont('helvetica', 'bold');
                doc.text(title.toUpperCase(), margin + 6, yPos + 5.5);

                yPos += 10;

                // ── Rows ──
                validRows.forEach(([label, value], idx) => {
                    // Alternate row shading - use light blue alternating with white
                    if (idx % 2 === 0) {
                        fill(C.lightBlue);
                        doc.rect(margin, yPos - 1, contentW, 7.5, 'F');
                    } else {
                        fill(C.white);
                        doc.rect(margin, yPos - 1, contentW, 7.5, 'F');
                    }

                    // Label
                    doc.setFontSize(8.5);
                    doc.setFont('helvetica', 'bold');
                    text(C.slate);
                    doc.text(label, margin + 4, yPos + 4.5);

                    // Dot leader (decorative)
                    stroke(C.midBlue);
                    doc.setLineWidth(0.1);
                    doc.setLineDashPattern([0.5, 1.5], 0);
                    doc.line(margin + 48, yPos + 4, margin + 52, yPos + 4);
                    doc.setLineDashPattern([], 0);

                    // Value — wrap if long
                    doc.setFont('helvetica', 'normal');
                    text(C.charcoal);
                    const maxValueW = contentW - 58;
                    const valueLines = doc.splitTextToSize(String(value), maxValueW);

                    doc.text(valueLines[0], margin + 56, yPos + 4.5);
                    if (valueLines.length > 1) {
                        for (let i = 1; i < valueLines.length; i++) {
                            yPos += 5;
                            doc.text(valueLines[i], margin + 56, yPos + 4.5);
                        }
                    }

                    yPos += 8;
                });

                // Bottom gap + thin border bottom
                stroke(C.midBlue);
                doc.setLineWidth(0.2);
                doc.line(margin, yPos, pageWidth - margin, yPos);
                yPos += 6;
            };

            // ═══════════════════════════════════════════════════════════════
            // SECTION DATA
            // ═══════════════════════════════════════════════════════════════

            // Source Visit
            addSection('Source Visit', [
                ['Officer', procurement.procurementOfficer],
                ['Source Type', procurement.sourceType === 'bazaar' ? 'Bazaar' : 'Farm'],
                ['Location', procurement.sourceLocation],
                ['Visit Date', formatSimpleDate(procurement.visitDate)],
                ['Visit Time', procurement.visitTime],
            ]);

            // Breeder
            if (procurement.breederName || procurement.breederContact) {
                addSection('Breeder Information', [
                    ['Breeder Name', procurement.breederName],
                    ['Breeder Contact', procurement.breederContact],
                ]);
            }

            // Animal Details
            const ageText = (procurement.ageYears || procurement.ageMonths)
                ? `${procurement.ageYears || 0} years  ${procurement.ageMonths || 0} months`
                : '—';

            addSection('Animal Details', [
                ['Breed', procurement.breed],
                ['Age', ageText],
                ['Milking Capacity', procurement.milkingCapacity ? `${procurement.milkingCapacity} L / day` : '—'],
                ['Calf Included', procurement.isCalfIncluded ? 'Yes' : 'No'],
                ['Physical Check', procurement.physicalCheck],
            ]);

            // Disease Screening
            addSection('Disease Screening', [
                ['FMD Status', procurement.fmdDisease ? 'Detected' : 'Not Detected'],
                ['LSD Status', procurement.lsdDisease ? 'Detected' : 'Not Detected'],
            ]);

            // Health Record
            if (procurement.healthRecord) {
                addSection('Health Record', [
                    ['Record Status', 'Available'],
                ]);
            }

            // Logistics
            if (procurement.vehicleNo) {
                addSection('Logistics', [
                    ['Vehicle Number', procurement.vehicleNo],
                    ['Driver Name', procurement.driverName],
                    ['Driver Mobile', procurement.driverMobile],
                    ['Driving License', procurement.drivingLicense],
                ]);
            }

            // Quarantine
            if (procurement.quarantineCenter) {
                addSection('Quarantine', [
                    ['Quarantine Center', procurement.quarantineCenter],
                    ['Health Record', procurement.quarantineHealthRecord ? 'Available' : 'Not Available'],
                    ['Final Health Clearance', procurement.finalHealthClearance ? 'Cleared' : 'Pending'],
                ]);
            }

            // Handover
            if (procurement.handoverOfficer) {
                addSection('Handover Details', [
                    ['Handover Officer', procurement.handoverOfficer],
                    ['Beneficiary ID', procurement.beneficiaryId],
                    ['Beneficiary Location', procurement.beneficiaryLocation],
                    ['Handover Date', formatSimpleDate(procurement.handoverDate)],
                    ['Handover Time', procurement.handoverTime],
                ]);
            }

            // Documents
            const docRows = [];
            if (procurement.licenseCertificate) docRows.push(['License Certificate', 'Available']);
            if (procurement.handoverDocument) docRows.push(['Handover Document', 'Available']);
            if (docRows.length > 0) addSection('Documents', docRows);

            // Photo Checklist
            const photoRows = [
                ['Front View', procurement.animalPhotoFront ? 'Uploaded' : 'Not Uploaded'],
                ['Side View', procurement.animalPhotoSide ? 'Uploaded' : 'Not Uploaded'],
                ['Rear View', procurement.animalPhotoRear ? 'Uploaded' : 'Not Uploaded'],
                ['Quarantine Center', procurement.quarantineCenterPhoto ? 'Uploaded' : 'Not Uploaded'],
                ['Handover Photo', procurement.handoverPhoto ? 'Uploaded' : 'Not Uploaded'],
            ];
            addSection('Photo Checklist', photoRows);

            // Remarks
            if (procurement.remarks) {
                checkBreak(40);

                fill(C.primaryBlue);
                doc.roundedRect(margin, yPos, contentW, 8, 1, 1, 'F');
                fill(C.gold);
                doc.rect(margin, yPos, 3, 8, 'F');
                text(C.white);
                doc.setFontSize(8.5);
                doc.setFont('helvetica', 'bold');
                doc.text('REMARKS', margin + 6, yPos + 5.5);
                yPos += 10;

                fill(C.lightBlue);
                const remarksLines = doc.splitTextToSize(procurement.remarks, contentW - 8);
                const remarksH = remarksLines.length * 5.5 + 6;
                doc.rect(margin, yPos, contentW, remarksH, 'F');
                text(C.charcoal);
                doc.setFontSize(8.5);
                doc.setFont('helvetica', 'normal');
                doc.text(remarksLines, margin + 4, yPos + 5);
                yPos += remarksH + 6;
            }

            // ── Footer on every page ──────────────────────────────────────
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);

                const fy = pageHeight - footerH;
                stroke(C.midBlue);
                doc.setLineWidth(0.5);
                doc.line(margin, fy, pageWidth - margin, fy);

                // Primary blue footer band (lighter version)
                fill(C.primaryBlue);
                doc.rect(0, fy + 0.5, pageWidth, footerH, 'F');
                // Gold strip right
                fill(C.gold);
                doc.rect(pageWidth - 6, fy + 0.5, 6, footerH, 'F');

                text(C.white);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'bold');
                doc.text('360° ANIMAL PARENTING', margin, fy + 7);

                doc.setFont('helvetica', 'normal');
                text([255, 255, 255]); // Pure white
                doc.setFontSize(6.5);
                doc.text(
                    `Created: ${formatDate(procurement.createdAt)}   |   By: ${procurement.createdBy || 'System'}   |   Tag ID: ${procurement.tagId || '—'}`,
                    margin, fy + 12
                );

                text(C.white);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'bold');
                doc.text(`${i} / ${totalPages}`, pageWidth - margin - 6, fy + 9, { align: 'right' });
            }

            // ── Save ──────────────────────────────────────────────────────
            doc.save(`360AP-Animal-Report-${procurement.tagId || 'details'}-${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('PDF downloaded successfully!', { id: 'pdf-download' });

        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF', { id: 'pdf-download' });
        } finally {
            setDownloading(prev => ({ ...prev, pdf: false }));
        }
    };

    return (
        <button
            onClick={handlePDFDownload}
            disabled={downloading.pdf}
            className={`
    flex items-center justify-center gap-2 sm:px-4
    px-2 py-1 rounded-lg border
    text-sm font-semibold
    transition
    ${downloading.pdf
                    ? "border-gray-400 text-gray-400 cursor-not-allowed sm"
                    : "border-sky-500 text-sky-500 hover:bg-sky-50"}
  `}
        >
            <FileText size={15} />

            {/* Text visible only on medium+ screens */}
            <span className="hidden sm:inline">
                {downloading.pdf ? "Generating" : "PDF"}
            </span>
        </button>
    );
};

export default ProcurementPDFDownload;