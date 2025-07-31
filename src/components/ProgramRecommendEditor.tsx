import { Box, Button, Modal, Typography } from '@mui/material';
import { useState } from 'react';

import { useGetProgramAdminQuery } from '@/api/program';
import { ProgramTypeUpperCase } from '@/schema';
import { ProgramRecommend } from '@/types/interface';
import { newProgramTypeToText, programStatusToText } from '@/utils/convert';
import Heading2 from '@components/admin/ui/heading/Heading2';
import Input from '@components/ui/input/Input';

// 모달 스타일
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxHeight: '100vh', // 뷰포트 높이의 90%로 제한
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column', // 컨텐츠를 세로로 배치
};

// 헤더 스타일
const headerStyle = {
  p: 2,
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'space-between',
};

// 컨텐츠 스타일
const contentStyle = {
  flex: 1, // 남은 공간 차지
  overflow: 'auto', // 스크롤 활성화
};

// 푸터 스타일
const footerStyle = {
  p: 2,
  borderTop: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
};

interface ProgramRecommendEditorProps {
  programRecommend: ProgramRecommend;
  setProgramRecommend: (value: ProgramRecommend) => void;
}

const ProgramRecommendEditor = ({
  programRecommend,
  setProgramRecommend,
}: ProgramRecommendEditorProps) => {
  const [selectModalOpen, setSelectModalOpen] = useState(false);

  const programAdminRes = useGetProgramAdminQuery({
    page: 1,
    size: 10000,
  });

  const onClose = () => setSelectModalOpen(false);
  const onOpen = () => setSelectModalOpen(true);

  const onChangeItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    programType: ProgramTypeUpperCase,
  ) => {
    const index = programRecommend.list.findIndex(
      (ele) =>
        ele.programInfo.id === id &&
        ele.programInfo.programType === programType,
    );

    if (index === -1) return;

    const item = {
      ...programRecommend.list[index],
      programInfo: {
        ...programRecommend.list[index].programInfo,
      },
      classificationList: [...programRecommend.list[index].classificationList],
      [e.target.name]: e.target.value,
    };

    setProgramRecommend({
      list: [
        ...programRecommend.list.slice(0, index),
        item,
        ...programRecommend.list.slice(index + 1),
      ],
    });
  };

  return (
    <div>
      <Heading2 className="mb-2">프로그램 추천</Heading2>
      <div className="mb-4">
        <Button variant="outlined" onClick={onOpen}>
          프로그램 선택
        </Button>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex min-w-full flex-col gap-2">
          {programRecommend.list.map((item) => (
            <div key={item.programInfo.id} className="flex items-center gap-2">
              <div
                className="h-32 w-40 flex-none rounded-xs border bg-neutral-60"
                style={{
                  backgroundImage: `url(${item.programInfo.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="flex h-full items-center justify-center bg-black bg-opacity-30 p-2 text-xxsmall12">
                  <span className="text-white">{item.programInfo.title}</span>
                </div>
              </div>
              <div className="flex w-full max-w-xl flex-col gap-2">
                <Input
                  label="제목"
                  type="text"
                  name="recommendTitle"
                  placeholder="프로그램 추천 제목을 입력해주세요"
                  defaultValue={item.recommendTitle}
                  size="small"
                  onChange={(e) =>
                    onChangeItem(
                      e,
                      item.programInfo.id,
                      item.programInfo.programType,
                    )
                  }
                />
                <Input
                  label="CTA"
                  type="text"
                  name="recommendCTA"
                  placeholder="프로그램 추천 CTA를 입력해주세요"
                  defaultValue={item.recommendCTA}
                  size="small"
                  onChange={(e) =>
                    onChangeItem(
                      e,
                      item.programInfo.id,
                      item.programInfo.programType,
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={selectModalOpen} onClose={onClose}>
        <Box sx={modalStyle}>
          {/* 헤더 영역 - 고정 */}
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

          {/* 컨텐츠 영역 - 스크롤 가능 */}
          <Box sx={contentStyle}>
            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th></th> {/* 체크박스 */}
                    <th className="whitespace-nowrap">순서</th>
                    <th className="whitespace-nowrap">프로그램 분류</th>
                    <th className="whitespace-nowrap">제목</th>
                    <th className="whitespace-nowrap">모집 상태</th>
                    <th className="whitespace-nowrap">노출 여부</th>
                  </tr>
                </thead>
                <tbody>
                  {programAdminRes.data?.programList.map((item) => {
                    const index = programRecommend.list.findIndex(
                      (v) =>
                        v.programInfo.id === item.programInfo.id &&
                        v.programInfo.programType ===
                          item.programInfo.programType,
                    );
                    const order = index === -1 ? '' : index + 1;

                    return (
                      <tr
                        key={item.programInfo.id}
                        className="divide-x divide-y"
                      >
                        {/* 체크박스 */}
                        <td className="text-center">
                          <input
                            className="h-4 w-4"
                            type="checkbox"
                            checked={programRecommend.list.some(
                              (v) =>
                                v.programInfo.id === item.programInfo.id &&
                                v.programInfo.programType ===
                                  item.programInfo.programType,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProgramRecommend({
                                  list: [
                                    ...programRecommend.list,
                                    {
                                      programInfo: {
                                        ...item.programInfo,
                                      },
                                      classificationList:
                                        item.classificationList.map((ele) => ({
                                          programClassification:
                                            ele.programClassification,
                                        })),
                                      adminClassificationList:
                                        item.adminClassificationList
                                          ? item.adminClassificationList.map(
                                              (ele) => ({
                                                programAdminClassification:
                                                  ele.programAdminClassification,
                                              }),
                                            )
                                          : [],
                                    },
                                  ],
                                });
                              } else {
                                setProgramRecommend({
                                  list: programRecommend.list.filter(
                                    (v) =>
                                      v.programInfo.programType !==
                                        item.programInfo.programType ||
                                      v.programInfo.id !== item.programInfo.id,
                                  ),
                                });
                              }
                            }}
                          />
                        </td>
                        {/* 순서 */}
                        <td className="px-2 py-1">
                          <div className="flex items-center justify-center">
                            <span className="whitespace-nowrap text-xsmall14">
                              {order}
                            </span>
                          </div>
                        </td>
                        {/* 프로그램 분류 */}
                        <td className="p-1">
                          <div className="flex items-center justify-center">
                            <span className="whitespace-nowrap text-xsmall14">
                              {
                                newProgramTypeToText[
                                  item.programInfo.programType
                                ]
                              }
                            </span>
                          </div>
                        </td>
                        {/* 제목 */}
                        <td className="whitespace-nowrap p-1 text-xsmall14">
                          {item.programInfo.title}
                        </td>
                        {/* 모집 상태 */}
                        <td className="whitespace-nowrap text-center text-xsmall14">
                          {
                            programStatusToText[
                              item.programInfo.programStatusType
                            ]
                          }
                        </td>
                        {/* 노출 여부 */}
                        <td className="whitespace-nowrap text-center text-xsmall14">
                          {item.programInfo.isVisible ? '✅' : '❌'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Box>

          {/* 푸터 영역 - 고정 */}
          <Box sx={footerStyle}>
            <Button onClick={onClose} variant="outlined">
              닫기
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ProgramRecommendEditor;
