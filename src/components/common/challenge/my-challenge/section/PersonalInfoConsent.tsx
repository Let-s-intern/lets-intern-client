interface PersonalInfoConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PersonalInfoConsent = ({
  checked,
  onChange,
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
                수집 및 이용 목적: 렛츠커리어와 더벤처스의 서류 피드백
              </li>
              <li className="flex before:mx-1 before:content-['•']">
                수집 및 이용 항목(필수): 성명, 연락처, 이메일 주소, 희망 직군,
                희망 직무, 희망 산업
              </li>
              <li className="flex before:mx-1 before:content-['•']">
                수집 및 이용 항목(선택): 이력서 파일, 포트폴리오 파일
              </li>
              <li className="flex before:mx-1 before:content-['•']">
                개인정보의 보유 및 이용기간: 개인정보 수집·이용에 관한
                동의일로부터 위 이용목적을 위하여 3개월간 보유 및 이용하게
                됩니다. 단, 더벤처스 인재풀 등록에 동의하시는 경우 채용 성사를
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
      <label className="mt-3 flex cursor-pointer items-center gap-1">
        <div className="">
          <img
            src={
              checked ? '/icons/checkbox-fill.svg' : '/icons/Checkbox_Empty.svg'
            }
            alt={checked ? '체크됨' : '체크 안됨'}
            className="h-6 w-6"
          />
        </div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className="text-xsmall14 font-normal leading-[1.375rem] text-neutral-10">
          인재풀 등록을 위한 개인정보 활용에 동의합니다.
        </span>
      </label>
    </div>
  );
};

export default PersonalInfoConsent;
