import {
  ChallengeApplication,
  challengeApplicationsSchema,
  grade,
} from '@/schema';
import axios from '@/utils/axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

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

const ChallengeOperationParticipants = () => {
  const params = useParams();
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
    data?.applicationList.map((item) => item.application) ?? [];

  return (
    <main className="pt-3">
      <DownloadButtonGroup participants={applications} />
      <DataGrid
        rows={applications}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        hideFooter
      />
    </main>
  );
};

export default ChallengeOperationParticipants;
