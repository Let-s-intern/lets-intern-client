import { twMerge } from '@/lib/twMerge';

// 질문 박스 그리드 컴포넌트
const QuestionBoxGrid = ({ boxes }: { boxes: string[] }) => (
  <div className="relative flex w-full flex-col items-center">
    <div className="grid w-full grid-cols-3 gap-2 md:grid-cols-4 md:gap-3">
      {boxes.map((box, index) => (
        <div
          key={index}
          className={twMerge(
            'md:text-small20 h-20 whitespace-pre rounded-md bg-white px-2.5 py-3 text-[10px] font-semibold md:h-40 md:px-5 md:py-6',
            box === '' && 'hidden md:invisible md:block',
          )}
        >
          {box}
        </div>
      ))}
    </div>
    {/* grid 양 옆에 회색 그라데이션 박스 */}
    <div className="from-neutral-90 absolute bottom-0 left-0 top-0 h-full w-40 bg-gradient-to-r to-transparent md:w-80" />
    <div className="from-neutral-90 absolute bottom-0 right-0 top-0 h-full w-40 bg-gradient-to-l to-transparent md:w-80" />
  </div>
);

export default QuestionBoxGrid;
