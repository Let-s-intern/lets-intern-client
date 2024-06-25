import { useEffect, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';
import Button from '../../ui/button/Button';
import Input from '../../../ui/input/Input';
import GradeDropdown from '../form-control/GradeDropdown';
import { FaCheck } from 'react-icons/fa';

export interface BasicInfoValue {
  name: string;
  phoneNum: string;
  email: string;
  contactEmail: string;
  university: string;
  grade: string;
  major: string;
  wishJob: string;
  wishCompany: string;
  authProvider: string;
}

const BasicInfo = () => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<BasicInfoValue>({
    name: '',
    phoneNum: '',
    email: '',
    contactEmail: '',
    university: '',
    grade: '',
    major: '',
    wishJob: '',
    wishCompany: '',
    authProvider: '',
  });
  const [isSameEmail, setIsSameEmail] = useState<boolean>(false);

  useQuery({
    queryKey: ['user', '_basic-info'],
    queryFn: async () => {
      const res = await axios.get('/user');
      console.log(res.data.data);
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
    },
    onError: (error) => {
      alert('정보 수정에 실패했습니다.');
      console.error(error);
    }
  });

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

  const handleGradeChange = (grade: string) => {
    setUser({ ...user, grade });
  }

  const handleSubmit = () => {
    const newUser = {
      ...user,
      contactEmail: isSameEmail ? user.email : user.contactEmail,
    };
    editMyInfo.mutate({ user: newUser });
  };

  useEffect(() => {
    setIsSameEmail(user.email === user.contactEmail);
    // console.log(user);
  }, [user]);

  return (
    <section className="flex flex-col gap-6">
      <div className='flex w-full items-center gap-x-3'>
      <h1 className="text-lg font-semibold">기본 정보</h1>
      {
        (user.authProvider === 'KAKAO' || user.authProvider === 'NAVER') && (
          <img src={user.authProvider === 'KAKAO' ? '/images/social_kakao.svg' : user.authProvider === 'NAVER' ? '/images/social_naver.png' : ''} alt="profile" className="h-8" />
        )
      }
      </div>
      <div className="flex flex-col gap-3">
        <div className='flex flex-col gap-3 pb-4 border-b border-b-neutral-70'>
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
            readOnly = {user.authProvider === 'KAKAO' || user.authProvider === 'NAVER' ? true : false}
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
            onChange={handleInputChange}
            readOnly = {user.authProvider === 'KAKAO' || user.authProvider === 'NAVER' ? true : false}
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
            readOnly = {user.authProvider === 'KAKAO' || user.authProvider === 'NAVER' ? true : false}
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
                <div className="flex h-[1rem] w-[1rem] items-center justify-center rounded-[0.125rem] border-[1.5px] border-neutral-60 bg-neutral-85">
                  {isSameEmail && (
                    <span className="text-[0.7rem] text-neutral-50">
                      <FaCheck />
                    </span>
                  )}
                </div>
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
        <div className="flex flex-col gap-1">
          <label htmlFor="university" className="text-1-medium">
            학교
          </label>
          <Input
            id="university"
            name="university"
            placeholder="렛츠대학교"
            value={user.university}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="grade" className="text-1-medium">
            학년
          </label>
          <GradeDropdown value={user.grade} setValue={handleGradeChange} type={'MYPAGE'}/>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="major" className="text-1-medium">
            전공
          </label>
          <Input
            id="major"
            name="major"
            placeholder="OO학과"
            value={user.major}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="wishJob" className="text-1-medium">
            희망 직무
          </label>
          <Input
            id="wishJob"
            name="wishJob"
            placeholder="희망 직무를 입력해주세요."
            value={user.wishJob}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="wishCompany" className="text-1-medium">
            희망 기업
          </label>
          <Input
            id="wishCompany"
            name="wishCompany"
            placeholder="희망 기업을 입력해주세요."
            value={user.wishCompany}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <Button onClick={handleSubmit}>{
        !(user.contactEmail || user.university || user.grade || user.major || user.wishJob || user.wishCompany) ? 
          '기본 정보 등록하기'
         : 
          '기본 정보 수정하기'
    }</Button>
    </section>
  );
};

export default BasicInfo;
