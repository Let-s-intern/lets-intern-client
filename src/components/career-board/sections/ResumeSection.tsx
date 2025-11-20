import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

const ResumeSection = () => {
  const router = useRouter();

  // TODO: 서버에서 받아올 데이터 (임시 하드코딩)
  const documents = [
    {
      type: '이력서',
      fileName: '김렛츠_이력서_진단 PDF',
    },
    {
      type: '자기소개서',
      fileName: null,
    },
    {
      type: '포트폴리오',
      fileName:
        '김렛츠_이력서_진단 PDF 김렛츠_이력서_진단 PDF 김렛츠_이력서_진단 PDF',
    },
  ];

  // 데이터 존재 여부 확인
  const hasData = documents.some((doc) => doc.fileName !== null);

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

interface Document {
  type: string;
  fileName: string | null;
}

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
            <DocumentItem key={index} type={doc.type} fileName={doc.fileName} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface DocumentItemProps {
  type: string;
  fileName: string | null;
}

const DocumentItem = ({ type, fileName }: DocumentItemProps) => {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="w-[52px] whitespace-nowrap text-xxsmall12 font-normal text-neutral-40">
        {type}
      </span>
      {fileName ? (
        <span className="min-w-0 cursor-pointer truncate whitespace-nowrap text-xsmall14 font-normal text-neutral-0 underline">
          {fileName}
        </span>
      ) : (
        <span className="text-xsmall14 font-normal text-neutral-40">-</span>
      )}
    </div>
  );
};
