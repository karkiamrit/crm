import { create } from 'zustand';

interface OrganizationFormSubmittedStore {
  isOrganizationFormSubmitted: boolean;
  editedOrganizationId: number | null;
  setOrganizationFormSubmitted: (formSubmitted: boolean, organizationId?: number | null) => void;
}

const useOrganizationFormSubmitted = create<OrganizationFormSubmittedStore>((set) => ({
  // Initial values
  isOrganizationFormSubmitted: false,
  editedOrganizationId: null,

  // Set values action
  setOrganizationFormSubmitted: (formSubmitted, organizationId = null) =>
    set((state) => ({
      ...state,
      isOrganizationFormSubmitted: formSubmitted,
      editedOrganizationId: organizationId,
    })),
}));

export default useOrganizationFormSubmitted;
