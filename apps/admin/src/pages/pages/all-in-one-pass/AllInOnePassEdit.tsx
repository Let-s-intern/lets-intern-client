import {
  allInOnePassDetailQueryKey,
  useGetAllInOnePassDetailQuery,
} from '@/api/all-in-one-pass/usePassDetail';
import { allInOnePassListQueryKey } from '@/api/all-in-one-pass/usePassList';
import {
  useDeleteAllInOnePassPlanMutation,
  useSyncAllInOnePassOptionsMutation,
  useUpdateAllInOnePassMutation,
} from '@/api/all-in-one-pass/usePassMutations';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import PassForm from '@/domain/all-in-one-pass/section/PassForm';
import PassFormViewTabs, {
  PassFormView,
} from '@/domain/all-in-one-pass/section/PassFormViewTabs';
import { PassFormInput } from '@/domain/all-in-one-pass/types';
import ImportExportBar from '@/domain/all-in-one-pass/ui/ImportExportBar';
import VodPassSaleToggle from '@/domain/all-in-one-pass/ui/VodPassSaleToggle';
import { isServerPlanId } from '@/domain/all-in-one-pass/util/allInOnePassMapper';
import { useVodDefaults } from '@/domain/all-in-one-pass/util/useVodDefaults';
import { validatePassInput } from '@/domain/all-in-one-pass/util/validatePassInput';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AllInOnePassEdit() {
  const { passId } = useParams();
  const numericPassId = passId ? Number(passId) : undefined;
  const navigate = useNavigate();
  const { snackbar } = useAdminSnackbar();
  const queryClient = useQueryClient();

  const { data, isLoading, error } =
    useGetAllInOnePassDetailQuery(numericPassId);

  const [input, setInput] = useState<PassFormInput | null>(null);
  const [view, setView] = useState<PassFormView>('info');
  useEffect(() => {
    if (data) setInput((prev) => prev ?? data);
  }, [data]);

  const patch = (partial: Partial<PassFormInput>) =>
    setInput((prev) => (prev ? { ...prev, ...partial } : prev));

  const updateMutation = useUpdateAllInOnePassMutation();
  const deletePlanMutation = useDeleteAllInOnePassPlanMutation();
  const syncOptionsMutation = useSyncAllInOnePassOptionsMutation();
  const applyVodDefaults = useVodDefaults();

  /**
   * 저장: 폼에서 빠진 기존 플랜을 DELETE 한 뒤, 기본정보 + 플랜/권한을
   * planList inline 으로 한 번에 PATCH(full-sync).
   */
  const handleSave = async () => {
    if (!input || numericPassId == null) return;
    const validationError = validatePassInput(input);
    if (validationError) {
      snackbar(validationError);
      return;
    }
    try {
      const currentServerIds = new Set(
        input.plans.filter((p) => isServerPlanId(p.id)).map((p) => p.id),
      );
      const removedPlans = (data?.plans ?? []).filter(
        (p) => isServerPlanId(p.id) && !currentServerIds.has(p.id),
      );
      for (const plan of removedPlans) {
        await deletePlanMutation.mutateAsync({
          membershipId: numericPassId,
          planId: Number(plan.id),
        });
      }

      await updateMutation.mutateAsync({
        id: numericPassId,
        input: applyVodDefaults(input),
      });
      await syncOptionsMutation.mutateAsync({
        membershipId: numericPassId,
        original: data?.extensionOptions ?? [],
        current: input.extensionOptions,
      });
      snackbar('수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: [allInOnePassListQueryKey] });
      queryClient.removeQueries({
        queryKey: [allInOnePassDetailQueryKey, numericPassId],
      });
      navigate('/all-in-one-pass');
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '수정에 실패했습니다.');
    }
  };

  const saving =
    updateMutation.isPending ||
    deletePlanMutation.isPending ||
    syncOptionsMutation.isPending;

  return (
    <main className="flex flex-col p-6">
      <div className="flex flex-col gap-2">
        <Link
          to="/all-in-one-pass"
          className="text-xsmall14 text-neutral-40 hover:text-neutral-0 flex w-fit items-center gap-1"
        >
          <IoArrowBack />
          올인원패스 개설
        </Link>
        <Header>
          <div className="flex items-center gap-4">
            <Heading>올인원패스 수정</Heading>
            {input && <PassFormViewTabs value={view} onChange={setView} />}
          </div>
          {input && (
            <div className="flex items-center gap-4">
              {numericPassId != null && (
                <VodPassSaleToggle passId={numericPassId} />
              )}
              <ImportExportBar mode="export" input={input} />
            </div>
          )}
        </Header>
      </div>

      {isLoading || (!input && !error) ? (
        <LoadingContainer />
      ) : error || !input ? (
        <div className="py-4 text-center">
          존재하지 않거나 불러올 수 없는 패스입니다.
        </div>
      ) : (
        <>
          <PassForm input={input} patch={patch} view={view} />
          <div className="border-neutral-80 sticky bottom-0 z-10 -mx-6 -mb-6 flex justify-end gap-2 border-t bg-neutral-100 px-6 py-4">
            <Button
              variant="outlined"
              onClick={() => navigate('/all-in-one-pass')}
            >
              취소
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              저장하기
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
