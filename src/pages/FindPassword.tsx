import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import axios from '../libs/axios';

const FindPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    if (accessToken && refreshToken) {
      navigate('/');
    }
  }, []);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        '/user/password',
        { name, email },
        { headers: { Authorization: '' } },
      );
      alert('입력하신 이메일로 비밀번호 재설정 링크가 전송되었습니다.');
    } catch (error) {
      console.log(error);
      if ((error as any).response?.status === 404) {
        alert('입력하신 정보로 가입된 계정 정보를 찾을 수 없습니다.');
      }
    }
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
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
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
          <Button
            type="submit"
            className="w-full"
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
