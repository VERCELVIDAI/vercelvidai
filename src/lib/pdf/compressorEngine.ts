import { PDFDocument } from 'pdf-lib';

export interface AdvancedCompressOptions {
  mode: 'target_size' | 'preset' | 'manual' | 'lossless_vector';
  targetSizeKb?: number; // e.g. 100, 200, 500, 1024
  presetLevel?: 'extreme' | 'recommended' | 'low';
  quality?: number; // 0.1 to 1.0 (default 0.65)
  dpi?: 72 | 100 | 150 | 200 | 300; // Resolution DPI
  grayscale?: boolean; // Convert to B&W / Grayscale for maximum reduction
  removeMetadata?: boolean;
  onProgress?: (progress: number, status: string) => void;
}

export interface AdvancedCompressionResult {
  pdfBytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savingsPercent: number;
  pageCount: number;
  qualityUsed: number;
  scaleUsed: number;
}

/**
 * Format bytes into human-readable string (KB, MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Advanced Client-Side PDF Compressor
 * Supports Target File Size (e.g. 200 KB for Govt/Portal uploads),
 * Resolution DPI Downscaling, Grayscale Conversion, and Quality tuning.
 */
export async function compressPdfAdvanced(
  fileData: ArrayBuffer | Uint8Array,
  options: AdvancedCompressOptions
): Promise<AdvancedCompressionResult> {
  const originalSize = fileData.byteLength;
  const onProgress = options.onProgress || (() => {});

  onProgress(0.05, 'Initializing compression engine...');

  // If Lossless Vector mode is chosen, preserve vector paths and text
  if (options.mode === 'lossless_vector') {
    onProgress(0.2, 'Optimizing PDF vector streams...');
    const doc = await PDFDocument.load(fileData, { ignoreEncryption: true });
    const count = doc.getPageCount();

    const cleanDoc = await PDFDocument.create();
    if (options.removeMetadata !== false) {
      cleanDoc.setTitle('');
      cleanDoc.setAuthor('');
      cleanDoc.setProducer('Fluvia Flow PDF Engine');
      cleanDoc.setCreator('Fluvia Flow AI Suite');
    }

    const pages = await cleanDoc.copyPages(doc, Array.from({ length: count }, (_, i) => i));
    for (const p of pages) {
      cleanDoc.addPage(p);
    }

    onProgress(0.8, 'Rebuilding cross-reference stream...');
    const pdfBytes = await cleanDoc.save({ useObjectStreams: true });
    const compressedSize = pdfBytes.byteLength;
    const savedBytes = Math.max(0, originalSize - compressedSize);
    const savingsPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

    onProgress(1.0, 'Vector compression complete!');
    return {
      pdfBytes,
      originalSize,
      compressedSize,
      savedBytes,
      savingsPercent,
      pageCount: count,
      qualityUsed: 1.0,
      scaleUsed: 1.0,
    };
  }

  // Visual/Raster & Target-size optimizer using pdfjs-dist offscreen rendering
  onProgress(0.1, 'Loading document renderer...');
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  }

  const loadingTask = pdfjsLib.getDocument({
    data: fileData instanceof Uint8Array ? fileData : new Uint8Array(fileData),
  });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  // Determine scale and JPEG quality based on mode
  let scale = 1.0;
  let quality = 0.65;

  if (options.mode === 'target_size' && options.targetSizeKb) {
    const targetBytes = options.targetSizeKb * 1024;
    const targetPerPage = targetBytes / numPages;

    if (targetPerPage < 35 * 1024) {
      // Extremely tight budget (e.g. 50-100KB total)
      scale = 0.7;
      quality = 0.3;
    } else if (targetPerPage < 75 * 1024) {
      // ~100-200KB total
      scale = 0.85;
      quality = 0.45;
    } else if (targetPerPage < 180 * 1024) {
      // ~200-500KB total
      scale = 1.0;
      quality = 0.6;
    } else if (targetPerPage < 400 * 1024) {
      // ~1MB total
      scale = 1.25;
      quality = 0.72;
    } else {
      // 2MB+
      scale = 1.4;
      quality = 0.82;
    }
  } else if (options.mode === 'preset') {
    if (options.presetLevel === 'extreme') {
      scale = 0.8;
      quality = 0.4;
    } else if (options.presetLevel === 'low') {
      scale = 1.35;
      quality = 0.82;
    } else {
      // recommended
      scale = 1.05;
      quality = 0.65;
    }
  } else if (options.mode === 'manual') {
    quality = typeof options.quality === 'number' ? options.quality : 0.65;
    const dpi = options.dpi || 150;
    scale = dpi / 72;
    scale = Math.min(2.5, Math.max(0.6, scale));
  }

  // Create clean new PDFDocument for output
  const newPdfDoc = await PDFDocument.create();

  if (options.removeMetadata !== false) {
    newPdfDoc.setTitle('');
    newPdfDoc.setAuthor('');
    newPdfDoc.setProducer('Fluvia Flow PDF Studio');
    newPdfDoc.setCreator('Fluvia Flow AI Suite');
  }

  // Create canvas for rendering
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not create offscreen canvas for PDF processing');

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const progress = 0.15 + (pageNum / numPages) * 0.75;
    onProgress(progress, `Optimizing page ${pageNum} of ${numPages}...`);

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const originalViewport = page.getViewport({ scale: 1.0 });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Convert to grayscale if requested
    if (options.grayscale) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Convert canvas to JPEG blob
    const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
    const base64Data = jpegDataUrl.split(',')[1];
    const binaryStr = atob(base64Data);
    const jpegBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      jpegBytes[i] = binaryStr.charCodeAt(i);
    }

    // Embed into new document
    const embeddedImg = await newPdfDoc.embedJpg(jpegBytes);
    const newPage = newPdfDoc.addPage([originalViewport.width, originalViewport.height]);
    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });
  }

  onProgress(0.93, 'Encoding compressed PDF binary...');
  const pdfBytes = await newPdfDoc.save({ useObjectStreams: true });
  const compressedSize = pdfBytes.byteLength;
  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savingsPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  onProgress(1.0, 'Compression complete!');

  return {
    pdfBytes,
    originalSize,
    compressedSize,
    savedBytes,
    savingsPercent,
    pageCount: numPages,
    qualityUsed: quality,
    scaleUsed: scale,
  };
}
