import { Link } from 'react-router-dom';

import './BottomSection.scss';

const BottomSection = () => {
  return (
    <section className="bottom-section">
      <Link to="/" className="next-link-button">
        선순환에 동참하기
      </Link>
    </section>
  );
};

export default BottomSection;
