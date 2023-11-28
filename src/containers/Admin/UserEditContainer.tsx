import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import UserEditor from '../../components/Admin/User/UserEditor';
import axios from '../../libs/axios';

const UserEditContainer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/admin`);
        const user = res.data.userList.find(
          (user: any) => user.id === Number(params.userId),
        );
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
    // const res = await axios.patch(`/user/${params.userId}`, values);
    // console.log(res);
    navigate('/admin/users');
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

export default UserEditContainer;
