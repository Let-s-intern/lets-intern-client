import {
  useGetProgramAdminQuery,
  useGetProgramAdminQueryKey,
} from '@/api/program';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDeleteProgram } from '@/hooks/useDeleteProgram';
import { useDuplicateProgram } from '@/hooks/useDuplicateProgram';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
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
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Popover,
  Switch,
  TextField,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterInputValueProps,
  GridFilterOperator,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChallengeDuplicateModal from '@/domain/admin/program/challenge/ChallengeDuplicateModal';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCopy, FaList, FaPlus, FaTrashCan } from 'react-icons/fa6';
import { usePersistedGridState } from './hooks/usePersistedGridState';

// 메인 web 으로 이동하는 외부 링크의 호스트.
// VITE_WEB_URL 미설정 시 admin 자기 자신의 root 로 fallback (안전장치).
const WEB_URL = import.meta.env.VITE_WEB_URL ?? '/';

/** 표의 정렬·필터·열 너비를 저장하는 localStorage 키 */
const GRID_STATE_STORAGE_KEY = 'admin:programs:grid-state';

/** 제목·ID 검색어를 서버에 묻기 전에 입력이 멈추길 기다리는 시간 */
const KEYWORD_DEBOUNCE_MS = 300;

type Row = ProgramAdminListItem & {
  id: number | string;
};

const Programs = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  // 검색어는 URL(?keyword=)이 원본이다. 입력칸은 멈춘 뒤에 URL 로 옮긴다
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const [keywordInput, setKeywordInput] = useState(keyword);
  const debouncedKeyword = useDebouncedValue(
    keywordInput.trim(),
    KEYWORD_DEBOUNCE_MS,
  );

  const { data, isLoading, error } = useGetProgramAdminQuery({
    keyword: keyword || undefined,
    page: 1,
    size: 1000,
    keepPrevious: true,
  });

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const apiRef = useGridApiRef();
  const { initialState, saveLater } = usePersistedGridState(
    GRID_STATE_STORAGE_KEY,
    apiRef,
  );

  // 검색어가 바뀌면 첫 페이지로. page 를 URL 에 함께 쓰면 페이지 훅이 그 값으로 맞춘다
  useEffect(() => {
    if (debouncedKeyword === keyword) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedKeyword) next.set('keyword', debouncedKeyword);
        else next.delete('keyword');
        next.set('page', '0');
        next.set('pageSize', paginationModel.pageSize.toString());
        return next;
      },
      { replace: true },
    );
  }, [debouncedKeyword, keyword, paginationModel.pageSize, setSearchParams]);

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
  const [duplicateModalChallenge, setDuplicateModalChallenge] = useState<{
    id: number;
    title: string;
    thumbnail: string | null;
  } | null>(null);
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
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <a
            className="text-blue-500 underline transition hover:text-blue-300"
            href={`${WEB_URL}/program/${row.programInfo.programType.toLowerCase()}/${row.programInfo.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            보기
          </a>
        ),
      },
      {
        field: 'programStatusType',
        headerName: '모집상태',
        width: 150,
        valueGetter: (_, row) =>
          row.programInfo.programType === 'GUIDEBOOK'
            ? 'PROCEEDING'
            : row.programInfo.programStatusType,
        valueFormatter: (value: ProgramStatus) => programStatusToText[value],
        filterOperators: programStatusTypeOperators,
      },
      {
        field: 'currentCount',
        headerName: '신청인원',
        width: 100,
        valueGetter: (_, row) =>
          `${row.programInfo.currentCount ?? 0} / ${row.programInfo.participationCount ?? '∞'}`,
      },
      {
        field: 'deadline',
        headerName: '모집기간',
        type: 'dateTime',
        width: 200,
        valueGetter: (_, row) =>
          ['VOD', 'GUIDEBOOK'].includes(row.programInfo.programType)
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
          ['VOD', 'GUIDEBOOK'].includes(row.programInfo.programType)
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
                    navigate(`/challenge/${id}/edit`);
                    break;
                  case 'LIVE':
                    navigate(`/live/${id}/edit`);
                    break;
                  case 'VOD':
                    navigate(`/vod/${id}/edit`);
                    break;
                  case 'GUIDEBOOK':
                    navigate(`/guidebook/${id}/edit`);
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
                  `/programs/${id}/users?programType=${params.row.programInfo.programType}`,
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
                if (params.row.programInfo.programType === 'CHALLENGE') {
                  setDuplicateModalChallenge({
                    id: Number(id),
                    title: params.row.programInfo.title ?? '',
                    thumbnail: params.row.programInfo.thumbnail ?? null,
                  });
                  return;
                }
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
            onClick={() => navigate(`/challenge/create`)}
          >
            챌린지 등록
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus size={12} />}
            onClick={() => navigate(`/live/create`)}
          >
            LIVE 클래스 등록
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus size={12} />}
            onClick={() => navigate(`/vod/create`)}
          >
            VOD 클래스 등록
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus size={12} />}
            onClick={() => navigate(`/guidebook/create`)}
          >
            가이드북 등록
          </Button>
        </div>
      </Header>
      <main>
        <TextField
          size="small"
          label="제목·ID 검색"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          sx={{ width: 320, mb: 2 }}
        />
        {isLoading ? (
          <LoadingContainer />
        ) : error ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : programList.length === 0 ? (
          <EmptyContainer
            text={
              keyword
                ? '검색어와 일치하는 프로그램이 없습니다.'
                : '프로그램이 없습니다.'
            }
          />
        ) : (
          <>
            <DataGrid
              apiRef={apiRef}
              initialState={initialState}
              onSortModelChange={saveLater}
              onFilterModelChange={saveLater}
              onColumnWidthChange={saveLater}
              onColumnOrderChange={saveLater}
              onColumnVisibilityModelChange={saveLater}
              autoHeight
              rows={programList.map((p) => ({
                id: p.programInfo.programType + p.programInfo.id,
                ...p,
              }))}
              columns={columns}
              pagination
              pageSizeOptions={[10, 20, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
            />
          </>
        )}
      </main>

      {duplicateModalChallenge && (
        <ChallengeDuplicateModal
          isOpen={!!duplicateModalChallenge}
          sourceChallenge={duplicateModalChallenge}
          onClose={() => setDuplicateModalChallenge(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: [useGetProgramAdminQueryKey],
            });
            snackbar('복제가 완료되었습니다.');
            setDuplicateModalChallenge(null);
          }}
        />
      )}
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
