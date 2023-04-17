// FileUploader.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// import './FileUploader.css';

interface FileUploaderProps {
  onUpload: (acceptedFiles: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
      setIsDragActive(false);
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt', '.md'],
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed border-gray-300 p-6 rounded-md cursor-pointer ${
        isDragActive ? 'active' : ''
      } ${isDragReject ? 'reject' : ''}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Click or drag and drop files here (PDF, MD, TXT)</p>
      )}
    </div>
  );
};
