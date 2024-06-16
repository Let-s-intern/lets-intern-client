import { Box, Button, Modal, SxProps } from '@mui/material';
import { useState } from 'react';
import { z } from 'zod';
import { useMissionsOfCurrentChallenge } from '../../../context/CurrentChallengeProvider';
import { missionStatusType } from '../../../schema';

const MissionStateBadge = ({
  state,
}: {
  state: z.infer<typeof missionStatusType>;
}) => {
  switch (state) {
    case 'CHECK_DONE':
      return <span className="rounded bg-green-500 text-white">확인완료</span>;
    case 'REFUND_DONE':
      return <span className="rounded bg-red-500 text-white">환불완료</span>;
    case 'WAITING':
      return <span className="rounded bg-gray-500 text-white">대기</span>;
  }
};

const modalContainerStyle: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  // boxShadow: 24,
  p: 4,
};

const noopFunction = (...args: any[]): any => {};

interface Props {
  setIsModalShown: (isModalShown: boolean) => void;
  values: any;
  setValues: (values: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const NoticeEditorModal = ({
  values,
  setIsModalShown,
  setValues,
  onSubmit,
}: Props) => {
  const handleInputChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    setIsModalShown(false);
    setValues({});
  };

  return (
    <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-end bg-black bg-opacity-50">
      <div className="flex w-[calc(100%-16rem)] items-center justify-center">
        <form
          className="w-[40rem] rounded-md bg-white px-12 py-10"
          onSubmit={onSubmit}
        >
          <h2 className="text-xl font-semibold">공지사항 등록</h2>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center">
              <label htmlFor="type" className="w-20">
                공지유형
              </label>
              {/* <ModalDropdown values={values} setValues={setValues} /> */}
            </div>
            <div className="flex items-center">
              <label htmlFor="title" className="w-20">
                제목
              </label>
              <input
                type="text"
                className="flex-1 rounded-sm border border-neutral-400 px-4 py-2 text-sm outline-none"
                name="title"
                value={values.title || ''}
                placeholder="제목을 입력해주세요."
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="title" className="w-20">
                링크
              </label>
              <input
                type="text"
                className="flex-1 rounded-sm border border-neutral-400 px-4 py-2 text-sm outline-none"
                name="link"
                value={values.link || ''}
                placeholder="링크를 입력해주세요."
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mt-12 flex justify-end gap-2">
            <button className="rounded-xxs bg-neutral-700 px-5 py-[2px] text-sm text-white">
              등록
            </button>
            <button
              className="rounded-xxs bg-stone-300 px-5 py-[2px] text-sm"
              onClick={handleModalClose}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChallengeOperationHome = () => {
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);

  const missions = useMissionsOfCurrentChallenge();
  return (
    <main>
      <h2 className="text-lg font-bold">미션제출현황</h2>
      <div className="flex items-center gap-2">
        {missions?.missionList.map((mission) => {
          return (
            <div key={mission.id} className="border p-3 text-center">
              <p>
                {mission.startDate.format('MM/DD(ddd)')}-
                {mission.endDate.format('MM/DD(ddd)')}
              </p>
              <h3>{mission.th}회차</h3>
              <p className="text-xl">{mission.attendanceCount}</p>
              <p>지각 {mission.lateAttendanceCount}</p>
              <p>
                <MissionStateBadge state={mission.missionStatusType} />
              </p>
            </div>
          );
        })}
      </div>

      {/* <NoticeEditorModal
onSubmit={noopFunction}
setIsModalShown={noopFunction}
setValues={noopFunction}
values={{}}
      ></NoticeEditorModal> */}

      <Button variant="outlined" onClick={() => setNoticeModalOpen(true)}>
        Open modal
      </Button>

      <Modal open={noticeModalOpen} onClose={() => setNoticeModalOpen(false)}>
        <Box sx={modalContainerStyle}>hello world</Box>
      </Modal>
    </main>
  );
};

export default ChallengeOperationHome;
