'use client';

import { useState } from 'react';

import FilterChips from '../ui/FilterChips';
import {
  CONCERN_FILTER_OPTIONS,
  ConcernFilterValue,
  JOB_FILTER_OPTIONS,
  JobFilterValue,
} from '../constants';

const MentorFilterSection = () => {
  const [concern, setConcern] = useState<ConcernFilterValue>('all');
  const [job, setJob] = useState<JobFilterValue>('all');

  return (
    <section className="mt-12 flex w-full flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h2 className="text-small18 text-neutral-0 font-semibold">취업 고민</h2>
        <FilterChips
          options={CONCERN_FILTER_OPTIONS}
          selected={concern}
          onChange={setConcern}
        />
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-small18 text-neutral-0 font-semibold">관심 직무</h2>
        <FilterChips
          options={JOB_FILTER_OPTIONS}
          selected={job}
          onChange={setJob}
        />
      </div>
    </section>
  );
};

export default MentorFilterSection;
