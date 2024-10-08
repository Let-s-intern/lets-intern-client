import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { IBanner } from '../../../../../types/Banner.interface';
import axios from '../../../../../utils/axios';

const ONE_DAY = 86400000;

const Popup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [closedDuringDay, setClosedDuringDay] = useState(false);

  const toggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClosedDuringDay(event.target.checked);
  };

  const close = () => {
    if (closedDuringDay) {
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
      <div className="relative h-fit max-w-[450px] overflow-hidden rounded-md bg-static-100 pb-5 shadow-05">
        <img
          className="popup_banner h-auto w-full cursor-pointer"
          src={data?.imgUrl}
          onClick={clickPopup}
          alt="홈 화면 팝업 이미지"
        />
        <img
          onClick={close}
          className="absolute right-4 top-5 h-6 w-6 cursor-pointer md:h-8 md:w-8"
          src="/icons/Close_SM.svg"
          alt="팝업 닫기 아이콘"
        />
        <div className="ml-4 mt-4 flex gap-1 pl-2">
          <input type="checkbox" onChange={toggle} />
          <span className="text-0.75">오늘 하루 보지 않기</span>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Popup;
