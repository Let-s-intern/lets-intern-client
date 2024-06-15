import { Button } from '@mui/base';
import {
  DataGrid,
  GridColDef, GridToolbarContainer,
  GridToolbarExport, useGridApiContext
} from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  accountType,
  getChallengeIdApplicationsPayback
} from '../../../schema';
import axios from '../../../utils/axios';

type Payback = z.infer<
  typeof getChallengeIdApplicationsPayback
>['missionApplications'][number];

const bankTextMap: Record<z.infer<typeof accountType>, string> = {
  KB: 'KB국민',
  HANA: '하나',
  WOORI: '우리',
  SHINHAN: '신한',
  NH: 'NH농협',
  SH: 'SH수협',
  IBK: 'IBK기업',
  MG: '새마을금고',
  KAKAO: '카카오뱅크',
  TOSS: '토스뱅크',
};

function createColumns(ths: number[]): GridColDef<Payback>[] {
  return [
    // { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: '이름', width: 100 },
    { field: 'email', headerName: '이메일', width: 200 },
    { field: 'phoneNum', headerName: '전화번호', width: 150 },
    {
      field: 'account',
      headerName: '환급계좌번호',
      width: 150,
      valueGetter(_, row) {
        return `${bankTextMap[row.accountType]} ${row.accountNum}`;
      },
    },
    ...ths.map(
      (th): GridColDef<Payback> => ({
        field: `th${th}`,
        headerName: `${th}회차`,
        valueGetter(_, row) {
          const score = row.scores.find((s) => s.th === th);
          return score?.score ?? '0';
        },
        sortable: false,
        filterable: false,
        editable: false,
        cellClassName: (params) => 'p-0',
        width: 50,
      }),
    ),
    // { field: 'adminAdd'}, // TODO: 채워넣기
    { field: 'total', headerName: '총점', width: 50 },
    { field: 'isRefunded', headerName: '환급여부', width: 150 },
  ];
}

function Toolbar() {
  const api = useGridApiContext();

  return (
    <GridToolbarContainer>
      <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined' },
        }}
      />
      <Button
        onClick={() => {
          console.log(api.current.getSelectedRows());
        }}
      >
        환급 완료로 변경 (개발중)
      </Button>
    </GridToolbarContainer>
  );
}

const ChallengeOperationPayback = () => {
  const params = useParams();
  const challengeId = params.programId;

  const { data: paybackRes } = useQuery({
    queryKey: ['admin', 'challenge', challengeId, 'participants'],
    queryFn: async () => {
      if (!challengeId) {
        return null;
      }
      const res = await axios.get(
        `/challenge/${challengeId}/applications/payback`,
      );
      return getChallengeIdApplicationsPayback.parse(res.data.data);
    },
  });

  const ths = useMemo(() => {
    const ths = new Set<number>();
    paybackRes?.missionApplications?.forEach((application) => {
      application.scores.forEach((score) => {
        ths.add(score.th);
      });
    });
    return Array.from(ths).sort();
  }, [paybackRes?.missionApplications]);

  const columns = useMemo(() => {
    return createColumns(ths);
  }, [ths]);

  const rows = useMemo(() => {
    return (
      paybackRes?.missionApplications?.map((application) => {
        const total = application.scores.reduce(
          (acc, score) => acc + score.score,
          0,
        );
        return {
          ...application,
          total,
        };
      }) || []
    );
  }, [paybackRes?.missionApplications]);

  return (
    <main className="pt-3">
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: Toolbar }}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        hideFooter
      />
    </main>
  );
};

export default ChallengeOperationPayback;
