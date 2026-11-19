import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useState, type ReactNode } from 'react';

const box = 'rounded-[2px] bg-neutral-85';

const Arrow = () => (
  <span aria-hidden className="shrink-0 text-small18 text-neutral-50">
    →
  </span>
);

/** 화면 이름표. 그림 위에 작게 */
const Caption = ({ children }: { children: ReactNode }) => (
  <span className="mb-1 block text-xxsmall12 font-semibold text-neutral-40">
    {children}
  </span>
);

const Num = ({ n }: { n: number }) => (
  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold leading-none text-white">
    {n}
  </span>
);

/** 작은 사이트 랜딩. children 은 섹션 자리 */
const MiniLanding = ({ children }: { children?: ReactNode }) => (
  <div className="w-44 rounded-xs border border-neutral-80 bg-white">
    <div className="border-b border-neutral-90 px-2 py-1 text-[10px] text-neutral-40">
      /category/resume
    </div>
    <div className="flex flex-col gap-1.5 p-2">
      <span className={`${box} h-2.5 w-3/4 bg-neutral-60`} />
      {children ?? (
        <>
          <span className={`${box} h-6 w-full`} />
          <span className={`${box} h-6 w-full`} />
        </>
      )}
    </div>
  </div>
);

/** 1. 노출 목록 하나 → GNB 메뉴 → 사이트 랜딩 */
const PageSketch = () => (
  <div className="flex items-center gap-2">
    <div>
      <Caption>어드민 노출 목록</Caption>
      <div className="w-40 rounded-xs border border-neutral-80 bg-white p-1.5">
        <div className="rounded-[2px] bg-primary/10 px-1.5 py-1 text-xxsmall12 font-semibold text-neutral-0">
          이력서 랜딩
          <span className="block text-[10px] font-normal text-primary">
            /category/resume
          </span>
        </div>
        <div className="px-1.5 py-1 text-xxsmall12 text-neutral-40">
          면접 랜딩
        </div>
      </div>
    </div>
    <Arrow />
    <div>
      <Caption>사이트 메뉴</Caption>
      <div className="w-32 rounded-xs border border-neutral-80 bg-white">
        <div className="border-b border-neutral-90 px-2 py-1 text-[10px] font-semibold text-neutral-10">
          프로그램 카테고리 ▾
        </div>
        <div className="flex flex-col p-1.5 text-xxsmall12">
          <span className="text-[10px] text-neutral-50">서류 작성</span>
          <span className="rounded-[2px] bg-primary/10 px-1 font-semibold text-primary">
            이력서
          </span>
          <span className="px-1 text-neutral-40">자기소개서</span>
        </div>
      </div>
    </div>
    <Arrow />
    <div>
      <Caption>사이트 페이지</Caption>
      <MiniLanding />
    </div>
  </div>
);

const SECTIONS = ['챌린지', 'LIVE 클래스', '블로그'];

/** 2. 어드민 섹션 순서 = 사이트 섹션 순서 */
const SectionSketch = () => (
  <div className="flex items-center gap-3">
    <div>
      <Caption>어드민 섹션</Caption>
      <ul className="flex w-40 flex-col gap-1 rounded-xs border border-neutral-80 bg-white p-1.5">
        {SECTIONS.map((title, i) => (
          <li
            key={title}
            className="flex items-center gap-1.5 rounded-[2px] px-1 py-0.5 text-xxsmall12 text-neutral-10"
          >
            <Num n={i + 1} />
            {title}
            <span className="ml-auto text-[10px] text-neutral-50">↑↓</span>
          </li>
        ))}
      </ul>
    </div>
    <Arrow />
    <div>
      <Caption>사이트 페이지</Caption>
      <MiniLanding>
        <div className="flex items-center gap-1">
          <Num n={1} />
          <div className="flex h-7 flex-1 gap-1">
            <span className={`${box} aspect-[4/3] h-full`} />
            <span className="flex flex-1 items-end justify-end">
              <span className="h-2 w-5 rounded-[2px] bg-primary/60" />
            </span>
          </div>
        </div>
        {[2, 3].map((n) => (
          <div key={n} className="flex items-center gap-1">
            <Num n={n} />
            <div className="grid flex-1 grid-cols-4 gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`${box} aspect-[4/3]`} />
              ))}
            </div>
          </div>
        ))}
      </MiniLanding>
    </div>
  </div>
);

const PRODUCTS = ['이력서 챌린지', '이력서 LIVE', '서류 > 이력서'];

/** 3. 상품이 섹션 카드 줄로 들어간다 */
const ProductSketch = () => (
  <div className="flex items-center gap-3">
    <div>
      <Caption>상품 넣기</Caption>
      <div className="flex w-40 flex-col gap-1 text-xxsmall12">
        <span className="text-[10px] text-neutral-50">직접 고르기</span>
        <span className="rounded-[2px] border border-neutral-80 bg-white px-1.5 py-0.5">
          {PRODUCTS[0]}
        </span>
        <span className="rounded-[2px] border border-neutral-80 bg-white px-1.5 py-0.5">
          {PRODUCTS[1]}
        </span>
        <span className="mt-1 text-[10px] text-neutral-50">
          필터 버튼에서 가져오기
        </span>
        <span className="rounded-[2px] border border-dashed border-primary/60 bg-white px-1.5 py-0.5 text-primary">
          {PRODUCTS[2]}
        </span>
      </div>
    </div>
    <Arrow />
    <div>
      <Caption>섹션 카드 줄 (미리보기)</Caption>
      <div className="grid w-52 grid-cols-3 gap-1.5 rounded-xs border border-neutral-80 bg-white p-2">
        {PRODUCTS.map((title) => (
          <div key={title} className="flex flex-col gap-0.5">
            <span className={`${box} aspect-[4/3]`} />
            <span className="truncate text-[10px] text-neutral-10">
              {title}
            </span>
          </div>
        ))}
      </div>
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
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        사용법{' '}
        <span className="text-xsmall14 font-normal text-neutral-40">
          {step + 1} / {STEPS.length}
        </span>
      </DialogTitle>
      <DialogContent className="flex flex-col items-center gap-4">
        <div className="flex min-h-[192px] items-center justify-center rounded-sm bg-neutral-95 px-4 py-6">
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
