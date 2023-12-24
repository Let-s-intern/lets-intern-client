import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import ListItem from './ListItem';
import AlertModal from '../../../AlertModal';

interface MemberTypeContentProps {
  memberChecked: 'USER' | 'GUEST' | '';
  setMemberChecked: (memberChecked: 'USER' | 'GUEST' | '') => void;
}

const MemberTypeContent = ({
  memberChecked,
  setMemberChecked,
}: MemberTypeContentProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoginModal, setIsLoginModal] = useState(false);

  const onConfirm = () => {
    setIsLoginModal(false);
    navigate(`/login?redirect=/program/detail/${params.programId}`);
    setMemberChecked('USER');
  };

  const onCancel = () => {
    setIsLoginModal(false);
    memberChecked === 'GUEST'
      ? setMemberChecked('GUEST')
      : setMemberChecked('');
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
            setIsLoginModal(true);
          }}
        >
          비회원 신청
        </ListItem>
      </ul>
      {isLoginModal && memberChecked === 'USER' && (
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
      {isLoginModal && memberChecked === 'GUEST' && (
        <AlertModal
          title="회원으로 지원하면 마이페이지에서<br />신청현황을 확인하실 수 있습니다."
          onConfirm={onCancel}
          onCancel={onConfirm}
          highlight="cancel"
          confirmText="비회원으로 신청"
          cancelText="회원으로 신청"
        >
          비회원으로 지원 시 다시 지원하거나
          <br />
          취소할 수 없습니다.
        </AlertModal>
      )}
    </>
  );
};

export default MemberTypeContent;
