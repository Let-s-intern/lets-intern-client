import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import ChallengeSubmitDetail from '../../../components/admin/challenge/submit-check/table/table-body/ChallengeSubmitDetail';
import LineTableBody from '../../../components/admin/challenge/ui/lineTable/LineTableBody';
import LineTableBodyRow, {
  ItemWithStatus,
} from '../../../components/admin/challenge/ui/lineTable/LineTableBodyRow';
import LineTableHead from '../../../components/admin/challenge/ui/lineTable/LineTableHead';
import {
  useAdminCurrentChallenge,
  useAdminMissionsOfCurrentChallenge,
} from '../../../context/CurrentAdminChallengeProvider';
import { attendances, Mission } from '../../../schema';
import axios from '../../../utils/axios';
import { TABLE_CONTENT } from '../../../utils/convert';

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
  const { currentChallenge } = useAdminCurrentChallenge();
  const missions = useAdminMissionsOfCurrentChallenge();
  const [detailedMission, setDetailedMission] = useState<Mission | null>(null);

  const { data: detailedAttendances } = useQuery({
    queryKey: ['challenge', currentChallenge?.id, 'attendances'],
    enabled: Boolean(currentChallenge?.id) && Boolean(detailedMission?.id),
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${currentChallenge?.id}/mission/${detailedMission?.id}/attendances`,
      );
      return attendances.parse(res.data.data).attendanceList ?? [];
    },
  });

  useEffect(() => {
    console.log('detailedAttendances', detailedAttendances);
  }, [detailedAttendances]);

  useEffect(() => {
    console.log('missions', missions);
  }, [missions]);

  const rows = useMemo(() => {
    return (
      missions?.map((mission) => {
        return {
          ...mission,
          currentAttendance: `${mission.attendanceCount ?? 0}(제출)/${
            mission.applicationCount ?? 0
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
            <React.Fragment key={row.id}>
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
                  attendances={detailedAttendances || []}
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
