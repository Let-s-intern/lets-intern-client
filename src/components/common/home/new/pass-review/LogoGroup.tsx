import styled from 'styled-components';

const LogoGroup = () => {
  //   네이버 클라우드
  // 라인
  // 하이브
  // 현대오토에버
  // 네이버 웹툰
  // 삼성바이오로직스
  // CJ 프레시웨이
  // LG 전자
  // 삼일회계법인
  // 캐치테이블
  // 팀스파르타
  // 휴맥스 모빌리티
  // 와디즈
  // 누비랩
  // 언더독스
  const images = [
    'naver-cloud.png',
    'line.png',
    'hive.svg',
    'hyundai.svg',
    'naver-webtoon.png',
    'samsung-bio.png',
    'lg.png',
    'pwc.png',
    'catch-table.png',
    'sparta.png',
    'humax.svg',
    'wadiz.png',
    'YBM.png',
    'nuvilab.png',
    'underdogs.png',
  ];

  return (
    <ImageLogo className="flex items-center gap-12">
      {images.map((image) => (
        <div key={image} className="h-10 w-[130px]">
          <img
            className="h-full w-full object-contain"
            src={`/images/home/company/${image}`}
            alt={image}
          />
        </div>
      ))}
    </ImageLogo>
  );
};

export default LogoGroup;

const ImageLogo = styled.div`
  animation: 40s slide-left linear infinite;

  @keyframes slide-left {
    from {
      transform: translateX(3rem);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;
