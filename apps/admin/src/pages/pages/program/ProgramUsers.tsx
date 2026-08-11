import {
  useAdminRefundedApplicationIds,
  useAdminRefundMutation,
} from '@/api/adminRefund';
import BottomAction from '@/domain/admin/program/program-user/bottom-action/BottomAction';
import RefundModal, {
  RefundMode,
  RefundTarget,
} from '@/domain/admin/program/program-user/ui/RefundModal';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import UserTableBody from '@/domain/admin/program/program-user/table-content/TableBody';
import TableHead, {
  UserTableHeadProps,
} from '@/domain/admin/program/program-user/table-content/TableHead';
import Table from '@/domain/admin/ui/table/regacy/Table';
import {
  dedupeChallengeApplications,
  dedupeFlatApplications,
} from '@/domain/admin/program/program-user/utils/dedupeApplications';
import {
  adminMentorInfoSchema,
  ChallengeApplication,
  challengeApplicationsSchema,
  GuidebookApplication,
  guidebookApplicationsSchema,
  LiveApplication,
  liveApplicationsSchema,
  ProgramTypeEnum,
  ProgramTypeUpperCase,
  VodApplication,
  vodApplicationsSchema,
} from '@/schema';
import axios from '@/utils/axios';
import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

const { CHALLENGE, LIVE, VOD, GUIDEBOOK } = ProgramTypeEnum.enum;

// 클립보드로 공유되는 절대 URL이므로 메인 web 도메인을 사용한다.
// 미설정 시 admin 자기 자신의 origin 으로 fallback (개발 환경 안전장치).
const WEB_URL =
  import.meta.env.VITE_WEB_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '');

/**
 * 이용 히스토리가 `#application-{id}` 로 특정 신청서를 지목해 보낸다(LC-3201).
 *
 * 숫자만 받는다. 아무 문자열이나 그대로 셀렉터에 넣으면 의도치 않은 요소를 잡는다.
 */
const readTargetApplicationId = (hash: string): string | null =>
  /^#application-(\d+)$/.exec(hash)?.[1] ?? null;

/**
 * 강조는 잠깐만 남긴다.
 *
 * 계속 칠해 두면 그 행이 특별한 상태(환불 대상 등)인 줄 오해한다. 이 표에서 색은
 * 곧 판단의 근거가 되므로, 지목해서 데려왔다는 뜻 이상으로 읽히면 안 된다.
 */
const HIGHLIGHT_DURATION_MS = 3000;
const HIGHLIGHT_CLASS = 'bg-amber-100';

