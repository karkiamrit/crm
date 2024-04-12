// store.ts
import {create} from 'zustand';

type State = {
  selectedLeads: number[];
  setSelectedLeads: (leads: number[]) => void;
};

export const useSelectedLeadsStore = create<State>((set) => ({
  selectedLeads: [],
  setSelectedLeads: (leads) => set({ selectedLeads: leads }),
}));