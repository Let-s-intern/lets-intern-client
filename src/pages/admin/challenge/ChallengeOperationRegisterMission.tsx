import { z } from 'zod';
import { useMissionsOfCurrentChallenge } from '../../../context/CurrentChallengeProvider';
import { getMissionAdminId, missionStatusType } from '../../../schema';

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

type Mission = z.infer<typeof getMissionAdminId>['missionList'][number];

const columns: GridColDef<Mission>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
    renderEditCell(params) {
      return 'HO!';
    },
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  {
    field: 'startDate',
  },
  {
    field: 'endDate',
  },
  {
    field: 'th',
  },
  {
    field: 'attendanceCount',
  },
  {
    field: 'lateAttendanceCount',
  },
  {
    field: 'missionStatusType',
    renderCell(params) {
      return <span>{params.value}</span>;
    },
  },
];

const ChallengeOperationRegisterMission = () => {
  const missions = useMissionsOfCurrentChallenge();
  return (
    <main>
      {/* TODO: 채워넣기 */}
      <DataGrid
        rows={missions?.missionList || []}
        columns={columns}
        initialState={
          {
            // pagination: {
            // paginationModel: {
            //   pageSize: 5,
            // },
            // },
          }
        }
        // pageSizeOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick
        autoHeight
      />
    </main>
  );
};

export default ChallengeOperationRegisterMission;
