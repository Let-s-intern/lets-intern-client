import { Link } from 'react-router-dom';

import './Header.scss';

const Header = () => {
  return (
    <header>
      <div className="banner">
        <div className="banner-content">
          <h1>렛츠인턴</h1>
          <p>인턴/신입, 첫 시작을 함께 하는 커리어 플랫폼</p>
        </div>
      </div>
      <ul className="menu-list">
        <li className="menu-item">
          <Link to="/?category=CHALLENGE">
            <div className="left">
              <h3>인턴 지원 챌린지</h3>
              <p>
                커리큘럼 따라 <br />
                인턴 지원하기
              </p>
            </div>
            <div className="right">
              <i>
                <img src="/icons/home-challenge-icon.svg" alt="챌린지" />
              </i>
            </div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/?category=BOOTCAMP">
            <div className="left">
              <h3>부트캠프</h3>
              <p>
                무조건 3곳 이상 <br />
                지원하기
              </p>
            </div>
            <div className="right">
              <i>
                <img src="/icons/home-bootcamp-icon.svg" alt="부트캠프" />
              </i>
            </div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/?category=LETS_CHAT">
            <div className="left">
              <h3>렛츠챗</h3>
              <p>
                커리어 선배가 <br />
                들려주는 이야기
              </p>
            </div>
            <div className="right">
              <i>
                <img src="/icons/home-letschat-icon.svg" alt="렛츠챗" />
              </i>
            </div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="#" onClick={() => alert('오픈 예정입니다.')}>
            <div className="left">
              <h3>TIL 챌린지</h3>
              <p>
                인턴/신입의 <br />
                성장 기록 챌린지
              </p>
            </div>
            <div className="right">
              <i>
                <img src="/icons/home-til-icon.svg" alt="TIL 챌린지" />
              </i>
            </div>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
