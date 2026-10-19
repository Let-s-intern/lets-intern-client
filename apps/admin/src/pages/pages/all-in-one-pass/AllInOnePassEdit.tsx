import {
  allInOnePassDetailQueryKey,
  useGetAllInOnePassDetailQuery,
} from '@/api/all-in-one-pass/usePassDetail';
import { allInOnePassListQueryKey } from '@/api/all-in-one-pass/usePassList';
import {
  useDeleteAllInOnePassPlanMutation,
  useDeleteAllInOnePassPlanPrivilegeMutation,
  useUpdateAllInOnePassMutation,
  useUpdateAllInOnePassPlanMutation,
  useUpdateAllInOnePassPlanPrivilegeMutation,
} from '@/api/all-in-one-pass/usePassMutations';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import PassForm from '@/domain/all-in-one-pass/section/PassForm';
import PassFormViewTabs, {
  PassFormView,
} from '@/domain/all-in-one-pass/section/PassFormViewTabs';
import {
  PassFormInput,
  PassPermission,
  PassPlan,
} from '@/domain/all-in-one-pass/types';
import ImportExportBar from '@/domain/all-in-one-pass/ui/ImportExportBar';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

/** A-2 올인원패스 수정 */
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
  const updatePlanMutation = useUpdateAllInOnePassPlanMutation();
  const deletePlanMutation = useDeleteAllInOnePassPlanMutation();
  const updatePrivilegeMutation = useUpdateAllInOnePassPlanPrivilegeMutation();
  const deletePrivilegeMutation = useDeleteAllInOnePassPlanPrivilegeMutation();

  // 숫자 id = 서버에 존재하는 플랜. uuid = 아직 저장 안 된 신규 플랜.
  const isExistingPlan = (plan: PassPlan) => /^\d+$/.test(plan.id);

  const handleSave = async () => {
    if (!input || numericPassId == null) return;
    try {
      await updateMutation.mutateAsync({ id: numericPassId, input });
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

  // 플랜 단위 저장. 기본정보 PATCH + 권한 교체(PATCH)·제거(DELETE).
  // 순수 추가(기존보다 권한 개수 증가)는 privilege POST가 없어 보류한다.
  const handleSavePlan = async (plan: PassPlan) => {
    if (numericPassId == null) return;
    if (!isExistingPlan(plan)) {
      snackbar('플랜 추가는 백엔드 반영 후 지원됩니다.');
      throw new Error('new plan not supported');
    }
    const planId = Number(plan.id);
    const privilegeIds = plan.privilegeIds ?? {};
    const original = Object.keys(privilegeIds) as PassPermission[];
    const removed = original.filter((p) => !plan.permissions.includes(p));
    const added = plan.permissions.filter((p) => !original.includes(p));

    try {
      // 1) 기본정보
      await updatePlanMutation.mutateAsync({
        membershipId: numericPassId,
        planId,
        plan,
      });

      // 2) 권한: 빠진 것↔추가된 것을 짝지어 기존 슬롯 PATCH(교체),
      //    남는 "빠짐"은 DELETE. 짝 없는 "추가"는 POST가 없어 보류.
      const nextIds: Partial<Record<PassPermission, number>> = {
        ...privilegeIds,
      };
      const pairs = Math.min(added.length, removed.length);
      for (let i = 0; i < pairs; i++) {
        const id = privilegeIds[removed[i]]!;
        await updatePrivilegeMutation.mutateAsync({
          membershipId: numericPassId,
          planId,
          privilegeId: id,
          permission: added[i],
        });
        nextIds[added[i]] = id;
        delete nextIds[removed[i]];
      }
      for (let i = pairs; i < removed.length; i++) {
        await deletePrivilegeMutation.mutateAsync({
          membershipId: numericPassId,
          planId,
          privilegeId: privilegeIds[removed[i]]!,
        });
        delete nextIds[removed[i]];
      }
      const pendingAdds = added.length - pairs;

      // 같은 세션 내 재편집 대비해 로컬 privilegeIds 동기화
      setInput((prev) =>
        prev
          ? {
              ...prev,
              plans: prev.plans.map((p) =>
                p.id === plan.id ? { ...p, privilegeIds: nextIds } : p,
              ),
            }
          : prev,
      );

      snackbar(
        pendingAdds > 0
          ? '저장되었습니다. 단, 권한 추가 일부는 백엔드 반영 후 저장됩니다.'
          : '플랜이 수정되었습니다.',
      );
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '플랜 수정에 실패했습니다.');
      throw e;
    }
  };

  // 플랜 삭제. 기존 플랜은 BE DELETE 후 로컬 제거, 신규 플랜은 로컬만.
  const handleDeletePlan = async (plan: PassPlan) => {
    if (!window.confirm(`<${plan.name || '플랜'}> 정말로 삭제하시겠습니까?`))
      return;
    if (isExistingPlan(plan) && numericPassId != null) {
      try {
        await deletePlanMutation.mutateAsync({
          membershipId: numericPassId,
          planId: Number(plan.id),
        });
      } catch (e) {
        snackbar(e instanceof Error ? e.message : '플랜 삭제에 실패했습니다.');
        return;
      }
    }
    setInput((prev) =>
      prev
        ? { ...prev, plans: prev.plans.filter((p) => p.id !== plan.id) }
        : prev,
    );
    snackbar('플랜이 삭제되었습니다.');
  };

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
          {input && <ImportExportBar mode="export" input={input} />}
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
          <PassForm
            input={input}
            patch={patch}
            view={view}
            onSavePlan={handleSavePlan}
            onDeletePlan={handleDeletePlan}
          />
          <div className="border-neutral-80 sticky bottom-0 z-10 -mx-6 -mb-6 flex justify-end gap-2 border-t bg-neutral-100 px-6 py-4">
            <Button
              variant="outlined"
              onClick={() => navigate('/all-in-one-pass')}
            >
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              저장하기
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
