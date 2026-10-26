'use client';

import { usePaymentDetailQuery } from '@/api/payment/payment';
import { useVodPassListQuery, VodPass, VodPassStatus } from '@/api/vodPass';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import BaseModal from '@/common/modal/BaseModal';
import { CreditDetailContent } from '@/domain/mypage/credit/CreditDetailPage';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
  findLastEndedVodPass,
  summarizeVodPasses,
} from '../utils/vodPassSummary';

const VOD_SITE_LOGIN_URL = 'https://seminar-vod.letscareer.co.kr/login';

const STATUS_BADGE: Partial<
  Record<VodPassStatus, { label: string; className: string }>
> = {
  ACTIVE: { label: '이용 중', className: 'bg-primary-10 text-primary' },
  SCHEDULED: { label: '이용 예정', className: 'bg-[#FFF4DB] text-[#8A5A00]' },
  UNACTIVATED: { label: '이용 전', className: 'bg-neutral-95 text-neutral-30' },
  EXPIRED: { label: '이용 종료', className: 'bg-neutral-95 text-neutral-30' },
  CANCELED: { label: '취소', className: 'bg-neutral-95 text-neutral-30' },
};

const formatDate = (date: string) => dayjs(date).format('YYYY.MM.DD');

/** 마이페이지 신청 현황 > VOD 클래스 탭 상단의 VOD 이용권 요약과 구매 내역 (LC-3507). */
const VodPassSection = () => {
  const { data } = useVodPassListQuery();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [detailPaymentId, setDetailPaymentId] = useState<number | null>(null);

  const passes = data?.passes ?? [];
  if (passes.length === 0) return null;

  const summary = summarizeVodPasses(passes, new Date());
  const lastEnded = summary ? undefined : findLastEndedVodPass(passes);
  const history = [...passes].sort((a, b) => b.applicationId - a.applicationId);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xsmall16 text-neutral-0 font-semibold">VOD 이용권</h2>
      <div
        className={twMerge(
          'overflow-hidden rounded-md border',
          summary?.isWatchable
            ? 'border-primary-20 bg-primary-5'
            : 'border-neutral-80 bg-white',
        )}
      >
        <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
          {summary ? (
            <div className="flex flex-col gap-2">
              <StatusBadge
                status={summary.isWatchable ? 'ACTIVE' : 'SCHEDULED'}
              />
              {summary.isWatchable ? (
                <p className="text-small20 text-neutral-0 font-bold">
                  남은 기간{' '}
                  <span className="text-primary">
                    {summary.remainingDays}일
                  </span>
                </p>
              ) : (
                <p className="text-small20 text-neutral-0 font-bold">
                  {formatDate(summary.startsAt)}부터 이용할 수 있어요
                </p>
              )}
              <p className="text-xsmall14 text-neutral-30">
                이용 기간 {formatDate(summary.startsAt)} ~{' '}
                {formatDate(summary.endsAt)}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <StatusBadge status="EXPIRED" />
              <p className="text-small20 text-neutral-30 font-bold">
                VOD 이용 기간이 끝났어요
              </p>
              {lastEnded && (
                <p className="text-xsmall14 text-neutral-40">
                  마지막 이용 기간 {formatDate(lastEnded.startsAt)} ~{' '}
                  {formatDate(lastEnded.endsAt)}
                </p>
              )}
            </div>
          )}
          {summary?.isWatchable && (
            <a
              href={VOD_SITE_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-xsmall14 flex min-h-11 shrink-0 items-center justify-center rounded-sm px-5 font-semibold text-white"
            >
              VOD 보러가기
            </a>
          )}
        </div>

        <button
          type="button"
          aria-expanded={isHistoryOpen}
          onClick={() => setIsHistoryOpen((open) => !open)}
          className="border-neutral-80 text-xsmall14 text-neutral-30 flex min-h-11 w-full items-center justify-between border-t bg-white px-5 md:px-6"
        >
          <span>
            구매 내역{' '}
            <span className="text-primary font-semibold">{passes.length}</span>
          </span>
          <ChevronDown
            size={16}
            aria-hidden
            className={twMerge(
              'transition-transform',
              isHistoryOpen && 'rotate-180',
            )}
          />
        </button>

        {isHistoryOpen && (
          <ul className="flex flex-col bg-white px-5 pb-2 md:px-6">
            {history.map((pass) => (
              <VodPassHistoryRow
                key={pass.applicationId}
                pass={pass}
                onOpenDetail={setDetailPaymentId}
              />
            ))}
          </ul>
        )}
      </div>

      <BaseModal
        isOpen={detailPaymentId !== null}
        onClose={() => setDetailPaymentId(null)}
        className="mx-4 max-h-[85vh] max-w-[560px] overflow-y-auto"
      >
        <div className="flex flex-col gap-6 px-5 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-neutral-0 text-lg font-medium">결제상세</h2>
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setDetailPaymentId(null)}
              className="text-neutral-30 flex h-11 w-11 items-center justify-center"
            >
              <img src="/icons/close.svg" alt="" className="h-6 w-6" />
            </button>
          </div>
          {detailPaymentId !== null && (
            <AsyncBoundary
              pendingFallback={
                <p className="text-neutral-0">결제내역을 불러오는 중입니다.</p>
              }
            >
              <CreditDetailContent paymentId={String(detailPaymentId)} />
            </AsyncBoundary>
          )}
        </div>
      </BaseModal>
    </section>
  );
};

