import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { getChallengeId } from "../schema";
import axios from "../utils/axios";

export const CurrentChallengeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const params = useParams();

  const { data } = useQuery({
    queryKey: ['admin', 'challenge', params.programId],
    queryFn: async () => {
      if (!params.programId) {
        return null;
      }
      const res = await axios.get(`/challenge/${params.programId}`);
      return res.data.data as z.infer<typeof getChallengeId>;
    },
  });

  return (
    <currentChallengeContext.Provider value={data}>
      {children}
    </currentChallengeContext.Provider>
  );
};

type CurrentChallenge = z.infer<typeof getChallengeId>;
const currentChallengeContext = createContext<CurrentChallenge | null | undefined>(
  null,
);

export const useCurrentChallenge = () => {
  const currentChallenge = useContext(currentChallengeContext);
  // if (!currentChallenge) {
  //   throw new Error('useChallenge must be used within a ChallengeProvider');
  // }
  return currentChallenge;
};