import { useGetVodQuery, usePatchVodMutation } from '@/api/program';
import ProgramContentBasicSection from '@/domain/admin/program/ProgramContentBasicSection';
import ProgramContentEditorSection from '@/domain/admin/program/ProgramContentEditorSection';
import ProgramContentPriceSection from '@/domain/admin/program/ProgramContentPriceSection';
import ProgramContentThumbnailSection from '@/domain/admin/program/ProgramContentThumbnailSection';
import ProgramContentUrlFileSection from '@/domain/admin/program/ProgramContentUrlFileSection';
import FormSection from '@/domain/admin/program/ui/FormSection';
import { useVodForm } from '@/domain/admin/program/vod/hooks/useVodForm';
import { buildUpdateVodReq } from '@/domain/admin/program/vod/utils/vodMapping';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';
import { FaSave } from 'react-icons/fa';

const VodEdit: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ vodId: string }>();
  const vodIdString = params.vodId;
  const client = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const { data: vod } = useGetVodQuery({
    vodId: Number(vodIdString),
    enabled: Boolean(vodIdString),
  });

  const { mutateAsync: patchVod } = usePatchVodMutation();

  const { input, setInput, resourceSource, setResourceSource, isReady } =
    useVodForm({
      mode: 'edit',
      initialVod: vod,
    });
  const [loading, setLoading] = React.useState(false);

  const handleClickExport = useCallback(async () => {
    if (!vod) return;

    try {
      await window.navigator.clipboard.writeText(JSON.stringify(vod));
      snackbar('복사되었습니다.');
    } catch {
      snackbar('복사에 실패했습니다.');
    }
  }, [vod, snackbar]);

  const handleClickSave = useCallback(async () => {
    if (!vodIdString) return;

    setLoading(true);
    try {
      const req = buildUpdateVodReq(Number(vodIdString), input);

      await patchVod(req);
      await client.invalidateQueries();

      snackbar('저장되었습니다.');
      navigate('/admin/programs');
    } finally {
      setLoading(false);
    }
  }, [client, vodIdString, input, patchVod, navigate, snackbar]);

  if (!vod || !isReady) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>VOD 클래스 수정</Heading>
        <div className="flex items-center gap-3">
          <Button variant="outlined" onClick={handleClickExport}>
            Export
          </Button>
        </div>
      </Header>

      <div className="mb-6 mt-3 grid w-full grid-cols-2 gap-3">
        <FormSection title="기본 정보">
          <ProgramContentBasicSection input={input} setInput={setInput} />
        </FormSection>
        <div className="flex flex-col gap-4">
          <FormSection title="가격 정보">
            <ProgramContentPriceSection input={input} setInput={setInput} />
          </FormSection>
          <FormSection title="자료 정보" required>
            <ProgramContentUrlFileSection
              input={input}
              setInput={setInput}
              uploadType="VOD"
              source={resourceSource}
              onChangeSource={setResourceSource}
            />
          </FormSection>
        </div>
      </div>

      <div className="mb-6">
        <FormSection title="썸네일">
          <ProgramContentThumbnailSection
            input={input}
            setInput={setInput}
            uploadType="VOD"
          />
        </FormSection>
      </div>

      <FormSection title="상세페이지 콘텐츠">
        <ProgramContentEditorSection input={input} setInput={setInput} />
      </FormSection>

      <footer className="mt-8 flex items-center justify-end gap-3">
        <Button
          variant="contained"
          color="primary"
          disabled={
            loading ||
            (resourceSource === 'url'
              ? !input.contentUrl
              : !input.contentFileUrl)
          }
          startIcon={<FaSave size={12} />}
          onClick={handleClickSave}
        >
          저장
        </Button>
      </footer>
    </div>
  );
};

export default VodEdit;
