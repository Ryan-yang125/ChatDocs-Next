// FileUploader.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// import './FileUploader.css';

interface FileUploaderProps {
  handleUpload: (acceptedFiles: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ handleUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleUpload(acceptedFiles);
      setIsDragActive(false);
    },
    [handleUpload],
  );

  const { acceptedFiles, getRootProps, getInputProps, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf'],
        'text/plain': ['.txt', '.md'],
      },
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
    });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <>
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
      <aside>
        <h4>Accepted files: </h4>
        <ul>{acceptedFileItems}</ul>
      </aside>
    </>
  );
};
