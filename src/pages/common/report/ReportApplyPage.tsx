import {
  FormControl,
  RadioGroup,
  SelectChangeEvent,
  useMediaQuery,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import React, { memo, useEffect, useRef, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoCloseOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetParticipationInfo } from '@/api/application';
import { uploadFile } from '@/api/file';
import {
  convertReportPriceType,
  convertReportTypeStatus,
  convertReportTypeToLandingPath,
  ReportOptionInfo,
  ReportType,
  useGetReportPriceDetail,
} from '@/api/report';
import useMinDate from '@/hooks/useMinDate';
import useReportPayment from '@/hooks/useReportPayment';
import useReportProgramInfo from '@/hooks/useReportProgramInfo';
import useRunOnce from '@/hooks/useRunOnce';
import useValidateUrl from '@/hooks/useValidateUrl';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import Card from '@components/common/report/Card';
import { ReportFormRadioControlLabel } from '@components/common/report/ControlLabel';
import DateTimePicker from '@components/common/report/DateTimePicker';
import FilledInput from '@components/common/report/FilledInput';
import Heading1 from '@components/common/report/Heading1';
import Heading2 from '@components/common/report/Heading2';
import Label from '@components/common/report/Label';
import Tooltip from '@components/common/report/Tooltip';
import BottomSheet from '@components/common/ui/BottomSheeet';
import Input from '@components/common/ui/input/Input';
import HorizontalRule from '@components/ui/HorizontalRule';

const ReportApplyPage = () => {
  const navigate = useNavigate();
  const { reportType, reportId } = useParams();
  const isMobile = useMediaQuery('(max-width: 991px)');

  const [applyFile, setApplyFile] = useState<File | null>(null);
  const [recruitmentFile, setRecruitmentFile] = useState<File | null>(null);
  const [isSubmitNow, setIsSubmitNow] = useState('true');

  const { isLoggedIn } = useAuthStore();

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

  const isValidFile = () => {
    const { applyUrl, reportPriceType, recruitmentUrl } = reportApplication;

    const isEmpty = (value: string | File | null) =>
      value === '' || value === null;

    if (isEmpty(applyUrl) && isEmpty(applyFile)) {
      alert('진단용 서류를 등록해주세요.');
      return false;
    }

    if (
      reportPriceType === 'PREMIUM' &&
      reportType?.toUpperCase() !== 'PERSONAL_STATEMENT' &&
      isEmpty(recruitmentUrl) &&
      isEmpty(recruitmentFile)
    ) {
      alert('채용공고를 등록해주세요.');
      return false;
    }

    return true;
  };

  useRunOnce(() => {
    if (isLoggedIn) return;

    const searchParams = new URLSearchParams();
    searchParams.set('redirect', window.location.pathname);
    navigate(`/login?${searchParams.toString()}`);
  });

  return (
    <div className="px-5 md:px-32 md:py-10 xl:flex xl:gap-16 xl:px-48">
      <div className="w-full">
        <header>
          <Heading1>진단서 신청하기</Heading1>
        </header>
        <HorizontalRule className="-mx-5 md:-mx-32 lg:mx-0" />

        <main className="mb-8 mt-6 flex flex-col gap-10">
          {/* 프로그램 정보 */}
          <ProgramInfoSection
            onChangeRadio={(event, value) => setIsSubmitNow(value)}
          />

          {/* 진단용 서류 */}
          {isSubmitNow === 'true' && (
            <>
              <HorizontalRule className="-mx-5 md:-mx-32 lg:mx-0" />
              <CallOut
                className="bg-neutral-100"
                header="❗ 제출 전 꼭 읽어주세요"
                body="이력서 파일/링크가 잘 열리는 지 확인 후 첨부해주세요!"
              />
              <DocumentSection file={applyFile} dispatch={setApplyFile} />
              {/* 프리미엄 채용공고 */}
              {reportApplication.reportPriceType === 'PREMIUM' &&
                reportType?.toUpperCase() !== 'PERSONAL_STATEMENT' && (
                  <PremiumSection
                    file={recruitmentFile}
                    dispatch={setRecruitmentFile}
                  />
                )}
              <HorizontalRule className="-mx-5 md:-mx-32 lg:mx-0" />
              {/* 1:1 피드백 일정 */}
              {reportApplication.isFeedbackApplied && <ScheduleSection />}
              <HorizontalRule className="-mx-5 md:-mx-32 lg:mx-0" />

              {/* 추가 정보 */}
              <AdditionalInfoSection />
            </>
          )}
        </main>
      </div>

      <BottomSheet className="xl:mx-48">
        {isMobile && (
          <button
            onClick={() => {
              const to = `${convertReportTypeToLandingPath(reportType?.toUpperCase() as ReportType)}#content`;
              navigate(to);
            }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-primary bg-neutral-100"
          >
            <FaArrowLeft size={20} />
          </button>
        )}
        <button
          className="text-1.125-medium w-full rounded-md bg-primary py-3 text-center font-medium text-neutral-100"
          onClick={async () => {
            // 지금 제출일 때만 파일 유효성 검사
            if (isSubmitNow === 'true' && !isValidFile()) return;

            const { isValid, message } = validate();
            if (!isValid) {
              alert(message);
              return;
            }

            // 지금 제출일 때만 파일 업로드
            if (isSubmitNow === 'true') await convertFile();
            navigate(`/report/payment/${reportType}/${reportId}`);
          }}
        >
          다음
        </button>
      </BottomSheet>
    </div>
  );
};

export default ReportApplyPage;

const CallOut = memo(function Callout({
  header,
  body,
  className,
}: {
  header?: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={twMerge('rounded-md bg-neutral-100 px-6 py-6', className)}>
      <span className="-ml-1 text-xsmall16 font-semibold text-primary">
        {header}
      </span>
      <p className="mt-1 text-xsmall14 text-neutral-20">{body}</p>
    </div>
  );
});

const ProgramInfoSection = ({
  onChangeRadio,
}: {
  onChangeRadio?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => void;
}) => {
  const { title, product, option } = useReportProgramInfo();

  return (
    <section>
      <div className="mb-6 flex items-center gap-1">
        <Heading2>프로그램 정보</Heading2>
        <Tooltip alt="프로그램 도움말 아이콘">
          <span className="font-semibold">진단서 발급 예상 소요기간</span>
          <li>서류 진단서 (베이직): 최대 2일</li>
          <li>서류 진단서 (프리미엄) 최대 3일</li>
          <li>옵션 (현직자 피드백): 최대 5일</li>
        </Tooltip>
      </div>
      <Card
        imgSrc="/images/report-thumbnail.png"
        imgAlt="서류 진단서 프로그램 썸네일"
        title={title ?? ''}
        content={[
          {
            label: '상품',
            text: product,
          },
          {
            label: '옵션',
            text: option,
          },
        ]}
      />
      <div className="mt-10">
        <CallOut
          className="mb-6 bg-primary-5"
          header="📄 진단을 위한 서류를 제출해주세요"
          body="결제 후 7일 이내 서류 미제출 시 자동 환불 처리되니 이 점 꼭 유의해
        주세요."
        />
        <FormControl fullWidth>
          <RadioGroup
            defaultValue="true"
            name="radio-buttons-group"
            onChange={onChangeRadio}
          >
            <div className="flex flex-col gap-1">
              <ReportFormRadioControlLabel
                label="지금 제출할래요."
                value="true"
              />
              <ReportFormRadioControlLabel
                label="결제 후 나중에 제출할래요."
                value="false"
              />
            </div>
          </RadioGroup>
        </FormControl>
      </div>
    </section>
  );
};

const DocumentSection = ({
  file,
  dispatch,
}: {
  file: File | null;
  dispatch: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const { reportType } = useParams();

  const [value, setValue] = useState('file');

  const { data, setReportApplication } = useReportApplicationStore();
  const isValidUrl = useValidateUrl(data.applyUrl);

  return (
    <section className="flex flex-col lg:flex-row lg:items-start lg:gap-5">
      <div className="mb-3 flex w-[8.75rem] shrink-0 items-center">
        <Heading2>진단용 {convertReportTypeStatus(reportType!)}</Heading2>
        <RequiredStar />
      </div>
      <FormControl fullWidth>
        <RadioGroup
          defaultValue="file"
          name="radio-buttons-group"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value === 'url') dispatch(null);
            else setReportApplication({ applyUrl: '' });
          }}
        >
          {/* 파일 첨부 */}
          <div className="mb-4">
            <ReportFormRadioControlLabel
              label="파일 첨부"
              value="file"
              subText="(pdf, doc, docx 형식 지원, 50MB 이하)"
            />
            {value === 'file' && (
              <FileUploadButton file={file} dispatch={dispatch} />
            )}
          </div>
          {/* URL */}
          <div>
            <ReportFormRadioControlLabel label="URL" value="url" />
            {value === 'url' && (
              <FilledInput
                name="applyUrl"
                placeholder="https://"
                value={data.applyUrl || ''}
                onChange={(e) =>
                  setReportApplication({ applyUrl: e.target.value })
                }
              />
            )}
            {value === 'url' && !isValidUrl && (
              <span className="h-3 text-xsmall14 text-system-error">
                올바른 주소를 입력해주세요
              </span>
            )}
          </div>
        </RadioGroup>
      </FormControl>
    </section>
  );
};

