import { uploadFile } from '@/api/file';
import { saveMagnetPost } from '@/domain/admin/blog/magnet/mock';
import {
  MagnetPostContent,
  MagnetPostDetail,
  MagnetProgramRecommendItem,
} from '@/domain/admin/blog/magnet/types';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useMemo, useState } from 'react';

const RECOMMEND_SLOT_COUNT = 4;

function createEmptyContent(): MagnetPostContent {
  return {
    programRecommend: Array.from({ length: RECOMMEND_SLOT_COUNT }, () => ({
      id: null,
    })),
    magnetRecommend: Array.from({ length: RECOMMEND_SLOT_COUNT }, () => null),
  };
}

function parseInitialContent(data: MagnetPostDetail): MagnetPostContent {
  if (!data.content || data.content === '') return createEmptyContent();
  try {
    return JSON.parse(data.content);
  } catch {
    return createEmptyContent();
  }
}

interface FormState {
  metaDescription: string;
  thumbnail: string;
  hasCommonForm: boolean;
}

function buildInitialFormState(data: MagnetPostDetail): FormState {
  return {
    metaDescription: data.metaDescription ?? '',
    thumbnail: data.thumbnail ?? '',
    hasCommonForm: data.hasCommonForm ?? false,
  };
}

interface UseMagnetPostFormParams {
  magnetId: string;
  initialData: MagnetPostDetail;
}

export const useMagnetPostForm = ({
  magnetId,
  initialData,
}: UseMagnetPostFormParams) => {
  const router = useRouter();
  const { snackbar: setSnackbar } = useAdminSnackbar();

  const initialContent = useMemo(
    () => parseInitialContent(initialData),
    [initialData],
  );
  const initialFormState = useMemo(
    () => buildInitialFormState(initialData),
    [initialData],
  );

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [displayDate, setDisplayDate] = useState<Dayjs | null>(
    initialData.displayDate ? dayjs(initialData.displayDate) : null,
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    initialData.endDate ? dayjs(initialData.endDate) : null,
  );
  const [content, setContent] = useState<MagnetPostContent>(initialContent);

  const onChangeMetaDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, metaDescription: e.target.value }));
  };

  const onChangeThumbnailFile = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.item(0);
    if (!file) {
      setSnackbar('파일이 없습니다.');
      return;
    }
    const url = await uploadFile({ file, type: 'BLOG' });
    setFormState((prev) => ({ ...prev, thumbnail: url }));
  };

  const onChangeHasCommonForm = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, hasCommonForm: checked }));
  };

  const onChangeProgramRecommend = (items: MagnetProgramRecommendItem[]) => {
    setContent((prev) => ({ ...prev, programRecommend: items }));
  };

  const onChangeMagnetRecommend = (items: (number | null)[]) => {
    setContent((prev) => ({ ...prev, magnetRecommend: items }));
  };

  const onChangeEditorBefore = (jsonString: string) => {
    setContent((prev) => ({ ...prev, lexicalBefore: jsonString }));
  };

  const onChangeEditorAfter = (jsonString: string) => {
    setContent((prev) => ({ ...prev, lexicalAfter: jsonString }));
  };

  const savePost = async () => {
    saveMagnetPost({
      magnetId: Number(magnetId),
      metaDescription: formState.metaDescription,
      thumbnail: formState.thumbnail,
      displayDate: displayDate?.format('YYYY-MM-DDTHH:mm') ?? null,
      endDate: endDate?.format('YYYY-MM-DDTHH:mm') ?? null,
      hasCommonForm: formState.hasCommonForm,
      content: JSON.stringify(content),
      isVisible: false,
    });
    setSnackbar('마그넷 글이 저장되었습니다.');
  };

  const navigateToList = () => {
    router.push('/admin/blog/magnet/list');
  };

  return {
    type: initialData.type,
    title: initialData.title,
    formState,
    displayDate,
    endDate,
    content,
    initialEditorStateBefore: initialContent.lexicalBefore,
    initialEditorStateAfter: initialContent.lexicalAfter,
    onChangeMetaDescription,
    onChangeThumbnailFile,
    onChangeHasCommonForm,
    onChangeProgramRecommend,
    onChangeMagnetRecommend,
    onChangeEditorBefore,
    onChangeEditorAfter,
    setDisplayDate,
    setEndDate,
    savePost,
    navigateToList,
  };
};
