import { clsx } from 'clsx';
import { RefreshCw, Upload } from 'lucide-react';

interface DocumentUploadSectionProps {
  className?: string;
}

const DocumentUploadSection = ({
  className,
}: DocumentUploadSectionProps) => {
  const renderFileList = (
    type: 'resume' | 'portfolio' | 'selfIntroduction',
    isRequired: boolean,
  ) => {
    const label =
      type === 'resume'
        ? '이력서 첨부'
        : type === 'portfolio'
          ? '포트폴리오 첨부'
          : '자기소개서 첨부';
    const requiredText = isRequired ? '(필수제출)' : '';

    return (
      <div className="mb-6">
        <div className="mb-3">
          <span className="text-xsmall16 font-medium text-neutral-20">
            {label}
          </span>
          {isRequired && (
            <span className="ml-1 text-xsmall16 font-normal text-primary-90">
              {requiredText}
            </span>
          )}
        </div>

        <div className="flex gap-4">
          {/* 파일 업로드 버튼 */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xs bg-primary-10 px-4 py-2 text-xsmall14 font-medium text-primary transition hover:bg-primary-20"
          >
            <Upload size={16} />
            파일 업로드
          </button>

          {/* 서류 불러오기 버튼*/}
          <button
            type="button"
            disabled
            className="flex items-center gap-2 rounded-xs border-[1px] border-neutral-80 bg-white px-4 py-[.375rem] text-xsmall14 font-medium text-neutral-20 transition hover:border-neutral-70 hover:bg-neutral-95"
          >
            <RefreshCw size={16} />
            서류 불러오기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={clsx('', className)}>
      <h2 className="mb-1 text-small18 font-semibold text-neutral-0">
        서류 제출
      </h2>
      <p className="mb-6 text-xsmall14 text-neutral-30">
        PDF 형식만 지원하며, 파일 용량은 500MB 이하로 업로드해 주세요.
      </p>

      {renderFileList('resume', true)}
      {renderFileList('portfolio', true)}
      {renderFileList('selfIntroduction', false)}
    </div>
  );
};

export default DocumentUploadSection;