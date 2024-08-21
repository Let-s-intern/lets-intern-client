import { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import ScoreTooltipQuestion from '../../ui/tooltip-question/ScoreTooltipQuestion';
import CertificatePaper from '../CertificatePaper';

interface Props {
  totalScore: number;
  currentScore: number;
  programName: string;
  desc: string;
  startDate: string;
  endDate: string;
  userName: string;
}

const ScoreSection = ({
  totalScore,
  currentScore,
  programName,
  desc,
  startDate,
  endDate,
  userName,
}: Props) => {
  const [isHoverButton, setIsHoverButton] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative flex w-full flex-col gap-y-4 rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-[#4A495C]">미션 점수 현황</h2>
          <ScoreTooltipQuestion />
        </div>
        <div className="flex items-center justify-start">
          <div className="flex items-end">
            <span className="text-3xl font-bold text-primary">
              {currentScore}
            </span>
            <span className="mb-[1px] ml-1 font-semibold text-[#D3D3D3]">
              /{totalScore}
            </span>
          </div>
        </div>
      </div>
      <ReactToPrint
        trigger={() => (
          <button
            className={`flex items-center justify-center rounded-sm border-2 bg-neutral-100 px-4 py-1.5 text-xsmall14 font-medium outline-none ${currentScore < 80 ? 'cursor-not-allowed border-neutral-80 text-neutral-35' : 'border-primary text-primary-dark'}`}
            onMouseEnter={() => {
              currentScore < 80 && setIsHoverButton(true);
            }}
            onMouseLeave={() => {
              currentScore < 80 && setIsHoverButton(false);
            }}
            disabled={currentScore < 80}
          >
            수료증 발급
          </button>
        )}
        content={() => certificateRef.current}
        documentTitle={`${programName} 수료증`}
        onAfterPrint={() => {
          console.log('수료증 출력 완료');
        }}
      />
      {isHoverButton && (
        <div className="absolute bottom-[15px] left-1/2 w-[240px] -translate-x-1/2 translate-y-full transform p-4 pt-[29px] text-xsmall14 text-[#333]">
          <div className="absolute bottom-0 left-0 z-0 h-[calc(100%-14px)] w-full shadow-[0_0_24px_rgba(204,204,206,0.27)]" />
          <img
            className="absolute bottom-0 left-0 z-0 h-full w-full object-fill"
            src="../public/images/textbox.png"
          />
          <p className="relative z-10">
            마지막 미션까지 <span className="font-bold">총 80점 이상</span>을
            획득하면 수료증을 발급 받을 수 있어요!
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

export default ScoreSection;
