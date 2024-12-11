import { FormControl, FormGroup, RadioGroup } from '@mui/material';
import React, {
  memo,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { IoCloseCircle } from 'react-icons/io5';
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
import { default as BaseButton } from '../ui/button/BaseButton';
import {
  ReportFormCheckboxControlLabel,
  ReportFormRadioControlLabel,
} from './ControlLabel';
import ReportDropdown from './ReportDropdown';

const { BASIC, PREMIUM } = reportPriceTypeEnum.enum;
const { RESUME, PERSONAL_STATEMENT } = reportTypeSchema.enum;

const REPORT_RADIO_VALUES = {
  basicFeedback: 'basicFeedback',
  premiumFeedback: 'premiumFeedback',
  basic: 'basic',
  premium: 'premium',
} as const;

const priceTypeByPlan = {
  [REPORT_RADIO_VALUES.basicFeedback]: BASIC,
  [REPORT_RADIO_VALUES.premiumFeedback]: PREMIUM,
  [REPORT_RADIO_VALUES.basic]: BASIC,
  [REPORT_RADIO_VALUES.premium]: PREMIUM,
} as Record<string, ReportPriceType>;

const RADIO_CONTROL_LABEL_STYLE = { opacity: 0.75 };

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

  const { optionIds, isFeedbackApplied } = reportApplication;

  useEffect(() => {
    // 드롭다운 열면 reportId 설정
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

  const onClickApply = useCallback(() => {
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

  const generateControlLabelClassName = (isLastChild: boolean) =>
    clsx('py-3 pl-2 pr-3', {
      // 마지막 아이템은 border 제외
      'border-b border-neutral-80': !isLastChild,
    });

  const reportDisplayName = convertReportTypeToDisplayName(report.reportType); // 자기소개서, 이력서, 포트폴리오

  // 이력서 진단 플랜 Radio 정보
  const reportDiagnosisPlan = useMemo(() => {
    const reportBasicInfo = priceInfo?.reportPriceInfos?.find(
      (info) => info.reportPriceType === BASIC,
    );
    const reportPremiumInfo = priceInfo?.reportPriceInfos?.find(
      (info) => info.reportPriceType === PREMIUM,
    );
    const feedbackInfo = priceInfo?.feedbackPriceInfo;

    const basicLabel = `베이직 플랜${report.reportType === PERSONAL_STATEMENT ? '(1문항)' : ''}`;
    const premiumLabel = `프리미엄 플랜(${report.reportType === PERSONAL_STATEMENT ? '4문항+총평 페이지 추가' : '채용 공고 맞춤 진단 추가'})`;

    return [
      {
        value: REPORT_RADIO_VALUES.basicFeedback,
        label: '[추천] 베이직 + 1:1 피드백(40분) 패키지',
        price:
          (reportBasicInfo?.price ?? 0) + (feedbackInfo?.feedbackPrice ?? 0),
        discount:
          (reportBasicInfo?.discountPrice ?? 0) +
          (feedbackInfo?.feedbackDiscountPrice ?? 0),
      },
      {
        value: REPORT_RADIO_VALUES.premiumFeedback,
        label: '[추천] 프리미엄 + 1:1 피드백(40분) 패키지',
        price:
          (reportPremiumInfo?.price ?? 0) + (feedbackInfo?.feedbackPrice ?? 0),
        discount:
          (reportPremiumInfo?.discountPrice ?? 0) +
          (feedbackInfo?.feedbackDiscountPrice ?? 0),
      },
      {
        value: REPORT_RADIO_VALUES.basic,
        label: basicLabel,
        price: reportBasicInfo?.price,
        discount: reportBasicInfo?.discountPrice,
      },
      {
        value: REPORT_RADIO_VALUES.premium,
        label: premiumLabel,
        price: reportPremiumInfo?.price,
        discount: reportPremiumInfo?.discountPrice,
      },
    ];
  }, [priceInfo]);

  const radioValue = useMemo(() => {
    if (reportApplication.reportPriceType === undefined) return null;

    const { reportPriceType, isFeedbackApplied } = reportApplication;

    // 베이직 + 1:1 피드백
    if (reportPriceType === BASIC && isFeedbackApplied) {
      return REPORT_RADIO_VALUES.basicFeedback;
    }
    // 프리미엄 + 1:1 피드백
    if (reportPriceType === PREMIUM && isFeedbackApplied) {
      return REPORT_RADIO_VALUES.premiumFeedback;
    }
    // 베이직
    if (reportPriceType === BASIC) return REPORT_RADIO_VALUES.basic;
    // 프리미엄
    if (reportPriceType === PREMIUM) return REPORT_RADIO_VALUES.premium;
  }, [reportApplication.reportPriceType, reportApplication.isFeedbackApplied]);

  const selectedReportPlan = useMemo(() => {
    if (!radioValue) return null;

    return reportDiagnosisPlan.find((item) => item.value === radioValue);
  }, [radioValue, reportDiagnosisPlan]);

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

  if (!priceInfo || !report.reportType) return null;

  const optionsAvailable =
    priceInfo.reportOptionInfos && priceInfo.reportOptionInfos.length > 0;

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
        <div className="sticky top-0 z-10 w-full bg-white py-2">
          {isDrawerOpen && (
            <div
              className="mx-auto h-[5px] w-16 cursor-pointer rounded-full bg-neutral-80"
              onClick={() => setIsDrawerOpen(false)}
            />
          )}
        </div>

        {/* 본문 */}
        {isDrawerOpen ? (
          <div className="mb-5 mt-2 flex flex-col gap-8">
            {/* 서류 진단 플랜 */}
            <FormControl fullWidth>
              <Heading2>{reportDisplayName} 진단 플랜 선택 (필수)*</Heading2>
              <ReportDropdown
                title={`합격을 이끄는 ${reportDisplayName} 진단 플랜`}
                labelId="report-diagnosis-plan-group-label"
              >
                <RadioGroup
                  aria-labelledby="report-diagnosis-plan-group-label"
                  value={radioValue}
                  onChange={(e) => {
                    {
                      const isFeedbackApplied = e.target.value.endsWith(
                        'Feedback',
                      )
                        ? true
                        : false;
                      // 서류진단 가격 유형 설정 (BASIC, PREMIUM)
                      setPriceType(priceTypeByPlan[e.target.value]);
                      // 피드백 신청 여부
                      setFeedbackService(isFeedbackApplied);
                    }
                  }}
                >
                  {reportDiagnosisPlan.map((item, index) => (
                    <ReportFormRadioControlLabel
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      wrapperClassName={generateControlLabelClassName(
                        index === reportDiagnosisPlan.length - 1,
                      )}
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

            {/* 현직자 피드백 (옵션) */}
            {optionsAvailable ? (
              <FormControl fullWidth>
                <Heading2>현직자 피드백 (선택)</Heading2>

                <ReportDropdown
                  title="현직자가 알려주는 합격의 디테일"
                  labelId="option-group-label"
                  initialOpenState={false}
                >
                  <FormGroup aria-labelledby="option-group-label">
                    {priceInfo.reportOptionInfos?.map((option, index) => {
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
                          wrapperClassName={generateControlLabelClassName(
                            index ===
                              (priceInfo.reportOptionInfos?.length ?? 0) - 1,
                          )}
                          label={option.title}
                          labelStyle={RADIO_CONTROL_LABEL_STYLE}
                          right={
                            <ReportPriceView
                              price={price}
                              discount={discount}
                            />
                          }
                        />
                      );
                    })}
                  </FormGroup>
                </ReportDropdown>
              </FormControl>
            ) : null}

            {/* 총 결제 금액 */}
            <div>
              <Heading2>총 결제 금액</Heading2>
              {/* 선택한 상품 */}
              {selectedReportPlan && (
                <>
                  <div className="mt-3 overflow-hidden rounded-xs border border-neutral-80">
                    {/*  선택한 서류 진단 플랜 */}
                    {selectedReportPlan && (
                      <SelectedItemBox
                        title={selectedReportPlan.label}
                        onClickDelete={() =>
                          setReportApplication({
                            reportPriceType: undefined,
                            isFeedbackApplied: false,
                          })
                        }
                        rightElement={
                          <ReportPriceView
                            price={selectedReportPlan.price}
                            discount={selectedReportPlan.discount}
                          />
                        }
                      />
                    )}
                    {/* 선택한 옵션 (현직자 피드백) */}
                    {priceInfo.reportOptionInfos?.map((info) => {
                      if (optionIds.includes(info.reportOptionId))
                        return (
                          <SelectedItemBox
                            key={info.reportOptionId}
                            className="border-t border-neutral-80"
                            title={info.title ?? ''}
                            onClickDelete={() =>
                              setReportApplication({
                                optionIds: reportApplication.optionIds.filter(
                                  (id) => id !== info.reportOptionId,
                                ),
                              })
                            }
                            rightElement={
                              <ReportPriceView
                                price={info.price}
                                discount={info.discountPrice}
                              />
                            }
                          />
                        );
                    })}
                  </div>
                  <hr className="mt-3 border-neutral-0/5" />
                </>
              )}
              {/* 가격 */}
              <span className="mt-3 block text-right text-small18 font-bold text-black/75">
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
        ) : null}

        {!isDrawerOpen ? (
          <div className="bg-white pb-2">
            <BaseButton
              className="apply_button_click w-full text-small18"
              onClick={() => setIsDrawerOpen(true)}
            >
              {report.reportType
                ? convertReportTypeToDisplayName(report.reportType ?? RESUME)
                : ''}{' '}
              서류 진단 신청하기
            </BaseButton>
          </div>
        ) : null}

        {isDrawerOpen ? (
          <div className="sticky bottom-2 flex items-center gap-2">
            <BaseButton
              className="flex-1"
              variant="outlined"
              onClick={() => setIsDrawerOpen(false)}
            >
              이전 단계로
            </BaseButton>
            <BaseButton
              className="next_button_click flex-1"
              onClick={onClickApply}
            >
              신청하기
            </BaseButton>
          </div>
        ) : null}
      </div>
    </div>
  );
});

const Heading2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-4 text-xsmall14 font-semibold text-static-0">{children}</h2>
);

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

const SelectedItemBox = ({
  title,
  rightElement,
  className,
  onClickDelete,
}: {
  title: string;
  rightElement?: ReactNode;
  className?: string;
  onClickDelete?: MouseEventHandler<SVGElement>;
}) => {
  return (
    <div className={twMerge('bg-neutral-100 p-3', className)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xsmall14 font-medium text-black/75">{title}</span>
        <IoCloseCircle
          className="h-6 w-6 cursor-pointer"
          color="#D8D8D8"
          onClick={onClickDelete}
        />
      </div>
      <div>{rightElement}</div>
    </div>
  );
};

ReportApplyBottomSheet.displayName = 'ReportApplyBottomSheet';

export default ReportApplyBottomSheet;
