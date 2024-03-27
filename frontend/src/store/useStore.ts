// store.ts
import { LeadsStatus } from '@/components/leads/Leads';
import {create} from 'zustand';

type State = {
  status: LeadsStatus;
  setStatus: (status: LeadsStatus) => void;
};

export const useStore = create<State>((set) => ({
  status: LeadsStatus.INITIAL,
  setStatus: (status) => set({ status }),
}));