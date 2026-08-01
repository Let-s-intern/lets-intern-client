/**
 * 임시 코드 — 관리자용 목록 API 가 붙으면 실제 목록 표로 갈아끼울 것.
 * 해제 조건과 제거 대상은 `ManualActionPanel.tsx` 파일 상단 주석에 함께 적어 뒀다.
 *
 * 데이터 소스가 없다는 것을 화면에 명시하는 것이 이 컴포넌트의 존재 이유다.
 * 열만 있고 행이 없는 표를 그냥 두면 "해당하는 상품이 없다"로 오독된다.
 */

/** 목록 API 대기 중인 표 뼈대. 열 구성은 목록 API 요청 문서의 응답 형태를 그대로 따른다. */
const PendingListTable = ({
  columns,
  description,
}: {
  columns: string[];
  description: string;
}) => (
  <div className="border-neutral-80 rounded-lg border">
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-neutral-60 bg-neutral-95 border-b-2">
          {columns.map((column) => (
            <th
              key={column}
              className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={columns.length} className="px-6 py-16 text-center">
            <p className="text-xsmall14 text-neutral-10 font-semibold">
              목록 API 대기 중입니다.
            </p>
            <p className="text-xxsmall12 text-neutral-40 mt-2">{description}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default PendingListTable;
