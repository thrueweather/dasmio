import gql from "graphql-tag";

import { postFragment } from "../fragments";

import { userFragment } from "../fragments";
export const register = gql`
  mutation register($userInput: UserInput!) {
    register(userInput: $userInput) {
      errors
      success
      token
      user {
        ${userFragment}
      }
    }
  }
`;
export const login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      errors
      success
      token
      user {
        ${userFragment}
      }
    }
  }
`;
export const socialAuth = gql`
  mutation SocialAuth($provider: String!, $accessToken: String!) {
    socialAuth(provider: $provider, accessToken: $accessToken) {
      social {
        uid
      }
      token
      user {
        ${userFragment}
      }
    }
  }
`;
export const verifyUser = gql`
  mutation verifyUser($code: String!) {
    verifyUser(code: $code) {
      errors
      success
    }
  }
`;
export const resendCode = gql`
  mutation resendVerificationCode {
    resendVerificationCode {
      errors
      success
    }
  }
`;
export const sendForgotPassword = gql`
  mutation sendForgotPassword($email: String!) {
    sendForgotPassword(email: $email) {
      errors
      success
    }
  }
`;
export const verifyForgotPassword = gql`
  mutation verifyForgotPassword($email: String!, $code: String!) {
    verifyForgotPassword(email: $email, code: $code) {
      errors
      success
      token
    }
  }
`;
export const changePassword = gql`
  mutation changePassword($password1: String!, $password2: String!) {
    changePassword(password1: $password1, password2: $password2) {
      success
      errors
    }
  }
`;
export const contactUs = gql`
  mutation contactUs($senderEmail: String!, $message: String!) {
    contactUs(senderEmail: $senderEmail, message: $message) {
      success
      errors
    }
  }
`;
export const СREATE_PROFILE = gql`
  mutation createProfile($profileInput: ProfileInput!) {
    createProfile(profileInput: $profileInput) {
      errors
      success
      profile {
        id
        name
        education
        job
        description
        age
        gender
        user {
          id
        }
      }
    }
  }
`;
export const VERIFY_TOKEN = gql`
  mutation verifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;
export const updateImage = gql`
  mutation updateImage($imageId: ID!, $upload: Upload!) {
    updateImage(imageId: $imageId, upload: $upload) {
      errors
      success
    }
  }
`;
export const setAvatar = gql`
  mutation setAvatar($profileId: ID!, $upload: Upload!, $galleryImageId: ID!) {
    setAvatar(
      profileId: $profileId
      upload: $upload
      galleryImageId: $galleryImageId
    ) {
      errors
      success
    }
  }
`;
export const addToGallery = gql`
  mutation addToGallery($upload: Upload!, $sourceImage: Upload!) {
    addToGallery(upload: $upload, sourceImage: $sourceImage) {
      image {
        id
        image
        user {
          id
          email
        }
        deleted
      }
    }
  }
`;
export const DELETE_IMAGE = gql`
  mutation deleteImage($imageId: ID!) {
    deleteImage(imageId: $imageId) {
      success
      errors
    }
  }
`;
export const SET_ACTIVE_PROFILE = gql`
  mutation setActiveProfile($profileId: ID!) {
    setActiveProfile(profileId: $profileId) {
      success
      errors
    }
  }
`;
export const CREATE_POST = gql`
  mutation createPost($postInput: PostInput!) {
    createPost(postInput: $postInput) {
      success
      errors
      post {
        ${postFragment}
      }
    }
  }
`;
export const allowGeoLocation = gql`
  mutation allowGeoLocation(
    $isAllowed: Boolean!
    $latitude: String!
    $longitude: String!
  ) {
    allowGeoLocation(
      isAllowed: $isAllowed
      latitude: $latitude
      longitude: $longitude
    ) {
      errors
      success
    }
  }
`;
export const ADD_FAVORITE_POST = gql`
  mutation addFavoritePost($postId: ID!) {
    addFavoritePost(postId: $postId) {
      success
      errors
    }
  }
`;
export const DISLIKE_POST = gql`
  mutation dislikePost($postId: ID!) {
    dislikePost(postId: $postId) {
      success
      errors
    }
  }
`;
export const REMOVE_FAVORITE_POST = gql`
  mutation removeFavoritePost($postId: ID!) {
    removeFavoritePost(postId: $postId) {
      errors
      success
    }
  }
`;
export const CREATE_ROOM = gql`
  mutation createRoom($roomInput: RoomInput!) {
    createRoom(roomInput: $roomInput) {
      errors
      success
      room {
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
          seen
          sender {
            id
          }
          isDeleted
          time
        }
      }
    }
  }
`;
export const CREATE_MESSAGE = gql`
  mutation createMessage($messageInput: MessageInput!) {
    createMessage(messageInput: $messageInput) {
      success
      errors
      message {
        id
        text
        sender {
          id
          name
        }
        room {
          id
          users {
            id
            name
          }
        }
        seen
        time
        isDeleted
      }
    }
  }
`;
export const SUPER_LIKE_POST = gql`
  mutation superLikePost($postId: ID!, $text: String!) {
    superLikePost(postId: $postId, text: $text) {
      errors
      success
    }
  }
`;

export const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      errors
      success
      redirect
      room {
        id
        waitingForApprove
        users {
          id
          avatar {
            id
            image
          }
          name
        }
        lastMessage {
          id
          text
          seen
        }
        typing
        post {
          ${postFragment}
        }
      }
    }
  }
`;

export const APPROVE_ROOM = gql`
  mutation acceptRoom($accept: Boolean!, $roomId: ID!) {
    acceptRoom(accept: $accept, roomId: $roomId) {
      success
      errors
      room {
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
        waitingForApprove
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
  }
`;
