'use client';

import { ReportDetail, useGetReportPriceDetail } from '@/api/report';
import PromoSection from '@/common/report/PromoSection';
import ReportApplyBottomSheet from '@/common/report/ReportApplyBottomSheet';
import ReportBasicInfo from '@/common/report/ReportBasicInfo';
import ReportExampleSection from '@/common/report/ReportExampleSection';
import ReportFaqSection from '@/common/report/ReportFaqSection';
import ReportIntroSection from '@/common/report/ReportIntroSection';
import ReportPlanSection from '@/common/report/ReportPlanSection';
import ReportProgramRecommendSlider from '@/common/report/ReportProgramRecommendSlider';
import ReportReviewSection from '@/common/report/ReportReviewSection';
import ServiceProcessSection from '@/common/report/ServiceProcessSection';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { ReportContent } from '@/types/interface';
import { useEffect } from 'react';
import ReportNavigation from './ReportNavigation';

export const resumeColors = {
  E8FDF2: '#E8FDF2',
  B1FFD6: '#B1FFD6',
  A5FFCF: '#A5FFCF',
  _4FDA46: '#4FDA46',
  _2CE282: '#2CE282',
  _06B259: '#06B259',
  D8E36C: '#D8E36C',
  F7FFAB: '#F7FFAB',
  _14BCFF: '#14BCFF',
  EEFAFF: '#EEFAFF',
  _2CDDEA: '#2CDDEA',
  _11AC5C: '#11AC5C',
};

const ReportResumePage = ({ report }: { report: ReportDetail | null }) => {
  const resumeContent: ReportContent = JSON.parse(report?.contents ?? '{}');

  const { data: priceDetail, isLoading: priceIsLoading } =
    useGetReportPriceDetail(report?.reportId);

  const { initReportApplication } = useReportApplicationStore();

  useEffect(() => {
    initReportApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full flex-col bg-black pb-10 text-white md:pb-[60px]">
          <div className="mx-auto flex w-full max-w-[1000px] flex-col px-5 lg:px-0">
            <div className="h-[56px] md:h-[66px]" />
            <ReportBasicInfo
              reportBasic={report}
              color={resumeColors._2CE282}
            />
          </div>
        </div>

        <ReportNavigation
          color={resumeColors._2CE282}
          isDark
          isReady={!priceIsLoading}
        />

        <div
          id="content"
          data-page-type="resume"
          className="flex w-full flex-col items-center"
        >
          {/* 서비스 소개 */}
          <ReportIntroSection type="RESUME" />
          {/* 리포트 예시 */}
          <ReportExampleSection
            type="RESUME"
            reportExample={resumeContent.reportExample}
          />
          {/* 후기 */}
          <ReportReviewSection
            type="RESUME"
            reportReview={resumeContent.review}
          />
          {/* 가격 및 플랜 */}
          {priceDetail && (
            <ReportPlanSection priceDetail={priceDetail} reportType="RESUME" />
          )}
          {/* 홍보 배너  */}
          <PromoSection reportType="RESUME" />
          {/* 서비스 이용 안내 */}
          <ServiceProcessSection reportType="RESUME" />
          {/* FAQ  */}
          {report?.reportId && (
            <ReportFaqSection reportType="RESUME" reportId={report?.reportId} />
          )}
          {/* 프로그램 추천 */}
          {resumeContent.reportProgramRecommend && (
            <ReportProgramRecommendSlider
              reportType="RESUME"
              reportProgramRecommend={resumeContent.reportProgramRecommend}
            />
          )}
        </div>
      </div>

      {report && priceDetail && (
        <ReportApplyBottomSheet report={report} priceDetail={priceDetail} />
      )}
    </>
  );
};

export default ReportResumePage;
