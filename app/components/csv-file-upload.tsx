"use client";

import { useCallback, useState } from "react";

type CsvFileUploadProps = {
  onFileSelect?: (file: File | null) => void;
  accept?: string;
  maxSizeBytes?: number;
};

export function CsvFileUpload({
  onFileSelect,
  accept = ".csv,text/csv",
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
}: CsvFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSetFile = useCallback(
    (selectedFile: File | null) => {
      setError(null);
      if (!selectedFile) {
        setFile(null);
        return;
      }
      if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
        setError("Please select a CSV file.");
        setFile(null);
        return;
      }
      if (selectedFile.size > maxSizeBytes) {
        setError(`File is too large. Maximum size is ${maxSizeBytes / 1024 / 1024}MB.`);
        setFile(null);
        return;
      }
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    },
    [maxSizeBytes, onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] ?? null;
      validateAndSetFile(selectedFile);
      e.target.value = "";
    },
    [validateAndSetFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files?.[0] ?? null;
      validateAndSetFile(droppedFile);
    },
    [validateAndSetFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setError(null);
    onFileSelect?.(null);
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-md">
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement)?.click();
          }
        }}
        className={`
          relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors
          ${isDragging ? "border-zinc-500 bg-zinc-100 dark:bg-zinc-800" : "border-zinc-300 bg-zinc-50/50 dark:border-zinc-600 dark:bg-zinc-900/50"}
          hover:border-zinc-400 hover:bg-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/50
        `}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Upload CSV file"
        />
        <svg
          className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {file ? file.name : "Drop your CSV here or click to browse"}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          CSV files only, max {maxSizeBytes / 1024 / 1024}MB
        </p>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {file && (
        <button
          type="button"
          onClick={clearFile}
          className="mt-3 text-sm font-medium text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Clear file
        </button>
      )}
    </div>
  );
}
