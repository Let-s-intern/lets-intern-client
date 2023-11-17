import ListItem from './ListItem';

const MemberTypeContent = () => {
  return (
    <>
      <ul>
        <ListItem checked>회원 신청</ListItem>
        <ListItem>비회원 신청</ListItem>
      </ul>
    </>
  );
};

export default MemberTypeContent;
