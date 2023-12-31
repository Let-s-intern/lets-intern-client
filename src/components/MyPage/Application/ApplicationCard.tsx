import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import {
  CardBadge,
  CardBlock,
  CardBottom,
  CardBottomLink,
  CardMiddle,
  CardTitle,
  CardTop,
} from '../Card';
import AlertModal from '../../AlertModal';

interface ApplicationCardProps {
  application: any;
  statusToLabel: any;
  fetchApplicationDelete: (applicationId: number, status: string) => void;
  hasCancel?: boolean;
}

const ApplicationCard = ({
  application,
  statusToLabel,
  fetchApplicationDelete,
  hasCancel = true,
}: ApplicationCardProps) => {
  const [isDeleteMoal, setIsDeleteModal] = useState(false);
  const navigate = useNavigate();

  const onCancel = () => {
    setIsDeleteModal(false);
  };

  const onConfirm = () => {
    fetchApplicationDelete(application.id, application.status);
    setIsDeleteModal(false);
  };

  return (
    <>
      <CardBlock
        onClick={() => navigate(`/program/detail/${application.programId}`)}
      >
        <CardTop>
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
        {hasCancel && (
          <CardBottom>
            <CardBottomLink
              className="ga_cancel_program"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModal(true);
              }}
            >
              취소하기
            </CardBottomLink>
          </CardBottom>
        )}
      </CardBlock>
      {isDeleteMoal && (
        <AlertModal
          onConfirm={onConfirm}
          onCancel={onCancel}
          title="프로그램 신청 취소"
          confirmText="예"
          cancelText="아니오"
        >
          신청한 프로그램을 취소하시면,
          <br />
          신청 시에 작성했던 정보가 모두 삭제됩니다.
          <br />
          그래도 취소하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default ApplicationCard;
