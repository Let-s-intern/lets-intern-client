import { FormControl, RadioGroup, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoCloseOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';

import {
  convertReportTypeStatus,
  useGetReportDetail,
} from '../../../api/report';
import { UserInfo } from '../../../components/common/program/program-detail/section/ApplySection';
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
import useProgramStore from '../../../store/useProgramStore';
import { ICouponForm } from '../../../types/interface';

const programName = '포트폴리오 조지기';

const ReportApplyPage = () => {
  const isUpTo1280 = useMediaQuery('(max-width: 1280px)');
  const navigate = useNavigate();
  const { reportType, reportId } = useParams();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    contactEmail: '',
    question: '',
  });
  const [coupon, setCoupon] = useState<ICouponForm>({
    id: null,
    price: 0,
  });

  const {
    data: programApplicationForm,
    setProgramApplicationForm,
    initProgramApplicationForm,
  } = useProgramStore();

  const onClickPayButton = () => {
    //  payInfo 결제정보: application 정보로부터 가져오기
    // 프로그램 신청 정보 가져오기
    // setProgramApplicationForm({});

    navigate(`/payment`);
  };

  /* application으로부터 user 정보 초기화 */
  useEffect(() => {
    // console.log('get user info');
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
          <DocumentSection />
          <PremiumSection />
          <ScheduleSection />
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
            onClick={() =>
              navigate(`/report/payment/${reportType}/${reportId}`)
            }
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
            <PaymentSection />
            <button
              onClick={onClickPayButton}
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

  const { data } = useGetReportDetail(Number(reportId));

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
  /** 다음 정보 필요
   * 1. 어떤 유형인지 (포폴, 자소서, 이력서)
   * 2. 제목이 무엇인지
   * 3. 유형별 정적 썸네일이 무엇인지
   * 4. 베이직인지 프리미엄인지
   * 5. 1:1 첨삭을 신청했는지 안 했는지
   */
  const { reportId } = useParams();

  const { data } = useGetReportDetail(Number(reportId));

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
        title={data?.title || ''}
        content={[
          { label: '상품', text: '서류 진단서 (베이직), 맞춤 첨삭' },
          { label: '옵션', text: '현직자 피드백' },
        ]}
      />
    </section>
  );
};

const DocumentSection = () => {
  const { reportType } = useParams();

  const [value, setValue] = useState('file');
  const [file, setFile] = useState<File | null>(null);

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
          onChange={(event) => setValue(event.target.value)}
        >
          {/* 파일 첨부 */}
          <div className="mb-4">
            <ControlLabel
              label="파일 첨부"
              value="file"
              subText="(pdf, doc, docx 형식 지원)"
            />
            {value === 'file' && (
              <FileUploadButton file={file} dispatch={setFile} />
            )}
          </div>
          {/* URL */}
          <div>
            <ControlLabel label="URL" value="url" />
            {value === 'url' && <FilledInput placeholder="https://" />}
          </div>
        </RadioGroup>
      </FormControl>
    </section>
  );
};

const PremiumSection = () => {
  const [value, setValue] = useState('file');
  const [file, setFile] = useState<File | null>(null);

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
            onChange={(event) => {
              event.target.value !== undefined && setValue(event.target.value);
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
                <FileUploadButton file={file} dispatch={setFile} />
              )}
            </div>
            <div>
              <ControlLabel label="URL" value="url" />
              {value === 'url' && <FilledInput placeholder="https://" />}
            </div>
          </RadioGroup>
        </FormControl>
      </div>
    </section>
  );
};

const ScheduleSection = () => {
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
          <DateTimePicker />
        </div>
        <div>
          <Label>희망순위2*</Label>
          <DateTimePicker />
        </div>
        <div>
          <Label>희망순위3*</Label>
          <DateTimePicker />
        </div>
      </div>
    </section>
  );
};

const AdditionalInfoSection = () => {
  return (
    <section className="flex flex-col gap-5">
      <Heading2>추가 정보</Heading2>
      <div>
        <Label htmlFor="job">
          희망직무
          <RequiredStar />
        </Label>
        <FilledInput id="job" placeholder="희망하는 직무를 알려주세요" />
      </div>
      <div>
        <Label htmlFor="concern">서류 작성 고민</Label>
        <textarea
          id="concern"
          className="w-full resize-none rounded-md bg-neutral-95 p-3 text-xsmall14"
          name="concern"
          placeholder="진단에 참고할 수 있도록 서류 작성에 대한 고민을 적어주세요"
          rows={2}
        />
      </div>
    </section>
  );
};

const UsereInfoSection = () => {
  return (
    <section>
      {/* TODO: 서류 진단 application 정보 불러오기 */}
      <Heading2>참여자 정보</Heading2>
      <div className="mb-4 mt-6 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label>이름</Label>
          <Input disabled readOnly className="text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <Label>휴대폰 번호</Label>
          <Input disabled readOnly className="text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="ml-3 text-xsmall14 font-semibold">
            가입한 이메일
          </label>
          <Input disabled readOnly className="text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="contactEmail">렛츠커리어 정보 수신용 이메일</Label>
          <p className="text-[0.5625rem] font-light text-neutral-0 text-opacity-[52%]">
            * 결제정보 및 프로그램 신청 관련 알림 수신을 위해,
            <br />
            &nbsp;&nbsp; 자주 사용하는 이메일 주소를 입력해주세요!
          </p>
          <label className="flex cursor-pointer items-center gap-1 text-xxsmall12 font-medium">
            <img className="h-auto w-5" src="/icons/checkbox-fill.svg" />
            가입한 이메일과 동일
          </label>
          <Input name="contactEmail" placeholder="example@example.com" />
        </div>
      </div>
    </section>
  );
};

const PaymentSection = () => {
  return (
    <section>
      <Heading2>결제 정보</Heading2>
      <div className="mt-6 flex gap-2.5">
        <Input
          className="w-full"
          type="text"
          placeholder="쿠폰 번호를 입력해주세요."
        />
        <button className="shrink-0 rounded-sm bg-primary px-4 py-1.5 text-xsmall14 font-medium text-neutral-100">
          쿠폰 등록
        </button>
      </div>
      <hr className="my-5" />
      <div className="flex flex-col">
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>서류 진단서 (베이직 + 옵션)</span>
          <span>30,000원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>맞춤첨삭</span>
          <span>15,000원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>20% 할인</span>
          <span>-9,000원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-primary">
          <span>쿠폰할인</span>
          <span className="font-bold">-10,000원</span>
        </div>
        <hr className="my-5" />
        <div className="flex h-10 items-center justify-between px-3 font-semibold text-neutral-0">
          <span>결제금액</span>
          <span>26,000원</span>
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
