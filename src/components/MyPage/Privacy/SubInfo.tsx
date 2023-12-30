import styled from 'styled-components';

interface SubInfoProps {
  subInfoValues: any;
  onChangeSubInfo: (e: any) => void;
  onSubmitSubInfo: (e: any) => void;
}

const SubInfo = ({
  subInfoValues,
  onChangeSubInfo,
  onSubmitSubInfo,
}: SubInfoProps) => {
  return (
    <section className="sub-info-section" onSubmit={onSubmitSubInfo}>
      <h1>학력 정보</h1>
      <form>
        <div className="input-control">
          <label htmlFor="university">대학교</label>
          <input
            placeholder="대학교를 입력하세요."
            id="university"
            name="university"
            value={subInfoValues.university || ''}
            onChange={onChangeSubInfo}
            autoComplete="off"
          />
        </div>
        <div className="input-control">
          <label htmlFor="major">전공</label>
          <input
            placeholder="전공을 입력하세요."
            id="major"
            name="major"
            value={subInfoValues.major || ''}
            onChange={onChangeSubInfo}
            autoComplete="off"
          />
        </div>
        <div className="action-group">
          <button type="submit">정보 수정</button>
        </div>
      </form>
    </section>
  );
};

export default SubInfo;

const SubInfoBlock = styled.section``;

const Form = styled.form``;
