import { create } from 'zustand';

interface VerticalDashboardState {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
}

const useVerticalDashboard = create<VerticalDashboardState>((set) => ({
  // Initial selected section
  selectedSection: 'dashboard',

  // Set selected section action
  setSelectedSection: (section) =>
    set((state) => ({
      ...state,
      selectedSection: section,
    })),
}));

export default useVerticalDashboard;
