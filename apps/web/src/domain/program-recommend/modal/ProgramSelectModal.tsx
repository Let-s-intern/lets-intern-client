import { Box, Button, Modal, Typography } from '@mui/material';
import { useCallback } from 'react';

import { ProgramAdminList, ProgramAdminListItem } from '@/schema';
import { ProgramRecommend } from '@/types/interface';
import { newProgramTypeToText, programStatusToText } from '@/utils/convert';

const isSameProgram = (
  a: { id: number; programType: string },
  b: { id: number; programType: string },
) => a.id === b.id && a.programType === b.programType;

const toRecommendItem = (item: ProgramAdminListItem) => ({
  programInfo: { ...item.programInfo },
  classificationList: item.classificationList.map((ele) => ({
    programClassification: ele.programClassification,
  })),
  adminClassificationList: (item.adminClassificationList ?? []).map((ele) => ({
    programAdminClassification: ele.programAdminClassification,
  })),
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxHeight: '100vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  p: 2,
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'space-between',
};

const contentStyle = {
  flex: 1,
  overflow: 'auto',
};

const footerStyle = {
  p: 2,
  borderTop: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
};

interface ProgramSelectModalProps {
  open: boolean;
  onClose: () => void;
  programRecommend: ProgramRecommend;
  setProgramRecommend: (value: ProgramRecommend) => void;
  programList?: ProgramAdminList;
}

const ProgramSelectModal = ({
  open,
  onClose,
  programRecommend,
  setProgramRecommend,
  programList,
}: ProgramSelectModalProps) => {
  const isSelected = (item: ProgramAdminListItem) =>
    programRecommend.list.some((v) =>
      isSameProgram(v.programInfo, item.programInfo),
    );

  const getOrder = (item: ProgramAdminListItem) => {
    const index = programRecommend.list.findIndex((v) =>
      isSameProgram(v.programInfo, item.programInfo),
    );
    return index === -1 ? '' : index + 1;
  };

  const handleToggle = useCallback(
    (item: ProgramAdminListItem, checked: boolean) => {
      const nextList = checked
        ? [...programRecommend.list, toRecommendItem(item)]
        : programRecommend.list.filter(
            (v) => !isSameProgram(v.programInfo, item.programInfo),
          );

      setProgramRecommend({ list: nextList });
    },
    [programRecommend, setProgramRecommend],
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={headerStyle}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            fontWeight="bold"
          >
            프로그램 선택 (노출 순서대로 체크하세요)
          </Typography>
          <Button onClick={onClose} variant="outlined">
            닫기
          </Button>
        </Box>

        <Box sx={contentStyle}>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th></th>
                  <th className="whitespace-nowrap">순서</th>
                  <th className="whitespace-nowrap">프로그램 분류</th>
                  <th className="whitespace-nowrap">제목</th>
                  <th className="whitespace-nowrap">모집 상태</th>
                  <th className="whitespace-nowrap">노출 여부</th>
                </tr>
              </thead>
              <tbody>
                {programList?.map((item) => (
                  <tr key={item.programInfo.id} className="divide-x divide-y">
                    <td className="text-center">
                      <input
                        className="h-4 w-4"
                        type="checkbox"
                        checked={isSelected(item)}
                        onChange={(e) => handleToggle(item, e.target.checked)}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex items-center justify-center">
                        <span className="text-xsmall14 whitespace-nowrap">
                          {getOrder(item)}
                        </span>
                      </div>
                    </td>
                    <td className="p-1">
                      <div className="flex items-center justify-center">
                        <span className="text-xsmall14 whitespace-nowrap">
                          {newProgramTypeToText[item.programInfo.programType]}
                        </span>
                      </div>
                    </td>
                    <td className="text-xsmall14 whitespace-nowrap p-1">
                      {item.programInfo.title}
                    </td>
                    <td className="text-xsmall14 whitespace-nowrap text-center">
                      {programStatusToText[item.programInfo.programStatusType]}
                    </td>
                    <td className="text-xsmall14 whitespace-nowrap text-center">
                      {item.programInfo.isVisible ? '✅' : '❌'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        <Box sx={footerStyle}>
          <Button onClick={onClose} variant="outlined">
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProgramSelectModal;
