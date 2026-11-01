import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, type ReactNode } from 'react';

import { useAdminRefundMutation } from '@/api/adminRefund';
import {
  useVodPassApplicationsQuery,
  vodPassApplicationsQueryKey,
  type VodPassApplication,
  type VodPassStatus,
} from '@/api/vodPassApplications';
import RefundModal, {
  type RefundMode,
  type RefundTarget,
} from '@/domain/admin/program/program-user/ui/RefundModal';
import Table from '@/domain/admin/ui/table/regacy/Table';
import TD from '@/domain/admin/ui/table/regacy/TD';
import TH from '@/domain/admin/ui/table/regacy/TH';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';

const STATUS_LABEL: Record<VodPassStatus, string> = {
  UNACTIVATED: '미활성',
  SCHEDULED: '이용 예정',
  ACTIVE: '이용 중',
  EXPIRED: '만료',
  CANCELED: '취소',
};

const BUNDLED_PROGRAM_LABEL: Record<string, string> = {
  CHALLENGE: '챌린지',
  MEMBERSHIP: '올인원패스',
};

const formatDateTime = (value?: string | null) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';

const matchesKeyword = (pass: VodPassApplication, keyword: string) =>
  [pass.name, pass.email, pass.phoneNum, pass.orderId].some((field) =>
    (field ?? '').toLowerCase().includes(keyword),
  );

const formatBundledProgram = (pass: VodPassApplication) => {
  if (!pass.bundledProgramTitle) return null;
  const type = pass.bundledProgramType ?? '';
  return `${BUNDLED_PROGRAM_LABEL[type] ?? type} ${pass.bundledProgramTitle}`.trim();
};

const toRefundTarget = (pass: VodPassApplication): RefundTarget => {
  const bundledProgram = formatBundledProgram(pass);
  return {
    applicationId: pass.applicationId,
    name: pass.name ?? '-',
    email: pass.email ?? '-',
    phoneNum: pass.phoneNum ?? '-',
    programTitle: 'VOD 이용권',
    orderId: pass.orderId ?? '',
    pricePlanType: null,
    couponName: null,
    couponDiscount: null,
    finalPrice: pass.paidAmount ?? 0,
    notice: [
      bundledProgram &&
        `VOD 결제 금액만 환불되고 함께 결제한 ${bundledProgram} 금액은 환불되지 않습니다.`,
      '환불하면 금액과 상관없이 이용권이 취소되어 시청이 중단됩니다.',
    ]
      .filter(Boolean)
      .join(' '),
  };
};

/** 열이 많아 한 칸에 두 값을 위아래로 묶는다. */
const TwoLines = ({ top, bottom }: { top: ReactNode; bottom: ReactNode }) => (
  <>
    <div>{top}</div>
    <div className="mt-1">{bottom}</div>
  </>
);

/**
 * VOD 이용권 구매자 목록 (LC-3438).
 *
 * 구매 시점의 개월 수, 이용 기간, 결제액을 신청 최신순으로 보여준다.
 * 취소 건과 결제 없이 만든 기간 레코드도 상태 열로 구분해 함께 보여준다.
 * 어드민 환불은 규정을 무시하므로 취소되지 않은 결제 건은 상태와 상관없이 환불할 수 있다.
 */
