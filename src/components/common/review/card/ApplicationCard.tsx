import { Link, useNavigate } from 'react-router-dom';
import { LiaExternalLinkAltSolid } from 'react-icons/lia';

import formatDateString from '../../../../utils/formatDateString';
import clsx from 'clsx';

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
          {(application.programType === 'CHALLENGE_FULL' ||
            application.programType === 'CHALLENGE_HALF') &&
            application.status === 'IN_PROGRESS' &&
            application.programFeeType !== 'FREE' && (
              <div className="rounded bg-neutral-500 px-2 py-[0.175rem] text-xs text-white">
                {application.feeIsConfirmed ? '입금 확인' : '입금 미확인'}
              </div>
            )}
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
                  to={
                    application.feeIsConfirmed
                      ? `/challenge/${application.programId}`
                      : '#'
                  }
                  className={clsx(
                    'flex items-center justify-end gap-1 text-primary',
                    {
                      'opacity-0': !application.feeIsConfirmed,
                    },
                  )}
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
