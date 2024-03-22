"use client";
import { useEffect } from "react";
import { LocalStore } from "@/store/localstore";
import useVerticalDashboard from "@/store/dashboardStore";

interface NavItem {
  href: string;
  icon: JSX.Element;
  name: string;
}

export function NavBarVertical() {
  const selectedLink = useVerticalDashboard((state) => state.selectedSection); // Access selected section from Zustand store
  const setSelectedLink = useVerticalDashboard(
    (state) => state.setSelectedSection
  ); // Access setSelectedSection action from Zustand store

  useEffect(() => {
    // Retrieve the selected link state from Zustand on component mount
    const storedState = selectedLink;
    setSelectedLink(storedState || "/dashboard"); // Set the selected link state from Zustand or default to dashboard
  }, []);

  const handleLinkClick = (link: string) => {
    setSelectedLink(link);
    LocalStore.setVerticalNavBarState(link);
    
  };

  const navItems1: NavItem[] = [
    {
      href: "/dashboard",
      icon: (
        <svg
          className="flex-shrink-0 w-5 h-5 mr-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      name: "Dashboard",
    },
    {
      href: "/leads",
      icon: (
        <svg
          className="flex-shrink-0 w-5 h-5 mr-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      name: "Leads",
    },
    {
      href: "/agents",
      icon: (
        <svg
          className="flex-shrink-0 w-5 h-5 mr-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      name: "Agents",
    },
    {
      href: "/customers",
      icon: (
        <svg
          className="flex-shrink-0 w-5 h-5 mr-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      name: "Customers",
    },
  ];

  return (
    <div className="flex bg-white h-[100vh]">
      <div className="hidden bg-gray-50 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col pt-5 overflow-y-auto">
          <div className="flex flex-col justify-between flex-1 h-full ">
            <div className="space-y-4">
              <nav className="flex-1 space-y-2">
                {navItems1.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleLinkClick(item.href)}
                    className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group ${
                      selectedLink === item.href
                        ? "text-white bg-primary"
                        : "text-gray-900 hover:bg-gray-300 "
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </div>
                ))}
              </nav>
            </div>

            <div className="px-5 pb-8 mt-16">
              <div className="flex items-center space-x-6">
                <a
                  href="#"
                  title=""
                  className="text-xs font-medium text-gray-500 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  title=""
                  className="text-xs font-medium text-gray-500 hover:text-gray-900"
                >
                  Terms of Service
                </a>
              </div>
              <p className="mt-4 text-xs font-medium text-gray-500">
                © 2022 Rareblocks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
