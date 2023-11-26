import { useState } from 'react';

import UserEditor from '../../components/Admin/User/UserEditor';

const UserCreateContainer = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    tel: '',
    password: '',
    passwordConfirm: '',
    school: '',
    grade: '',
    major: '',
    wishJob: '',
    wishCompany: '',
    programs: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <UserEditor
      title="회원 등록"
      values={values}
      setValues={setValues}
      handleSubmit={handleSubmit}
    />
  );
};

export default UserCreateContainer;
