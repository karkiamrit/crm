import { BreadcrumbDemo } from "@/components/Breadcrumb/Breadcrumb";
import React from "react";

const Page = () => {
  return (
    <>
      <section className="py-0">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 flex justify-start">
          <div className="max-full mx-2">
            <h1 className="text-3xl font-bold text-gray-900">Add Lead</h1>
            <BreadcrumbDemo />
            <div className="breadcrum"></div>

            <form action="#" method="POST" className="mt-2">
              <div className="space-y-6">
                <div className="toptitle mt-2">Personal Details</div>
                <div className="flex">
                  <div className="text-sm font-bold w-1/5 items-center mt-3 text-gray-900">
                    Full Name:
                  </div>
                  <input
                    type="text"
                    id="full-name"
                    placeholder="Full Name"
                    className="border w-full py-3 px-4 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                  />
                </div>
                <div className="flex  ">
                  <div className="text-sm font-bold w-1/5 items-center mt-3 text-gray-900">
                    Email Address
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    className="border w-full py-3 px-4 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                  />
                </div>
                <div className="flex">
                  <div className="text-sm font-bold w-1/5 items-center mt-3 text-gray-900">
                    Contact No
                  </div>
                  <input
                    type="tel"
                    id="contact-no"
                    placeholder="Contact Number"
                    className="border w-full py-3 px-4 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                  />
                </div>
                <div className="flex justify-between">
                  <div className="flex w-1/2">
                    <div className="text-sm font-bold w-1/5 items-center mt-3 text-gray-900">
                      Status
                    </div>
                    <select
                      id="status"
                      className="border w-4/5 py-3 px-4 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                    >
                      <option value="">Select Status</option>
                      <option value="status1">Status 1</option>
                      <option value="status2">Status 2</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>
                  <div className="flex w-1/2">
                    <div className="text-sm font-bold w-1/5 items-center mt-3 text-gray-900">
                      Date of Birth
                    </div>
                    <input
                      type="date"
                      id="dob"
                      className="border w-4/5 py-3 px-4 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="text-sm font-bold w-1/5 items-center mt-3 text-gray-900">
                    Joining Date
                  </div>
                  <input
                    type="date"
                    id="joining-date"
                    className="border w-full py-3 px-4 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                  />
                </div>
                <div className="flex">
                  <div className="text-sm font-bold w-1/5 items-center mt-3 text-gray-900">
                    Address
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-bold text-gray-900"
                      >
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        placeholder="Country"
                        className="border w-full py-3 px-4 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-bold text-gray-900"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        placeholder="State"
                        className="border w-full py-3 px-4 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-bold text-gray-900"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        placeholder="City"
                        className="border w-full py-3 px-4 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
