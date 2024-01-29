import { useQuery } from '@tanstack/react-query';

import classes from './ResultSection.module.scss';
import axios from '../../../utils/axios';
import cn from 'classnames';

const ResultSection = () => {
  const {
    data: userCount,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ['users', 'count'],
    queryFn: async () => {
      const response = await axios.get('/user/count');
      return response.data;
    },
  });

  const {
    data: programCount,
    isLoading: isProgramLoading,
    isError: isProgramError,
  } = useQuery({
    queryKey: ['programs', 'count'],
    queryFn: async () => {
      const response = await axios.get('/program/count');
      return response.data;
    },
  });

  return (
    <section className={classes.section}>
      <div className={classes.content}>
        <div className={classes.resultArea}>
          <h2>렛츠인턴이 이뤄낸 성과</h2>
          <div className={classes.scoreGroup}>
            <div className={classes.score}>
              <span>프로그램 수</span>
              <strong>
                {isProgramLoading || isProgramError
                  ? '- '
                  : `${48 + programCount}`}
                개
              </strong>
            </div>
            <div className={classes.score}>
              <span>함께한 멘토</span>
              <strong>32명</strong>
            </div>
            <div className={classes.score}>
              <span>누적 참여자</span>
              <strong>
                {isUserLoading || isUserError ? '- ' : `${938 + userCount}`}명
              </strong>
            </div>
            <div className={classes.score}>
              <span>만족도</span>
              <strong>4.8점</strong>
            </div>
          </div>
        </div>
        <div className={classes.partnerArea}>
          <h2>이런 파트너와 함께 해요</h2>
          <div className={classes.partnerGroup}>
            <div className={cn(classes.partner, classes.impactCareer)}>
              <img src="/logo/others/impact-career.png" alt="impact-career" />
            </div>
            <div className={cn(classes.partner, classes.yonseiStartup)}>
              <img src="/logo/others/yonsei-startup.png" alt="yonsei-startup" />
            </div>
            <div className={cn(classes.partner, classes.ssgsag)}>
              <img src="/logo/others/ssgsag.png" alt="ssgsag" />
            </div>
            <div className={cn(classes.partner, classes.seongdongOrang)}>
              <img
                src="/logo/others/seongdong-orang.png"
                alt="seongdong-orang"
              />
            </div>
            <div className={cn(classes.partner, classes.disquiet)}>
              <img src="/logo/others/disquiet.png" alt="disquiet" />
            </div>
            <div className={cn(classes.partner, classes.triangleCl)}>
              <img src="/logo/others/triangle-cl.png" alt="triangle-cl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultSection;
