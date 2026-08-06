import {
  useCloseLiveMentoringOpeningMutation,
  useLiveMentoringOpenStatusQuery,
} from '@/api/live-mentoring/liveMentoring';
import type {
  LiveMentoringCloseReason,
  LiveMentoringOpeningStatus,
  OpeningHistoryItem,
} from '@/api/live-mentoring/liveMentoringSchema';
import { useUserQuery } from '@/api/user/user';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import { durationLabel, formatPrice, publicDetailUrl } from '../constants';

const STATUS_LABEL: Record<LiveMentoringOpeningStatus, string> = {
  OPEN: '오픈중',
  CLOSED: '종료',
};

const STATUS_CLASS: Record<LiveMentoringOpeningStatus, string> = {
  OPEN: 'bg-primary-10 text-primary',
  CLOSED: 'bg-gray-100 text-gray-500',
};

/** 서버 `LiveMentoringCloseReason` 표시 라벨. */
const CLOSE_REASON_LABEL: Record<LiveMentoringCloseReason, string> = {
  PERIOD_EXPIRED: '기간 만료',
  ADMIN_FORCED: '관리자 종료',
  MENTOR_CANCELED: '멘토 취소',
};

// 헤더는 "피드백 기간"처럼 공백이 있어 좁은 열에서 두 줄로 쪼개진다.
const headerCellClass =
  'whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500';
const bodyCellClass = 'px-4 py-3 text-sm text-gray-700';

/**
 * 통째로 하나의 값인 셀 — 절대 끊지 않는다.
 * 기본 `word-break: normal` 은 **한글을 글자 단위로 끊어서**, 좁은 열에서
 * "30분·6" / "0분" 이나 "07-14 ~" / "07-28" 같은 깨진 표기가 나온다.
 */
const atomicCellClass = `${bodyCellClass} whitespace-nowrap`;

/** "2026-08-04T16:00:00" → "08-04 16:00". 값이 없으면 하이픈. */
const formatDateTime = (value: string | null): string => {
  if (!value) return '-';
  const [date, time] = value.split('T');
  return `${date.slice(5)} ${time?.slice(0, 5) ?? ''}`.trim();
};

/** 진행시간별 가격 표기 (예: "30분 35,000원 / 60분 60,000원"). */
const durationPricesLabel = (
  durationPrices: OpeningHistoryItem['durationPrices'],
): string =>
  durationPrices
    .map(
      ({ duration, price }) =>
        `${durationLabel(duration)} ${formatPrice(price)}`,
    )
    .join(' / ');

/**
 * 오픈 현황 — 개설(opening) 이력.
 *
 * 상품이 아니라 개설 단위라 제목·타입은 여기에 실리지 않는다(상품에 하나뿐이라
 * 오픈 설정 화면에서 본다). 예약 수도 서버 응답에 아직 없어 열을 두지 않는다 —
 * 응답에 없는 값을 0으로 채워 보여주면 화면이 사실과 달라진다.
 */
const OpenStatusPage = () => {
  const { data, isLoading } = useLiveMentoringOpenStatusQuery();
  const { mutate: closeOpening, isPending } =
    useCloseLiveMentoringOpeningMutation();
  // 공개 상세는 mentorId 로 열린다(웹 라우트 `/live-mentoring/[mentorId]`).
  const { data: user } = useUserQuery();
  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const handleClose = (openingId: number) =>
    showConfirm({
      title: '이 개설을 종료할까요?',
      // 서버는 예약 존재 여부를 검사하지 않고 종료한다 — 화면 문구도 그대로 적는다.
      description:
        '종료하면 공개 리스트에서 즉시 내려갑니다. 진행 중인 예약이 있어도 종료되며, 되돌릴 수 없어요.',
      confirmText: '종료하기',
      // 확인 모달은 onConfirm 후에도 닫히지 않는다(공용 훅 동작) — 연타로 두 번 나가지 않게 막는다.
      onConfirm: () =>
        isPending
          ? undefined
          : closeOpening(openingId, {
              onSuccess: () =>
                showAlert({
                  title: '개설을 종료했습니다.',
                  variant: 'success',
                }),
              onError: (error) =>
                showAlert({
                  title: '종료에 실패했습니다.',
                  description: (error as { message?: string } | null)?.message,
                  variant: 'error',
                }),
            }),
    });

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          오픈 현황
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          내가 개설한 1대1 라이브 멘토링의 이력과 상태를 확인하세요.
        </p>
        {/*
          공개 페이지 링크는 이 화면에 둔다.
          "지금 열려 있는지"가 표에 이미 나와 있어, 링크와 상태를 한자리에서 볼 수 있다.
        */}
        {user?.userId != null && (
          <a
            href={publicDetailUrl(user.userId)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xsmall14 w-fit font-medium underline"
          >
            공개 페이지 보기
          </a>
        )}
      </header>

      {/*
        표가 `min-w-[720px]` 라 좁은 화면에서는 컨테이너를 넘친다.
        `overflow-hidden` 이면 넘친 열이 잘린 채 접근할 방법이 없으므로 가로 스크롤을 준다.
      */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={headerCellClass}>상태</th>
              <th className={headerCellClass}>진행시간·가격</th>
              <th className={headerCellClass}>피드백 기간</th>
              <th className={headerCellClass}>개설일시</th>
              <th className={headerCellClass}>종료일시</th>
              <th className={headerCellClass}>종료 사유</th>
              <th className={headerCellClass}>관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  개설 이력이 없습니다. 오픈 설정에서 검토를 제출해주세요.
                </td>
              </tr>
            ) : (
              data.map((opening) => (
                <tr
                  key={opening.openingId}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className={bodyCellClass}>
                    <span
                      className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[opening.status]}`}
                    >
                      {STATUS_LABEL[opening.status]}
                    </span>
                  </td>
                  <td className={atomicCellClass}>
                    {durationPricesLabel(opening.durationPrices)}
                  </td>
                  <td className={atomicCellClass}>
                    {`${opening.feedbackStartDate.slice(5)} ~ ${opening.feedbackEndDate.slice(5)}`}
                  </td>
                  <td className={atomicCellClass}>
                    {formatDateTime(opening.openedAt)}
                  </td>
                  <td className={atomicCellClass}>
                    {formatDateTime(opening.closedAt)}
                  </td>
                  <td className={atomicCellClass}>
                    {opening.closeReason
                      ? CLOSE_REASON_LABEL[opening.closeReason]
                      : '-'}
                  </td>
                  <td className={bodyCellClass}>
                    {opening.status === 'OPEN' ? (
                      <button
                        type="button"
                        onClick={() => handleClose(opening.openingId)}
                        disabled={isPending}
                        className="text-system-error whitespace-nowrap rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        종료하기
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default OpenStatusPage;