const PremiumSection = ({
  file,
  dispatch,
}: {
  file: File | null;
  dispatch: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const [value, setValue] = useState('file');

  const { data, setReportApplication } = useReportApplicationStore();
  const isValidUrl = useValidateUrl(data.recruitmentUrl);

  return (
    <section className="flex flex-col gap-1 lg:flex-row lg:items-start lg:gap-5">
      {
        <div className="flex w-[8.75rem] shrink-0 items-center">
          <Heading2>(프리미엄) 채용공고</Heading2>
          <RequiredStar />
        </div>
      }
      <div className="w-full">
        <span className="mb-3 inline-block text-xsmall14 lg:mb-4">
          희망하는 기업의 채용공고를 첨부해주세요.
        </span>
        <FormControl fullWidth>
          <RadioGroup
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value === 'url') dispatch(null);
              else setReportApplication({ recruitmentUrl: '' });
            }}
            name="radio-buttons-group"
          >
            <div className="mb-4">
              <ReportFormRadioControlLabel
                label="파일 첨부"
                value="file"
                subText="(png, jpg, jpeg, pdf 형식 지원, 50MB 이하)"
              />
              <span className="-mt-1 mb-2 block text-xxsmall12 text-neutral-45">
                *업무, 지원자격, 우대사항이 보이게 채용공고를 캡처해주세요.
              </span>
              {value === 'file' && (
                <FileUploadButton file={file} dispatch={dispatch} />
              )}
            </div>
            <div>
              <ReportFormRadioControlLabel label="URL" value="url" />
              {value === 'url' && (
                <FilledInput
                  name="recruitmentUrl"
                  placeholder="https://"
                  value={data.recruitmentUrl || ''}
                  onChange={(e) =>
                    setReportApplication({ recruitmentUrl: e.target.value })
                  }
                />
              )}
              {value === 'url' && !isValidUrl && (
                <span className="h-3 text-xsmall14 text-system-error">
                  올바른 주소를 입력해주세요
                </span>
              )}
            </div>
          </RadioGroup>
        </FormControl>
      </div>
    </section>
  );
};

