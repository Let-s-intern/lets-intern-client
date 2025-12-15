import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { usePostTalentPoolAttendanceMutation } from '@/api/mission';
import { getPresignedUrl, uploadToS3 } from '@/api/presignedUrl';
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
  const [isDocSubmitting, setIsDocSubmitting] = useState(false);
  const { currentChallenge, refetchSchedules } = useCurrentChallenge();
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const submitTalentPoolAttendance = usePostTalentPoolAttendanceMutation();
  const { data: missionData, refetch: refetchMissionData } =
    useChallengeMissionAttendanceInfoQuery({
      challengeId: currentChallenge?.id,
      missionId,
      enabled: !!currentChallenge?.id && !!missionId,
    });
  const userDocumentInfos = missionData?.userDocumentInfos;

  //  각 미션 생성 시 설정한 개별 마감일 그대로 적용
  const isSubmitPeriodEnded = missionData?.missionInfo?.endDate
    ? missionData.missionInfo.endDate.isBefore(dayjs())
    : true; // endDate가 없으면 마감된 것으로 처리
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
    setIsDocSubmitting(true);

    try {
      const filesToUpload = [
        { type: 'RESUME', file: uploadedFiles.resume },
        { type: 'PORTFOLIO', file: uploadedFiles.portfolio },
        { type: 'PERSONAL_STATEMENT', file: uploadedFiles.personal_statement },
      ].filter((item) => item.file);

      const documentRequests = [];

      // 각 파일 업로드 처리
      for (const { type, file } of filesToUpload) {
        let fileUrl: string;
        let fileName: string;
        let fileNameWithApiUrl: string;

        if (file instanceof File) {
          // 1. Presigned URL 받아오기
          fileNameWithApiUrl = `attendance/pool/${missionId}/${file.name}`;
          const presignedUrl = await getPresignedUrl(type, fileNameWithApiUrl);

          // 2. S3에 직접 업로드
          await uploadToS3(presignedUrl, file);

          // 3. 업로드된 파일의 URL과 이름 저장
          fileUrl = presignedUrl.split('?')[0];
          fileName = file.name;
        } else {
          // 이미 업로드된 파일 (string URL)
          fileUrl = file as string;
          fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        }

        documentRequests.push({
          attendanceId: missionId,
          documentType: type,
          fileUrl,
          fileName,
          wishField: selectedField || '',
          wishJob: selectedPositions.join(','),
          wishIndustry: selectedIndustries.join(','),
        });
      }

      // 서버에 메타데이터 전송
      await submitTalentPoolAttendance.mutateAsync({
        missionId,
        req: documentRequests,
      });

      await refetchMissionData();
      await refetchSchedules?.();
      setShowToast(true);
    } catch (error) {
      console.error('인재풀 미션 제출 중 오류 발생:', error);
      return;
    } finally {
      setIsDocSubmitting(false);
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
          isSubmitted={isSubmitted || isDocSubmitting}
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
            disabled={isSubmitted || isDocSubmitting}
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
