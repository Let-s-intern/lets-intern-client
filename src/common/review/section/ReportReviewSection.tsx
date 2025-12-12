import TextArea from '@/common/ui/input/TextArea';
import { josa } from 'es-hangul';

interface ReportReviewSectionProps {
  programTitle: string | null;
  howHelpful: string;
  setHowHelpful: (howHelpful: string) => void;
}

const ReportReviewSection = ({
  programTitle,
  howHelpful,
  setHowHelpful,
}: ReportReviewSectionProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="px-2.5">
        {josa(programTitle ?? '', '이/가')} 서류 보완에 어떻게 도움이 되셨나요?
        <span className="ml-1 text-requirement">*</span>
      </p>
      <TextArea
        rows={3}
        placeholder="어떻게 도움이 되셨는지 자세히 설명해주세요."
        value={howHelpful}
        onChange={(e) => setHowHelpful(e.target.value)}
      />
    </div>
  );
};

export default ReportReviewSection;
