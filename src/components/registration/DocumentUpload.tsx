import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';

interface DocumentUploadProps {
  label: string;
  value: File | string | null;
  onChange: (file: File | string | null) => void;
  accept?: string;
  error?: string;
  helperText?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  value,
  onChange,
  accept = 'image/jpeg,image/png,image/webp',
  error,
  helperText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    if (typeof value === 'string') return value;
    if (value instanceof File) return URL.createObjectURL(value);
    return null;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      onChange(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-1 text-left">
      <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-2 flex items-center space-x-3 group">
          <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-300 bg-white flex-shrink-0 flex items-center justify-center">
            <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Document Attached</span>
            </div>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">
              {value instanceof File ? value.name : 'Uploaded Document'}
            </p>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-xs flex items-center space-x-1 transition-colors"
              title="Replace document"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs flex items-center space-x-1 transition-colors"
              title="Remove document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-1.5 hover:border-[#397EF5] hover:bg-blue-50/30 ${
            error ? 'border-red-400 bg-red-50/20' : 'border-gray-300 bg-gray-50/50'
          }`}
        >
          <div className="p-2 bg-blue-50 text-[#397EF5] rounded-full">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#20244F]">Click to upload document photo</p>
            <p className="text-[10px] text-gray-400">JPG, PNG or WEBP (Max 5MB)</p>
          </div>
        </div>
      )}

      {error ? (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
};
