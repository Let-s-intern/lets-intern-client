import { create } from 'zustand';

interface MissionStore {
  selectedMissionId: number;
  selectedMissionTh: number;
  setSelectedMission: (missionId: number, missionTh: number) => void;
}

export const useMissionStore = create<MissionStore>((set) => ({
  selectedMissionId: 0,
  selectedMissionTh: 0,
  setSelectedMission: (missionId, missionTh) =>
    set({ selectedMissionId: missionId, selectedMissionTh: missionTh }),
}));
