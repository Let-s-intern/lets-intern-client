import { useState } from 'react';

import ListItem from './ListItem';
import AlertModal from '../../../components/AlertModal';
import { useNavigate } from 'react-router-dom';

interface MemberTypeContentProps {
  isLoggedIn: boolean;
  memberChecked: 'USER' | 'GUEST' | '';
  setMemberChecked: (memberChecked: 'USER' | 'GUEST' | '') => void;
}

const MemberTypeContent = ({
  isLoggedIn,
  memberChecked,
  setMemberChecked,
}: MemberTypeContentProps) => {
  const navigate = useNavigate();
  const [isLoginModal, setIsLoginModal] = useState(false);

  const onConfirm = () => {
    setIsLoginModal(false);
    navigate('/login');
  };

  const onCancel = () => {
    setIsLoginModal(false);
    setMemberChecked('GUEST');
  };

  return (
    <>
      <ul>
        <ListItem
          checked={memberChecked === 'USER'}
          onClick={() => {
            setMemberChecked('USER');
            setIsLoginModal(true);
          }}
        >
          회원 신청
        </ListItem>
        <ListItem
          checked={memberChecked === 'GUEST'}
          onClick={() => {
            setMemberChecked('GUEST');
          }}
        >
          비회원 신청
        </ListItem>
      </ul>
      {isLoginModal && (
        <AlertModal
          title="로그인이 필요합니다."
          onConfirm={onConfirm}
          onCancel={onCancel}
          highlight="confirm"
        >
          회원 신청을 하기 위해서는
          <br />
          로그인이 필요합니다.
          <br />
          로그인 페이지로 이동하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default MemberTypeContent;
