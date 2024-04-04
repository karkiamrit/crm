import { create } from 'zustand';

interface OrganizationFormSubmittedStore {
  isOrganizationFormSubmitted: boolean;
  setOrganizationFormSubmitted: (formSubmitted: boolean) => void;
}

const useOrganizationFormSubmitted = create<OrganizationFormSubmittedStore>((set) => ({
  // Initial selected section
  isOrganizationFormSubmitted: false,

  // Set selected section action
  setOrganizationFormSubmitted: (formSubmitted) =>
    set((state) => ({
      ...state,
      isLeadFormSubmitted: formSubmitted,
    })),
}));

export default useOrganizationFormSubmitted;
