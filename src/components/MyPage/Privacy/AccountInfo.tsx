interface AccountInfoProps {}

const AccountInfo = ({}: AccountInfoProps) => {
  return (
    <section className="account-info-section">
      <h1>계좌 정보</h1>
      <form>
        <div className="input-group">
          <div className="input-control">
            <label htmlFor="account-bank">거래 은행</label>
            <input
              type="text"
              placeholder="계좌번호에 해당하는 은행을 입력해주세요."
              id="account-bank"
              name="accountBank"
              autoComplete="off"
            />
          </div>
          <div className="input-control">
            <label htmlFor="account-number">계좌번호</label>
            <input
              type="text"
              placeholder="계좌번호를 입력해주세요."
              id="account-number"
              name="accountNumber"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="action-group">
          <button type="submit">정보 수정</button>
        </div>
      </form>
    </section>
  );
};

export default AccountInfo;
