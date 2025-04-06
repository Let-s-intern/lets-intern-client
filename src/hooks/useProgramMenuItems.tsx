import { useGetProgramAdminQuery } from '@/api/program';
import { ProgramStatus } from '@/schema';
import { newProgramTypeToText, programStatusToText } from '@/utils/convert';
import { MenuItem } from '@mui/material';
import { useMemo } from 'react';

export default function useProgramMenuItems(
  status: ProgramStatus[],
  hasNull = true,
) {
  const { data } = useGetProgramAdminQuery({
    page: 1,
    size: 10000,
    status,
  });

  const programMenuItems = useMemo(() => {
    const items =
      data?.programList.map(({ programInfo }) => {
        if (programInfo.isVisible) {
          return (
            <MenuItem
              key={programInfo.programType + programInfo.id}
              value={`${programInfo.programType}-${programInfo.id}`}
            >
              {`[${newProgramTypeToText[programInfo.programType]}/${programStatusToText[programInfo.programStatusType]}] ${programInfo.title}`}
            </MenuItem>
          );
        }
      }) ?? [];

    if (hasNull) {
      return [
        <MenuItem key="null" value="null">
          선택 안 함
        </MenuItem>,
        ...items,
      ];
    }

    return items;
  }, [data, hasNull]);

  return programMenuItems;
}
