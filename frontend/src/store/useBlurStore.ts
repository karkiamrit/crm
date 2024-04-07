import { create } from 'zustand';

interface useBlurStore {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isMobileMenuOpen: boolean) => void;
}

const useBlurStore = create<useBlurStore>((set) => ({
  // Initial selected section
  isMobileMenuOpen: false,

  // Set selected section LeadDataDeleted
  setMobileMenuOpen: (isMenuOpen) =>
    set((state) => ({
      ...state,
      isMobileMenuOpen: isMenuOpen,
    })),
}));

export default useBlurStore;
