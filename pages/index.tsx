import Image from "next/image";
import React, { useCallback, useState } from "react";
import { FaRegImage } from "react-icons/fa6";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";

export default function Home() {
  const { user } = useCurrentUser();

  const { tweets = [] } = useGetAllTweets();

  const { mutate } = useCreateTweet();

  const [content, setContent] = useState("");

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    });
  }, [content, mutate]);

  return (
    <div>
      <TwitterLayout>
        <div>
          <div className="border border-l-0 border-r-0 border-b-0 border-gray-700 p-5 hover:bg-slate-900 cursor-pointer transition-all ">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full m-2"
                    src={user?.profileImageURL}
                    alt="user-image"
                    width={50}
                    height={50}
                  />
                )}
              </div>
              <div className="col-span-11">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-xl p-2 border-b border-slate-700 "
                  placeholder="What is happening?!"
                  rows={2}
                ></textarea>
                <div className="mt-4 flex justify-between items-center m-4">
                  <FaRegImage
                    onClick={handleSelectImage}
                    className="text-lg hover:cursor-pointer"
                  />
                  <button
                    onClick={handleCreateTweet}
                    className="bg-[#1d9bf0] py-2 px-2 rounded-full text-sm w-1/6 font-semibold hover:bg-[#1d9cf0e0]"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </TwitterLayout>
    </div>
  );
}
