'use client';

import AlertModal from '@/common/alert/AlertModal';
import Link from 'next/link';
import type {
  UsageApplyType,
  usePassProgramApply,
} from './usePassProgramApply';

const COPY: Record<
  UsageApplyType,
  { label: string; detailPath: (id: number) => string }
> = {
  guidebook: {
    label: '가이드북',
    detailPath: (id) => `/program/guidebook/${id}`,
  },
  live: { label: 'LIVE 클래스', detailPath: (id) => `/program/live/${id}` },
};

const objectJosa = (word: string) => {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return '을';
  return (code - 0xac00) % 28 > 0 ? '을' : '를';
};

interface Props {
  programType: UsageApplyType;
  passTitle?: string;
  apply: ReturnType<typeof usePassProgramApply>;
}

const UsageApplyModals = ({ programType, passTitle, apply }: Props) => {
  const {
    target,
    completed,
    completedTitle,
    originalPrice,
    confirmApply,
    cancel,
    closeComplete,
  } = apply;
  const copy = COPY[programType];
  const passLabel = passTitle || '올인원패스';

  return (
    <>
      {target && (
        <AlertModal
          title={`[${target.title}]${objectJosa(target.title)} 신청하시겠습니까?`}
          confirmText="신청하기"
          cancelText="취소"
          onConfirm={confirmApply}
          onCancel={cancel}
        >
          <div className="flex min-h-[80px] w-full flex-col justify-between gap-6">
            <p className="text-neutral-30">
              {passLabel}로{' '}
              {originalPrice > 0 && (
                <>
                  <span className="text-neutral-40 line-through">
                    {originalPrice.toLocaleString()}원
                  </span>{' '}
                  →{' '}
                </>
              )}
              <span className="bg-primary-10 text-primary py-0.5 pl-1 pr-0.5 font-semibold">
                무료 신청 가능
              </span>
              합니다.
            </p>
            <Link
              href={copy.detailPath(target.programId)}
              className="text-xxsmall12 text-neutral-40 w-fit underline underline-offset-2"
            >
              {copy.label} 상세 내용 보기
            </Link>
          </div>
        </AlertModal>
      )}
      {completed && (
        <AlertModal
          title={`${copy.label} 신청완료`}
          confirmText="닫기"
          showCancel={false}
          onConfirm={closeComplete}
        >
          <p className="text-neutral-30">
            [{completedTitle}] 신청이 완료되었습니다.
          </p>
        </AlertModal>
      )}
    </>
  );
};

export default UsageApplyModals;
