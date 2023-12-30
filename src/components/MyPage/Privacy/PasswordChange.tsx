import styled from 'styled-components';

interface PasswordChangeProps {
  passwordValues: any;
  onChangePassword: (e: any) => void;
  onSubmitPassword: (e: any) => void;
}

const PasswordChange = ({
  passwordValues,
  onChangePassword,
  onSubmitPassword,
}: PasswordChangeProps) => {
  return (
    <section className="password-change-section">
      <h1>비밀번호 변경</h1>
      <form onSubmit={onSubmitPassword}>
        <div className="input-control">
          <label htmlFor="current-password">기존 비밀번호</label>
          <input
            type="password"
            placeholder="기존 비밀번호를 입력하세요."
            id="current-password"
            name="currentPassword"
            value={passwordValues.currentPassword || ''}
            onChange={onChangePassword}
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
            value={passwordValues.newPassword || ''}
            onChange={onChangePassword}
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
            value={passwordValues.newPasswordConfirm || ''}
            onChange={onChangePassword}
            autoComplete="off"
          />
        </div>
        <div className="action-group">
          <button type="submit">비밀번호 변경</button>
        </div>
      </form>
    </section>
  );
};

export default PasswordChange;
