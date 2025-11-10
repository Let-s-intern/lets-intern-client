import { useSubmitMission } from '@/api/attendance';
import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { usePostMissionTalentPoolMutation } from '@/api/mission';
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
  const { data: missionData, refetch: refetchMissionData } =
    useChallengeMissionAttendanceInfoQuery({
      challengeId: currentChallenge?.id,
      missionId,
      enabled: !!currentChallenge?.id && !!missionId,
    });
  const userDocumentInfos = missionData?.userDocumentInfos;

  // 챌린지 종료 + 2일
  const isSubmitPeriodEnded =
    dayjs(currentChallenge?.endDate).add(2, 'day').isBefore(dayjs()) ?? true;

  const [showToast, setShowToast] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    resume: null,
    portfolio: null,
    personal_statement: null,
  });

  const isSubmitted = attendanceInfo?.submitted ?? false;
  // 제출 버튼 활성화 조건: 필수 항목 입력 완료 시 활성화
  const canSubmit =
    isAgreed &&
    !!uploadedFiles.resume &&
    !!uploadedFiles.portfolio &&
    !!selectedField &&
    selectedPositions.length > 0 &&
    selectedIndustries.length > 0;

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
      attendanceId = attendanceResponse.data.data.attendanceId;
    } catch (error) {
      console.error('출석 체크 중 오류 발생:', error);
      return;
    }

    // 새롭게 업로드된 파일들만 필터링
    const filesToUpload = [
      { type: 'RESUME', file: uploadedFiles.resume },
      { type: 'PORTFOLIO', file: uploadedFiles.portfolio },
      { type: 'PERSONAL_STATEMENT', file: uploadedFiles.personal_statement },
    ].filter((item) => item.file);

    // 각 파일을 formData 형식으로 변환
    const formDataList = filesToUpload.map(({ type, file }) => {
      const formData = new FormData();
      const isFileObject = file instanceof File;

      const requestData = {
        documentType: type,
        fileUrl: isFileObject ? null : file,
        attendanceId,
        wishField: selectedField,
        wishJob: selectedPositions.join(','),
        wishIndustry: selectedIndustries.join(','),
      };

      formData.append(
        'requestDto',
        new Blob([JSON.stringify(requestData)], { type: 'application/json' }),
      );
      if (isFileObject) {
        formData.append('file', file);
      }
      return formData;
    });

    try {
      await Promise.all(
        formDataList.map((formData) =>
          submitMissionTalentPool.mutateAsync(formData),
        ),
      );
      await refetchMissionData();
      await refetchSchedules?.();
      setShowToast(true);
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
      return;
    }
  };

  const initValues = useCallback(() => {
    if (!attendanceInfo?.submitted) {
      setIsAgreed(false);
      setSelectedField(null);
      setSelectedPositions([]);
      setSelectedIndustries([]);
      setUploadedFiles({
        resume: null,
        portfolio: null,
        personal_statement: null,
      });
      return;
    }

    setIsAgreed(attendanceInfo?.submitted ?? false);

    if (
      attendanceInfo?.submitted &&
      userDocumentInfos &&
      userDocumentInfos.length > 0
    ) {
      const firstDoc = userDocumentInfos[0];
      if (firstDoc.wishField) setSelectedField(firstDoc.wishField);
      if (firstDoc.wishJob) setSelectedPositions(firstDoc.wishJob.split(','));
      if (firstDoc.wishIndustry)
        setSelectedIndustries(firstDoc.wishIndustry.split(','));

      // 파일 URL 설정
      const newUploadedFiles = userDocumentInfos.reduce<UploadedFiles>(
        (acc, doc) => {
          if (!doc.fileUrl) {
            return acc;
          }
          switch (doc.userDocumentType) {
            case 'RESUME':
              acc.resume = doc.fileUrl;
              break;
            case 'PORTFOLIO':
              acc.portfolio = doc.fileUrl;
              break;
            case 'PERSONAL_STATEMENT':
              acc.personal_statement = doc.fileUrl;
              break;
          }
          return acc;
        },
        { resume: null, portfolio: null, personal_statement: null },
      );

      setUploadedFiles(newUploadedFiles);
    }
  }, [attendanceInfo, userDocumentInfos]);

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
          className="mb-12"
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
