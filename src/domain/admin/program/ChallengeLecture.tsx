'use client';

import { fileType, uploadFile } from '@/api/file';
import Input from '@/common/input/v1/Input';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Heading3 from '@/domain/admin/ui/heading/Heading3';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { ChallengeType } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { useEffect, useMemo } from 'react';

/**
 * 챌린지 타입별 강의 주제 목록
 * 각 챌린지 타입에 맞는 강의 주제를 정의합니다.
 */
const LECTURE_TOPICS_BY_CHALLENGE_TYPE: Partial<
  Record<ChallengeType, string[]>
> = {
  HR: [
    'HR 직무 뽀개기 + 자기소개서 작성법',
    '주니어가 알아야 하는 People Analytics',
    '채용 직무에서는 이런 사람 선호해요!',
    'IT 대기업의 채용 업무는 이런 것!',
    'IT/스타트업 HR 합격 서류 뽀개기',
    '마케터에서 HR로 직무 전환한 이야기',
  ],
};

function getLectureTopicsByChallengeType(
  challengeType?: ChallengeType,
): string[] | undefined {
  if (!challengeType) return undefined;
  return LECTURE_TOPICS_BY_CHALLENGE_TYPE[challengeType];
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
  const lectureTopics = getLectureTopicsByChallengeType(challengeType);

  const lectures = useMemo(() => content.lectures || [], [content.lectures]);

  // 강의 목록 초기화 (주제 개수만큼)
  useEffect(() => {
    if (!lectureTopics || lectureTopics.length === 0) {
      return;
    }

    if (lectures.length === 0) {
      const initialLectures = lectureTopics.map((topic) => ({
        topic,
        mentorImage: '',
        mentorName: '',
        schedule: '',
        companyLogo: '',
      }));
      setContent((prev) => ({ ...prev, lectures: initialLectures }));
    } else if (lectures.length !== lectureTopics.length) {
      // 주제 개수가 변경된 경우 재초기화
      const initialLectures = lectureTopics.map((topic, index) => {
        // 기존 데이터가 있으면 유지, 없으면 새로 생성
        return (
          lectures[index] || {
            topic,
            mentorImage: '',
            mentorName: '',
            schedule: '',
            companyLogo: '',
          }
        );
      });
      setContent((prev) => ({ ...prev, lectures: initialLectures }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureTopics?.length, lectures.length, setContent]);

  const currentLectures = useMemo(() => {
    if (!lectureTopics || lectureTopics.length === 0) {
      return [];
    }

    if (lectures.length === lectureTopics.length) {
      return lectures;
    }
    // 초기화 중이면 빈 배열 반환 (useEffect에서 처리됨)
    return lectureTopics.map((topic, index) => {
      return (
        lectures[index] || {
          topic,
          mentorImage: '',
          mentorName: '',
          schedule: '',
          companyLogo: '',
        }
      );
    });
  }, [lectures, lectureTopics]);

  if (!lectureTopics || lectureTopics.length === 0) {
    return null;
  }

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
    const updatedLectures = [...currentLectures];
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
    const updatedLectures = [...currentLectures];
    updatedLectures[index] = {
      ...updatedLectures[index],
      companyLogo: url,
    };
    setContent((prev) => ({ ...prev, lectures: updatedLectures }));
  };

  const handleFieldChange = (
    index: number,
    field: 'mentorName' | 'schedule',
    value: string,
  ) => {
    const updatedLectures = [...currentLectures];
    updatedLectures[index] = {
      ...updatedLectures[index],
      [field]: value,
    };
    setContent((prev) => ({ ...prev, lectures: updatedLectures }));
  };

  return (
    <section className="mb-6 flex flex-col gap-4">
      <Heading3>강의 정보 등록</Heading3>
      <div className="grid grid-cols-3 gap-3">
        {lectureTopics.map((topic, index) => {
          const lecture = currentLectures[index] || {
            topic,
            mentorImage: '',
            mentorName: '',
            schedule: '',
            companyLogo: '',
          };

          return (
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
                  {/* 강의 주제 (정적값, 읽기 전용) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xxsmall12 text-neutral-40">
                      강의 주제
                    </label>
                    <div className="rounded-sm border border-neutral-200 bg-neutral-95 px-3 py-2 text-xsmall14 text-neutral-0">
                      {topic}
                    </div>
                  </div>

                  {/* 로고 이미지 + 멘토명/강의일자 (같은 줄) */}
                  <div className="flex flex-row gap-2">
                    {/* 로고 이미지 (왼쪽) */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xxsmall12 text-neutral-40">
                        소속 로고
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
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ChallengeLecture;
