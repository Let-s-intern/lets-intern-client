const TableHead = () => {
  return (
    <div className="flex justify-between text-sm font-medium text-[#868686]">
      <div className="flex-1 border-r border-[#D9D9D9] py-3 text-center">
        번호
      </div>
      <div className="flex-1 border-r border-[#D9D9D9] py-3 text-center">
        이름
      </div>
      <div className="flex-1 border-r border-[#D9D9D9] py-3 text-center">
        메일
      </div>
      <div className="flex-1 border-r border-[#D9D9D9] py-3 text-center">
        계좌번호
      </div>
      <div className="flex-1 border-r border-[#D9D9D9] py-3 text-center">
        제출현황
      </div>
      <div className="flex-1 border-r border-[#D9D9D9] py-3 text-center">
        미션
      </div>
      <div className="flex-1 border-r border-[#D9D9D9] py-3 text-center">
        환급
      </div>
      <div className="flex-1 py-3 text-center">코멘트</div>
    </div>
  );
};

export default TableHead;
