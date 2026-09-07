import { useState, type ReactNode } from 'react';

import {
  useCloseLiveMentoringOpeningMutation,
  useCreateLiveMentoringOpeningMutation,
  useLiveMentoringOpenStatusQuery,
  useLiveMentoringSettingsQuery,
} from '@/api/live-mentoring/liveMentoring';
import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
} from '@/api/live-mentoring/liveMentoringSchema';
import { useUserQuery } from '@/api/user/user';
import type { useMentorAlert } from '@/hooks/useMentorAlert';
import { publicDetailUrl } from '../constants';
import OpenedNoticeModal from './ui/OpenedNoticeModal';
import PreOpenCheckModal from './ui/PreOpenCheckModal';

/**
 * 저장·제출 실패 사유를 사용자에게 그대로 보여준다.
 *
 * 공용 axios 인터셉터(`@letscareer/api`)가 서버 에러를 `ApiError` 로 재포장하면서
 * `code`/`message`/`status` 를 **최상위 속성**으로 올린다(`error.response` 는 남지 않는다).
 * 이걸 감추고 "실패했습니다"만 띄우면 멘토도 개발자도 원인을 알 수 없다 —
 * 수정 잠금(`LIVE_MENTORING_LOCKED`)인지, 상태 전이 불가(`LIVE_MENTORING_INVALID_STATE`)인지,
 * 미지원 진행시간(`INVALID_LIVE_MENTORING_DURATION`)인지가 갈린다.
 */
export const errorDescription = (error: unknown): string | undefined => {
  const apiError = error as { code?: string; message?: string } | null;
  if (!apiError?.message) return undefined;
  return apiError.code
    ? `${apiError.message} (${apiError.code})`
    : apiError.message;
};

/**
 * 서버가 상태를 이유로 거절한 경우의 안내 문구.
 *
 * 두 코드를 한데 묶어 "다른 곳에서 상태가 바뀌었습니다"로 보여주면 안 된다.
 * `LOCKED` 는 **개설이 열려 있어 설정을 못 고치는 것**이라 다른 곳에서 바뀐 게 아니고,
 * 멘토가 할 일도 "다시 시도"가 아니라 "오픈 종료"다. 실제로 이 문구 때문에
 * 다른 창을 의심하며 새로고침만 반복한 사례가 있었다.
 */
export const stateConflictAlert = (error: unknown) => {
  const code = (error as { code?: string } | null)?.code;
  if (code === 'LIVE_MENTORING_LOCKED') {
    return {
      title: '오픈 중에는 설정을 수정할 수 없습니다.',
      description:
        '상단에서 현재 오픈을 종료한 뒤 수정해주세요. 최신 상태를 다시 불러왔어요.',
    };
  }
  if (code === 'LIVE_MENTORING_INVALID_STATE') {
    return {
      title: '다른 곳에서 상태가 바뀌었습니다.',
      description: '최신 상태를 다시 불러왔어요. 확인 후 다시 시도해주세요.',
    };
  }
  return null;
};

/** 오픈 요청에 담을 값. 값의 출처는 스텝마다 다르다 — 아래 훅 주석 참고. */
export interface OpenActionInput {
  title: string;
  categories: LiveMentoringCategory[];
  durations: LiveMentoringDuration[];
  /**
   * 상품이 이미 있는지. 없으면 개설이 404 로 막힌다 — `POST /openings` 는 기존 상품을
   * 찾아 갱신·개설하는 API 라, 저장을 한 번 거쳐 상품을 만들어야 한다.
   */
  hasProduct: boolean;
}

export interface LiveMentoringOpenAction {
  label: string;
  /** 오픈 닫기만 위험 색을 쓴다. 되돌리기 번거로운 행동이라 색으로 구분한다. */
  tone: 'primary' | 'danger';
  disabled: boolean;
  onClick: () => void;
  /** 확인·안내 모달. 훅을 쓰는 화면이 그대로 렌더한다. */
  modals: ReactNode;
  /** 이 훅이 띄운 모달이 열려 있는지. 하단 바를 잠시 숨길 때 쓴다. */
  isModalOpen: boolean;
  /** 지금 열려 있는 개설. 없으면 닫힌 상태다. */
  currentOpening: { openingId: number } | undefined;
  /** 이전에 열었다가 닫힌 적이 있으면 라벨이 "다시 오픈하기" 가 된다. */
  hasPreviousOpening: boolean;
}

/**
 * 오픈/오픈 닫기 액션 — 하단 바가 어느 스텝에 있든 같은 버튼을 그리게 하는 훅(LC-3273).
 *
 * 오픈 설정과 상세 페이지 설정이 한 화면으로 합쳐지면서(LC-3264) 하단 바도 하나가 됐다.
 * 그런데 오픈 액션은 오픈 설정 본문 안에 상태·모달과 함께 묶여 있어서 다른 스텝에서는
 * 쓸 수 없었다. 그 덩어리를 여기로 옮긴다.
 *
 * `input` 의 출처는 스텝마다 다르다.
 * - 오픈 설정 스텝: 편집 중인 폼. 오픈 요청이 제목·타입·진행시간을 함께 저장하므로
 *   미리 저장하지 않아도 지금 화면의 값이 그대로 나간다
 * - 그 밖의 스텝: 서버가 내려준 설정. 오픈 설정 본문은 마운트돼 있지 않아 편집 중인
 *   값이라는 게 없다
 *
 * 스텝이 바뀌면 둘 중 하나만 마운트되므로 이 훅도 화면에 하나만 산다. 모달이 두 벌
 * 뜨는 일은 없다.
 */
