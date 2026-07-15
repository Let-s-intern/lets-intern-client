'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { uploadFile } from '@/api/file';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import BaseButton from '@/common/button/BaseButton';
import BackHeader from '@/common/header/BackHeader';
import HorizontalRule from '@/common/HorizontalRule';
import BottomSheet from '@/common/sheet/BottomSheeet';
import { AdditionalInfoSection } from '@/domain/report/apply/AdditionalInfoSection';
import { CallOut } from '@/domain/report/apply/CallOut';
import { DocumentSection } from '@/domain/report/apply/DocumentSection';
import { PremiumSection } from '@/domain/report/apply/PremiumSection';
import { ProgramInfoSection } from '@/domain/report/apply/ProgramInfoSection';
import { ScheduleSection } from '@/domain/report/apply/ScheduleSection';
import { ReportTypePathnameEnum } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import useReportApplicationStore from '@/store/useReportApplicationStore';

const ReportApplyPageContent = () => {
  const router = useRouter();
  const params = useParams<{ reportType: string; reportId: string }>();
  const { reportType, reportId } = params;

  const [applyFile, setApplyFile] = useState<File | null>(null);
  const [recruitmentFile, setRecruitmentFile] = useState<File | null>(null);
  const [isSubmitNow, setIsSubmitNow] = useState('true');

  const { isLoggedIn, isInitialized } = useAuthStore();

  const {
    data: reportApplication,
    setReportApplication,
    validate,
  } = useReportApplicationStore();

  const convertFile = async () => {
    // 파일 변환
    if (applyFile) {
      const url = await uploadFile({ file: applyFile, type: 'REPORT' });
      setReportApplication({ applyUrl: url });
    }
    if (recruitmentFile) {
      const url = await uploadFile({ file: recruitmentFile, type: 'REPORT' });
      setReportApplication({ recruitmentUrl: url });
    }
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

  useEffect(() => {
    if (!isInitialized) return;

    if (isLoggedIn) return;

    const searchParams = new URLSearchParams();
    searchParams.set('redirect', window.location.pathname);
    router.push(`/login?${searchParams.toString()}`);
  }, [isInitialized, isLoggedIn, router]);

  return (
    <div className="mx-auto max-w-[55rem] px-5 md:pb-10 md:pt-5 lg:px-0 xl:flex xl:gap-16">
      <div className="w-full">
        <BackHeader to={`/report/landing/${reportType}`}>
          진단서 신청하기
        </BackHeader>

        <main className="mb-8 mt-6 flex flex-col gap-10">
          {/* 프로그램 정보 */}
          <ProgramInfoSection
            onChangeRadio={(_, value) => setIsSubmitNow(value)}
          />

          {/* '지금 제출할래요' 선택 시 표시 */}
          {isSubmitNow === 'true' && (
            <>
              <HorizontalRule className="-mx-5 lg:mx-0" />
              <CallOut
                className="bg-neutral-100"
                header="❗ 제출 전 꼭 읽어주세요"
                body="이력서 파일/링크가 잘 열리는 지 확인 후 첨부해주세요!"
              />
              {/* 진단용 서류 */}
              <DocumentSection file={applyFile} dispatch={setApplyFile} />
              {/* 프리미엄 채용공고 */}
              {reportType !== 'personal-statement' &&
                reportApplication.reportPriceType === 'PREMIUM' && (
                  <PremiumSection
                    file={recruitmentFile}
                    dispatch={setRecruitmentFile}
                  />
                )}
              <HorizontalRule className="-mx-5 lg:mx-0" />
              {/* 1:1 온라인 상담 일정 */}
              {reportApplication.isFeedbackApplied && (
                <>
                  <ScheduleSection />
                  <HorizontalRule className="-mx-5 lg:mx-0" />
                </>
              )}

              {/* 추가 정보 */}
              <AdditionalInfoSection />
            </>
          )}

          {/* 데스크탑에서 표시 */}
          <BaseButton
            className="hidden w-full md:block"
            onClick={async () => {
              // 지금 제출일 때만 파일 유효성 검사
              if (isSubmitNow === 'true') {
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
              }

              // 지금 제출일 때만 파일 업로드
              if (isSubmitNow === 'true') await convertFile();

              router.push(`/report/payment/${reportType}/${reportId}`);
            }}
          >
            다음
          </BaseButton>
        </main>
      </div>

      <BottomSheet variant="footer" className="mx-auto max-w-[55rem] md:hidden">
        <BaseButton
          className="w-full"
          onClick={async () => {
            // 지금 제출일 때만 파일 유효성 검사
            if (isSubmitNow === 'true') {
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
            }

            // 지금 제출일 때만 파일 업로드
            if (isSubmitNow === 'true') await convertFile();

            router.push(`/report/payment/${reportType}/${reportId}`);
          }}
        >
          다음
        </BaseButton>
      </BottomSheet>
    </div>
  );
};

const ReportApplyPage = () => {
  return (
    <AsyncBoundary>
      <ReportApplyPageContent />
    </AsyncBoundary>
  );
};

export default ReportApplyPage;
