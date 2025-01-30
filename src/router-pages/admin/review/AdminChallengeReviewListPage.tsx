import {
  AdminProgramReview,
  useGetAdminProgramReview,
  useUpdateAdminProgramReview,
  useUpdateAdminProgramReviewItem,
} from '@/api/review';
import dayjs from '@/lib/dayjs';
import { ChallengeType } from '@/schema';
import { challengeTypes, challengeTypeToDisplay } from '@/utils/convert';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Modal,
  Popover,
  Switch,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
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
    sortable: true,
    filterable: false,
    valueGetter: (_, row) => dayjs(row.reviewInfo.createDate).toDate(),
  },
  {
    field: 'type',
    headerName: '챌린지 구분',
    width: 150,
    filterable: true,
    valueGetter: (_, row) => row.reviewInfo.challengeType as ChallengeType,
    valueFormatter: (value: ChallengeType) => challengeTypeToDisplay[value],
    filterOperators: challengeTypeOperators,
  },
  {
    field: 'title',
    headerName: '프로그램 명',
    width: 200,
    valueGetter: (_, row) => row.reviewInfo.title,
  },
  {
    field: 'name',
    headerName: '이름',
    width: 110,
    valueGetter: (_, row) => row.reviewInfo.name,
  },
  {
    field: 'score',
    headerName: '만족도 점수',
    width: 150,
    valueGetter: (_, row) => row.reviewInfo.score,
  },
  {
    field: 'npsScore',
    headerName: 'NPS 점수',
    width: 150,
    valueGetter: (_, row) => row.reviewInfo.npsScore,
  },
  // 목표 (내용 + 노출여부)
  {
    field: 'goal_content',
    headerName: '내용',
    width: 200,
    valueGetter: (_, row) =>
      row.reviewItemList?.find((item) => item.questionType === 'GOAL')
        ?.answer || '-',
  },
  {
    field: 'goal_visible',
    headerName: '노출여부',
    width: 100,
    renderCell: ({ row }) => (
      <ReviewItemVisibilityToggle row={row} questionType="GOAL" />
    ),
  },
  // 목표 달성 여부 (내용 + 노출여부)
  {
    field: 'goal_result_content',
    headerName: '내용',
    width: 200,
    valueGetter: (_, row) =>
      row.reviewItemList?.find((item) => item.questionType === 'GOAL_RESULT')
        ?.answer || '-',
  },
  {
    field: 'goal_result_visible',
    headerName: '노출여부',
    width: 100,
    renderCell: ({ row }) => (
      <ReviewItemVisibilityToggle row={row} questionType="GOAL_RESULT" />
    ),
  },
  // 좋았던 점 (내용 + 노출여부)
  {
    field: 'good_point_content',
    headerName: '내용',
    width: 200,
    valueGetter: (_, row) =>
      row.reviewItemList?.find((item) => item.questionType === 'GOOD_POINT')
        ?.answer || '-',
  },
  {
    field: 'good_point_visible',
    headerName: '노출여부',
    width: 100,
    renderCell: ({ row }) => (
      <ReviewItemVisibilityToggle row={row} questionType="GOOD_POINT" />
    ),
  },
  // 아쉬웠던 점 (내용 + 노출여부)
  {
    field: 'bad_point_content',
    headerName: '내용',
    width: 200,
    valueGetter: (_, row) =>
      row.reviewItemList?.find((item) => item.questionType === 'BAD_POINT')
        ?.answer || '-',
  },
  {
    field: 'bad_point_visible',
    headerName: '노출여부',
    width: 100,
    renderCell: ({ row }) => (
      <ReviewItemVisibilityToggle row={row} questionType="BAD_POINT" />
    ),
  },
  // 전체 리뷰의 노출 여부
  {
    field: 'isVisible',
    headerName: '노출여부',
    width: 150,
    type: 'boolean',
    renderCell: ({ row }) => <VisibilityToggle row={row} />,
  },
];

// 헤더 그룹화
const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'goal',
    headerName: '목표',
    children: [{ field: 'goal_content' }, { field: 'goal_visible' }],
  },
  {
    groupId: 'goal_result',
    headerName: '목표 달성 여부',
    children: [
      { field: 'goal_result_content' },
      { field: 'goal_result_visible' },
    ],
  },
  {
    groupId: 'good_point',
    headerName: '좋았던 점',
    children: [
      { field: 'good_point_content' },
      { field: 'good_point_visible' },
    ],
  },
  {
    groupId: 'bad_point',
    headerName: '아쉬웠던 점',
    children: [{ field: 'bad_point_content' }, { field: 'bad_point_visible' }],
  },
];

