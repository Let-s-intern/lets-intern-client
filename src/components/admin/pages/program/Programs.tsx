import {
  useGetProgramAdminQuery,
  useGetProgramAdminQueryKey,
} from '@/api/program';
import Header from '@/components/admin/ui/header/Header';
import Heading from '@/components/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useDeleteProgram } from '@/hooks/useDeleteProgram';
import { useDuplicateProgram } from '@/hooks/useDuplicateProgram';
import { usePatchVisibleProgram } from '@/hooks/usePatchVisibleProgram';
import dayjs from '@/lib/dayjs';
import {
  ProgramAdminListItem,
  ProgramClassification,
  ProgramStatus,
  programStatusList,
  programTypeList,
  ProgramTypeUpperCase,
} from '@/schema';
import {
  newProgramTypeToText,
  programClassificationToText,
  programStatusToText,
} from '@/utils/convert';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Popover,
  Switch,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterInputValueProps,
  GridFilterOperator,
} from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { FaCopy, FaList, FaPlus, FaTrashCan } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';

type Row = ProgramAdminListItem & {
  id: number | string;
};

const Programs = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const { data, isLoading, error } = useGetProgramAdminQuery({
    page: 1,
    size: 1000,
  });

  const deleteProgram = useDeleteProgram({
    successCallback: () => {
      queryClient.invalidateQueries({ queryKey: [useGetProgramAdminQueryKey] });
    },
  });
  const editVisible = usePatchVisibleProgram({
    successCallback: () => {
      queryClient.invalidateQueries({ queryKey: [useGetProgramAdminQueryKey] });
    },
  });

  const duplicateProgram = useDuplicateProgram({
    successCallback: () => {
      queryClient.invalidateQueries({ queryKey: [useGetProgramAdminQueryKey] });
    },
  });
  const [visibleLoading, setVisibleLoading] = useState(false);
  const programList = data?.programList || [];

  const columns = useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'createdAt',
        headerName: '개설일자',
        type: 'dateTime',
        width: 200,
        valueGetter: (_, row) => dayjs(row.programInfo.createdAt).toDate(),
        valueFormatter: (value) => dayjs(value).format(`YYYY/M/D(dd) HH:mm`),
      },
      {
        field: 'programClassification',
        headerName: '프로그램',
        width: 100,
        valueGetter: (_, row) =>
          row.classificationList.map((type) => type.programClassification),
        valueFormatter: (value: ProgramClassification[]) =>
          value.map((type) => programClassificationToText[type]).join(', '),
      },
      {
        field: 'programType',
        headerName: '프로그램 분류',
        width: 150,
        valueGetter: (_, row) => row.programInfo.programType,
        valueFormatter: (value: string) => newProgramTypeToText[value],
        filterOperators: programTypeOperators,
      },
      {
        field: 'title',
        headerName: '프로그램 제목',
        width: 200,
        valueGetter: (_, row) => row.programInfo.title || '-',
      },
      {
        field: 'userPage',
        headerName: '페이지 이동',
        width: 150,
        type: 'actions',
        getActions: (params) => [
          <Link
            key={
              'view' +
              params.row.programInfo.programType +
              params.row.programInfo.id
            }
            className="text-blue-500 underline transition hover:text-blue-300"
            to={`/program/${params.row.programInfo.programType.toLowerCase()}/${params.row.programInfo.id}`}
            reloadDocument
            target="_blank"
          >
            보기
          </Link>,
        ],
      },
      {
        field: 'programStatusType',
        headerName: '모집상태',
        width: 150,
        valueGetter: (_, row) => row.programInfo.programStatusType,
        valueFormatter: (value: ProgramStatus) => programStatusToText[value],
        filterOperators: programStatusTypeOperators,
      },
      {
        field: 'currentCount',
        headerName: '신청인원',
        width: 100,
        valueGetter: (_, row) =>
          row.programInfo.programType === 'VOD'
            ? '온라인'
            : `${row.programInfo.currentCount} / ${row.programInfo.participationCount}`,
      },
      {
        field: 'deadline',
        headerName: '모집기간',
        type: 'dateTime',
        width: 200,
        valueGetter: (_, row) =>
          row.programInfo.programType === 'VOD'
            ? null
            : dayjs(row.programInfo.deadline).toDate(),
        valueFormatter: (value) =>
          value ? dayjs(value).format(`M/D(dd) HH:mm까지`) : '-', // value가 null일 경우 '-'로 표시
      },
      {
        field: 'startDate',
        headerName: '프로그램 시작일자',
        type: 'dateTime',
        width: 200,
        valueGetter: (_, row) =>
          row.programInfo.programType === 'VOD'
            ? null
            : dayjs(row.programInfo.startDate).toDate(),
        valueFormatter: (value) =>
          value ? dayjs(value).format(`YYYY/M/D(dd) HH:mm까지`) : '-', // value가 null일 경우 '-'로 표시
      },
      {
        field: 'management',
        type: 'actions',
        headerName: '프로그램 관리',
        width: 400,
        getActions: (params) => {
          const id = params.row.programInfo.id;
          return [
            <Button
              key={`edit${id}`}
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<Pencil />}
              onClick={() => {
                switch (params.row.programInfo.programType) {
                  case 'CHALLENGE':
                    navigate(`/admin/challenge/${id}/edit`);
                    break;
                  case 'LIVE':
                    navigate(`/admin/live/${id}/edit`);
                    break;
                  case 'VOD':
                    navigate(`/admin/vod/${id}/edit`);
                    break;
                  case 'REPORT':
                    throw new Error("Don't use this page");
                }
              }}
            >
              수정
            </Button>,
            <Button
              key={`users${id}`}
              variant="outlined"
              color="info"
              size="small"
              startIcon={<FaList />}
              onClick={() => {
                navigate(
                  `/admin/programs/${id}/users?programType=${params.row.programInfo.programType}`,
                );
              }}
            >
              참여자
            </Button>,
            <Button
              key={`duplicate${id}`}
              variant="outlined"
              color="info"
              size="small"
              startIcon={<FaCopy />}
              onClick={async () => {
                if (
                  !window.confirm(
                    `<${params.row.programInfo.title}>  정말로 복제하시겠습니까?`,
                  )
                ) {
                  return;
                }
                try {
                  await duplicateProgram(params.row);
                  snackbar('복제가 완료되었습니다.');
                } catch (e: unknown) {
                  snackbar('복제에 실패하였습니다: ' + e);
                }
              }}
            >
              복제
            </Button>,
            <Button
              key={`delete${id}`}
              variant="outlined"
              color="error"
              size="small"
              startIcon={<FaTrashCan />}
              onClick={async () => {
                if (
                  window.confirm(
                    `<${params.row.programInfo.title}> 정말로 삭제하시겠습니까?`,
                  )
                ) {
                  await deleteProgram({
                    type: params.row.programInfo.programType,
                    id: Number(id),
                  });
                  snackbar('삭제되었습니다.');
                }
              }}
            >
              삭제
            </Button>,
          ];
        },
      },
      {
        field: 'isVisible',
        headerName: '노출여부',
        type: 'boolean',
        width: 100,
        renderCell: ({ row }) => (
          <Switch
            checked={row.programInfo.isVisible ?? false}
            disabled={visibleLoading}
            onChange={async (e) => {
              const checked = e.target.checked;
              setVisibleLoading(true);
              await editVisible({
                id: row.programInfo.id,
                type: row.programInfo.programType,
                isVisible: checked,
              });
              snackbar(
                `<${row.programInfo.title}> 노출여부가 "${checked ? '노출' : '비노출'}"로 변경되었습니다.`,
              );
              setVisibleLoading(false);
            }}
          />
        ),
      },
      {
        field: 'zoomLink',
        headerName: 'ZOOM LINK',
        width: 150,
        renderCell: ({ row }) =>
          row.programInfo.zoomLink ? (
            <Button
              className="rounded-xxs border border-gray-300 bg-white px-2 py-1"
              variant="outlined"
              size="small"
              onClick={async () => {
                if (!row.programInfo.zoomLink) {
                  snackbar('링크가 없습니다.');
                  return;
                }
                await navigator.clipboard.writeText(row.programInfo.zoomLink);
                snackbar('링크가 클립보드에 복사되었습니다.');
              }}
            >
              {row.programInfo.zoomLink ? '복사' : '없음'}
            </Button>
          ) : (
            '-'
          ),
      },
      {
        field: 'zoomPassword',
        headerName: 'ZOOM PW',
        width: 100,
        valueGetter: (_, row) => row.programInfo.zoomPassword || '없음',
      },
    ],
    [
      deleteProgram,
      duplicateProgram,
      editVisible,
      snackbar,
      visibleLoading,
      navigate,
    ],
  );

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>프로그램 관리</Heading>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus size={12} />}
            onClick={() => navigate(`/admin/challenge/create`)}
          >
            챌린지 등록
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus size={12} />}
            onClick={() => navigate(`/admin/live/create`)}
          >
            LIVE 클래스 등록
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus size={12} />}
            onClick={() => navigate(`/admin/vod/create`)}
          >
            VOD 클래스 등록
          </Button>
        </div>
      </Header>
      <main>
        {isLoading ? (
          <LoadingContainer />
        ) : error ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : programList.length === 0 ? (
          <EmptyContainer text="프로그램이 없습니다." />
        ) : (
          <>
            <DataGrid
              rows={programList.map((p) => ({
                id: p.programInfo.programType + p.programInfo.id,
                ...p,
              }))}
              columns={columns}
              pagination
              pageSizeOptions={[10, 20, 50, 100]}
              initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
              }}
            />
          </>
        )}
      </main>
    </div>
  );
};

