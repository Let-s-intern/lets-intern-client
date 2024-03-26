import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Input from '../../ui/input/Input';
import Button from '../ui/button/Button';
import axios from '../../../utils/axios';
import { AxiosError } from 'axios';

interface Props {
  mode: 'BEFORE' | 'AFTER';
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setContentData: any;
}

const PasswordContent = ({
  mode,
  setIsAuthenticated,
  setContentData,
}: Props) => {
  const params = useParams();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [originValue, setOriginValue] = useState('');

  const checkPassword = useMutation({
    mutationFn: async () => {
      if (mode === 'BEFORE') {
        const res = await axios.post(
          `/program/${params.programId}/mentor/prior`,
          {
            mentorPassword: password,
          },
        );
        const data = res.data;
        return data;
      } else {
        const res = await axios.post(
          `/program/${params.programId}/mentor/after`,
          {
            mentorPassword: password,
          },
        );
        const data = res.data;
        return data;
      }
    },
    onSuccess: (data) => {
      console.log(data);
      setContentData(data);
      setIsAuthenticated(true);
    },
    onError: (error: AxiosError<{ code: string }>) => {
      const errorCode = error.response?.data.code;
      if (errorCode === 'PROGRAM_400_4') {
        setOriginValue(password);
        setMessage('암호가 일치하지 않습니다.');
        setIsWrong(true);
      } else {
        setMessage('오류가 발생하였습니다.');
        setIsWrong(true);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    checkPassword.mutate();
  };

  useEffect(() => {
    if (password !== originValue) {
      setIsWrong(false);
      setOriginValue('');
      setMessage('');
    }
  }, [password]);

  return (
    <main className="mx-auto mt-6 min-h-screen px-5 py-5">
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
