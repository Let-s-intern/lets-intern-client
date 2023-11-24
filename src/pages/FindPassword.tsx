import { useEffect, useState } from 'react';

import Button from '../components/Button';
import Input from '../components/Input';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (email === '') {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [email]);

  return (
    <div className="container mx-auto mt-8 p-5 sm:mt-32">
      <div className="mx-auto w-full sm:max-w-md">
        <h1 className="mb-5 text-2xl">비밀번호 찾기</h1>
        <form onSubmit={handleOnSubmit}>
          <Input
            label="이메일"
            placeholder="가입하신 이메일을 입력해주세요."
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <Button
            type="submit"
            className="mt-5 w-full"
            {...(buttonDisabled && { disabled: true })}
          >
            비밀번호 찾기
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FindPassword;
