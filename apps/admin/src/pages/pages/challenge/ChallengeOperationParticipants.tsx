import { useAdminCurrentChallenge } from '@/context/CurrentAdminChallengeProvider';
import AdminVersionChangeDialog from '@/domain/admin/challenge/version/AdminVersionChangeDialog';
import {
  ChallengeApplication,
  challengeApplicationsSchema,
  grade,
} from '@/schema';
import axios from '@/utils/axios';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

type Participant = ChallengeApplication['application'];

const gradeToText: Record<z.infer<typeof grade>, string> = {
  FIRST: '1학년',
  SECOND: '2학년',
  THIRD: '3학년',
  FOURTH: '4학년',
  ETC: '5학년 이상',
  GRADUATE: '졸업생',
};

const downloadCSVFile = (text: string, type: 'EMAIL' | 'PHONE') => {
  const BOM = '\uFEFF';
  text = BOM + text;
  const csvFile = new Blob([text], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(csvFile);
  link.download = `참여자 ${type === 'EMAIL' ? '이메일' : '전화번호'} 목록.csv`;
  link.click();
};

const DownloadButtonGroup = ({
  participants,
}: {
  participants: ChallengeApplication['application'][];
}) => {
  const handleDownloadCSV = (type: 'EMAIL' | 'PHONE') => {
    const csv: any = [];
    csv.push(`이름,${type === 'EMAIL' ? '이메일' : '전화번호'}`);

    participants.forEach((application: any) => {
      const row = [];
      row.push(
        application.name,
        type === 'EMAIL' ? application.email : application.phoneNum,
      );
      csv.push(row.join(','));
    });
    const text = csv.join('\n');

    downloadCSVFile(text, type);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          className="rounded-xxs border border-zinc-600 px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
          onClick={() => handleDownloadCSV('EMAIL')}
        >
          이메일 다운로드
        </button>
        <button
          className="rounded-xxs border border-zinc-600 px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
          onClick={() => handleDownloadCSV('PHONE')}
        >
          전화번호 다운로드
        </button>
      </div>
    </div>
  );
};

const columns: GridColDef<ChallengeApplication['application']>[] = [
  { field: 'name', headerName: '이름', width: 100 },
  { field: 'email', headerName: '이메일', width: 200 },
  { field: 'phoneNum', headerName: '전화번호', width: 150 },
  {
    field: 'isCanceled',
    headerName: '환불',
    width: 50,
    valueFormatter: (value) =>
      typeof value === 'boolean' ? (value ? 'Y' : 'N') : '',
  },
  { field: 'challengePricePlanType', headerName: '결제 상품', width: 100 },
  { field: 'inflowPath', headerName: '유입경로', width: 150 },
  { field: 'university', headerName: '학교', width: 150 },
  {
    field: 'grade',
    headerName: '학년',
    width: 100,
    valueFormatter: (value) => gradeToText[value as z.infer<typeof grade>],
  },
  { field: 'major', headerName: '전공', width: 150 },
  { field: 'wishJob', headerName: '희망직무', width: 150 },
  { field: 'wishCompany', headerName: '희망기업', width: 150 },
];

// 라이트 플랜과 취소한 참여자는 운영진도 버전을 바꿀 수 없다 (설계안 D1)
const canChangeVersion = (participant: Participant) =>
  !participant.isCanceled && participant.challengePricePlanType !== 'LIGHT';

const ChallengeOperationParticipants = () => {
  const params = useParams<{ programId: string }>();
  const challengeId = params.programId;

  const { data } = useQuery({
    enabled: Boolean(challengeId),
    queryKey: ['admin', 'challenge', challengeId, 'participants'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/applications`, {
        params: {
          isConfirmed: true,
        },
      });
      return challengeApplicationsSchema.parse(res.data.data);
    },
  });

  const applications =
    data?.applicationList?.map((item) => item.application) ?? [];

  const { currentChallenge } = useAdminCurrentChallenge();
  const versions = currentChallenge?.versionList ?? [];
  const hasVersion = versions.length > 0;
  const [versionTarget, setVersionTarget] = useState<Participant | null>(null);

  // 버전 없는 챌린지는 버전 컬럼을 숨긴다. 있으면 결제 상품 바로 뒤에 둔다
  const visibleColumns = useMemo(() => {
    if (!hasVersion) return columns;

    const versionColumns: GridColDef<Participant>[] = [
      {
        field: 'challengeVersionTitle',
        headerName: '버전',
        width: 100,
        valueFormatter: (value) => value ?? '-',
      },
      {
        field: 'versionChange',
        headerName: '버전 변경',
        width: 100,
        sortable: false,
        renderCell: ({ row }) => (
          <Button
            size="small"
            variant="outlined"
            disabled={!canChangeVersion(row)}
            onClick={() => setVersionTarget(row)}
          >
            버전 변경
          </Button>
        ),
      },
    ];
    const insertAt =
      columns.findIndex((column) => column.field === 'challengePricePlanType') +
      1;
    return [
      ...columns.slice(0, insertAt),
      ...versionColumns,
      ...columns.slice(insertAt),
    ];
  }, [hasVersion]);

  return (
    <main className="pt-3">
      <DownloadButtonGroup participants={applications} />
      <DataGrid
        rows={applications}
        columns={visibleColumns}
        disableRowSelectionOnClick
        autoHeight
        hideFooter
      />
      {versionTarget ? (
        <AdminVersionChangeDialog
          challengeId={challengeId}
          application={versionTarget}
          versions={versions}
          onClose={() => setVersionTarget(null)}
        />
      ) : null}
    </main>
  );
};

export default ChallengeOperationParticipants;
