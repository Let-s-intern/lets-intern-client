import Button from '../../../../ui/button/Button';

interface Props {
  setMenuShown: (menuShown: 'DETAIL' | 'EDIT' | 'NONE') => void;
}

const TableRowEditMenu = ({ setMenuShown }: Props) => {
  return (
    <div className="mt-1 rounded bg-neutral-100 px-4 py-8">
      <div className="mx-auto w-[40rem]">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="name">미션명</label>
            <input type="text" id="name" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="guide">가이드</label>
            {/* <input type="text" id="guide" autoComplete="off" /> */}
            <textarea name="guide" id="guide" cols={30} rows={4}></textarea>
          </div>
          <div>
            <label htmlFor="content">내용</label>
            <input type="text" id="content" autoComplete="off" />
          </div>
          <div>
            <div>
              <div>
                <label htmlFor="day">일차</label>
                <input type="text" id="day" autoComplete="off" />
              </div>
              <div>
                <label htmlFor="start-date">시작</label>
                <input type="datetime-local" id="start-date" />
              </div>
            </div>
            <div>
              <label htmlFor="end-date">마감</label>
              <input type="datetime-local" id="end-date" />
            </div>
          </div>
          <div>
            <label htmlFor="template">미션 템플릿</label>
            <input type="text" id="template" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="link-contents">연결 콘텐츠</label>
            <input type="text" id="link-contents" autoComplete="off" />
            {/* <div>
              <label htmlFor="">추가 콘텐츠</label>
            </div> */}
          </div>
          {/* <div>
            <label htmlFor="name">환급 여부</label>
            <ul>
              <li className="bg-white">경험정리</li>
            </ul>
          </div> */}
          <div>
            <label htmlFor="comment">코멘트</label>
            <input type="text" id="comment" autoComplete="off" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button active disableHover>
            수정
          </Button>
          <Button onClick={() => setMenuShown('DETAIL')} disableHover>
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableRowEditMenu;
