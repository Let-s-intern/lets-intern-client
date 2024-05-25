import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
          <section className="sticky top-16 bg-static-100 px-5 pt-7">
            <ul className="flex items-center justify-between">
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
          </section>
          <section className={classes.openedPrograms}>
            <div className={classes.content}>
              현재 모집중이에요
              <h2 className={classes.sectionTitle}></h2>
              <p className={classes.sectionDescription}>
                아래에서 모집중인 프로그램을 확인해보세요!
              </p>
              {loading ? (
                <CardListSlider>
                  <CardListPlaceholder />
                </CardListSlider>
              ) : !programs || programs.length === 0 ? (
                <CardListSlider isEmpty={true}>
                  <CardListPlaceholder>
                    현재 진행 중인 프로그램이 없습니다.
                  </CardListPlaceholder>
                </CardListSlider>
              ) : (
                <CardListSlider className={classes.programList}>
                  {programs
                    .filter((program: any) => program.status === 'OPEN')
                    .map((program: any) => (
                      <ProgramCard
                        key={program.id}
                        to={`/program/detail/${program.id}`}
                      >
                        <div className="card-top">
                          <h2>{typeToText[program.type]}</h2>
                          <h3>{program.title}</h3>
                        </div>
                        <div className="card-bottom">
                          <div className="card-bottom-item">
                            <strong>모집 마감</strong>
                            <span>{formatDateString(program.dueDate)}</span>
                          </div>
                          <div className="card-bottom-item">
                            <strong>시작 일자</strong>
                            <span>{formatDateString(program.startDate)}</span>
                          </div>
                        </div>
                      </ProgramCard>
                    ))}
                </CardListSlider>
              )}
            </div>
          </section>
          <section className={classes.closedPrograms}>
            <div className={classes.content}>
              <h2 className={classes.sectionTitle}>아쉽지만 마감되었어요</h2>
              <p className={classes.sectionDescription}>
                더 많은 프로그램들이 준비되어 있으니 걱정마세요!
              </p>
              {loading || closedPrograms.length === 0 ? (
                <div className={classes.wrapper}>
                  <div className={classes.placeholder} />
                </div>
              ) : (
                <div className={classes.wrapper}>
                  <div className={classes.cardList}>
                    {closedPrograms.map((program: any) => (
                      <ClosedCard key={program.id} program={program} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Programs;
