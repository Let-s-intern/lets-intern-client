'use client';

import { fileType, uploadFile } from '@/api/file';
import Input from '@/common/input/v1/Input';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Heading3 from '@/domain/admin/ui/heading/Heading3';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { ChallengeType } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { Button } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { FaTrashCan } from 'react-icons/fa6';

const DEFAULT_LECTURE_COUNT = 3;

/** 강의 정보 등록 섹션을 노출할 챌린지 타입 (추가 타입은 이 배열에만 넣으면 됨) */
const CHALLENGE_TYPES_WITH_LECTURES: ChallengeType[] = ['HR'];

function createEmptyLecture() {
  return {
    topic: '',
    mentorImage: '',
    mentorName: '',
    schedule: '',
    companyLogo: '',
  };
}

interface ChallengeLectureProps {
  challengeType: ChallengeType;
  content: ChallengeContent;
  setContent: React.Dispatch<React.SetStateAction<ChallengeContent>>;
}

function ChallengeLecture({
  challengeType,
  content,
  setContent,
}: ChallengeLectureProps) {
  const { snackbar } = useAdminSnackbar();
  const lectures = useMemo(() => content.lectures ?? [], [content.lectures]);

  // 강의 목록 초기화: 강의 섹션을 쓰는 타입이고, lectures가 아직 없을 때만 첫 줄(3개) 생성
  useEffect(() => {
    if (!CHALLENGE_TYPES_WITH_LECTURES.includes(challengeType)) return;
    if (content.lectures != null) return;
    const initialLectures = Array.from(
      { length: DEFAULT_LECTURE_COUNT },
      createEmptyLecture,
    );
    setContent((prev) => ({ ...prev, lectures: initialLectures }));
  }, [challengeType, content.lectures, setContent]);

  const uploadImage = async (file: File) => {
    try {
      return await uploadFile({
        file,
        type: fileType.enum.CHALLENGE,
      });
    } catch {
      snackbar('이미지 업로드에 실패했습니다.');
      throw new Error('Image upload failed');
    }
  };

  const handleMentorImageChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;
    const url = await uploadImage(e.target.files[0]);
    const updatedLectures = [...lectures];
    updatedLectures[index] = {
      ...updatedLectures[index],
      mentorImage: url,
    };
    setContent((prev) => ({ ...prev, lectures: updatedLectures }));
  };

  const handleCompanyLogoChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;
    const url = await uploadImage(e.target.files[0]);
    const updatedLectures = [...lectures];
    updatedLectures[index] = {
      ...updatedLectures[index],
      companyLogo: url,
    };
    setContent((prev) => ({ ...prev, lectures: updatedLectures }));
  };

  const handleFieldChange = (
    index: number,
    field: 'topic' | 'mentorName' | 'schedule',
    value: string,
  ) => {
    const updatedLectures = [...lectures];
    updatedLectures[index] = {
      ...updatedLectures[index],
      [field]: value,
    };
    setContent((prev) => ({ ...prev, lectures: updatedLectures }));
  };

  const handleAddLecture = () => {
    setContent((prev) => ({
      ...prev,
      lectures: [...(prev.lectures ?? []), createEmptyLecture()],
    }));
  };

  const handleRemoveLecture = (index: number) => {
    const updatedLectures = lectures.filter((_, i) => i !== index);
    setContent((prev) => ({ ...prev, lectures: updatedLectures }));
  };

  if (!CHALLENGE_TYPES_WITH_LECTURES.includes(challengeType)) {
    return null;
  }

  return (
    <section className="mb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Heading3>강의 정보 등록</Heading3>
        <Button variant="outlined" onClick={handleAddLecture}>
          추가
        </Button>
      </div>
      {lectures.length === 0 ? (
        <p className="text-xsmall14 text-neutral-50">
          추가 버튼을 눌러 강의 정보를 추가해주세요
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {lectures.map((lecture, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-sm border border-neutral-200 p-2"
            >
              <div className="flex gap-2">
                {/* 왼쪽: 멘토 이미지 */}
                <div className="flex flex-col gap-1">
                  <label className="text-xxsmall12 text-neutral-40">
                    멘토 이미지
                  </label>
                  <div className="flex h-[147px] w-[147px] flex-shrink-0 flex-col overflow-hidden rounded-sm border border-neutral-200">
                    <ImageUpload
                      label="멘토 이미지"
                      id={`mentor-image-${index}`}
                      name={`mentor-image-${index}`}
                      image={lecture.mentorImage}
                      onChange={(e) => handleMentorImageChange(index, e)}
                      simpleMode
                    />
                  </div>
                </div>

                {/* 오른쪽: 강의 정보 */}
                <div className="flex flex-1 flex-col gap-3">
                  {/* 강의 주제 (어드민 직접 입력) */}
                  <div className="mt-5 flex flex-col gap-1">
                    <Input
                      label="강의 주제"
                      type="text"
                      size="small"
                      value={lecture.topic}
                      onChange={(e) =>
                        handleFieldChange(index, 'topic', e.target.value)
                      }
                    />
                  </div>

                  {/* 로고 이미지 + 멘토명/강의일자 (같은 줄) */}
                  <div className="flex flex-row gap-2">
                    {/* 로고 이미지 (왼쪽) */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xxsmall12 text-neutral-40">
                        소속
                      </label>
                      <div className="h-[75px] w-[75px] flex-shrink-0 overflow-hidden rounded-sm border border-neutral-200">
                        <ImageUpload
                          label=""
                          id={`company-logo-${index}`}
                          name={`company-logo-${index}`}
                          image={lecture.companyLogo}
                          onChange={(e) => handleCompanyLogoChange(index, e)}
                          simpleMode
                        />
                      </div>
                    </div>

                    {/* 멘토명 + 강의일자 (오른쪽, 세로 배치) */}
                    <div className="flex flex-1 flex-col gap-3">
                      <Input
                        label="멘토명"
                        type="text"
                        size="small"
                        value={lecture.mentorName}
                        onChange={(e) =>
                          handleFieldChange(index, 'mentorName', e.target.value)
                        }
                      />
                      <Input
                        label="강의 일자"
                        type="text"
                        size="small"
                        value={lecture.schedule}
                        onChange={(e) =>
                          handleFieldChange(index, 'schedule', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 삭제 (AdminReportCreatePage 옵션 삭제와 동일한 형태) */}
              <div className="flex justify-end">
                <Button
                  variant="text"
                  onClick={() => handleRemoveLecture(index)}
                  className="min-w-0"
                  style={{ minWidth: 0, padding: 12 }}
                  color="error"
                >
                  <FaTrashCan />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ChallengeLecture;
