import './ProblemSection.scss';

const ProblemSection = () => {
  return (
    <section className="problem-section">
      <h2>
        대한민국의 많은 청년들은 취업 준비를 앞두고 막막함을 느끼고 있습니다
      </h2>
      <div className="main-content">
        <div className="statistics-point problem-point">
          <div className="visual-area">
            <div className="chart">
              {/* 84.5%
              <br />
              취업 정보 수집 어려움 */}
            </div>
          </div>
          <div className="description">
            <p>
              취업 준비 시 어디서 어떤 정보를
              <br />
              얻어야 할지 몰라 어려움을 겪는 취업준비생들
            </p>
            <figure>잡코리아, 2022.02</figure>
          </div>
        </div>
        <div className="reason-point problem-point">
          <div className="visual-area">
            <div className="text">
              경험이 아닌
              <br />
              <strong>자신감의 부족</strong>
            </div>
          </div>
          <div className="description">
            <p>
              경쟁의 굴레 속에 끊임없이 남들과 자신을 비교하며
              <br />
              자신감을 잃어가는 취업준비생들
            </p>
            <figure>취업 준비생 인터뷰</figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
