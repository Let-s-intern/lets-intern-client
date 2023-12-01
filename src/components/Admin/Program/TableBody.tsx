import styled from 'styled-components';
import { Checkbox } from '@mui/material';

import ActionButton from '../ActionButton';
import TD from '../TD';
import { convertTypeToText } from '../../../libs/converTypeToText';
import { useState } from 'react';
import AlertModal from '../../AlertModal';

interface ProgramTableBodyProps {
  programList: any;
  fetchDelete: (programId: number) => void;
  fetchEditProgramVisible: (programId: number, visible: boolean) => void;
}

const ActionButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const TableBody = ({
  programList,
  fetchDelete,
  fetchEditProgramVisible,
}: ProgramTableBodyProps) => {
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [programIdDelete, setProgramIdDelete] = useState(0);

  const onConfirm = () => {
    fetchDelete(programIdDelete);
    setIsDeleteModal(false);
  };

  const onCancel = () => {
    setProgramIdDelete(0);
    setIsDeleteModal(false);
  };

  return (
    <>
      <tbody>
        {programList.map((program: any) => (
          <tr key={program.id}>
            <TD>{convertTypeToText(program.type, true)}</TD>
            <TD>{program.th}</TD>
            <TD>{program.title}</TD>
            <TD>{program.startDate}</TD>
            <TD>
              {program.status === 'OPEN'
                ? '모집 중'
                : program.status === 'CLOSED'
                ? '모집완료'
                : program.status === 'DONE' && '진행완료'}
            </TD>
            <TD>{program.headcount}</TD>
            <TD>{program.announcementDate}</TD>
            <TD>
              <ActionButtonGroup>
                <ActionButton
                  bgColor="green"
                  to={`/admin/programs/${program.id}/edit`}
                >
                  수정
                </ActionButton>
                <ActionButton
                  to={`/admin/programs/${program.id}/users`}
                  bgColor="blue"
                >
                  참여자
                </ActionButton>
                <ActionButton
                  bgColor="red"
                  onClick={() => {
                    setIsDeleteModal(true);
                    setProgramIdDelete(program.id);
                  }}
                >
                  삭제
                </ActionButton>
              </ActionButtonGroup>
            </TD>
            <TD>
              <Checkbox
                checked={program.isVisible}
                onChange={() => {
                  fetchEditProgramVisible(program.id, program.isVisible);
                }}
              />
            </TD>
          </tr>
        ))}
      </tbody>
      {isDeleteModal && (
        <AlertModal
          onConfirm={onConfirm}
          onCancel={onCancel}
          title="프로그램 삭제"
          confirmText="예"
          cancelText="아니오"
        >
          프로그램을 정말로 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default TableBody;
