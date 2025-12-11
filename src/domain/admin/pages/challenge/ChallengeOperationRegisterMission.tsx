'use client';

import { useMissionOperations } from '@/hooks/useMissionOperation';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { Button } from '@mui/material';
import {
  DataGrid,
  GridEventListener,
  GridRowEditStopReasons,
  GridToolbarContainer,
  useGridApiRef,
} from '@mui/x-data-grid';
import { getMissionColumns } from './ChallengeOperationCells';

declare module '@mui/x-data-grid' {
  export interface ToolbarPropsOverrides {
    onRegisterButtonClick?: () => void;
  }
}

function ChallengeOperationRegisterMissionToolbar({
  onRegisterButtonClick,
}: {
  onRegisterButtonClick?: () => void;
}) {
  return (
    <GridToolbarContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
      }}
    >
      <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-gray-600">
        {`💡 보너스 미션은 회차 ${BONUS_MISSION_TH}번으로 등록해주세요.`}
      </div>
      <Button variant="outlined" onClick={onRegisterButtonClick}>
        등록
      </Button>
    </GridToolbarContainer>
  );
}

const ChallengeOperationRegisterMission = () => {
  const columns = getMissionColumns();
  const apiRef = useGridApiRef();
  const { rows, createNewMission } = useMissionOperations(apiRef);

  // 수정 중인 행 바깥을 클릭해도 수정 모드 유지
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  return (
    <main>
      <DataGrid
        apiRef={apiRef}
        editMode="row"
        initialState={{
          sorting: { sortModel: [{ field: 'id', sort: 'desc' }] },
        }}
        slots={{
          toolbar: ChallengeOperationRegisterMissionToolbar,
        }}
        slotProps={{
          toolbar: {
            onRegisterButtonClick: createNewMission,
          },
        }}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        rowHeight={48}
        getDetailPanelContent={() => 'hello!'}
        hideFooter
        processRowUpdate={(updatedRow, originalRow) => {
          return originalRow;
        }}
        onRowEditStop={handleRowEditStop}
      />
    </main>
  );
};

export default ChallengeOperationRegisterMission;
