import { uploadFile } from '@/api/file';
import {
  useCreateMagnetMutation,
  useGetMagnetDetailQuery,
  usePatchMagnetMutation,
} from '@/api/magnet/magnet';
import {
  MagnetPostContent,
  MagnetProgramRecommendItem,
  MagnetTypeKey,
} from '@/domain/admin/magnet/types';
import { detailQuestionToApiBody } from '@/domain/admin/magnet/utils/questionMapper';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
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
  useBaseQuestion: boolean;
  useLaunchAlert: boolean;
}

export const useMagnetPostForm = (magnetId: string) => {
  const navigate = useNavigate();
  const { snackbar: setSnackbar } = useAdminSnackbar();
  const isCreateMode = magnetId === 'new';
  const numericId = isCreateMode ? 0 : Number(magnetId);

  const { data: detailData, isLoading } = useGetMagnetDetailQuery(numericId, {
    enabled: !isCreateMode,
  });
  const { mutate: patchMagnet } = usePatchMagnetMutation({
    successCallback: () => {
      setSnackbar('마그넷 글이 저장되었습니다.');
    },
  });
  const { mutate: createMagnet } = useCreateMagnetMutation({
    successCallback: () => {
      setSnackbar('마그넷이 등록되었습니다.');
      navigate('/magnet/list');
    },
  });

  const [createType, setCreateType] = useState<MagnetTypeKey | ''>('');
  const [createTitle, setCreateTitle] = useState('');
  const [createProgramType, setCreateProgramType] = useState('');
  const [createChallengeType, setCreateChallengeType] = useState('');

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
    useBaseQuestion: false,
    useLaunchAlert: false,
  });
  const [displayDate, setDisplayDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [content, setContent] =
    useState<MagnetPostContent>(createEmptyContent());
  const [initialized, setInitialized] = useState(false);

  // detailData가 로드되면 모든 폼 상태 초기화
  if (detailData && magnetInfo && !initialized) {
    setFormState({
      metaDescription: descPayload.metaDescription,
      thumbnail: magnetInfo.desktopThumbnail ?? '',
      useBaseQuestion: magnetInfo.useBaseQuestion,
      useLaunchAlert: magnetInfo.useLaunchAlert,
    });
    setDisplayDate(magnetInfo.startDate ? dayjs(magnetInfo.startDate) : null);
    setEndDate(magnetInfo.endDate ? dayjs(magnetInfo.endDate) : null);
    setContent(initialContent);
    setInitialized(true);
  }

  const onChangeMetaDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, metaDescription: e.target.value }));
  };

  const onChangeThumbnailFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) {
      setSnackbar('파일이 없습니다.');
      return;
    }
    const url = await uploadFile({ file, type: 'BLOG' });
    setFormState((prev) => ({ ...prev, thumbnail: url }));
  };

  const onChangeUseBaseQuestion = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, useBaseQuestion: checked }));
  };

  const onChangeUseLaunchAlert = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, useLaunchAlert: checked }));
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
    if (isCreateMode) {
      if (!createType || !createTitle.trim()) return;
      createMagnet({
        type: createType,
        programType: createProgramType || undefined,
        challengeType: createChallengeType || undefined,
        title: createTitle.trim(),
      });
      return;
    }

    const description = JSON.stringify({
      metaDescription: formState.metaDescription,
      programRecommend: content.programRecommend,
      magnetRecommend: content.magnetRecommend,
    });

    // ADDITIONAL 질문만 전송 (BASE는 서버가 useBaseQuestion 플래그로 자동 관리)
    const additionalQuestions = (detailData?.magnetQuestionInfo ?? [])
      .filter((q) => q.type === 'ADDITIONAL')
      .map(detailQuestionToApiBody);

    patchMagnet({
      magnetId: numericId,
      description,
      previewContents: content.lexicalBefore ?? '',
      mainContents: content.lexicalAfter ?? '',
      desktopThumbnail: formState.thumbnail,
      mobileThumbnail: formState.thumbnail,
      useBaseQuestion: formState.useBaseQuestion,
      useLaunchAlert: formState.useLaunchAlert,
      startDate: displayDate?.format('YYYY-MM-DDTHH:mm') ?? null,
      endDate: endDate?.format('YYYY-MM-DDTHH:mm') ?? null,
      magnetQuestionList: additionalQuestions,
    });
  };

  const navigateToList = () => {
    navigate('/magnet/list');
  };

  return {
    isCreateMode,
    isLoading: isCreateMode ? false : isLoading,
    type: isCreateMode ? createType : magnetInfo?.type,
    title: isCreateMode ? createTitle : magnetInfo?.title,
    createType,
    createTitle,
    createProgramType,
    createChallengeType,
    setCreateType,
    setCreateTitle,
    setCreateProgramType,
    setCreateChallengeType,
    formState,
    displayDate,
    endDate,
    content,
    initialEditorStateBefore: initialContent.lexicalBefore,
    initialEditorStateAfter: initialContent.lexicalAfter,
    onChangeMetaDescription,
    onChangeThumbnailFile,
    onChangeUseBaseQuestion,
    onChangeUseLaunchAlert,
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
