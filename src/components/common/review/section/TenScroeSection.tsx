import { useState } from 'react';

import TextArea from '../../ui/input/TextArea';
import TenScore from '../score/TenScore';
import YesNoScore from '../score/YesNoScore';

interface TenScoreSectionProps {
  tenScore: number | null;
  setTenScore: (tenScore: number | null) => void;
  isYes: boolean | null;
  setIsYes: (isYes: boolean | null) => void;
  answer: {
    yes: string;
    no: string;
    low: string;
  };
  setAnswer: (answer: { yes: string; no: string; low: string }) => void;
}

const TenScoreSection = ({
  tenScore,
  setTenScore,
  isYes,
  setIsYes,
  answer,
  setAnswer,
}: TenScoreSectionProps) => {
  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    isYes: boolean,
  ) => {
    if (tenScore && tenScore <= 6) {
      setAnswer({ ...answer, low: e.target.value });
    } else if (isYes) {
      setAnswer({ ...answer, yes: e.target.value });
    } else {
      setAnswer({ ...answer, no: e.target.value });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">
            (프로그램이름)을 주변에 얼마나 추천하고 싶으신가요?
          </h1>
          <p>0~10점 사이로 선택해주세요.</p>
        </div>
        <TenScore tenScore={tenScore} setTenScore={setTenScore} />
      </div>
      {tenScore !== null &&
        (tenScore >= 7 ? (
          <>
            <div className="flex flex-col gap-3">
              <p>
                실제로 (프로그램 이름)을 친구/지인에게 추천해보신 경험이
                있으신가요?
              </p>
              <YesNoScore isYes={isYes} setIsYes={setIsYes} />
            </div>
            {isYes !== null &&
              (isYes ? (
                <div className="flex flex-col gap-2">
                  <p className="px-2.5">
                    친구/지인에게 어떤 부분을 이야기 하면서 추천하셨나요?
                  </p>
                  <TextArea
                    rows={3}
                    placeholder="이곳에 후기를 작성해주세요!"
                    value={answer.yes}
                    onChange={(e) => handleAnswerChange(e, true)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="px-2.5">
                    만약 (프로그램 이름)을 친구/지인에게 추천한다면 어떤 부분을
                    이야기 하면서 추천하실 것 같나요? 친구/지인에게 이야기
                    한다고 생각하며 편하게 작성해주세요!
                  </p>
                  <TextArea
                    rows={3}
                    placeholder="이곳에 후기를 작성해주세요!"
                    value={answer.no}
                    onChange={(e) => handleAnswerChange(e, false)}
                  />
                </div>
              ))}
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="px-2.5">
              해당 점수를 선택한 이유는 무엇인가요? 이유를 자세히 설명해주세요.
            </p>
            <TextArea rows={3} placeholder="이곳에 후기를 작성해주세요!" />
          </div>
        ))}
    </div>
  );
};

export default TenScoreSection;
