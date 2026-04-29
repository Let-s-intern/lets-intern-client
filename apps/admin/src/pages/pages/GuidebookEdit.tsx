import { useGetGuidebookQuery, usePatchGuidebookMutation } from '@/api/program';
import ProgramContentBasicSection from '@/domain/admin/program/ProgramContentBasicSection';
import ProgramContentEditorSection from '@/domain/admin/program/ProgramContentEditorSection';
import ProgramContentPriceSection from '@/domain/admin/program/ProgramContentPriceSection';
import ProgramContentThumbnailSection from '@/domain/admin/program/ProgramContentThumbnailSection';
import ProgramContentUrlFileSection from '@/domain/admin/program/ProgramContentUrlFileSection';
import { useGuidebookForm } from '@/domain/admin/program/guidebook/hooks/useGuidebookForm';
import { buildUpdateGuidebookReq } from '@/domain/admin/program/guidebook/utils/guidebookMapping';
import FormSection from '@/domain/admin/program/ui/FormSection';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';
import { FaSave } from 'react-icons/fa';

const GuidebookEdit: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ guidebookId: string }>();
  const guidebookIdString = params.guidebookId;
  const client = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const { data: guidebook } = useGetGuidebookQuery({
    guidebookId: Number(guidebookIdString),
    enabled: Boolean(guidebookIdString),
  });

  const { mutateAsync: patchGuidebook } = usePatchGuidebookMutation();

  const { input, setInput, resourceSource, setResourceSource, isReady } =
    useGuidebookForm({
      mode: 'edit',
      initialGuidebook: guidebook,
    });
  const [loading, setLoading] = React.useState(false);

  const handleClickExport = useCallback(async () => {
    if (!guidebook) return;

    try {
      await window.navigator.clipboard.writeText(JSON.stringify(guidebook));
      snackbar('복사되었습니다.');
    } catch {
      snackbar('복사에 실패했습니다.');
    }
  }, [guidebook, snackbar]);

  const handleClickSave = useCallback(async () => {
    if (!guidebookIdString) {
      return;
    }

    setLoading(true);
    try {
      const req = buildUpdateGuidebookReq(Number(guidebookIdString), input);

      await patchGuidebook(req);
      await client.invalidateQueries();

      snackbar('저장되었습니다.');
      navigate('/programs');
    } finally {
      setLoading(false);
    }
  }, [client, guidebookIdString, input, patchGuidebook, navigate, snackbar]);

  if (!guidebook || !isReady) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>가이드북 수정</Heading>
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
              uploadType="GUIDEBOOK"
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
            uploadType="GUIDEBOOK"
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

export default GuidebookEdit;
