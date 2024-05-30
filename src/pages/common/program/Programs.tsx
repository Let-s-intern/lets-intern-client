import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import classes from './Programs.module.scss';
import ProgramCard from '../../../components/common/program/programs/card/ProgramCard';
import ProgramMenu from '../../../components/common/program/programs/menu/ProgramMenu';
import { PROGRAM_CATEGORY } from '../../../utils/convert';
import axios from '../../../utils/axios';
import { IProgram } from '../../../interfaces/Program.interface';

const Programs = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || PROGRAM_CATEGORY.ALL;
  const [challengeList, setChallengeList] = useState<IProgram[]>([]);

  const getChallengeList = async () => {
    const pageable = { page: 0, size: 4, sort: 'string' };
    const queryList = Object.entries(pageable).map(
      ([key, value]) => `${key}=${value}`,
    );
    try {
      const res = await axios.get(`/challenge?${queryList.join('&')}`);
      if (res.status === 200) {
        setChallengeList(res.data.data.programList);
        return res.data;
      }
      throw new Error(`${res.status} ${res.statusText}`);
    } catch (error) {
      console.error(error);
    }
  };
  const { isLoading } = useQuery({
    queryKey: ['challenge'],
    queryFn: getChallengeList,
  });

  if (isLoading) return <></>;

  return (
    <>
      <div className={classes.page}>
        <main className={classes.main}>
          <section className="sticky top-16 bg-static-100 px-5 pt-7 sm:top-24 lg:pt-8">
            <div className="flex justify-center">
              <ul className="flex w-full max-w-[60rem] items-center justify-between">
                <li className="w-4/12">
                  <ProgramMenu
                    selected={category === PROGRAM_CATEGORY.ALL}
                    to="/program"
                    category={PROGRAM_CATEGORY.ALL}
                    caption="전체보기"
                  />
                </li>
                <li className="w-4/12">
                  <ProgramMenu
                    selected={category === PROGRAM_CATEGORY.CHALLENGE}
                    to={`/program?category=${PROGRAM_CATEGORY.CHALLENGE}`}
                    category={PROGRAM_CATEGORY.CHALLENGE}
                    caption="렛츠 챌린지"
                  />
                </li>
                <li className="w-4/12">
                  <ProgramMenu
                    selected={category === PROGRAM_CATEGORY.CLASS}
                    to={`/program?category=${PROGRAM_CATEGORY.CLASS}`}
                    category={PROGRAM_CATEGORY.CLASS}
                    caption="렛츠 클래스"
                  />
                </li>
              </ul>
            </div>
          </section>
          <section className="px-5 py-8">
            <article>
              <div className="flex items-center justify-between">
                <div className="mb-6">
                  <h1 className="text-1.125-bold">첫장 챌린지</h1>
                  <span className="text-0.875 text-neutral-20">
                    커리어 준비의 첫 시작이 막막하다면?
                  </span>
                </div>
                <Link className="text-0.75 text-neutral-40" to="#">
                  전체보기
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {challengeList.map((challenge) => (
                  <ProgramCard program={challenge} />
                ))}
              </div>
            </article>
          </section>
          <section className={classes.closedPrograms}></section>
        </main>
      </div>
    </>
  );
};

export default Programs;
