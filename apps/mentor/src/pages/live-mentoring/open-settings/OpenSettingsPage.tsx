import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getLowestPrice,
  LIVE_MENTORING_CATEGORIES,
  LIVE_MENTORING_DURATIONS,
} from '@letscareer/mocks';

import { useSetRepresentativeCareerMutation } from '@/api/career/career';
import { useUserQuery } from '@/api/user/user';
import {
  useCloseLiveMentoringOpeningMutation,
  useCreateLiveMentoringOpeningMutation,
  useLiveMentoringOpenStatusQuery,
  useLiveMentoringSettingsQuery,
  useStartEditLiveMentoringMutation,
  useUpdateLiveMentoringSettingsMutation,
} from '@/api/live-mentoring/liveMentoring';
import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
  LiveMentoringSettings,
} from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import {
  CATEGORY_LABELS,
  START_EDIT_SUCCESS_SETTINGS,
  formatCareerPeriod,
  publicDetailUrl,
  formatPrice,
  representativeCareerLabel,
} from '../constants';
import LiveMentoringSlotModal from './ui/LiveMentoringSlotModal';
import OpenedNoticeModal from './ui/OpenedNoticeModal';
import PreOpenCheckModal from './ui/PreOpenCheckModal';
import OpenSettingsPreview from './ui/OpenSettingsPreview';

const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 md:p-6';
const sectionTitleClass = 'mb-4 text-base font-semibold text-gray-900';

/**
 * 저장·제출 실패 사유를 사용자에게 그대로 보여준다.
 *
 * 공용 axios 인터셉터(`@letscareer/api`)가 서버 에러를 `ApiError` 로 재포장하면서
 * `code`/`message`/`status` 를 **최상위 속성**으로 올린다(`error.response` 는 남지 않는다).
 * 이걸 감추고 "실패했습니다"만 띄우면 멘토도 개발자도 원인을 알 수 없다 —
 * 수정 잠금(`LIVE_MENTORING_LOCKED`)인지, 상태 전이 불가(`LIVE_MENTORING_INVALID_STATE`)인지,
 * 미지원 진행시간(`INVALID_LIVE_MENTORING_DURATION`)인지가 갈린다.
 */
const errorDescription = (error: unknown): string | undefined => {
  const apiError = error as { code?: string; message?: string } | null;
  if (!apiError?.message) return undefined;
  return apiError.code
    ? `${apiError.message} (${apiError.code})`
    : apiError.message;
};

/** 다른 창에서 상태가 바뀐 경우 — 화면 값이 이미 낡았으므로 다시 읽어오게 안내한다. */
const isStateConflict = (error: unknown) => {
  const code = (error as { code?: string } | null)?.code;
  return (
    code === 'LIVE_MENTORING_INVALID_STATE' || code === 'LIVE_MENTORING_LOCKED'
  );
};

