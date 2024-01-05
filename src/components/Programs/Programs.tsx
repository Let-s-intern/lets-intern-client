import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import axios from '../../utils/axios';
import ProgramListSlider from '../ProgramListSlider';
import ClosedCard from './ClosedCard';
import TabBar from '../TabBar';
import TabItem from '../TabItem';

import './Programs.scss';

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
      <div className="program-list-page">
        <div className="h-9">
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
        </div>
        <header>
          <div className="banner">
            <h1>렛츠인턴</h1>
            <h2>인턴/신입, 첫 시작을 함께 하는 커리어 플랫폼</h2>
          </div>
        </header>
        <main>
          <section className="opened-programs">
            <h2>현재 모집중이에요</h2>
            <p>아래에서 모집중인 프로그램을 확인해보세요!</p>
            <ProgramListSlider programs={programs} loading={loading} />
          </section>
          <section className="closed-programs">
            <h2>아쉽지만 마감되었어요</h2>
            <p>더 많은 프로그램들이 준비되어 있으니 걱정마세요!</p>
            {loading || closedPrograms.length === 0 ? (
              <div className="closed-card-list">
                <div className="placeholder" />
              </div>
            ) : (
              <div className="closed-card-list">
                <div className="card-list">
                  {closedPrograms.map((program: any) => (
                    <ClosedCard key={program.id} program={program} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default Programs;
