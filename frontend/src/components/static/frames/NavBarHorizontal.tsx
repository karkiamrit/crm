"use client";
import useAuth from "@/app/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useVerticalDashboard from "@/store/dashboardStore";
import { LocalStore } from "@/store/localstore";
import useBlurStore from "@/store/useBlurStore";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
interface NavItem {
  href: string;
  icon: JSX.Element;
  name: string;
}

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
    href: "/organizations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0 w-5 h-5 mr-4"
      >
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
      </svg>
    ),
    name: "Organizations",
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

export function NavBarHorizontal() {
  let { loggedIn, userData } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { setMobileMenuOpen } = useBlurStore();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setMobileMenuOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setMobileMenuOpen(false); // Update your global state accordingly
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Add when the menu is open
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Reset isMobileMenuOpen when menu is closed
      setMobileMenuOpen(false);
    }
    return () => {
      // Clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setMobileMenuOpen]);

  const selectedLink = useVerticalDashboard((state) => state.selectedSection); // Access selected section from Zustand store
  const setSelectedLink = useVerticalDashboard(
    (state) => state.setSelectedSection
  ); // Access setSelectedSection action from Zustand store

  const handleLinkClick = (link: string) => {
    setSelectedLink(link);
    LocalStore.setVerticalNavBarState(link);
  };

  return (
    <div >
      <header className="sticky top-0 z-999">
        <div className="py-3 bg-white ">
          <div className=" px-4 mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div
                className="statebutton"
              >
                <div className="block -m-2 md:hidden" ref={buttonRef} >
                  {loggedIn && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-lg hover:text-gray-500 hover:bg-gray-100 focus:outline-none  "
                       onClick={toggleMenu}
                    >
                      <svg
                        className="w-6 h-6 delay-100 duration-300 ease-in-out transform transition-all"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={
                            isOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"
                          }
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 ml-4 lg:ml-0">
                <Link href="/" title="" className="flex items-center">
                  <Image
                    height={32}
                    width={32}
                    className="hidden w-auto h-8 lg:block"
                    src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/logo.svg"
                    alt=""
                  />
                  <Image
                    height={32}
                    width={32}
                    className="block w-auto h-8 lg:hidden"
                    src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/logo-symbol.svg"
                    alt=""
                  />
                </Link>
              </div>

              <div className="flex-1 max-w-xs ml-8 lg:ml-40 mr-auto">
                <label about="" className="sr-only">
                  {" "}
                  Search{" "}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <input
                    type="search"
                    name=""
                    id=""
                    className="block w-full py-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                    placeholder="Search here"
                  />
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  {" "}
                  <div className="flex items-center ml-4 lg:ml-0 ">
                    <div
                      className="rounded-full focus:outline-none  "
                      id="options-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="flex items-center justify-between w-full ">
                        <span className="flex items-center justify-between min-w-0 space-x-3">
                          {loggedIn && userData && (
                            <div className="w-full flex items-center justify-between gap-2">
                              <Avatar>
                                {/* <AvatarImage src=""/> */}
                                <AvatarFallback>
                                  {userData.email.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <span className="flex-1 hidden min-w-0 md:flex">
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {" "}
                                  {userData.email.split("@")[0]}{" "}
                                </span>
                              </span>
                            </div>
                          )}
                        </span>
                        <svg
                          className="flex-shrink-0 w-4 h-4 ml-2 text-gray-400 group-hover:text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="lg:ml-16">
                  <DropdownMenuItem
                    onClick={() => {
                      LocalStore.remove("jwt");
                      LocalStore.reload();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div
            className={`pt-4 pb-6 bg-white border absolute z-50 h-[110vh] w-[50%] border-gray-200 rounded-md shadow-md md:hidden ${
              isOpen ? "block" : "hidden"
            }`}
            style={{ transition: "height 0.3s ease" }}
            ref={mobileMenuRef}
          >
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
              </div>
            </div>
          </div>
        </div>
      {/* <Separator orientation="horizontal" className="border-t border-gray-200" /> */}
      </header>
    </div>
  );
}
