'use client';

import { twMerge } from '@/lib/twMerge';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import Button from '../../../common/button/Button';
import Input from '../../../common/input/v1/Input';
import useAuthStore from '../../../store/useAuthStore';
import axios from '../../../utils/axios';

const FindPassword = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.push('/');
  }, [router, isLoggedIn]);

  const handlePhoneNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phone = e.target.value.replace(/[^0-9]/g, '');

    if (phone.length > 11) {
      phone = phone.slice(0, 11);
    }

    if (phone.length <= 6) {
      phone = phone.replace(/(\d{0,3})(\d{0,3})/, (match, p1, p2) => {
        return p2 ? `${p1}-${p2}` : `${p1}`;
      });
    } else if (phone.length <= 10) {
      phone = phone.replace(
        /(\d{0,3})(\d{0,3})(\d{0,4})/,
        (match, p1, p2, p3) => {
          return p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`;
        },
      );
    } else {
      phone = phone.replace(/(\d{3})(\d{4})(\d+)/, (match, p1, p2, p3) => {
        return `${p1}-${p2}-${p3}`;
      });
    }

    setPhoneNum(phone);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsError(false);
      setMessage('이메일을 전송 중입니다. 잠시만 기다려주세요.');
      await axios.post('/user/password', { name, email, phoneNum });
      setMessage('비밀번호 재설정 이메일을 전송하였습니다.');
      alert('입력하신 이메일로 임시 비밀번호가 전송되었습니다.');
      router.push('/login');
    } catch (error) {
      setIsError(true);
      if (isAxiosError(error) && error.response?.status === 404) {
        setMessage('입력하신 정보로 가입된 계정 정보를 찾을 수 없습니다.');
        return;
      }
      if (isAxiosError(error) && error.response?.status === 400) {
        const social = error.response.data.message.slice(0, 3);
        setMessage(`${social}로 로그인해주세요.`);
        alert(
          `${social}로 회원가입된 사용자입니다.\n${social}로 로그인해주세요.`,
        );
        return;
      }
      setMessage(
        '비밀번호 재설정 링크 전송에 실패했습니다.\n하단 채팅문의를 통해 문의해주세요.',
      );
    }
  };

  const submitDisabled = useMemo(
    () => !email || !name || !phoneNum,
    [email, name, phoneNum],
  );

  return (
    <div className="mx-auto mt-8 min-h-screen p-5 sm:mt-12">
      <div className="mx-auto w-full sm:max-w-md">
        <h1 className="mb-5 text-2xl">비밀번호 찾기</h1>
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <Input
              label="이름"
              placeholder="가입하신 이름을 입력해주세요."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="이메일"
              placeholder="가입하신 이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="휴대폰 번호"
              placeholder="010-1234-4567"
              value={phoneNum}
              onChange={(e) => handlePhoneNum(e)}
            />
          </div>
          <div className="space-y-3">
            {message && (
              <span
                className={twMerge(
                  'block whitespace-pre text-center text-sm',
                  isError ? 'text-red-500' : 'text-gray-500',
                )}
              >
                {message}
              </span>
            )}
            <Button type="submit" className="w-full" disabled={submitDisabled}>
              비밀번호 찾기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindPassword;
