import { useState } from 'react';
import { useQuery } from 'react-query';

import axios from '../../../utils/axios';
import { typeToText } from '../../../utils/converTypeToText';
import CardListSlider from '../../CardListSlider';

import './ProgramSection.scss';
import formatDateString from '../../../utils/formatDateString';
import ProgramCard from '../../ProgramCard';
import CardListPlaceholder from '../../CardListPlaceholder';

const ProgramSection = () => {
  const [programList, setProgramList] = useState<any>();
  const [loading, setLoading] = useState(true);

  const { isError } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => await axios.get('/program'),
    onSuccess: (res) => {
      setProgramList(res.data.programList);
      setLoading(false);
    },
  }) as any;

  return (
    <section className="program-section">
      <h2 className="section-title small-text">모집 중인 프로그램</h2>
      <p className="section-description">
        아래에서 모집 중인 프로그램을 확인해 보세요!
      </p>
      <div className="bottom-content">
        {isError ? (
          <CardListSlider className="program-list">
            <CardListPlaceholder>에러 발생</CardListPlaceholder>
          </CardListSlider>
        ) : loading && !programList ? (
          <CardListSlider className="program-list">
            <CardListPlaceholder />
          </CardListSlider>
        ) : (
          <CardListSlider className="program-list">
            {programList
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
  );
};

export default ProgramSection;
