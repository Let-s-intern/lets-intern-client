import axios from '../../../../../../utils/axios';

interface SubInfoProps {
  subInfoValues: any;
  initialValues: any;
  loading: boolean;
  setUserInfo: (userInfo: any) => void;
  resetInitialValues: () => void;
  setShowAlert: (showAlert: boolean) => void;
  setAlertInfo: (alertInfo: { title: string; message: string }) => void;
}

const SubInfo = ({
  subInfoValues,
  initialValues,
  loading,
  setUserInfo,
  resetInitialValues,
  setShowAlert,
  setAlertInfo,
}: SubInfoProps) => {
  const handleChangeSubInfo = (e: any) => {
    const { name, value } = e.target;
    setUserInfo((prev: any) => ({
      ...prev,
      subInfoValues: {
        ...prev.subInfoValues,
        [name]: value,
      },
    }));
  };

  const handleSaveSubInfo = async (e: any) => {
    e.preventDefault();
    let hasNull: boolean = false;
    const newValues = { ...subInfoValues };
    Object.keys(newValues).forEach((key) => {
      if (!newValues[key]) {
        hasNull = true;
        return;
      }
    });
    if (hasNull) {
      setAlertInfo({
        title: '정보 수정 실패',
        message: '모든 항목을 입력해주세요.',
      });
      setShowAlert(true);
      return;
    }
    Object.keys(newValues).forEach((key) => {
      if (newValues[key] === initialValues[key]) {
        delete newValues[key];
      }
    });
    if (Object.keys(newValues).length === 0) {
      setAlertInfo({
        title: '정보 수정 실패',
        message: '변경된 내용이 없습니다.',
      });
      setShowAlert(true);
      return;
    }
    try {
      await axios.patch('/user', newValues);
      setAlertInfo({
        title: '정보 수정 성공',
        message: '유저 정보가 변경되었습니다.',
      });
      setShowAlert(true);
      resetInitialValues();
    } catch (error) {
      setAlertInfo({
        title: '정보 수정 실패',
        message: '유저 정보 변경에 실패했습니다.',
      });
      setShowAlert(true);
    }
  };

  return (
    <section className="sub-info-section" onSubmit={handleSaveSubInfo}>
      <h1>학력 정보</h1>
      <form>
        <div className="input-group">
          <div className="input-control">
            <label htmlFor="university">대학교</label>
            <input
              id="university"
              name="university"
              onChange={handleChangeSubInfo}
              autoComplete="off"
              placeholder={!loading ? '대학교를 입력하세요.' : ''}
              value={subInfoValues.university || ''}
            />
          </div>
          <div className="input-control">
            <label htmlFor="major">전공</label>
            <input
              id="major"
              name="major"
              onChange={handleChangeSubInfo}
              autoComplete="off"
              placeholder={!loading ? '전공을 입력하세요.' : ''}
              value={subInfoValues.major || ''}
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

export default SubInfo;
