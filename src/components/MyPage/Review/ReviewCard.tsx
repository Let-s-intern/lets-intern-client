import { useNavigate } from 'react-router-dom';
import {
  CardBadge,
  CardBlock,
  CardBottom,
  CardBottomLink,
  CardMiddle,
  CardTitle,
  CardTop,
} from '../Card';

interface ReviewCardProps {
  to: string;
  application: any;
  status: 'WAITING' | 'DONE';
  statusToLabel: any;
  bottomText?: string;
  hasCancel?: boolean;
}

const ReviewCard = ({
  to,
  application,
  status,
  statusToLabel,
  bottomText,
  hasCancel = true,
}: ReviewCardProps) => {
  const navigate = useNavigate();

  return (
    <CardBlock onClick={() => navigate(to)}>
      <CardTop>
        <CardBadge
          $bgColor={statusToLabel[status].bgColor}
          $color={statusToLabel[status].color}
        >
          {statusToLabel[status].label}
        </CardBadge>
      </CardTop>
      <CardMiddle>
        <CardTitle>{application.programTitle}</CardTitle>
      </CardMiddle>
      {hasCancel && (
        <CardBottom>
          <CardBottomLink className="ga_create_review">
            {bottomText}
          </CardBottomLink>
        </CardBottom>
      )}
    </CardBlock>
  );
};

export default ReviewCard;
