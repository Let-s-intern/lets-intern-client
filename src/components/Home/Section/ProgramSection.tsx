import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

import axios from '../../../utils/axios';
import { typeToText } from '../../../utils/converTypeToText';
import CardListSlider from '../../CardListSlider';

import './ProgramSection.scss';

const ProgramSection = () => {
  const [programList, setProgramList] = useState();
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
            <div className="placeholder">에러 발생</div>
          </CardListSlider>
        ) : loading && !programList ? (
          <CardListSlider className="program-list">
            <div className="placeholder" />
          </CardListSlider>
        ) : (
          <CardListSlider className="program-list">
            {(programList as any)
              .filter((program: any) => program.status === 'OPEN')
              .map((program: any) => (
                <article className="program" key={program.id}>
                  <Link to={`/program/detail/${program.id}`}>
                    <h2>{typeToText[program.type]}</h2>
                    <h3>{program.title}</h3>
                  </Link>
                </article>
              ))}
          </CardListSlider>
        )}
      </div>
    </section>
  );
};

export default ProgramSection;
