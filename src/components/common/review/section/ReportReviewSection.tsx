import TextArea from '@components/common/ui/input/TextArea';
import { josa } from 'es-hangul';
import YesNoScore from '../score/YesNoScore';

interface ReportReviewSectionProps {
  programTitle?: string | null;
  hasPassed: boolean | null;
  setHasPassed: (hasPassed: boolean | null) => void;
  howHelpful: string;
  setHowHelpful: (howHelpful: string) => void;
  passedWhere: string;
  setPassedWhere: (passedWhere: string) => void;
}

const ReportReviewSection = ({
  programTitle,
  hasPassed,
  setHasPassed,
  howHelpful,
  setHowHelpful,
  passedWhere,
  setPassedWhere,
}: ReportReviewSectionProps) => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">
        {josa(programTitle ?? '', '을/를')} 이용하고 나서 서류 전형에
        합격하셨나요?<span className="text-requirement ml-1">*</span>
      </h1>
      <YesNoScore
        hasRecommendationExperience={hasPassed}
        setHasRecommendationExperience={(value) => {
          setHowHelpful('');
          setPassedWhere('');
          setHasPassed(value);
        }}
      />
      {hasPassed !== null &&
        (hasPassed ? (
          <>
            <div className="flex flex-col gap-2">
              <p className="px-2.5">
                {josa(programTitle ?? '', '이/가')} 서류 합격에 어떻게 도움이
                되셨나요?<span className="text-requirement ml-1">*</span>
              </p>
              <TextArea
                rows={3}
                placeholder="어떻게 도움이 되셨는지 자세히 설명해주세요."
                value={howHelpful}
                onChange={(e) => setHowHelpful(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex w-full justify-between">
                <p className="px-2.5">
                  새로운 커리어를 향해 첫 발걸음을 내딛으신 점 축하드립니다.
                  <br />
                  🥳합격하신 회사/직무를 알려주세요.
                </p>
                <span className="text-xsmall16 font-medium text-black/35">
                  *선택사항
                </span>
              </div>
              <TextArea
                rows={3}
                placeholder="예시) 렛츠커리어/프로덕트 매니저"
                value={passedWhere}
                onChange={(e) => setPassedWhere(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="px-2.5">
              {josa(programTitle ?? '', '이/가')} 서류 보완에 어떻게 도움이
              되셨나요?<span className="text-requirement ml-1">*</span>
            </p>
            <TextArea
              rows={3}
              placeholder="어떻게 도움이 되셨는지 자세히 설명해주세요."
              value={passedWhere}
              onChange={(e) => setPassedWhere(e.target.value)}
            />
          </div>
        ))}
    </div>
  );
};

export default ReportReviewSection;
