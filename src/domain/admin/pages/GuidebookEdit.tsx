'use client';

import { useGetGuidebookQuery, usePatchGuidebookMutation } from '@/api/program';
import GuidebookBasicSection from '@/domain/admin/program/guidebook/GuidebookBasicSection';
import GuidebookDetailContentSection from '@/domain/admin/program/guidebook/GuidebookDetailContentSection';
import GuidebookPriceSection from '@/domain/admin/program/guidebook/GuidebookPriceSection';
import GuidebookResourceSection from '@/domain/admin/program/guidebook/GuidebookResourceSection';
import GuidebookThumbnailSection from '@/domain/admin/program/guidebook/GuidebookThumbnailSection';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import type { CreateGuidebookReq, GuidebookPriceType } from '@/schema';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';

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

const GuidebookEdit: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ guidebookId: string }>();
  const guidebookIdString = params.guidebookId;
  const client = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const { data: guidebook } = useGetGuidebookQuery({
    guidebookId: Number(guidebookIdString),
    enabled: Boolean(guidebookIdString),
  });

  const { mutateAsync: patchGuidebook } = usePatchGuidebookMutation();

  const [input, setInput] = useState<CreateGuidebookReq | null>(null);
  const [resourceSource, setResourceSource] = useState<'url' | 'file'>('url');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!guidebook) return;

    setInput({
      title: guidebook.title ?? '',
      shortDesc: guidebook.shortDesc ?? '',
      thumbnail: guidebook.thumbnail ?? '',
      desktopThumbnail: guidebook.desktopThumbnail ?? '',
      contentComposition: guidebook.contentComposition ?? '',
      accessMethod: guidebook.accessMethod ?? '',
      recommendedFor: guidebook.recommendedFor ?? '',
      description: guidebook.description ?? '',
      job: guidebook.job ?? '',
      contentUrl: guidebook.contentUrl ?? undefined,
      contentFileUrl: guidebook.contentFileUrl ?? undefined,
      priceInfo: {
        priceInfo: {
          price: guidebook.price ?? 0,
          discount: guidebook.discount ?? 0,
          accountNumber: '',
          deadline: undefined,
          accountType: 'KB',
        },
        guideBookPriceType: guidebook.guideBookPriceType ?? 'CHARGE',
      },
      programTypeInfo:
        guidebook.programTypeInfo?.map((value) => ({
          classificationInfo: {
            programClassification: value.programClassification ?? 'PASS',
          },
        })) ?? [],
      adminProgramTypeInfo:
        guidebook.adminClassificationInfo?.map((value) => ({
          classificationInfo: {
            programAdminClassification: value.programAdminClassification,
          },
        })) ?? [],
    });

    setResourceSource(
      guidebook.contentFileUrl && !guidebook.contentUrl ? 'file' : 'url',
    );
  }, [guidebook]);

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
    if (!guidebookIdString || !input) {
      return;
    }

    setLoading(true);
    try {
      const req = {
        ...(input as CreateGuidebookReq),
        guidebookId: Number(guidebookIdString),
      } as {
        guidebookId: number;
        title: string;
        shortDesc: string;
        thumbnail: string;
        desktopThumbnail?: string;
        contentComposition: string;
        accessMethod: string;
        recommendedFor: string;
        description: string;
        isVisible?: boolean;
        job: string;
        contentUrl?: string;
        contentFileUrl?: string;
        priceInfo: {
          priceInfo: {
            price: number;
            discount: number;
            accountNumber?: string;
            deadline?: string;
            accountType?: CreateGuidebookReq['priceInfo']['priceInfo']['accountType'];
          };
          guideBookPriceType: GuidebookPriceType;
        };
        programTypeInfo: CreateGuidebookReq['programTypeInfo'];
        adminProgramTypeInfo?: CreateGuidebookReq['adminProgramTypeInfo'];
      };

      await patchGuidebook(req);
      client.invalidateQueries();

      snackbar('저장되었습니다.');
      router.push('/admin/programs');
    } finally {
      setLoading(false);
    }
  }, [client, guidebookIdString, input, patchGuidebook, router, snackbar]);

  if (!guidebook || !input) {
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
          <GuidebookBasicSection
            input={input as CreateGuidebookReq}
            setInput={
              setInput as React.Dispatch<
                React.SetStateAction<CreateGuidebookReq>
              >
            }
          />
        </FormSection>
        <div className="flex flex-col gap-4">
          <FormSection title="가격 정보">
            <GuidebookPriceSection
              input={input as CreateGuidebookReq}
              setInput={
                setInput as React.Dispatch<
                  React.SetStateAction<CreateGuidebookReq>
                >
              }
            />
          </FormSection>
          <FormSection title="자료 정보">
            <GuidebookResourceSection
              input={input as CreateGuidebookReq}
              setInput={
                setInput as React.Dispatch<
                  React.SetStateAction<CreateGuidebookReq>
                >
              }
              source={resourceSource}
              onChangeSource={setResourceSource}
            />
          </FormSection>
        </div>
      </div>

      <div className="mb-6">
        <FormSection title="썸네일">
          <GuidebookThumbnailSection
            input={input as CreateGuidebookReq}
            setInput={
              setInput as React.Dispatch<
                React.SetStateAction<CreateGuidebookReq>
              >
            }
          />
        </FormSection>
      </div>

      <FormSection title="상세페이지 콘텐츠">
        <GuidebookDetailContentSection
          input={input as CreateGuidebookReq}
          setInput={
            setInput as React.Dispatch<React.SetStateAction<CreateGuidebookReq>>
          }
        />
      </FormSection>

      <footer className="mt-8 flex items-center justify-end gap-3">
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
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