const ScheduleSection = () => {
  const { data, setReportApplication } = useReportApplicationStore();
  const minDate = useMinDate(data);

  type Key = keyof typeof data;

  const onChangeDate = (date: Dayjs | null, name?: string) => {
    const hour = dayjs(data[name as Key] as dayjs.ConfigType).hour();

    date?.set('hour', hour);
    setReportApplication({
      [name as Key]: date?.format('YYYY-MM-DDTHH:00'),
    });
  };

  const onChangeTime = (e: SelectChangeEvent<unknown>) => {
    const prev = data[e.target.name as Key];
    if (prev === undefined) {
      alert('날짜를 먼저 선택해주세요');
      return;
    }

    setReportApplication({
      [e.target.name]: dayjs(prev as dayjs.ConfigType)
        .set('hour', e.target.value as number)
        .format('YYYY-MM-DDTHH:00'),
    });
  };

  return (
    <section className="flex flex-col gap-1 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex w-[8.75rem] shrink-0 items-center gap-1">
        <Heading2>1:1 피드백 일정</Heading2>
        <Tooltip alt="1:1 피드백 일정 도움말">
          1:1 피드백은 서류 진단서 발급 이후에 진행됩니다.
        </Tooltip>
      </div>
      <div className="flex w-full flex-col gap-5">
        <span className="text-xsmall14">
          희망하시는 1:1 피드백(40분) 일정을 모두 선택해주세요.
        </span>
        <div>
          <Label>희망순위1*</Label>
          <DateTimePicker
            date={
              data.desiredDate1 === undefined
                ? undefined
                : dayjs(data.desiredDate1)
            }
            time={
              data.desiredDate1 === undefined ||
              dayjs(data.desiredDate1).hour() === 0
                ? undefined
                : dayjs(data.desiredDate1).hour()
            }
            name="desiredDate1"
            minDate={minDate}
            onChangeDate={onChangeDate}
            onChangeTime={onChangeTime}
          />
        </div>
        <div>
          <Label>희망순위2*</Label>
          <DateTimePicker
            date={
              data.desiredDate2 === undefined
                ? undefined
                : dayjs(data.desiredDate2)
            }
            name="desiredDate2"
            minDate={minDate}
            onChangeDate={onChangeDate}
            onChangeTime={onChangeTime}
          />
        </div>
        <div>
          <Label>희망순위3*</Label>
          <DateTimePicker
            date={
              data.desiredDate3 === undefined
                ? undefined
                : dayjs(data.desiredDate3)
            }
            name="desiredDate3"
            minDate={minDate}
            onChangeDate={onChangeDate}
            onChangeTime={onChangeTime}
          />
        </div>
      </div>
    </section>
  );
};

