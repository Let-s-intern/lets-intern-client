'use client';

interface ApplicantFormSectionProps {
  /** 가입 정보. 로딩 전이면 빈 값으로 그린다. */
  name: string;
  phoneNumber: string;
  accountEmail: string;
  /** 렛츠커리어 정보 수신용 이메일. 신청에 실려 가는 유일한 연락처다. */
  contactEmail: string;
  onContactEmailChange: (email: string) => void;
  sameAsAccountEmail: boolean;
  onSameAsAccountEmailChange: (same: boolean) => void;
}

/** 읽기 전용 칸. 시안 `2-0` 의 회색 입력 상자와 같은 모양이다. */
const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-xsmall14 text-neutral-0 font-medium">{label}</span>
    <input
      type="text"
      value={value}
      readOnly
      className="bg-neutral-95 text-xsmall14 text-neutral-30 rounded-sm px-4 py-3"
    />
  </label>
);

/**
 * 신청자 정보 (시안 `2-0` 의 "신청 폼을 모두 입력해주세요").
 *
 * **이름·휴대폰·가입 이메일은 표시 전용이다** (PRD 7-6). 신청 생성 DTO
 * (`CreateLiveMentoringApplicationRequestDto`)에 해당 필드가 아예 없어서 여기서
 * 고쳐 봐야 어디에도 전달되지 않는다. 편집 가능한 것처럼 보이면 사용자가 바꾸고
 * 반영됐다고 믿는다. 사용자 정보를 갱신할지 여부가 정해지면 그때 입력으로 바꾼다.
 *
 * 실제로 전송되는 것은 `contactEmail` 하나뿐이다.
 */
const ApplicantFormSection = ({
  name,
  phoneNumber,
  accountEmail,
  contactEmail,
  onContactEmailChange,
  sameAsAccountEmail,
  onSameAsAccountEmailChange,
}: ApplicantFormSectionProps) => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xsmall16 text-neutral-0 font-semibold">
        신청 폼을 모두 입력해주세요.
      </h2>

      <ReadOnlyField label="이름" value={name} />
      <ReadOnlyField label="휴대폰 번호" value={phoneNumber} />
      <ReadOnlyField label="가입한 이메일" value={accountEmail} />

      <div className="flex flex-col gap-1.5">
        <span className="text-xsmall14 text-neutral-0 font-medium">
          렛츠커리어 정보 수신용 이메일
        </span>
        <p className="text-xxsmall12 text-neutral-45">
          * 결제정보 및 프로그램 신청 관련 알림 수신을 위해, 자주 사용하는 이메일
          주소를 입력해주세요!
        </p>

        <label className="text-xsmall14 text-neutral-30 flex cursor-pointer items-center gap-2 py-1">
          <input
            type="checkbox"
            checked={sameAsAccountEmail}
            onChange={(event) =>
              onSameAsAccountEmailChange(event.target.checked)
            }
            className="accent-primary h-4 w-4"
          />
          가입한 이메일과 동일
        </label>

        <input
          type="email"
          aria-label="렛츠커리어 정보 수신용 이메일"
          value={contactEmail}
          readOnly={sameAsAccountEmail}
          onChange={(event) => onContactEmailChange(event.target.value)}
          placeholder="example@letscareer.co.kr"
          className={`text-xsmall14 text-neutral-0 rounded-sm px-4 py-3 ${
            sameAsAccountEmail ? 'bg-neutral-95' : 'border-neutral-80 border'
          }`}
        />
      </div>
    </section>
  );
};

export default ApplicantFormSection;
