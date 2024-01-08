import './FeatureSection.scss';

const FeatureSection = () => {
  return (
    <section className="feature-section">
      <div className="section-content">
        <h2 className="section-title">
          렛츠인턴과 함께하면
          <br />
          어떤 점이 좋나요?
        </h2>
        <div className="bottom-content">
          <div className="feature-grid">
            <div className="row">
              <div className="feature-item">
                <h3>처음부터 차근차근, 단계적 커리큘럼</h3>
                <p>
                  인턴 지원의 기초 다지기부터 실제 지원까지. <br />
                  렛츠인턴의 커리큘럼과 함께 단계적으로 준비할 수 있어요.
                </p>
              </div>
              <div className="feature-item">
                <h3>함께 동기부여</h3>
                <p>
                  다른 인턴 준비생들과 소통하며 <br />
                  서로의 동력이 되어요.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="feature-item">
                <h3>다양한 커리어 선배들과의 만남</h3>
                <p>
                  여러 직무에 종사하는 커리어 선배들과 이야기를 나누며 <br />
                  직무부터 산업, 인턴/취업 준비 꿀팁까지. 많은 인사이트를 얻을
                  수 있어요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
