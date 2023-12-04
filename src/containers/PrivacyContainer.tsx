import { useEffect, useState } from 'react';

import Privacy from '../components/MyPage/Privacy/Privacy';
import axios from '../libs/axios';
import parsePhoneNum from '../libs/parsePhoneNum';
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
} from '../libs/valid';

const PrivacyContainer = () => {
  const [mainInfoValues, setMainInfoValues] = useState<any>({});
  const [subInfoValues, setSubInfoValues] = useState<any>({});
  const [passwordValues, setPasswordValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [initialValues, setInitialValues] = useState<any>({});

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('/user');
        setMainInfoValues({
          name: res.data.name,
          email: res.data.email,
          phoneNum: res.data.phoneNum,
        });
        setSubInfoValues({
          major: res.data.major,
          university: res.data.university,
        });
        setInitialValues({
          name: res.data.name,
          email: res.data.email,
          phoneNum: res.data.phoneNum,
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

  const resetInitialValues = () => {
    setInitialValues({
      name: mainInfoValues.name,
      email: mainInfoValues.email,
      phoneNum: mainInfoValues.phoneNum,
      major: subInfoValues.major,
      university: subInfoValues.university,
    });
  };

  // 이름, 이메일, 휴대폰 번호 변경 입력 폼의 값이 변경될 때마다 실행되는 함수
  const handleChangeMainInfo = (e: any) => {
    const { name, value } = e.target;
    setMainInfoValues({
      ...mainInfoValues,
      [name]: value,
    });
  };

  // 이름, 이메일, 휴대폰 번호 변경 버튼 클릭 시 실행되는 함수
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
    if (!isValidEmail(mainInfoValues.email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (!isValidPhoneNumber(mainInfoValues.phoneNum)) {
      alert('휴대폰 번호 형식이 올바르지 않습니다.');
      return;
    }
    try {
      const reqData = {
        name: mainInfoValues.name,
        email: mainInfoValues.email,
        phoneNum: mainInfoValues.phoneNum,
      };
      if (mainInfoValues.phoneNum === initialValues.phoneNum) {
        delete reqData.phoneNum;
      }
      if (mainInfoValues.email === initialValues.email) {
        delete reqData.email;
      }
      if (mainInfoValues.name === initialValues.name) {
        delete reqData.name;
      }
      await axios.patch('/user', reqData);
      alert('유저 정보가 변경되었습니다.');
      resetInitialValues();
    } catch (error) {
      if ((error as any).response.status === 400) {
        alert('이미 존재하는 이메일입니다.');
        return;
      }
      alert('유저 정보 변경에 실패했습니다.');
    }
  };

  // 학과, 학교 정보 변경 입력 폼의 값이 변경될 때마다 실행되는 함수
  const handleChangeSubInfo = (e: any) => {
    const { name, value } = e.target;
    setSubInfoValues({
      ...subInfoValues,
      [name]: value,
    });
  };

  // 학과, 학교 정보 변경 버튼 클릭 시 실행되는 함수
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
      if (subInfoValues.major === initialValues.major) {
        delete reqData.major;
      }
      if (subInfoValues.university === initialValues.university) {
        delete reqData.university;
      }
      await axios.patch('/user', reqData);
      alert('유저 정보가 변경되었습니다.');
      resetInitialValues();
    } catch (error) {
      alert('유저 정보 변경에 실패했습니다.');
    }
  };

  // 비밀번호 변경 입력 폼의 값이 변경될 때마다 실행되는 함수
  const handleChangePassword = (e: any) => {
    const { name, value } = e.target;
    setPasswordValues({
      ...passwordValues,
      [name]: value,
    });
  };

  // 비밀번호 변경 버튼 클릭 시 실행되는 함수
  const handleSavePassword = async (e: any) => {
    e.preventDefault();
    if (
      !passwordValues.currentPassword ||
      !passwordValues.newPassword ||
      !passwordValues.newPasswordConfirm
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (passwordValues.newPassword === passwordValues.currentPassword) {
      alert('기존 비밀번호와 동일한 비밀번호입니다.');
      return;
    }
    if (passwordValues.newPassword !== passwordValues.newPasswordConfirm) {
      alert('새로운 비밀번호가 비밀번호 확인과 일치하지 않습니다.');
      return;
    }
    if (!isValidPassword(passwordValues.newPassword)) {
      alert('새로운 비밀번호의 형식이 올바르지 않습니다.');
      return;
    }
    try {
      const reqData = {
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
      };
      await axios.patch('/user/password', reqData);
      alert('비밀번호가 변경되었습니다.');
      setPasswordValues({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      });
    } catch (err) {
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  // 회원 탈퇴 버튼 클릭 시 실행되는 함수
  const handleDeleteAccount = async () => {
    try {
      axios.get('/user/withdraw');
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      window.location.href = '/';
    } catch (err) {
      alert('회원 탈퇴에 실패했습니다.');
    }
  };

  // 컴포넌트 렌더링
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