const ProgramUsers = () => {
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const params = useParams<{ programId: string }>();
  const programId = Number(params.programId);

  const [filter, setFilter] = useState<UserTableHeadProps['filter']>({
    name: null,
    isFeeConfirmed: null,
  });

  const programType = searchParams.get('programType') ?? CHALLENGE;

  const { data: challengeApplications = [] } = useQuery({
    enabled: programType === CHALLENGE,
    queryKey: ['challenge', programId, 'applications'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${programId}/applications`);
      const list = dedupeChallengeApplications(
        challengeApplicationsSchema.parse(res.data.data).applicationList,
      );
      list.sort((a, b) => {
        return a.application.isCanceled === b.application.isCanceled
          ? 0
          : a.application.isCanceled
            ? -1
            : 1;
      });
      return list;
    },
  });

  const { data: liveApplications = [] } = useQuery({
    enabled: programType === LIVE,
    queryKey: ['live', programId, 'applications'],
    queryFn: async () => {
      const res = await axios.get(`/live/${programId}/applications`);
      const list = dedupeFlatApplications(
        liveApplicationsSchema.parse(res.data.data).applicationList,
      );
      list.sort((a, b) => {
        return a.isCanceled === b.isCanceled ? 0 : a.isCanceled ? -1 : 1;
      });
      return list;
    },
  });

  const { data: guidebookApplications = [] } = useQuery({
    enabled: programType === GUIDEBOOK,
    queryKey: ['guidebook', programId, 'applications'],
    queryFn: async () => {
      const res = await axios.get(`/guidebook/${programId}/applications`);
      const list = dedupeFlatApplications(
        guidebookApplicationsSchema.parse(res.data.data).applicationList,
      );
      list.sort((a, b) => {
        return a.isCanceled === b.isCanceled ? 0 : a.isCanceled ? -1 : 1;
      });
      return list;
    },
  });

  const { data: vodApplications = [] } = useQuery({
    enabled: programType === VOD,
    queryKey: ['vod', programId, 'applications'],
    queryFn: async () => {
      const res = await axios.get(`/vod/${programId}/applications`);
      const list = dedupeFlatApplications(
        vodApplicationsSchema.parse(res.data.data).applicationList,
      );
      list.sort((a, b) => {
        return a.isCanceled === b.isCanceled ? 0 : a.isCanceled ? -1 : 1;
      });
      return list;
    },
  });

  const applicationList = useMemo<
    (
      | ChallengeApplication
      | LiveApplication
      | GuidebookApplication
      | VodApplication
    )[]
  >(() => {
    if (programType === CHALLENGE) {
      return challengeApplications;
    }
    if (programType === LIVE) {
      return liveApplications;
    }
    if (programType === GUIDEBOOK) {
      return guidebookApplications;
    }
    if (programType === VOD) {
      return vodApplications;
    }
    return [];
  }, [
    challengeApplications,
    guidebookApplications,
    liveApplications,
    vodApplications,
    programType,
  ]);

  const filteredApplicationList = useMemo(() => {
    const result = applicationList;

    const compareChallengeAppName = (
      a: ChallengeApplication,
      b: ChallengeApplication,
    ) =>
      filter.name === 'ASCENDING'
        ? (a.application.name ?? '') >= (b.application.name ?? '')
          ? 1
          : -1
        : filter.name === 'DESCENDING'
          ? (a.application.name ?? '') <= (b.application.name ?? '')
            ? 1
            : -1
          : 0;
    const compareAppName = (a: LiveApplication, b: LiveApplication) =>
      filter.name === 'ASCENDING'
        ? (a.name ?? '') >= (b.name ?? '')
          ? 1
          : -1
        : filter.name === 'DESCENDING'
          ? (a.name ?? '') <= (b.name ?? '')
            ? 1
            : -1
          : 0;

    if (filter.name) {
      if (programType === CHALLENGE) {
        (result as ChallengeApplication[]).sort(compareChallengeAppName);
      } else {
        (result as LiveApplication[]).sort(compareAppName);
      }
    }

    if (!filter.isFeeConfirmed) return result;

    if (programType === CHALLENGE) {
      return (result as ChallengeApplication[]).filter(
        (item) => item.application.isCanceled === filter.isFeeConfirmed,
      );
    }

    return (result as LiveApplication[]).filter(
      (application) => application.isCanceled === filter.isFeeConfirmed,
    );
  }, [applicationList, filter.isFeeConfirmed, filter.name, programType]);

  const filteredApplications =
    programType === CHALLENGE
      ? (filteredApplicationList as ChallengeApplication[]).map(
          (item) => item.application,
        )
      : (filteredApplicationList as (
          | LiveApplication
          | GuidebookApplication
          | VodApplication
        )[]);

  /*
    이용 히스토리에서 지목받은 행으로 데려간다.

    앵커만 달아 두면 동작하지 않는다. 목록이 비동기로 오므로 화면에 들어오는 시점에는
    그 행의 DOM 이 아직 없고, 브라우저는 찾을 자리가 없어 그냥 맨 위에 머문다.
    데이터가 도착한 뒤에 직접 옮겨야 한다.

    `있는가`로만 판단한다. 목록 참조가 바뀔 때마다 다시 스크롤하면 운영이 아래쪽을
    보던 중에 재조회가 화면을 끌어올린다.
  */
  const targetApplicationId = readTargetApplicationId(hash);
  const hasApplications = filteredApplicationList.length > 0;

  useEffect(() => {
    if (!targetApplicationId || !hasApplications) return;

    const row = document.getElementById(`application-${targetApplicationId}`);
    // 다른 프로그램의 신청서를 가리키는 해시일 수 있다. 없으면 조용히 넘어간다.
    if (!row) return;

    row.scrollIntoView({ block: 'center' });

    /*
      강조를 상태로 들지 않고 클래스만 얹는다. 상태로 하면 TableBody·TableRow 까지
      플래그를 내려야 하는데, 그 둘은 환불 버튼을 그리는 자리다. 표시용 색 하나 때문에
      환불 경로의 컴포넌트를 건드릴 이유가 없다.
    */
    row.classList.add(HIGHLIGHT_CLASS);
    const release = () => row.classList.remove(HIGHLIGHT_CLASS);
    const timer = window.setTimeout(release, HIGHLIGHT_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
      release();
    };
  }, [targetApplicationId, hasApplications]);

  const { data: programTitleData } = useQuery({
    queryKey: [programType.toLowerCase(), programId, 'title'],
    queryFn: async () => {
      const res = await axios.get(
        `/${programType.toLowerCase()}/${programId}/title`,
      );

      return res.data;
    },
  });

  const { data: mentorInfo = {} } = useQuery({
    enabled: programType === 'LIVE' && !!programId,
    queryKey: [programType.toLowerCase(), programId, 'mentorPassword'],
    queryFn: async () => {
      const res = await axios.get(`/live/${programId}/mentor`);
      return adminMentorInfoSchema.parse(res.data.data);
    },
  });

  const programTitle = programTitleData?.data?.title;

  const { snackbar } = useAdminSnackbar();
  // 대상과 모드를 함께 담는다. 모드가 따로 있으면 모달이 닫힐 때 둘의 초기화 시점이
  // 갈려 직전 모드로 잠깐 그려진다.
  const [refundRequest, setRefundRequest] = useState<{
    target: RefundTarget;
    mode: RefundMode;
  } | null>(null);

  // 어드민 환불 건만 따로 받아 라벨을 구분한다. 신청자 API 에 필드를 추가하는 대신
  // 이 조회로 매칭하면 프로그램 타입 네 개의 응답을 건드리지 않아도 된다.
  const adminRefundedIds = useAdminRefundedApplicationIds(programId);

  const refundMutation = useAdminRefundMutation({
    onSuccess: (refundedAmount) => {
      setRefundRequest(null);
      snackbar(`${refundedAmount.toLocaleString()}원이 환불되었습니다.`);
    },
    // 서버 메시지를 그대로 보여준다. 뭉개면 운영이 다음 행동을 정할 수 없다.
    onError: (message) => snackbar(message),
  });

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-1.5-bold">참여자 보기 - {programTitle}</h1>
        {programType === LIVE && (
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `${WEB_URL}/live/${programId}/mentor/notification/before?code=${mentorInfo?.mentorPassword}`,
                  )
                  .then(() => {
                    alert('링크가 클립보드에 복사되었습니다.');
                  })
                  .catch(() => {
                    alert('복사에 실패했습니다');
                  });
              }}
            >
              클래스 전 안내사항
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `${WEB_URL}/live/${programId}/mentor/notification/after?code=${mentorInfo?.mentorPassword}`,
                  )
                  .then(() => alert('링크가 클립보드에 복사되었습니다.'))
                  .catch(() => alert('복사에 실패했습니다'));
              }}
            >
              클래스 후 안내사항
            </Button>
          </div>
        )}
      </div>

      <main className="mb-20">
        <Table minWidth={programType === LIVE ? 2000 : 1000}>
          <TableHead
            filter={filter}
            setFilter={setFilter}
            programType={programType as ProgramTypeUpperCase}
          />
          <UserTableBody
            applications={filteredApplicationList}
            programType={programType as ProgramTypeUpperCase}
            programTitle={programTitle ?? ''}
            adminRefundedIds={adminRefundedIds}
            onRefundClick={(target, mode) => setRefundRequest({ target, mode })}
          />
        </Table>
      </main>

      <BottomAction
        applications={filteredApplications}
        programType={programType}
        programTitle={programTitle}
      />

      {refundRequest && (
        <RefundModal
          target={refundRequest.target}
          mode={refundRequest.mode}
          isSubmitting={refundMutation.isPending}
          onSubmit={(body) =>
            refundMutation.mutate({
              applicationId: refundRequest.target.applicationId,
              body,
            })
          }
          onClose={() => setRefundRequest(null)}
        />
      )}
    </div>
  );
};

export default ProgramUsers;
