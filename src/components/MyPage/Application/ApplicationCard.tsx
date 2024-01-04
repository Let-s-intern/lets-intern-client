import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AlertModal from '../../AlertModal';
import formatDateString from '../../../utils/formatDateString';

import './ApplicationCard.scss';

interface ApplicationCardProps {
  application: any;
  statusToLabel: any;
  fetchApplicationDelete: (applicationId: number, status: string) => void;
  hasBottomLink?: boolean;
}

const ApplicationCard = ({
  application,
  statusToLabel,
  fetchApplicationDelete,
  hasBottomLink = true,
}: ApplicationCardProps) => {
  const [isDeleteMoal, setIsDeleteModal] = useState(false);
  const navigate = useNavigate();

  const onCancel = () => {
    setIsDeleteModal(false);
  };

  const onConfirm = () => {
    fetchApplicationDelete(application.id, application.status);
    setIsDeleteModal(false);
  };

  return (
    <>
      <div
        className="mypage-card application-card"
        onClick={() => navigate(`/program/detail/${application.programId}`)}
      >
        <div className="card-top">
          <div
            className="badge"
            style={{
              backgroundColor: statusToLabel[application.status].bgColor,
              color: statusToLabel[application.status].color,
            }}
          >
            {statusToLabel[application.status].label}
          </div>
        </div>
        <div className="card-body">
          <h2>{application.programTitle}</h2>
        </div>
        <div className="card-bottom">
          <div className="date-group">
            <div className="date">
              <h3>시작 날짜</h3>
              <span>{formatDateString(application.startDate)}</span>
            </div>
            <div className="date">
              <h3>종료 날짜</h3>
              <span>{formatDateString(application.endDate)}</span>
            </div>
          </div>
          {hasBottomLink && (
            <span
              className="link ga_cancel_program"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModal(true);
              }}
            >
              취소하기
            </span>
          )}
        </div>
      </div>
      {isDeleteMoal && (
        <AlertModal
          onConfirm={onConfirm}
          onCancel={onCancel}
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
      )}
    </>
  );
};

export default ApplicationCard;
