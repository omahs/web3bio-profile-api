import { gql } from "@apollo/client";

export const GET_PROFILE_LENS = gql`
  query Profile($handle: Handle) {
    profile(request: { handle: $handle }) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
    }
  }
`;