export default VodPassSection;

const StatusBadge = ({ status }: { status: VodPassStatus }) => {
  const badge = STATUS_BADGE[status];
  if (!badge) return null;
  return (
    <span
      className={twMerge(
        'text-xxsmall12 rounded-xxs w-fit px-2 py-0.5 font-medium',
        badge.className,
      )}
    >
      {badge.label}
    </span>
  );
};

interface VodPassHistoryRowProps {
  pass: VodPass;
  onOpenDetail: (paymentId: number) => void;
}

const VodPassHistoryRow = ({ pass, onOpenDetail }: VodPassHistoryRowProps) => {
  // 이용권은 챌린지와 한 번에 결제된다. 같은 결제의 챌린지 항목에서 구매한 챌린지 이름을 얻는다.
  const { data: paymentDetail } = usePaymentDetailQuery(pass.paymentId);
  const challengeTitle = paymentDetail?.paymentItems?.find(
    (item) => item.programType === 'CHALLENGE',
  )?.title;
  const paidAt = paymentDetail?.paymentInfo.createDate;
  const period =
    pass.startsAt && pass.endsAt
      ? `${formatDate(pass.startsAt)} ~ ${formatDate(pass.endsAt)}`
      : null;
  const length = pass.purchasedMonths
    ? `${pass.purchasedMonths}개월`
    : pass.durationDays
      ? `${pass.durationDays}일`
      : null;
  const subText = [
    challengeTitle && `${challengeTitle}에서 구매`,
    paidAt && `${formatDate(paidAt)} 결제`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <li className="border-neutral-90 flex items-center justify-between gap-4 border-b py-3.5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="w-16 shrink-0">
          <StatusBadge status={pass.status} />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xsmall14 text-neutral-0 font-medium">
            {[length, period].filter(Boolean).join(' · ')}
          </span>
          {subText && (
            <span className="text-xxsmall12 text-neutral-40 truncate">
              {subText}
            </span>
          )}
        </div>
      </div>
      {typeof pass.paymentId === 'number' && (
        <button
          type="button"
          onClick={() => onOpenDetail(pass.paymentId as number)}
          className="text-xxsmall12 text-neutral-30 min-h-11 shrink-0 underline"
        >
          결제 상세
        </button>
      )}
    </li>
  );
};
