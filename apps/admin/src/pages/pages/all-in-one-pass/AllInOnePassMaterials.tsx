import { AllInOnePassBenefit } from '@/api/all-in-one-pass/allInOnePassSchema';
import {
  allInOnePassBenefitListQueryKey,
  BenefitFormValues,
  useCreateAllInOnePassBenefitMutation,
  useDeleteAllInOnePassBenefitMutation,
  useGetAllInOnePassBenefitListQuery,
  useUpdateAllInOnePassBenefitMutation,
} from '@/api/all-in-one-pass/useBenefits';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import CategoryTabs from '@/common/ui/CategoryTabs';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import MaterialExposureModal from '@/domain/all-in-one-pass/ui/material/MaterialExposureModal';
import MaterialFormModal from '@/domain/all-in-one-pass/ui/material/MaterialFormModal';
import { parseMaterialIntro } from '@/domain/all-in-one-pass/util/materialIntro';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

const ALL = 'ALL';

/** 모달 대상: 생성(POST) 또는 특정 자료집 수정(PATCH) */
type ModalTarget =
  | { mode: 'create' }
  | { mode: 'edit'; benefit: AllInOnePassBenefit };

/** A-7 자료집 관리 (글로벌 풀 CRUD + 노출 영역 관리) */
export default function AllInOnePassMaterials() {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const [tab, setTab] = useState<string>(ALL);
  const [target, setTarget] = useState<ModalTarget | null>(null);
  const [exposureBenefit, setExposureBenefit] =
    useState<AllInOnePassBenefit | null>(null);

  const { data, isLoading, error } = useGetAllInOnePassBenefitListQuery();
  const list = useMemo(() => data ?? [], [data]);
  const existingTypes = useMemo(
    () => Array.from(new Set(list.map((b) => b.type ?? '').filter(Boolean))),
    [list],
  );

  const tabOptions = [
    { value: ALL, label: '전체' },
    ...existingTypes.map((t) => ({ value: t, label: t })),
  ];
  const visibleTab = existingTypes.includes(tab) ? tab : ALL;
  const filtered =
    visibleTab === ALL ? list : list.filter((b) => b.type === visibleTab);

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [allInOnePassBenefitListQueryKey],
    });
  const createBenefit = useCreateAllInOnePassBenefitMutation({
    successCallback: invalidate,
  });
  const updateBenefit = useUpdateAllInOnePassBenefitMutation({
    successCallback: invalidate,
  });
  const deleteBenefit = useDeleteAllInOnePassBenefitMutation({
    successCallback: invalidate,
  });

  const handleSubmit = async (values: BenefitFormValues) => {
    try {
      if (target?.mode === 'edit') {
        await updateBenefit.mutateAsync({
          id: target.benefit.membershipBenefitId,
          values,
        });
        snackbar('수정되었습니다.');
      } else {
        await createBenefit.mutateAsync(values);
        snackbar('추가되었습니다.');
      }
      setTarget(null);
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '저장에 실패했습니다.');
    }
  };

  const handleDelete = async (benefit: AllInOnePassBenefit) => {
    if (!window.confirm(`<${benefit.title}> 정말로 삭제하시겠습니까?`)) return;
    try {
      await deleteBenefit.mutateAsync(benefit.membershipBenefitId);
      snackbar('삭제되었습니다.');
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    }
  };

  const columns: GridColDef<AllInOnePassBenefit>[] = [
    { field: 'membershipBenefitId', headerName: 'ID', width: 80 },
    {
      field: 'type',
      headerName: '유형',
      width: 140,
      valueGetter: (_, row) => row.type || '-',
    },
    {
      field: 'title',
      headerName: '제목',
      width: 260,
      valueGetter: (_, row) => row.title || '-',
    },
    {
      field: 'introduction',
      headerName: '설명',
      flex: 1,
      minWidth: 220,
      valueGetter: (_, row) => {
        const { summary, bullets } = parseMaterialIntro(row.introduction);
        return [summary, ...bullets].filter(Boolean).join(' · ') || '-';
      },
    },
    {
      field: 'exposure',
      headerName: '노출 영역 관리',
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex h-full items-center">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setExposureBenefit(row)}
          >
            노출 영역 관리
          </Button>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: '관리',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex h-full items-center gap-2">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Pencil />}
            onClick={() => setTarget({ mode: 'edit', benefit: row })}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<FaTrashCan />}
            onClick={() => handleDelete(row)}
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>자료집 관리</Heading>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus size={12} />}
          onClick={() => setTarget({ mode: 'create' })}
        >
          자료집 추가
        </Button>
      </Header>

      <CategoryTabs<string>
        options={tabOptions}
        selected={visibleTab}
        onChange={setTab}
      />

      {isLoading ? (
        <LoadingContainer />
      ) : error ? (
        <div className="py-4 text-center">에러 발생</div>
      ) : list.length === 0 ? (
        <EmptyContainer text="등록된 자료집이 없습니다." />
      ) : (
        <DataGrid
          autoHeight
          rows={filtered}
          getRowId={(row) => row.membershipBenefitId}
          columns={columns}
          pagination
          pageSizeOptions={[10, 20, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
        />
      )}

      <MaterialFormModal
        benefit={
          target?.mode === 'edit'
            ? target.benefit
            : target?.mode === 'create'
              ? ({
                  membershipBenefitId: 0,
                  type: '',
                  title: '',
                  introduction: '',
                  link: '',
                  thumbnail: null,
                  membershipIds: [],
                } as AllInOnePassBenefit)
              : null
        }
        isEdit={target?.mode === 'edit'}
        existingTypes={existingTypes}
        onSubmit={handleSubmit}
        onClose={() => setTarget(null)}
        isLoading={createBenefit.isPending || updateBenefit.isPending}
      />

      <MaterialExposureModal
        benefit={exposureBenefit}
        onClose={() => setExposureBenefit(null)}
      />
    </main>
  );
}
