import {
  CurationEditBodyType,
  CurationItemType,
  CurationLocationType,
  useGetAdminCurationDetail,
  usePatchAdminCuration,
} from '@/api/curation';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import CurationInfoSection from '@components/admin/home/curation/section/CurationInfoSection';
import CurationItemsSection from '@components/admin/home/curation/section/CurationItemsSection';
import CurationVisibleSection from '@components/admin/home/curation/section/CurationVisibleSection';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import ErrorContainer from '@components/common/ui/ErrorContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HomeCurationEditPage = () => {
  const router = useRouter();
  const { snackbar } = useAdminSnackbar();
  const { id } = useParams<{ id: string }>();

  const [locationType, setLocationType] =
    useState<CurationLocationType>('UNDER_BANNER');
  const [form, setForm] = useState<CurationEditBodyType>({ title: '' });
  const [curationItems, setCurationItems] = useState<CurationItemType[]>([]);

  const {
    data: curation,
    isLoading: curationIsLoading,
    error: curationError,
  } = useGetAdminCurationDetail(Number(id));

  const { mutateAsync: updateCuration, isPending: updateCurationIsPending } =
    usePatchAdminCuration({
      successCallback: () => {
        snackbar('홈 큐레이션을 수정했습니다.');
        router.push('/admin/home/curation');
      },
    });

  const onClickEdit = async () => {
    if (
      form.title === '' ||
      form.startDate === '' ||
      form.endDate === '' ||
      (!form.showImminentList && curationItems.length < 1) ||
      curationItems.some(
        (item) =>
          (item.programType !== 'ETC' && !item.programId) ||
          (item.programType === 'ETC' &&
            (!item.title || !item.url || !item.thumbnail)),
      )
    ) {
      console.log(form);
      snackbar('필수 항목을 입력해주세요.');
      return;
    }

    await updateCuration({
      id: Number(id),
      body: {
        locationType,
        ...form,
        curationItemList: curationItems.map((item) => ({
          programType: item.programType,
          programId: item.programId || undefined,
          title: item.title || undefined,
          url: item.url || undefined,
          thumbnail: item.thumbnail || undefined,
          tag: item.tag || undefined,
        })),
      },
    });
  };

  useEffect(() => {
    if (curation) {
      setForm({
        title: curation.curationInfo.title,
        showImminentList: curation.curationInfo.showImminentList,
      });
      setLocationType(curation.curationInfo.locationType);
      setCurationItems(curation.curationItemList);
    }
  }, [curation]);

  return (
    <>
      <div className="mx-6 mb-40 mt-6">
        <Header>
          <Heading>홈 큐레이션 수정</Heading>
        </Header>
        {curationIsLoading ? (
          <LoadingContainer />
        ) : curationError || !curation ? (
          <ErrorContainer />
        ) : (
          <>
            <div className="flex w-full flex-col gap-y-8">
              <div className="flex w-full gap-x-5">
                <CurationInfoSection
                  form={form}
                  defaultValue={curation.curationInfo}
                  setLocationType={setLocationType}
                  setForm={setForm}
                />
                <CurationVisibleSection
                  defaultValue={curation.curationInfo}
                  setForm={setForm}
                />
              </div>
              <CurationItemsSection
                curationItems={curationItems}
                setCurationItems={setCurationItems}
              />
            </div>
            <div className="mt-5 flex justify-end gap-x-5">
              <Button
                variant="contained"
                color="error"
                onClick={() => router.push('/admin/home/curation')}
              >
                취소
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={updateCurationIsPending}
                loading={updateCurationIsPending}
                onClick={onClickEdit}
              >
                수정
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HomeCurationEditPage;
