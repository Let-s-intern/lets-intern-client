import CheckBox from '@/common/box/CheckBox';
import PrivacyLink from '@/domain/auth/ui/PrivacyLink';
import { SignupValue } from '../hooks/useSignup';

interface AgreementSectionProps {
  value: SignupValue;
  setValue: (value: SignupValue) => void;
  isAllAgreed: boolean;
  onToggleAll: () => void;
  onShowPrivacyModal: () => void;
  onShowMarketingModal: () => void;
}

const AgreementSection = ({
  value,
  setValue,
  isAllAgreed,
  onToggleAll,
  onShowPrivacyModal,
  onShowMarketingModal,
}: AgreementSectionProps) => {
  return (
    <div className="mt-12 flex flex-col gap-2">
      {/* 전체 동의 */}
      <button
        type="button"
        className="flex items-center gap-2"
        onClick={onToggleAll}
      >
        <CheckBox checked={isAllAgreed} width="w-6" showCheckIcon />
        <span className="text-xsmall14 text-neutral-0 font-semibold">
          전체 동의
        </span>
      </button>

      <hr className="border-neutral-80" />

      {/* 필수: 만 14세 이상 */}
      <button
        type="button"
        className="flex items-center gap-2"
        onClick={() => setValue({ ...value, acceptedAge: !value.acceptedAge })}
      >
        <CheckBox checked={value.acceptedAge} width="w-6" showCheckIcon />
        <span className="text-xsmall14 text-neutral-0">
          [필수] 만 14세 이상입니다.
        </span>
      </button>

      {/* 필수: 서비스 이용약관 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() =>
            setValue({ ...value, agreeToTerms: !value.agreeToTerms })
          }
        >
          <CheckBox checked={value.agreeToTerms} width="w-6" showCheckIcon />
          <span className="text-xsmall14 text-neutral-0">
            [필수] <span className="text-primary">서비스 이용약관</span> 동의
          </span>
        </button>
        <PrivacyLink
          onClick={() =>
            window.open(
              'https://letsintern.notion.site/251208-2c35e77cbee1800bb2b5cfbd4c2f1525?pvs=21',
              '_blank',
            )
          }
        >
          보기
        </PrivacyLink>
      </div>

      {/* 필수: 개인정보 수집 및 이용 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() =>
            setValue({ ...value, agreeToPrivacy: !value.agreeToPrivacy })
          }
        >
          <CheckBox checked={value.agreeToPrivacy} width="w-6" showCheckIcon />
          <span className="text-xsmall14 text-neutral-0">
            [필수] <span className="text-primary">개인정보 수집 및 이용</span>{' '}
            동의
          </span>
        </button>
        <PrivacyLink onClick={onShowPrivacyModal}>보기</PrivacyLink>
      </div>

      {/* 선택: 마케팅 수신 동의 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() =>
            setValue({ ...value, agreeToMarketing: !value.agreeToMarketing })
          }
        >
          <CheckBox
            checked={value.agreeToMarketing}
            width="w-6"
            showCheckIcon
          />
          <span className="text-xsmall14 text-neutral-0 block break-words break-keep text-left">
            [선택] 렛츠커리어 프로그램 개설 소식을 가장 먼저 받아볼래요!
          </span>
        </button>
        <PrivacyLink onClick={onShowMarketingModal}>보기</PrivacyLink>
      </div>
    </div>
  );
};

export default AgreementSection;
