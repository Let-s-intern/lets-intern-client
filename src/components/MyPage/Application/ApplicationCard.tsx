import { useNavigate } from 'react-router-dom';

import formatDateString from '../../../utils/formatDateString';

import './ApplicationCard.scss';

interface ApplicationCardProps {
  application: any;
  statusToLabel: any;
  hasBottomLink?: boolean;
  setIsDeleteModal: (isDeleteModal: boolean) => void;
  setCancelApplication: (cancelApplication: any) => void;
}

const ApplicationCard = ({
  application,
  statusToLabel,
  hasBottomLink = true,
  setIsDeleteModal,
  setCancelApplication,
}: ApplicationCardProps) => {
  const navigate = useNavigate();

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
                setCancelApplication(application);
                setIsDeleteModal(true);
              }}
            >
              취소하기
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplicationCard;