const OpenSettingsPage = () => {
  const { data, refetch } = useLiveMentoringSettingsQuery();
  // 승인 상태에서 "지금 열려 있는지"는 설정 응답이 알려주지 않는다 — 개설 이력으로 판단한다.
  const { data: openings } = useLiveMentoringOpenStatusQuery();
  // 공개 상세는 mentorId 로 열린다(웹 라우트 `/live-mentoring/[mentorId]`).
  const { data: user } = useUserQuery();
  const { mutate: save, isPending: isSaving } =
    useUpdateLiveMentoringSettingsMutation();
  const { mutate: openMentoring, isPending: isOpening } =
    useCreateLiveMentoringOpeningMutation();
  const { mutate: startEdit, isPending: isStartingEdit } =
    useStartEditLiveMentoringMutation();
  const { mutate: closeOpening, isPending: isClosingOpening } =
    useCloseLiveMentoringOpeningMutation();
  const {
    mutate: setRepresentativeCareer,
    isPending: isSettingRepresentativeCareer,
  } = useSetRepresentativeCareerMutation();
  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const [form, setForm] = useState<LiveMentoringSettings | null>(null);
  // 제목·타입의 변경사항(dirty) 판정을 위한 로드 원본.
  const [original, setOriginal] = useState<LiveMentoringSettings | null>(null);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  /** 오픈 직후 안내 모달이 종료 대상으로 삼을 개설. null 이면 모달을 닫는다. */
  const [openedOpeningId, setOpenedOpeningId] = useState<number | null>(null);
  /**
   * 오픈 전 확인 모달 노출 여부.
   *
   * 검토 제출이 사라지고 최초 개설·재개설이 `POST /openings` 하나로 합쳐지면서
   * 어느 쪽을 실행할지 들고 있을 이유도 없어졌다.
   */
  const [isOpenConfirmVisible, setIsOpenConfirmVisible] = useState(false);
  /**
   * "수정" 성공 직후, 설정 쿼리가 아직 리페치 전이라 `status` 가 잠깐 낡은
   * `APPROVED` 로 남는다. 그 사이에도 곧바로 초안 모드(저장·제출)로 넘어가야
   * 하므로 그 순간만 이 값으로 재개설 지름길을 건너뛴다.
   */
  const [isEditingOverride, setIsEditingOverride] = useState(false);
  /**
   * 제출·재개설 성공 직후, 상품은 이미 서버에서 잠겼는데(APPROVED+개설) 설정·개설
   * 쿼리가 리페치되기 전까지는 화면이 그대로 "초안/재개설" 모드로 남는다. 그 사이에
   * 멘토가 한 번 더 저장·재개설을 누르면 서버가 진짜 상태로 막아(409 LOCKED/
   * INVALID_STATE) "다른 곳에서 상태가 바뀌었습니다" 에러가 뜬다 — 사실은 다른 곳이
   * 아니라 방금 이 화면에서 바뀐 건데 화면이 못 따라간 것이다. 리페치를 기다리지
   * 않고 성공 즉시 이 값으로 편집을 잠가 그 틈을 없앤다.
   */
  const [justLocked, setJustLocked] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm(data);
    setOriginal(data);
    setJustLocked(false);
  }, [data]);

  if (!form || !original) {
    return (
      <div className="text-xsmall14 text-neutral-40 px-1 py-10">
        설정을 불러오는 중...
      </div>
    );
  }

  const patch = (partial: Partial<LiveMentoringSettings>) =>
    setForm((prev) => (prev ? { ...prev, ...partial } : prev));

  // 진행시간은 다중 선택이며 0개도 허용한다(단, 0개면 제출 불가).
  const toggleDuration = (duration: LiveMentoringDuration) =>
    setForm((prev) => {
      if (!prev) return prev;
      const durations = prev.durations.includes(duration)
        ? prev.durations.filter((d) => d !== duration)
        : [...prev.durations, duration].sort((a, b) => a - b);
      return { ...prev, durations };
    });

  // 타입은 다중 선택이며 0개도 허용한다(단, 0개면 저장 불가).
  const toggleCategory = (category: LiveMentoringCategory) =>
    setForm((prev) => {
      if (!prev) return prev;
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });

  const status = form.status;
  const currentOpening = openings?.find((opening) => opening.status === 'OPEN');

  /*
   * 편집 가능 조건은 두 갈래다.
   *
   * 1. 초안 — `PUT /settings` 로 제목·타입을 저장한다. 상품이 없으면 이 저장이
   *    상품을 만든다(개설은 상품이 있어야 한다).
   * 2. 승인됐고 활성 개설이 없음 — 종료 후 다시 여는 경우다. 이때 서버는
   *    `PUT /settings` 를 잠그므로(409 LOCKED) 저장이 아니라 `POST /openings` 로
   *    제목·타입·진행시간을 한 번에 보내 즉시 재개설한다(관리자 재승인 불필요).
   *
   * "승인 + 오픈 중"은 잠근다.
   */
  const isDraftLike = status === null || status === 'DRAFT';
  const canReopen = status === 'APPROVED' && !currentOpening;
  /**
   * "수정"을 누르기 전까지는 재개설 가능(승인+오픈종료) 상태를 값만 훑어보는
   * 화면으로 잠가 둔다. 필드가 바로 고쳐지는 지름길(재개설)과, "수정"을 눌러
   * 검토를 다시 걸고(start-edit) 초안처럼 저장→제출하는 경로가 동시에 있으면
   * "여기는 그냥 고쳐지고 저기는 눌러야 고쳐진다"는 혼란이 생긴다 — 상세 페이지
   * 설정과 같은 규칙(잠김 → 수정 클릭 → 편집)으로 통일한다.
   */
  const showReopenShortcut = canReopen && !isEditingOverride;
  // justLocked — 방금 제출·재개설에 성공해 서버는 이미 잠갔지만 쿼리가 아직
  // 그 사실을 모르는 순간을 가린다. 자세한 이유는 justLocked 선언부 참고.
  const canAct = (isDraftLike || canReopen) && !justLocked;
  const canEditFields = (isDraftLike || isEditingOverride) && !justLocked;
  const actingAsDraft = canAct && !showReopenShortcut;

  const noTitleEntered = !form.title || form.title.trim().length === 0;
  const noCategorySelected = form.categories.length === 0;
  const noDurationSelected = form.durations.length === 0;
  /**
   * 상품이 아직 없으면 개설이 404 로 막힌다 — `POST /openings` 는 기존 상품을 찾아
   * 갱신·개설하는 API 다. 저장을 한 번 거쳐 상품을 만들어야 한다.
   */
  const hasNoProduct = form.liveMentoringId === null;

  /*
   * 오픈에 필요한 값. 예약 가능 일정은 여기 들어가지 않는다 — 슬롯이 하나도 없어도
   * 서버가 개설을 허용하므로, 프론트가 임의로 막지 않는다.
   */
  const hasValidOpeningInput =
    !noTitleEntered && !noCategorySelected && !noDurationSelected;

  // 저장(PUT)이 실제로 서버에 반영하는 건 제목·타입뿐이다.
  const isTitleOrCategoryDirty =
    (form.title ?? '') !== (original.title ?? '') ||
    JSON.stringify(form.categories) !== JSON.stringify(original.categories);
  /*
   * "저장" 버튼 활성화는 화면에서 뭔가 하나라도 바뀌었으면 켠다 — 진행시간만 고쳤을 때
   * 버튼이 안 켜지면 "저장이 안 되나?"로 읽힌다. 클릭하면 PUT은 여전히 제목·타입만
   * 보내지만, 성공 시 handleSave 가 현재 폼 값 전체를 새 기준선으로 삼으므로(merged)
   * 진행시간의 미저장 상태도 함께 정리된다.
   */
  const isDirty =
    isTitleOrCategoryDirty ||
    JSON.stringify(form.durations) !== JSON.stringify(original.durations);
  const canSave = !noTitleEntered && !noCategorySelected && isDirty;
  /*
   * 개설은 제목·타입·진행시간을 한 요청에 담으므로 미리 저장할 필요가 없다 —
   * 상품이 아직 없을 때만 저장이 선행돼야 한다.
   */
  const canOpen = hasValidOpeningInput && !hasNoProduct;

  // 대표 경력은 프로필(UserCareer) 도메인 소유라 오픈 설정의 저장 버튼과 무관하게
  // 선택 즉시 전용 API로 저장된다. 따라서 서버 값(`isRepresentative`)이 곧 선택 상태다.
  const representativeCareerId =
    form.careers.find((career) => career.isRepresentative)?.id ?? null;

  /** 대표 경력 지정을 즉시 서버에 반영한다. form/original 을 함께 갱신해 dirty 오인을 막는다. */
  const handleRepresentativeCareerChange = (careerId: number) => {
    const markRepresentative = (settings: LiveMentoringSettings) => ({
      ...settings,
      careers: settings.careers.map((career) => ({
        ...career,
        isRepresentative: career.id === careerId,
      })),
    });

    setRepresentativeCareer(careerId, {
      onSuccess: () => {
        setForm((prev) => (prev ? markRepresentative(prev) : prev));
        setOriginal((prev) => (prev ? markRepresentative(prev) : prev));
      },
      onError: (error) =>
        showAlert({
          title: '대표 경력 지정에 실패했습니다.',
          description: errorDescription(error),
          variant: 'error',
        }),
    });
  };

  const handleMutationError = (title: string) => (error: unknown) => {
    if (isStateConflict(error)) {
      refetch();
      showAlert({
        title: '다른 곳에서 상태가 바뀌었습니다.',
        description: '최신 상태를 다시 불러왔어요. 확인 후 다시 시도해주세요.',
        variant: 'error',
      });
      return;
    }
    showAlert({
      title,
      description: errorDescription(error),
      variant: 'error',
    });
  };

  /**
   * 현재 오픈을 종료한다 — 별도 "오픈 현황" 화면 없이 이 화면 상단 배너에서 바로 한다.
   * 서버는 예약 존재 여부를 검사하지 않고 종료하므로 화면 문구도 그대로 적는다.
   *
   * 종료는 더 이상 슬롯을 지우지 않는다. 슬롯이 챌린지 라이브 피드백과 공유되면서
   * 1대1 오픈을 닫는 행위가 그 멘토의 챌린지 가용시간까지 지우면 안 되기 때문이다.
   */
  const handleCloseCurrentOpening = () => {
    if (!currentOpening) return;
    showConfirm({
      title: '이 오픈을 종료할까요?',
      description:
        '종료하면 공개 리스트에서 즉시 내려갑니다. 진행 중인 예약이 있어도 종료되며, 되돌릴 수 없어요.\n등록한 일정은 그대로 남아요. 다시 열면 지금 일정을 그대로 씁니다.',
      confirmText: '종료하기',
      // 확인 모달은 onConfirm 후에도 닫히지 않는다(공용 훅 동작) — 연타로 두 번 나가지 않게 막는다.
      onConfirm: () =>
        isClosingOpening
          ? undefined
          : closeOpening(currentOpening.openingId, {
              onSuccess: () =>
                showAlert({
                  title: '오픈을 종료했습니다.',
                  description:
                    '공개 리스트에서 즉시 빠집니다. 고친 뒤 다시 오픈할 수 있어요.',
                  variant: 'success',
                }),
              onError: handleMutationError('오픈을 종료하지 못했습니다.'),
            }),
    });
  };

  /** 제목·타입 저장. 상품이 없으면 이 요청이 상품을 초안으로 만든다. */
  const handleSave = () => {
    if (!canSave) return;
    save(
      { title: form.title ?? '', categories: form.categories },
      {
        onSuccess: (saved) => {
          // 응답이 서버의 최신 전체 상태다. 다만 아직 개설하지 않은 진행시간은 서버에
          // 없으므로(빈 배열) 사용자가 골라 둔 값을 덮어쓰지 않는다.
          const merged: LiveMentoringSettings = {
            ...saved,
            durations: form.durations,
          };
          setForm(merged);
          setOriginal(merged);
          showAlert({ title: '저장되었습니다.', variant: 'success' });
        },
        onError: handleMutationError('저장에 실패했습니다.'),
      },
    );
  };

  /**
   * 오픈. 최초 개설과 재개설이 같은 요청이다 — 초안이면 서버가 승인까지 전이시키고,
   * 승인된 상품이면 관리자 재승인 없이 곧바로 새 개설을 만든다.
   */
  const handleOpen = () => {
    setIsOpenConfirmVisible(false);
    openMentoring(
      {
        title: form.title ?? '',
        categories: form.categories,
        durations: form.durations,
      },
      {
        /*
         * 성공 알림 대신 안내 모달을 띄운다. 오픈은 되돌리기 번거로운 행동이라
         * "됐습니다" 한 줄로 끝내지 않고, 확인할 주소와 즉시 내리는 길을 함께 준다.
         */
        onSuccess: (history) => {
          setJustLocked(true);
          const opened = history.openings.find(
            (opening) => opening.status === 'OPEN',
          );
          if (opened) setOpenedOpeningId(opened.openingId);
          else
            showAlert({
              title: '오픈했어요.',
              description:
                '지금부터 공개 리스트에 노출됩니다. 등록해 둔 일정에서 멘티가 예약할 수 있어요.',
              variant: 'success',
            });
        },
        onError: handleMutationError('오픈에 실패했습니다.'),
      },
    );
  };

  /**
   * "수정" — 서버가 상품을 `DRAFT` 로 되돌린다(`start-edit`). 오픈이 이미 닫혀
   * 있을 때만 보이므로 확인 모달 없이 바로 실행한다 — 이후 저장은 dirty 상태일
   * 때만 활성화되고(설정·상세 페이지 공통), 이탈 시 경고가 뜬다.
   * 성공 즉시 `isEditingOverride` 를 켜 재개설 지름길을 걷어내고 초안 모드로
   * 넘긴다 — 설정 쿼리 리페치를 기다리면 그 사이 화면이 그대로라 눌러도
   * 아무 반응이 없는 것처럼 보인다.
   */
  const handleStartEdit = () => {
    if (isStartingEdit) return;
    startEdit(undefined, {
      onSuccess: () => {
        setIsEditingOverride(true);
        showAlert({ ...START_EDIT_SUCCESS_SETTINGS, variant: 'success' });
      },
      onError: handleMutationError('상세 수정 준비에 실패했습니다.'),
    });
  };

  const isPending = isSaving || isOpening || isStartingEdit;

  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          오픈 설정
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          타이틀·타입·진행시간을 설정하고, 멘티가 예약할 수 있는 일정을 등록한
          뒤 오픈하세요. 오픈되면 바로 공개 리스트에 노출됩니다.
        </p>
      </header>

      {/*
        상태 배너 — 오픈 종료됨(승인 + 활성 개설 없음)일 때만 상단에 둔다.
        잠긴 상태에서도 멘토는 "내가 어떤 조건으로 냈는지" 확인해야 하므로 설정을 가리지 않고,
        상태와 다음 행동만 상단에 알린다.

        오픈 중일 때는 이 배너를 하단 플로팅 영역으로 옮긴다(아래) — 오픈 닫기가
        "저장"·"오픈하기"와 같은 종류의 주요 행동이라, 다른 화면 액션들과 같은
        자리(하단 플로팅)에 있는 편이 더 직관적이다.
      */}
      {status === 'APPROVED' && !currentOpening && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-700">
              오픈 종료됨
            </span>
            <p className="text-xs text-gray-600">
              지금은 공개 리스트에 노출되지 않아요. 등록해 둔 일정은 그대로 남아
              있으니, "다시 오픈하기"를 누르면 그 일정으로 바로 열려요.
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* 좌: 설정 패널 */}
          <div className="flex flex-col gap-6">
            {/* 잠긴 상태에서는 입력만 잠근다 — fieldset 이 자손 폼 컨트롤을 한 번에
                비활성화하고 키보드 포커스에서도 빼준다(pointer-events-none 은 마우스만
                막는다). 설정 패널 전체가 아니라 설정 필드만 감싸도록 두 덩이로 나눠 둔
                이유는 사이의 "멘토링 일정" 섹션에 적어 두었다. */}
            <fieldset
              disabled={!canEditFields}
              className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0"
            >
              <section className={cardClass}>
                <h2 className={sectionTitleClass}>프로필</h2>
                <p className="mb-4 text-xs text-gray-500">
                  닉네임·프로필 이미지·한줄 소개·경력은 프로필 페이지에서
                  관리해요. 이 화면에서는 조회만 됩니다.
                </p>
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                    {form.profileImage ? (
                      <img
                        src={form.profileImage}
                        alt="프로필 이미지"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">이미지</span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {form.nickname || '닉네임 없음'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {form.introduction || '한줄 소개가 없습니다.'}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="text-primary mt-3 inline-block text-xs font-medium underline"
                >
                  프로필 페이지에서 수정하기
                </Link>
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>1대1 멘토링 타이틀</h2>
                <p className="mb-3 text-xs text-gray-500">
                  공개 리스트·상세 페이지에 노출될 상품명이에요.
                </p>
                <input
                  type="text"
                  aria-label="1대1 멘토링 타이틀"
                  value={form.title ?? ''}
                  onChange={(e) => patch({ title: e.target.value })}
                  placeholder="예) 자소서 실전 첨삭 멘토링"
                  className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors"
                />
                {noTitleEntered && (
                  <p role="alert" className="text-system-error mt-2 text-xs">
                    타이틀을 입력해야 저장할 수 있어요.
                  </p>
                )}
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>대표 경력 지정</h2>
                <p className="mb-3 text-xs text-gray-500">
                  공개 리스트 멘토 카드에 노출할 대표 경력을 하나만 선택하세요.
                  선택하면 바로 저장돼요.
                </p>
                {form.careers.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    등록된 경력이 없습니다.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {representativeCareerId === null && (
                      <li>
                        <p
                          role="alert"
                          className="text-system-error mb-1 text-xs"
                        >
                          대표 경력을 지정하지 않으면 공개 카드에 경력이
                          노출되지 않아요.
                        </p>
                      </li>
                    )}
                    {form.careers.map((career) => (
                      <li key={career.id}>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="representative-career"
                            checked={representativeCareerId === career.id}
                            disabled={isSettingRepresentativeCareer}
                            onChange={() =>
                              handleRepresentativeCareerChange(career.id)
                            }
                            className="accent-primary h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">
                            {representativeCareerLabel(career)}
                            {career.startDate && (
                              <span className="text-gray-400">
                                {' '}
                                (
                                {formatCareerPeriod(
                                  career.startDate,
                                  career.endDate,
                                )}
                                )
                              </span>
                            )}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </fieldset>

            {/* 멘토링 일정 — 잠금 fieldset 밖에 둔다. 슬롯 편집은 타이틀·타입 같은 설정
                필드가 아니라 별도 편집 화면을 여는 내비게이션이라, 오픈 중에도 열려야
                한다. 안에 두면 조상 fieldset 이 이 버튼까지 비활성화해서, 슬롯을 하나
                더 열려면 등록한 일정을 전부 버리는 "오픈 닫기" 밖에 길이 없어진다. */}
            <section className={cardClass}>
              <h2 className={sectionTitleClass}>멘토링 일정</h2>
              <p className="mb-3 text-xs text-gray-500">
                멘티가 예약할 수 있는 30분 단위 시간을 직접 골라 등록해요.
                라이브 피드백과 같은 일정 그리드를 쓰며, 이미 라이브 피드백으로
                열어 둔 시간은 선택할 수 없습니다.
              </p>
              <button
                type="button"
                onClick={() => setSlotModalOpen(true)}
                className="border-primary text-primary rounded-lg border px-4 py-2.5 text-sm font-medium"
              >
                일정 등록하기
              </button>
            </section>

            <fieldset
              disabled={!canEditFields}
              className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0"
            >
              <section className={cardClass}>
                <h2 className={sectionTitleClass}>진행시간 (다중 선택)</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    {LIVE_MENTORING_DURATIONS.map((duration) => {
                      const active = form.durations.includes(duration);
                      return (
                        <button
                          key={duration}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleDuration(duration)}
                          className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${active ? 'border-primary bg-primary-5 text-primary' : 'border-gray-200 text-gray-600'}`}
                        >
                          {duration}분
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-600">
                    가격{' '}
                    <span className="text-primary font-semibold">
                      {formatPrice(getLowestPrice(form.durations))}
                    </span>{' '}
                    <span className="text-xs text-gray-400">
                      (가격은 서버 고정값이며 여러 개 선택 시 최저가로 노출)
                    </span>
                  </p>
                  {noDurationSelected && (
                    <p role="alert" className="text-system-error text-xs">
                      진행시간을 최소 1개 이상 선택해야 오픈할 수 있어요.
                    </p>
                  )}
                </div>
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>타입 (다중 선택)</h2>
                <div className="flex flex-wrap gap-2">
                  {LIVE_MENTORING_CATEGORIES.map((category) => {
                    const active = form.categories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleCategory(category)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${active ? 'border-primary bg-primary-5 text-primary' : 'border-gray-200 text-gray-600'}`}
                      >
                        {CATEGORY_LABELS[category]}
                      </button>
                    );
                  })}
                </div>
                {noCategorySelected && (
                  <p role="alert" className="text-system-error mt-3 text-xs">
                    타입을 최소 1개 이상 선택해야 저장할 수 있어요.
                  </p>
                )}
              </section>
            </fieldset>
          </div>

          {/* 우: 미리보기 */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <OpenSettingsPreview settings={form} />
          </div>
        </div>
      </div>

      {/*
        오픈 중 상태 — 하단 플로팅. 다른 화면 액션(저장·오픈하기 등)과 같은 자리에 둬서
        "지금 취할 수 있는 주요 행동"이 항상 같은 위치에 있게 한다.
      */}
      {currentOpening && (
        // 사이드바(296px)와 우측 미리보기 컬럼(360px + gap-6)을 뺀 콘텐츠 영역
        // 기준으로 폭을 맞춘다 — 그냥 right-0 이면 미리보기 위로 넘어가 버린다.
        <div className="fixed bottom-6 left-0 right-0 z-50 px-4 md:px-8 lg:left-[296px] lg:pr-[416px]">
          <div
            role="status"
            className="shadow-05 flex items-center justify-between gap-3 rounded-xl bg-gray-900/80 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-white"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">오픈 중</p>
                <p className="truncate text-xs text-gray-300">
                  공개 리스트에 노출 중이에요. 설정을 수정할 수 없어요.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseCurrentOpening}
              disabled={isClosingOpening}
              className="bg-system-error shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isClosingOpening ? '처리 중...' : '오픈 닫기'}
            </button>
          </div>
        </div>
      )}

      {/*
        하단 버튼. 오픈은 상태와 무관하게 `POST /openings` 하나로 끝나므로 버튼도 하나다.
        저장(`PUT /settings`)은 초안일 때만 남는다 — 승인 이후에는 서버가 잠그고(409
        LOCKED), 제목·타입은 오픈 요청이 함께 보내므로 따로 저장할 이유도 없다.
      */}
      {canAct && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
          {actingAsDraft && hasNoProduct && (
            <p className="rounded-md bg-gray-900/80 px-3 py-1 text-xs text-white">
              먼저 저장해 상품을 만들어야 오픈할 수 있어요.
            </p>
          )}
          <div className="flex gap-2">
            {/*
             * 초안일 때만 저장을 붙인다. 승인된 상품을 고치려면 "수정"(start-edit)으로
             * 초안으로 되돌린 뒤여야 한다 — 상세 페이지 설정과 같은 규칙이다.
             */}
            {actingAsDraft ? (
              /* 저장할 변경사항이 있을 때만 파란색으로 바뀐다 — 눌러야 할 버튼이 색으로 드러난다. */
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending || !canSave}
                className={
                  canSave
                    ? 'bg-primary hover:bg-primary-hover rounded-lg px-8 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50'
                    : 'rounded-lg border border-gray-300 bg-white px-8 py-2.5 text-sm font-medium text-gray-700 shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50'
                }
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartEdit}
                disabled={isPending}
                className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStartingEdit ? '처리 중...' : '수정'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpenConfirmVisible(true)}
              disabled={isPending || !canOpen}
              className="bg-primary hover:bg-primary-hover rounded-lg px-8 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOpening
                ? '오픈하는 중...'
                : showReopenShortcut
                  ? '다시 오픈하기'
                  : '오픈하기'}
            </button>
          </div>
        </div>
      )}

      <LiveMentoringSlotModal
        isOpen={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
      />
      {user?.userId != null && (
        <PreOpenCheckModal
          isOpen={isOpenConfirmVisible}
          publicUrl={publicDetailUrl(user.userId)}
          confirmLabel="오픈하기"
          resultDescription="상세 페이지에 노출되는 내용에 대한 책임은 멘토 본인에게 있음에 동의합니다. 확인을 마치면 바로 공개 리스트에 노출되며, 이상이 있으면 언제든 오픈을 닫을 수 있어요."
          /*
           * 제목·타입·진행시간은 이 요청과 함께 저장되므로, 지금 열리는 페이지에는 아직
           * 반영돼 있지 않다. 무엇을 보고 확인하라는 건지 짚어주지 않으면
           * "바꾼 게 안 보인다"로 읽힌다.
           */
          pendingNotice={
            isDirty
              ? '방금 바꾼 제목·타입·진행시간은 오픈할 때 함께 저장돼요. 지금 열리는 페이지에서는 상세 페이지 내용을 확인해주세요.'
              : undefined
          }
          isPending={isPending}
          onCancel={() => setIsOpenConfirmVisible(false)}
          onConfirm={handleOpen}
        />
      )}

      {user?.userId != null && (
        <OpenedNoticeModal
          isOpen={openedOpeningId !== null}
          publicUrl={publicDetailUrl(user.userId)}
          isClosing={isClosingOpening}
          onDismiss={() => setOpenedOpeningId(null)}
          onCloseOpening={() => {
            if (openedOpeningId === null) return;
            closeOpening(openedOpeningId, {
              onSuccess: () => {
                setOpenedOpeningId(null);
                showAlert({
                  title: '오픈을 종료했습니다.',
                  description:
                    '공개 리스트에서 즉시 빠집니다. 고친 뒤 다시 오픈할 수 있어요.',
                  variant: 'success',
                });
              },
              onError: handleMutationError('오픈을 종료하지 못했습니다.'),
            });
          }}
        />
      )}

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default OpenSettingsPage;
