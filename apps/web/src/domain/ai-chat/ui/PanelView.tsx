import { AiChatPanel } from '../types/aiChat';
import ComparePanel from './ComparePanel';
import DetailPanel from './DetailPanel';
import RecommendPanel from './RecommendPanel';

/** 패널 종류에 맞는 화면. 데스크톱은 오른쪽, 모바일은 대화창 답변 아래에 쓴다 */
const PanelView = ({ panel }: { panel: AiChatPanel }) => {
  switch (panel.type) {
    case 'detail':
      return <DetailPanel detail={panel.detail} />;
    case 'compare':
      return <ComparePanel items={panel.items} />;
    case 'recommend':
      return <RecommendPanel items={panel.items} />;
  }
};

export default PanelView;
