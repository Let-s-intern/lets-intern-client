import SectionTitle from '../../components/SectionTitle';
import ProgramListSlider from '../../components/ProgramListSlider';
import { useEffect, useState } from 'react';
import Program from '../../interfaces/program';
import useAxios from '../../hooks/useAxios';

const Review = () => {
  const { data, loading, error } = useAxios('get', '/program/list', {
    page: 1,
    size: 3,
    sort: 'string',
  });
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    if (!loading && !error) {
      setPrograms(data.openProgramList);
    }
  }, [data, loading, error]);

  return (
    <>
      <section>
        <SectionTitle>후기를 기다리고 있어요</SectionTitle>
        <ProgramListSlider
          programs={programs}
          cardType="참여 완료"
          loading={loading}
        />
      </section>
      <section>
        <SectionTitle className="mt-10">작성한 후기 확인하기</SectionTitle>
        <ProgramListSlider
          programs={programs}
          cardType="참여 완료"
          loading={loading}
        />
      </section>
    </>
  );
};

export default Review;
