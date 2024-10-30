import { CreateLiveReq, LiveIdSchema, UpdateLiveReq } from '@/schema';
import Input from '@components/ui/input/Input';

interface LiveMentorProps<T extends CreateLiveReq | UpdateLiveReq> {
  defaultValue: Pick<
    LiveIdSchema,
    | 'mentorName'
    | 'mentorCompany'
    | 'mentorJob'
    | 'mentorCareer'
    | 'mentorIntroduction'
  >;
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

export default function LiveMentor<T extends CreateLiveReq | UpdateLiveReq>({
  defaultValue,
  setInput,
}: LiveMentorProps<T>) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <Input
        label="멘토이름"
        type="text"
        name="mentorName"
        placeholder="멘토 이름을 입력해주세요"
        defaultValue={defaultValue.mentorName}
        size="small"
        onChange={onChange}
      />
      <Input
        label="멘토회사"
        type="text"
        name="mentorCompany"
        size="small"
        defaultValue={defaultValue.mentorCompany}
        placeholder="멘토 회사를 입력해주세요"
        onChange={onChange}
      />
      <Input
        label="멘토직무"
        type="text"
        name="mentorJob"
        size="small"
        defaultValue={defaultValue.mentorJob}
        placeholder="멘토 직무를 입력해주세요"
        onChange={onChange}
      />
      <Input
        label="멘토경력"
        type="text"
        name="mentorCareer"
        size="small"
        defaultValue={defaultValue.mentorCareer}
        placeholder="멘토 경력을 입력해주세요"
        onChange={onChange}
      />
      <Input
        label="멘토 한 줄 소개"
        type="text"
        name="mentorIntroduction"
        size="small"
        defaultValue={defaultValue.mentorIntroduction}
        placeholder="한 줄 소개를 입력해주세요"
        onChange={onChange}
      />
    </div>
  );
}
