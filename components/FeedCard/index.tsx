import React from "react";
import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { BiBarChart } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { Tweet } from "@/gql/graphql";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;
  return (
    <div className="border border-l-0 border-r-0 border-b-0 border-gray-700 p-5 hover:bg-slate-900 cursor-pointer transition-all ">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          {data.author?.profileImageURL && (
            <Image
              className="rounded-full"
              src={data?.author?.profileImageURL}
              alt="user-image"
              width={50}
              height={50}
            />
          )}
        </div>
        <div className="col-span-11">
          <h5 className="font-bold">
            {data.author?.firstName} {data.author?.lastName}
          </h5>
          <p>{data?.content}</p>
          <div className="flex justify-between text-lg text-gray-500 items-center pt-4">
            <div>
              <BiMessageRounded />
            </div>
            <div>
              <FaRetweet />
            </div>
            <div>
              <FaRegHeart />
            </div>
            <div>
              <BiBarChart />
            </div>
            <div className="flex">
              <div>
                <FaRegBookmark />
              </div>
              <div>
                <FiUpload />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
