import { FaCheck } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';

import Input from '../../../../ui/input/Input';
import { UserInfo } from '../../section/ApplySection';

interface UserInputSectionProps {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}

const UserInputSection = ({ userInfo, setUserInfo }: UserInputSectionProps) => {
  const handleSameEmail = () => {
    if (isSameEmail) {
      setUserInfo({
        ...userInfo,
        contactEmail: '',
      });
    } else {
      setUserInfo({
        ...userInfo,
        contactEmail: userInfo.email,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const isSameEmail = userInfo.email === userInfo.contactEmail;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="ml-3 text-xsmall14 font-semibold">
          이름
        </label>
        <Input
          id="name"
          name="name"
          placeholder="김렛츠"
          value={userInfo.name}
          onChange={handleInputChange}
          disabled
          readOnly
          className="text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="phoneNumber"
          className="ml-3 text-xsmall14 font-semibold"
        >
          휴대폰 번호
        </label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="010-0000-0000"
          value={userInfo.phoneNumber}
          onChange={handleInputChange}
          disabled
          readOnly
          className="text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="ml-3 text-xsmall14 font-semibold">
          가입한 이메일
        </label>
        <Input
          id="email"
          name="email"
          placeholder="example@example.com"
          value={userInfo.email}
          disabled
          readOnly
          className="text-sm"
        />
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
          value={userInfo.contactEmail}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default UserInputSection;
