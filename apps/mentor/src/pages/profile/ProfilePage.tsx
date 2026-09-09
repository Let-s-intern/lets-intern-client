import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useMyMentorHashTagListQuery,
  usePutMyMentorHashTag,
} from '@/api/mentor-hash-tag/mentorHashTag';
import { usePatchUser, useUserQuery } from '@/api/user/user';
import { emptyEditorState } from '@/common/lexical/EditorApp';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import mentorConfig from '@/constants/config';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import { parseSnsList, serializeSnsList } from '@/utils/sns';
import BasicInfoSection, {
  type BasicInfoFormData,
} from './ui/BasicInfoSection';
import CareerSection from './ui/CareerSection';
import Introduction from './ui/Introduction';
import MentorDetailContentSection from './ui/MentorDetailContentSection';
import MentorHashTagSection from './ui/MentorHashTagSection';

const INITIAL_FORM_DATA: BasicInfoFormData = {
  name: '',
  nickname: '',
  phoneNum: '',
  sns: [],
  email: '',
  profileImgUrl: '',
};

const isSameIdSet = (a: ReadonlySet<number>, b: ReadonlySet<number>) => {
  if (a.size !== b.size) return false;
  for (const id of a) {
    if (!b.has(id)) return false;
  }
  return true;
};

/**
 * 저장 실패 사유를 사용자에게 그대로 전한다.
 *
 * 공용 axios 인터셉터(`@letscareer/api`)가 서버 에러를 `ApiError` 로 재포장하면서
 * `code`/`message` 를 **최상위 속성**으로 올린다(`error.response` 는 남지 않는다).
 *
 * 이 값을 버리면 화면에 「프로필 저장에 실패했습니다」만 남는다. 실제로 서버는
 * `INVALID_EMAIL` 처럼 어느 칸이 잘못됐는지 말해 주는데, 그게 닿지 않으면 멘토는
 * 고칠 곳을 찾을 수 없고 저장을 다시 눌러 보기만 한다.
 *
 * 라이브 멘토링 쪽 `errorDescription` 과 같은 규칙이다. 도메인이 달라 가져다 쓰지 않고
 * 여기에 따로 둔다(앱·도메인 간 중복 허용 규칙).
 */
