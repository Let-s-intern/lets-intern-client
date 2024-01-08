import './SolutionSection.scss';

const SolutionSection = () => {
  return (
    <section className="solution-section">
      <div className="inner-content">
        <h2>
          이에 렛츠인턴은 취업 준비생들의
          <br />
          길라잡이가 되고자 합니다
        </h2>
        <p>
          ‘렛츠(Let’s)=함께 해보자'라는 말처럼 렛츠인턴의 성장 프로그램으로{' '}
          <br />
          나만의 이야기를 만들어 가는 방법을 함께 합니다. <br />
          여러 성장 프로그램을 통해 정보를 찾는 법부터 활용하는 법, 나라는
          사람을 되돌아보기까지, <br />
          참여자 모두 막막함을 느끼지 않도록 렛츠인턴 러닝메이트가 되어 함께하며
          참여자들은 성장해 <br />
          다른 이들의 시작을 도와주는 선순환 커뮤니티의 일원이 되어줍니다.
        </p>
        <div className="core-value-group">
          <div className="core-value">
            <span>힘이 되는</span>
            <strong>Supportive</strong>
            <div className="circle" />
          </div>
          <div className="core-value">
            <span>신뢰가 되는</span>
            <strong>Reliable</strong>
            <div className="circle" />
          </div>
          <div className="core-value">
            <span>동기부여가 되는</span>
            <strong>Motivative</strong>
            <div className="circle" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
