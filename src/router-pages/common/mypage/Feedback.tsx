import { useMentorListQuery } from '@/api/user';
import { useEffect } from 'react';

const Feedback = () => {
  const { data } = useMentorListQuery();
  useEffect(() => {
    if (data) {
      console.log('멘토 목록:', data.mentorList);
    }
  }, [data]);

  return <section className="flex flex-col gap-6"></section>;
};

export default Feedback;
