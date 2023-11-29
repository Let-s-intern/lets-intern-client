import { useEffect, useState } from 'react';

import Privacy from '../components/MyPage/Privacy/Privacy';
import axios from '../libs/axios';
import parsePhoneNum from '../libs/parsePhoneNum';
import { useNavigate } from 'react-router-dom';

const PrivacyContainer = () => {
  const navigate = useNavigate();
  const [mainInfoValues, setMainInfoValues] = useState<any>({});
  const [subInfoValues, setSubInfoValues] = useState<any>({});
  const [passwordValues, setPasswordValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('/user');
        setMainInfoValues({
          name: res.data.name,
          email: res.data.email,
          phoneNum: parsePhoneNum(res.data.phoneNum, false),
        });
        setSubInfoValues({
          major: res.data.major,
          university: res.data.university,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleChangeMainInfo = (e: any) => {
    const { name, value } = e.target;
    setMainInfoValues({
      ...mainInfoValues,
      [name]: value,
    });
  };

  const handleSaveMainInfo = async (e: any) => {
    e.preventDefault();
    if (
      !mainInfoValues.name ||
      !mainInfoValues.email ||
      !mainInfoValues.phoneNum
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    try {
      const reqData = {
        name: mainInfoValues.name,
        email: mainInfoValues.email,
        phoneNum: parsePhoneNum(mainInfoValues.phoneNum, true),
      };
      await axios.patch('/user', reqData);
      alert('유저 정보가 변경되었습니다.');
    } catch (error) {
      alert('유저 정보 변경에 실패했습니다.');
    }
  };

  const handleChangeSubInfo = (e: any) => {
    const { name, value } = e.target;
    setSubInfoValues({
      ...subInfoValues,
      [name]: value,
    });
  };

  const handleSaveSubInfo = async (e: any) => {
    e.preventDefault();
    if (!subInfoValues.major || !subInfoValues.university) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      const reqData = {
        major: subInfoValues.major,
        university: subInfoValues.university,
      };
      await axios.patch('/user', reqData);
      alert('유저 정보가 변경되었습니다.');
    } catch (error) {
      alert('유저 정보 변경에 실패했습니다.');
    }
  };

  const handleChangePassword = (e: any) => {
    const { name, value } = e.target;
    setPasswordValues({
      ...passwordValues,
      [name]: value,
    });
  };

  const handleSavePassword = async (e: any) => {
    e.preventDefault();
    if (passwordValues.newPassword !== passwordValues.newPasswordConfirm) {
      alert('기존 비밀번호와 일치하지 않습니다.');
      return;
    }

    if (
      !passwordValues.currentPassword ||
      !passwordValues.newPassword ||
      !passwordValues.newPasswordConfirm
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      const reqData = {
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
      };
      await axios.patch('/user/password', reqData);
      alert('비밀번호가 변경되었습니다.');
    } catch (err) {
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      axios.delete('/user/withdraw');
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/');
    } catch (err) {
      alert('회원 탈퇴에 실패했습니다.');
    }
  };

  return (
    <Privacy
      loading={loading}
      error={error}
      mainInfoValues={mainInfoValues}
      subInfoValues={subInfoValues}
      passwordValues={passwordValues}
      handleChangeMainInfo={handleChangeMainInfo}
      handleSaveMainInfo={handleSaveMainInfo}
      handleChangeSubInfo={handleChangeSubInfo}
      handleSaveSubInfo={handleSaveSubInfo}
      handleChangePassword={handleChangePassword}
      handleSavePassword={handleSavePassword}
      handleDeleteAccount={handleDeleteAccount}
    />
  );
};

export default PrivacyContainer;
