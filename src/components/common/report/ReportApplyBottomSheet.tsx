import {
  ActiveReport,
  convertReportPriceTypeToDisplayName,
  convertReportTypeToDisplayName,
  ReportPriceType,
  useGetReportPriceDetail,
} from '@/api/report';
import { generateOrderId } from '@/lib/order';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { FormControl, RadioGroup } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReportFormCheckboxControlLabel,
  ReportFormRadioControlLabel,
} from './ControlLabel';

const ReportApplyBottomSheet = ({ report }: { report: ActiveReport }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: priceInfo } = useGetReportPriceDetail(report.reportId);
  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();

  useEffect(() => {
    console.log('data', reportApplication);
  }, [reportApplication]);

  useEffect(() => {
    if (isDrawerOpen) {
      setReportApplication({ reportId: report.reportId });
    }
  }, [isDrawerOpen, report.reportId, setReportApplication]);

  const { reportPriceType, optionIds, isFeedbackApplied } = reportApplication;

  const setSelectedOptionIds = useCallback(
    (optionIds: number[]) => {
      setReportApplication({ optionIds });
    },
    [setReportApplication],
  );

  const setPriceType = useCallback(
    (reportPriceType: ReportPriceType) => {
      setReportApplication({ reportPriceType });
    },
    [setReportApplication],
  );

  const setDoFeedbackService = useCallback(
    (isFeedbackApplied: boolean) => {
      setReportApplication({ isFeedbackApplied });
    },
    [setReportApplication],
  );

  const navigate = useNavigate();

  const handleApply = useCallback(() => {
    setReportApplication({
      orderId: generateOrderId(),
      reportId: report.reportId,
      // 파일만 초기화
      applyUrl: '',
      recruitmentUrl: '',
    });

    navigate(`/report/apply/${report.reportType}/${report.reportId}`);
  }, [navigate, report.reportId, report.reportType, setReportApplication]);

  if (!priceInfo || !report.reportType) {
    return null;
  }

  return (
    <div className="rounded-t-2xl fixed bottom-0 left-0 right-0 z-20 bg-white shadow-lg transition">
      <div className="mx-auto max-h-[500px] max-w-5xl overflow-y-auto px-5 py-2 sm:max-h-none">
        <div
          className="sticky top-2 z-10 mx-auto mb-2.5 h-[5px] w-16 rounded-full bg-neutral-80"
          onClick={() => {
            setIsDrawerOpen(false);
          }}
        ></div>

        {/* 본문 */}
        {isDrawerOpen ? (
          <div className="mb-5 flex flex-col gap-8">
            {/* 기본 서비스 */}
            <FormControl fullWidth>
              <h2 className="mb-2 text-xsmall14 font-semibold text-static-0">
                기본 서비스
              </h2>
              <p className="text-xxsmall12 text-neutral-45">
                *프리미엄 선택시, 희망하는 채용공고에 맞춤화된 진단을 추가로
                받아볼 수 있어요.
              </p>
              <RadioGroup
                defaultValue="BASIC"
                value={reportPriceType}
                className="my-4"
                onChange={(e) => {
                  setPriceType(e.target.value as ReportPriceType);
                }}
              >
                {priceInfo.reportPriceInfos?.map((item) => {
                  if (!item.reportPriceType) {
                    return null;
                  }

                  const price = item.price ?? 0;
                  const discount = item.discountPrice ?? 0;

                  return (
                    <ReportFormRadioControlLabel
                      key={item.reportPriceType}
                      label={`서류 진단서 (${convertReportPriceTypeToDisplayName(item.reportPriceType)})`}
                      value={item.reportPriceType}
                      right={
                        <span className="text-xsmall14 font-bold text-black/75">
                          {/* TODO: 할인액 적용 */}
                          {price.toLocaleString()} 원
                        </span>
                      }
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>

            {/* 기본 서비스 옵션 */}
            <FormControl fullWidth>
              <h2 className="mb-2 text-xsmall14 font-semibold text-static-0">
                기본 서비스 옵션 (현직자 피드백)
              </h2>
              <p className="text-xxsmall12 text-neutral-45">
                *현직자 피드백 선택시, 현직자 멘토에게 쏠쏠한 서류 작성 꿀팁을
                듣거나 앞으로의 커리어 조언까지 얻어갈 수 있어요.
              </p>
              <div className="my-4 flex flex-col">
                {priceInfo.reportOptionInfos?.map((option) => {
                  const price = option.price ?? 0;
                  const discount = option.discountPrice ?? 0;
                  const checked = Boolean(
                    optionIds.find(
                      (selectedOption) =>
                        selectedOption === option.reportOptionId,
                    ),
                  );

                  return (
                    <ReportFormCheckboxControlLabel
                      key={option.reportOptionId}
                      checked={checked}
                      onChange={(e, checked) => {
                        if (checked) {
                          setSelectedOptionIds([
                            ...optionIds,
                            option.reportOptionId,
                          ]);
                        } else {
                          setSelectedOptionIds(
                            optionIds.filter(
                              (selectedOption) =>
                                selectedOption !== option.reportOptionId,
                            ),
                          );
                        }
                      }}
                      label={option.title}
                      right={
                        <span className="text-xsmall14 font-bold text-black/75">
                          {/* TODO: 할인액 적용 */}+ {price.toLocaleString()} 원
                        </span>
                      }
                    />
                  );
                })}
              </div>
            </FormControl>

            {/* 1:1 피드백 서비스 */}
            <FormControl fullWidth>
              <h2 className="mb-2 text-xsmall14 font-semibold text-static-0">
                1:1 피드백 서비스
              </h2>
              <p className="text-xxsmall12 text-neutral-45">
                *1:1 피드백 선택시, 발급된 진단서를 바탕으로 온라인 미팅에서
                커리어 전문가와 함께 나만의 맞춤형 서류를 완성할 수 있어요.
              </p>
              <ReportFormCheckboxControlLabel
                checked={isFeedbackApplied}
                onChange={(e, checked) => {
                  setDoFeedbackService(checked);
                }}
                label="1:1 피드백 (40분)"
                right={
                  <span className="text-xsmall14 font-bold text-black/75">
                    {/* TODO: 할인액 적용 */}
                    {priceInfo.feedbackPriceInfo?.feedbackPrice?.toLocaleString()}{' '}
                    원
                  </span>
                }
              />
            </FormControl>
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
          <div className="sticky bottom-2 flex items-center gap-2">
            <button
              type="button"
              className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark transition hover:border-primary-light disabled:border-neutral-70 disabled:bg-neutral-70 disabled:text-white"
              onClick={() => setIsDrawerOpen(false)}
            >
              이전 단계로
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:bg-primary-light disabled:border-neutral-70 disabled:bg-neutral-70"
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
