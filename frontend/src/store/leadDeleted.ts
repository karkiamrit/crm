import { create } from 'zustand';

interface LeadDataDeletedStore {
  isLeadDataDeleted: boolean;
  setLeadDataDeleted: (leadDeleted: boolean) => void;
}

const useleadDeleted = create<LeadDataDeletedStore>((set) => ({
  // Initial selected section
  isLeadDataDeleted: false,

  // Set selected section LeadDataDeleted
  setLeadDataDeleted: (leadDeleted) =>
    set((state) => ({
      ...state,
      isLeadDataDeleted: leadDeleted,
    })),
}));

export default useleadDeleted;
