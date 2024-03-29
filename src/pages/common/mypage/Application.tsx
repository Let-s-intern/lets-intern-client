import { useEffect, useState } from 'react';

import axios from '../../../utils/axios';
import CardListSlider from '../../../components/common/ui/card/wrapper/CardListSlider';
import ApplicationCard from '../../../components/common/review/card/ApplicationCard';
import AlertModal from '../../../components/ui/alert/AlertModal';

const Application = () => {
  const [appliedList, setAppliedList] = useState<any>([]);
  const [inProgressList, setInProgressList] = useState<any>([]);
  const [doneList, setDoneList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [isDeleteMoal, setIsDeleteModal] = useState(false);
  const [alertIndex, setAlertIndex] = useState(0);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelApplication, setCancelApplication] = useState<any>();

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

  const fetchApplicationDelete = async () => {
    try {
      await axios.delete(`/application/${cancelApplication.id}`);
      if (cancelApplication.status === 'APPLIED') {
        setAppliedList(
          appliedList.filter((a: any) => a.id !== cancelApplication.id),
        );
      } else if (cancelApplication.status === 'IN_PROGRESS') {
        setInProgressList(
          inProgressList.filter((a: any) => a.id !== cancelApplication.id),
        );
      } else if (cancelApplication.status === 'DONE') {
        setDoneList(doneList.filter((a: any) => a.id !== cancelApplication.id));
      }
      setCancelSuccess(true);
      setAlertIndex(1);
    } catch (err) {
      setError(err);
      setCancelSuccess(false);
      setAlertIndex(1);
    }
  };

  if (error) {
    return <main>에러 발생</main>;
  }

  return (
    <main className="mypage-content">
      <section>
        <h1>신청완료</h1>
        {loading ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder" />
          </CardListSlider>
        ) : !appliedList || appliedList.length === 0 ? (
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
                setIsDeleteModal={setIsDeleteModal}
                setCancelApplication={setCancelApplication}
              />
            ))}
          </CardListSlider>
        )}
      </section>
      <section>
        <h1>참여중</h1>
        {loading ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder" />
          </CardListSlider>
        ) : !inProgressList || inProgressList.length === 0 ? (
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
                hasBottomLink={false}
                hasChallengeLink={true}
                setIsDeleteModal={setIsDeleteModal}
                setCancelApplication={setCancelApplication}
              />
            ))}
          </CardListSlider>
        )}
      </section>
      <section>
        <h1>참여완료</h1>
        {loading ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder" />
          </CardListSlider>
        ) : !doneList || doneList.length === 0 ? (
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
                hasBottomLink={false}
                hasChallengeLink={true}
                setIsDeleteModal={setIsDeleteModal}
                setCancelApplication={setCancelApplication}
              />
            ))}
          </CardListSlider>
        )}
      </section>
      {isDeleteMoal &&
        (alertIndex === 0 ? (
          <AlertModal
            onConfirm={() => {
              fetchApplicationDelete();
            }}
            onCancel={() => setIsDeleteModal(false)}
            title="프로그램 신청 취소"
            confirmText="예"
            cancelText="아니오"
          >
            신청한 프로그램을 취소하시면,
            <br />
            신청 시에 작성했던 정보가 모두 삭제됩니다.
            <br />
            그래도 취소하시겠습니까?
          </AlertModal>
        ) : (
          alertIndex === 1 && (
            <AlertModal
              onConfirm={() => {
                setIsDeleteModal(false);
                setAlertIndex(0);
              }}
              title={
                cancelSuccess ? '프로그램 신청 취소' : '프로그램 신청 취소 실패'
              }
              confirmText="확인"
              highlight="confirm"
              showCancel={false}
            >
              <p>
                {cancelSuccess
                  ? '프로그램 신청이 취소되었습니다.'
                  : '프로그램 신청 취소를 실패하였습니다.'}
              </p>
            </AlertModal>
          )
        ))}
    </main>
  );
};

export default Application;
