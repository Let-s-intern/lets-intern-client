import {
  FormControl,
  RadioGroup,
  SelectChangeEvent,
  useMediaQuery,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoCloseOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetParticipationInfo } from '../../../api/application';
import { uploadFile } from '../../../api/file';
import {
  convertReportPriceType,
  convertReportTypeStatus,
  useGetReportDetailQuery,
} from '../../../api/report';
import Card from '../../../components/common/report/Card';
import ControlLabel from '../../../components/common/report/ControlLabel';
import DateTimePicker from '../../../components/common/report/DateTimePicker';
import FilledInput from '../../../components/common/report/FilledInput';
import Heading1 from '../../../components/common/report/Heading1';
import Heading2 from '../../../components/common/report/Heading2';
import Label from '../../../components/common/report/Label';
import Tooltip from '../../../components/common/report/Tooltip';
import BottomSheet from '../../../components/common/ui/BottomSheeet';
import Input from '../../../components/common/ui/input/Input';
import useReportPayment from '../../../hooks/useReportPayment';
import useReportProgramInfo from '../../../hooks/useReportProgramInfo';
import useReportApplicationStore from '../../../store/useReportApplicationStore';

const ReportApplyPage = () => {
  const isUpTo1280 = useMediaQuery('(max-width: 1280px)');
  const navigate = useNavigate();
  const { reportType, reportId } = useParams();

  const [applyFile, setApplyFile] = useState<File | null>(null);
  const [recruitmentFile, setRecruitmentFile] = useState<File | null>(null);

  const {
    data: reportApplication,
    setReportApplication,
    initReportApplication,
    validate,
  } = useReportApplicationStore();

  const convertFile = () => {
    // 파일 변환
    if (applyFile) {
      uploadFile({ file: applyFile, type: 'REPORT' }).then((url: string) => {
        setReportApplication({ applyUrl: url });
      });
    }
    if (recruitmentFile) {
      uploadFile({ file: recruitmentFile, type: 'REPORT' }).then(
        (url: string) => {
          setReportApplication({ recruitmentUrl: url });
        },
      );
    }
  };

  useEffect(() => {
    setReportApplication({
      reportId: Number(reportId),
    });
  }, []);

  return (
    <div className="px-5 md:px-32 md:py-10 xl:flex xl:gap-16 xl:px-48">
      <div className="w-full">
        <header>
          <Heading1>진단서 신청하기</Heading1>
          <CallOut />
        </header>
        <main className="my-8 flex flex-col gap-10">
          <ProgramInfoSection />
          <DocumentSection file={applyFile} dispatch={setApplyFile} />
          {reportApplication.reportPriceType === 'PREMIUM' && (
            <PremiumSection
              file={recruitmentFile}
              dispatch={setRecruitmentFile}
            />
          )}
          {reportApplication.isFeedbackApplied && <ScheduleSection />}
          <AdditionalInfoSection />
        </main>
      </div>

      {isUpTo1280 ? (
        <BottomSheet>
          <button
            onClick={() => navigate(-1)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-primary bg-neutral-100"
          >
            <FaArrowLeft size={20} />
          </button>
          <button
            onClick={() => {
              convertFile();
              const { isValid, message } = validate();
              if (!isValid) {
                alert(message);
                return;
              }
              navigate(`/report/payment/${reportType}/${reportId}`);
            }}
            className="text-1.125-medium w-full rounded-md bg-primary py-3 text-center font-medium text-neutral-100"
          >
            다음
          </button>
        </BottomSheet>
      ) : (
        <aside className="h-fit w-96 shrink-0 rounded-lg bg-static-100 px-5 pb-6 shadow-03">
          <Heading1>결제하기</Heading1>
          <div className="flex flex-col gap-10">
            <UsereInfoSection />
            <ReportPaymentSection />
            <button
              onClick={() => {
                convertFile();
                const { isValid, message } = validate();
                if (!isValid) {
                  alert(message);
                  return;
                }
                if (reportApplication.contactEmail === '') {
                  alert('정보 수신용 이메일을 입력해주세요.');
                  return;
                }
                navigate(`/payment`);
              }}
              className="text-1.125-medium w-full rounded-md bg-primary py-3 text-center font-medium text-neutral-100"
            >
              결제하기
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default ReportApplyPage;

const CallOut = () => {
  const { reportId } = useParams();

  const { data } = useGetReportDetailQuery(Number(reportId));

  return (
    <div className="rounded-md bg-neutral-100 px-6 py-6">
      <span className="-ml-1 text-xsmall16 font-semibold text-primary">
        ❗신청 전 꼭 읽어주세요
      </span>
      <p className="mt-1 text-xsmall14 text-neutral-20">{data?.notice}</p>
    </div>
  );
};

const ProgramInfoSection = () => {
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
        title={title!}
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

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex w-[8.75rem] shrink-0 items-center lg:mt-2">
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
            <ControlLabel
              label="파일 첨부"
              value="file"
              subText="(pdf, doc, docx 형식 지원)"
            />
            {value === 'file' && (
              <FileUploadButton file={file} dispatch={dispatch} />
            )}
          </div>
          {/* URL */}
          <div>
            <ControlLabel label="URL" value="url" />
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

  return (
    <section className="flex flex-col gap-1 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex w-[8.75rem] shrink-0 items-center">
        <Heading2>(프리미엄) 채용공고</Heading2>
        <RequiredStar />
      </div>
      <div className="w-full">
        <span className="mb-3 inline-block text-xsmall14 lg:mb-4">
          희망하는 기업의 채용공고를 첨부해주세요.
        </span>
        <FormControl fullWidth>
          <RadioGroup
            defaultValue="file"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value === 'url') dispatch(null);
              else setReportApplication({ recruitmentUrl: '' });
            }}
            name="radio-buttons-group"
          >
            <div className="mb-4">
              <ControlLabel
                label="파일 첨부"
                value="file"
                subText="(pdf, doc, docx 형식 지원)"
              />
              <span className="-mt-1 mb-2 block text-xxsmall12 text-neutral-45">
                *업무, 지원자격, 우대사항이 보이게 채용공고를 캡처해주세요.
              </span>
              {value === 'file' && (
                <FileUploadButton file={file} dispatch={dispatch} />
              )}
            </div>
            <div>
              <ControlLabel label="URL" value="url" />
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
            </div>
          </RadioGroup>
        </FormControl>
      </div>
    </section>
  );
};

const ScheduleSection = () => {
  const { data, setReportApplication } = useReportApplicationStore();
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

    setReportApplication({
      [e.target.name]: dayjs(prev as dayjs.ConfigType)
        .set('hour', e.target.value as number)
        .format('YYYY-MM-DDTHH:00'),
    });
  };

  return (
    <section className="flex flex-col gap-1 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex w-[8.75rem] shrink-0 items-center gap-1">
        <Heading2>맞춤 첨삭 일정</Heading2>
        <Tooltip alt="맞춤 첨삭 일정 도움말">
          1:1 첨삭은 서류 진단서 발급 이후에 진행됩니다.
        </Tooltip>
      </div>
      <div className="flex w-full flex-col gap-5">
        <span className="text-xsmall14">
          희망하시는 맞춤 첨삭(40분) 일정을 1개 이상 선택해주세요.
        </span>
        <div>
          <Label>희망순위1*</Label>
          <DateTimePicker
            date={dayjs(data.desiredDate1)}
            time={dayjs(data.desiredDate1).hour()}
            name="desiredDate1"
            onChangeDate={onChangeDate}
            onChangeTime={onChangeTime}
          />
        </div>
        <div>
          <Label>희망순위2*</Label>
          <DateTimePicker
            date={dayjs(data.desiredDate2)}
            time={dayjs(data.desiredDate2).hour()}
            name="desiredDate2"
            onChangeDate={onChangeDate}
            onChangeTime={onChangeTime}
          />
        </div>
        <div>
          <Label>희망순위3*</Label>
          <DateTimePicker
            date={dayjs(data.desiredDate3)}
            time={dayjs(data.desiredDate3).hour()}
            name="desiredDate3"
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

/* 모바일 전용 결제 페이지(ReportPaymentPage)에서 같이 사용 */
export const UsereInfoSection = () => {
  const [checked, setChecked] = useState(true);

  const { data: participationInfo } = useGetParticipationInfo();
  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();

  useEffect(() => {
    // 가입한 이메일을 정보 수신용 이메일로 설정
    setReportApplication({
      contactEmail: participationInfo?.email || '',
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
      <div className="mb-4 mt-6 flex flex-col gap-3">
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
              if (checked)
                setReportApplication({
                  contactEmail: '',
                });
              else
                setReportApplication({
                  contactEmail: participationInfo?.email || '',
                });
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

/* 모바일 전용 결제 페이지(ReportPaymentPage)에서 같이 사용 */
export const ReportPaymentSection = () => {
  const { data: reportApplication } = useReportApplicationStore();
  const { state: priceInfo } = useReportPayment();

  return (
    <section className="flex flex-col gap-6">
      <Heading2>결제 정보</Heading2>
      {/* <div className="flex gap-2.5">
        <Input
          className="w-full"
          type="text"
          placeholder="쿠폰 번호를 입력해주세요."
        />
        <button className="shrink-0 rounded-sm bg-primary px-4 py-1.5 text-xsmall14 font-medium text-neutral-100">
          쿠폰 등록
        </button>
      </div>
      <hr className="my-5" /> */}
      <div className="flex flex-col">
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>
            서류 진단서 (
            {reportApplication.optionIds.length === 0
              ? convertReportPriceType(reportApplication.reportPriceType)
              : `${convertReportPriceType(reportApplication.reportPriceType)} + 옵션`}
            )
          </span>
          {/* 서류 진단 + 사용자가 선택한 모든 옵션 가격을 더한 값 */}
          <span>{priceInfo.report.toLocaleString()}원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>1:1 피드백</span>
          {/* 1:1 피드백 가격 */}
          <span>{priceInfo.feedback.toLocaleString()}원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          {/* 서류진단 + 사용자가 선택한 모든 옵션 + 1:1 피드백의 할인 가격을 모두 더한 값 */}
          <span>
            {Math.ceil(
              (priceInfo.discount / (priceInfo.report + priceInfo.feedback)) *
                100,
            )}
            % 할인
          </span>
          <span>-{priceInfo.discount.toLocaleString()}원</span>
        </div>
        {/* <div className="flex h-10 items-center justify-between px-3 text-primary">
          <span>쿠폰할인</span>
          <span className="font-bold">
            -{priceInfo.coupon.toLocaleString()}원
          </span>
        </div> */}
        <hr className="my-5" />
        <div className="flex h-10 items-center justify-between px-3 font-semibold text-neutral-0">
          <span>결제금액</span>
          <span>{priceInfo.total.toLocaleString()}원</span>
        </div>
      </div>
    </section>
  );
};

const RequiredStar = () => {
  return <span className="text-[#7B61FF]">*</span>;
};

const FileUploadButton = ({
  file,
  dispatch,
}: {
  file: File | null;
  dispatch: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const ref = useRef<HTMLInputElement>(null);

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
            <span>{`${file.name} (${(file.size / 1000).toFixed(1)}KB)`}</span>
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
};
