import SectionTitle from '../../components/SectionTitle';
import ProgramListSlider from '../../components/ProgramListSlider';
import { useEffect, useState } from 'react';
import Program from '../../interfaces/program';
import useAxios from '../../hooks/useAxios';
import axios from '../../libs/axios';

const Application = () => {
  const [applicationList, setApplicationList] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchApplicationList = async () => {
      try {
        const res = await axios.get('/application');
        console.log(res.data);
        // setApplicationList(res.data.programList);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationList();
  }, []);

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <>
      <section>
        <SectionTitle>신청완료</SectionTitle>
        {/* <ProgramListSlider
          programs={programs}
          cardType="신청 완료"
          loading={loading}
        /> */}
      </section>
      <section>
        <SectionTitle className="mt-10">참여중</SectionTitle>
        {/* <ProgramListSlider
          programs={programs}
          cardType="참여 중"
          loading={loading}
        /> */}
      </section>
      <section>
        <SectionTitle className="mt-10">참여완료</SectionTitle>
        {/* <ProgramListSlider
          programs={programs}
          cardType="참여 완료"
          loading={loading}
        /> */}
      </section>
    </>
  );
};

export default Application;
