'use client';

interface AgreementSectionProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * 예약 변경 고지 동의 (시안 `1-0`, 캘린더 바로 아래).
 *
 * 필수다. 체크를 풀면 `신청하기` 가 잠긴다. 슬롯은 멘토가 연 시간표에서 잘려 나가는
 * 것이라 신청 후 바꾸는 경로가 없다 — 누르기 전에 한 번 확인시키는 자리다.
 */
const AgreementSection = ({ checked, onChange }: AgreementSectionProps) => {
  return (
    <label className="text-xsmall14 text-neutral-30 flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-primary h-4 w-4"
      />
      신청 완료 후에는 예약 시간 변경이 어려울 수 있음을 확인했습니다.
    </label>
  );
};

export default AgreementSection;
