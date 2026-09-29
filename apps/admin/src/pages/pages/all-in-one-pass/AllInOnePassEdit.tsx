import {
  allInOnePassDetailQueryKey,
  useGetAllInOnePassDetailQuery,
} from '@/api/all-in-one-pass/usePassDetail';
import { allInOnePassListQueryKey } from '@/api/all-in-one-pass/usePassList';
import {
  useSyncMembershipBenefitsMutation,
  useUpdateAllInOnePassMutation,
} from '@/api/all-in-one-pass/usePassMutations';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import PassForm from '@/domain/all-in-one-pass/section/PassForm';
import { PassFormInput } from '@/domain/all-in-one-pass/types';
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
  useEffect(() => {
    if (data) setInput((prev) => prev ?? data);
  }, [data]);

  const patch = (partial: Partial<PassFormInput>) =>
    setInput((prev) => (prev ? { ...prev, ...partial } : prev));

  const updateMutation = useUpdateAllInOnePassMutation();
  const syncBenefits = useSyncMembershipBenefitsMutation();

  const handleSave = async () => {
    if (!input || numericPassId == null) return;
    try {
      await updateMutation.mutateAsync({ id: numericPassId, input });
      await syncBenefits.mutateAsync({
        membershipId: numericPassId,
        original: data?.benefits ?? [],
        current: input.benefits,
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
          <Heading>올인원패스 수정</Heading>
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
          <PassForm input={input} patch={patch} />
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
              disabled={updateMutation.isPending || syncBenefits.isPending}
            >
              저장하기
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
