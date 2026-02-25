'use client';

import { usePostGuidebookMutation } from '@/api/program';
import GuidebookBasicSection from '@/domain/admin/program/guidebook/GuidebookBasicSection';
import GuidebookDetailContentSection from '@/domain/admin/program/guidebook/GuidebookDetailContentSection';
import GuidebookPriceSection from '@/domain/admin/program/guidebook/GuidebookPriceSection';
import GuidebookResourceSection from '@/domain/admin/program/guidebook/GuidebookResourceSection';
import GuidebookThumbnailSection from '@/domain/admin/program/guidebook/GuidebookThumbnailSection';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { guidebookToCreateInput } from '@/hooks/useDuplicateProgram';
import { CreateGuidebookReq, getGuidebookIdSchema } from '@/schema';
import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaSave } from 'react-icons/fa';

const initialGuidebookInput: CreateGuidebookReq = {
  title: '',
  shortDesc: '',
  thumbnail: '',
  desktopThumbnail: '',
  contentComposition: '',
  accessMethod: '',
  recommendedFor: '',
  description: '',
  job: '',
  contentUrl: undefined,
  contentFileUrl: undefined,
  priceInfo: {
    priceInfo: {
      price: 0,
      discount: 0,
      accountNumber: '',
      deadline: undefined,
      accountType: 'KB',
    },
    guideBookPriceType: 'CHARGE',
  },
  programTypeInfo: [],
  adminProgramTypeInfo: [],
};

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <section className="flex flex-col gap-3">
    <Heading2>{title}</Heading2>
    {children}
  </section>
);

const GuidebookCreate: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState<CreateGuidebookReq>(initialGuidebookInput);
  const [resourceSource, setResourceSource] = useState<'url' | 'file'>('url');
  const [importJsonString, setImportJsonString] = useState('');
  const [importProcessing, setImportProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { snackbar } = useAdminSnackbar();
  const { mutateAsync: postGuidebook } = usePostGuidebookMutation();

  const onClickSave = useCallback(async () => {
    setLoading(true);
    try {
      await postGuidebook(input);
      snackbar('가이드북이 생성되었습니다.');
      router.push('/admin/programs');
    } finally {
      setLoading(false);
    }
  }, [input, postGuidebook, snackbar, router]);

  if (importProcessing) {
    return <div>Importing...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>가이드북 생성</Heading>
        <div className="flex items-center gap-3">
          <TextField
            size="small"
            label="Export시 복사한 데이터 붙여넣기"
            variant="outlined"
            value={importJsonString}
            onChange={(e) => setImportJsonString(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              try {
                const guidebook = getGuidebookIdSchema.parse(
                  JSON.parse(importJsonString),
                );
                const importedInput = guidebookToCreateInput(guidebook);
                setImportProcessing(true);
                setInput(importedInput);
                setResourceSource(
                  importedInput.contentFileUrl && !importedInput.contentUrl
                    ? 'file'
                    : 'url',
                );
                setTimeout(() => {
                  snackbar('Import 성공!');
                  setImportJsonString('');
                  setImportProcessing(false);
                }, 200);
              } catch {
                snackbar('Import 실패');
              }
            }}
          >
            Import
          </Button>
        </div>
      </Header>

      <div className="mb-6 mt-3 grid w-full grid-cols-2 gap-3">
        <FormSection title="기본 정보">
          <GuidebookBasicSection input={input} setInput={setInput} />
        </FormSection>
        <div className="flex flex-col gap-4">
          <FormSection title="가격 정보">
            <GuidebookPriceSection input={input} setInput={setInput} />
          </FormSection>
          <FormSection title="자료 정보">
            <GuidebookResourceSection
              input={input}
              setInput={setInput}
              source={resourceSource}
              onChangeSource={setResourceSource}
            />
          </FormSection>
        </div>
      </div>

      <div className="mb-6">
        <FormSection title="썸네일">
          <GuidebookThumbnailSection input={input} setInput={setInput} />
        </FormSection>
      </div>
      <FormSection title="상세페이지 콘텐츠">
        <GuidebookDetailContentSection />
      </FormSection>

      <footer className="mt-8 flex items-center justify-end gap-3">
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={<FaSave size={12} />}
          onClick={onClickSave}
        >
          저장
        </Button>
      </footer>
    </div>
  );
};

export default GuidebookCreate;
