import { usePostMissionTalentPoolMutation } from '@/api/mission';
import { DocumentType } from '@/api/missionSchema';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { clsx } from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import MissionSubmitButton from '../mission/MissionSubmitButton';
import MissionToast from '../mission/MissionToast';
import DocumentUploadSection from './DocumentUploadSection';
import PersonalInfoConsent from './PersonalInfoConsent';

export interface UploadedFiles {
  resume: File | string | null;
  portfolio: File | string | null;
  personal_statement: File | string | null;
}

export type UploadedFileType = keyof UploadedFiles;

interface MissionSubmitTalentPoolSectionProps {
  className?: string;
  missionId?: number;
  attendanceInfo?: Schedule['attendanceInfo'] | null;
}

const MissionSubmitTalentPoolSection = ({
  className,
  missionId,
  attendanceInfo,
}: MissionSubmitTalentPoolSectionProps) => {
  const { currentChallenge } = useCurrentChallenge();
  const submitMissionTalentPool = usePostMissionTalentPoolMutation();

  // 챌린지 종료 + 2일
  const isSubmitPeriodEnded =
    dayjs(currentChallenge?.endDate).add(2, 'day').isBefore(dayjs()) ?? true;

  // 재제출 불가
  const isResubmitBlocked =
    attendanceInfo?.result === 'PASS' ||
    attendanceInfo?.result === 'FINAL_WRONG' ||
    (attendanceInfo?.result === 'WAITING' &&
      (attendanceInfo?.status === 'LATE' ||
        attendanceInfo?.status === 'UPDATED'));

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    resume: null,
    portfolio: null,
    personal_statement: null,
  });

  // 제출 버튼 활성화 조건: 필수 항목(이력서, 포트폴리오 + 개인정보 동의) 입력 완료 시 활성화
  const canSubmit =
    isAgreed && !!uploadedFiles.resume && !!uploadedFiles.portfolio;

  const handleFilesChange = (files: UploadedFiles) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async () => {
    if (!missionId) {
      console.error('미션 ID가 없습니다.');
      return;
    }

    // 새롭게 업로드된 파일들만 필터링
    const filesToUpload = [
      { type: 'RESUME' as DocumentType, file: uploadedFiles.resume },
      { type: 'PORTFOLIO' as DocumentType, file: uploadedFiles.portfolio },
      {
        type: 'PERSONAL_STATEMENT' as DocumentType,
        file: uploadedFiles.personal_statement,
      },
    ].filter(
      (item): item is { type: DocumentType; file: File } =>
        item.file instanceof File,
    ); // File 객체인 경우만 (새로 업로드된 파일)

    // 각 파일을 formData 형식으로 변환
    const formDataList = filesToUpload.map(({ type, file }) => {
      const formData = new FormData();
      formData.append(
        'requestDto',
        new Blob([JSON.stringify({ documentType: type, fileUrl: file })], {
          type: 'application/json',
        }),
      );
      formData.append('file', file as File);
      return formData;
    });

    try {
      // TODO: 에러 처리
      await Promise.all(
        formDataList.map((formData) =>
          submitMissionTalentPool.mutate(formData),
        ),
      );
      setIsSubmitted(true);
      setShowToast(true);
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
    }
  };

  const initValues = useCallback(() => {
    setIsAgreed(attendanceInfo?.submitted ?? false);
    setIsSubmitted(attendanceInfo?.submitted ?? false);
  }, [attendanceInfo]);

  useEffect(() => {
    /** 상태 초기화 */
    initValues();
  }, [attendanceInfo, initValues]);

  return (
    <>
      <section className={clsx('', className)}>
        <h2 className="mb-1 text-small18 font-bold text-neutral-0">
          인재풀 등록하기
        </h2>

        {/* 희망 조건 입력 영역 */}

        {/* 서류 업로드 영역 */}
        <DocumentUploadSection
          className="mb-6"
          uploadedFiles={uploadedFiles}
          onFilesChange={handleFilesChange}
        />

        {/* 개인정보 수집 활용 동의서 */}
        <PersonalInfoConsent checked={isAgreed} onChange={setIsAgreed} />

        {!isSubmitPeriodEnded && (
          <MissionSubmitButton
            isSubmitted={isSubmitted}
            hasContent={canSubmit}
            onButtonClick={handleSubmit}
            isEditing={false}
            disabled={isResubmitBlocked}
          />
        )}

        <MissionToast
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </section>
    </>
  );
};

export default MissionSubmitTalentPoolSection;
