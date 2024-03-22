"use client";
import useAuth from "@/app/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function NavBarHorizontal() {
  let { loggedIn, userData } = useAuth();
  return (
    <div>
      <header className="">
        <div className="py-3 bg-white">
          <div className=" px-4 mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="block -m-2 lg:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-lg hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-shrink-0 ml-4 lg:ml-0">
                <a href="#" title="" className="flex items-center">
                  <img
                    className="hidden w-auto h-8 lg:block"
                    src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/logo.svg"
                    alt=""
                  />
                  <img
                    className="block w-auto h-8 lg:hidden"
                    src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/logo-symbol.svg"
                    alt=""
                  />
                </a>
              </div>

              <div className="flex-1 max-w-xs ml-8 lg:ml-32 mr-auto">
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

              <div className="flex items-center ml-4 lg:ml-0">
                <button
                  type="button"
                  className="rounded-full focus:outline-none "
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
                            <AvatarFallback>{userData.email.substring(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>

                          <span className="flex-1 hidden min-w-0 md:flex">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {" "}
                              {userData.email.split('@')[0]}{" "}
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
