import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import BadgeButton from '../../components/BadgeButton';

const MyPage = () => {
  const [selectedButton, setSelectedButton] = useState('신청현황');

  const handleButtonClick = (category: string) => {
    setSelectedButton(category);
  };

  return (
    <div className="container mx-auto w-full p-5">
      <div className="mb-5 flex justify-center">
        <div className="flex gap-2 sm:gap-3">
          <BadgeButton
            to="/mypage/application"
            category="신청현황"
            onClick={() => handleButtonClick('신청현황')}
            disabled={selectedButton !== '신청현황'}
          />
          <BadgeButton
            to="/mypage/review"
            category="후기작성"
            onClick={() => handleButtonClick('후기작성')}
            disabled={selectedButton !== '후기작성'}
          />
          <BadgeButton
            to="/mypage/privacy"
            category="개인정보"
            onClick={() => handleButtonClick('개인정보')}
            disabled={selectedButton !== '개인정보'}
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default MyPage;
