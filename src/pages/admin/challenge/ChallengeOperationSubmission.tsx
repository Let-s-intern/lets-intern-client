import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { useCurrentChallenge, useMissionsOfCurrentChallenge } from '../../../context/CurrentChallengeProvider';
import { getChallengeIdApplication, missionStatusType } from '../../../schema';
import axios from '../../../utils/axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// type Submission = z.infer<typeof getChallengeIdApplication>[''][number];

// const columns: GridColDef<Mission>[] = []



const ChallengeOperationSubmission = () => {
  const params = useParams();
  const challengeId = params.programId;
  const missions = useMissionsOfCurrentChallenge();
  const {currentChallenge} = useCurrentChallenge();

  const {data: submissionRes } = useQuery({
    queryKey: ['admin', 'challenge', challengeId, 'submission'],
    queryFn: async () => {
      if (challengeId) {
        return null;
      }
      const res = await axios.get(`/challenge/${challengeId}/application`);
      return getChallengeIdApplication.parse(res.data.data);
    },
  
  })

  return (
    <main>
      {/* <DataGrid
        rows={missions?.missionList || []}
        columns={columns}
        initialState={
          {
            // pagination: {
            // paginationModel: {
            //   pageSize: 5,
            // },
            // },
          }
        }
        // pageSizeOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick
        autoHeight
      /> */}
     
    </main>
  );
};

export default ChallengeOperationSubmission;
