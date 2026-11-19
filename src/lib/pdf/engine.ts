import {
  PDFDocument,
  rgb,
  degrees,
  StandardFonts,
  PDFPage,
  PDFFont,
  PageSizes,
} from 'pdf-lib';

export {
  compressPdfAdvanced,
  type AdvancedCompressOptions,
  type AdvancedCompressionResult,
} from './compressorEngine';

export interface TextAnnotation {
  id: string;
  pageIndex: number;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string; // Hex color e.g. "#111827" or "#EF4444"
  fontFamily: 'Helvetica' | 'Helvetica-Bold' | 'Times-Roman' | 'Courier';
  opacity: number;
}

export interface WatermarkConfig {
  text: string;
  size: number;
  color: string;
  opacity: number;
  rotation: number; // degrees e.g. 45
  applyToAll: boolean;
  pageIndex?: number;
}

export interface PageNumberConfig {
  enabled: boolean;
  format: 'number' | 'page_n' | 'page_n_of_total'; // "1" | "Page 1" | "Page 1 of 5"
  position: 'bottom-center' | 'bottom-right' | 'top-right' | 'bottom-left';
  size: number;
  color: string;
  startFrom: number;
}

export interface PageTransform {
  pageIndex: number;
  rotationDelta: number; // 0, 90, 180, 270
  deleted?: boolean;
}

export interface CompressionResult {
  pdfBytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savingsPercent: number;
  pageCount: number;
}

export interface PdfDocumentInfo {
  pageCount: number;
  title?: string;
  author?: string;
  creator?: string;
  fileSizeBytes: number;
  pageSizes: Array<{ width: number; height: number; pageNumber: number }>;
}

/**
 * Helper to convert Hex color "#RRGGBB" to pdf-lib rgb()
 */
export function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return rgb(isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b);
}

/**
 * Inspect a PDF file and return metadata
 */
export async function inspectPdf(fileData: ArrayBuffer | Uint8Array): Promise<PdfDocumentInfo> {
  const doc = await PDFDocument.load(fileData, { ignoreEncryption: true });
  const pageCount = doc.getPageCount();
  const pages = doc.getPages();
  const pageSizes = pages.map((p, idx) => {
    const { width, height } = p.getSize();
    return { width: Math.round(width), height: Math.round(height), pageNumber: idx + 1 };
  });

  return {
    pageCount,
    title: doc.getTitle() || undefined,
    author: doc.getAuthor() || undefined,
    creator: doc.getCreator() || undefined,
    fileSizeBytes: fileData.byteLength,
    pageSizes,
  };
}

/**
 * Apply full edits (text annotations, watermarks, page transformations, page numbers) to a PDF
 */
