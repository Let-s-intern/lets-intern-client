import { Link, useNavigate } from 'react-router-dom';
import { LiaExternalLinkAltSolid } from 'react-icons/lia';

import formatDateString from '../../../../utils/formatDateString';

interface ApplicationCardProps {
  application: any;
  statusToLabel: any;
  hasBottomLink?: boolean;
  hasChallengeLink?: boolean;
  setIsDeleteModal: (isDeleteModal: boolean) => void;
  setCancelApplication: (cancelApplication: any) => void;
}

const ApplicationCard = ({
  application,
  statusToLabel,
  hasBottomLink = true,
  hasChallengeLink = false,
  setIsDeleteModal,
  setCancelApplication,
}: ApplicationCardProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="mypage-card"
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
          {hasChallengeLink &&
            (application.programType === 'CHALLENGE_FULL' ||
              application.programType === 'CHALLENGE_HALF') && (
              <div className="mt-2">
                <Link
                  to={`/challenge/${application.programId}`}
                  className="flex items-center justify-end gap-1 text-primary"
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopenner noreferrer"
                >
                  <span className="text-sm font-medium">챌린지로 이동</span>
                  <i className="text-lg">
                    <LiaExternalLinkAltSolid />
                  </i>
                </Link>
              </div>
            )}
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
