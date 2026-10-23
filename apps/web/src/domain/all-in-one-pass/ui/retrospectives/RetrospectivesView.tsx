// 회고록. 회차 가로 목록 + 선택 회차 폼 (상태/일정은 BE 값).
'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useGetPassRetrospectives } from '../../api/retrospectives';
import type { PassRetrospectiveRound } from '../../types';
import RetroForm from './RetroForm';
import {
  getRetroSchedule,
  getRetroStatus,
  isWrapUpRound,
  type RetroSchedule,
  type RetroStatus,
} from './retroSchedule';

type ComputedRound = PassRetrospectiveRound & {
  isWrapUp: boolean;
  schedule: RetroSchedule;
  status: RetroStatus;
};

// 상태별 카드 아이콘/라벨/색
const STATUS_META: Record<
  RetroStatus,
  { icon: string; text: string; style: string }
> = {
  DONE: {
    icon: '/icons/submit_success.svg',
    text: '작성 완료',
    style: 'text-primary-90',
  },
  OPEN: {
    icon: '/icons/submit_waiting.svg',
    text: '진행중',
    style: 'text-primary-90',
  },
  UPCOMING: {
    icon: '/icons/submit_absent.svg',
    text: '회고',
    style: 'text-neutral-30',
  },
  CLOSED: {
    icon: '/icons/submit_absent.svg',
    text: '마감',
    style: 'text-system-error',
  },
};

const RoundCard = ({
  item,
  selected,
  onClick,
}: {
  item: ComputedRound;
  selected: boolean;
  onClick: () => void;
}) => {
  const meta = STATUS_META[item.status];
  const roundLabel = item.isWrapUp ? '마무리' : `${item.th}회차`;

  return (
    <button type="button" onClick={onClick} className="shrink-0 text-left">
      <div
        className={clsx(
          'rounded-xxs hover:bg-primary-5 h-[104px] w-[74.8px] border px-2 py-2.5',
          selected ? 'bg-primary-5 border-[#A6AAFA]' : 'border-neutral-80',
        )}
      >
        <i className="block h-3.5 w-3.5">
          <img src={meta.icon} alt="" className="w-full object-cover" />
        </i>
        <div
          className={clsx(
            'mb-[6px] mt-1 flex flex-col justify-center text-[13px] font-semibold leading-4',
            meta.style,
          )}
        >
          {roundLabel}
          <br />
          {meta.text}
        </div>
        <span
          className={clsx(
            'text-xxsmall10 block w-full leading-3',
            item.status === 'OPEN' && 'text-primary',
          )}
        >
          {item.schedule.openAt
            ? item.schedule.openAt.format('MM.DD(ddd)')
            : '-'}
          <br />~{' '}
          {item.schedule.dueAt
            ? item.schedule.dueAt.format('MM.DD(ddd)')
            : '상시'}
        </span>
      </div>
    </button>
  );
};

interface Props {
  applicationId: number;
}

const RetrospectivesView = ({ applicationId }: Props) => {
  const { data, isLoading, isError } = useGetPassRetrospectives(applicationId);

  const rounds = useMemo<ComputedRound[]>(
    () =>
      (data ?? []).map((r) => ({
        ...r,
        isWrapUp: isWrapUpRound(r),
        schedule: getRetroSchedule(r),
        status: getRetroStatus(r),
      })),
    [data],
  );

  const openRound = rounds.find((r) => r.status === 'OPEN');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected =
    rounds.find((r) => r.id === selectedId) ?? openRound ?? rounds[0];

  if (isLoading) return <LoadingContainer className="py-20" />;
  if (isError) {
    return (
      <p className="text-xsmall14 text-neutral-40 py-20 text-center">
        회고를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <div className="flex flex-col gap-6 md:gap-4">
        {openRound && (
          <div className="bg-primary-5 text-xsmall14 md:text-xsmall16 rounded-xxs flex items-center gap-1 p-3 font-medium">
            <img
              src="/icons/check-star-primary.svg"
              alt=""
              className="shrink-0"
            />
            <span>
              <span className="text-primary">
                {openRound.isWrapUp ? '마무리' : `${openRound.th}회차`}
              </span>
              <span className="text-neutral-0"> 회고를 작성할 수 있어요</span>
            </span>
          </div>
        )}

        <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
          {rounds.map((r) => (
            <RoundCard
              key={r.id}
              item={r}
              selected={r.id === selected?.id}
              onClick={() => setSelectedId(r.id)}
            />
          ))}
        </div>
      </div>
      {selected && (
        <RetroForm
          applicationId={applicationId}
          round={selected}
          isWrapUp={selected.isWrapUp}
          schedule={selected.schedule}
          status={selected.status}
        />
      )}
    </div>
  );
};

export default RetrospectivesView;
