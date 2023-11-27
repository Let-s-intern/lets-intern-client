import { useNavigate } from 'react-router-dom';
import {
  CardBadge,
  CardBlock,
  CardBottom,
  CardBottomLink,
  CardMiddle,
  CardSubSpan,
  CardTitle,
  CardTop,
} from '../Card';

interface ApplicationCardProps {
  application: any;
  statusToLabel: any;
  fetchApplicationDelete: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    applicationId: number,
    status: string,
  ) => void;
}

const ApplicationCard = ({
  application,
  statusToLabel,
  fetchApplicationDelete,
}: ApplicationCardProps) => {
  const navigate = useNavigate();
  return (
    <CardBlock onClick={() => navigate(`/program/${application.programId}`)}>
      <CardTop>
        {/* <CardSubSpan>챌린지</CardSubSpan> */}
        <CardBadge
          $bgColor={statusToLabel[application.status].bgColor}
          $color={statusToLabel[application.status].color}
        >
          {statusToLabel[application.status].label}
        </CardBadge>
      </CardTop>
      <CardMiddle>
        <CardTitle>{application.programTitle}</CardTitle>
      </CardMiddle>
      <CardBottom>
        <CardBottomLink
          onClick={(e) =>
            fetchApplicationDelete(e, application.id, application.status)
          }
        >
          취소하기
        </CardBottomLink>
      </CardBottom>
    </CardBlock>
  );
};

export default ApplicationCard;
