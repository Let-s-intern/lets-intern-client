import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UserEditor from '../../../components/admin/user/ui/editor/UserEditor';

const UserCreate = () => {
  const navigate = useNavigate();
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
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const handleCancelButtonClick = () => {
    navigate(-1);
  };

  const handleInputChanged = (e: any) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <UserEditor
      loading={loading}
      error={error}
      title="회원 등록"
      values={values}
      handleSubmit={handleSubmit}
      handleInputChanged={handleInputChanged}
      handleCancelButtonClick={handleCancelButtonClick}
    />
  );
};

export default UserCreate;
