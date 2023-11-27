import styled from 'styled-components';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import ActionButton from '../ActionButton';
import TD from '../TD';
import { convertTypeToText } from '../../../libs/converToTypeText';

interface ProgramTableBodyProps {
  programList: any;
  fetchDelete: (programId: number) => void;
  fetchEditProgramVisible: (programId: number, visible: boolean) => void;
  fetchEditProgramStatus: (programId: number, newStatus: string) => void;
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
  fetchEditProgramStatus,
}: ProgramTableBodyProps) => {
  return (
    <tbody>
      {programList.map((program: any) => (
        <tr key={program.id}>
          <TD>{convertTypeToText(program.type, true)}</TD>
          <TD>{program.th}</TD>
          <TD>{program.title}</TD>
          <TD>{program.startDate}</TD>
          <FormControl fullWidth sx={{ padding: 1 }}>
            <Select
              labelId="status"
              id="status"
              label=""
              value={program.status}
              onChange={(e) =>
                fetchEditProgramStatus(program.id, e.target.value)
              }
            >
              <MenuItem value="OPEN">모집중</MenuItem>
              <MenuItem value="CLOSED">모집완료</MenuItem>
            </Select>
          </FormControl>
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
