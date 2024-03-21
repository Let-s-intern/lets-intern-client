import { useEffect, useState } from 'react';

import Input from '../../ui/input/Input';
import Button from '../ui/button/Button';

interface Props {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const PasswordContent = ({ setIsAuthenticated }: Props) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [originValue, setOriginValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
    } else {
      setOriginValue(password);
      setMessage('암호가 일치하지 않습니다.');
      setIsWrong(true);
    }
  };

  useEffect(() => {
    if (password !== originValue) {
      setIsWrong(false);
      setOriginValue('');
      setMessage('');
    }
  }, [password]);

  return (
    <main className="mx-auto mt-6 px-5 py-5">
      <div className="mx-auto w-full sm:max-w-md">
        <h1 className="mb-5 text-center text-2xl">암호 입력</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <Input
              label="암호"
              placeholder="암호를 입력해주세요."
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              error={isWrong}
            />
          </div>
          <div className="space-y-3">
            {isWrong && (
              <span className="block text-center text-sm text-red-500">
                {message}
              </span>
            )}
            <Button type="submit" className="w-full" disabled={!password}>
              확인
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PasswordContent;
