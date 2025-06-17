import { IBanner } from '@/types/Banner.interface';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const ONE_DAY = 86400000;

const Popup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const close = (storeClosedTime: boolean = false) => {
    if (storeClosedTime) {
      localStorage.setItem('closedTime', Date.now().toString());
    }
    setShowPopup(false);
  };

  const clickPopup = () => {
    const target = data?.link.includes(window.location.origin)
      ? '_self'
      : '_blank';
    window.open(data?.link, target);
  };

  useEffect(() => {
    const closedTime = localStorage.getItem('closedTime');

    if (closedTime) {
      const diff = Date.now() - Number(closedTime);
      if (diff > ONE_DAY)
        localStorage.removeItem('closedTime'); // 하루가 지났으면 시간 삭제
      else return; // 하루가 지나지 않았으면 팝업 띄우지 않음
    }
    setShowPopup(true);
  }, []);

  // const data = { 디버깅용
  //   imgUrl: '/images/career-start-after2.jpg',
  //   link: 'https://example.com',
  // };

  const { isLoading, data } = useQuery<IBanner>({
    queryKey: ['PopUp'],
    queryFn: async () => {
      const res = await axios.get(`/banner`, {
        params: {
          type: 'POPUP',
        },
      });

      const bannerList = res.data.data.bannerList;

      if (bannerList.length === 0) return null;
      return res.data.data.bannerList[0];
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return showPopup && data ? (
    <div className="fixed bottom-0 top-0 z-50 flex h-full w-screen items-center justify-center bg-neutral-0/60 p-5">
      <div className="relative h-fit max-w-[450px] overflow-hidden rounded-md bg-static-100 shadow-05">
        <img
          className="popup_banner h-auto w-full cursor-pointer"
          src={data?.imgUrl}
          onClick={clickPopup}
          alt="홈 화면 팝업 이미지"
        />
        <div className="flex">
          <button
            className="w-1/2 py-5 text-center text-xxsmall12 font-semibold"
            onClick={() => close(true)}
          >
            하루 동안 보지 않기
          </button>
          <button
            className="w-1/2 py-5 text-center text-xxsmall12 font-semibold"
            onClick={() => close()}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Popup;
