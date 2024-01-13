import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import UserEditor from '../UserEditor';
import axios from '../../../../utils/axios';
import { isValidEmail, isValidPhoneNumber } from '../../../../utils/valid';

const UserEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState<any>({});
  const [initialValues, setInitialValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/admin/${params.userId}`);
        const user = res.data;
        setInitialValues(user);
        const newUser = {
          ...user,
        };
        delete newUser.id;
        delete newUser.signedUpAt;
        setValues(newUser);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!values.name) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!isValidEmail(values.email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (!isValidPhoneNumber(values.phoneNum)) {
      alert('휴대폰 번호 형식이 올바르지 않습니다.');
      return;
    }
    Object.keys(values).forEach((key) => {
      if (!values[key]) {
        delete values[key];
      } else if (values[key] === initialValues[key]) {
        delete values[key];
      }
    });
    try {
      const res = await axios.patch(`/user/admin/${params.userId}`, values);
      navigate('/admin/users');
    } catch (err) {
      if ((err as any).response.status === 400) {
        alert('이미 존재하는 이메일입니다.');
        return;
      } else if ((err as any).response.status === 404) {
        alert('존재하지 않는 회원입니다.');
        return;
      }
    }
  };

  return (
    <UserEditor
      loading={loading}
      error={error}
      title="회원 정보 수정"
      values={values}
      handleCancelButtonClick={handleCancelButtonClick}
      handleSubmit={handleSubmit}
      handleInputChanged={handleInputChanged}
    />
  );
};

export default UserEdit;
