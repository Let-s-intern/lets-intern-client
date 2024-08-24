import { FormControl, RadioGroup, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

import ControlLabel from '../../../components/common/report/ControlLabel';
import DateTimePicker from '../../../components/common/report/DateTimePicker';
import FilledInput from '../../../components/common/report/FilledInput';
import Heading1 from '../../../components/common/report/Heading1';
import Heading2 from '../../../components/common/report/Heading2';
import Label from '../../../components/common/report/Label';
import OutlinedButton from '../../../components/common/report/OutlinedButton';
import Tooltip from '../../../components/common/report/Tooltip';
import BottomSheet from '../../../components/common/ui/BottomSheeet';

const programName = '포트폴리오 조지기';

const ReportApplyPage = () => {
  const isUpTo1280 = useMediaQuery('(max-width: 1280px)');
  const navigate = useNavigate();
  const { reportType, reportId } = useParams();

  return (
    <div className="px-5 md:px-32 md:py-10">
      <header>
        <Heading1>진단서 신청하기</Heading1>
        <div className="rounded-md bg-neutral-100 px-6 py-6">
          <span className="-ml-1 text-xsmall16 font-semibold text-primary">
            ❗신청 전 꼭 읽어주세요
          </span>
          <p className="mt-1 text-xsmall14 text-neutral-20">
            내용내용내용 내용내용내용 내용내용내용 내용내용내용내용내용
            내용내용내용 내용내용내용
          </p>
        </div>
      </header>
      <main className="my-8 flex flex-col gap-10">
        <ProgramInfoSection />
        <DocumentSection />
        <PremiumSection />
        <ScheduleSection />
        <AdditionalInfoSection />
      </main>
      {isUpTo1280 && (
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
      )}
    </div>
  );
};

export default ReportApplyPage;

const ProgramInfoSection = () => {
  /** 다음 정보 필요
   * 1. 어떤 유형인지 (포폴, 자소서, 이력서)
   * 2. 제목이 무엇인지
   * 3. 유형별 정적 썸네일이 무엇인지
   * 4. 베이직인지 프리미엄인지
   * 5. 1:1 첨삭을 신청했는지 안 했는지
   */
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
      <div className="flex items-center gap-4">
        <div className="h-20 w-28 rounded-sm bg-neutral-90">
          <img className="h-auto w-full" src="" alt="" />
        </div>
        <div>
          <span className="font-semibold">{programName}</span>
          <div className="mt-3">
            <div className="flex gap-4">
              <span className="text-xxsmall12 font-medium">상품</span>
              <span className="text-xxsmall12 font-medium text-primary-dark">
                서류 진단서 (베이직), 맞춤 첨삭
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-xxsmall12 font-medium">옵션</span>
              <span className="text-xxsmall12 font-medium text-primary-dark">
                현직자 피드백
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DocumentSection = () => {
  const { reportType } = useParams();

  const [value, setValue] = useState('file');

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex w-[8.75rem] shrink-0 items-center lg:mt-2">
        <Heading2>진단용 {reportType}</Heading2>
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
            {value === 'file' && <OutlinedButton caption="파일 업로드" />}
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
              {value === 'file' && <OutlinedButton caption="파일 업로드" />}
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
          <Label>희망순위2</Label>
          <DateTimePicker />
        </div>
        <div>
          <Label>희망순위3</Label>
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

const RequiredStar = () => {
  return <span className="text-[#7B61FF]">*</span>;
};
