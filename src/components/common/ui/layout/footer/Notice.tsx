import { useNavigate } from "react-router-dom";

interface NoticeProps {
  className?: string;
}

const Notice = ({ className }: NoticeProps) => {
  const navigate = useNavigate();
  return (
    <div className={`flex cursor-pointer items-center gap-1 ${className}`}
      onClick={() => navigate('/') }
    >
      <img
        className="w-5"
        src="/icons/megaphone-line.svg"
        alt="공지사항 아이콘"
      />
      <span className="text-neutral-0">공지사항</span>
    </div>
  );
};

export default Notice;
