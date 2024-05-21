import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../utils/axios';
import FormControl from '../../../components/common/mypage/privacy/FormControl';
import Button from '../../../components/common/mypage/privacy/Button';

const Privacy = () => {
  const [user, setUser] = useState<{
    name: string;
    phoneNum: string;
    email: string;
    contactEmail: string;
    university: string;
    grade: string;
    major: string;
    wishJob: string;
    wishCompany: string;
  }>({
    name: '',
    phoneNum: '',
    email: '',
    contactEmail: '',
    university: '',
    grade: '',
    major: '',
    wishJob: '',
    wishCompany: '',
  });

  const getMyInfo = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axios.get('/user');
      setUser(getMyInfo.data.data);
      return res.data;
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <main>
      <section className="flex flex-col gap-6">
        <h1 className="text-1.125-bold">기본 정보</h1>
        <div className="flex flex-col gap-3">
          <FormControl
            label="이름"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            placeholder="김렛츠"
          />
          <FormControl
            label="휴대폰 번호"
            name="phoneNum"
            value={user.phoneNum}
            onChange={handleInputChange}
            placeholder="010-0000-0000"
          />
          <FormControl
            label="가입한 이메일"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            placeholder="example@example.com"
          />
          <FormControl
            label="렛츠커리어 정보 수신용 이메일"
            name="contactEmail"
            value={user.contactEmail}
            onChange={handleInputChange}
            placeholder="example@example.com"
          />
          <FormControl
            label="학교"
            name="university"
            value={user.university}
            onChange={handleInputChange}
            placeholder="렛츠대학교"
          />
          <FormControl
            label="학년"
            name="grade"
            value={user.grade}
            onChange={handleInputChange}
            placeholder="1"
          />
          <FormControl
            label="전공"
            name="major"
            value={user.major}
            onChange={handleInputChange}
            placeholder="OO학과"
          />
          <FormControl
            label="희망 직무"
            name="wishJob"
            value={user.wishJob}
            onChange={handleInputChange}
            placeholder="희망 직무를 입력해주세요."
          />
          <FormControl
            label="희망 기업"
            name="wishCompany"
            value={user.wishCompany}
            onChange={handleInputChange}
            placeholder="희망 기업을 입력해주세요."
          />
        </div>
        <Button>기본 정보 수정하기</Button>
      </section>
    </main>
  );
};

export default Privacy;
