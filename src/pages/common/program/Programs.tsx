import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import ClosedCard from '../../../components/common/program/programs/card/ClosedCard';
import classes from './Programs.module.scss';
import CardListSlider from '../../../components/common/ui/card/wrapper/CardListSlider';
import CardListPlaceholder from '../../../components/common/ui/card/placeholder/CardListPlaceholder';
import ProgramCard from '../../../components/common/program/programs/card/ProgramCard';
import { typeToText } from '../../../utils/converTypeToText';
import formatDateString from '../../../utils/formatDateString';
import ProgramMenu from '../../../components/common/program/programs/menu/ProgramMenu';
import { PROGRAM_CATEGORY } from '../../../utils/convert';

const Programs = () => {
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState<any>(null);
  const [closedPrograms, setClosedPrograms] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const category = searchParams.get('category') || PROGRAM_CATEGORY.ALL;

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
            <div>
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
                <div className="flex flex-col gap-2 overflow-hidden rounded-md">
                  <div className="relative">
                    <img
                      src="/images/home/program-thumbnail.png"
                      alt="프로그램 썸네일 배경"
                    />
                    <img
                      className="absolute inset-2/4 z-10 w-24 translate-x-[-50%] translate-y-[-50%]"
                      src="/images/home/program-cell.png"
                      alt="프로그램 썸네일 세포"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div className="text-0.75-medium rounded-md border border-primary bg-[#DBDDFD] px-2.5 py-0.5 text-primary">
                        모집 중
                      </div>
                      <img
                        className="cursor-pointer"
                        src="/icons/program-detail.svg"
                        alt="프로그램 상세 보기 아이콘"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={classes.closedPrograms}></section>
        </main>
      </div>
    </>
  );
};

export default Programs;
