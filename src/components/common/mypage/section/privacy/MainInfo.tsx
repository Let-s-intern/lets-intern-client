import { useState } from 'react';

import axios from '../../../../../utils/axios';
import { isValidEmail, isValidPhoneNumber } from '../../../../../utils/valid';
import WithDrawAlertModal from '../../alert/WithDrawAlertModal';

interface MainInfoProps {
  mainInfoValues: any;
  initialValues: any;
  socialAuth: 'KAKAO' | 'NAVER' | null;
  loading: boolean;
  setUserInfo: (userInfo: any) => void;
  resetInitialValues: () => void;
  setShowAlert: (showAlert: boolean) => void;
  setAlertInfo: (alertInfo: { title: string; message: string }) => void;
}

const MainInfo = ({
  mainInfoValues,
  initialValues,
  socialAuth,
  loading,
  setUserInfo,
  resetInitialValues,
  setShowAlert,
  setAlertInfo,
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
      setAlertInfo({
        title: '정보 수정 실패',
        message: '모든 항목을 입력해주세요.',
      });
      setShowAlert(true);
      return;
    }
    Object.keys(newValues).forEach((key) => {
      if (newValues[key] === initialValues[key]) {
        delete newValues[key];
      }
    });
    if (Object.keys(newValues).length === 0) {
      setAlertInfo({
        title: '정보 수정 실패',
        message: '변경된 내용이 없습니다.',
      });
      setShowAlert(true);
      return;
    }
    if (!isValidEmail(mainInfoValues.email)) {
      setAlertInfo({
        title: '정보 수정 실패',
        message: '이메일 형식이 올바르지 않습니다.',
      });
      setShowAlert(true);
      return;
    }
    if (!isValidPhoneNumber(mainInfoValues.phoneNum)) {
      setAlertInfo({
        title: '정보 수정 실패',
        message: '휴대폰 번호 형식이 올바르지 않습니다.',
      });
      setShowAlert(true);
      return;
    }
    try {
      await axios.patch('/user', newValues);
      setAlertInfo({
        title: '정보 수정 성공',
        message: '유저 정보가 변경되었습니다.',
      });
      setShowAlert(true);
      resetInitialValues();
    } catch (error) {
      if ((error as any).response.status === 400) {
        setAlertInfo({
          title: '정보 수정 실패',
          message: '이미 존재하는 이메일입니다.',
        });
        setShowAlert(true);
        return;
      }
      setAlertInfo({
        title: '정보 수정 실패',
        message: '유저 정보 변경에 실패했습니다.',
      });
      setShowAlert(true);
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
              placeholder={!loading ? '이름을 입력하세요.' : ''}
              value={mainInfoValues.name || ''}
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
              placeholder={!loading ? 'example@example.com' : ''}
              value={mainInfoValues.email || ''}
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
              placeholder={!loading ? '010-1234-5678' : ''}
              value={mainInfoValues.phoneNum || ''}
            />
          </div>
          {socialAuth && (
            <div className="social-login-area">
              <div className="input-control">
                <label htmlFor="social-auth" className="social-auth">
                  계정연동
                </label>
                {socialAuth === 'KAKAO' ? (
                  <div className="social-login-box kakao">
                    <i>
                      <img
                        src="/icons/kakao-dark-icon.svg"
                        alt="카카오 아이콘"
                      />
                    </i>
                    <span>카카오 로그인</span>
                  </div>
                ) : (
                  socialAuth === 'NAVER' && (
                    <div className="social-login-box naver">
                      <i>
                        <img src="/icons/naver-icon.svg" alt="네이버 아이콘" />
                      </i>
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
        <WithDrawAlertModal setIsWithdrawModal={setIsWithdrawModal} />
      )}
    </section>
  );
};

export default MainInfo;
