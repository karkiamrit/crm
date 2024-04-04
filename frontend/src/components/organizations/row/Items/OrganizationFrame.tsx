import React from "react";

interface Props {
  email: string;
  phone: string;
  address: string;
}

const OrganizationFrame = ({ email, phone, address }: Props) => {
  return (
    <div className="overflow-x-auto w-3/6">
      <div className="inline-block min-w-full overflow-hidden align-middle border border-gray-200 shadow sm:rounded-lg">
        <table className="min-w-full ">
          <thead>
            <tr>
              <th className="px-4 py-7 bg-gray-50 text-left text-xs font-bold  uppercase tracking-wider gap-3 ">
                <div>
                  <div className="flex gap-3 items-center">
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
                      className="lucide lucide-building"
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
                    Organization Details
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {/* <tr className="bg-white"> */}
            <tr>
              <th className="px-4 py-3 flex items-center text-left text-xs font-medium text-gray-500  tracking-wider gap-3 ">
                <div className="flex flex-col">
                  <div className="flex flex-row gap-4 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-mail"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <div className="text-xs font-thin">Email</div>
                  </div>
                  <div className="lg:ml-8 font-medium text-black mt-1">
                    {email}
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500  tracking-wider gap-3 flex items-center">
                <div className="flex flex-col">
                  <div className="flex flex-row gap-4 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-phone"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div className="text-xs font-thin">Phone</div>
                  </div>
                  <div className="lg:ml-8 font-medium text-black mt-1">
                    {phone}
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th className="px-4 py-3  text-left text-xs font-medium text-gray-500 tracking-wider gap-3 flex items-center">
                <div className="flex flex-col">
                  <div className="flex flex-row gap-4 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-map-pin"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div className="text-xs font-thin">Address</div>
                  </div>
                  <div className="lg:ml-8 font-medium text-black mt-1">
                    {address}
                  </div>
                </div>

              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationFrame;
