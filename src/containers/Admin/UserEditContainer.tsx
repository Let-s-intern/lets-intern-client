import { useState } from 'react';

import UserEditor from '../../components/Admin/User/UserEditor';

const UserEditContainer = () => {
  const [values, setValues] = useState({
    name: '홍민서',
    email: 'mshong1007@gmail.com',
    tel: '010-3449-6933',
    password: 'test1234',
    passwordConfirm: 'test1234',
    school: '성균관대학교',
    grade: 2,
    major: '컴퓨터교육과',
    wishJob: '프론트엔드',
    wishCompany: '스타트업, 대기업',
    programs: '챌린지 1기, 부트캠프 1기',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <UserEditor
      title="회원 정보 수정"
      values={values}
      setValues={setValues}
      handleSubmit={handleSubmit}
    />
  );
};

export default UserEditContainer;
