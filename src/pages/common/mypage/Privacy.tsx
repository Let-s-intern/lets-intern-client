import AccountInfo from '../../../components/common/mypage/privacy/section/AccountInfo';
import BasicInfo from '../../../components/common/mypage/privacy/section/BasicInfo';
import ChangePassword from '../../../components/common/mypage/privacy/section/ChangePassword';
import MarketingAgree from '../../../components/common/mypage/privacy/section/MarketingAgree';

const Privacy = () => {
  return (
    <main className="flex flex-col gap-16 pb-16">
      <BasicInfo />
      <AccountInfo />
      <ChangePassword />
      <MarketingAgree />
    </main>
  );
};

export default Privacy;
