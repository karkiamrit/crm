// store.ts

import {create} from 'zustand';


enum LeadsStatus {
  INITIAL = "INITIAL",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}
type State = {
  leadStatus: LeadsStatus;
  setLeadStatus: (leadStatus: LeadsStatus) => void;
};

export const useStore = create<State>((set) => ({
  leadStatus: LeadsStatus.INITIAL,
  setLeadStatus: (leadStatus) => set({ leadStatus }),
}));