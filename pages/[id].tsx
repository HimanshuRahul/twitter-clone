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

interface ServerProps {
  userInfo?: User;
}

const UserProfilepage: NextPage<ServerProps> = (props) => {
  const router = useRouter();
  return (
    <div>
      <TwitterLayout>
        <div>
          <nav className="flex items-center gap-4 py-4 px-4">
            <FaArrowLeft className="text-xl hover:cursor-pointer transition-all" />
            <div>
              <h1 className="text-2xl font-semibold">Himanshu bhai</h1>
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
            <h1 className="text-2xl font-semibold mt-4">Himanshu bhai</h1>
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
