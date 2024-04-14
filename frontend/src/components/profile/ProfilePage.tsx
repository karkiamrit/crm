import Image from "next/image";
import Link from "next/link";
import React from "react";
import profile from "@/../public/avatar.png"

const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 mt-20 relative lg:left-[10%] sm:px-6 lg:px-8 md:w-[1000px] lg:w-[1200px] flex-wrap">
      {/* <div className=" lg:min-h-[38rem]"> */}
      <article className="rounded-xl border border-gray-700 bg-gray-800 p-4">
        <div className="flex items-center gap-4">
          <Image
            height={40}
            width={40}
            alt=""
            src={profile}
            className="size-16 rounded-full object-cover"
          />

          <div>
            <h3 className="text-lg font-medium text-white">Claire Mac</h3>

            <div className="flow-root">
              <ul className="-m-1 flex flex-wrap">
                <li className="p-1 leading-none">
                  <Link href="#" className="text-xs font-medium text-gray-300">
                    {" "}
                    Twitter{" "}
                  </Link>
                </li>

                <li className="p-1 leading-none">
                  <Link href="#" className="text-xs font-medium text-gray-300">
                    {" "}
                    GitHub{" "}
                  </Link>
                </li>

                <li className="p-1 leading-none">
                  <Link href="#" className="text-xs font-medium text-gray-300">
                    Website
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          <li>
            <Link
              href="#"
              className="block h-full rounded-lg border border-gray-700 p-4 hover:border-pink-600"
            >
              <strong className="font-medium text-white">Project A</strong>

              <p className="mt-1 text-xs font-medium text-gray-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
                consequuntur deleniti, unde ab ut in!
              </p>
            </Link>
          </li>

          <li>
            <Link
              href="#"
              className="block h-full rounded-lg border border-gray-700 p-4 hover:border-pink-600"
            >
              <strong className="font-medium text-white">Project B</strong>

              <p className="mt-1 text-xs font-medium text-gray-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente cumque saepe sit.
              </p>
            </Link>
          </li>
        </ul>
      </article>
    </div>
  );
};

export default ProfilePage;
