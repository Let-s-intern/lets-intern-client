import { useEffect, useState } from 'react';

import SectionTitle from '../components/SectionTitle';
import ProgramListSlider from '../components/ProgramListSlider';
import TabBar from '../components/TabBar';
import TabItem from '../components/TabItem';
import Card from '../components/Card';

import { useSearchParams } from 'react-router-dom';
import axios from '../libs/axios';

const Programs = () => {
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState<any>(null);
  const [closedPrograms, setClosedPrograms] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const category = searchParams.get('category') || 'ALL';

  useEffect(() => {
    const params = !category || category === 'ALL' ? {} : { type: category };
    setLoading(true);
    axios
      .get('/program', {
        params,
        headers: {
          Authorization: '',
        },
      })
      .then((res) => {
        return res.data.programList;
      })
      .then((programs) => {
        setPrograms(
          programs.filter((program: any) => program.status === 'OPEN'),
        );
        setClosedPrograms(
          programs.filter((program: any) => program.status !== 'OPEN'),
        );
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
    <>
      <main className="container mx-auto px-5 pb-5">
        <TabBar itemCount={4}>
          <TabItem to="/" {...(category === 'ALL' && { active: true })}>
            모든 프로그램
          </TabItem>
          <TabItem
            to="/?category=CHALLENGE"
            {...(category === 'CHALLENGE' && { active: true })}
          >
            챌린지
          </TabItem>
          <TabItem
            to="/?category=BOOTCAMP"
            {...(category === 'BOOTCAMP' && { active: true })}
          >
            부트캠프
          </TabItem>
          <TabItem
            to="/?category=LETS_CHAT"
            {...(category === 'LETS_CHAT' && { active: true })}
          >
            렛츠-챗
          </TabItem>
        </TabBar>
        <div className="h-9"></div>
        <header className="absolute left-0 flex h-32 w-full items-center justify-center bg-primary text-center text-white">
          <div>
            <span className="text-2xl font-bold">렛츠인턴</span>
            <p className="mt-2">인턴/신입, 첫 시작을 함께 하는 커리어 플랫폼</p>
          </div>
        </header>
        <div className="h-36"></div>
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
              {closedPrograms.map((program: any) => (
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
    </>
  );
};

export default Programs;