const AdditionalInfoSection = () => {
  const { data, setReportApplication } = useReportApplicationStore();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setReportApplication({ [e.target.name]: e.target.value });
  };

  return (
    <section className="flex flex-col gap-5">
      <Heading2>추가 정보</Heading2>
      <div>
        <Label htmlFor="wishJob">
          희망직무
          <RequiredStar />
        </Label>
        <FilledInput
          name="wishJob"
          id="wishJob"
          placeholder="희망하는 직무를 알려주세요"
          value={data.wishJob || ''}
          onChange={onChange}
        />
      </div>
      <div>
        <Label htmlFor="message">서류 작성 고민</Label>
        <textarea
          id="message"
          className="w-full resize-none rounded-md bg-neutral-95 p-3 text-xsmall14"
          name="message"
          placeholder="진단에 참고할 수 있도록 서류 작성에 대한 고민을 적어주세요"
          rows={2}
          value={data.message || ''}
          onChange={onChange}
        />
      </div>
    </section>
  );
};

export const UsereInfoSection = () => {
  const [checked, setChecked] = useState(true);

  const { data: participationInfo } = useGetParticipationInfo();
  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();

  useEffect(() => {
    // 가입한 이메일을 정보 수신용 이메일로 설정
    setReportApplication({
      contactEmail: participationInfo?.contactEmail || '',
    });
  }, [participationInfo]);

  useEffect(() => {
    // 정보 수신용 이메일과 가입한 이메일이 다르면 체크 해제
    if (reportApplication.contactEmail !== participationInfo?.email)
      setChecked(false);
    else setChecked(true);
  }, [reportApplication]);

  return (
    <section>
      <Heading2>참여자 정보</Heading2>
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label>이름</Label>
          <Input
            disabled
            readOnly
            className="text-sm"
            value={participationInfo?.name || ''}
            name="name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>휴대폰 번호</Label>
          <Input
            disabled
            readOnly
            className="text-sm"
            value={participationInfo?.phoneNumber || ''}
            name="phoneNumber"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="ml-3 text-xsmall14 font-semibold">
            가입한 이메일
          </label>
          <Input
            disabled
            readOnly
            className="text-sm"
            value={participationInfo?.email || ''}
            name="email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="contactEmail">렛츠커리어 정보 수신용 이메일</Label>
          <p className="text-[0.5625rem] font-light text-neutral-0 text-opacity-[52%]">
            * 결제정보 및 프로그램 신청 관련 알림 수신을 위해,
            <br />
            &nbsp;&nbsp; 자주 사용하는 이메일 주소를 입력해주세요!
          </p>
          <label
            onClick={() => {
              setChecked(!checked);
              if (checked) {
                setReportApplication({
                  contactEmail: '',
                });
              } else {
                setReportApplication({
                  contactEmail: participationInfo?.email || '',
                });
              }
            }}
            className="flex cursor-pointer items-center gap-1 text-xxsmall12 font-medium"
          >
            <img
              className="h-auto w-5"
              src={`/icons/${checked ? 'checkbox-fill.svg' : 'checkbox-unchecked.svg'}`}
            />
            가입한 이메일과 동일
          </label>
          <Input
            name="contactEmail"
            placeholder="example@example.com"
            value={reportApplication.contactEmail}
            onChange={(e) =>
              setReportApplication({ contactEmail: e.target.value })
            }
          />
        </div>
      </div>
    </section>
  );
};

