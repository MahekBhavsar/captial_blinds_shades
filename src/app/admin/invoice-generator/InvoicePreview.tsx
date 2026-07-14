import React, { useState } from 'react';
import styles from './InvoicePreview.module.css';
import { Mail, Phone, MapPin, Globe, User, Landmark, FileText, Star, Download } from 'lucide-react';
import { InvoiceData } from './page';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface InvoicePreviewProps {
  data: InvoiceData;
  onClose: () => void;
}

export default function InvoicePreview({ data, onClose }: InvoicePreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await document.fonts.ready;
      
      const element = document.getElementById('invoice-capture');
      if (!element) return;
      
      const originalBoxShadow = element.style.boxShadow;
      element.style.boxShadow = 'none';

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      element.style.boxShadow = originalBoxShadow;
      
      const imgData = canvas.toDataURL('image/png');
      
      // Standard A4 width in mm
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${data.invoiceNumber || 'New'}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Invoice Preview</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={handleDownloadPDF} 
              disabled={isGenerating}
              style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isGenerating ? 'not-allowed' : 'pointer', fontWeight: 500 }}
            >
              <Download size={16} /> {isGenerating ? "Generating..." : "Download PDF"}
            </button>
            <button className={styles.closeBtn} onClick={onClose}>Close</button>
          </div>
        </div>
        
        <div className={styles.previewContainer}>
          <div className={styles.invoicePaper} id="invoice-capture">
            {/* Top Section Layout (Logo + Bill To on left, Company Info on right) */}
            <div className={styles.topSectionWrapper}>
              
              {/* Left Column */}
              <div className={styles.leftColumn}>
                <div className={styles.logoSection}>
                   <img src="/CPS-PrimaryLogo.jpg" alt="Logo" className={styles.logo} />
                </div>
                
                {/* Bill To */}
                <div className={styles.billToSection}>
                   <div className={styles.billToHeader}>
                      <div className={styles.billToIconWrapper}><User size={16} /></div>
                      <h3>BILL TO:</h3>
                   </div>
                   <div className={styles.billToDetails}>
                      <strong>{data.clientName}</strong>
                      <div>{data.contactName}</div>
                      <div>{data.addressLine1}</div>
                      <div>{data.addressLine2}</div>
                      {data.phone && (
                        <div className={styles.clientPhone}>
                          <Phone size={14} className={styles.icon} />
                          {data.phone}
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Right Column: Company Info */}
              <div className={styles.companyInfoWrapper}>
                <div className={styles.companyInfo}>
                  <h1 className={styles.taxInvoiceTitle}>TAX INVOICE</h1>
                  <div className={styles.invoiceMeta}>
                     <div className={styles.metaRow}>
                       <span className={styles.metaLabel}>DATE:</span>
                       <span className={styles.metaValue}>{data.invoiceDate || 'DD/MM/YYYY'}</span>
                     </div>
                     <div className={styles.metaRow}>
                       <span className={styles.metaLabel}>INVOICE #:</span>
                       <span className={styles.metaValue}>{data.invoiceNumber || '---'}</span>
                     </div>
                  </div>
                  
                  <h2 className={styles.companyName}>{data.companyName}</h2>
                  <div className={styles.contactItem}>
                    <MapPin size={14} className={styles.icon} />
                    <span>{data.companyAddress}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <Phone size={14} className={styles.icon} />
                    <span>{data.companyPhone}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <Mail size={14} className={styles.icon} />
                    <span>{data.companyEmail}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <Globe size={14} className={styles.icon} />
                    <span>{data.companyWebsite}</span>
                  </div>
                  <div className={styles.abnItem}>
                    <span className={styles.abnLabel}>ABN:</span> {data.companyABN}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th className={styles.colItem}>ITEM</th>
                  <th className={styles.colUnitCost}>UNIT COST</th>
                  <th className={styles.colQty}>QUANTITY</th>
                  <th className={styles.colTotal}>LINE TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{formatCurrency(item.unitCost)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitCost * item.quantity)}</td>
                  </tr>
                ))}
                {/* Fill empty rows to make it look like paper */}
                {Array.from({ length: Math.max(0, 5 - data.items.length) }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className={styles.totalsSection}>
              <table className={styles.totalsTable}>
                 <tbody>
                    <tr>
                      <td className={styles.totalsLabel}>SUBTOTAL</td>
                      <td className={styles.totalsValue}>{formatCurrency(data.subtotal)}</td>
                    </tr>
                    <tr>
                      <td className={styles.totalsLabel}>TAX (GST)</td>
                      <td className={styles.totalsValue}>{formatCurrency(data.taxAmount)}</td>
                    </tr>
                    <tr className={styles.totalDueRow}>
                      <td className={styles.totalsLabel}>TOTAL DUE</td>
                      <td className={styles.totalsValue}>{formatCurrency(data.totalDue)}</td>
                    </tr>
                 </tbody>
              </table>
            </div>

            {/* Payment Details */}
            <div className={styles.bottomSection}>
               <div className={styles.bankDetails}>
                  <div className={styles.bankHeader}>
                     <div className={styles.bankIcon}><Landmark size={24} color="white" /></div>
                     <div>PAYING VIA <strong>BANK TRANSFER:</strong></div>
                  </div>
                  <table className={styles.bankTable}>
                     <tbody>
                        <tr>
                          <td>ACCOUNT NAME</td>
                          <td>: {data.accountName}</td>
                        </tr>
                        <tr>
                          <td>BSB</td>
                          <td>: {data.bsb}</td>
                        </tr>
                        <tr>
                          <td>ACCOUNT NUMBER</td>
                          <td>: {data.accountNumber}</td>
                        </tr>
                        <tr>
                          <td>PAYMENT REFERENCE</td>
                          <td>: INV-{data.invoiceNumber || '---'}</td>
                        </tr>
                     </tbody>
                  </table>
                  <div className={styles.bankFooter}>
                    (Please use invoice number as reference)
                  </div>
               </div>
               
               <div className={styles.paymentTerms}>
                  <div className={styles.termsHeader}>
                     <FileText size={24} className={styles.termsIcon} />
                     <strong>PAYMENT TERMS</strong>
                  </div>
                  <div className={styles.termsContent}>
                     {data.paymentTerms.split('\n').map((line, i) => (
                       <p key={i}>{line}</p>
                     ))}
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
               <div className={styles.footerLeft}>
                  <div className={styles.starIcon}><Star size={16} color="white" /></div>
                  <div className={styles.footerThanks}>
                    <strong>THANK YOU FOR YOUR BUSINESS!</strong>
                    <div>We look forward to working with you again.</div>
                  </div>
               </div>
               <div className={styles.footerRight}>
                  <span>We print. You shine.</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
