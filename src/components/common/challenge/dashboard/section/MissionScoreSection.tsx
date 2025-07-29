'use client';

import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import ScoreTooltipQuestion from '../../ui/tooltip-question/ScoreTooltipQuestion';
import CertificatePaper from '../CertificatePaper';

// 새로운 버전
interface Props {
  totalScore: number;
  currentScore: number;
  programName: string;
  isProgramDone: boolean;
  desc: string;
  startDate: string;
  endDate: string;
  userName: string;
}

const MissionScoreSection = ({
  totalScore,
  currentScore,
  programName,
  isProgramDone,
  desc,
  startDate,
  endDate,
  userName,
}: Props) => {
  const [isHoverButton, setIsHoverButton] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: certificateRef,

    documentTitle: `${programName} 수료증`,
    onAfterPrint: () => {
      console.log('수료증 출력 완료');
    },
  });

  const CERTIFICATE_MIN_SCORE = 80;

  return (
    <section className="relative flex flex-1 flex-col gap-y-4 rounded-xs border border-[#E4E4E7] p-4">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-neutral-10">미션 점수 현황</h2>
          <ScoreTooltipQuestion />
        </div>
        <div className="flex items-center justify-start">
          <div className="flex items-end">
            <span className="text-2xl font-bold text-primary">
              {currentScore}
            </span>
            <span className="mb-[1px] ml-1 text-xl text-neutral-40">
              /{totalScore}
            </span>
          </div>
        </div>
      </div>
      {currentScore < CERTIFICATE_MIN_SCORE || !isProgramDone ? (
        <button
          className={`flex cursor-not-allowed items-center justify-center rounded-xs border border-neutral-80 py-2.5 text-xsmall16 font-medium text-neutral-50 outline-none`}
          onMouseEnter={() => {
            setIsHoverButton(true);
          }}
          onMouseLeave={() => {
            setIsHoverButton(false);
          }}
        >
          수료증 발급
        </button>
      ) : (
        <button
          onClick={() => reactToPrintFn()}
          className={`flex items-center justify-center rounded-xs border border-neutral-80 py-2.5 text-xsmall16 font-medium text-neutral-0 outline-none`}
        >
          수료증 발급
        </button>
      )}
      {isHoverButton && (
        <div className="absolute bottom-[15px] left-1/2 w-[240px] -translate-x-1/2 translate-y-full transform px-[13.5px] pb-4 pt-[29px] text-xsmall14 text-[#333]">
          <div className="absolute bottom-0 left-0 z-0 h-[calc(100%-14px)] w-full shadow-[0_0_24px_rgba(204,204,206,0.27)]" />
          <img
            className="absolute bottom-0 left-0 z-0 h-full w-full object-fill"
            src="/images/textbox.png"
            alt=""
          />
          <p className="relative z-10">
            챌린지 종료 후 <span className="font-bold">총 80점 이상</span>을
            획득한 경우에 수료증을 발급받을 수 있어요!
          </p>
        </div>
      )}
      {/* A4 크기 */}
      <div className="fixed left-0 top-0 z-50 hidden h-screen w-screen items-center justify-center overflow-hidden bg-white">
        <CertificatePaper
          ref={certificateRef}
          programName={programName}
          description={desc}
          startDate={startDate}
          endDate={endDate}
          userName={userName}
        />
      </div>
    </section>
  );
};

export default MissionScoreSection;
