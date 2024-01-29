import axios from '../../../utils/axios';
import { isValidPassword } from '../../../utils/valid';

interface PasswordChangeProps {
  passwordValues: any;
  setUserInfo: (userInfo: any) => void;
  setShowAlert: (showAlert: boolean) => void;
  setAlertInfo: (alertInfo: { title: string; message: string }) => void;
}

const PasswordChange = ({
  passwordValues,
  setUserInfo,
  setShowAlert,
  setAlertInfo,
}: PasswordChangeProps) => {
  const handleChangePassword = (e: any) => {
    const { name, value } = e.target;
    setUserInfo((prev: any) => ({
      ...prev,
      passwordValues: {
        ...prev.passwordValues,
        [name]: value,
      },
    }));
  };

  const handleSavePassword = async (e: any) => {
    e.preventDefault();
    if (
      !passwordValues.currentPassword ||
      !passwordValues.newPassword ||
      !passwordValues.newPasswordConfirm
    ) {
      setAlertInfo({
        title: '비밀번호 변경 실패',
        message: '모든 항목을 입력해주세요.',
      });
      setShowAlert(true);
      return;
    }
    if (passwordValues.newPassword === passwordValues.currentPassword) {
      setAlertInfo({
        title: '비밀번호 변경 실패',
        message: '기존 비밀번호와 동일한 비밀번호입니다.',
      });
      setShowAlert(true);
      return;
    }
    if (passwordValues.newPassword !== passwordValues.newPasswordConfirm) {
      setAlertInfo({
        title: '비밀번호 변경 실패',
        message: '새로운 비밀번호가 비밀번호 확인과 일치하지 않습니다.',
      });
      setShowAlert(true);
      return;
    }
    if (!isValidPassword(passwordValues.newPassword)) {
      setAlertInfo({
        title: '비밀번호 변경 실패',
        message:
          '새로운 비밀번호의 형식이 올바르지 않습니다.\n(영어, 숫자, 특수문자 포함 8자 이상)',
      });
      setShowAlert(true);
      return;
    }
    try {
      const reqData = {
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
      };
      await axios.patch('/user/password', reqData);
      setAlertInfo({
        title: '비밀번호 변경 성공',
        message: '비밀번호가 변경되었습니다.',
      });
      setShowAlert(true);
      setUserInfo((prev: any) => ({
        ...prev,
        passwordValues: {
          currentPassword: '',
          newPassword: '',
          newPasswordConfirm: '',
        },
      }));
    } catch (err) {
      if ((err as any).response.status === 400) {
        setAlertInfo({
          title: '비밀번호 변경 실패',
          message: '기존 비밀번호가 일치하지 않습니다.',
        });
        setShowAlert(true);
      } else {
        setAlertInfo({
          title: '비밀번호 변경 실패',
          message: '비밀번호 변경에 실패했습니다.',
        });
        setShowAlert(true);
      }
    }
  };

  return (
    <section className="password-change-section">
      <h1>비밀번호 변경</h1>
      <form onSubmit={handleSavePassword}>
        <div className="input-group">
          <div className="input-control">
            <label htmlFor="current-password">기존 비밀번호</label>
            <input
              type="password"
              placeholder="기존 비밀번호를 입력하세요."
              id="current-password"
              name="currentPassword"
              value={passwordValues?.currentPassword || ''}
              onChange={handleChangePassword}
              autoComplete="off"
            />
          </div>
          <div className="input-control">
            <label htmlFor="new-password">새로운 비밀번호</label>
            <input
              type="password"
              placeholder="영어, 숫자, 특수문자 포함 8자 이상"
              id="new-password"
              name="newPassword"
              value={passwordValues?.newPassword || ''}
              onChange={handleChangePassword}
              autoComplete="off"
            />
          </div>
          <div className="input-control">
            <label htmlFor="new-password-confirm">비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호를 다시 입력하세요."
              id="new-password-confirm"
              name="newPasswordConfirm"
              value={passwordValues?.newPasswordConfirm || ''}
              onChange={handleChangePassword}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="action-group">
          <button type="submit">비밀번호 변경</button>
        </div>
      </form>
    </section>
  );
};

export default PasswordChange;
