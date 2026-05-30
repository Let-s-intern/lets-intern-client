import { Box, Button, Modal, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

import { useGetProgramAdminQuery } from '@/api/program';
import Input from '@/common/input/v1/Input';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ProgramTypeUpperCase } from '@/schema';
import { ProgramRecommend } from '@/types/interface';
import { newProgramTypeToText, programStatusToText } from '@/utils/convert';

// 모달 스타일
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  maxWidth: 900,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
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
  /**
   * 추천 프로그램 선택 가능한 최대 개수.
   * 지정 시 미선택 항목은 한도 도달 후 disabled. 이미 선택된 항목은 항상 해제 가능.
   * 미지정(undefined) 시 제한 없음(기존 동작).
   */
  maxCount?: number;
}

const ProgramRecommendEditor = ({
  programRecommend,
  setProgramRecommend,
  maxCount,
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
    <>
      <Heading2 className="mb-2">프로그램 추천</Heading2>
      <div className="mb-4">
        <Button variant="outlined" onClick={onOpen}>
          프로그램 선택
        </Button>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex min-w-full flex-col gap-2">
          {programRecommend.list.map((item) => (
            <div
              key={`${item.programInfo.programType}-${item.programInfo.id}`}
              className="flex items-center gap-2"
            >
              <div
                className="rounded-xs bg-neutral-60 h-32 w-40 flex-none border"
                style={{
                  backgroundImage: `url(${item.programInfo.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="text-xxsmall12 flex h-full items-center justify-center bg-black bg-opacity-30 p-2">
                  <span className="text-white">{item.programInfo.title}</span>
                </div>
              </div>
              <div className="flex w-full max-w-xl flex-col gap-2">
                <Input
                  label="제목"
                  type="text"
                  name="recommendTitle"
                  placeholder="프로그램 추천 제목을 입력해주세요"
                  value={item.recommendTitle ?? ''}
                  maxLength={18}
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
                  value={item.recommendCTA ?? ''}
                  maxLength={16}
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
              {maxCount !== undefined
                ? `프로그램 선택 (최대 ${maxCount}개, 노출 순서대로 체크하세요)`
                : '프로그램 선택 (노출 순서대로 체크하세요)'}
            </Typography>
          </Box>

          {/* 컨텐츠 영역 - 스크롤 가능 */}
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
                  {programAdminRes.data?.programList.map((item) => {
                    const index = programRecommend.list.findIndex(
                      (v) =>
                        v.programInfo.id === item.programInfo.id &&
                        v.programInfo.programType ===
                          item.programInfo.programType,
                    );
                    const order = index === -1 ? '' : index + 1;
                    const isSelected = index !== -1;
                    const isOverLimit =
                      !isSelected &&
                      maxCount !== undefined &&
                      programRecommend.list.length >= maxCount;

                    const checkboxInput = (
                      <input
                        className="h-4 w-4"
                        type="checkbox"
                        disabled={isOverLimit}
                        checked={isSelected}
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
                    );

                    return (
                      <tr
                        key={`${item.programInfo.programType}-${item.programInfo.id}`}
                        className="divide-x divide-y"
                      >
                        {/* 체크박스 */}
                        <td className="text-center">
                          {isOverLimit ? (
                            <Tooltip title="큐레이션 카드 노출 중에는 최대 2개까지 선택 가능합니다.">
                              <span>{checkboxInput}</span>
                            </Tooltip>
                          ) : (
                            checkboxInput
                          )}
                        </td>
                        {/* 순서 */}
                        <td className="px-2 py-1">
                          <div className="flex items-center justify-center">
                            <span className="text-xsmall14 whitespace-nowrap">
                              {order}
                            </span>
                          </div>
                        </td>
                        {/* 프로그램 분류 */}
                        <td className="p-1">
                          <div className="flex items-center justify-center">
                            <span className="text-xsmall14 whitespace-nowrap">
                              {
                                newProgramTypeToText[
                                  item.programInfo.programType
                                ]
                              }
                            </span>
                          </div>
                        </td>
                        {/* 제목 */}
                        <td className="text-xsmall14 whitespace-nowrap p-1">
                          {item.programInfo.title}
                        </td>
                        {/* 모집 상태 */}
                        <td className="text-xsmall14 whitespace-nowrap text-center">
                          {
                            programStatusToText[
                              item.programInfo.programStatusType
                            ]
                          }
                        </td>
                        {/* 노출 여부 */}
                        <td className="text-xsmall14 whitespace-nowrap text-center">
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
            <Button onClick={onClose} variant="contained">
              저장
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProgramRecommendEditor;
