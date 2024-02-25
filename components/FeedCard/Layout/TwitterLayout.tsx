import React, { useMemo } from "react";
import Image from "next/image";
import { BsTwitterX } from "react-icons/bs";
import { useCallback, useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { PiBell } from "react-icons/pi";
import { LuSearch } from "react-icons/lu";
import { FaRegEnvelope } from "react-icons/fa6";
import { RiSlashCommands2 } from "react-icons/ri";
import { TbClipboardText } from "react-icons/tb";
import { BsPeople } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { CgMoreO } from "react-icons/cg";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface TwitterlayoutProps {
  children: React.ReactNode;
}

const TwitterLayout: React.FC<TwitterlayoutProps> = (props) => {
  const { user } = useCurrentUser();

  const queryClient = useQueryClient();

  const sidebarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      { title: "Home", icon: <GoHomeFill />, link: "/" },
      { title: "Explore", icon: <LuSearch />, link: "/" },
      { title: "Notifications", icon: <PiBell />, link: "/" },
      { title: "Messages", icon: <FaRegEnvelope />, link: "/" },
      { title: "Grok", icon: <RiSlashCommands2 />, link: "/" },
      { title: "Lists", icon: <TbClipboardText />, link: "/" },
      { title: "Communities", icon: <BsPeople />, link: "/" },
      { title: "Premium", icon: <BsTwitterX />, link: "/" },
      { title: "Profile", icon: <FaRegUser />, link: `${user?.id}` },
      { title: "More", icon: <CgMoreO />, link: "/" },
    ],
    [user?.id]
  );

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found`);

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("Verified successfully");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken) {
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);

        //previously below code used to work like -> await queryClient.invalidateQueries(["current-user"]);

        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      }
    },
    [queryClient]
  );
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen sm:px-32">
        <div className="col-span-2 sm:col-span-3 flex sm:justify-end pr-20 relative">
          <div>
            <div className="text-3xl w-fit hover:bg-gray-900 p-3 rounded-full cursor-pointer transition-all">
              <BsTwitterX />
            </div>
            <div className="text-xl">
              <ul>
                {sidebarMenuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      className="flex justify-start items-center gap-4 hover:bg-gray-900 rounded-full cursor-pointer py-2 pl-4 pr-8 w-fit mb-1"
                      href={item.link}
                    >
                      <span className="text-3xl">{item.icon}</span>
                      <span className="hidden sm:inline ">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button className="hidden sm:block bg-[#1d9bf0] p-4 rounded-full w-11/12 mt-2 text-[16px] font-bold hover:bg-[#1d9cf0e0]">
                Post
              </button>
              <button className="block sm:hidden bg-[#1d9bf0] p-4 rounded-full  mt-2 text-[16px] font-bold hover:bg-[#1d9cf0e0]">
                <BsTwitterX />
              </button>
            </div>
          </div>
          {user && (
            <div className="absolute bottom-1 flex gap-2 items-center p-2 rounded-full hover:bg-gray-900 cursor-pointer transition-all">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-image"
                  height={50}
                  width={50}
                />
              )}
              <div className="hidden sm:flex">
                <h3 className="text-xl">{user.firstName + " "} </h3>
                <h3 className="text-xl">{user.lastName}</h3>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-10 sm:col-span-5 border-r border-l border-gray-700 ">
          {props.children}
        </div>
        <div className="col-span-0 sm:col-span-3 p-4">
          {!user && (
            <div className="p-4 border rounded-lg ">
              <h1 className="my-2 text-3xl font-bold">Join today.</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
