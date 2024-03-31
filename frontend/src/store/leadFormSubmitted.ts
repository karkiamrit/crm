import { create } from 'zustand';

interface LeadFormSubmittedStore {
  isLeadFormSubmitted: boolean;
  setLeadFormSubmitted: (formSubmitted: boolean) => void;
}

const useleadFormSubmitted = create<LeadFormSubmittedStore>((set) => ({
  // Initial selected section
  isLeadFormSubmitted: false,

  // Set selected section action
  setLeadFormSubmitted: (formSubmitted) =>
    set((state) => ({
      ...state,
      isLeadFormSubmitted: formSubmitted,
    })),
}));

export default useleadFormSubmitted;
