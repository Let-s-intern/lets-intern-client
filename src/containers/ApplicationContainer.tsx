import { useEffect, useRef, useState } from 'react';

import Application from '../components/MyPage/Application/Application';
import axios from '../libs/axios';

const ApplicationContainer = () => {
  const [appliedList, setAppliedList] = useState<any>([]);
  const [inProgressList, setInProgressList] = useState<any>([]);
  const [doneList, setDoneList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const statusToLabel = useRef<any>({
    APPLIED: { label: '신청완료', bgColor: '#4743A8', color: '#FFFFFF' },
    IN_PROGRESS: { label: '참여중', bgColor: '#6963F6', color: '#FFFFFF' },
    DONE: { label: '참여완료', bgColor: '#242357', color: '#FFFFFF' },
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const {
          data: { userApplicationList },
        } = await axios.get('/application');
        setAppliedList(
          userApplicationList.filter(
            (application: any) => application.status === 'APPLIED',
          ),
        );
        setInProgressList(
          userApplicationList.filter(
            (application: any) => application.status === 'IN_PROGRESS',
          ),
        );
        setDoneList(
          userApplicationList.filter(
            (application: any) => application.status === 'DONE',
          ),
        );
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, []);

  return (
    <Application
      loading={loading}
      error={error}
      appliedList={appliedList}
      inProgressList={inProgressList}
      doneList={doneList}
      statusToLabel={statusToLabel.current}
    />
  );
};

export default ApplicationContainer;
