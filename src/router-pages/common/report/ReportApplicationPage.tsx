import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { uploadFile } from '@/api/file';
import {
  convertReportTypeToDisplayName,
  ReportType,
  usePatchMyApplication,
} from '@/api/report';
import useRunOnce from '@/hooks/useRunOnce';
import { ReportTypePathnameEnum } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import BackHeader from '@components/common/ui/BackHeader';
import BottomSheet from '@components/common/ui/BottomSheeet';
import BaseButton from '@components/common/ui/button/BaseButton';
import HorizontalRule from '@components/ui/HorizontalRule';
import ReportSubmitModal from '@components/ui/ReportSubmitModal';
import {
  AdditionalInfoSection,
  CallOut,
  DocumentSection,
  PremiumSection,
  ScheduleSection,
} from './ReportApplyPage';

const ReportApplicationPage = () => {
  const navigate = useNavigate();
  const { reportType, applicationId } = useParams();

  const [applyFile, setApplyFile] = useState<File | null>(null);
  const [recruitmentFile, setRecruitmentFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useAuthStore();
  const {
    data: reportApplication,
    setReportApplication,
    validate,
  } = useReportApplicationStore();

  const { mutateAsync: patchMyApplication } = usePatchMyApplication();

  const convertFile = async () => {
    let applyFileUrl: string | null = null;
    let recruitmentFileUrl: string | null = null;
    // 파일 변환
    if (applyFile) {
      applyFileUrl = await uploadFile({ file: applyFile, type: 'REPORT' });
    }
    if (recruitmentFile) {
      recruitmentFileUrl = await uploadFile({
        file: recruitmentFile,
        type: 'REPORT',
      });
    }
    return { applyFileUrl, recruitmentFileUrl };
  };

  // 파일 state 때문에 별도로 유효성 검사
  const validateFile = () => {
    const { applyUrl, reportPriceType, recruitmentUrl } = reportApplication;

    const isEmpty = (value?: string | File | null) =>
      value === '' || value === null || value === undefined;

    if (isEmpty(applyUrl) && isEmpty(applyFile)) {
      return { message: '진단용 서류를 등록해주세요.', isValid: false };
    }

    if (
      reportPriceType === 'PREMIUM' &&
      reportType !== ReportTypePathnameEnum.enum['personal-statement'] &&
      isEmpty(recruitmentUrl) &&
      isEmpty(recruitmentFile)
    ) {
      return { message: '채용공고를 등록해주세요.', isValid: false };
    }
    return { message: '', isValid: true };
  };

  useRunOnce(() => {
    if (isLoggedIn) return;

    const searchParams = new URLSearchParams();
    searchParams.set('redirect', window.location.pathname);
    navigate(`/login?${searchParams.toString()}`);
  });

  return (
    <div className="mx-auto max-w-[55rem] px-5 md:pb-10 md:pt-5 xl:flex xl:gap-16">
      <div className="w-full">
        <BackHeader to="/report/management">제출하기</BackHeader>

        <section className="mb-8 flex flex-col gap-10">
          <CallOut
            className="bg-neutral-100"
            header="❗ 제출 전 꼭 읽어주세요"
            body={`${convertReportTypeToDisplayName(reportType?.toUpperCase() as ReportType | 'PERSONAL-STATEMENT')} 파일/링크가 잘 열리는 지 확인 후 첨부해주세요!`}
          />

          {/* 진단용 서류 */}
          <DocumentSection file={applyFile} dispatch={setApplyFile} />

          {/* 프리미엄 채용공고 */}
          {reportApplication.reportPriceType === 'PREMIUM' &&
            reportType !==
              ReportTypePathnameEnum.enum['personal-statement'] && (
              <PremiumSection
                file={recruitmentFile}
                dispatch={setRecruitmentFile}
              />
            )}
          <HorizontalRule className="-mx-5 md:-mx-32 lg:mx-0" />

          {/* 1:1 온라인 상담 일정 */}
          {reportApplication.isFeedbackApplied && (
            <>
              <ScheduleSection />
              <HorizontalRule className="-mx-5 md:-mx-32 lg:mx-0" />
            </>
          )}

          {/* 추가 정보 */}
          <AdditionalInfoSection />

          {/* 데스크탑 제출 버튼 */}
          <BaseButton
            className="hidden w-full max-w-[55rem] text-small18 md:block"
            onClick={async () => {
              const { isValid: isValidFile, message: fileValidationMessage } =
                validateFile();

              if (!isValidFile) {
                alert(fileValidationMessage);
                return;
              }

              const { isValid, message } = validate();

              if (!isValid) {
                alert(message);
                return;
              }

              setIsModalOpen(true);
            }}
          >
            제출하기
          </BaseButton>
        </section>
      </div>

      {/* 모바일 바텀시트 */}
      <BottomSheet className="md:hidden">
        <BaseButton
          className="w-full text-small18"
          onClick={async () => {
            const { isValid: isValidFile, message: fileValidationMessage } =
              validateFile();

            if (!isValidFile) {
              alert(fileValidationMessage);
              return;
            }

            const { isValid, message } = validate();

            if (!isValid) {
              alert(message);
              return;
            }

            setIsModalOpen(true);
          }}
        >
          제출하기
        </BaseButton>
      </BottomSheet>

      <ReportSubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isLoading}
        onClickConfirm={async () => {
          setIsLoading(true);
          const { applyFileUrl, recruitmentFileUrl } = await convertFile();
          await patchMyApplication({
            applicationId: Number(applicationId),
            // url 없으면 파일 url 제출
            applyUrl: reportApplication.applyUrl ?? applyFileUrl!,
            recruitmentUrl:
              reportApplication.recruitmentUrl ?? recruitmentFileUrl!,
            desiredDate1: reportApplication.desiredDate1!,
            desiredDate2: reportApplication.desiredDate2!,
            desiredDate3: reportApplication.desiredDate3!,
            wishJob: reportApplication.wishJob,
            message: reportApplication.message,
          });
          alert('제출이 완료되었습니다.');
          navigate('/report/management');
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default ReportApplicationPage;
