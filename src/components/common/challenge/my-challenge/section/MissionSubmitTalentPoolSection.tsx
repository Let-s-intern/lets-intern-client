import { useSubmitMission } from '@/api/attendance';
import { usePostMissionTalentPoolMutation } from '@/api/mission';
import { DocumentType } from '@/api/missionSchema';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { clsx } from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import MissionSubmitButton from '../mission/MissionSubmitButton';
import MissionToast from '../mission/MissionToast';
import WishConditionInputSection from '../talent-pool/WishConditionInputSection';
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
  const { currentChallenge, refetchSchedules } = useCurrentChallenge();
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const submitMissionTalentPool = usePostMissionTalentPoolMutation();
  const submitAttendance = useSubmitMission();

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

  const [showToast, setShowToast] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    resume: null,
    portfolio: null,
    personal_statement: null,
  });

  const isSubmitted = attendanceInfo?.submitted ?? false;

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

    let attendanceId: number | undefined;
    try {
      // 단순 출석 체크용
      const attendanceResponse = await submitAttendance.mutateAsync({
        missionId,
        link: null,
        review: null,
      });
      attendanceId = attendanceResponse.data.attendanceId; // 응답에서 ID 추출
    } catch (error) {
      console.error('출석 체크 중 오류 발생:', error);
      alert('출석 체크에 실패했습니다. 다시 시도해주세요.');
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
        new Blob(
          [
            JSON.stringify({
              documentType: type,
              fileUrl: '',
              attendanceId,
              wishField: selectedField,
              wishJob: selectedPositions.join(','),
              wishIndustry: selectedIndustries.join(','),
            }),
          ],
          {
            type: 'application/json',
          },
        ),
      );
      formData.append('file', file as File);
      return formData;
    });

    try {
      await Promise.all(
        formDataList.map((formData) =>
          submitMissionTalentPool.mutateAsync(formData),
        ),
      );
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
      return;
    }
  };

  const initValues = useCallback(() => {
    setIsAgreed(attendanceInfo?.submitted ?? false);
  }, [attendanceInfo]);

  useEffect(() => {
    /** 상태 초기화 */
    initValues();
  }, [attendanceInfo, initValues]);

  return (
    <>
      <section className={clsx('', className)}>
        <h2 className="mb-6 text-small18 font-semibold text-neutral-0">
          인재풀 등록하기
        </h2>
        {/* 희망 조건 입력 영역 */}
        <WishConditionInputSection
          selectedField={selectedField}
          selectedPositions={selectedPositions}
          selectedIndustries={selectedIndustries}
          isSubmitted={isSubmitted}
          onFieldChange={setSelectedField}
          onPositionsChange={setSelectedPositions}
          onIndustriesChange={setSelectedIndustries}
        />

        {/* 서류 업로드 영역 */}
        <DocumentUploadSection
          className="mb-6"
          uploadedFiles={uploadedFiles}
          onFilesChange={handleFilesChange}
          isSubmitted={isSubmitted}
        />

        {/* 개인정보 수집 활용 동의서 */}
        <PersonalInfoConsent
          checked={isAgreed}
          onChange={setIsAgreed}
          disabled={isSubmitted}
        />

        {!isSubmitPeriodEnded && (
          <MissionSubmitButton
            isSubmitted={isSubmitted}
            hasContent={canSubmit}
            onButtonClick={handleSubmit}
            isEditing={false}
            disabled={isSubmitted}
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
