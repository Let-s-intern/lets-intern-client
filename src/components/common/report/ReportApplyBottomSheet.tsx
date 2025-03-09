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

import {
  ActiveReport,
  convertReportTypeToDisplayName,
  convertReportTypeToPathname,
  ReportPriceDetail,
  ReportPriceType,
  reportPriceTypeEnum,
} from '@/api/report';
import { useControlScroll } from '@/hooks/useControlScroll';
import useInstagramAlert from '@/hooks/useInstagramAlert';
import { generateOrderId } from '@/lib/order';
import { twMerge } from '@/lib/twMerge';
import { reportTypeSchema } from '@/schema';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import ModalOverlay from '@components/ui/ModalOverlay';
import RequiredStar from '@components/ui/RequiredStar';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { DesktopCTA, MobileCTA } from '../ApplyCTA';
import PaymentErrorNotification from '../PaymentErrorNotification';
import GradientButton from '../program/program-detail/button/GradientButton';
import { default as BaseButton } from '../ui/button/BaseButton';
import {
  ReportFormCheckboxControlLabel,
  ReportFormRadioControlLabel,
} from './ControlLabel';
import ReportDropdown from './ReportDropdown';

const { BASIC, PREMIUM } = reportPriceTypeEnum.enum;
const { PERSONAL_STATEMENT } = reportTypeSchema.enum;

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
  priceDetail: ReportPriceDetail;
  show?: boolean;
}

/** 자기소개서 문항 추가 옵션
 * 옵션 제목이 '+'로 시작하는 옵션은 '자기소개서 문항 추가' 옵션이다. (그 외 옵션은 현직자 피드백에 표시한다)
 * ADMIN에서 생성한 문항 추가 옵션 개수 = 사용자가 최대로 추가할 수 있는 문항 개수
 */

const ReportApplyBottomSheet = React.forwardRef<
  HTMLDivElement,
  ReportApplyBottomSheetProps
