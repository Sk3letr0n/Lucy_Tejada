/**
 * downloads.ts — Utilidades para generar y descargar archivos en el navegador.
 *
 * - CSV   → blob text/csv, descarga directa
 * - Excel → tabla HTML con mime de Excel (.xls), descarga directa
 * - PDF   → jsPDF genera un .pdf real sin diálogo de impresión
 *
 * Funciona 100% client-side.
 */

/** Lanza la descarga de un Blob con el nombre indicado */
function descargarBlob(blob: Blob, nombreArchivo: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Escapa un valor para que sea válido como celda de CSV */
function escaparCSV(valor: unknown): string {
  const texto = String(valor ?? '');
  if (/[",\n;]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

// ── CSV ──────────────────────────────────────────────────────────────────────

export interface ColumnaTabla<T> {
  encabezado: string;
  obtener: (fila: T) => string | number;
}

export function descargarCSV<T>(
  filas: T[],
  columnas: ColumnaTabla<T>[],
  nombreArchivo: string,
): void {
  const headers = columnas.map((c) => escaparCSV(c.encabezado)).join(',');
  const cuerpo  = filas
    .map((fila) => columnas.map((c) => escaparCSV(c.obtener(fila))).join(','))
    .join('\n');

  // BOM para que Excel detecte UTF-8 correctamente
  const csv = `\uFEFF${headers}\n${cuerpo}`;
  descargarBlob(
    new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    nombreArchivo.endsWith('.csv') ? nombreArchivo : `${nombreArchivo}.csv`,
  );
}

// ── Excel (HTML compatible) ─────────────────────────────────────────────────

export function descargarExcel<T>(
  filas: T[],
  columnas: ColumnaTabla<T>[],
  nombreArchivo: string,
  titulo?: string,
): void {
  const escapeHtml = (s: unknown) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const headerHtml = columnas
    .map((c) => `<th style="background:#1e40af;color:#fff;padding:8px;text-align:left">${escapeHtml(c.encabezado)}</th>`)
    .join('');

  const bodyHtml = filas
    .map((fila) => {
      const celdas = columnas
        .map((c) => `<td style="padding:6px;border:1px solid #ddd">${escapeHtml(c.obtener(fila))}</td>`)
        .join('');
      return `<tr>${celdas}</tr>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="utf-8"></head>
<body>
  ${titulo ? `<h2>${escapeHtml(titulo)}</h2>` : ''}
  <table border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px">
    <thead><tr>${headerHtml}</tr></thead>
    <tbody>${bodyHtml}</tbody>
  </table>
</body></html>`;

  descargarBlob(
    new Blob([html], { type: 'application/vnd.ms-excel' }),
    nombreArchivo.endsWith('.xls') ? nombreArchivo : `${nombreArchivo}.xls`,
  );
}

// ── PDF (jsPDF — archivo .pdf real) ─────────────────────────────────────────

export function descargarPDF<T>(
  filas: T[],
  columnas: ColumnaTabla<T>[],
  nombreArchivo: string,
  titulo: string,
  subtitulo?: string,
): void {
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    const PAGE_W   = doc.internal.pageSize.getWidth();
    const MARGIN   = 36;
    const COL_W    = (PAGE_W - MARGIN * 2) / columnas.length;
    const ROW_H    = 18;
    const HEAD_H   = 22;

    // ── Encabezado ──────────────────────────────────────────────────────────
    doc.setFontSize(18);
    doc.setTextColor(30, 64, 175);  // azul
    doc.text(titulo, MARGIN, MARGIN + 14);

    let cursorY = MARGIN + 14;
    if (subtitulo) {
      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128);
      cursorY += 16;
      doc.text(subtitulo, MARGIN, cursorY);
    }

    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    cursorY += 13;
    const fecha = new Date().toLocaleString('es-CO');
    doc.text(`Instituto Lucy Tejada · Generado el ${fecha}`, MARGIN, cursorY);

    cursorY += 14;
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(1.5);
    doc.line(MARGIN, cursorY, PAGE_W - MARGIN, cursorY);
    cursorY += 10;

    // ── Cabecera de la tabla ─────────────────────────────────────────────────
    doc.setFillColor(30, 64, 175);
    doc.rect(MARGIN, cursorY, PAGE_W - MARGIN * 2, HEAD_H, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    columnas.forEach((col, i) => {
      doc.text(col.encabezado, MARGIN + i * COL_W + 4, cursorY + 14, { maxWidth: COL_W - 6 });
    });
    cursorY += HEAD_H;

    // ── Filas ────────────────────────────────────────────────────────────────
    doc.setFontSize(8);
    filas.forEach((fila, rowIdx) => {
      // Nueva página si no hay espacio
      if (cursorY + ROW_H > doc.internal.pageSize.getHeight() - MARGIN) {
        doc.addPage();
        cursorY = MARGIN;
      }

      if (rowIdx % 2 === 1) {
        doc.setFillColor(249, 250, 251);
        doc.rect(MARGIN, cursorY, PAGE_W - MARGIN * 2, ROW_H, 'F');
      }

      doc.setTextColor(31, 41, 55);
      columnas.forEach((col, i) => {
        const val = String(col.obtener(fila) ?? '');
        doc.text(val, MARGIN + i * COL_W + 4, cursorY + 12, { maxWidth: COL_W - 6 });
      });

      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(MARGIN, cursorY + ROW_H, PAGE_W - MARGIN, cursorY + ROW_H);
      cursorY += ROW_H;
    });

    // ── Pie de página ────────────────────────────────────────────────────────
    const totalPages = (doc.internal as { getNumberOfPages(): number }).getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Página ${p} de ${totalPages}`,
        PAGE_W / 2,
        doc.internal.pageSize.getHeight() - 16,
        { align: 'center' },
      );
    }

    doc.save(nombreArchivo.endsWith('.pdf') ? nombreArchivo : `${nombreArchivo}.pdf`);
  });
}
