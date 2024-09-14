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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import {
  ReportFormCheckboxControlLabel,
  ReportFormRadioControlLabel,
} from './ControlLabel';

const ReportPriceView = (props: {
  price?: number | null | undefined;
  discount?: number | null | undefined;
}) => {
  const price = props.price ?? 0;
  const discount = props.discount ?? 0;
  const percent = ((discount / price) * 100).toFixed(0);
  const discountedPrice = price - discount;
  const hasDiscount = discount > 0;

  return (
    <div className="flex flex-col items-end">
      {hasDiscount ? (
        <span className="inline-flex gap-1 text-xxsmall12 font-medium leading-none">
          <span className="text-system-error/90">{percent}%</span>
          <span className="text-neutral-50 line-through">
            {price.toLocaleString()}원
          </span>
        </span>
      ) : null}
      <span className="text-xsmall14 font-bold text-black/75">
        {discountedPrice.toLocaleString()}원
      </span>
    </div>
  );
};

interface IReportApplyBottomSheetProps {
  report: ActiveReport;
  show?: boolean;
}

const ReportApplyBottomSheet = React.forwardRef<
  HTMLDivElement,
  IReportApplyBottomSheetProps
>(({ report, show = true }, ref) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: priceInfo } = useGetReportPriceDetail(report.reportId);
  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();

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

    navigate(
      `/report/apply/${report.reportType?.toLowerCase()}/${report.reportId}`,
    );
  }, [navigate, report.reportId, report.reportType, setReportApplication]);

  const reportFinalPrice = useMemo(() => {
    let result = 0;

    const reportPrice = priceInfo?.reportPriceInfos?.find(
      (item) => item.reportPriceType === reportApplication.reportPriceType,
    );

    if (reportPrice) {
      result += reportPrice.price ?? 0;
    }

    result += reportApplication.optionIds.reduce((acc, optionId) => {
      const option = priceInfo?.reportOptionInfos?.find(
        (option) => option.reportOptionId === optionId,
      );

      if (!option) {
        return acc;
      }

      return acc + (option.price ?? 0);
    }, 0);

    return result;
  }, [
    priceInfo?.reportOptionInfos,
    priceInfo?.reportPriceInfos,
    reportApplication,
  ]);

  const reportFinalDiscountPrice = useMemo(() => {
    let result = 0;

    const reportPrice = priceInfo?.reportPriceInfos?.find(
      (item) => item.reportPriceType === reportApplication.reportPriceType,
    );

    if (reportPrice) {
      result += reportPrice.discountPrice ?? 0;
    }

    result += reportApplication.optionIds.reduce((acc, optionId) => {
      const option = priceInfo?.reportOptionInfos?.find(
        (option) => option.reportOptionId === optionId,
      );

      if (!option) {
        return acc;
      }

      return acc + (option.discountPrice ?? 0);
    }, 0);

    return result;
  }, [
    priceInfo?.reportOptionInfos,
    priceInfo?.reportPriceInfos,
    reportApplication,
  ]);

  const feedbackFinalPrice = isFeedbackApplied
    ? (priceInfo?.feedbackPriceInfo?.feedbackPrice ?? 0)
    : 0;
  const feedbackFinalDiscountPrice = isFeedbackApplied
    ? (priceInfo?.feedbackPriceInfo?.feedbackDiscountPrice ?? 0)
    : 0;

  if (!priceInfo || !report.reportType) {
    return null;
  }

  const optionsAvailable =
    priceInfo.reportOptionInfos && priceInfo.reportOptionInfos.length > 0;

  const feedbackAvailable =
    !priceInfo.feedbackPriceInfo ||
    priceInfo.feedbackPriceInfo.feedbackPrice !== -1;

  const reportType = window.location.pathname.split('/')[3];

  return (
    <div
      ref={ref}
      className={twMerge(
        'shadow-lg fixed bottom-0 left-1/2 z-40 mx-auto w-full max-w-5xl -translate-x-1/2 rounded-t-xl border-t border-neutral-0/5 bg-white transition',
        !show && 'hidden',
      )}
    >
      <div className="max-h-[calc(100vh-60px)] overflow-y-auto px-5 py-2">
        {isDrawerOpen ? (
          <div
            className="sticky top-2 z-10 mx-auto mb-2.5 h-[5px] w-16 rounded-full bg-neutral-80"
            onClick={() => {
              setIsDrawerOpen(false);
            }}
          ></div>
        ) : null}

        {/* 본문 */}
        {isDrawerOpen ? (
          <div className="mb-5 flex flex-col gap-6">
            {/* 기본 서비스 */}
            <FormControl fullWidth>
              <h2 className="mb-2 text-xsmall14 font-semibold text-static-0">
                기본 서비스
              </h2>
              {reportType !== 'personal-statement' && (
                <p className="mb-2 text-xxsmall12 text-neutral-45">
                  *프리미엄 선택시, 희망하는 채용공고에 맞춤화된 진단을 추가로
                  받아볼 수 있어요.
                </p>
              )}
              <RadioGroup
                defaultValue="BASIC"
                value={reportPriceType}
                className="mb-2"
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
                      wrapperClassName="items-end py-2"
                      right={
                        <ReportPriceView price={price} discount={discount} />
                      }
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>

            {/* 기본 서비스 옵션 */}
            {optionsAvailable ? (
              <FormControl fullWidth>
                <h2 className="mb-2 text-xsmall14 font-semibold text-static-0">
                  기본 서비스 옵션 (
                  {reportType !== 'personal-statement'
                    ? '현직자 피드백'
                    : '문항 추가'}
                  )
                </h2>
                {reportType !== 'personal-statement' && (
                  <p className="mb-2 text-xxsmall12 text-neutral-45">
                    *현직자 피드백 선택시, 현직자 멘토에게 쏠쏠한 서류 작성
                    꿀팁을 듣거나 앞으로의 커리어 조언까지 얻어갈 수 있어요.
                  </p>
                )}
                <div className="mb-2 flex flex-col">
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
                        wrapperClassName="items-end py-2"
                        label={option.title}
                        right={
                          <ReportPriceView price={price} discount={discount} />
                        }
                      />
                    );
                  })}
                </div>
              </FormControl>
            ) : null}

            {/* 1:1 피드백 서비스 */}
            {feedbackAvailable ? (
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
                  wrapperClassName="items-end py-2"
                  label="1:1 피드백 (40분)"
                  right={
                    <ReportPriceView
                      price={priceInfo.feedbackPriceInfo?.feedbackPrice}
                      discount={
                        priceInfo.feedbackPriceInfo?.feedbackDiscountPrice
                      }
                    />
                  }
                />
              </FormControl>
            ) : null}

            <div>
              <h2 className="mb-2 text-xsmall14 font-semibold text-static-0">
                총 결제 금액
              </h2>
              <div className="flex items-end justify-between py-2">
                <span className="text-xsmall14 font-medium text-neutral-0/75">
                  서류 진단서
                </span>
                <ReportPriceView
                  price={reportFinalPrice}
                  discount={reportFinalDiscountPrice}
                />
              </div>

              {feedbackAvailable ? (
                <div className="flex items-end justify-between py-2">
                  <span className="text-xsmall14 font-medium text-neutral-0/75">
                    1:1 피드백
                  </span>
                  <ReportPriceView
                    price={feedbackFinalPrice}
                    discount={feedbackFinalDiscountPrice}
                  />
                </div>
              ) : null}

              <hr className="my-4 border-neutral-0/5" />
              <div className="flex items-end justify-between py-2">
                <span></span>
                <span className="text-xsmall14 font-bold text-black/75">
                  {(
                    reportFinalPrice +
                    feedbackFinalPrice -
                    reportFinalDiscountPrice -
                    feedbackFinalDiscountPrice
                  ).toLocaleString()}
                  원
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {!isDrawerOpen ? (
          <button
            type="button"
            className="apply_button_click flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:bg-primary-light disabled:border-neutral-70 disabled:bg-neutral-70"
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
              className="next_button_click flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:bg-primary-light disabled:border-neutral-70 disabled:bg-neutral-70"
            >
              결제하기
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
});

ReportApplyBottomSheet.displayName = 'ReportApplyBottomSheet';

export default ReportApplyBottomSheet;
