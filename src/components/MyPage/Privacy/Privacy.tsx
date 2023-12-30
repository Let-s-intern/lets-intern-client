import MainInfo from './MainInfo';
import PasswordChange from './PasswordChange';
import SubInfo from './SubInfo';

import './Privacy.scss';

interface PrivacyProps {
  loading: boolean;
  error: any;
  mainInfoValues: any;
  subInfoValues: any;
  passwordValues: any;
  handleChangeMainInfo: (e: any) => void;
  handleSaveMainInfo: (e: any) => void;
  handleChangeSubInfo: (e: any) => void;
  handleSaveSubInfo: (e: any) => void;
  handleChangePassword: (e: any) => void;
  handleSavePassword: (e: any) => void;
  handleDeleteAccount: () => void;
}

const Privacy = ({
  loading,
  error,
  mainInfoValues,
  subInfoValues,
  passwordValues,
  handleChangeMainInfo,
  handleSaveMainInfo,
  handleChangeSubInfo,
  handleSaveSubInfo,
  handleChangePassword,
  handleSavePassword,
  handleDeleteAccount,
}: PrivacyProps) => {
  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <main className="privacy-page">
      <MainInfo
        mainInfoValues={mainInfoValues}
        onChangeMainInfo={handleChangeMainInfo}
        onSubmitMainInfo={handleSaveMainInfo}
        onDeleteAccount={handleDeleteAccount}
      />
      <SubInfo
        subInfoValues={subInfoValues}
        onChangeSubInfo={handleChangeSubInfo}
        onSubmitSubInfo={handleSaveSubInfo}
      />
      <PasswordChange
        passwordValues={passwordValues}
        onChangePassword={handleChangePassword}
        onSubmitPassword={handleSavePassword}
      />
    </main>
  );
};

export default Privacy;
