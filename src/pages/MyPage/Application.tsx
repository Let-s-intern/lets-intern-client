import SectionTitle from '../../components/SectionTitle';
import ProgramListSlider from '../../components/ProgramListSlider';
import { useEffect, useState } from 'react';
import Program from '../../interfaces/program';
import useAxios from '../../hooks/useAxios';

const Application = () => {
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

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <>
      <section>
        <SectionTitle>신청완료</SectionTitle>
        <ProgramListSlider
          programs={programs}
          cardType="신청 완료"
          loading={loading}
        />
      </section>
      <section>
        <SectionTitle className="mt-10">참여중</SectionTitle>
        <ProgramListSlider
          programs={programs}
          cardType="참여 중"
          loading={loading}
        />
      </section>
      <section>
        <SectionTitle className="mt-10">참여완료</SectionTitle>
        <ProgramListSlider
          programs={programs}
          cardType="참여 완료"
          loading={loading}
        />
      </section>
    </>
  );
};

export default Application;
