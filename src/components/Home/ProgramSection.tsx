const ProgramSection = () => {
  return (
    <section className="program-section">
      <h2 className="section-title small-text">모집 중인 프로그램</h2>
      <p className="section-description">
        아래에서 모집 중인 프로그램을 확인해 보세요!
      </p>
      <div className="bottom-content">
        <div className="program-list">
          <article className="program">
            <h2>부트캠프</h2>
            <h3>부트캠프 2기</h3>
          </article>
          <article className="program">
            <h2>챌린지</h2>
            <h3>인턴 지원 챌린지</h3>
          </article>
          <article className="program">
            <h2>부트캠프</h2>
            <h3>부트캠프 2기</h3>
          </article>
          <article className="program">
            <h2>챌린지</h2>
            <h3>인턴 지원 챌린지</h3>
          </article>
          <article className="program">
            <h2>챌린지</h2>
            <h3>인턴 지원 챌린지</h3>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
