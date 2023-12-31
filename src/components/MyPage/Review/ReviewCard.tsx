import { useNavigate } from 'react-router-dom';

import './ReviewCard.scss';

interface ReviewCardProps {
  to: string;
  application: any;
  status: 'WAITING' | 'DONE';
  statusToLabel: any;
  bottomText?: string;
  hasBottomLink?: boolean;
}

const ReviewCard = ({
  to,
  application,
  status,
  statusToLabel,
  bottomText,
  hasBottomLink = true,
}: ReviewCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="mypage-card review-card" onClick={() => navigate(to)}>
      <div className="card-top">
        <div
          className="badge"
          style={{
            backgroundColor: statusToLabel[status].bgColor,
            color: statusToLabel[status].color,
          }}
        >
          {statusToLabel[status].label}
        </div>
      </div>
      <div className="card-body">
        <h2>{application.programTitle}</h2>
      </div>
      {hasBottomLink && (
        <div className="card-bottom">
          <div className="link ga_create_review">{bottomText}</div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
