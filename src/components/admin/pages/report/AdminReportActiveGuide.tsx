export default function AdminReportActiveGuide() {
  return (
    <div className="text-sm">
      <p>동작 설명</p>
      <ul className="list-disc list-inside">
        <li>
          <strong>메뉴에 등장하는 조건</strong>:{' '}
          <span className="font-bold bg-blue-200">노출일시</span>가 있고{' '}
          <span className="font-bold bg-yellow-200">노출여부</span>가 TRUE인
          리포트가 존재할 때.
        </li>
        <li>
          <strong>
            <code>/report/landing/[type]</code> 진입 시:
          </strong>{' '}
          <span className="font-bold bg-blue-200">노출일시</span>가 있고{' '}
          <span className="font-bold bg-yellow-200">노출여부</span>가 TRUE인
          리포트가 존재할 때 →{' '}
          <span className="font-bold bg-blue-200">노출일시</span>가 가장 최신인
          리포트가 노출. 그런 리포트가 없다면 &quot;현재 개설된 프로그램이
          없습니다&quot; 노출.
        </li>
        <li>
          <strong>
            <code>/report/landing/[type]/[id]</code> 진입 시:{' '}
          </strong>
          해당 ID 리포트의{' '}
          <span className="font-bold bg-blue-200">노출일시</span>가 있을 때
          노출. <span className="font-bold bg-blue-200">노출일시</span>가 없다면
          &quot;현재 개설된 프로그램이 없습니다&quot; 노출. (
          <span className="font-bold bg-yellow-200">노출여부</span>는 무시.)
        </li>
      </ul>
      <p></p>
      <p></p>
    </div>
  );
}
