import gql from "graphql-tag";

import { postFragment } from "../fragments";

export const USER = gql`
  query me {
    me {
      categories {
        id
        name
        posts {
          id
        }
      }
      id
      geoLocationAllowed
      email
      isVerified
      lastVerificationCode
      fullName
      gallery {
        id
        image
      }
      profiles {
        id
        name
        education
        description
        job
        age
        avatar {
          id
          image
          source {
            id
            image
          }
        }
        age
        gender
        isActive
        user {
          id
          fullName
          email
        }
      }
      addMatchPost
      addListingPost
    }
  }
`;

export const GALLERY = gql`
  query gallery($page: Int!, $perPage: Int!) {
    gallery(page: $page, perPage: $perPage)
  }
`;

export const LISTING = gql`
  query listing(
    $categoryId: String
    $lookingFor: String
    $minAge: Int
    $maxAge: Int
    $favorite: Boolean
    $perPage: Int!
    $page: Int!
  ) {
    listing(
      categoryId: $categoryId
      lookingFor: $lookingFor
      minAge: $minAge
      maxAge: $maxAge
      favorite: $favorite
      perPage: $perPage
      page: $page
    ) {
      listing {
        ${postFragment}
      }
      numObjects
      sorry
      addPost
    }
  }
`;

export const CATEGORIES = gql`
  query categories {
    categories {
      id
      name
    }
  }
`;

export const MATCHES = gql`
  query matches($postId: ID!, $likedMe: Boolean!, $page: Int!, $perPage: Int!) {
    matches(
      postId: $postId
      likedMe: $likedMe
      page: $page
      perPage: $perPage
    ) {
      listing {
        ${postFragment}
      }
      numObjects
      hasPosts
      sorry
      addPost
    }
  }
`;

export const MATCHES_CATEGORIES = gql`
  query matchesCategories {
    matchesCategories {
      id
      name
      posts {
        id
        photos {
          id
          image
        }
        text
      }
      hasPosts
    }
  }
`;

export const ROOM = gql`
  query room(
    $id: Int
    $firstUser: ID
    $secondUser: ID
    $first: Int
    $skip: Int
  ) {
    room(
      id: $id
      firstUser: $firstUser
      secondUser: $secondUser
      first: $first
      skip: $skip
    ) {
      id
      waitingForApprove
      users {
        id
        name
        avatar {
          id
          image
        }
      }
      lastMessage {
        id
        text
        sender {
          id
          name
          avatar {
            id
            image
          }
        }
        seen
        time
      }
      typing
      post {
        ${postFragment}
      }
      receiverPost {
        ${postFragment}
      }
      messages(first: $first, skip: $skip, room: $id) {
        id
        text
        sender {
          id
          name
          avatar {
            id
            image
          }
        }
        seen
        time
      }
    }
  }
`;

export const ROOMS = gql`
  query rooms($userId: Int) {
    rooms(userId: $userId) {
      id
      waitingForApprove
      users {
        id
        name
        avatar {
          id
          image
        }
      }
      lastMessage {
        id
        text
        sender {
          id
          name
          avatar {
            id
            image
          }
        }
        seen
        time
      }
      typing
      post {
        ${postFragment}
      }
      receiverPost {
        ${postFragment}
      }
    }
  }
`;

export const LISTING_ROOMS = gql`
  query listingRooms {
    listingRooms {
      id
      users {
        id

        name
        avatar {
          id
          image
        }
      }
      lastMessage {
        id
        text
        sender {
          id
          name
          avatar {
            id
            image
          }
        }
        seen
        time
      }
      typing
      post {
        ${postFragment}
      }
      receiverPost {
        ${postFragment}
      }
      messages {
        id
        text
        sender {
          id
          name
          avatar {
            id
            image
          }
        }
        seen
        time
      }
    }
  }
`;

export const MATCHES_ROOMS = gql`
  query matchesRooms {
    matchesRooms {
      id
      waitingForApprove
      users {
        id

        name
        avatar {
          id
          image
        }
      }
      lastMessage {
        id
        text
        sender {
          id
          name
          avatar {
            id
            image
          }
        }
        seen
        time
      }
      typing
      post {
        ${postFragment}
      }
      receiverPost {
        ${postFragment}
      }
      messages {
        id
        text
        sender {
          id
          name
          avatar {
            id
            image
          }
        }
        seen
        time
      }
    }
  }
`;

export const NOTIFICATIONS = gql`
  query notifications {
    notifications {
      id
      profile {
        id
        name
      }
      actionType
      notificationText
    }
  }
`;

export const SETTINGS_LISTING = gql`
  query settingsListing(
    $categoryId: ID!
    $status: String!
    $perPage: Int!
    $page: Int!
  ) {
    settingsListing(
      categoryId: $categoryId
      status: $status
      perPage: $perPage
      page: $page
    ) {
      listing {
        ${postFragment}
      }
      numObjects
      sorry
      addPost
    }
  }
`;
