import { useGetChallengeAttendances } from '@/api/challenge/challenge';
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
import { Mission } from '@/schema';
import { TABLE_CONTENT } from '@/utils/convert';
import { Button } from '@mui/material';
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
  const [detailedMission, setDetailedMission] = useState<Mission | null>(null);
  // null 은 전체. 버전 탭은 그 버전 참여자가 받는 미션만 보여준다
  const [versionId, setVersionId] = useState<number | null>(null);

  const { data: detailedAttendances, refetch } = useGetChallengeAttendances({
    challengeId: currentChallenge?.id,
    detailedMissionId: detailedMission?.id,
  });

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
                  const isOpen = row.roundMissions.some(
                    (mission) => mission.id === detailedMission?.id,
                  );
                  setDetailedMission(isOpen ? null : row.roundMissions[0]);
                }}
                cellWidthList={cellWidthList}
              />
              {detailedMission &&
              row.roundMissions.some(
                (mission) => mission.id === detailedMission.id,
              ) ? (
                <>
                  {/* 같은 회차의 버전 미션이 여럿이면 어느 버전 제출자를 볼지 고른다 */}
                  {row.roundMissions.length > 1 && (
                    <div className="flex items-center gap-2 px-4 pt-3">
                      {row.roundMissions.map((mission) => (
                        <Button
                          key={mission.id}
                          size="small"
                          variant={
                            mission.id === detailedMission.id
                              ? 'contained'
                              : 'outlined'
                          }
                          onClick={() => setDetailedMission(mission)}
                        >
                          {formatMissionVersions(mission.challengeVersionList)}
                        </Button>
                      ))}
                    </div>
                  )}
                  <ChallengeSubmitDetail
                    key={`detail-${detailedMission.id}`}
                    mission={detailedMission}
                    setIsDetailShown={(isDetailShown) => {
                      if (!isDetailShown) {
                        setDetailedMission(null);
                      }
                    }}
                    attendances={detailedAttendances || []}
                    refetch={refetch}
                  />
                </>
              ) : null}
            </React.Fragment>
          ))}
        </LineTableBody>
      </div>
    </main>
  );
};

export default ChallengeOperationAttendances;
