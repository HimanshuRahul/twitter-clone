import { graphql } from "@/gql";

export const followUserMutation = graphql(`
  #graphql
  mutation followUser($to: ID!) {
    followUser(to: $to)
  }
`);

export const unfollowUserMutation = graphql(`
  #graphql
  mutation unFollowUser($to: ID!) {
    unFollowUser(to: $to)
  }
`);