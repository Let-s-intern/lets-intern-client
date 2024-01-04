import { useState } from 'react';
import { useQuery } from 'react-query';

import axios from '../../../utils/axios';
import MainInfo from './MainInfo';
import PasswordChange from './PasswordChange';
import SubInfo from './SubInfo';

import './Privacy.scss';

const Privacy = () => {
  const [userInfo, setUserInfo] = useState<any>({
    mainInfoValues: {},
    subInfoValues: {},
    passwordValues: {},
    socialAuth: null,
    initialValues: {},
  });
  const [loading, setLoading] = useState(true);

  const { isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await axios.get('/user'),
    onSuccess: ({ data }) => {
      const { name, email, phoneNum, major, university, authProvider } = data;
      setUserInfo({
        mainInfoValues: { name, email, phoneNum },
        subInfoValues: { major, university },
        initialValues: { name, email, phoneNum, major, university },
        socialAuth: authProvider,
      });
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
    refetchOnWindowFocus: false,
  });

  const resetInitialValues = () => {
    setUserInfo((prev: any) => ({
      ...prev,
      initialValues: { ...prev.mainInfoValues, ...prev.subInfoValues },
    }));
  };

  if (isError) {
    return <main className="my-page-content privacy-page">에러 발생</main>;
  }

  return (
    <main className="mypage-content privacy-page">
      <MainInfo
        mainInfoValues={userInfo.mainInfoValues}
        initialValues={userInfo.initialValues}
        socialAuth={userInfo.socialAuth}
        loading={loading}
        setUserInfo={setUserInfo}
        resetInitialValues={resetInitialValues}
      />
      <SubInfo
        subInfoValues={userInfo.subInfoValues}
        initialValues={userInfo.initialValues}
        loading={loading}
        setUserInfo={setUserInfo}
        resetInitialValues={resetInitialValues}
      />
      <PasswordChange
        passwordValues={userInfo.passwordValues}
        setUserInfo={setUserInfo}
      />
    </main>
  );
};

export default Privacy;
