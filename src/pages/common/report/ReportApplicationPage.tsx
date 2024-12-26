import { FormControl, RadioGroup, SelectChangeEvent } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import React, { memo, useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';

import { uploadFile } from '@/api/file';
import { convertReportTypeStatus, usePatchMyApplication } from '@/api/report';
import useMinDate from '@/hooks/useMinDate';
import useRunOnce from '@/hooks/useRunOnce';
import useValidateUrl from '@/hooks/useValidateUrl';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { ReportFormRadioControlLabel } from '@components/common/report/ControlLabel';
import DateTimePicker from '@components/common/report/DateTimePicker';
import FilledInput from '@components/common/report/FilledInput';
import Heading2 from '@components/common/report/Heading2';
import Label from '@components/common/report/Label';
import Tooltip from '@components/common/report/Tooltip';
import BackHeader from '@components/common/ui/BackHeader';
import BottomSheet from '@components/common/ui/BottomSheeet';
import BaseButton from '@components/common/ui/button/BaseButton';
import HorizontalRule from '@components/ui/HorizontalRule';
import ReportSubmitModal from '@components/ui/ReportSubmitModal';

const ReportApplicationPage = () => {
  const navigate = useNavigate();
  const { reportType, applicationId } = useParams();

  const [applyFile, setApplyFile] = useState<File | null>(null);
  const [recruitmentFile, setRecruitmentFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useAuthStore();
  const { data: reportApplication, validate } = useReportApplicationStore();

  const { mutateAsync: patchMyApplication } = usePatchMyApplication();

  const convertFile = async () => {
    let applyUrl = '';
    let recruitmentUrl = '';

    // 파일 변환
    if (applyFile) {
      applyUrl = await uploadFile({ file: applyFile, type: 'REPORT' });
    }
    if (recruitmentFile) {
      recruitmentUrl = await uploadFile({
        file: recruitmentFile,
        type: 'REPORT',
      });
    }
    return { applyUrl, recruitmentUrl };
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
      reportType?.toUpperCase() !== 'PERSONAL_STATEMENT' &&
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
    <div className="max-w-[55rem] px-5 md:pb-10 md:pt-5 xl:flex xl:gap-16">
      <div className="w-full">
        <BackHeader to="/report/management">제출하기</BackHeader>

        <main className="mb-8 flex flex-col gap-10">
          <CallOut
            className="bg-neutral-100"
            header="❗ 제출 전 꼭 읽어주세요"
            body="이력서 파일/링크가 잘 열리는 지 확인 후 첨부해주세요!"
          />

          {/* 진단용 서류 */}
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

          {/* 1:1 온라인 상담 일정 */}
          {reportApplication.isFeedbackApplied && (
            <>
              <ScheduleSection />
              <HorizontalRule className="-mx-5 md:-mx-32 lg:mx-0" />
            </>
          )}

          {/* 추가 정보 */}
          <AdditionalInfoSection />
        </main>
      </div>

      <BottomSheet className="xl:mx-48">
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
          const { applyUrl, recruitmentUrl } = await convertFile();

          await patchMyApplication({
            applicationId: Number(applicationId),
            applyUrl,
            recruitmentUrl,
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
        <Heading2>1:1 온라인 상담 일정</Heading2>
        <Tooltip alt="1:1 온라인 상담 일정 도움말">
          1:1 온라인 상담은 서류 진단서 발급 이후에 진행됩니다.
        </Tooltip>
      </div>
      <div className="flex w-full flex-col gap-5">
        <span className="text-xsmall14">
          희망하시는 1:1 온라인 상담(40분) 일정을 모두 선택해주세요.
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
            time={
              data.desiredDate2 === undefined ||
              dayjs(data.desiredDate2).hour() === 0
                ? undefined
                : dayjs(data.desiredDate2).hour()
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
            time={
              data.desiredDate3 === undefined ||
              dayjs(data.desiredDate3).hour() === 0
                ? undefined
                : dayjs(data.desiredDate3).hour()
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
  }, [file, dispatch]);

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
