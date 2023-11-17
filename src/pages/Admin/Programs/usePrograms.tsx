import axios from 'axios';
import { useEffect, useState } from 'react';

const usePrograms = () => {
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  const handleEditProgramVisible = (programId: number, visible: boolean) => {
    axios({
      method: 'PATCH',
      url: `${process.env.REACT_APP_SERVER_API}/program/${programId}`,
      data: {
        isVisible: !visible,
        isApproved: !visible,
      },
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
        console.log(newProgramList);
        setProgramList(newProgramList);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleGetProgramForEdit = () => {
    setLoading(true);
    axios({
      url: `${process.env.REACT_APP_SERVER_API}/program`,
      method: 'GET',
      params: {
        isAdmin: true,
      },
    })
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
  };

  const handleDelete = (programId: number) => {
    axios({
      url: process.env.REACT_APP_SERVER_API + '/program/' + programId,
      method: 'DELETE',
    })
      .then((res) => {
        console.log(res);
        setProgramList(programList.filter((p: any) => p.id !== programId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleGetProgramForEdit();
  }, []);

  return {
    programList,
    handleDelete,
    handleEditProgramVisible,
    loading,
    error,
  };
};

export default usePrograms;
