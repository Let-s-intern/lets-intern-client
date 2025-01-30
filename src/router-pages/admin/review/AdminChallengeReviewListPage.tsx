import { AdminProgramReview, useGetAdminProgramReview } from '@/api/review';
import dayjs from '@/lib/dayjs';
import { ChallengeType } from '@/schema';
import { challengeTypes, challengeTypeToDisplay } from '@/utils/convert';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Popover,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterInputValueProps,
  GridFilterOperator,
} from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import AdminReviewHeader from './AdminReviewHeader';

type Row = AdminProgramReview & {
  id: number | string;
};

const ChallengeTypeFilterInput = (props: GridFilterInputValueProps) => {
  const { item, applyValue } = props;
  const selectedValues = item.value || [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v: string) => v !== value);

    applyValue({ ...item, value: newValues });
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 선택된 필터 값을 요약하는 함수
  const getDisplayText = () => {
    if (!selectedValues.length) return '전체';
    if (selectedValues.length === 1)
      return challengeTypeToDisplay[selectedValues[0] as ChallengeType];
    return `${challengeTypeToDisplay[selectedValues[0] as ChallengeType]} 외 ${
      selectedValues.length - 1
    }`;
  };

  return (
    <FormControl className="h-full" component="fieldset">
      {/* 필터 버튼 */}
      <Button
        ref={buttonRef}
        variant="outlined"
        className="h-full"
        onClick={handleOpen}
        fullWidth
      >
        {getDisplayText()}
      </Button>

      {/* 팝오버 (체크박스 필터) */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <FormGroup sx={{ padding: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  selectedValues.length === challengeTypes.length ||
                  selectedValues.length === 0
                }
                onChange={(e) => {
                  applyValue({
                    ...item,
                    value: e.target.checked ? challengeTypes : [],
                  });
                }}
                value=""
              />
            }
            label="전체"
          />
          {challengeTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedValues.includes(type)}
                  onChange={handleChange}
                  value={type}
                />
              }
              label={challengeTypeToDisplay[type as ChallengeType]}
            />
          ))}
        </FormGroup>
      </Popover>
    </FormControl>
  );
};

const challengeTypeOperators: GridFilterOperator<any, number>[] = [
  {
    label: '일치',
    value: 'includes',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.value?.length) return null;
      return (value) => filterItem.value.includes(value);
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
