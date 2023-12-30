import { useEffect, useState } from 'react';

import axios from '../../../libs/axios';
import MainInfo from './MainInfo';
import PasswordChange from './PasswordChange';
import SubInfo from './SubInfo';

import './Privacy.scss';

const Privacy = () => {
  const [mainInfoValues, setMainInfoValues] = useState<any>({});
  const [subInfoValues, setSubInfoValues] = useState<any>({});
  const [passwordValues, setPasswordValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [initialValues, setInitialValues] = useState<any>({});

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

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <main className="privacy-page">
      <MainInfo
        mainInfoValues={mainInfoValues}
        initialValues={initialValues}
        setMainInfoValues={setMainInfoValues}
        resetInitialValues={resetInitialValues}
      />
      <SubInfo
        subInfoValues={subInfoValues}
        initialValues={initialValues}
        setSubInfoValues={setSubInfoValues}
        resetInitialValues={resetInitialValues}
      />
      <PasswordChange
        passwordValues={passwordValues}
        setPasswordValues={setPasswordValues}
      />
    </main>
  );
};

export default Privacy;
