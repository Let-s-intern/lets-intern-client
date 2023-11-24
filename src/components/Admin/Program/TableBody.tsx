import styled from 'styled-components';
import { Checkbox } from '@mui/material';

import ActionButton from '../ActionButton';
import TD from '../TD';

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
  return (
    <tbody>
      {programList.map((program: any) => (
        <tr key={program.id}>
          <TD>{program.status}</TD>
          <TD>{program.title}</TD>
          <TD>{program.th}</TD>
          <TD>{program.type}</TD>
          <TD>{program.startDate}</TD>
          <TD>{program.dueDate}</TD>
          <TD>
            <ActionButtonGroup>
              <ActionButton
                bgColor="green"
                to={`/admin/programs/${program.id}/edit`}
              >
                수정
              </ActionButton>
              <ActionButton to="/admin/programs/1/users" bgColor="blue">
                참여자
              </ActionButton>
              <ActionButton
                bgColor="red"
                onClick={() => fetchDelete(program.id)}
              >
                삭제
              </ActionButton>
            </ActionButtonGroup>
          </TD>
          <TD>
            <Checkbox
              checked={program.isVisible && program.isApproved}
              onChange={() => {
                fetchEditProgramVisible(
                  program.id,
                  program.isVisible && program.isApproved,
                );
              }}
            />
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
