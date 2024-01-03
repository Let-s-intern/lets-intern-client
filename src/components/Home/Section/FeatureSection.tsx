import './FeatureSection.scss';

const FeatureSection = () => {
  return (
    <section className="feature-section">
      <h2 className="section-title">
        렛츠인턴과 함께하면
        <br />
        어떤 점이 좋나요?
      </h2>
      <div className="bottom-content">
        <div className="feature-grid">
          <div className="row">
            <div className="feature-item">
              <h3>다른 참여자들과 함께, 동기부여</h3>
              <p>장점 설명 텍스트</p>
            </div>
            <div className="feature-item">
              <h3>장점2</h3>
            </div>
          </div>
          <div className="row">
            <div className="feature-item">
              <h3>처음부터 차근차근, 단계적 커리큘럼</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
