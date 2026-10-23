import { useGetChallengeRoundAttendances } from '@/api/challenge/challenge';
import {
  useAdminCurrentChallenge,
  useAdminMissionsOfCurrentChallenge,
} from '@/context/CurrentAdminChallengeProvider';
import ChallengeSubmitDetail from '@/domain/admin/challenge/submit-check/table/table-body/ChallengeSubmitDetail';
import LineTableBody from '@/domain/admin/challenge/ui/lineTable/LineTableBody';
import LineTableBodyRow, {
  ItemWithStatus,
} from '@/domain/admin/challenge/ui/lineTable/LineTableBodyRow';
import LineTableHead from '@/domain/admin/challenge/ui/lineTable/LineTableHead';
import MissionVersionTabs from '@/domain/admin/challenge/version/MissionVersionTabs';
import {
  formatMissionVersions,
  formatRoundAttendance,
  groupMissionsByRound,
  isMissionForVersion,
} from '@/domain/admin/challenge/version/utils/missionVersion';
import { AttendanceItem, Mission } from '@/schema';
import { TABLE_CONTENT } from '@/utils/convert';
import React, { useMemo, useState } from 'react';

type Row = Mission &
  ItemWithStatus & {
    roundLabel: string; // 회차
    currentAttendance: string; // 제출현황: n(제출)/m(전체), 버전 미션은 버전명을 함께
    /** 같은 회차의 버전 미션은 한 행으로 묶는다 */
    roundMissions: Mission[];
  };

const cellWidthList = [
  'w-[140px]',
  'w-[30%]',
  'w-[300px]',
  'w-[300px]',
  'w-[20%]',
  'w-[15%]',
];
const colNames = ['회차', '미션명', '공개일', '마감일', '제출현황', '확인여부'];

const ChallengeOperationAttendances = () => {
  const { currentChallenge } = useAdminCurrentChallenge();
  const missions = useAdminMissionsOfCurrentChallenge();
  // 펼친 행의 미션들. 같은 회차 버전 미션은 한 행이라 여럿일 수 있다
  const [detailedRound, setDetailedRound] = useState<Mission[] | null>(null);
  // null 은 전체. 버전 탭은 그 버전 참여자가 받는 미션만 보여준다
  const [versionId, setVersionId] = useState<number | null>(null);

  const { byMission, refetch } = useGetChallengeRoundAttendances({
    challengeId: currentChallenge?.id,
    missionIds: detailedRound?.map((mission) => mission.id) ?? [],
  });

  // 묶인 미션들의 제출자를 미션 순서대로 한 목록에. 행마다 자기 미션을 찾을 수 있게 둔다
  const { detailedAttendances, missionByAttendanceId } = useMemo(() => {
    const missionById = new Map(
      (detailedRound ?? []).map((mission) => [mission.id, mission]),
    );
    const missionOfAttendance = new Map<number, Mission>();
    const list: AttendanceItem[] = byMission.flatMap(
      ({ missionId, attendances }) => {
        const mission = missionById.get(missionId);
        if (!mission) return [];
        attendances.forEach((item) =>
          missionOfAttendance.set(item.attendance.id, mission),
        );
        return attendances;
      },
    );
    return {
      detailedAttendances: list,
      missionByAttendanceId: missionOfAttendance,
    };
  }, [byMission, detailedRound]);

  const rows = useMemo(() => {
    return groupMissionsByRound(
      missions?.filter((mission) => isMissionForVersion(mission, versionId)) ??
        [],
    ).map((roundMissions) => {
      const waitingCounts = roundMissions
        .map((mission) => mission.waitingCount)
        .filter((count): count is number => count != null);
      return {
        ...roundMissions[0],
        roundLabel: `${roundMissions[0].th}회차`,
        currentAttendance: formatRoundAttendance(roundMissions),
        waitingCount:
          waitingCounts.length > 0
            ? waitingCounts.reduce((sum, count) => sum + count, 0)
            : null,
        roundMissions,
      };
    });
  }, [missions, versionId]);

  return (
    <main>
      <MissionVersionTabs
        versions={currentChallenge?.versionList ?? []}
        value={versionId}
        onChange={setVersionId}
      />
      <div className="min-w-[1400px]">
        <LineTableHead
          cellWidthList={cellWidthList}
          colNames={colNames}
          editable={false}
        />
        <LineTableBody>
          {rows?.map((row) => (
            // 탭을 바꾸면 같은 첫 미션이라도 묶음이 달라진다. 행은 처음 값을 들고 있어 key 로 새로 그린다
            <React.Fragment key={`${row.id}-${versionId ?? 'all'}`}>
              <LineTableBodyRow<Row>
                editable={false}
                attrNames={[
                  'roundLabel',
                  'missionTag',
                  'startDate',
                  'endDate',
                  'currentAttendance',
                  'waitingCount',
                ]}
                placeholders={colNames}
                canEdits={[false, false, false, false, false, false]}
                formatter={[
                  null,
                  null,
                  null,
                  null,
                  null,
                  (count: number | null) =>
                    count != null ? (
                      <span className="font-bold text-red-500">
                        확인중 {count}
                      </span>
                    ) : (
                      '-'
                    ),
                ]}
                contents={[
                  { type: TABLE_CONTENT.INPUT },
                  { type: TABLE_CONTENT.INPUT },
                  { type: TABLE_CONTENT.DATETIME },
                  { type: TABLE_CONTENT.DATETIME },
                  { type: TABLE_CONTENT.INPUT },
                  {
                    type: TABLE_CONTENT.INPUT,
                  },
                ]}
                key={row.id}
                initialValues={row}
                onClick={() => {
                  const isOpen = detailedRound?.[0]?.id === row.id;
                  setDetailedRound(isOpen ? null : row.roundMissions);
                }}
                cellWidthList={cellWidthList}
              />
              {detailedRound?.[0]?.id === row.id ? (
                <ChallengeSubmitDetail
                  key={`detail-${row.id}`}
                  mission={detailedRound[0]}
                  missionOf={(item) =>
                    missionByAttendanceId.get(item.attendance.id) ??
                    detailedRound[0]
                  }
                  setIsDetailShown={(isDetailShown) => {
                    if (!isDetailShown) {
                      setDetailedRound(null);
                    }
                  }}
                  // 전체 탭에서는 버전 미션 제출을 버전별 구역으로 나눠 보여준다
                  sectionOf={
                    versionId === null
                      ? (item) => {
                          const mission = missionByAttendanceId.get(
                            item.attendance.id,
                          );
                          return mission &&
                            mission.challengeVersionList.length > 0
                            ? formatMissionVersions(
                                mission.challengeVersionList,
                              )
                            : null;
                        }
                      : undefined
                  }
                  attendances={detailedAttendances}
                  refetch={refetch}
                />
              ) : null}
            </React.Fragment>
          ))}
        </LineTableBody>
      </div>
    </main>
  );
};

export default ChallengeOperationAttendances;
