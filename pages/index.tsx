import Image from "next/image";
import { BsTwitterX } from "react-icons/bs";
import React from "react";
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

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  { title: "Home", icon: <GoHomeFill /> },
  { title: "Explore", icon: <LuSearch /> },
  { title: "Notifications", icon: <PiBell /> },
  { title: "Messages", icon: <FaRegEnvelope /> },
  { title: "Grok", icon: <RiSlashCommands2 /> },
  { title: "Lists", icon: <TbClipboardText /> },
  { title: "Communities", icon: <BsPeople /> },
  { title: "Premium", icon: <BsTwitterX /> },
  { title: "Profile", icon: <FaRegUser /> },
  { title: "More", icon: <CgMoreO /> },
];

export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-32">
        <div className="col-span-3 ">
          <div className="text-3xl w-fit hover:bg-gray-900 p-3 rounded-full cursor-pointer transition-all">
            <BsTwitterX />
          </div>
          <div className="text-xl">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  className="flex justify-start items-center gap-4 hover:bg-gray-900 rounded-full cursor-pointer py-2 pl-4 pr-8 w-fit mb-1"
                  key={item.title}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <button className="bg-[#1d9bf0] p-4 rounded-full w-9/12 mt-2 text-base font-bold">
              Post
            </button>
          </div>
        </div>
        <div className="col-span-5 border-r border-l border-gray-700 -ml-12">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3">Twitter promo</div>
      </div>
    </div>
  );
}
