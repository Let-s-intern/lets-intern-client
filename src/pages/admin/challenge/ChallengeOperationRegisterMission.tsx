import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { DateCalendar, renderDateViewCalendar } from '@mui/x-date-pickers';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { createContext, useMemo, useState } from 'react';
import { z } from 'zod';
import {
  useCurrentChallenge,
  useMissionsOfCurrentChallenge,
} from '../../../context/CurrentChallengeProvider';
import {
  CreateMissionReq,
  getContentsAdminSimple,
  getMissionAdminId,
  UpdateMissionReq,
} from '../../../schema';
import axios from '../../../utils/axios';

type Mission = z.infer<typeof getMissionAdminId>['missionList'][number];

type Content = z.infer<
  typeof getContentsAdminSimple
>['contentsSimpleList'][number];

type Row = Mission & {
  mode: 'normal' | 'create';
  additionalContent: [Content] | [] | null | [null];
  essentialContent: [Content] | [] | null | [null];
  additionalContentList: Content[];
  essentialContentList: Content[];
};

/**
 * startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    id: number;
    th: number;
    missionStatusType: "WAITING" | "CHECK_DONE" | "REFUND_DONE";
    attendanceCount: number;
    lateAttendanceCount: number;
    score: number;
    lateScore: number;
 */
const columns: GridColDef<Row>[] = [
  {
    field: 'tag',
    headerName: '태그',
  },
  {
    field: 'missionName',
    headerName: '미션명',
    editable: true,
  },
  {
    field: 'th',
    headerName: '회차',
    editable: true,
    width: 60,
  },
  {
    field: 'startDate',
    headerName: '공개일',
    width: 150,
    editable: true,
    renderCell(params) {
      return params.row.startDate.format('YYYY-MM-DD');
    },
    renderEditCell(params) {
      return (
        <input
          type="date"
          value={params.row.startDate.format('YYYY-MM-DD')}
          onChange={(e) => {
            console.log(e.target.value);
            params.api.setEditCellValue({
              id: params.id,
              field: 'endDate',
              value: dayjs(e.target.value),
            });
          }}
        />
      );
    },
  },
  {
    field: 'endDate',
    headerName: '마감일',
    width: 150,
    editable: true,
    renderCell(params) {
      console.log(params);
      return params.row.endDate.format('YYYY-MM-DD');
    },
    renderEditCell(params) {
      return (
        <input
          type="date"
          value={params.row.endDate.format('YYYY-MM-DD')}
          onChange={(e) => {
            console.log(e.target.value);
            params.api.setEditCellValue({
              id: params.id,
              field: 'endDate',
              value: dayjs(e.target.value),
            });
          }}
        />
      );
    },
  },
  {
    field: 'score',
    headerName: '미션점수',
    editable: true,
    width: 60,

  },
  {
    field: 'lateScore',
    headerName: '지각점수',
    editable: true,
    width: 60,
  },
  {
    field: 'essential',
    headerName: '필수 콘텐츠',
    width: 100,
    renderCell(params) {
      return params.row.essentialContent?.map((c) => c?.title)?.join(', ');
    },
    
  },
  {
    field: 'additional',
    headerName: '추가 콘텐츠',
    width: 100,
  },
  {
    field: 'management',
    headerName: '',
    renderCell(params) {
      if (params.row.mode === 'create') {
        return (
          <Button
            variant="outlined"
            onClick={() => {
              // api.setEditCellValue({ id: params.id, field: 'mode', value: 'edit' });
            }}
          >
            등록
          </Button>
        );
      }
      return null;
    },
    renderEditCell(params) {
      if (params.row.mode === 'create') {
        return (
          <Button
            variant="outlined"
            onClick={() => {
              // api.commitRowChange(params.id);
            }}
          >
            등록
          </Button>
        );
      }
      return null;
    },
  },
];

declare module '@mui/x-data-grid' {
  export interface ToolbarPropsOverrides {
    onRegisterButtonClick?: () => void;
  }

  export interface CellPropsOverrides {
    essentialContents?: Content[];
    additionalContents?: Content[];
  }
}

