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
  application?: any;
  statusToLabel?: any;
}

const ApplicationCard = ({
  application,
  statusToLabel,
}: ApplicationCardProps) => {
  return (
    <CardBlock to={`/program/${application.id}`}>
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
        <CardBottomLink>취소하기</CardBottomLink>
      </CardBottom>
    </CardBlock>
  );
};

export default ApplicationCard;
