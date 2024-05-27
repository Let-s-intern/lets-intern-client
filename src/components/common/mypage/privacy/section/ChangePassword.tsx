import Button from '../../ui/button/Button';
import Input from '../../../ui/input/Input';

const ChangePassword = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">비밀번호 변경</h1>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="origin-password" className="text-1-medium">
            기존 비밀번호
          </label>
          <Input
            id="origin-password"
            name="originPassword"
            placeholder="기존 비밀번호를 입력해주세요."
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="new-password" className="text-1-medium">
            새로운 비밀번호
          </label>
          <Input
            id="new-password"
            name="newPassword"
            placeholder="영문, 숫자, 특수문자 포함 8자리 이상."
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="confirm-password" className="text-1-medium">
          비밀번호 확인
        </label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력해주세요."
        />
      </div>
      <Button className="w-full">비밀번호 변경</Button>
    </section>
  );
};

export default ChangePassword;