const saveFailureReason = (error: unknown): string | undefined => {
  const apiError = error as { code?: string; message?: string } | null;
  if (!apiError?.message) return undefined;
  return apiError.code
    ? `${apiError.message} (${apiError.code})`
    : apiError.message;
};
/**
 * 멘토 프로필.
 *
 * **저장은 하단 플로팅 바 하나뿐이다(LC-3266).** 예전에는 해시태그와 상세페이지 제작이
 * 각자 저장 버튼과 각자 mutation 을 갖고 있어서, 멘토가 "저장" 을 눌러도 그 둘은 빠진 채
 * 저장됐다. 값의 주인을 전부 이 페이지로 올리고 저장 경로를 하나로 합쳤다.
 *
 * 요청은 여전히 두 개다 — 프로필(`PATCH /user`)과 해시태그(`PUT /mentor-hash-tag/my`)는
 * 서로 다른 엔드포인트다. 한쪽만 실패할 수 있으므로 성공한 쪽만 저장 완료로 처리하고,
 * 실패한 쪽은 이름을 붙여 알린다. 둘 다 성공했을 때만 "저장되었습니다" 라고 말한다.
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: user } = useUserQuery();
  const { data: myTags, isLoading: isMyTagsLoading } =
    useMyMentorHashTagListQuery();
  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const [formData, setFormData] =
    useState<BasicInfoFormData>(INITIAL_FORM_DATA);
  const [introduction, setIntroduction] = useState('');
  const [hashTagIds, setHashTagIds] = useState<ReadonlySet<number>>(new Set());
  const [detailContent, setDetailContent] = useState(emptyEditorState);

  const [savedFormData, setSavedFormData] =
    useState<BasicInfoFormData>(INITIAL_FORM_DATA);
  const [savedIntroduction, setSavedIntroduction] = useState('');
  const [savedHashTagIds, setSavedHashTagIds] = useState<ReadonlySet<number>>(
    new Set(),
  );
  const [savedDetailContent, setSavedDetailContent] =
    useState(emptyEditorState);

  const [isSaving, setIsSaving] = useState(false);
  /** 값이 바뀔 때마다 에디터를 다시 마운트한다. "취소" 가 본문에도 먹게 하는 유일한 방법. */
  const [editorResetKey, setEditorResetKey] = useState(0);

  // Navigation guard state
  const [navGuard, setNavGuard] = useState<{
    isOpen: boolean;
    pendingHref: string | null;
    pendingAction: 'push' | 'back' | null;
  }>({ isOpen: false, pendingHref: null, pendingAction: null });
  const isNavigatingRef = useRef(false);

  const { mutateAsync: patchUser } = usePatchUser();
  const { mutateAsync: putHashTags } = usePutMyMentorHashTag();

  useEffect(() => {
    if (!user) return;
    const data: BasicInfoFormData = {
      name: user.name ?? '',
      nickname: user.nickname ?? '',
      email: user.email ?? '',
      phoneNum: user.phoneNum ?? '',
      sns: parseSnsList(user.sns),
      profileImgUrl: user.profileImgUrl ?? '',
    };
    setFormData(data);
    setSavedFormData(data);

    const intro = user.introduction ?? '';
    setIntroduction(intro);
    setSavedIntroduction(intro);

    /*
     * 비어 있으면 빈 에디터 상태를 기준값으로 둔다. 에디터는 마운트 직후 현재 상태로
     * onChange 를 한 번 쏘는데, 기준값이 빈 문자열이면 그 한 번 때문에 아무것도 안 고쳤는데
     * 변경사항이 있다고 뜬다.
     */
    const description = user.description || emptyEditorState;
    setDetailContent(description);
    setSavedDetailContent(description);
  }, [user]);

  useEffect(() => {
    if (!myTags) return;
    const ids = new Set(myTags.map((tag) => tag.id));
    setHashTagIds(ids);
    setSavedHashTagIds(ids);
  }, [myTags]);

  const isUserChanged = useMemo(
    () =>
      formData.name !== savedFormData.name ||
      formData.nickname !== savedFormData.nickname ||
      formData.phoneNum !== savedFormData.phoneNum ||
      serializeSnsList(formData.sns) !== serializeSnsList(savedFormData.sns) ||
      formData.email !== savedFormData.email ||
      formData.profileImgUrl !== savedFormData.profileImgUrl ||
      introduction !== savedIntroduction ||
      detailContent !== savedDetailContent,
    [
      formData,
      savedFormData,
      introduction,
      savedIntroduction,
      detailContent,
      savedDetailContent,
    ],
  );

  const isHashTagChanged = useMemo(
    () => !isSameIdSet(hashTagIds, savedHashTagIds),
    [hashTagIds, savedHashTagIds],
  );

  const hasUnsavedChanges = isUserChanged || isHashTagChanged;

  // Navigation guard: intercept link clicks + popstate + beforeunload
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.returnValue = '';
    };

    const handlePopState = () => {
      if (!isNavigatingRef.current) {
        window.history.pushState(null, '', window.location.href);
        setNavGuard({ isOpen: true, pendingHref: null, pendingAction: 'back' });
      }
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (
        anchor?.href &&
        anchor.href !== window.location.href &&
        anchor.href.startsWith(window.location.origin)
      ) {
        e.preventDefault();
        e.stopPropagation();
        setNavGuard({
          isOpen: true,
          pendingHref: anchor.href,
          pendingAction: 'push',
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick, true);
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick, true);
    };
  }, [hasUnsavedChanges]);

  const handleNavConfirm = useCallback(() => {
    isNavigatingRef.current = true;
    const { pendingHref, pendingAction } = navGuard;
    setNavGuard({ isOpen: false, pendingHref: null, pendingAction: null });
    if (pendingAction === 'back') {
      navigate(-1);
    } else if (pendingHref) {
      navigate(pendingHref);
    }
  }, [navGuard, navigate]);

  const handleNavCancel = useCallback(() => {
    setNavGuard({ isOpen: false, pendingHref: null, pendingAction: null });
  }, []);

  const handleDiscard = useCallback(() => {
    setFormData(savedFormData);
    setIntroduction(savedIntroduction);
    setHashTagIds(savedHashTagIds);
    setDetailContent(savedDetailContent);
    setEditorResetKey((key) => key + 1);
  }, [savedFormData, savedIntroduction, savedHashTagIds, savedDetailContent]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);

    /*
     * 바뀐 것만 보낸다. 두 요청은 서로를 기다리지 않는다 — 해시태그가 실패해도 프로필은
     * 저장돼야 하고, 그 반대도 마찬가지다.
     *
     * 실패는 **사유까지 들고 온다.** 예전에는 'fail' 이라는 라벨만 남기고 서버가 준
     * 이유를 버려서, 화면에 「프로필 저장에 실패했습니다」만 떴다. 서버는
     * `INVALID_EMAIL` 처럼 무엇이 잘못됐는지 정확히 말해 주는데 그게 멘토에게 닿지
     * 않으면 고칠 칸을 찾을 수 없다.
     */
    const [userResult, hashTagResult] = await Promise.all([
      isUserChanged
        ? patchUser({
            name: formData.name || undefined,
            nickname: formData.nickname || null,
            phoneNum: formData.phoneNum || undefined,
            sns: serializeSnsList(formData.sns),
            email: formData.email || undefined,
            introduction: introduction || null,
            profileImgUrl: formData.profileImgUrl || null,
            description: detailContent || null,
          }).then(
            () => ({ kind: 'ok' }) as const,
            (error: unknown) =>
              ({ kind: 'fail', reason: saveFailureReason(error) }) as const,
          )
        : Promise.resolve({ kind: 'skip' } as const),
      isHashTagChanged
        ? putHashTags({ mentorHashTagIdList: Array.from(hashTagIds) }).then(
            () => ({ kind: 'ok' }) as const,
            (error: unknown) =>
              ({ kind: 'fail', reason: saveFailureReason(error) }) as const,
          )
        : Promise.resolve({ kind: 'skip' } as const),
    ]);

    setIsSaving(false);

    // 성공한 쪽만 기준값을 옮긴다. 실패한 쪽은 변경사항으로 남아 다시 저장할 수 있다.
    if (userResult.kind === 'ok') {
      setSavedFormData(formData);
      setSavedIntroduction(introduction);
      setSavedDetailContent(detailContent);
    }
    if (hashTagResult.kind === 'ok') {
      setSavedHashTagIds(new Set(hashTagIds));
    }

    const failed = [
      userResult.kind === 'fail'
        ? { label: '프로필', reason: userResult.reason }
        : null,
      hashTagResult.kind === 'fail'
        ? { label: '해시태그', reason: hashTagResult.reason }
        : null,
    ].filter(
      (item): item is { label: string; reason: string | undefined } =>
        item !== null,
    );

    if (failed.length === 0) {
      /*
        저장이 끝난 뒤에 공개 페이지로 가는 길을 준다(LC-3277). 섹션 헤더에 상시로 두면
        저장 전에 눌러 옛 페이지를 보게 된다 — 방금 쓴 글이 없는 화면을 보고 저장이
        안 된 줄 안다.

        링크가 아니라 window.open 이다. 이 화면은 저장하지 않은 변경이 있을 때 앱 안의
        링크 클릭을 가로채 이탈 경고를 띄우는데(위 navigation guard), 방금 저장을 마친
        참에 그 경고가 뜨면 앞뒤가 맞지 않는다.
      */
      showConfirm({
        title: mentorConfig.profile.saveSuccess,
        description: '공개 프로필 페이지에서 바로 확인해 보세요.',
        variant: 'success',
        confirmText: '바로가기',
        cancelText: '닫기',
        onConfirm: () => {
          if (user) {
            window.open(
              `${import.meta.env.VITE_WEB_URL ?? ''}/mentors/${user.userId}`,
              '_blank',
            );
          }
          alertProps.onClose();
        },
      });
      return;
    }

    showAlert({
      title: `${failed.map((item) => item.label).join(' · ')} 저장에 실패했습니다.`,
      /* 서버가 말해 준 이유를 그대로 전한다. 없으면 제목만 남는다. */
      description:
        failed
          .map((item) => item.reason)
          .filter((reason): reason is string => Boolean(reason))
          .join('\n') || undefined,
      variant: 'error',
    });
  }, [
    isUserChanged,
    isHashTagChanged,
    formData,
    introduction,
    detailContent,
    hashTagIds,
    patchUser,
    putHashTags,
    showAlert,
    showConfirm,
    user,
    alertProps,
  ]);

  return (
    <div className="mx-auto max-w-3xl px-0 py-4 md:px-8 md:py-8">
      <h1 className="mb-1 text-xl font-bold">프로필</h1>
      <hr className="mb-6 border-gray-200" />

      <div className="flex flex-col gap-6 pb-20">
        <BasicInfoSection formData={formData} onChange={setFormData} />
        <Introduction value={introduction} onChange={setIntroduction} />
        <CareerSection />
        <MentorHashTagSection
          selectedIds={hashTagIds}
          onChange={setHashTagIds}
          isSelectionLoading={isMyTagsLoading}
        />
        <MentorDetailContentSection
          resetKey={editorResetKey}
          onChange={setDetailContent}
        />
      </div>

      {/* Floating save / discard buttons */}
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          hasUnsavedChanges
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-black/5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:px-10"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 md:px-4"
          >
            취소
          </button>
        </div>
      </div>

      {/* Navigation guard modal */}
      <MentorAlertModal
        isOpen={navGuard.isOpen}
        onClose={handleNavCancel}
        onConfirm={handleNavConfirm}
        title="변경사항이 저장되지 않았습니다"
        description="저장하지 않고 페이지를 나가시겠습니까?"
        confirmText="나가기"
        cancelText="취소"
        variant="confirm"
      />

      <MentorAlertModal {...alertProps} />
    </div>
  );
}