export async function applyPdfEdits(
  fileData: ArrayBuffer | Uint8Array,
  options: {
    annotations?: TextAnnotation[];
    watermark?: WatermarkConfig;
    pageNumbers?: PageNumberConfig;
    pageTransforms?: Record<number, PageTransform>;
  }
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileData);
  const totalPages = doc.getPageCount();

  // Load standard fonts
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const timesRoman = await doc.embedFont(StandardFonts.TimesRoman);
  const courier = await doc.embedFont(StandardFonts.Courier);

  const getFont = (family?: string): PDFFont => {
    switch (family) {
      case 'Helvetica-Bold':
        return helveticaBold;
      case 'Times-Roman':
        return timesRoman;
      case 'Courier':
        return courier;
      default:
        return helvetica;
    }
  };

  const pages = doc.getPages();

  // 1. Apply page rotations if requested
  if (options.pageTransforms) {
    Object.entries(options.pageTransforms).forEach(([idxStr, transform]) => {
      const idx = parseInt(idxStr, 10);
      if (idx >= 0 && idx < pages.length && transform.rotationDelta) {
        const page = pages[idx];
        const currentRot = page.getRotation().angle;
        page.setRotation(degrees((currentRot + transform.rotationDelta) % 360));
      }
    });
  }

  // 2. Apply Watermark
  if (options.watermark && options.watermark.text.trim().length > 0) {
    const wm = options.watermark;
    const font = helveticaBold;
    const color = hexToRgb(wm.color);

    const pagesToWatermark = wm.applyToAll
      ? pages
      : typeof wm.pageIndex === 'number' && pages[wm.pageIndex]
      ? [pages[wm.pageIndex]]
      : pages;

    for (const page of pagesToWatermark) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(wm.text, wm.size);
      const textHeight = font.heightAtSize(wm.size);

      // Centered position
      const centerX = width / 2;
      const centerY = height / 2;

      page.drawText(wm.text, {
        x: centerX - (textWidth / 2) * Math.cos((wm.rotation * Math.PI) / 180),
        y: centerY - (textHeight / 2) * Math.sin((wm.rotation * Math.PI) / 180),
        size: wm.size,
        font,
        color,
        opacity: Math.max(0.05, Math.min(1, wm.opacity)),
        rotate: degrees(wm.rotation),
      });
    }
  }

  // 3. Apply Text Annotations
  if (options.annotations && options.annotations.length > 0) {
    for (const ann of options.annotations) {
      if (ann.pageIndex >= 0 && ann.pageIndex < pages.length && ann.text.trim()) {
        const page = pages[ann.pageIndex];
        const font = getFont(ann.fontFamily);
        const color = hexToRgb(ann.color);

        page.drawText(ann.text, {
          x: ann.x,
          y: ann.y,
          size: ann.size,
          font,
          color,
          opacity: Math.max(0.1, Math.min(1, ann.opacity)),
        });
      }
    }
  }

  // 4. Apply Page Numbers
  if (options.pageNumbers && options.pageNumbers.enabled) {
    const pCfg = options.pageNumbers;
    const font = helvetica;
    const color = hexToRgb(pCfg.color || '#4B5563');
    const startFrom = pCfg.startFrom || 1;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageNum = i + startFrom;
      let label = `${pageNum}`;

      if (pCfg.format === 'page_n') {
        label = `Page ${pageNum}`;
      } else if (pCfg.format === 'page_n_of_total') {
        label = `Page ${pageNum} of ${totalPages + startFrom - 1}`;
      }

      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(label, pCfg.size);
      let posX = width / 2 - textWidth / 2;
      let posY = 24;

      if (pCfg.position === 'bottom-center') {
        posX = width / 2 - textWidth / 2;
        posY = 24;
      } else if (pCfg.position === 'bottom-right') {
        posX = width - textWidth - 36;
        posY = 24;
      } else if (pCfg.position === 'bottom-left') {
        posX = 36;
        posY = 24;
      } else if (pCfg.position === 'top-right') {
        posX = width - textWidth - 36;
        posY = height - 28;
      }

      page.drawText(label, {
        x: posX,
        y: posY,
        size: pCfg.size,
        font,
        color,
      });
    }
  }

  // 5. Delete pages if requested (must do from highest index to lowest)
  if (options.pageTransforms) {
    const indicesToDelete = Object.entries(options.pageTransforms)
      .filter(([_, t]) => t.deleted)
      .map(([idxStr]) => parseInt(idxStr, 10))
      .sort((a, b) => b - a);

    // Only delete if at least 1 page will remain
    if (indicesToDelete.length < doc.getPageCount()) {
      for (const idx of indicesToDelete) {
        if (idx >= 0 && idx < doc.getPageCount()) {
          doc.removePage(idx);
        }
      }
    }
  }

  return await doc.save({ useObjectStreams: true });
}

/**
 * Optimize and compress PDF by removing redundant object streams, flattening annotations,
 * and rebuilding structural cross-reference tables.
 */
export async function compressPdf(
  fileData: ArrayBuffer | Uint8Array,
  level: 'low' | 'recommended' | 'extreme' = 'recommended'
): Promise<CompressionResult> {
  const originalSize = fileData.byteLength;
  const doc = await PDFDocument.load(fileData, { ignoreEncryption: true });
  const pageCount = doc.getPageCount();

  // Create a clean destination document
  const compressedDoc = await PDFDocument.create();

  // Strip unneeded document metadata if extreme or recommended
  if (level === 'extreme' || level === 'recommended') {
    compressedDoc.setTitle('');
    compressedDoc.setAuthor('');
    compressedDoc.setSubject('');
    compressedDoc.setKeywords([]);
    compressedDoc.setProducer('Fluvia Flow PDF Engine');
    compressedDoc.setCreator('Fluvia Flow AI Suite');
  } else {
    if (doc.getTitle()) compressedDoc.setTitle(doc.getTitle()!);
    if (doc.getAuthor()) compressedDoc.setAuthor(doc.getAuthor()!);
  }

  // Copy all pages into the pristine document
  const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
  const copiedPages = await compressedDoc.copyPages(doc, pageIndices);

  for (const page of copiedPages) {
    compressedDoc.addPage(page);
  }

  // Save with optimized object streams and structural cross-reference table compression
  const pdfBytes = await compressedDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
    updateFieldAppearances: level === 'low',
  });

  const compressedSize = pdfBytes.byteLength;
  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savingsPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  return {
    pdfBytes,
    originalSize,
    compressedSize,
    savedBytes,
    savingsPercent,
    pageCount,
  };
}

