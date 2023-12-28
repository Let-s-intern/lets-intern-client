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
            <div className="feature-item gray-box">
              <h3>프로그램 장점 키워드</h3>
              <p>장점 설명 두세줄 내외</p>
            </div>
            <div className="feature-item gray-box">
              <h3>프로그램 장점 키워드</h3>
              <p>장점 설명 두세줄 내외</p>
            </div>
          </div>
          <div className="row">
            <div className="feature-item gray-box">
              <h3>프로그램 장점 키워드</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
