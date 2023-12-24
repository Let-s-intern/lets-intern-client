import { useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import axios from '../../../../libs/axios';
import { typeToText } from '../../../../libs/converTypeToText';

import classes from './CautionContent.module.scss';

interface CautionContentProps {
  program: any;
  formData: any;
  isLoggedIn: boolean;
  setApplyPageIndex: (applyPageIndex: number) => void;
  setAnnouncementDate: (announcedmentDate: string) => void;
}

const CautionContent = ({
  program,
  formData,
  isLoggedIn,
  setApplyPageIndex,
  setAnnouncementDate,
}: CautionContentProps) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const handleApplySubmit = async () => {
    try {
      let newUser = { ...formData, grade: Number(formData.grade) };
      if (program.way !== 'ALL') {
        delete newUser.way;
      }
      if (!isLoggedIn) {
        delete newUser.name;
        delete newUser.email;
        delete newUser.phoneNum;
        newUser = {
          ...newUser,
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhoneNum: formData.phoneNum,
        };
      }
      const res = await axios.post(
        `/application/${params.programId}`,
        newUser,
        {
          headers: {
            Authorization: isLoggedIn
              ? `Bearer ${localStorage.getItem('access-token')}`
              : '',
          },
        },
      );
      setAnnouncementDate(res.data.announcementDate);
      setApplyPageIndex(4);
      queryClient.invalidateQueries(['program', params.programId]);
    } catch (error) {
      if ((error as any).response.status === 400) {
        alert((error as any).response.data.reason);
      }
      console.error(error);
    }
  };

  return (
    <div className={classes['caution-content']}>
      <h3>{typeToText[program.type]}</h3>
      <h2>{program.title}</h2>
      <h4>[필독사항]</h4>
      <p>{program.notice}</p>
      <button
        id="complete_button"
        className="caution-next-button"
        onClick={handleApplySubmit}
      >
        제출하기
      </button>
    </div>
  );
};

export default CautionContent;
