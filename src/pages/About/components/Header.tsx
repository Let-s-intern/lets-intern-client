import './Header.scss';

const TopSection = () => {
  return (
    <header className="about-header">
      <div className="white-box-group">
        {Array.from(Array(8).keys()).map((_, index) => (
          <div key={index} className="white-box">
            {index === 2
              ? '취업, 어디서부터 준비해야 할 지 모르겠어..'
              : index === 5 && '인턴 어떻게 시작하는 건데?'}
          </div>
        ))}
      </div>
      <h1>
        커리어의 첫 시작,
        <br />
        렛츠인턴이 함께 합니다.
      </h1>
    </header>
  );
};

export default TopSection;
