import './ResultSection.scss';

const ResultSection = () => {
  return (
    <section className="result-section">
      <div className="inner-content">
        <div className="result-area">
          <h2>렛츠인턴이 이뤄낸 성과</h2>
          <div className="score-group">
            <div className="score">
              <span>프로그램 수</span>
              <strong>48개</strong>
            </div>
            <div className="score">
              <span>함께한 멘토</span>
              <strong>32명</strong>
            </div>
            <div className="score">
              <span>누적 참여자</span>
              <strong>938명</strong>
            </div>
            <div className="score">
              <span>만족도</span>
              <strong>4.8점</strong>
            </div>
          </div>
        </div>
        <div className="partner-area">
          <h2>이런 파트너와 함께 해요</h2>
          <div className="partner-group">
            <div className="partner" id="impact-career">
              <img src="/logo/others/impact-career.png" alt="impact-career" />
            </div>
            <div className="partner" id="yonsei-startup">
              <img src="/logo/others/yonsei-startup.png" alt="yonsei-startup" />
            </div>
            <div className="partner" id="ssgsag">
              <img src="/logo/others/ssgsag.png" alt="ssgsag" />
            </div>
            <div className="partner" id="seongdong-orang">
              <img
                src="/logo/others/seongdong-orang.png"
                alt="seongdong-orang"
              />
            </div>
            <div className="partner" id="disquiet">
              <img src="/logo/others/disquiet.png" alt="disquiet" />
            </div>
            <div className="partner" id="triangle-cl">
              <img src="/logo/others/triangle-cl.png" alt="triangle-cl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultSection;