export const ReportPaymentSection = () => {
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState<ReportOptionInfo[]>([]);

  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();
  const { payment, applyCoupon, cancelCoupon } = useReportPayment();
  const { data: reportPriceDetail } = useGetReportPriceDetail(
    reportApplication.reportId!,
  );

  // 기존에 입력한 쿠폰 코드 초기화
  useEffect(() => {
    setReportApplication({ couponId: null, couponCode: '' });
    setMessage('');
  }, []);

  useEffect(() => {
    if (reportPriceDetail === undefined) return;
    // 옵션 타이틀 불러오기
    const result = [];
    for (const optionId of reportApplication.optionIds) {
      const reportOptionInfo = reportPriceDetail.reportOptionInfos?.find(
        (info) => info.reportOptionId === optionId,
      );
      if (reportOptionInfo === undefined) continue;
      result.push(reportOptionInfo);
    }

    setOptions(result);
  }, [reportPriceDetail]);

  const showFeedback = reportApplication.isFeedbackApplied;
  const optionTitle = options.map((option) => option.title).join(', ');
  const reportAndOptionsDiscount =
    payment.reportDiscount + payment.optionDiscount; // 진단서와 옵션 할인 금액
  const reportAndOptionsAmount =
    payment.report + payment.option - reportAndOptionsDiscount; // 진단서와 옵션 결제 금액
  const feedbackAmount = payment.feedback - payment.feedbackDiscount; // 1:1 피드백 결제 금액

  return (
    <section className="flex flex-col">
      <Heading2>결제 정보</Heading2>
      <div className="mt-6">
        <div className="flex gap-2.5">
          <Input
            className="w-full"
            value={reportApplication.couponCode ?? ''}
            type="text"
            placeholder="쿠폰 번호를 입력해주세요."
            disabled={reportApplication.couponId === null ? false : true}
            onChange={(e) =>
              setReportApplication({ couponCode: e.target.value })
            }
          />
          <button
            className={twMerge(
              reportApplication.couponId === null
                ? 'bg-primary text-neutral-100'
                : 'border-2 border-primary bg-neutral-100 text-primary',
              'shrink-0 rounded-sm px-4 py-1.5 text-xsmall14 font-medium',
            )}
            onClick={async () => {
              if (reportApplication.couponCode === '') return;
              // 쿠폰이 등록된 상태면 쿠폰 취소
              if (
                reportApplication.couponId !== null &&
                reportApplication.couponCode !== ''
              ) {
                cancelCoupon();
                setMessage('');
                setReportApplication({ couponCode: '' });
                return;
              }

              const data = await applyCoupon(reportApplication.couponCode);

              if (data.status === 404 || data.status === 400)
                setMessage(data.message);
              else setMessage('쿠폰이 등록되었습니다.');
            }}
          >
            {reportApplication.couponId === null ? '쿠폰 등록' : '쿠폰 취소'}
          </button>
        </div>
        <span
          className={twMerge(
            reportApplication.couponId === null
              ? 'text-system-error'
              : 'text-system-positive-blue',
            'h-3 text-xsmall14',
          )}
        >
          {message}
        </span>
      </div>
      <hr className="my-5" />
      <div className="flex flex-col">
        <PaymentRowMain>
          <span>서류 진단서 결제금액</span>
          <span>{reportAndOptionsAmount.toLocaleString()}원</span>
        </PaymentRowMain>
        <PaymentRowSub>
          <span>
            └ {convertReportPriceType(reportApplication.reportPriceType)}
          </span>
          <span>{`${payment.report.toLocaleString()}원`}</span>
        </PaymentRowSub>
        {options.length > 0 && (
          <PaymentRowSub>
            <span>└ {optionTitle}</span>
            <span className="shrink-0">{`${payment.option.toLocaleString()}원`}</span>
          </PaymentRowSub>
        )}
        <PaymentRowSub>
          <span>
            └{' '}
            {Math.ceil(
              (reportAndOptionsDiscount / (payment.report + payment.option)) *
                100,
            )}
            % 할인
          </span>
          <span>
            {reportAndOptionsDiscount === 0
              ? '0원'
              : `-${reportAndOptionsDiscount.toLocaleString()}원`}
          </span>
        </PaymentRowSub>
        {showFeedback && (
          <>
            <PaymentRowMain>
              <span>1:1 피드백 결제금액</span>
              <span>{feedbackAmount.toLocaleString()}원</span>
            </PaymentRowMain>
            <PaymentRowSub>
              <span>└ 정가</span>
              <span>{`${payment.feedback.toLocaleString()}원`}</span>
            </PaymentRowSub>
            <PaymentRowSub>
              <span>
                └{' '}
                {Math.ceil((payment.feedbackDiscount / payment.feedback) * 100)}
                % 할인
              </span>
              <span>
                {payment.feedbackDiscount === 0
                  ? '0원'
                  : `-${payment.feedbackDiscount.toLocaleString()}원`}
              </span>
            </PaymentRowSub>
          </>
        )}

        <PaymentRowMain className="text-primary">
          <span>쿠폰할인</span>
          <span className="font-bold">
            {payment.coupon === 0
              ? '0원'
              : `-${payment.coupon.toLocaleString()}원`}
          </span>
        </PaymentRowMain>
        <hr className="my-5" />
        <PaymentRowMain className="font-semibold">
          <span>결제금액</span>
          <span>{payment.amount.toLocaleString()}원</span>
        </PaymentRowMain>
      </div>
    </section>
  );
};

