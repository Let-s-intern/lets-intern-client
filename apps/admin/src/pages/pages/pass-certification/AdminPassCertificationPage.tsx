import { useAdminPassCertificationListQuery } from '@/api/pass-certification/passCertification';
import type { AdminPassCertificationItem } from '@/api/pass-certification/passCertificationSchema';
import Heading from '@/domain/admin/ui/heading/Heading';
import PassCertificationDetailModal from '@/domain/pass-certification/PassCertificationDetailModal';
import PassStatusBadge from '@/domain/pass-certification/PassStatusBadge';
import {
  FORM_PASS_TYPES,
  FORM_PROGRAM_TYPES,
  getProgramTypeLabel,
  PASS_TYPE_LABEL,
} from '@letscareer/utils';
import { Button, Chip, Stack, Tab, Tabs, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

const STATUS_TABS = [
  { value: '', label: '전체' },
  { value: 'PENDING', label: '대기' },
  { value: 'APPROVED', label: '승인' },
  { value: 'REJECTED', label: '반려' },
];

const passTypeText = (v: string) =>
  PASS_TYPE_LABEL[v as keyof typeof PASS_TYPE_LABEL] ?? v;

const programText = (item: AdminPassCertificationItem) =>
  item.programTypeList
    .map((t) =>
      t === 'ETC' && item.programTypeEtc
        ? `기타(${item.programTypeEtc})`
        : getProgramTypeLabel(t),
    )
    .join(', ');

export default function AdminPassCertificationPage() {
  const [status, setStatus] = useState('');
  const [passTypeList, setPassTypeList] = useState<string[]>([]);
  const [programTypeList, setProgramTypeList] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<AdminPassCertificationItem | null>(
    null,
  );

  const { data, isLoading } = useAdminPassCertificationListQuery({
    statusList: status ? [status] : undefined,
    passTypeList: passTypeList.length ? passTypeList : undefined,
    programTypeList: programTypeList.length ? programTypeList : undefined,
    keyword: keyword || undefined,
    page,
    size: pageSize,
  });

  const toggle = (
    list: string[],
    setter: (v: string[]) => void,
    value: string,
  ) => {
    setPage(0);
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  };

  const submitKeyword = () => {
    setPage(0);
    setKeyword(keywordInput.trim());
  };

  const resetFilters = () => {
    setStatus('');
    setPassTypeList([]);
    setProgramTypeList([]);
    setKeywordInput('');
    setKeyword('');
    setPage(0);
  };

  const columns: GridColDef<AdminPassCertificationItem>[] = [
    {
      field: 'createDate',
      headerName: '제출일',
      width: 120,
      sortable: false,
      renderCell: (p) => p.row.createDate.slice(0, 10).replace(/-/g, '.'),
    },
    { field: 'name', headerName: '이름', width: 120, sortable: false },
    { field: 'phoneNum', headerName: '연락처', width: 130, sortable: false },
    {
      field: 'matchedUserId',
      headerName: '회원 여부',
      width: 110,
      sortable: false,
      renderCell: (p) =>
        p.row.matchedUserId != null ? (
          <Chip
            size="small"
            color="primary"
            variant="outlined"
            label="회원"
          />
        ) : (
          <Chip size="small" variant="outlined" label="비회원" />
        ),
    },
    { field: 'companyName', headerName: '회사', width: 130, sortable: false },
    { field: 'jobName', headerName: '직무', width: 130, sortable: false },
    {
      field: 'passType',
      headerName: '합격형태',
      width: 130,
      sortable: false,
      renderCell: (p) => passTypeText(p.row.passType),
    },
    {
      field: 'programTypeList',
      headerName: '프로그램',
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (p) => programText(p.row),
    },
    {
      field: 'actions',
      headerName: '인증 확인',
      width: 130,
      sortable: false,
      renderCell: (p) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => setSelected(p.row)}
        >
          검토하기
        </Button>
      ),
    },
    {
      field: 'status',
      headerName: '상태',
      width: 130,
      sortable: false,
      renderCell: (p) => <PassStatusBadge status={p.row.status} />,
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-6">
      <Heading>합격 인증 관리</Heading>

      {/* 필터 */}
      <div className="border-neutral-90 flex flex-col gap-6 rounded-lg border p-5">
        {/* 상태 탭 + 검색 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs
            value={status}
            onChange={(_, v) => {
              setPage(0);
              setStatus(v);
            }}
          >
            {STATUS_TABS.map((t) => (
              <Tab key={t.value} value={t.value} label={t.label} />
            ))}
          </Tabs>

          <Stack direction="row" gap={1}>
            <TextField
              size="small"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitKeyword()}
              placeholder="이름·회사·연락처 검색"
              sx={{ width: 260 }}
            />
            <Button variant="contained" onClick={submitKeyword}>
              검색
            </Button>
          </Stack>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xsmall14 text-neutral-30">합격 형태</span>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {FORM_PASS_TYPES.map((v) => (
              <Chip
                key={v}
                label={passTypeText(v)}
                onClick={() => toggle(passTypeList, setPassTypeList, v)}
                color={passTypeList.includes(v) ? 'primary' : 'default'}
                variant={passTypeList.includes(v) ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xsmall14 text-neutral-30">참여 프로그램</span>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {FORM_PROGRAM_TYPES.map((v) => (
              <Chip
                key={v}
                label={getProgramTypeLabel(v)}
                onClick={() => toggle(programTypeList, setProgramTypeList, v)}
                color={programTypeList.includes(v) ? 'primary' : 'default'}
                variant={programTypeList.includes(v) ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </div>

        {/* 초기화 */}
        <div className="border-neutral-90 flex justify-end border-t pt-3">
          <button
            type="button"
            onClick={resetFilters}
            className="text-neutral-40 hover:text-neutral-30 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-xsmall14 underline">필터 초기화</span>
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <DataGrid
        autoHeight
        rows={data?.passCertificationList ?? []}
        columns={columns}
        getRowId={(row) => row.passCertificationId}
        loading={isLoading}
        pagination
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        rowCount={data?.pageInfo.totalElements ?? 0}
        pageSizeOptions={[10, 20, 50]}
        disableColumnMenu
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              조건에 맞는 합격 인증이 없습니다.
            </Stack>
          ),
        }}
      />

      <PassCertificationDetailModal
        item={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
