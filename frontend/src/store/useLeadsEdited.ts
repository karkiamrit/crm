import { create } from 'zustand';

interface LeadEditedStore {
  isLeadEdited: boolean;
  setLeadEdited: (formEdited: boolean) => void;
}

const useleadEdited = create<LeadEditedStore>((set) => ({
  // Initial selected section
  isLeadEdited: false,

  // Set selected section action
  setLeadEdited: (formEdited) =>
    set((state) => ({
      ...state,
      isLeadEdited: formEdited,
    })),
}));

export default useleadEdited;
