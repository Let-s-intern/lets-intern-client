import { AdminProgramReview, useGetAdminProgramReview } from '@/api/review';
import dayjs from '@/lib/dayjs';
import { ChallengeType } from '@/schema';
import { challengeTypes, challengeTypeToDisplay } from '@/utils/convert';
import {
  DataGrid,
  GridColDef,
  GridFilterInputValueProps,
  GridFilterOperator,
} from '@mui/x-data-grid';
import AdminReviewHeader from './AdminReviewHeader';

type Row = AdminProgramReview & {
  id: number | string;
};

const ChallengeTypeFilterInput = (props: GridFilterInputValueProps) => {
  const { item, applyValue, focusElementRef } = props;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyValue({ ...item, value: e.target.value });
  };

  return (
    <select
      ref={focusElementRef}
      value={item.value}
      onChange={handleChange}
      className="w-full h-full"
    >
      <option value="">전체</option>
      {challengeTypes.map((value) => (
        <option key={value} value={value}>
          {challengeTypeToDisplay[value as ChallengeType]}
        </option>
      ))}
    </select>
  );
};

const challengeTypeOperators: GridFilterOperator<any, number>[] = [
  {
    label: '일치',
    value: 'is',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (value) => {
        return value === filterItem.value;
      };
    },
    InputComponent: ChallengeTypeFilterInput,
  },
];

const columns: GridColDef<Row>[] = [
  {
    field: 'createDate',
    type: 'dateTime',
    headerName: '작성일자',
    width: 200,
    // 작성일자 DESC/ASC 정렬
    sortable: true,
    filterable: false,
    valueGetter: (_, row) => {
      return dayjs(row.reviewInfo.createDate).toDate();
    },
  },
  {
    field: 'type',
    headerName: '챌린지 구분',
    width: 150,
    filterable: true,
    valueGetter: (_, row) => {
      return row.reviewInfo.challengeType as ChallengeType;
    },
    valueFormatter: (value: ChallengeType) => {
      return challengeTypeToDisplay[value];
    },
    filterOperators: challengeTypeOperators,
  },
  {
    field: 'title',
    headerName: '프로그램 명',
    width: 200,
    valueGetter: (_, row) => {
      return row.reviewInfo.title;
    },
  },
  {
    field: 'name',
    headerName: '이름',
    width: 110,
    valueGetter: (_, row) => {
      return row.reviewInfo.name;
    },
  },
  {
    field: 'score',
    headerName: '만족도 점수',
    width: 150,
    valueGetter: (_, row) => {
      return row.reviewInfo.score;
    },
  },
  {
    field: 'npsScore',
    headerName: 'NPS 점수',
    width: 150,
    valueGetter: (_, row) => {
      return row.reviewInfo.npsScore;
    },
  },
  {
    field: 'goal',
    headerName: '목표',
    width: 150,
    valueGetter: (_, row) => {
      return (
        row.reviewItemList?.find((item) => item.questionType === 'GOAL')
          ?.answer || '-'
      );
    },
  },
  {
    field: 'goal_result',
    headerName: '목표 달성 여부',
    width: 150,
    valueGetter: (_, row) => {
      return (
        row.reviewItemList?.find((item) => item.questionType === 'GOAL_RESULT')
          ?.answer || '-'
      );
    },
  },
  {
    field: 'good_point',
    headerName: '좋았던 점',
    width: 150,
    valueGetter: (_, row) => {
      return (
        row.reviewItemList?.find((item) => item.questionType === 'GOOD_POINT')
          ?.answer || '-'
      );
    },
  },
  {
    field: 'bad_point',
    headerName: '아쉬웠던 점',
    width: 150,
    valueGetter: (_, row) => {
      return (
        row.reviewItemList?.find((item) => item.questionType === 'BAD_POINT')
          ?.answer || '-'
      );
    },
  },
  {
    field: 'isVisible',
    headerName: '노출여부',
    width: 150,
    type: 'boolean',
    valueGetter: (_, row) => (row.reviewInfo.isVisible ? '✅' : '❌'),
  },
];

const AdminChallengeReviewListPage = () => {
  const { data } = useGetAdminProgramReview({ type: 'CHALLENGE_REVIEW' });
  return (
    <div className="p-5">
      <AdminReviewHeader />
      <DataGrid
        rows={
          data?.reviewList.map((review) => ({
            ...review,
            id: review.reviewInfo.reviewId,
          })) ?? []
        }
        columns={columns}
        disableRowSelectionOnClick
        disableColumnSelector
        disableDensitySelector
        hideFooter
      />
    </div>
  );
};

export default AdminChallengeReviewListPage;
