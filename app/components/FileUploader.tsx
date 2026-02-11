import React from "react";
import { useCallback } from "react";
import { useDropzone, type DropzoneOptions, type FileWithPath } from "react-dropzone";
import { formatSize } from "./utils";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0] || null;

    // Do something with the files
    setFile(file);
    onFileSelect?.(file);
  }, [onFileSelect]);
  const dropzoneOptions = {
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 20 * 1024 * 1024, // 20 MB
  };
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone(dropzoneOptions as any);

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
  <input {...(getInputProps() as any)} />
        {/*
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        */}
        <div className='space-y-4 cursor-pointer'>
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <img src="/icons/info.svg" alt="upload" className="size-20" />
          </div>
          {file ? (
            <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-3">
                    <img src="/images/pdf.png" alt="pdf" className="size-10"/>

                </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">{file.name}</p>
              <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
            </div>
            <button className="p-2 cursor-pointer" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFile(null);
                onFileSelect?.(null);
            }}>
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
            </button>
            </div>
          ) : (
            <div>
                <p className ="text-lg text-gray-500">
                    <span className="font-semibold">
                            Click to upload 
                            </span> or drag and drop
                            
                </p>
                <p className="text-lg text-gray-500"> PDF (max 20 MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default FileUploader;
