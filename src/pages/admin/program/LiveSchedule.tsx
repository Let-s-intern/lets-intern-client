import { ReactNode } from 'react';

import { CreateLiveReq, UpdateLiveReq } from '@/schema';

interface LiveScheduleProps<T extends CreateLiveReq | UpdateLiveReq> {
  input: Omit<T, 'desc'>;
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}
export default function LiveSchedule<T extends CreateLiveReq | UpdateLiveReq>({
  input,
  setInput,
}: LiveScheduleProps<T>) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-3">
      <DateTimeControl>
        <DateTimeLabel htmlFor="startDate">시작 일자</DateTimeLabel>
        <input
          id="startDate"
          type="datetime-local"
          name="startDate"
          value={input.startDate}
          onChange={onChange}
          step={600}
        />
      </DateTimeControl>
      <DateTimeControl>
        <DateTimeLabel htmlFor="endDate">종료 일자</DateTimeLabel>
        <input
          id="endDate"
          type="datetime-local"
          name="endDate"
          value={input.endDate}
          onChange={onChange}
        />
      </DateTimeControl>
      <DateTimeControl>
        <DateTimeLabel htmlFor="beginning">모집 시작 일자</DateTimeLabel>
        <input
          id="beginning"
          type="datetime-local"
          name="beginning"
          value={input.beginning}
          onChange={onChange}
        />
      </DateTimeControl>
      <DateTimeControl>
        <DateTimeLabel htmlFor="deadline">모집 마감 일자</DateTimeLabel>
        <input
          id="deadline"
          type="datetime-local"
          name="deadline"
          value={input.deadline}
          onChange={onChange}
        />
      </DateTimeControl>
    </div>
  );
}

function DateTimeControl({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-4">{children}</div>;
}

function DateTimeLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label className="w-32 font-medium" htmlFor={htmlFor}>
      {children}
    </label>
  );
}
