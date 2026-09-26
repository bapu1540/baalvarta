import { PrintableWorksheet, Story, Language } from '../types';
import confetti from 'canvas-confetti';

/**
 * Generates a high-resolution printable 1200x1600 canvas worksheet
 * and triggers immediate image/PDF download.
 */
export function downloadOrPrintWorksheet(sheet: PrintableWorksheet, language: Language = 'hi'): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const isHi = language === 'hi';
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Fallback: open print URL directly if canvas fails
        window.open(sheet.printUrl || sheet.thumbnailUrl, '_blank');
        resolve(true);
        return;
      }

      // Crisp White Page Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 1600);

      // Playful Double Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.strokeRect(36, 36, 1128, 1528);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.strokeRect(52, 52, 1096, 1496);

      // Decorative Corner Accents
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(60, 60);
      drawCorner(1140, 60);
      drawCorner(60, 1540);
      drawCorner(1140, 1540);

      // Header Branding: Baalvarta
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 38px system-ui, "Baloo 2", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📖 बालवार्ता (Baalvarta) • निःशुल्क बाल अभ्यास वर्कशीट', 600, 115);

      // Sheet Title
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 32px system-ui, "Baloo 2", sans-serif';
      ctx.fillText(isHi ? sheet.titleHi : sheet.titleEn, 600, 170);

      // Student Meta Fields
      ctx.fillStyle = '#475569';
      ctx.font = '600 20px system-ui, "Baloo 2", sans-serif';
      ctx.fillText(
        isHi
          ? `विद्यार्थी का नाम: ____________________   दिनांक: _________   आयु वर्ग: ${sheet.ageGroup}`
          : `Student Name: ____________________   Date: _________   Age Group: ${sheet.ageGroup}`,
        600,
        220
      );

      // Separator rule
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 245);
      ctx.lineTo(1120, 245);
      ctx.stroke();

      // Main Activity Area Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(90, 275, 1020, 1160);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.strokeRect(90, 275, 1020, 1160);

      // Instruction / Description inside activity box
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 24px system-ui, "Baloo 2", sans-serif';
      ctx.fillText(isHi ? sheet.descriptionHi : sheet.descriptionEn, 600, 335);

      // Tracing or Activity Guideline lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      for (let y = 420; y <= 1360; y += 76) {
        ctx.beginPath();
        ctx.moveTo(130, y);
        ctx.lineTo(1070, y);
        ctx.stroke();
      }

      // Category Watermark Tag
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 20px system-ui, "Baloo 2", sans-serif';
      const catText = isHi
        ? sheet.category === 'coloring'
          ? '🎨 कलरिंग व ड्राइंग एक्टिविटी'
          : sheet.category === 'tracing'
          ? '✍️ हस्तलेखन व वर्णमाला अभ्यास'
          : '🧩 ज्ञानवर्धक बाल पहेली'
        : sheet.category.toUpperCase();
      ctx.fillText(catText, 600, 1400);

      // Footer Note
      ctx.fillStyle = '#64748b';
      ctx.font = '18px system-ui, "Baloo 2", sans-serif';
      ctx.fillText(
        'बालवार्ता • 100% निःशुल्क एवं सुरक्षित भारतीय बाल पोर्टल • www.baalvarta.com',
        600,
        1500
      );

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `Baalvarta-Worksheet-${sheet.id || 'printable'}.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      try {
        confetti({ particleCount: 40, spread: 60 });
      } catch {
        // ignore
      }

      resolve(true);
    } catch (e) {
      console.error('Worksheet print failed, falling back:', e);
      window.open(sheet.printUrl || sheet.thumbnailUrl, '_blank');
      resolve(false);
    }
  });
}

/**
 * Formats a story into a clean printable page for printing or saving as PDF
 */
export function printStoryPdf(story: Story, language: Language = 'hi') {
  const isHi = language === 'hi';
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const title = isHi ? story.titleHi : story.titleEn;
  const content = isHi ? story.contentHi : story.contentEn;
  const moral = isHi ? story.moralHi : story.moralEn;
  const summary = isHi ? story.summaryHi : story.summaryEn;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <title>${title} - बालवार्ता Printable Story</title>
      <style>
        @page { size: A4; margin: 18mm; }
        body {
          font-family: 'Baloo 2', 'Mukta', system-ui, -apple-system, sans-serif;
          color: #1e293b;
          line-height: 1.7;
          background: #ffffff;
        }
        .header {
          text-align: center;
          border-bottom: 3px double #f59e0b;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .brand {
          font-size: 22px;
          font-weight: 800;
          color: #b45309;
        }
        .title {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          margin: 8px 0;
        }
        .meta {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
        }
        .cover {
          text-align: center;
          margin: 16px 0;
        }
        .cover img {
          max-height: 240px;
          max-width: 90%;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }
        .summary {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 10px 14px;
          font-size: 14px;
          border-radius: 6px;
          margin-bottom: 18px;
        }
        .content {
          font-size: 15px;
          text-align: justify;
          white-space: pre-line;
        }
        .moral {
          margin-top: 24px;
          background: #ecfdf5;
          border: 2px solid #10b981;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          font-weight: bold;
          color: #065f46;
          font-size: 16px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">📖 बालवार्ता (Baalvarta) • भारतीय बाल संस्कार व कहानियाँ</div>
        <h1 class="title">${title}</h1>
        <div class="meta">श्रेणी: ${story.category} | कहानी #${story.number} | पठन समय: ${story.readTime}</div>
      </div>

      ${story.coverImage ? `<div class="cover"><img src="${story.coverImage}" alt="${title}" /></div>` : ''}

      ${summary ? `<div class="summary"><strong>${isHi ? 'संक्षिप्त सारांश:' : 'Summary:'}</strong> ${summary}</div>` : ''}

      <div class="content">${content}</div>

      ${moral ? `<div class="moral">🌟 ${isHi ? 'कहानी की सीख (Moral):' : 'Moral:'} ${moral}</div>` : ''}

      <div class="footer">
        मुफ्त सचित्र कहानियों और वर्कशीट के लिए विजिट करें: www.baalvarta.com
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