function ChallengeOperationRegisterMissionToolbar({
  onRegisterButtonClick,
}: {
  onRegisterButtonClick?: () => void;
}) {
  // const api = useGridApiContext();

  return (
    <GridToolbarContainer
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
      }}
    >
      {/* <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined' },
        }}
      /> */}
      <Button variant="outlined" onClick={onRegisterButtonClick}>
        등록
      </Button>
    </GridToolbarContainer>
  );
}

const missionContext = createContext<{
  editingMission: Mission | null;
  setEditingMission: (mission: Mission | null) => void;
}>({
  editingMission: null,
  setEditingMission: () => {},
});

const MissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  return (
    <missionContext.Provider value={{ editingMission, setEditingMission }}>
      {children}
    </missionContext.Provider>
  );
};

const ChallengeOperationRegisterMission = () => {
  const missions = useMissionsOfCurrentChallenge();
  const { currentChallenge } = useCurrentChallenge();

  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  const createMissionMutation = useMutation({
    mutationFn: async (mission: CreateMissionReq) => {
      return axios.post(`/mission/${currentChallenge?.id}`, mission);
    },
  });

  const { data: additionalContents = [] } = useQuery({
    queryKey: [
      'admin',
      'challenge',
      currentChallenge?.id,
      'missions',
      'contents',
      'additional',
    ],
    queryFn: async (): Promise<Content[]> => {
      if (!currentChallenge) {
        return [];
      }
      const res = await axios.get(`/contents/admin/simple?type=ADDITIONAL`);
      return getContentsAdminSimple.parse(res.data.data).contentsSimpleList;
    },
  });

  const updateMission = useMutation({
    mutationFn: async (mission: UpdateMissionReq & { id: number }) => {
      const { id, ...payload } = mission;
      return axios.patch(`/mission/${id}`, payload);
    },
  });

  const { data: essentialContents = [] } = useQuery({
    queryKey: [
      'admin',
      'challenge',
      currentChallenge?.id,
      'missions',
      'contents',
      'essential',
    ],
    queryFn: async (): Promise<Content[]> => {
      if (!currentChallenge) {
        return [];
      }
      const res = await axios.get(`/contents/admin/simple?type=ESSENTIAL`);
      return getContentsAdminSimple.parse(res.data.data).contentsSimpleList;
    },
  });

  const missionList = useMemo((): Row[] => {
    const result: Row[] = (missions?.missionList || []).map((m) => ({
      ...m,
      mode: 'normal',
      additionalContent: null,
      essentialContent: null,
      additionalContentList: additionalContents,
      essentialContentList: essentialContents,
    }));

    if (editingMission) {
      result.push({
        ...editingMission,
        mode: 'create',
        additionalContent: null,
        essentialContent: null,
        additionalContentList: additionalContents,
        essentialContentList: essentialContents,
      });
    }

    return result;
  }, [
    additionalContents,
    editingMission,
    essentialContents,
    missions?.missionList,
  ]);

  return (
    <MissionProvider>
      <main>
        {/* TODO: 채워넣기 */}
        <DataGrid
          editMode="row"
          slots={{
            toolbar: ChallengeOperationRegisterMissionToolbar,
          }}
          slotProps={{
            toolbar: {
              onRegisterButtonClick: () => {
                setEditingMission({
                  attendanceCount: 0,
                  endDate: dayjs(),
                  startDate: dayjs(),
                  id: -1,
                  lateScore: 5,
                  score: 10,
                  th: 1,
                  missionStatusType: 'WAITING',
                  lateAttendanceCount: 0,
                });
              },
            },
            cell: {
              essentialContents,
              additionalContents,
            },
          }}
          rows={missionList}
          columns={columns}
          getRowClassName={(params) => {
            if (params.row.mode === 'create') {
              return 'bg-green-100';
            }
            return '';
          }}
          // initialState={
          //   {
          //     // pagination: {
          //     // paginationModel: {
          //     //   pageSize: 5,
          //     // },
          //     // },
          //   }
          // }
          // pageSizeOptions={[5]}
          // checkboxSelection
          disableRowSelectionOnClick
          autoHeight
        />
      </main>
    </MissionProvider>
  );
};

export default ChallengeOperationRegisterMission;
