import React, { useRef, useState } from 'react';

interface DragDropModuleProps {
  onFileAdd: (files: File | null) => void;
}

const DragDropModule = ({ onFileAdd }: DragDropModuleProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLLabelElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag 이벤트 핸들러
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files.length > 0) {
      if (files.length > 1) {
        alert(`최대 1개까지 업로드 가능합니다.`);
        return;
      }
      onFileAdd(files.item(0));
      e.dataTransfer.clearData();
    }
  };

  // 파일 선택 핸들러
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      if (selectedFiles.length > 1) {
        alert(`최대 1개까지 업로드 가능합니다.`);
        return;
      }
      onFileAdd(selectedFiles.item(0));
    }
  };

  return (
    <div className="flex w-full flex-col gap-2.5">
      <label
        className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-sm border border-dashed border-neutral-50 p-5 ${
          isDragging ? 'border-primary bg-neutral-70' : 'bg-white'
        }`}
        htmlFor="fileUpload"
        ref={dragRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          id="fildUpload"
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        <button type="button">
          <img src="/icons/file-upload.svg" alt="upload" />
        </button>
        <div className="text-center text-xsmall14 text-neutral-30">
          <p>파일을 드래그하거나 클릭하여 업로드하세요.</p>
          <p>PDF, DOC, DOCX 형식만 첨부 가능합니다.</p>
        </div>
      </label>
    </div>
  );
};

export default DragDropModule;
