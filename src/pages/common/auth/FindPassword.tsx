import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/common/ui/button/Button';
import Input from '../../../components/ui/input/Input';
import axios from '../../../utils/axios';

const FindPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    if (accessToken && refreshToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisabled) return;
    try {
      setIsError(false);
      setMessage('이메일을 전송 중입니다. 잠시만 기다려주세요.');
      await axios.post(
        '/user/password',
        { name, email },
        { headers: { Authorization: '' } },
      );
      setMessage('비밀번호 재설정 이메일을 전송하였습니다.');
      alert('입력하신 이메일로 임시 비밀번호가 전송되었습니다.');
    } catch (error) {
      if ((error as any).response?.status === 404) {
        setIsError(true);
        setMessage('입력하신 정보로 가입된 계정 정보를 찾을 수 없습니다.');
        return;
      }
      setIsError(true);
      setMessage('비밀번호 재설정 링크 전송에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (!email || !name) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [name, email]);

  return (
    <div className="container mx-auto mt-8 p-5 sm:mt-12">
      <div className="mx-auto w-full sm:max-w-md">
        <h1 className="mb-5 text-2xl">비밀번호 찾기</h1>
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <Input
              label="이름"
              placeholder="가입하신 이름을 입력해주세요."
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
            <Input
              label="이메일"
              placeholder="가입하신 이메일을 입력해주세요."
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="space-y-3">
            {message && (
              <span
                className={`block text-center text-sm ${
                  isError ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {message}
              </span>
            )}
            <Button
              type="submit"
              className="w-full"
              {...(buttonDisabled && { disabled: true })}
            >
              비밀번호 찾기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindPassword;
