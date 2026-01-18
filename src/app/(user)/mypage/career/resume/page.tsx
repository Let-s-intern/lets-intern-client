'use client';

import { UploadedFiles } from '@/domain/challenge/my-challenge/section/MissionSubmitTalentPoolSection';
import MyDocUploadSection from '@/domain/challenge/my-challenge/section/MyDocUploadSection';
import { useCallback, useState } from 'react';

export default function Page() {
  const [isDocSubmitting, setIsDocSubmitting] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    resume: null,
    portfolio: null,
    personal_statement: null,
  });

  const handleFilesChange = useCallback((files: UploadedFiles) => {
    setUploadedFiles(files);
  }, []);

  return (
    <div>
      <label>
        <h1 className="mb-1.5 text-small18 font-medium">나의 서류</h1>
        <span className="text-xsmall14 text-neutral-45">
          50MB 이하의 PDF 파일만 업로드할 수 있습니다.
        </span>
      </label>
      <section className="mt-8">
        <MyDocUploadSection
          className="flex flex-col gap-4"
          uploadedFiles={uploadedFiles}
          onFilesChange={handleFilesChange}
          isSubmitted={isDocSubmitting}
        />
      </section>
    </div>
  );
}
