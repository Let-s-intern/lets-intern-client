import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import axios from '../../utils/axios';
import MainInfo from '../../components/common/section/mypage/privacy/MainInfo';
import PasswordChange from '../../components/common/section/mypage/privacy/PasswordChange';
import SubInfo from '../../components/common/section/mypage/privacy/SubInfo';
import AlertModal from '../AlertModal';

const Privacy = () => {
  const [userInfo, setUserInfo] = useState<any>({
    mainInfoValues: {},
    subInfoValues: {},
    passwordValues: {},
    socialAuth: null,
    initialValues: {},
  });
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    title: '',
    message: '',
  });

  const { isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axios.get('/user');
      const { name, email, phoneNum, major, university, authProvider } =
        res.data;
      setUserInfo({
        mainInfoValues: { name, email, phoneNum },
        subInfoValues: { major, university },
        initialValues: { name, email, phoneNum, major, university },
        passwordValues: {},
        socialAuth: authProvider,
      });
      setLoading(false);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      setLoading(false);
    }
  }, [isError]);

  const resetInitialValues = () => {
    setUserInfo((prev: any) => ({
      ...prev,
      initialValues: { ...prev.mainInfoValues, ...prev.subInfoValues },
    }));
  };

  if (isError) {
    return <main className="mypage-content privacy-page">에러 발생</main>;
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
        setShowAlert={setShowAlert}
        setAlertInfo={setAlertInfo}
      />
      <SubInfo
        subInfoValues={userInfo.subInfoValues}
        initialValues={userInfo.initialValues}
        loading={loading}
        setUserInfo={setUserInfo}
        resetInitialValues={resetInitialValues}
        setShowAlert={setShowAlert}
        setAlertInfo={setAlertInfo}
      />
      {/* <AccountInfo /> */}
      <PasswordChange
        passwordValues={userInfo.passwordValues}
        setUserInfo={setUserInfo}
        setShowAlert={setShowAlert}
        setAlertInfo={setAlertInfo}
      />
      {showAlert && (
        <AlertModal
          onConfirm={() => {
            alertInfo.onConfirm && alertInfo.onConfirm();
            setShowAlert(false);
            setAlertInfo({ title: '', message: '' });
          }}
          title={alertInfo.title}
          showCancel={false}
          highlight="confirm"
        >
          <p>
            {alertInfo.message.includes('\n')
              ? alertInfo.message.split('\n').map((line) => (
                  <>
                    {line}
                    <br />
                  </>
                ))
              : alertInfo.message}
          </p>
        </AlertModal>
      )}
    </main>
  );
};

export default Privacy;