export const useLiveMentoringOpenAction = ({
  input,
  alert,
  pendingNotice,
}: {
  /** null 이면 아직 설정을 못 받은 것이다 — 버튼은 비활성으로 그린다. */
  input: OpenActionInput | null;
  alert: Pick<ReturnType<typeof useMentorAlert>, 'showAlert' | 'showConfirm'>;
  /** 오픈 전 확인 모달에 덧붙일 안내. 미저장 변경이 있을 때만 넘긴다. */
  pendingNotice?: string;
}): LiveMentoringOpenAction => {
  const { refetch } = useLiveMentoringSettingsQuery();
  // 승인 상태에서 "지금 열려 있는지"는 설정 응답이 알려주지 않는다 — 개설 이력으로 판단한다.
  const { data: openings } = useLiveMentoringOpenStatusQuery();
  // 공개 상세는 mentorId 로 열린다(웹 라우트 `/live-mentoring/[mentorId]`).
  const { data: user } = useUserQuery();
  const { mutate: openMentoring, isPending: isOpening } =
    useCreateLiveMentoringOpeningMutation();
  const { mutate: closeOpening, isPending: isClosingOpening } =
    useCloseLiveMentoringOpeningMutation();

  /**
   * 오픈 전 확인 모달 노출 여부.
   *
   * 검토 제출이 사라지고 최초 개설·재개설이 `POST /openings` 하나로 합쳐지면서
   * 어느 쪽을 실행할지 들고 있을 이유도 없어졌다.
   */
  const [isOpenConfirmVisible, setIsOpenConfirmVisible] = useState(false);
  /** 오픈 직후 안내 모달이 종료 대상으로 삼을 개설. null 이면 모달을 닫는다. */
  const [openedOpeningId, setOpenedOpeningId] = useState<number | null>(null);

  const currentOpening = openings?.find((opening) => opening.status === 'OPEN');
  const hasPreviousOpening = (openings?.length ?? 0) > 0;

  const handleMutationError = (title: string) => (error: unknown) => {
    const conflict = stateConflictAlert(error);
    if (conflict) {
      refetch();
      alert.showAlert({ ...conflict, variant: 'error' });
      return;
    }
    alert.showAlert({
      title,
      description: errorDescription(error),
      variant: 'error',
    });
  };

  /**
   * 현재 오픈을 종료한다.
   *
   * 서버는 예약 존재 여부를 검사하지 않고 종료하므로 화면 문구도 그대로 적는다.
   * 종료는 슬롯을 지우지 않는다 — 슬롯이 챌린지 라이브 피드백과 공유되면서, 1대1 오픈을
   * 닫는 행위가 그 멘토의 챌린지 가용시간까지 지우면 안 되기 때문이다.
   */
  const handleClose = () => {
    if (!currentOpening) return;
    alert.showConfirm({
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
                alert.showAlert({
                  title: '오픈을 종료했습니다.',
                  description:
                    '공개 리스트에서 즉시 빠집니다. 고친 뒤 다시 오픈할 수 있어요.',
                  variant: 'success',
                }),
              onError: handleMutationError('오픈을 종료하지 못했습니다.'),
            }),
    });
  };

  /** 오픈. 최초 개설과 재개설이 같은 요청이다. */
  const handleOpen = () => {
    if (!input) return;
    setIsOpenConfirmVisible(false);
    openMentoring(
      {
        title: input.title,
        categories: input.categories,
        durations: input.durations,
      },
      {
        /*
         * 성공 알림 대신 안내 모달을 띄운다. 오픈은 되돌리기 번거로운 행동이라
         * "됐습니다" 한 줄로 끝내지 않고, 확인할 주소와 즉시 내리는 길을 함께 준다.
         */
        onSuccess: (history) => {
          const opened = history.openings.find(
            (opening) => opening.status === 'OPEN',
          );
          if (opened) setOpenedOpeningId(opened.openingId);
          else
            alert.showAlert({
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

  /*
   * 예약 가능 일정은 오픈 조건이 아니다 — 슬롯이 하나도 없어도 서버가 개설을 허용하므로
   * 프론트가 임의로 막지 않는다.
   */
  const canOpen =
    input !== null &&
    input.title.trim().length > 0 &&
    input.categories.length > 0 &&
    input.durations.length > 0 &&
    input.hasProduct &&
    !currentOpening;

  const modals = (
    <>
      {user?.userId != null && (
        <PreOpenCheckModal
          isOpen={isOpenConfirmVisible}
          publicUrl={publicDetailUrl(user.userId)}
          confirmLabel="오픈하기"
          resultDescription="상세 페이지에 노출되는 내용에 대한 책임은 멘토 본인에게 있음에 동의합니다. 확인을 마치면 바로 공개 리스트에 노출되며, 이상이 있으면 언제든 오픈을 닫을 수 있어요."
          pendingNotice={pendingNotice}
          isPending={isOpening}
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
                alert.showAlert({
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
    </>
  );

  if (currentOpening) {
    return {
      label: isClosingOpening ? '처리 중...' : '오픈 닫기',
      tone: 'danger',
      disabled: isClosingOpening,
      onClick: handleClose,
      modals,
      isModalOpen: openedOpeningId !== null,
      currentOpening,
      hasPreviousOpening,
    };
  }

  return {
    label: isOpening
      ? '오픈하는 중...'
      : hasPreviousOpening
        ? '다시 오픈하기'
        : '오픈하기',
    tone: 'primary',
    disabled: isOpening || !canOpen,
    onClick: () => setIsOpenConfirmVisible(true),
    modals,
    isModalOpen: isOpenConfirmVisible || openedOpeningId !== null,
    currentOpening: undefined,
    hasPreviousOpening,
  };
};
