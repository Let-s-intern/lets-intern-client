import { useEffect, useState } from 'react';

import axios from '../../../libs/axios';
import CardListSlider from '../CardListSlider';
import ApplicationCard from './ApplicationCard';

import './Application.scss';

const Application = () => {
  const [appliedList, setAppliedList] = useState<any>([]);
  const [inProgressList, setInProgressList] = useState<any>([]);
  const [doneList, setDoneList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const statusToLabel = {
    APPLIED: { label: '신청완료', bgColor: '#4743A8', color: '#FFFFFF' },
    IN_PROGRESS: { label: '참여중', bgColor: '#6963F6', color: '#FFFFFF' },
    DONE: { label: '참여완료', bgColor: '#242357', color: '#FFFFFF' },
  };

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

  const fetchApplicationDelete = async (
    applicationId: number,
    status: string,
  ) => {
    try {
      await axios.delete(`/application/${applicationId}`);
      if (status === 'APPLIED') {
        setAppliedList(appliedList.filter((a: any) => a.id !== applicationId));
      } else if (status === 'IN_PROGRESS') {
        setInProgressList(
          inProgressList.filter((a: any) => a.id !== applicationId),
        );
      } else if (status === 'DONE') {
        setDoneList(doneList.filter((a: any) => a.id !== applicationId));
      }
    } catch (err) {
      setError(err);
    } finally {
      alert('프로그램 신청이 취소되었습니다.');
    }
  };

  if (loading) {
    return <main className="application-page">로딩중...</main>;
  }

  if (error) {
    return <main className="application-page">에러 발생</main>;
  }

  return (
    <main className="my-page-content application-page">
      <section className="applied-section">
        <h1>신청완료</h1>
        {!appliedList || appliedList.length === 0 ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder">신청한 내역이 없습니다.</div>
          </CardListSlider>
        ) : (
          <CardListSlider>
            {appliedList.map((application: any) => (
              <ApplicationCard
                key={application.id}
                application={application}
                statusToLabel={statusToLabel}
                fetchApplicationDelete={fetchApplicationDelete}
              />
            ))}
          </CardListSlider>
        )}
      </section>
      <section className="in-progress-section">
        <h1>참여중</h1>
        {!inProgressList || inProgressList.length === 0 ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder">참여한 내역이 없습니다.</div>
          </CardListSlider>
        ) : (
          <CardListSlider>
            {inProgressList.map((application: any) => (
              <ApplicationCard
                key={application.id}
                application={application}
                statusToLabel={statusToLabel}
                fetchApplicationDelete={fetchApplicationDelete}
                hasCancel={false}
              />
            ))}
          </CardListSlider>
        )}
      </section>
      <section className="done-section">
        <h1>참여완료</h1>
        {!doneList || doneList.length === 0 ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder">
              참여 완료한 내역이 없습니다.
            </div>
          </CardListSlider>
        ) : (
          <CardListSlider>
            {doneList.map((application: any) => (
              <ApplicationCard
                key={application.id}
                application={application}
                statusToLabel={statusToLabel}
                fetchApplicationDelete={fetchApplicationDelete}
                hasCancel={false}
              />
            ))}
          </CardListSlider>
        )}
      </section>
    </main>
  );
};

export default Application;
