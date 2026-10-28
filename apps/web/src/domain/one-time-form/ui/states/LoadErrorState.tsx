import { CircleAlert } from 'lucide-react';
import StateScreen, { lineButtonClass } from './StateScreen';

interface LoadErrorStateProps {
  onRetry: () => void;
}

/** 404 가 아닌 조회 실패(네트워크, 서버 오류) */
const LoadErrorState = ({ onRetry }: LoadErrorStateProps) => (
  <StateScreen
    icon={<CircleAlert size={28} />}
    heading="신청 페이지를 불러오지 못했어요"
    description="잠시 후 다시 시도해 주세요."
    footer={
      <button type="button" onClick={onRetry} className={lineButtonClass}>
        다시 시도
      </button>
    }
  />
);

export default LoadErrorState;
