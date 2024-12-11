import { FormControl, RadioGroup } from '@mui/material';
import React, {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ActiveReport,
  convertReportTypeToDisplayName,
  ReportPriceType,
  reportPriceTypeEnum,
  reportTypeSchema,
  useGetReportPriceDetail,
} from '@/api/report';
import { generateOrderId } from '@/lib/order';
import { twMerge } from '@/lib/twMerge';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import clsx from 'clsx';
import {
  ReportFormCheckboxControlLabel,
  ReportFormRadioControlLabel,
} from './ControlLabel';
import ReportDropdown from './ReportDropdown';

const { BASIC, PREMIUM } = reportPriceTypeEnum.enum;

const priceTypeByPlan = {
  basicFeedback: BASIC,
  premiumFeedback: PREMIUM,
  basic: BASIC,
  premium: PREMIUM,
} as Record<string, ReportPriceType>;

const RADIO_CONTROL_LABEL_STYLE = { opacity: 0.75 };

const ReportPriceView = memo(function ReportPriceView(props: {
  price?: number | null;
  discount?: number | null;
}) {
  const price = props.price ?? 0;
  const discount = props.discount ?? 0;
  const percent = ((discount / price) * 100).toFixed(0);
  const discountedPrice = price - discount;
  const hasDiscount = discount > 0;

  return (
    <div className="flex shrink-0 flex-col items-end">
      {hasDiscount && (
        <span className="inline-flex gap-1 text-xxsmall12 font-medium leading-none">
          <span className="text-system-error/90">{percent}%</span>
          <span className="text-neutral-50 line-through">
            {price.toLocaleString()}원
          </span>
        </span>
      )}

      <span className="text-xsmall14 font-bold text-black/75">
        {discountedPrice.toLocaleString()}원
      </span>
    </div>
  );
});

interface ReportApplyBottomSheetProps {
  report: ActiveReport;
  show?: boolean;
}

const ReportApplyBottomSheet = React.forwardRef<
  HTMLDivElement,
  ReportApplyBottomSheetProps
>(({ report, show = true }, ref) => {
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: priceInfo } = useGetReportPriceDetail(report.reportId);
  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();

  console.log('신청서:', reportApplication);

  const { reportPriceType, optionIds, isFeedbackApplied } = reportApplication;

  const reportDisplayName = convertReportTypeToDisplayName(report.reportType);

  // 이력서 진단 플랜 Radio 정보
  const reportDiagnosisPlan = useMemo(() => {
    const reportBasicInfo = priceInfo?.reportPriceInfos?.find(
      (info) => info.reportPriceType === BASIC,
    );
    const reportPremiumInfo = priceInfo?.reportPriceInfos?.find(
      (info) => info.reportPriceType === PREMIUM,
    );
    const feedbackInfo = priceInfo?.feedbackPriceInfo;

    const basicLabel = `베이직 플랜${report.reportType === reportTypeSchema.enum.PERSONAL_STATEMENT ? '(1문항)' : ''}`;
    const premiumLabel = `프리미엄 플랜(${report.reportType === reportTypeSchema.enum.PERSONAL_STATEMENT ? '4문항+총평 페이지 추가' : '채용 공고 맞춤 진단 추가'})`;

    return [
      {
        value: 'basicFeedback',
        label: '[추천] 베이직 + 1:1 피드백(40분) 패키지',
        price:
          (reportBasicInfo?.price ?? 0) + (feedbackInfo?.feedbackPrice ?? 0),
        discount:
          (reportBasicInfo?.discountPrice ?? 0) +
          (feedbackInfo?.feedbackDiscountPrice ?? 0),
      },
      {
        value: 'premiumFeedback',
        label: '[추천] 프리미엄 + 1:1 피드백(40분) 패키지',
        price:
          (reportPremiumInfo?.price ?? 0) + (feedbackInfo?.feedbackPrice ?? 0),
        discount:
          (reportPremiumInfo?.discountPrice ?? 0) +
          (feedbackInfo?.feedbackDiscountPrice ?? 0),
      },
      {
        value: 'basic',
        label: basicLabel,
        price: reportBasicInfo?.price,
        discount: reportBasicInfo?.discountPrice,
      },
      {
        value: 'premium',
        label: premiumLabel,
        price: reportPremiumInfo?.price,
        discount: reportPremiumInfo?.discountPrice,
      },
    ];
  }, [priceInfo]);

  useEffect(() => {
    if (isDrawerOpen) {
      setReportApplication({ reportId: report.reportId });
    }
  }, [isDrawerOpen, report.reportId, setReportApplication]);

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

  const setFeedbackService = useCallback(
    (isFeedbackApplied: boolean) => {
      setReportApplication({ isFeedbackApplied });
    },
    [setReportApplication],
  );

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
        'fixed bottom-0 left-1/2 z-40 mx-auto w-full max-w-3xl -translate-x-1/2 rounded-t-xl border-t border-neutral-0/5 bg-white shadow-lg transition',
        !show && 'hidden',
      )}
    >
      <div className="relative max-h-[calc(100vh-60px)] overflow-y-auto px-5">
        {/* 상단 닫기 버튼 */}
        {isDrawerOpen && (
          <div className="sticky top-0 z-10 mb-2 w-full bg-white py-2">
            <div
              className="mx-auto h-[5px] w-16 rounded-full bg-neutral-80"
              onClick={() => setIsDrawerOpen(false)}
            />
          </div>
        )}

        {/* 본문 */}
        {isDrawerOpen ? (
          <div className="mb-5 flex flex-col gap-6">
            {/* 이력서 진단 플랜 */}
            <FormControl fullWidth>
              <Heading2>{reportDisplayName} 진단 플랜 선택 (필수)*</Heading2>
              <ReportDropdown
                title={`합격을 이끄는 ${reportDisplayName} 진단 플랜`}
                labelId="resume-diagnosis-plan-group-label"
              >
                <RadioGroup
                  aria-labelledby="resume-diagnosis-plan-group-label"
                  defaultValue="basicFeedback"
                  onChange={(e) => {
                    {
                      const isFeedbackApplied = e.target.value.endsWith(
                        'Feedback',
                      )
                        ? true
                        : false;
                      // 서류진단 가격 유형 설정 (BASIC, PREMIUM)
                      setPriceType(priceTypeByPlan[e.target.value]);
                      setFeedbackService(isFeedbackApplied);
                    }
                  }}
                >
                  {reportDiagnosisPlan.map((item, index) => (
                    <ReportFormRadioControlLabel
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      wrapperClassName={clsx('py-3 pl-2 pr-3', {
                        // 마지막 아이템은 border 제외
                        'border-b border-neutral-80':
                          index !== reportDiagnosisPlan.length - 1,
                      })}
                      labelStyle={RADIO_CONTROL_LABEL_STYLE}
                      right={
                        <ReportPriceView
                          price={item.price}
                          discount={item.discount}
                        />
                      }
                    />
                  ))}
                </RadioGroup>
              </ReportDropdown>
            </FormControl>

            {/* 기본 서비스 옵션 */}
            {optionsAvailable ? (
              <FormControl fullWidth>
                <Heading2>현직자 피드백 (선택)</Heading2>
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
          <div className="bg-white pb-2">
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
          </div>
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

const Heading2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-4 text-xsmall14 font-semibold text-static-0">{children}</h2>
);

ReportApplyBottomSheet.displayName = 'ReportApplyBottomSheet';

export default ReportApplyBottomSheet;
