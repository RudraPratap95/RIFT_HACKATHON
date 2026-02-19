import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onUseDemo: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onUseDemo }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-10 space-y-6">
      <div 
        className="w-full p-10 border-2 border-dashed border-rift-700 hover:border-rift-500 rounded-2xl bg-rift-800/50 hover:bg-rift-800 transition-all cursor-pointer group"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="p-4 bg-rift-900 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-rift-500/10">
            <Upload className="w-8 h-8 text-rift-400" />
          </div>
          <p className="mb-2 text-lg text-slate-300 font-semibold">Click to upload or drag and drop</p>
          <p className="text-sm text-slate-500">CSV transaction logs (MAX. 50MB)</p>
          <input type="file" className="hidden" onChange={handleChange} accept=".csv" id="file-input"/>
          <label htmlFor="file-input" className="absolute inset-0 cursor-pointer"></label>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="h-px bg-rift-700 w-20"></div>
        <span className="text-slate-500 text-sm uppercase tracking-wider">OR</span>
        <div className="h-px bg-rift-700 w-20"></div>
      </div>

      <button 
        onClick={onUseDemo}
        className="flex items-center space-x-2 px-6 py-3 bg-rift-700 hover:bg-rift-600 text-slate-200 rounded-lg transition-colors border border-rift-500/30"
      >
        <FileText size={18} />
        <span>Load Synthetic Demo Data (RIFT Hackathon)</span>
      </button>
    </div>
  );
};

export default FileUpload;