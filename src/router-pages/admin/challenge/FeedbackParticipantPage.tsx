/** 챌린지 운영 > 피드백 > 미션별 참여자 페이지
 * @todo API 연결: /api/v2/admin/challenge/{challengeId}/mission/{missionId}/feedback/attendances
 */

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

// *미션 제출 현황 = 정상 제출, 확인여부 = 확인 완료인 참여자 미션만 노출
const data = [
  {
    id: 1,
    mentorName: '김멘토',
    name: '홍길동',
    major: '컴퓨터공학과',
    wishJob: '프론트엔드 개발자',
    wishCompany: '카카오',
    link: 'https://github.com/honggildong',
    status: 'PRESENT',
    result: 'WAITING',
    challengePricePlanType: 'BASIC',
  },
  {
    id: 2,
    mentorName: '이멘토',
    name: '김철수',
    major: '소프트웨어학과',
    wishJob: '백엔드 개발자',
    wishCompany: '네이버',
    link: 'https://github.com/cheolsu',
    status: 'PRESENT',
    result: 'PASS',
    challengePricePlanType: 'PREMIUM',
  },
  {
    id: 3,
    mentorName: '박멘토',
    name: '이영희',
    major: '정보통신공학과',
    wishJob: '풀스택 개발자',
    wishCompany: '라인',
    link: 'https://github.com/younghee',
    status: 'PRESENT',
    result: 'FAIL',
    challengePricePlanType: 'BASIC',
  },
];

interface Row {
  id: number | string;
  mentorName: string;
  missionTitle: string;
  missionRound: number | string;
  name: string;
  major: string;
  wishJob: string;
  wishCompany: string;
  link: string;
  feedbackPageLink: string;
  missionStatus: string;
}

const columns: GridColDef<Row>[] = [
  {
    field: 'mentorName',
    headerName: '담당 멘토',
    width: 80,
    renderCell: (params: GridRenderCellParams<Row, string>) => (
      // 드롭다운
      <div>{params.value}</div>
    ),
  },
  {
    field: 'missionTitle',
    headerName: '미션 명',
    width: 160,
  },
  {
    field: 'missionRound',
    headerName: '미션 회차',
    width: 80,
  },
  {
    field: 'name',
    headerName: '이름',
    width: 100,
  },
  {
    field: 'major',
    headerName: '전공',
    width: 150,
  },
  {
    field: 'wishCompany',
    headerName: '희망 기업',
    width: 120,
  },
  {
    field: 'wishJob',
    headerName: '희망 직무',
    width: 150,
  },
  {
    field: 'link',
    headerName: '미션 제출 링크',
    width: 120,
    renderCell: (params: GridRenderCellParams<Row, string>) => (
      <Link
        to={params.value || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline"
      >
        미션 링크
      </Link>
    ),
  },
  {
    field: 'feedbackPageLink',
    headerName: '피드백 페이지',
    width: 120,
    renderCell: (params: GridRenderCellParams<Row, string>) => (
      <Link to={params.value || '#'} className="text-primary underline">
        바로가기
      </Link>
    ),
  },
  {
    field: 'missionStatus',
    headerName: '진행 상태',
    width: 120,
    renderCell: (params: GridRenderCellParams<Row, string>) => (
      // 드롭다운
      <div>{params.value}</div>
    ),
  },
];

export default function FeedbackParticipantPage() {
  const { missionId, programId } = useParams();
  const [searchParams] = useSearchParams();

  const [rows, setRows] = useState<Row[]>([]);

  const missionTitle = searchParams.get('title') ?? '';
  const missionRound = searchParams.get('th') ?? 0;

  useEffect(() => {
    setRows(
      data.map((item) => {
        const { status, result, challengePricePlanType, ...rest } = item; // eslint-disable-line @typescript-eslint/no-unused-vars
        return {
          ...rest,
          missionTitle,
          missionRound,
          feedbackPageLink: `/admin/challenge/operation/${programId}/mission/${missionId}/participant/${item.id}/feedback`,
          missionStatus: '진행전',
        };
      }),
    );
  }, [missionTitle, missionRound, programId, missionId]);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      hideFooter
    />
  );
}
