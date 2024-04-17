import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { FaArrowLeft } from "react-icons/fa6";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { useRouter } from "next/router";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCallback, useMemo } from "react";
import {
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";

interface ServerProps {
  userInfo?: User;
}

const UserProfilepage: NextPage<ServerProps> = (props) => {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const amIFollowing = useMemo(() => {
    if (!props.userInfo) return false;
    return (
      (currentUser?.following?.findIndex(
        (el) => el?.id === props.userInfo?.id
      ) ?? -1) >= 0 //here ?? denotes that if there is no result, then return -1
    );
  }, [currentUser?.following, props.userInfo]);

  const handleFollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;
    await graphqlClient.request(followUserMutation, { to: props.userInfo?.id });
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, [props.userInfo?.id, queryClient]);

  const handleUnfollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;
    await graphqlClient.request(unfollowUserMutation, {
      to: props.userInfo?.id,
    });
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, [props.userInfo?.id, queryClient]);

  return (
    <div>
      <TwitterLayout>
        <div>
          <nav className="flex items-center gap-4 py-4 px-4">
            <FaArrowLeft className="text-xl hover:cursor-pointer transition-all" />
            <div>
              <h1 className="text-2xl font-semibold">
                {props.userInfo?.firstName} {props.userInfo?.lastName}
              </h1>

              <h2 className="text-sm text-slate-500 ">
                {props.userInfo?.tweets?.length} posts
              </h2>
            </div>
          </nav>
          <div className="p-4 border-b border-slate-800">
            {props.userInfo?.profileImageURL && (
              <Image
                src={props.userInfo?.profileImageURL}
                className="rounded-full"
                alt="user-image"
                width={150}
                height={150}
              />
            )}
            <h1 className="text-2xl font-semibold mt-4">
              {props.userInfo?.firstName} {props.userInfo?.lastName}
            </h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 mt-2 text-sm text-gray-400">
                <span>{props.userInfo?.following?.length} Following</span>
                <span>{props.userInfo?.followers?.length} Followers</span>
              </div>
              {currentUser?.id !== props.userInfo?.id && (
                <>
                  {amIFollowing ? (
                    <button
                      onClick={handleUnfollowUser}
                      className="bg-slate-100 text-black px-4 py-2 rounded-full text-md font-semibold hover:bg-slate-200 transition-all"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollowUser}
                      className="bg-slate-100 text-black px-4 py-2 rounded-full text-md font-semibold hover:bg-slate-200 transition-all"
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            {props.userInfo?.tweets?.map((tweet) => (
              <FeedCard data={tweet as Tweet} key={tweet?.id} />
            ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id as string | undefined;

  if (!id) return { notFound: true, props: { userInfo: undefined } };

  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });

  if (!userInfo?.getUserById) return { notFound: true };

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

export default UserProfilepage;