const VodPassApplications = () => {
  const { data, isLoading, error } = useVodPassApplicationsQuery();
  const [keyword, setKeyword] = useState('');
  const [refundRequest, setRefundRequest] = useState<{
    target: RefundTarget;
    mode: RefundMode;
  } | null>(null);
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const refundMutation = useAdminRefundMutation({
    onSuccess: (refundedAmount) => {
      setRefundRequest(null);
      queryClient.invalidateQueries({ queryKey: vodPassApplicationsQueryKey });
      snackbar(`${refundedAmount.toLocaleString()}원이 환불되었습니다.`);
    },
    onError: (message) => snackbar(message),
  });

  const passes = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!data || !normalized) return data ?? [];
    return data.filter((pass) => matchesKeyword(pass, normalized));
  }, [data, keyword]);

  const renderBody = () => {
    if (isLoading) return <p className="text-sm">불러오는 중입니다.</p>;

    if (error) {
      return (
        <p role="alert" className="text-sm text-red-500">
          {error instanceof Error && error.message
            ? error.message
            : '구매자 목록을 불러오지 못했습니다.'}
        </p>
      );
    }

    return (
      <>
        <div className="mb-4 flex items-center gap-4">
          <input
            type="search"
            aria-label="구매자 검색"
            placeholder="이름, 이메일, 휴대폰, 주문번호 검색"
            className="rounded-xxs focus:border-primary w-80 border border-neutral-300 px-3 py-2 text-sm outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <span className="text-sm">총 {passes.length}건</span>
        </div>
        <Table minWidth={1000}>
          <thead>
            <tr>
              <TH>주문번호 / 신청일시</TH>
              <TH>이름 / 휴대폰 번호</TH>
              <TH>이메일 / 구매 개월</TH>
              <TH>이용 시작 / 종료</TH>
              <TH>상태 / 결제금액</TH>
              <TH>함께 결제</TH>
              <TH>환불</TH>
            </tr>
          </thead>
          <tbody>
            {passes.map((pass) => (
              <tr key={pass.applicationId}>
                <TD>
                  <TwoLines
                    top={pass.orderId ?? '-'}
                    bottom={formatDateTime(pass.createDate)}
                  />
                </TD>
                <TD>
                  <TwoLines
                    top={pass.name ?? '-'}
                    bottom={pass.phoneNum ?? '-'}
                  />
                </TD>
                <TD>
                  <TwoLines
                    top={pass.email ?? '-'}
                    bottom={
                      pass.purchasedMonths ? `${pass.purchasedMonths}개월` : '-'
                    }
                  />
                </TD>
                <TD>
                  <TwoLines
                    top={formatDateTime(pass.startsAt)}
                    bottom={formatDateTime(pass.endsAt)}
                  />
                </TD>
                <TD>
                  <TwoLines
                    top={STATUS_LABEL[pass.status]}
                    bottom={
                      pass.paidAmount == null
                        ? '-'
                        : `${pass.paidAmount.toLocaleString()}원`
                    }
                  />
                </TD>
                <TD whiteSpace="wrap">
                  {formatBundledProgram(pass) ?? '없음'}
                </TD>
                <TD>
                  {pass.status === 'CANCELED' || pass.paidAmount == null ? (
                    '-'
                  ) : (
                    <TwoLines
                      top={
                        <button
                          type="button"
                          className="rounded border border-neutral-300 px-2 py-1"
                          onClick={() =>
                            setRefundRequest({
                              target: toRefundTarget(pass),
                              mode: 'full',
                            })
                          }
                        >
                          전체 환불
                        </button>
                      }
                      bottom={
                        <button
                          type="button"
                          className="rounded border border-neutral-300 px-2 py-1"
                          onClick={() =>
                            setRefundRequest({
                              target: toRefundTarget(pass),
                              mode: 'partial',
                            })
                          }
                        >
                          부분 환불
                        </button>
                      }
                    />
                  )}
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
        {passes.length === 0 && (
          <p className="mt-4 text-sm">조건에 맞는 구매자가 없습니다.</p>
        )}
      </>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-1.5-bold mb-6">VOD 이용권 구매자</h1>
      {renderBody()}
      {refundRequest && (
        <RefundModal
          target={refundRequest.target}
          mode={refundRequest.mode}
          isSubmitting={refundMutation.isPending}
          onSubmit={(body) =>
            refundMutation.mutate({
              applicationId: refundRequest.target.applicationId,
              body,
            })
          }
          onClose={() => setRefundRequest(null)}
        />
      )}
    </div>
  );
};

export default VodPassApplications;
