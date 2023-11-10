import { memo, useEffect, useState } from 'react';

import SectionTitle from '../components/SectionTitle';
import ProgramListSlider from '../components/ProgramListSlider';
import TabBar from '../components/TabBar';
import TabItem from '../components/TabItem';
import Card from '../components/Card';

import Program from '../interfaces/program';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Programs = () => {
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [closedPrograms, setClosedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const category = searchParams.get('category') || 'ALL';

  useEffect(() => {
    const url =
      !category || category === 'ALL'
        ? `${process.env.REACT_APP_SERVER_API}/program/list`
        : `${process.env.REACT_APP_SERVER_API}/program/list/${category}`;
    setLoading(true);
    axios
      .get(url, {
        params: {
          page: 0,
          size: 3,
          sort: 'string',
        },
      })
      .then((res) => {
        setPrograms(res.data.openProgramList);
        setClosedPrograms(res.data.closedProgramList);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <main className="container mx-auto p-5">
      <TabBar itemCount={4}>
        <TabItem to={`/`} {...(category === 'ALL' && { active: true })}>
          모든 프로그램
        </TabItem>
        <TabItem
          to={`/?category=CHALLENGE_HALF`}
          {...(category === 'CHALLENGE_HALF' && { active: true })}
        >
          챌린지
        </TabItem>
        <TabItem
          to={`/?category=BOOTCAMP`}
          {...(category === 'BOOTCAMP' && { active: true })}
        >
          부트캠프
        </TabItem>
        <TabItem
          to={`/?category=LETS_CHAT`}
          {...(category === 'LETS_CHAT' && { active: true })}
        >
          렛츠-챗
        </TabItem>
      </TabBar>
      <section className="mt-10">
        <SectionTitle fontWeight="bold">현재 모집중이에요</SectionTitle>
        <p className="text-gray-500">
          아래에서 모집중인 프로그램을 확인해보세요!
        </p>
        <ProgramListSlider programs={programs} loading={loading} />
      </section>
      <section className="mt-5">
        <SectionTitle fontWeight="bold">아쉽지만 마감되었어요</SectionTitle>
        <p className="text-gray-500">
          더 많은 프로그램들이 준비되어 있으니 걱정마세요!
        </p>
        {loading || closedPrograms.length === 0 ? (
          <div className="h-[175px] w-full"></div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {closedPrograms.map((program) => (
              <Card
                key={program.id}
                program={program}
                loading={loading}
                closed
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default memo(Programs);
