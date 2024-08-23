import { FormControl, RadioGroup } from '@mui/material';

import { useState } from 'react';
import ControlLabel from '../../../components/common/report/ControlLabel';
import DateTimePicker from '../../../components/common/report/DateTimePicker';
import FilledInput from '../../../components/common/report/FilledInput';
import Heading2 from '../../../components/common/report/Heading2';
import Heading3 from '../../../components/common/report/Heading3';
import OutlinedButton from '../../../components/common/report/OutlinedButton';
import Tooltip from '../../../components/common/report/Tooltip';

const programName = '포트폴리오 조지기';
const type = '포트폴리오';

const ReportApplyPage = () => {
  return (
    <div className="px-5 md:px-32 md:py-10">
      <header>
        <h1 className="py-6 text-small20 font-bold">진단서 신청하기</h1>
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
    <div>
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
        <div className="h-20 w-28 rounded-sm bg-neutral-60">
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
    </div>
  );
};

const DocumentSection = () => {
  const [value, setValue] = useState('file');

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex w-[8.75rem] shrink-0 items-center lg:mt-2">
        <Heading2>진단용 {type}</Heading2>
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
    </div>
  );
};

const PremiumSection = () => {
  const [value, setValue] = useState('file');

  return (
    <div className="flex flex-col gap-1 lg:flex-row lg:items-start lg:gap-5">
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
    </div>
  );
};

const ScheduleSection = () => {
  return (
    <div className="flex flex-col gap-1 lg:flex-row lg:items-start lg:gap-5">
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
          <Heading3>희망순위1*</Heading3>
          <DateTimePicker />
        </div>
        <div>
          <Heading3>희망순위2</Heading3>
          <DateTimePicker />
        </div>
        <div>
          <Heading3>희망순위3</Heading3>
          <DateTimePicker />
        </div>
      </div>
    </div>
  );
};

const AdditionalInfoSection = () => {
  return (
    <div className="flex flex-col gap-5">
      <Heading2>추가 정보</Heading2>
      <div>
        <Heading3>
          희망직무
          <RequiredStar />
        </Heading3>
        <FilledInput placeholder="희망하는 직무를 알려주세요" />
      </div>
      <div>
        <Heading3>서류 작성 고민</Heading3>
        <textarea
          className="w-full resize-none rounded-md bg-neutral-95 p-3 text-xsmall14"
          name="concern"
          placeholder="진단에 참고할 수 있도록 서류 작성에 대한 고민을 적어주세요"
          rows={2}
        />
      </div>
    </div>
  );
};

const RequiredStar = () => {
  return <span className="text-[#7B61FF]">*</span>;
};
