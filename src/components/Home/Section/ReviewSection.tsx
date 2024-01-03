import './ReviewSection.scss';

const ReviewSection = () => {
  return (
    <section className="review-section">
      <h2 className="section-title">
        참여자 후기로
        <br />
        증명합니다.
      </h2>
      <div className="bottom-content">
        <div className="review-group">
          <div className="row">
            {Array.from(Array(10)).map(() => (
              <article className="review">
                <p>
                  렛츠인턴,
                  <br />
                  어쩌구 저쩌구 해서
                  <br />
                  정말 좋아요!
                </p>
                <figure>실전코스, 이*연</figure>
              </article>
            ))}
          </div>
          <div className="row">
            {Array.from(Array(10)).map(() => (
              <article className="review">
                <p>
                  렛츠인턴,
                  <br />
                  어쩌구 저쩌구 해서
                  <br />
                  정말 좋아요!
                </p>
                <figure>실전코스, 이*연</figure>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
