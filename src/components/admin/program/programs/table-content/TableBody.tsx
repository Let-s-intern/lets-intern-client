import { useState } from 'react';
import styled from 'styled-components';
import { Checkbox } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import ActionButton from '../../../ui/button/ActionButton';
import TD from '../../../ui/table/regacy/TD';
import AlertModal from '../../../../ui/alert/AlertModal';
import {
  newProgramTypeDetailToText,
  newProgramTypeToText,
  programStatusToText,
} from '../../../../../utils/convert';
import { ProgramType } from '../../../../../pages/admin/program/Programs';
import axios from '../../../../../utils/axios';
import dayjs from 'dayjs';

interface ProgramTableBodyProps {
  programList: ProgramType[];
  fetchEditProgramVisible: (programId: number, visible: boolean) => void;
}

const ActionButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const TableBody = ({
  programList,
  fetchEditProgramVisible,
}: ProgramTableBodyProps) => {
  const queryClient = useQueryClient();

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [programDelete, setProgramDelete] = useState<{
    programId: number;
    programType: string;
  }>({
    programId: 0,
    programType: '',
  });

  const editProgramVisible = useMutation({
    mutationFn: async (params: {
      programType: string;
      programId: number;
      visible: boolean;
    }) => {
      const res = await axios.patch(
        `/${params.programType.toLocaleLowerCase()}/${params.programId}`,
        {
          isVisible: params.visible,
        },
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['program'] });
    },
  });

  const delelteProgram = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        `/${programDelete.programType.toLowerCase()}/${
          programDelete.programId
        }`,
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['program'] });
      setIsDeleteModal(false);
      setProgramDelete({ programId: 0, programType: '' });
    },
  });

  const handleEditProgramVisible = (
    programType: string,
    programId: number,
    visible: boolean,
  ) => {
    editProgramVisible.mutate({ programType, programId, visible: !visible });
  };

  const handleDeleteModalConfirm = () => {
    delelteProgram.mutate();
  };

  const handleDeleteModalCancel = () => {
    setProgramDelete({ programId: 0, programType: '' });
    setIsDeleteModal(false);
  };

  return (
    <>
      <tbody>
        {programList.map((program, index: number) => (
          <tr key={index}>
            <TD>
              <span className="flex justify-center">
                {program.classificationList
                  .map(
                    (type) =>
                      newProgramTypeDetailToText[type.programClassification],
                  )
                  .join(', ')}
              </span>
            </TD>
            <TD>{newProgramTypeToText[program.programInfo.programType]}</TD>
            <TD>{program.programInfo.title}</TD>
            <TD>
              {programStatusToText[program.programInfo.programStatusType]}
            </TD>
            <TD>
              {program.programInfo.programType === 'VOD' ? (
                '온라인'
              ) : (
                <>
                  {program.programInfo.currentCount} /{' '}
                  {program.programInfo.participationCount}
                </>
              )}
            </TD>
            <TD>
              {program.programInfo.programType === 'VOD'
                ? '온라인'
                : dayjs(program.programInfo.deadline).format(
                    `M/D(dd) HH:mm까지`,
                  )}
            </TD>
            <TD>
              {program.programInfo.programType === 'VOD'
                ? '온라인'
                : dayjs(program.programInfo.startDate).format(
                    `YYYY/M/D(dd) HH:mm까지`,
                  )}
            </TD>
            <TD>
              <ActionButtonGroup>
                <ActionButton
                  bgColor="green"
                  to={`/admin/programs/${program.programInfo.id}/edit?programType=${program.programInfo.programType}`}
                >
                  수정
                </ActionButton>
                <ActionButton
                  to={`/admin/programs/${program.programInfo.id}/users?programType=${program.programInfo.programType}`}
                  bgColor="blue"
                >
                  참여자
                </ActionButton>
                <ActionButton
                  bgColor="red"
                  onClick={() => {
                    setIsDeleteModal(true);
                    setProgramDelete({
                      programId: program.programInfo.id,
                      programType: program.programInfo.programType,
                    });
                  }}
                >
                  삭제
                </ActionButton>
              </ActionButtonGroup>
            </TD>
            <TD>
              <Checkbox
                checked={program.programInfo.isVisible}
                onChange={() => {
                  handleEditProgramVisible(
                    program.programInfo.programType,
                    program.programInfo.id,
                    program.programInfo.isVisible,
                  );
                }}
              />
            </TD>
            <TD>
              <button
                className="rounded-xxs border border-gray-300 bg-white px-2 py-1"
                onClick={() => {
                  if (!program.programInfo.zoomLink) return;
                  navigator.clipboard
                    .writeText(program.programInfo.zoomLink)
                    .then(() => {
                      alert('링크가 클립보드에 복사되었습니다.');
                    })
                    .catch(() => {
                      alert('복사에 실패했습니다');
                    });
                }}
              >
                {program.programInfo.zoomLink ? '복사' : '없음'}
              </button>
            </TD>
            <TD>{program.programInfo.zoomPassword || '없음'}</TD>
          </tr>
        ))}
      </tbody>

      {isDeleteModal && (
        <AlertModal
          onConfirm={handleDeleteModalConfirm}
          onCancel={handleDeleteModalCancel}
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
