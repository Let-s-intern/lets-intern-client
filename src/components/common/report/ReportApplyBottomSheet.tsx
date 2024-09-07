import { useState } from 'react';
import {
  ActiveReport,
  convertReportTypeToDisplayName,
} from '../../../api/report';

const ReportApplyBottomSheet = ({ report }: { report: ActiveReport }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="rounded-t-2xl fixed bottom-0 left-0 right-0 bg-white shadow-lg transition">
      <div className="mx-auto max-w-5xl px-5 py-2">
        <div className="mx-auto mb-2.5 h-[5px] w-16 rounded-full bg-neutral-80"></div>

        {/* 본문 */}
        {isDrawerOpen ? (
          <div>
            <p>asdf</p>
            <p>zxcv</p>
            <p>asdf</p>
            <p>zxcv</p>
            <p>asdf</p>
            <p>zxcv</p>
            <p>asdf</p>
            <p>zxcv</p>
          </div>
        ) : null}

        {!isDrawerOpen ? (
          <button
            type="button"
            className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:bg-primary-light disabled:border-neutral-70 disabled:bg-neutral-70"
            onClick={() => setIsDrawerOpen(true)}
          >
            {report.reportType
              ? convertReportTypeToDisplayName(report.reportType || 'RESUME')
              : ''}{' '}
            서류 진단 신청하기
          </button>
        ) : null}

        {isDrawerOpen ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark transition hover:border-primary-light disabled:border-neutral-70 disabled:bg-neutral-70 disabled:text-white"
              onClick={() => setIsDrawerOpen(false)}
              // disabled={contentIndex === 0}
              // TODO: 초기화까지 진행
            >
              이전 단계로
            </button>
            <button
              type="button"
              className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:bg-primary-light disabled:border-neutral-70 disabled:bg-neutral-70"
              // onClick={handleNextButtonClick}
              // disabled={buttonDisabled}
            >
              결제하기
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReportApplyBottomSheet;
