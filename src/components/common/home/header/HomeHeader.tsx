import { useState } from 'react';
import { Link } from 'react-router-dom';

import AlertModal from '../../../ui/alert/AlertModal';
import classes from './HomeHeader.module.scss';

const HomeHeader = () => {
  const [showTILAlert, setShowTILAlert] = useState(false);

  return (
    <header>
      <div className="flex h-48 w-full items-center justify-center bg-[#2F3437] py-4 font-pretendard">
        <div className="mx-auto flex w-full max-w-[568px] items-center justify-between px-6">
          <div>
            <h1 className="mt-1 text-lg font-semibold text-white sm:text-[1.75rem]">
              인턴 지원 챌린지 15기 모집
            </h1>
            <p className="mt-1 text-xs text-white xs:text-sm sm:text-base">
              매일 미션 수행하고 2주 만에 인턴 지원하자!
            </p>
            <button className="mt-3 rounded bg-white px-3 py-1 text-sm font-semibold text-[#2F3437]">
              신청하기
            </button>
          </div>
          <div>
            <i>
              <img
                src="/icons/home-challenge-icon.svg"
                alt="챌린지"
                className="h-[3.75rem] sm:h-[6.25rem]"
              />
            </i>
          </div>
        </div>
      </div>
      <div className="px-6">
        <ul className={classes.menuList}>
          <li className={classes.menuItem}>
            <Link to="/program?category=CHALLENGE">
              <div className={classes.left}>
                <h3>인턴 지원 챌린지</h3>
                <p>
                  커리큘럼 따라 <br />
                  인턴 지원하기
                </p>
              </div>
              <div className={classes.right}>
                <i>
                  <img src="/icons/home-challenge-icon.svg" alt="챌린지" />
                </i>
              </div>
            </Link>
          </li>
          <li className={classes.menuItem}>
            <Link to="/program?category=BOOTCAMP">
              <div className={classes.left}>
                <h3>부트캠프</h3>
                <p>
                  무조건 3곳 이상 <br />
                  지원하기
                </p>
              </div>
              <div className={classes.right}>
                <i>
                  <img src="/icons/home-bootcamp-icon.svg" alt="부트캠프" />
                </i>
              </div>
            </Link>
          </li>
          <li className={classes.menuItem}>
            <Link to="/program?category=LETS_CHAT">
              <div className={classes.left}>
                <h3>렛츠챗</h3>
                <p>
                  커리어 선배가 <br />
                  들려주는 이야기
                </p>
              </div>
              <div className={classes.right}>
                <i>
                  <img src="/icons/home-letschat-icon.svg" alt="렛츠챗" />
                </i>
              </div>
            </Link>
          </li>
          <li className={classes.menuItem}>
            <Link to="#" onClick={() => setShowTILAlert(true)}>
              <div className={classes.left}>
                <h3>TIL 챌린지</h3>
                <p>
                  인턴/신입의 <br />
                  성장 기록 챌린지
                </p>
              </div>
              <div className={classes.right}>
                <i>
                  <img src="/icons/home-til-icon.svg" alt="TIL 챌린지" />
                </i>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      {showTILAlert && (
        <AlertModal
          onConfirm={() => setShowTILAlert(false)}
          title="TIL 챌린지"
          showCancel={false}
          highlight="confirm"
        >
          <p>오픈 예정입니다.</p>
        </AlertModal>
      )}
    </header>
  );
};

export default HomeHeader;
