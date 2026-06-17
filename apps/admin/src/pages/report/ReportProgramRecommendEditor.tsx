import { memo } from 'react';

import Input from '@/common/input/v1/Input';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import {
  ReportProgramRecommend,
  ReportProgramRecommendItem,
} from '@/types/interface';

const reportPrograms = [
  { title: '챌린지 커리어시작', name: 'challengeCareerStart' },
  { title: '챌린지 자기소개서', name: 'challengePersonalStatement' },
  { title: '챌린지 포트폴리오', name: 'challengePortfolio' },
  { title: '라이브', name: 'live' },
  { title: 'VOD', name: 'vod' },
  { title: '서류진단 이력서', name: 'reportResume' },
  { title: '서류진단 자기소개서', name: 'reportPersonalStatement' },
  { title: '서류진단 포트폴리오', name: 'reportPortfolio' },
] as { title: string; name: keyof ReportProgramRecommend }[];

interface ReportProgramRecommendEditorProps {
  reportProgramRecommend: ReportProgramRecommend;
  setReportProgramRecommend: (state: ReportProgramRecommend) => void;
}

function ReportProgramRecommendEditor({
  reportProgramRecommend,
  setReportProgramRecommend,
}: ReportProgramRecommendEditorProps) {
  return (
    <>
      <Heading2 className="mb-3">프로그램 추천</Heading2>

      {reportPrograms.map((item) => (
        <ReportProgramItemForm
          key={item.name}
          title={item.title}
          reportProgram={reportProgramRecommend[item.name]}
          onChange={(e) =>
            setReportProgramRecommend({
              ...reportProgramRecommend,
              [item.name]: {
                ...reportProgramRecommend[item.name],
                [e.target.name]: e.target.value,
              },
            })
          }
        />
      ))}
    </>
  );
}

const Heading3 = memo(function Heading3({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h3 className="text-small18">{children}</h3>;
});

function ReportProgramItemForm({
  title,
  reportProgram,
  onChange,
}: {
  title: string;

  reportProgram?: ReportProgramRecommendItem;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mb-5">
      <Heading3>{title}</Heading3>
      <div className="mt-3 flex items-center gap-3">
        <Input
          label="제목"
          name="title"
          placeholder="제목을 입력하세요"
          size="small"
          value={reportProgram?.title ?? ''}
          onChange={onChange}
        />
        <Input
          label="CTA"
          name="cta"
          placeholder="CTA을 입력하세요"
          size="small"
          value={reportProgram?.cta ?? ''}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default ReportProgramRecommendEditor;
