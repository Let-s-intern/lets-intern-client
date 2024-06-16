import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import TableRowDetail from '../../../components/admin/challenge/mission/mission/table/table-body/TableRowDetailMenu';
import LineTableBody from '../../../components/admin/challenge/ui/lineTable/LineTableBody';
import LineTableBodyRow, {
  ItemWithStatus
} from '../../../components/admin/challenge/ui/lineTable/LineTableBodyRow';
import LineTableHead from '../../../components/admin/challenge/ui/lineTable/LineTableHead';
import {
  useCurrentChallenge,
  useMissionsOfCurrentChallenge
} from '../../../context/CurrentChallengeProvider';
import {
  attendances, getChallengeIdApplication, Mission
} from '../../../schema';
import axios from '../../../utils/axios';
import { TABLE_CONTENT } from '../../../utils/convert';
import ChallengeSubmitDetail from "../../../components/admin/challenge/submit-check/table/table-body/ChallengeSubmitDetail";

type Row = Mission &
  ItemWithStatus & {
    currentAttendance: string; // 제출현황: n(제출)/m(전체)
  };

const cellWidthList = [
  'w-[140px]',
  'w-[20%]',
  'w-[200px]',
  'w-[200px]',
  'w-[20%]',
  'w-[20%]',
];
const colNames = ['회차', '미션명', '공개일', '마감일', '제출현황', '상태'];

const ChallengeOperationAttendances = () => {
  const params = useParams();
  const challengeId = params.programId;
  const missions = useMissionsOfCurrentChallenge();
  const { currentChallenge } = useCurrentChallenge();
  const [detailedMission, setDetailedMission] = useState<Mission | null>(null);

  const { data: submissionRes } = useQuery({
    queryKey: ['challenge', challengeId, 'application'],
    queryFn: async () => {
      if (challengeId) {
        return null;
      }
      const res = await axios.get(`/challenge/${challengeId}/application`);
      return getChallengeIdApplication.parse(res.data.data);
    },
  });

  const { data: detailedAttendances } = useQuery({
    queryKey: ['challenge', challengeId, 'attendances'],
    queryFn: async () => {
      if (!challengeId || !detailedMission?.id) {
        return null;
      }
      const res = await axios.get(
        `/challenge/${challengeId}/mission/${detailedMission.id}/attendances`,
      );
      return attendances.parse(res.data.data);
    },
  });

  const rows = useMemo(() => {
    return (
      missions?.map((mission) => {
        return {
          ...mission,
          currentAttendance: `${mission.attendanceCount ?? 0}(제출)/${
            mission.attendanceCount ?? 0
          }(전체)`,
        };
      }) ?? []
    );
  }, [missions]);

  return (
    <main>
      <div className="min-w-[1400px]">
        <LineTableHead
          cellWidthList={cellWidthList}
          colNames={colNames}
          editable={false}
        />
        <LineTableBody>
          {rows?.map((row) => (
            <>
              <LineTableBodyRow<Row>
                editable={false}
                attrNames={[
                  'th',
                  'th',
                  'startDate',
                  'endDate',
                  'currentAttendance',
                  'missionStatusType',
                ]}
                placeholders={colNames}
                canEdits={[false, false, false, false, false, false, false]}
                contents={[
                  { type: TABLE_CONTENT.INPUT },
                  { type: TABLE_CONTENT.INPUT },
                  { type: TABLE_CONTENT.DATE },
                  { type: TABLE_CONTENT.DATE },
                  { type: TABLE_CONTENT.INPUT },
                  { type: TABLE_CONTENT.INPUT },
                ]}
                key={row.id}
                initialValues={row}
                onClick={() => {
                  if (detailedMission?.id === row.id) {
                    setDetailedMission(null);
                  } else {
                    setDetailedMission(row);
                  }
                }}
                cellWidthList={cellWidthList}
              />
              {detailedMission?.id === row.id ? (
                <ChallengeSubmitDetail
                  mission={detailedMission}
                  setIsDetailShown={(isDetailShown) => {
                    if (!isDetailShown) {
                      setDetailedMission(null);
                    }
                  }}
                />
              ) : null}
            </>
          ))}
        </LineTableBody>
      </div>
    </main>
  );
};

export default ChallengeOperationAttendances;
