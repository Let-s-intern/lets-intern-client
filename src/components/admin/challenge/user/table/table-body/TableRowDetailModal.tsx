import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Button from '../../../ui/button/Button';
import axios from '../../../../../../utils/axios';
import clsx from 'clsx';

interface Props {
  application: any;
  setIsMenuShown: (isMenuShown: boolean) => void;
}

const TableRowDetailModal = ({ application, setIsMenuShown }: Props) => {
  const [applyMotive, setApplyMotive] = useState<string>();
  const [missionList, setMissionList] = useState<any>();

  const getApplicationDetail = useQuery({
    queryKey: [
      'application',
      'admin',
      'challenge',
      'detail',
      application.applicationId,
    ],
    queryFn: async () => {
      const res = await axios.get(
        `/application/admin/challenge/detail/${application.applicationId}`,
      );
      const data = res.data;
      setApplyMotive(data.applyMotive);
      setMissionList(data.missionList);
      return data;
    },
  });

  const isLoading =
    getApplicationDetail.isLoading ||
    applyMotive === undefined ||
    missionList === undefined;

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="absolute bottom-[0.25rem] z-30 w-full translate-y-full bg-white px-12 pb-6 pt-8 font-pretendard text-[#626262] shadow-[0px_0px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-start px-3">
        <h3 className="w-24 font-semibold">지원 동기</h3>
        <p>{applyMotive}</p>
      </div>
      <hr className="my-5 bg-[#D9D9D9]" />
      <div className="px-3">
        <h3 className="font-semibold">미션 수행</h3>
        <div className="mt-1 flex gap-8 overflow-x-auto">
          <div className="flex flex-col gap-2">
            <div className="opacity-0">일차</div>
            <div className="w-20">미션</div>
            <div>확인</div>
            <div>환급</div>
            <div>제한 콘텐츠</div>
          </div>
          {missionList.map((mission: any) => (
            <div
              key={mission.missionId}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 text-center">{mission.missionTh}일차</div>
              <div>{mission.attendanceStatus !== 'ABSENT' ? 'O' : 'X'}</div>
              <div>{mission.attendanceResult === 'PASS' ? 'O' : 'X'}</div>
              <div
                className={clsx({
                  'opacity-0': mission.attendanceIsRefunded === null,
                })}
              >
                {mission.attendanceIsRefunded ? 'O' : 'X'}
              </div>
              <div>
                {mission.attendanceStatus !== 'ABSENT' &&
                mission.attendanceResult === 'PASS' &&
                (mission.attendanceIsRefunded === null ||
                  (mission.attendanceIsRefunded !== null &&
                    mission.attendanceIsRefunded)) ? (
                  <i>
                    <img
                      src="/icons/admin-checkbox-checked.svg"
                      alt="checkbox checked"
                    />
                  </i>
                ) : (
                  <i>
                    <img
                      src="/icons/admin-checkbox-unchecked.svg"
                      alt="checkbox unchecked"
                    />
                  </i>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={() => setIsMenuShown(false)}>닫기</Button>
      </div>
    </div>
  );
};

export default TableRowDetailModal;
