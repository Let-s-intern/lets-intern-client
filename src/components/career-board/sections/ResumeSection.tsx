import { useGetUserDocumentListQuery } from '@/api/user';
import { UserDocument } from '@/api/userSchema';
import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

// 문서 타입을 한국어로 매핑
const DOCUMENT_TYPE_MAP: Record<UserDocument['userDocumentType'], string> = {
  RESUME: '이력서',
  PERSONAL_STATEMENT: '자기소개서',
  PORTFOLIO: '포트폴리오',
};

// 표시할 문서 타입 순서
const DOCUMENT_TYPE_ORDER: UserDocument['userDocumentType'][] = [
  'RESUME',
  'PERSONAL_STATEMENT',
  'PORTFOLIO',
];

// URL에서 파일명 추출
const getFileNameFromUrl = (url: string): string => {
  try {
    // URL이 상대 경로인 경우와 절대 경로인 경우 모두 처리
    const lastSlashIndex = url.lastIndexOf('/');
    if (lastSlashIndex !== -1 && lastSlashIndex < url.length - 1) {
      return url.substring(lastSlashIndex + 1);
    }
    return url;
  } catch {
    return url;
  }
};

interface Document {
  type: string;
  fileName: string | null;
  fileUrl: string | null;
}

const ResumeSection = () => {
  const router = useRouter();
  const { data: userDocumentData } = useGetUserDocumentListQuery();

  // API 응답을 UI 형식으로 변환
  const documents: Document[] = DOCUMENT_TYPE_ORDER.map((docType) => {
    const document = userDocumentData?.userDocumentList.find(
      (doc) => doc.userDocumentType === docType,
    );

    // fileName이 있으면 파일명만 추출하고, 없으면 fileUrl에서 추출
    const fileName = document?.fileName
      ? getFileNameFromUrl(document.fileName)
      : document?.fileUrl
        ? getFileNameFromUrl(document.fileUrl)
        : null;

    return {
      type: DOCUMENT_TYPE_MAP[docType],
      fileName,
      fileUrl: document?.fileUrl ?? null,
    };
  });

  // 데이터 존재 여부 확인 (fileUrl이 있는지 확인)
  const hasData = documents.some((doc) => doc.fileUrl !== null);

  return (
    <CareerCard
      title="서류 정리"
      labelOnClick={() => router.push('/mypage/career/resume')}
      body={
        hasData ? (
          <ResumeBody documents={documents} />
        ) : (
          <CareerCard.Empty
            description="아직 등록된 서류가 없어요"
            buttonText="서류 정리하기"
            buttonHref="/mypage/career/resume"
            onClick={() => router.push('/mypage/career/resume')}
          />
        )
      }
    />
  );
};

export default ResumeSection;

interface ResumeBodyProps {
  documents: Document[];
}

const ResumeBody = ({ documents }: ResumeBodyProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 내 서류 */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xxsmall12 font-normal text-[#4138A3]">
          내 서류
        </span>
        <div className="flex flex-col gap-1">
          {documents.map((doc, index) => (
            <DocumentItem
              key={index}
              type={doc.type}
              fileName={doc.fileName}
              fileUrl={doc.fileUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface DocumentItemProps {
  type: string;
  fileName: string | null;
  fileUrl: string | null;
}

const DocumentItem = ({ type, fileName, fileUrl }: DocumentItemProps) => {
  const handleFileClick = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="w-[52px] whitespace-nowrap text-xxsmall12 font-normal text-neutral-40">
        {type}
      </span>
      {fileUrl ? (
        <span
          className="min-w-0 cursor-pointer truncate whitespace-nowrap text-xsmall14 font-normal text-neutral-0 underline"
          onClick={handleFileClick}
        >
          {fileName}
        </span>
      ) : (
        <span className="text-xsmall14 font-normal text-neutral-40">-</span>
      )}
    </div>
  );
};
