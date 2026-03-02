import { uploadFile } from '@/api/file';
import {
  useGetMagnetDetailQuery,
  usePatchMagnetMutation,
} from '@/api/magnet/magnet';
import {
  MagnetPostContent,
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

/** description JSON에서 metaDescription, programRecommend, magnetRecommend 추출 */
interface DescriptionPayload {
  metaDescription: string;
  programRecommend: MagnetProgramRecommendItem[];
  magnetRecommend: (number | null)[];
}

function parseDescription(raw: string | null): DescriptionPayload {
  const empty = createEmptyContent();
  if (!raw) {
    return {
      metaDescription: '',
      programRecommend: empty.programRecommend,
      magnetRecommend: empty.magnetRecommend,
    };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      metaDescription: parsed.metaDescription ?? '',
      programRecommend: parsed.programRecommend ?? empty.programRecommend,
      magnetRecommend: parsed.magnetRecommend ?? empty.magnetRecommend,
    };
  } catch {
    return {
      metaDescription: raw,
      programRecommend: empty.programRecommend,
      magnetRecommend: empty.magnetRecommend,
    };
  }
}

interface FormState {
  metaDescription: string;
  thumbnail: string;
  hasCommonForm: boolean;
}

export const useMagnetPostForm = (magnetId: number) => {
  const router = useRouter();
  const { snackbar: setSnackbar } = useAdminSnackbar();

  const { data: detailData, isLoading } = useGetMagnetDetailQuery(magnetId);
  const { mutate: patchMagnet } = usePatchMagnetMutation({
    successCallback: () => {
      setSnackbar('마그넷 글이 저장되었습니다.');
    },
  });

  const magnetInfo = detailData?.magnetInfo;

  const descPayload = useMemo(
    () => parseDescription(magnetInfo?.description ?? null),
    [magnetInfo?.description],
  );

  const initialContent = useMemo<MagnetPostContent>(
    () => ({
      programRecommend: descPayload.programRecommend,
      magnetRecommend: descPayload.magnetRecommend,
      lexicalBefore: magnetInfo?.previewContents || undefined,
      lexicalAfter: magnetInfo?.mainContents || undefined,
    }),
    [descPayload, magnetInfo?.previewContents, magnetInfo?.mainContents],
  );

  const [formState, setFormState] = useState<FormState>({
    metaDescription: '',
    thumbnail: '',
    hasCommonForm: false,
  });
  const [formInitialized, setFormInitialized] = useState(false);

  // detailData가 로드되면 폼 상태 초기화
  if (magnetInfo && !formInitialized) {
    setFormState({
      metaDescription: descPayload.metaDescription,
      thumbnail: magnetInfo.desktopThumbnail ?? '',
      hasCommonForm: false,
    });
    setFormInitialized(true);
  }

  const [displayDate, setDisplayDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [dateInitialized, setDateInitialized] = useState(false);

  if (magnetInfo && !dateInitialized) {
    setDisplayDate(magnetInfo.startDate ? dayjs(magnetInfo.startDate) : null);
    setEndDate(magnetInfo.endDate ? dayjs(magnetInfo.endDate) : null);
    setDateInitialized(true);
  }

  const [content, setContent] = useState<MagnetPostContent>(
    createEmptyContent(),
  );
  const [contentInitialized, setContentInitialized] = useState(false);

  if (magnetInfo && !contentInitialized) {
    setContent(initialContent);
    setContentInitialized(true);
  }

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

  const savePost = () => {
    const description = JSON.stringify({
      metaDescription: formState.metaDescription,
      programRecommend: content.programRecommend,
      magnetRecommend: content.magnetRecommend,
    });

    patchMagnet({
      magnetId,
      description,
      previewContents: content.lexicalBefore ?? '',
      mainContents: content.lexicalAfter ?? '',
      desktopThumbnail: formState.thumbnail,
      mobileThumbnail: formState.thumbnail,
      startDate: displayDate?.format('YYYY-MM-DDTHH:mm') ?? null,
      endDate: endDate?.format('YYYY-MM-DDTHH:mm') ?? null,
      isVisible: false,
    });
  };

  const navigateToList = () => {
    router.push('/admin/blog/magnet/list');
  };

  return {
    isLoading,
    type: magnetInfo?.type,
    title: magnetInfo?.title,
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
