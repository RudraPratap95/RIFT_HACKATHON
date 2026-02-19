import React, { useCallback } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';
import { validateVCF } from '../services/vcfUtils';

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  error: string | null;
  setError: (err: string | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, setFile, error, setError }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    const validationError = validateVCF(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
    } else {
      setError(null);
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Patient Genetic Data (VCF)
      </label>
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            ${error ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-teal-500 hover:bg-teal-50/30'}
          `}
        >
          <input
            type="file"
            accept=".vcf"
            className="hidden"
            id="vcf-upload"
            onChange={handleFileInput}
          />
          <label htmlFor="vcf-upload" className="cursor-pointer flex flex-col items-center">
            <div className={`p-3 rounded-full mb-3 ${error ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'}`}>
              {error ? <AlertCircle className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
            </div>
            <p className="text-slate-900 font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-slate-500 text-sm">
              Standard VCF format (v4.2), max 5MB
            </p>
          </label>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-teal-100 p-2 rounded-lg shrink-0">
              <FileText className="w-5 h-5 text-teal-700" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};