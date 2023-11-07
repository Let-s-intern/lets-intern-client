import Button from '../components/Button';
import FormTitle from '../components/FormTitle';
import Input from '../components/Input';
import Label from '../components/Label';

const FindPassword = () => {
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto mt-8 p-5 sm:mt-32">
      <div className="mx-auto w-full sm:max-w-md">
        <FormTitle className="mb-3">비밀번호 찾기</FormTitle>
        <form onSubmit={handleOnSubmit}>
          <Label id="email" text="이메일" />
          <Input placeholder="가입하신 이메일을 입력해주세요." />
          <Button type="submit" className="mt-5">
            비밀번호 찾기
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FindPassword;