>(({ report, priceDetail, show = true }, ref) => {
  const router = useRouter();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();

  const { isInstagram, showInstagramAlert, setShowInstagramAlert } =
    useInstagramAlert();

  const { optionIds, isFeedbackApplied } = reportApplication;

  useEffect(() => {
    // 드롭다운 열면 reportId 설정
    if (isDrawerOpen) {
      setReportApplication({ reportId: report.reportId });
    }
  }, [isDrawerOpen, report.reportId, setReportApplication]);

  const reportDisplayName = convertReportTypeToDisplayName(report.reportType); // 자기소개서, 이력서, 포트폴리오

  const radioValue = useMemo(() => {
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

    return null;
  }, [reportApplication]);

  // 이력서 진단 플랜 Radio 정보
  const reportDiagnosisPlan = useMemo(() => {
    const reportBasicInfo = priceDetail?.reportPriceInfos?.find(
      (info) => info.reportPriceType === BASIC,
    );
    const reportPremiumInfo = priceDetail?.reportPriceInfos?.find(
      (info) => info.reportPriceType === PREMIUM,
    );
    const feedbackInfo = priceDetail?.feedbackPriceInfo;

    const basicLabel = `베이직 플랜${report.reportType === PERSONAL_STATEMENT ? '(1문항)' : ''}`;
    const premiumLabel = `프리미엄 플랜(${report.reportType === PERSONAL_STATEMENT ? '4문항+총평 페이지 추가' : '채용 공고 맞춤 진단 추가'})`;

    const returnList = [];

    if (
      reportPremiumInfo &&
      feedbackInfo &&
      feedbackInfo.feedbackPrice &&
      feedbackInfo.feedbackPrice >= 0
    ) {
      returnList.push({
        value: REPORT_RADIO_VALUES.premiumFeedback,
        label: '[추천] 프리미엄 + 1:1 온라인 상담(40분) 패키지',
        price:
          (reportPremiumInfo?.price ?? 0) + (feedbackInfo?.feedbackPrice ?? 0),
        discount:
          (reportPremiumInfo?.discountPrice ?? 0) +
          (feedbackInfo?.feedbackDiscountPrice ?? 0),
      });
    }

    if (
      reportBasicInfo &&
      feedbackInfo &&
      feedbackInfo.feedbackPrice &&
      feedbackInfo.feedbackPrice >= 0
    ) {
      returnList.push({
        value: REPORT_RADIO_VALUES.basicFeedback,
        label: '[추천] 베이직 + 1:1 온라인 상담(40분) 패키지',
        price:
          (reportBasicInfo?.price ?? 0) + (feedbackInfo?.feedbackPrice ?? 0),
        discount:
          (reportBasicInfo?.discountPrice ?? 0) +
          (feedbackInfo?.feedbackDiscountPrice ?? 0),
      });
    }

    if (reportPremiumInfo) {
      returnList.push({
        value: REPORT_RADIO_VALUES.premium,
        label: premiumLabel,
        price: reportPremiumInfo?.price,
        discount: reportPremiumInfo?.discountPrice,
      });
    }

    if (reportBasicInfo) {
      returnList.push({
        value: REPORT_RADIO_VALUES.basic,
        label: basicLabel,
        price: reportBasicInfo.price,
        discount: reportBasicInfo.discountPrice,
      });
    }

    return returnList;
  }, [priceDetail, report.reportType]);

  const selectedReportPlan = useMemo(() => {
    if (!radioValue) return null;

    return reportDiagnosisPlan.find((item) => item.value === radioValue);
  }, [radioValue, reportDiagnosisPlan]);

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
    // 선택한 서류 진단 플랜이 없으면 신청 불가
    if (!radioValue) {
      alert('서류 진단 플랜을 선택해주세요');
      return;
    }

    setReportApplication({
      orderId: generateOrderId(),
      reportId: report.reportId,
    });

    router.push(
      `/report/apply/${convertReportTypeToPathname(report.reportType ?? 'RESUME')}/${report.reportId}`,
    );
  }, [
    radioValue,
    report.reportId,
    report.reportType,
    router,
    setReportApplication,
  ]);

  const generateControlLabelClassName = (isLastChild: boolean) =>
    clsx('py-3 pl-2 pr-3', {
      // 마지막 아이템은 border 제외
      'border-b border-neutral-80': !isLastChild,
    });

  // 현직자 피드백 옵션
  const employeeOptionInfos = priceDetail.reportOptionInfos?.filter(
    (info) => !info.optionTitle?.startsWith('+'),
  );

  // 자기소개서 문항 추가 옵션
  const questionOptionInfos = priceDetail.reportOptionInfos?.filter((info) =>
    info.optionTitle?.startsWith('+'),
  );
  // 사용자가 추가한 문항 추가 옵션
  const selectedQuestionOptions = useMemo(() => {
    let length = 0;
    const price = questionOptionInfos?.reduce((acc, curr) => {
      if (reportApplication.optionIds.includes(curr.reportOptionId)) {
        length++;
        return acc + (curr.price ?? 0);
      }
      return acc;
    }, 0);
    const discount = questionOptionInfos?.reduce((acc, curr) => {
      if (reportApplication.optionIds.includes(curr.reportOptionId))
        return acc + (curr.discountPrice ?? 0);
      return acc;
    }, 0);
    return { length, price, discount };
  }, [reportApplication, questionOptionInfos]);

  const reportFinalPrice = useMemo(() => {
    let result = 0;

    const reportPrice = priceDetail?.reportPriceInfos?.find(
      (item) => item.reportPriceType === reportApplication.reportPriceType,
    );

    if (reportPrice) {
      result += reportPrice.price ?? 0;
    }

    result += reportApplication.optionIds.reduce((acc, optionId) => {
      const option = priceDetail?.reportOptionInfos?.find(
        (option) => option.reportOptionId === optionId,
      );

      if (!option) {
        return acc;
      }

      return acc + (option.price ?? 0);
    }, 0);

    return result;
  }, [
    priceDetail?.reportOptionInfos,
    priceDetail?.reportPriceInfos,
    reportApplication,
  ]);

  const reportFinalDiscountPrice = useMemo(() => {
    let result = 0;

    const reportPrice = priceDetail?.reportPriceInfos?.find(
      (item) => item.reportPriceType === reportApplication.reportPriceType,
    );

    if (reportPrice) {
      result += reportPrice.discountPrice ?? 0;
    }

    result += reportApplication.optionIds.reduce((acc, optionId) => {
      const option = priceDetail?.reportOptionInfos?.find(
        (option) => option.reportOptionId === optionId,
      );

      if (!option) {
        return acc;
      }

      return acc + (option.discountPrice ?? 0);
    }, 0);

    return result;
  }, [
    priceDetail?.reportOptionInfos,
    priceDetail?.reportPriceInfos,
    reportApplication,
  ]);

  const feedbackFinalPrice = isFeedbackApplied
    ? (priceDetail?.feedbackPriceInfo?.feedbackPrice ?? 0)
    : 0;
  const feedbackFinalDiscountPrice = isFeedbackApplied
    ? (priceDetail?.feedbackPriceInfo?.feedbackDiscountPrice ?? 0)
    : 0;

  const optionsAvailable =
    priceDetail.reportOptionInfos && priceDetail.reportOptionInfos.length > 0;

  useControlScroll(isDrawerOpen);

  return (
    <>
      {/* 배경 */}
      {isDrawerOpen && (
        <ModalOverlay
          className="bg-transparent"
          onClose={() => setIsDrawerOpen(false)}
        />
      )}

      {!isDrawerOpen && (
        <>
          {/* 모바일에서만 표시 */}
          <MobileCTA
            className="lg:hidden"
            title={`${report.title} 피드백 REPORT`}
            banner={
              showInstagramAlert ? (
                <PaymentErrorNotification className="border-t" />
              ) : undefined
            }
          >
            <GradientButton
              className="apply_button w-full"
              onClick={() => {
                if (isInstagram && !showInstagramAlert) {
                  setShowInstagramAlert(true);
                  return;
                }
                setIsDrawerOpen(true);
              }}
            >
              지금 바로 신청
            </GradientButton>
          </MobileCTA>
          {/* 데스크탑에서만 표시 */}
          <DesktopCTA className="hidden items-center justify-between lg:flex">
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-xsmall16 font-bold text-neutral-100">
                {report.title} 피드백 REPORT
              </span>
              <span className="text-xsmall14 font-medium text-neutral-80">
                서류 합격에 한걸음 더 가까워지고 싶다면?
              </span>
            </div>
            <GradientButton
              className="apply_button w-36"
              onClick={() => setIsDrawerOpen(true)}
            >
              지금 바로 신청
            </GradientButton>
          </DesktopCTA>
        </>
      )}

      {isDrawerOpen && (
        <div
          ref={ref}
          className={twMerge(
            'fixed bottom-0 left-1/2 z-40 mx-auto h-[36rem] w-full max-w-[1000px] -translate-x-1/2 overflow-hidden rounded-t-xl border-t border-neutral-0/5 bg-white shadow-lg transition md:h-[50rem] md:max-h-[85vh]',
            !show && 'hidden',
          )}
        >
          <div className="relative flex h-full flex-col justify-between overflow-y-scroll px-5">
            <div>
              {/* 상단 닫기 버튼 */}
              <div className="sticky top-0 z-10 w-full bg-white py-2">
                <div
                  className="mx-auto h-[5px] w-16 cursor-pointer rounded-full bg-neutral-80"
                  onClick={() => setIsDrawerOpen(false)}
                />
              </div>

              {/* 본문 */}
              <div className="mb-5 mt-2 flex flex-col gap-8">
                {/* 서류 진단 플랜 */}
                <FormControl fullWidth>
                  <Heading2 className="mb-4">
                    {reportDisplayName} 진단 플랜 선택 (필수)
                    <RequiredStar />
                  </Heading2>
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

                {/* 자기소개서 문항 추가 */}
                {report.reportType === 'PERSONAL_STATEMENT' &&
                  (questionOptionInfos ?? []).length > 0 && (
                    <div className="flex items-start justify-between">
                      <Heading2 className="mb-4">
                        자기소개서 문항 추가 (선택)
                      </Heading2>
                      <div>
                        <ReportPriceView
                          price={(questionOptionInfos ?? [])[0].price}
                          discount={
                            (questionOptionInfos ?? [])[0].discountPrice
                          }
                        />
                        {/* Counter */}
                        <div className="mt-3 flex items-center rounded-xs border border-[#D6D6D6]">
                          <button
                            className={twMerge(
                              'flex h-7 w-7 items-center justify-center',
                              selectedQuestionOptions.length === 0
                                ? 'text-[#D6D6D6]'
                                : 'text-[#121212]',
                            )}
                            onClick={() => {
                              if (
                                !questionOptionInfos ||
                                selectedQuestionOptions.length === 0
                              )
                                return;

                              //  selectedQuestionOptions.length - 1 인덱스에 해당하는 '자소서 문항 추가' 옵션 아이디 삭제
                              setReportApplication({
                                optionIds: optionIds.filter(
                                  (id) =>
                                    id !==
                                    questionOptionInfos[
                                      selectedQuestionOptions.length - 1
                                    ].reportOptionId,
                                ),
                              });
                            }}
                          >
                            -
                          </button>
                          <div className="flex h-7 w-7 items-center justify-center text-xsmall14 text-[#121212]">
                            {selectedQuestionOptions.length}
                          </div>
                          <button
                            className={twMerge(
                              'flex h-7 w-7 items-center justify-center text-[#121212]',
                              selectedQuestionOptions.length ===
                                (questionOptionInfos ?? [])?.length
                                ? 'text-[#D6D6D6]'
                                : 'text-[#121212]',
                            )}
                            onClick={() => {
                              if (
                                !questionOptionInfos ||
                                selectedQuestionOptions.length ===
                                  (questionOptionInfos ?? [])?.length
                              )
                                return;

                              //  selectedQuestionOptions.length 인덱스에 해당하는 '자소서 문항 추가' 옵션 아이디 추가
                              setReportApplication({
                                optionIds: [
                                  ...optionIds,
                                  questionOptionInfos[
                                    selectedQuestionOptions.length
                                  ].reportOptionId,
                                ],
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                {/* 현직자 피드백 (옵션) */}
                {optionsAvailable ? (
                  <FormControl fullWidth>
                    <Heading2 className="mb-4">현직자 피드백 (선택)</Heading2>

                    <ReportDropdown
                      title="현직자가 알려주는 합격의 디테일"
                      labelId="option-group-label"
                      initialOpenState={false}
                    >
                      <FormGroup aria-labelledby="option-group-label">
                        {employeeOptionInfos?.map((option, index) => {
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
                              onChange={(_, checked) => {
                                if (checked) {
                                  setSelectedOptionIds([
                                    ...optionIds,
                                    option.reportOptionId,
                                  ]);
                                } else {
                                  setSelectedOptionIds(
                                    optionIds.filter(
                                      (selectedOption) =>
                                        selectedOption !==
                                        option.reportOptionId,
                                    ),
                                  );
                                }
                              }}
                              wrapperClassName={generateControlLabelClassName(
                                index ===
                                  (priceDetail.reportOptionInfos?.length ?? 0) -
                                    1,
                              )}
                              label={option.optionTitle}
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
                  {(selectedReportPlan || optionIds.length > 0) && (
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
                        {/* 선택한 자소서 문항 추가 */}
                        {selectedQuestionOptions.length > 0 && (
                          <SelectedItemBox
                            className="border-t border-neutral-80"
                            title={`자기소개서 문항 추가 ${selectedQuestionOptions.length}개`}
                            // 자소서 문항 추가 모두 삭제
                            onClickDelete={() => {
                              const questionOptionIds =
                                questionOptionInfos?.map(
                                  (info) => info.reportOptionId,
                                );
                              setReportApplication({
                                optionIds: reportApplication.optionIds.filter(
                                  (id) => !questionOptionIds?.includes(id),
                                ),
                              });
                            }}
                            rightElement={
                              <ReportPriceView
                                price={selectedQuestionOptions.price}
                                discount={selectedQuestionOptions.discount}
                              />
                            }
                          />
                        )}

                        {/* 선택한 옵션 (현직자 피드백) */}
                        {employeeOptionInfos?.map((info) => {
                          if (optionIds.includes(info.reportOptionId))
                            return (
                              <SelectedItemBox
                                key={info.reportOptionId}
                                className="border-t border-neutral-80"
                                title={info.optionTitle ?? ''}
                                onClickDelete={() =>
                                  setReportApplication({
                                    optionIds:
                                      reportApplication.optionIds.filter(
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
                  <span className="mt-3 block text-right text-small18 font-bold text-neutral-10">
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

            <div className="sticky bottom-0 flex items-center gap-2 rounded-md bg-white pb-2">
              <BaseButton
                className="flex-1"
                variant="outlined"
                onClick={() => {
                  setShowInstagramAlert(false);
                  setIsDrawerOpen(false);
                }}
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
          </div>
        </div>
      )}
    </>
  );
});

const Heading2 = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <h2
    className={twMerge('text-xsmall14 font-semibold text-static-0', className)}
  >
    {children}
  </h2>
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

      <span className="text-xsmall14 font-bold text-neutral-10">
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
        <span className="text-xsmall14 font-medium text-neutral-10">
          {title}
        </span>
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