const PaymentRowMain = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'flex h-10 items-center justify-between px-3 text-neutral-0',
        className,
      )}
    >
      {children}
    </div>
  );
};

const PaymentRowSub = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'flex h-10 items-center justify-between gap-1 pl-6 pr-3 text-xsmall14 text-neutral-50',
        className,
      )}
    >
      {children}
    </div>
  );
};

const RequiredStar = () => {
  return <span className="text-[#7B61FF]">*</span>;
};

const FileUploadButton = React.memo(function FileUploadButton({
  file,
  dispatch,
}: {
  file: File | null;
  dispatch: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file && file.size > 50 * 1024 * 1024) {
      // 파일 사이즈가 50MB 초과일 경우
      alert('50MB 이하의 파일만 업로드 가능합니다.');
      dispatch(null);
    }
  }, [file]);

  return (
    <>
      <button
        className="rounded-md border border-neutral-60 bg-neutral-100 px-3 py-1.5 text-xsmall14 text-neutral-40"
        onClick={() => {
          ref.current?.click();
        }}
      >
        {file ? (
          <div className="flex items-center gap-1">
            <span>{`${file.name} (${(file.size / 1024).toFixed(1)}KB)`}</span>
            <IoCloseOutline
              size={16}
              color="#7a7d84"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(null);
              }}
            />
          </div>
        ) : (
          '파일 업로드'
        )}
      </button>
      <input
        onChange={(e) => dispatch(e.target.files![0])}
        className="hidden"
        ref={ref}
        type="file"
        name="file"
      />
    </>
  );
});
