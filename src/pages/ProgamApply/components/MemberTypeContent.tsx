import ListItem from './ListItem';

interface MemberTypeContentProps {
  isLoggedIn: boolean;
}

const MemberTypeContent = ({ isLoggedIn }: MemberTypeContentProps) => {
  return (
    <>
      <ul>
        <ListItem checked={isLoggedIn}>회원 신청</ListItem>
        <ListItem checked={!isLoggedIn}>비회원 신청</ListItem>
      </ul>
    </>
  );
};

export default MemberTypeContent;
