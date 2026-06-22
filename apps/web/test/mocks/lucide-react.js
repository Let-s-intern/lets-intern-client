// 테스트용 lucide-react stub — 어떤 아이콘 이름이든 단순 svg 컴포넌트로 반환한다.
// (lucide-react 가 ESM 으로 배포되어 next/jest SWC 트랜스폼에서 파싱되지 않는 문제 회피)
const React = require('react');

const Icon = (props) =>
  React.createElement('svg', { 'data-testid': 'lucide-icon', ...props });

module.exports = new Proxy(
  {},
  {
    get: (_target, prop) => {
      if (prop === '__esModule') return true;
      return Icon;
    },
  },
);
