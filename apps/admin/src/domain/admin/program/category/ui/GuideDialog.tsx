import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useState, type ReactNode } from 'react';

const box = 'rounded-[2px] bg-neutral-80';

/** 1. 노출 목록 = 페이지, 메뉴가 주소로 연결 */
const PageSketch = () => (
  <div className="flex items-center gap-3">
    <div className="flex flex-col gap-1 rounded-xs border border-neutral-80 p-2 text-xxsmall12 text-neutral-40">
      메뉴
      <span className="rounded-[2px] bg-primary/20 px-1.5 text-primary">
        이력서
      </span>
    </div>
    <span className="text-neutral-50">→</span>
    <div className="flex w-40 flex-col gap-1 rounded-xs border border-neutral-80 p-2">
      <span className="text-xxsmall12 text-neutral-40">/category/resume</span>
      <span className={`${box} h-2 w-2/3 bg-neutral-60`} />
      <span className={`${box} h-6 w-full`} />
    </div>
  </div>
);

/** 2. 섹션을 쌓으면 화면 순서, 카드 모양 둘 */
const SectionSketch = () => (
  <div className="flex w-56 flex-col gap-2 rounded-xs border border-neutral-80 p-2">
    <span className="text-xxsmall12 text-neutral-40">
      1. 대표 상품 1개 (가로형)
    </span>
    <div className="flex h-8 gap-1.5">
      <div className={`${box} aspect-[4/3] h-full`} />
      <div className="flex flex-1 items-end justify-end">
        <span className="h-2.5 w-6 rounded-[2px] bg-primary/60" />
      </div>
    </div>
    <span className="text-xxsmall12 text-neutral-40">2. 카드 목록</span>
    <div className="grid grid-cols-5 gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`${box} aspect-[4/3]`} />
      ))}
    </div>
  </div>
);

/** 3. 직접 고르기 + 필터 버튼에서 가져오기 → 미리보기 */
const ProductSketch = () => (
  <div className="flex items-center gap-3 text-xxsmall12">
    <div className="flex flex-col gap-1">
      <span className="rounded-xs border border-neutral-80 px-2 py-1">
        직접 고르기
      </span>
      <span className="rounded-xs border border-neutral-80 px-2 py-1">
        서류 &gt; 이력서 버튼
      </span>
    </div>
    <span className="text-neutral-50">→</span>
    <div className="grid w-28 grid-cols-3 gap-1 rounded-xs border border-neutral-80 p-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`${box} aspect-[4/3]`} />
      ))}
      <span className="col-span-3 text-center text-neutral-40">미리보기</span>
    </div>
  </div>
);

const STEPS: { text: string; sketch: ReactNode }[] = [
  {
    text: '노출 목록 하나가 사이트 페이지 하나예요. 주소를 정하면 메뉴가 그 페이지로 연결돼요.',
    sketch: <PageSketch />,
  },
  {
    text: '섹션을 위에서부터 쌓으면 화면 순서가 돼요. 카드 모양은 대표 1개 가로형과 카드 목록 두 가지예요.',
    sketch: <SectionSketch />,
  },
  {
    text: '상품은 직접 고르거나 필터 버튼에서 가져와요. 미리보기로 바로 확인해요.',
    sketch: <ProductSketch />,
  },
];

/** 사용법 3단계. 처음 들어왔을 때 한 번 뜨고, "사용법" 버튼으로 다시 연다 */
const GuideDialog = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        사용법{' '}
        <span className="text-xsmall14 font-normal text-neutral-40">
          {step + 1} / {STEPS.length}
        </span>
      </DialogTitle>
      <DialogContent className="flex flex-col items-center gap-4">
        <div className="flex h-32 items-center justify-center">
          {STEPS[step].sketch}
        </div>
        <p className="text-center text-xsmall16 text-neutral-10">
          {STEPS[step].text}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === step ? 'bg-neutral-0' : 'bg-neutral-80'}`}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        {step > 0 && <Button onClick={() => setStep(step - 1)}>이전</Button>}
        <Button
          variant="contained"
          onClick={() => (last ? onClose() : setStep(step + 1))}
        >
          {last ? '시작하기' : '다음'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GuideDialog;
