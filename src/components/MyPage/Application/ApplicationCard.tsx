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

const ApplicationCard = () => {
  return (
    <CardBlock to="#">
      <CardTop>
        <CardSubSpan>챌린지</CardSubSpan>
        <CardBadge>신청완료</CardBadge>
      </CardTop>
      <CardMiddle>
        <CardTitle>챌린지 2기</CardTitle>
      </CardMiddle>
      <CardBottom>
        <CardBottomLink>취소하기</CardBottomLink>
      </CardBottom>
    </CardBlock>
  );
};

export default ApplicationCard;
