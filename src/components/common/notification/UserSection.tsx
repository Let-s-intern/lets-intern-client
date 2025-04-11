import { ParticipationInfo } from '@/api/user';
import { ChangeEvent, Dispatch, memo, SetStateAction } from 'react';
import Input from '../ui/input/Input';
import Label from '../ui/input/Label';
import InstructionText from './InstructionText';
import JobSelect from './JobSelect';

const jobOptions = [
  '경영/인사/재무',
  '전략/기획/관리',
  '기술/개발/엔지니어링',
  '디자인/크리에이티브',
  '마케팅/영업',
  '운영/CX',
  '기타',
];

interface Props {
  userData?: ParticipationInfo;
  selectedJobs: string[];
  isOpen: boolean;
  openDispatch: Dispatch<SetStateAction<boolean>>;
  onChangeOption: (opt: string) => void;
  onChangeUsername: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePhoneNumber: (e: ChangeEvent<HTMLInputElement>) => void;
}

function UserSection({
  userData,
  selectedJobs,
  isOpen,
  openDispatch,
  onChangeOption,
  onChangeUsername,
  onChangePhoneNumber,
}: Props) {
  const isOtherJob = selectedJobs.includes('기타');

  return (
    <section className="flex flex-col gap-5 py-8">
      <InstructionText>
        출시 알림을 받을 수 있도록 <br className="md:hidden" />
        아래 정보를 입력해주세요
      </InstructionText>
      {/* 이름 */}
      <div>
        <Label htmlFor="name" required>
          이름
        </Label>
        <Input
          id="name"
          className="mt-1 w-full"
          required
          name="name"
          placeholder="이름을 입력해주세요"
          readOnly={!!userData}
          defaultValue={userData ? userData.name : undefined}
          onChange={onChangeUsername}
          maxLength={100}
        />
      </div>
      {/* 휴대폰 번호 */}
      <div>
        <Label required>휴대폰 번호</Label>
        <div className="mt-1 flex items-center gap-1.5">
          <Input
            className="w-14"
            defaultValue="010"
            required
            name="phoneNumber-0"
            readOnly={!!userData}
            maxLength={3}
            onChange={onChangePhoneNumber}
          />
          <Input
            className="w-16"
            required
            name="phoneNumber-1"
            defaultValue={
              userData ? userData.phoneNumber.slice(4, 8) : undefined
            }
            readOnly={!!userData}
            maxLength={4}
            onChange={onChangePhoneNumber}
          />
          <Input
            className="w-16"
            required
            name="phoneNumber-2"
            defaultValue={
              userData ? userData.phoneNumber.slice(9, 13) : undefined
            }
            readOnly={!!userData}
            maxLength={4}
            onChange={onChangePhoneNumber}
          />
        </div>
      </div>
      {/* 관심 직무 */}
      <div>
        <JobSelect
          options={jobOptions}
          selectedOpts={selectedJobs}
          isOpen={isOpen}
          openDispatch={openDispatch}
          onClose={() => openDispatch(false)}
          onChange={onChangeOption}
        />
        {/* 기타 직무 */}
        {isOtherJob && (
          <Input
            className="mt-2 w-full"
            required
            name="job"
            placeholder="관심 직무를 입력해주세요"
          />
        )}
      </div>
    </section>
  );
}

export default memo(UserSection);
