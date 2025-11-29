import { useEffect, useState } from 'react';

import { useUserQueryKey } from '@/api/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';
import Input from '../../../ui/input/Input';
import Button from '../../ui/button/Button';

interface BasicInfoValue {
  name: string;
  phoneNum: string;
  email: string;
  contactEmail: string;
  authProvider: string;
}

const BasicInfo = () => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<BasicInfoValue>({
    name: '',
    phoneNum: '',
    email: '',
    contactEmail: '',
    authProvider: '',
  });
  const [isSameEmail, setIsSameEmail] = useState<boolean>(false);

  useQuery({
    queryKey: ['user', '_basic-info'],
    queryFn: async () => {
      const res = await axios.get('/user');
      setUser({
        ...res.data.data,
      });
      return res.data;
    },
  });

  const editMyInfo = useMutation({
    mutationFn: async ({ user }: { user: BasicInfoValue }) => {
      const res = await axios.patch('/user', user);
      return res.data;
    },
    onSuccess: async () => {
      alert('정보가 수정되었습니다.');
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      await queryClient.invalidateQueries({ queryKey: [useUserQueryKey] });
    },
    onError: (error) => {
      alert('정보 수정에 실패했습니다.');
      console.error(error);
    },
  });

  const handlePhoneNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneNum = e.target.value.replace(/[^0-9]/g, '');

    if (phoneNum.length > 11) {
      phoneNum = phoneNum.slice(0, 11);
    }

    if (phoneNum.length <= 6) {
      phoneNum = phoneNum.replace(/(\d{0,3})(\d{0,3})/, (match, p1, p2) => {
        return p2 ? `${p1}-${p2}` : `${p1}`;
      });
    } else if (phoneNum.length <= 10) {
      phoneNum = phoneNum.replace(
        /(\d{0,3})(\d{0,3})(\d{0,4})/,
        (match, p1, p2, p3) => {
          return p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`;
        },
      );
    } else {
      phoneNum = phoneNum.replace(
        /(\d{3})(\d{4})(\d+)/,
        (match, p1, p2, p3) => {
          return `${p1}-${p2}-${p3}`;
        },
      );
    }

    setUser({ ...user, phoneNum });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSameEmail = () => {
    setIsSameEmail(!isSameEmail);
    if (isSameEmail) {
      setUser({ ...user, contactEmail: '' });
    } else {
      setUser({ ...user, contactEmail: user.email });
    }
  };

  const handleSubmit = () => {
    const newUser = {
      ...user,
      contactEmail: isSameEmail ? user.email : user.contactEmail,
    };
    editMyInfo.mutate({ user: newUser });
  };

  useEffect(() => {
    setIsSameEmail(user.email === user.contactEmail);
  }, [user]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex w-full items-center gap-x-3">
        <h1 className="text-lg font-semibold">기본 정보</h1>
        {(user.authProvider === 'KAKAO' || user.authProvider === 'NAVER') && (
          <img
            src={
              user.authProvider === 'KAKAO'
                ? '/images/social_kakao.svg'
                : user.authProvider === 'NAVER'
                  ? '/images/social_naver.svg'
                  : ''
            }
            alt="profile"
            className="h-8"
          />
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 border-b border-b-neutral-70 pb-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-1-medium">
              이름
            </label>
            <Input
              id="name"
              name="name"
              placeholder="김렛츠"
              value={user.name}
              onChange={handleInputChange}
              readOnly={
                user.authProvider === 'KAKAO' || user.authProvider === 'NAVER'
                  ? true
                  : false
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phoneNum" className="text-1-medium">
              휴대폰 번호
            </label>
            <Input
              id="phoneNum"
              name="phoneNum"
              placeholder="010-0000-0000"
              value={user.phoneNum}
              onChange={handlePhoneNumChange}
              readOnly={
                user.authProvider === 'KAKAO' || user.authProvider === 'NAVER'
                  ? true
                  : false
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-1-medium">
              가입한 이메일
            </label>
            <Input
              id="email"
              name="email"
              placeholder="example@example.com"
              value={user.email}
              onChange={handleInputChange}
              disabled
              readOnly={
                user.authProvider === 'KAKAO' || user.authProvider === 'NAVER'
                  ? true
                  : false
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <label htmlFor="contactEmail" className="text-1-medium">
              렛츠커리어 정보 수신용 이메일
            </label>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-neutral-0 text-opacity-[52%]">
                * 결제정보 및 프로그램 신청 관련 알림 수신을 위해, 자주 사용하는
                이메일 주소를 입력해주세요!
              </p>
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={handleSameEmail}
              >
                <img
                  src={
                    isSameEmail
                      ? '/icons/checkbox-checked.svg'
                      : '/icons/checkbox-unchecked.svg'
                  }
                  alt="check"
                  className="h-6 w-6"
                />
                <span className="text-xs font-medium text-neutral-0 text-opacity-[74%]">
                  가입한 이메일과 동일
                </span>
              </div>
            </div>
          </div>
          <Input
            id="contactEmail"
            name="contactEmail"
            placeholder="example@example.com"
            value={user.contactEmail}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <Button onClick={handleSubmit}>
        {!user.contactEmail ? '기본 정보 등록하기' : '기본 정보 수정하기'}
      </Button>
    </section>
  );
};

export default BasicInfo;