const VisibilityToggle = ({ row }: { row: Row }) => {
  const { mutate } = useUpdateAdminProgramReview({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const handleToggle = () => {
    mutate({
      type: 'CHALLENGE_REVIEW',
      reviewId: row.reviewInfo.reviewId,
      isVisible: !row.reviewInfo.isVisible,
    });
  };

  return (
    <Switch
      checked={row.reviewInfo.isVisible ?? false}
      onChange={handleToggle}
    />
  );
};

const ReviewItemVisibilityToggle = ({
  row,
  questionType,
}: {
  row: Row;
  questionType: string;
}) => {
  const { mutate } = useUpdateAdminProgramReviewItem({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const reviewItem = row.reviewItemList?.find(
    (item) => item.questionType === questionType,
  );
  if (!reviewItem) return '-';

  const handleToggle = () => {
    mutate({
      type: 'CHALLENGE_REVIEW',
      reviewItemId: reviewItem.reviewItemId,
      isVisible: !reviewItem.isVisible,
    });
  };

  return (
    <Switch
      checked={reviewItem.isVisible ?? false}
      onChange={handleToggle}
      disabled={!row.reviewInfo.isVisible} // 부모 리뷰가 노출될 때만 토글 활성화
    />
  );
};

const AdminChallengeReviewListPage = () => {
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  const { data } = useGetAdminProgramReview({ type: 'CHALLENGE_REVIEW' });

  const handleRowClick = (row: Row) => {
    setSelectedRow(row);
  };

  const handleClose = () => {
    setSelectedRow(null);
  };

  return (
    <div className="p-5">
      <AdminReviewHeader />
      <DataGrid
        sx={{
          // '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
          //   outline: 'none', // outline 제거
          // },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold', // 헤더 폰트 굵게
          },
          '& .MuiDataGrid-columnHeader[data-field="goal_content"], \
            .MuiDataGrid-columnHeader[data-field="goal_visible"], \
            .MuiDataGrid-columnHeader[data-field="goal_result_content"], \
            .MuiDataGrid-columnHeader[data-field="goal_result_visible"], \
            .MuiDataGrid-columnHeader[data-field="good_point_content"], \
            .MuiDataGrid-columnHeader[data-field="good_point_visible"], \
            .MuiDataGrid-columnHeader[data-field="bad_point_content"], \
            .MuiDataGrid-columnHeader[data-field="bad_point_visible"]': {
            color: 'gray',
          },
        }}
        rows={
          data?.reviewList.map((review) => ({
            ...review,
            id: review.reviewInfo.reviewId,
          })) ?? []
        }
        onRowClick={(params) => handleRowClick(params.row as Row)}
        columns={columns}
        columnGroupingModel={columnGroupingModel}
        columnHeaderHeight={36}
        columnGroupHeaderHeight={36}
        disableRowSelectionOnClick
        disableColumnSelector
        disableDensitySelector
        hideFooter
      />
      <Modal open={selectedRow !== null} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            리뷰 상세 정보
          </Typography>
          {selectedRow ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant="body1">
                <strong>이름:</strong> {selectedRow.reviewInfo.name}
              </Typography>
              <Typography variant="body1">
                <strong>프로그램 명:</strong> {selectedRow.reviewInfo.title}
              </Typography>
              <Typography variant="body1">
                <strong>만족도 점수:</strong> {selectedRow.reviewInfo.score}
              </Typography>
              <Typography variant="body1">
                <strong>목표:</strong>{' '}
                {selectedRow.reviewItemList?.find(
                  (item) => item.questionType === 'GOAL',
                )?.answer || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>좋았던 점:</strong>{' '}
                {selectedRow.reviewItemList?.find(
                  (item) => item.questionType === 'GOOD_POINT',
                )?.answer || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>아쉬웠던 점:</strong>{' '}
                {selectedRow.reviewItemList?.find(
                  (item) => item.questionType === 'BAD_POINT',
                )?.answer || '-'}
              </Typography>
            </Box>
          ) : (
            <Typography>데이터를 불러오는 중...</Typography>
          )}
          <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained">
            닫기
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminChallengeReviewListPage;