/**
 * Merge multiple PDF files into a single master PDF document
 */
export async function mergePdfs(
  files: Array<{ data: ArrayBuffer | Uint8Array; name: string }>
): Promise<{ pdfBytes: Uint8Array; totalPages: number }> {
  if (files.length === 0) {
    throw new Error('At least one PDF file must be provided to merge.');
  }

  const mergedDoc = await PDFDocument.create();
  let totalPages = 0;

  for (const file of files) {
    const srcDoc = await PDFDocument.load(file.data, { ignoreEncryption: true });
    const count = srcDoc.getPageCount();
    const pageIndices = Array.from({ length: count }, (_, i) => i);
    const copiedPages = await mergedDoc.copyPages(srcDoc, pageIndices);

    for (const page of copiedPages) {
      mergedDoc.addPage(page);
      totalPages++;
    }
  }

  const pdfBytes = await mergedDoc.save({ useObjectStreams: true });
  return { pdfBytes, totalPages };
}

/**
 * Split or extract page ranges from a PDF document
 * rangeExpr format example: "1, 3-5, 8"
 */
export async function splitPdf(
  fileData: ArrayBuffer | Uint8Array,
  rangeExpr: string
): Promise<{ pdfBytes: Uint8Array; extractedCount: number }> {
  const doc = await PDFDocument.load(fileData, { ignoreEncryption: true });
  const totalPages = doc.getPageCount();

  // Parse range expression
  const selectedIndices = new Set<number>();
  const parts = rangeExpr.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          selectedIndices.add(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        selectedIndices.add(pageNum - 1);
      }
    }
  }

  const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);
  if (sortedIndices.length === 0) {
    throw new Error('No valid pages selected to extract.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(doc, sortedIndices);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  const pdfBytes = await newDoc.save({ useObjectStreams: true });
  return { pdfBytes, extractedCount: sortedIndices.length };
}

/**
 * Convert an array of image files (JPEG, PNG) into a clean, vector-aligned PDF
 */
export async function imagesToPdf(
  images: Array<{
    data: ArrayBuffer;
    type: 'image/jpeg' | 'image/png' | 'image/jpg' | string;
    name: string;
  }>,
  options: {
    pageSize: 'A4' | 'Letter' | 'Fit';
    margin: number;
    orientation: 'portrait' | 'landscape';
  } = { pageSize: 'A4', margin: 20, orientation: 'portrait' }
): Promise<{ pdfBytes: Uint8Array; pageCount: number }> {
  if (images.length === 0) {
    throw new Error('Please provide at least one image to convert.');
  }

  const doc = await PDFDocument.create();

  for (const img of images) {
    let embeddedImage;
    const isPng = img.type.toLowerCase().includes('png') || img.name.toLowerCase().endsWith('.png');

    if (isPng) {
      embeddedImage = await doc.embedPng(img.data);
    } else {
      embeddedImage = await doc.embedJpg(img.data);
    }

    const { width: imgW, height: imgH } = embeddedImage;

    let pageWidth = PageSizes.A4[0];
    let pageHeight = PageSizes.A4[1];

    if (options.pageSize === 'Letter') {
      pageWidth = PageSizes.Letter[0];
      pageHeight = PageSizes.Letter[1];
    } else if (options.pageSize === 'Fit') {
      pageWidth = imgW + options.margin * 2;
      pageHeight = imgH + options.margin * 2;
    }

    if (options.pageSize !== 'Fit' && options.orientation === 'landscape') {
      const temp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = temp;
    }

    const page = doc.addPage([pageWidth, pageHeight]);
    const margin = options.margin;
    const availableW = pageWidth - margin * 2;
    const availableH = pageHeight - margin * 2;

    // Calculate aspect ratio fit
    const scale = Math.min(availableW / imgW, availableH / imgH, 1);
    const drawW = imgW * scale;
    const drawH = imgH * scale;

    const posX = margin + (availableW - drawW) / 2;
    const posY = margin + (availableH - drawH) / 2;

    page.drawImage(embeddedImage, {
      x: posX,
      y: posY,
      width: drawW,
      height: drawH,
    });
  }

  const pdfBytes = await doc.save({ useObjectStreams: true });
  return { pdfBytes, pageCount: images.length };
}

/**
 * Format raw bytes into human readable KB / MB
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
