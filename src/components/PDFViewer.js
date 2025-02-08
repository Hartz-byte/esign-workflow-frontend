// src/components/PdfViewer.js
import { useState, useMemo, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";

export default function PDFViewer({ url, onPositionSelect }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  const fileObject = useMemo(
    () => ({
      url: url,
      httpHeaders: {
        "Access-Control-Allow-Origin": "*",
      },
    }),
    [url]
  );

  const handleClick = useCallback(
    (e) => {
      if (!onPositionSelect) return;

      const bounds = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - bounds.left) / bounds.width) * 100;
      const y = ((e.clientY - bounds.top) / bounds.height) * 100;

      onPositionSelect(currentPage, { x, y });
    },
    [currentPage, onPositionSelect]
  );

  const handleDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const handleDocumentLoadError = useCallback((error) => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF. Please try again.");
    setLoading(false);
  }, []);

  const options = useMemo(
    () => ({
      cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdfjs-dist/${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdfjs-dist/${pdfjs.version}/standard_fonts/`,
      withCredentials: false,
    }),
    []
  );

  const LoadingComponent = useCallback(
    () => (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-600">Loading PDF...</div>
      </div>
    ),
    []
  );

  return (
    <div className="pdf-viewer w-full max-w-4xl mx-auto">
      {loading && <LoadingComponent />}
      {error && (
        <div className="flex justify-center items-center h-96">
          <div className="text-red-600">{error}</div>
        </div>
      )}

      <Document
        file={fileObject}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={handleDocumentLoadError}
        loading={<LoadingComponent />}
        options={options}
      >
        <div className="border rounded-lg shadow-sm">
          <Page
            pageNumber={currentPage}
            onClick={handleClick}
            className={onPositionSelect ? "cursor-crosshair" : "cursor-default"}
            loading={<LoadingComponent />}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={1.0}
          />
        </div>
      </Document>

      {numPages && (
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
