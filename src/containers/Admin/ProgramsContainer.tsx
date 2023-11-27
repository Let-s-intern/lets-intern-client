import { useEffect, useState } from 'react';

import axios from '../../libs/axios';
import Programs from '../../components/Admin/Program/Programs';

const ProgramsContainer = () => {
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/program/admin')
      .then((res) => {
        const data = res.data.programList;
        setProgramList(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchEditProgramVisible = (programId: number, visible: boolean) => {
    axios
      .patch(`/program/${programId}`, {
        isVisible: !visible,
        isApproved: !visible,
      })
      .then(() => {
        const newProgramList: any = programList.map((program: any) => {
          if (program.id === programId) {
            return {
              ...program,
              isVisible: !visible,
              isApproved: !visible,
            };
          }
          return program;
        });
        setProgramList(newProgramList);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const fetchEditProgramStatus = (programId: number, newStatus: string) => {
    try {
      axios.patch(`/program/${programId}`, {
        status: newStatus,
      });
      const newProgramList: any = programList.map((program: any) => {
        if (program.id === programId) {
          return {
            ...program,
            status: newStatus,
          };
        }
        return program;
      });
      setProgramList(newProgramList);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDelete = (programId: number) => {
    axios
      .delete(`/program/${programId}`)
      .then((res) => {
        console.log(res);
        setProgramList(programList.filter((p: any) => p.id !== programId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Programs
      loading={loading}
      error={error}
      programList={programList}
      fetchDelete={fetchDelete}
      fetchEditProgramVisible={fetchEditProgramVisible}
      fetchEditProgramStatus={fetchEditProgramStatus}
    />
  );
};

export default ProgramsContainer;
