import {
  CurationBodyType,
  CurationItemType,
  CurationLocationType,
  usePostAdminCuration,
} from '@/api/curation';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import CurationInfoSection from '@components/admin/home/curation/section/CurationInfoSection';
import CurationItemsSection from '@components/admin/home/curation/section/CurationItemsSection';
import CurationVisibleSection from '@components/admin/home/curation/section/CurationVisibleSection';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeCurationCreatePage = () => {
  const navigate = useNavigate();
  const { snackbar } = useAdminSnackbar();

  const [locationType, setLocationType] =
    useState<CurationLocationType>('UNDER_BANNER');
  const [form, setForm] = useState<CurationBodyType>({
    title: '',
    subTitle: '',
    showImminentList: false,
    moreUrl: '',
    startDate: '',
    endDate: '',
    curationItemList: [],
  });
  const [curationItems, setCurationItems] = useState<CurationItemType[]>([]);

  const { mutateAsync: createCuration, isPending: createCurationIsPending } =
    usePostAdminCuration({
      successCallback: () => {
        snackbar('홈 큐레이션을 생성했습니다.');
        navigate('/admin/home/curation');
      },
    });

  const onClickCreate = async () => {
    if (
      !form.title ||
      !form.startDate ||
      !form.endDate ||
      (!form.showImminentList && curationItems.length < 1) ||
      curationItems.some(
        (item) =>
          (item.programType !== 'ETC' && !item.programId) ||
          (item.programType === 'ETC' &&
            (!item.title || !item.url || !item.thumbnail)),
      )
    ) {
      snackbar('필수 항목을 입력해주세요.');
      return;
    }

    await createCuration({
      locationType,
      body: {
        ...form,
        moreUrl: form.moreUrl === '' ? undefined : form.moreUrl,
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

  return (
    <>
      <div className="mx-6 mb-40 mt-6">
        <Header>
          <Heading>홈 큐레이션 생성</Heading>
        </Header>
        <div className="flex w-full flex-col gap-y-8">
          <div className="flex w-full gap-x-5">
            <CurationInfoSection
              setLocationType={setLocationType}
              setForm={setForm}
            />
            <CurationVisibleSection setForm={setForm} />
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
            onClick={() => navigate('/admin/home/curation')}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={createCurationIsPending}
            loading={createCurationIsPending}
            onClick={onClickCreate}
          >
            생성
          </Button>
        </div>
      </div>
    </>
  );
};

export default HomeCurationCreatePage;
