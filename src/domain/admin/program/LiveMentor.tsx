import { useState } from 'react';

import Input from '@/common/input/v1/Input';
import OutlinedTextarea from '@/domain/admin/OutlinedTextarea';
import { CreateLiveReq, LiveIdSchema, UpdateLiveReq } from '@/schema';

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

function LiveMentor<T extends CreateLiveReq | UpdateLiveReq>({
  defaultValue,
  setInput,
}: LiveMentorProps<T>) {
  const [mentorCareer, setMentorCareer] = useState(defaultValue.mentorCareer);
  const [mentorIntroduction, setMentorIntroduction] = useState(
    defaultValue.mentorIntroduction,
  );

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'mentorCareer') setMentorCareer(value);
    else if (name === 'mentorIntroduction') setMentorIntroduction(value);

    setInput((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <Input
        label="멘토이름"
        type="text"
        name="mentorName"
        placeholder="멘토 이름을 입력해주세요"
        defaultValue={defaultValue.mentorName ?? undefined}
        size="small"
        onChange={onChange}
      />
      <Input
        label="멘토회사"
        type="text"
        name="mentorCompany"
        size="small"
        defaultValue={defaultValue.mentorCompany ?? undefined}
        placeholder="멘토 회사를 입력해주세요"
        onChange={onChange}
      />
      <Input
        label="멘토직무"
        type="text"
        name="mentorJob"
        size="small"
        defaultValue={defaultValue.mentorJob ?? undefined}
        placeholder="멘토 직무를 입력해주세요"
        onChange={onChange}
      />
      <OutlinedTextarea
        name="mentorCareer"
        value={mentorCareer ?? ''}
        placeholder="멘토 경력을 입력해주세요"
        onChange={onChange}
      />
      <OutlinedTextarea
        name="mentorIntroduction"
        value={mentorIntroduction ?? undefined}
        placeholder="한 줄 소개를 입력해주세요"
        onChange={onChange}
      />
    </div>
  );
}

export default LiveMentor;
