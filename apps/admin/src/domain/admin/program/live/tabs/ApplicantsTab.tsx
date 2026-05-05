import { useGetLiveApplicantsQuery } from '@/api/program';
import type { LiveApplicant } from '@/schema';
import { useMemo, useState } from 'react';

const PAGE_SIZE = 20;

interface ApplicantsTabProps {
  liveId: number;
}

/**
 * PRD-서면라이브 분리 §5.4 — 어드민 라이브 상세 신청자 탭.
 *
 * 응답 키는 `.passthrough()` 정의라 BE 확정 전이다.
 * 후보 키 fallback 으로 안전하게 출력한다.
 *
 * TODO(BE): `/live/{liveId}/applications` 응답 형태가 확정되면 fallback 체인을 좁힐 것.
 * - 사용자 이름: `name` | `userName` | `applicantName`
 * - 이메일:   `email` | `contactEmail`
 * - 전화번호: `phoneNumber` | `phoneNum` | `contactPhone`
 * - 신청일:   `createDate` | `createdDate` | `appliedAt`
 * - 결제상태: `paybackStatus` | `paymentStatus` | `isConfirmed`
 *
 * 페이지네이션은 BE 가 `pageInfo` 를 줄 수도 있지만 현재는 client-side 슬라이싱으로 시작.
 */
const ApplicantsTab = ({ liveId }: ApplicantsTabProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetLiveApplicantsQuery({
    liveId,
    enabled: Number.isFinite(liveId) && liveId > 0,
  });

  const applicants = useMemo<LiveApplicant[]>(
    () => data?.applicationList ?? [],
    [data],
  );

  const totalPages = Math.max(1, Math.ceil(applicants.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleApplicants = applicants.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  if (isLoading) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-xsmall14 text-system-error py-16 text-center">
        신청자 목록을 불러오지 못했습니다.
        {error instanceof Error ? ` (${error.message})` : null}
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        신청자가 없습니다.
      </div>
    );
  }

  return (
    <div>
      <div className="border-neutral-80 overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-neutral-60 bg-neutral-95 border-b-2">
              <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                이름
              </th>
              <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                이메일
              </th>
              <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                전화번호
              </th>
              <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                신청일
              </th>
              <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                결제 상태
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleApplicants.map((applicant, index) => (
              <ApplicantRow
                key={applicant.applicationId ?? `${startIndex + index}`}
                applicant={applicant}
              />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="text-xsmall14 mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            className="border-neutral-70 disabled:text-neutral-60 rounded border px-3 py-1 disabled:cursor-not-allowed"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className="border-neutral-70 disabled:text-neutral-60 rounded border px-3 py-1 disabled:cursor-not-allowed"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            다음
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ApplicantsTab;

interface ApplicantRowProps {
  applicant: LiveApplicant;
}

function ApplicantRow({ applicant }: ApplicantRowProps) {
  const raw = applicant as LiveApplicant & Record<string, unknown>;

  const name =
    pickString(raw, ['name', 'userName', 'applicantName']) ?? '-';
  const email = pickString(raw, ['email', 'contactEmail']) ?? '-';
  const phone =
    pickString(raw, ['phoneNumber', 'phoneNum', 'contactPhone']) ?? '-';
  const createdAt =
    pickString(raw, ['createDate', 'createdDate', 'appliedAt']) ?? '-';
  const paymentStatus = pickPaymentStatus(raw);

  return (
    <tr className="border-neutral-80 border-b last:border-b-0">
      <td className="text-xsmall14 text-neutral-0 px-6 py-3">{name}</td>
      <td className="text-xsmall14 text-neutral-0 px-6 py-3">{email}</td>
      <td className="text-xsmall14 text-neutral-0 px-6 py-3">{phone}</td>
      <td className="text-xsmall14 text-neutral-0 px-6 py-3">{createdAt}</td>
      <td className="text-xsmall14 text-neutral-0 px-6 py-3">
        {paymentStatus}
      </td>
    </tr>
  );
}

function pickString(
  obj: Record<string, unknown>,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return null;
}

function pickPaymentStatus(obj: Record<string, unknown>): string {
  const explicit = pickString(obj, ['paybackStatus', 'paymentStatus']);
  if (explicit) {
    return explicit;
  }
  if (typeof obj.isConfirmed === 'boolean') {
    return obj.isConfirmed ? '결제완료' : '대기';
  }
  return '-';
}
