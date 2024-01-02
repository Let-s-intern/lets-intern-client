const NewsSection = () => {
  return (
    <section className="news-section">
      <div className="left">
        <div className="text-content">
          <h2 className="section-title">
            렛츠인턴 소식이
            <br />
            궁금하다면?
          </h2>
          <p>
            렛츠인턴에게 궁금한 점을
            <br />
            자유롭게 남겨주세요.
            <br />폼 제출 시 새로운 프로그램 소식을
            <br />
            가장 먼저 받아보실 수 있습니다.
          </p>
        </div>
      </div>
      <div className="right">
        <form action="">
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="이름"
              autoComplete="off"
            />
            <input
              type="text"
              name="email"
              placeholder="이메일"
              autoComplete="off"
            />
            <textarea name="content" placeholder="문의사항" id="" rows={5} />
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsSection;
