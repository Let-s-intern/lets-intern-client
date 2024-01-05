import { Link } from 'react-router-dom';

import './BottomSection.scss';

const BottomSection = () => {
  return (
    <section className="bottom-section">
      <div className="next-link-button">
        <Link to="/">선순환에 동참하기</Link>
      </div>
    </section>
  );
};

export default BottomSection;