const ProgramTypeFilterInput = (props: GridFilterInputValueProps) => {
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
      return newProgramTypeToText[selectedValues[0] as ProgramTypeUpperCase];
    return `${newProgramTypeToText[selectedValues[0] as ProgramTypeUpperCase]} 외 ${
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
                  selectedValues.length === programTypeList.length ||
                  selectedValues.length === 0
                }
                onChange={(e) => {
                  applyValue({
                    ...item,
                    value: e.target.checked ? programTypeList : [],
                  });
                }}
                value=""
              />
            }
            label="전체"
          />
          {programTypeList.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedValues.includes(type)}
                  onChange={handleChange}
                  value={type}
                />
              }
              label={newProgramTypeToText[type as ProgramTypeUpperCase]}
            />
          ))}
        </FormGroup>
      </Popover>
    </FormControl>
  );
};

const ProgramStatusTypeFilterInput = (props: GridFilterInputValueProps) => {
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
      return programStatusToText[selectedValues[0] as ProgramStatus];
    return `${programStatusToText[selectedValues[0] as ProgramStatus]} 외 ${
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
                  selectedValues.length === programStatusList.length ||
                  selectedValues.length === 0
                }
                onChange={(e) => {
                  applyValue({
                    ...item,
                    value: e.target.checked ? programStatusList : [],
                  });
                }}
                value=""
              />
            }
            label="전체"
          />
          {programStatusList.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedValues.includes(type)}
                  onChange={handleChange}
                  value={type}
                />
              }
              label={programStatusToText[type as ProgramStatus]}
            />
          ))}
        </FormGroup>
      </Popover>
    </FormControl>
  );
};

export const programTypeOperators: GridFilterOperator<any, number>[] = [
  {
    label: '일치',
    value: 'includes',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.value?.length) return null;
      return (value) => filterItem.value.includes(value);
    },
    InputComponent: ProgramTypeFilterInput,
  },
];

export const programStatusTypeOperators: GridFilterOperator<any, number>[] = [
  {
    label: '일치',
    value: 'includes',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.value?.length) return null;
      return (value) => filterItem.value.includes(value);
    },
    InputComponent: ProgramStatusTypeFilterInput,
  },
];

export default Programs;
