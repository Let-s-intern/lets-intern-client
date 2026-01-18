import { twMerge } from '@/lib/twMerge';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';

import { UserInfo } from '@/lib/order';
import Input from '../../../../../common/input/v2/Input';

interface UserInputSectionProps {
  userInfo: UserInfo;
  contactEmail: string;
  setContactEmail: (contactEmail: string) => void;
}

const UserInputSection = ({
  userInfo,
  contactEmail,
  setContactEmail,
}: UserInputSectionProps) => {
  const [isSameEmail, setIsSameEmail] = useState(
    contactEmail === userInfo.email,
  );

  const handleSameEmail = () => {
    if (isSameEmail) {
      setContactEmail(userInfo.contactEmail);
    } else {
      setContactEmail(userInfo.email);
    }

    setIsSameEmail((prev) => !prev);
  };

  const handleContactEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactEmail(e.target.value);
    if (e.target.value === userInfo.email) {
      setIsSameEmail(true);
    } else {
      setIsSameEmail(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <label className="ml-3 text-xsmall14 font-semibold">이름</label>
        <Input value={userInfo.name} disabled readOnly className="text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="ml-3 text-xsmall14 font-semibold">휴대폰 번호</label>
        <Input
          value={userInfo.phoneNumber}
          disabled
          readOnly
          className="text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="ml-3 text-xsmall14 font-semibold">
          가입한 이메일
        </label>
        <Input value={userInfo.email} disabled readOnly className="text-sm" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="ml-3">
          <label htmlFor="contactEmail" className="text-xsmall14 font-semibold">
            렛츠커리어 정보 수신용 이메일
          </label>
          <div className="flex flex-col gap-1.5">
            <p className="break-keep text-xxsmall12 font-light text-neutral-0 text-opacity-[52%]">
              * 결제정보 및 프로그램 신청 관련 알림 수신을 위해, 자주 사용하는
              이메일 주소를 입력해주세요!
            </p>
            <label
              className="flex cursor-pointer items-center gap-2"
              htmlFor="same_email_checkbox"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isSameEmail}
                onChange={handleSameEmail}
                id="same_email_checkbox"
              />
              <div
                className={twMerge(
                  'flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-gray-200 bg-transparent transition',
                  isSameEmail && 'border-primary bg-primary',
                )}
              >
                <FaCheck className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="h-4 text-xxsmall12 font-medium text-neutral-0 text-opacity-[74%]">
                가입한 이메일과 동일
              </span>
            </label>
          </div>
        </div>
        <Input
          id="contactEmail"
          name="contactEmail"
          placeholder="example@example.com"
          value={contactEmail}
          onChange={handleContactEmailChange}
        />
      </div>
    </div>
  );
};

export default UserInputSection;
