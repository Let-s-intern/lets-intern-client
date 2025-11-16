import { clsx } from 'clsx';

interface PersonalInfoConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const PersonalInfoConsent = ({
  checked,
  onChange,
  disabled = false,
}: PersonalInfoConsentProps) => {
  return (
    <div>
      <h2 className="mb-1 text-xsmall16 font-semibold text-neutral-0">
        개인정보 수집 활용 동의서
      </h2>

      {/* 설명 박스 */}
      <div className="rounded-xxs bg-neutral-95 p-3">
        <ol className="list-inside list-decimal text-xsmall14 font-normal leading-[1.375rem] text-neutral-10">
          {/* 1. 개인정보의 수집 및 이용에 대한 동의 */}
          <li>
            개인정보의 수집 및 이용에 대한 동의
            <ul>
              <li className="flex before:mx-1 before:content-['•']">
                수집 및 이용 목적: 렛츠커리어
              </li>
              <li className="flex before:mx-1 before:content-['•']">
                수집 및 이용 항목(필수): 희망 직군, 희망 직무, 희망 산업,
                이력서, 포트폴리오
              </li>
              <li className="flex before:mx-1 before:content-['•']">
                수집 및 이용 항목(선택): 자기소개서
              </li>
              <li className="flex before:mx-1 before:content-['•']">
                개인정보의 보유 및 이용기간: 개인정보 수집·이용에 관한
                동의일로부터 위 이용목적을 위하여 3개월간 보유 및 이용하게
                됩니다. 단, 렛츠커리어 인재풀 등록에 동의하시는 경우 채용 성사를
                위하여 3년간 보유하게 됩니다.
              </li>
            </ul>
          </li>

          {/* 2. 개인정보 수집 동의를 거부할 권리 및 동의를 거부할 경우의 불이익 */}
          <li>
            개인정보 수집 동의를 거부할 권리 및 동의를 거부할 경우의 불이익
            <ul>
              <li className="flex before:mx-1 before:content-['•']">
                위 개인정보 중 필수정보의 수집·이용에 관한 동의는 기업 매칭을
                위해 필수적이므로, 위 사항에 동의하셔야만 면접 및 취업 제안을
                받으실 수 있습니다. 개인정보의 선택 항목 제공 동의를 거부할
                권리가 있습니다.
              </li>
            </ul>
          </li>
        </ol>
      </div>

      {/* 체크 영역 */}
      {/* TODO: 컴포넌트화 */}
      <label
        className={clsx(
          'mt-3 flex items-center gap-1',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        <div className="">
          <img
            src={
              checked ? '/icons/checkbox-fill.svg' : '/icons/Checkbox_Empty.svg'
            }
            alt={checked ? '체크됨' : '체크 안됨'}
            className={clsx('h-6 w-6', disabled && 'opacity-50')}
          />
        </div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <span
          className={clsx(
            'text-xsmall14 font-normal leading-[1.375rem]',
            disabled ? 'text-neutral-50' : 'text-neutral-10',
          )}
        >
          인재풀 등록을 위한 개인정보 활용에 동의합니다.
        </span>
      </label>
    </div>
  );
};

export default PersonalInfoConsent;
