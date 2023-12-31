import { useState } from 'react';

import axios from '../../../libs/axios';
import { isValidEmail, isValidPhoneNumber } from '../../../libs/valid';
import WithDrawAlertModal from './WithDrawAlertModal';

interface MainInfoProps {
  mainInfoValues: any;
  initialValues: any;
  socialAuth: 'KAKAO' | 'NAVER' | null;
  loading: boolean;
  setUserInfo: (userInfo: any) => void;
  resetInitialValues: () => void;
}

const MainInfo = ({
  mainInfoValues,
  initialValues,
  socialAuth,
  loading,
  setUserInfo,
  resetInitialValues,
}: MainInfoProps) => {
  const [isWithdrawModal, setIsWithdrawModal] = useState(false);

  const handleChangeMainInfo = (e: any) => {
    const { name, value } = e.target;
    setUserInfo((prev: any) => ({
      ...prev,
      mainInfoValues: {
        ...prev.mainInfoValues,
        [name]: value,
      },
    }));
  };

  const handleSaveMainInfo = async (e: any) => {
    e.preventDefault();
    if (socialAuth) return;
    let hasNull: boolean = false;
    const newValues = { ...mainInfoValues };
    Object.keys(newValues).forEach((key) => {
      if (!newValues[key]) {
        hasNull = true;
        return;
      }
    });
    if (hasNull) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    Object.keys(newValues).forEach((key) => {
      if (newValues[key] === initialValues[key]) {
        delete newValues[key];
      }
    });
    if (Object.keys(newValues).length === 0) {
      alert('변경된 내용이 없습니다.');
      return;
    }
    if (!isValidEmail(mainInfoValues.email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (!isValidPhoneNumber(mainInfoValues.phoneNum)) {
      alert('휴대폰 번호 형식이 올바르지 않습니다.');
      return;
    }
    try {
      await axios.patch('/user', newValues);
      alert('유저 정보가 변경되었습니다.');
      resetInitialValues();
    } catch (error) {
      if ((error as any).response.status === 400) {
        alert('이미 존재하는 이메일입니다.');
        return;
      }
      alert('유저 정보 변경에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      axios.get('/user/withdraw');
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      window.location.href = '/';
    } catch (err) {
      alert('회원 탈퇴에 실패했습니다.');
    }
  };

  return (
    <section className="main-info-section">
      <h1>개인정보</h1>
      <form onSubmit={handleSaveMainInfo}>
        <div className="input-group">
          <div className="input-control">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              name="name"
              onChange={handleChangeMainInfo}
              autoComplete="off"
              disabled={socialAuth !== null}
              {...(!loading && {
                placeholder: '이름을 입력하세요.',
                value: mainInfoValues.name,
              })}
            />
          </div>
          <div className="input-control">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              name="email"
              onChange={handleChangeMainInfo}
              autoComplete="off"
              disabled={socialAuth !== null}
              {...(!loading && {
                placeholder: 'example@example.com',
                value: mainInfoValues.email,
              })}
            />
          </div>
          <div className="input-control">
            <label htmlFor="phone-number">휴대폰 번호</label>
            <input
              id="phone-number"
              name="phoneNum"
              onChange={handleChangeMainInfo}
              autoComplete="off"
              disabled={socialAuth !== null}
              {...(!loading && {
                placeholder: '010-1234-5678',
                value: mainInfoValues.phoneNum,
              })}
            />
          </div>
          {socialAuth && (
            <div className="social-login-area">
              <div className="input-control">
                <label htmlFor="social-auth">계정연동</label>
                {socialAuth === 'KAKAO' ? (
                  <div className="social-login-info kakao">
                    <span>카카오 로그인</span>
                  </div>
                ) : (
                  socialAuth === 'NAVER' && (
                    <div className="social-login-info naver">
                      <span>네이버 로그인</span>
                    </div>
                  )
                )}
              </div>
              <div className="action-group">
                <button type="button" onClick={() => setIsWithdrawModal(true)}>
                  회원 탈퇴
                </button>
              </div>
            </div>
          )}
        </div>
        {!socialAuth && (
          <div className="action-group">
            <button type="submit">정보 수정</button>
            <button type="button" onClick={() => setIsWithdrawModal(true)}>
              회원 탈퇴
            </button>
          </div>
        )}
      </form>
      {isWithdrawModal && (
        <WithDrawAlertModal
          onDeleteAccount={handleDeleteAccount}
          setIsWithdrawModal={setIsWithdrawModal}
        />
      )}
    </section>
  );
};

export default MainInfo;
