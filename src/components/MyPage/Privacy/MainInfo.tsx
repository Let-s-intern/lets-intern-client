import { useState } from 'react';

import WithDrawAlertModal from './WithDrawAlertModal';

interface MainInfoProps {
  mainInfoValues: any;
  onChangeMainInfo: (e: any) => void;
  onSubmitMainInfo: (e: any) => void;
  onDeleteAccount: () => void;
}

const MainInfo = ({
  mainInfoValues,
  onChangeMainInfo,
  onSubmitMainInfo,
  onDeleteAccount,
}: MainInfoProps) => {
  const [isWithdrawModal, setIsWithdrawModal] = useState(false);

  return (
    <section className="main-info-section" onSubmit={onSubmitMainInfo}>
      <h1>개인정보</h1>
      <form>
        <div className="input-control">
          <label htmlFor="name">이름</label>
          <input
            placeholder="이름을 입력하세요."
            id="name"
            name="name"
            value={mainInfoValues.name || ''}
            onChange={onChangeMainInfo}
            autoComplete="off"
          />
        </div>
        <div className="input-control">
          <label htmlFor="email">이메일</label>
          <input
            placeholder="example@example.com"
            id="email"
            name="email"
            value={mainInfoValues.email || ''}
            onChange={onChangeMainInfo}
            autoComplete="off"
          />
        </div>
        <div className="input-control">
          <label htmlFor="phone-number">휴대폰 번호</label>
          <input
            placeholder="010-1234-5678"
            id="phone-number"
            name="phoneNum"
            value={mainInfoValues.phoneNum || ''}
            onChange={onChangeMainInfo}
            autoComplete="off"
          />
        </div>
        <div className="action-group">
          <button type="submit">정보 수정</button>
          <button type="button" onClick={() => setIsWithdrawModal(true)}>
            회원 탈퇴
          </button>
        </div>
      </form>
      {isWithdrawModal && (
        <WithDrawAlertModal
          onDeleteAccount={onDeleteAccount}
          setIsWithdrawModal={setIsWithdrawModal}
        />
      )}
    </section>
  );
};

export default MainInfo;
