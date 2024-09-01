import { Link } from 'react-router-dom';

const ReportPage = () => {
  return (
    <>
      <h1>서류 진단 신청</h1>
      <Link to="/report/apply/portfolio/5">
        <button>신청하기</button>
      </Link>
    </>
  );
};

export default ReportPage;
