import { useEffect, useState } from 'react';

import Input from '../../../../ui/input/Input';
import { UserInfo } from '../../section/ApplySection';

interface UserInputSectionProps {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}

const UserInputSection = ({ userInfo, setUserInfo }: UserInputSectionProps) => {
  const [isSameEmail, setIsSameEmail] = useState<boolean>(false);

  const handleSameEmail = () => {
    if (isSameEmail) {
      setIsSameEmail(false);
      setUserInfo({
        ...userInfo,
        contactEmail: '',
      });
    } else {
      setIsSameEmail(true);
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

  useEffect(() => {
    setIsSameEmail(userInfo.email === userInfo.contactEmail);
  }, [userInfo.email, userInfo.contactEmail]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-1-medium">
          이름
        </label>
        <Input
          id="name"
          name="name"
          placeholder="김렛츠"
          value={userInfo.name}
          onChange={handleInputChange}
          disabled
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phoneNumber" className="text-1-medium">
          휴대폰 번호
        </label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="010-0000-0000"
          value={userInfo.phoneNumber}
          onChange={handleInputChange}
          disabled
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-1-medium">
          가입한 이메일
        </label>
        <Input
          id="email"
          name="email"
          placeholder="example@example.com"
          value={userInfo.email}
          disabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <label htmlFor="contactEmail" className="text-1-medium">
            렛츠커리어 정보 수신용 이메일
          </label>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-neutral-0 text-opacity-[52%]">
              * 결제정보 및 프로그램 신청 관련 알림 수신을 위해, 자주 사용하는
              이메일 주소를 입력해주세요!
            </p>
            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={handleSameEmail}
            >
              <img src={isSameEmail ? '/icons/checkbox-checked.svg' : '/icons/checkbox-unchecked.svg'} alt="check" className="w-6 h-6" />
              <span className="text-xs font-medium text-neutral-0 text-opacity-[74%]">
                가입한 이메일과 동일
              </span>
            </div>
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
