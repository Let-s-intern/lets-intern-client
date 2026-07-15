import * as React from 'react';

/**
 * jest 용 SVGR(`*.svg?react`) 목.
 * 번들러(@svgr/webpack)는 svg 를 React 컴포넌트로 변환하지만 jest 엔 해당 로더가
 * 없으므로, 테스트에서는 빈 <svg> 를 렌더하는 경량 컴포넌트로 대체한다.
 */
const SvgrMock = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <svg ref={ref} {...props} />,
);
SvgrMock.displayName = 'SvgrMock';

export default SvgrMock;
