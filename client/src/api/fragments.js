export const userFragment = `
    id
    fullName
    email
    lastVerificationCode
    isVerified
    profiles {
        id
        user {
          id
          email
        }
      }
`;

export const postFragment = `
id
expiresAt
hasRoom
profile {
  id
  name
  age
  avatar {
    id
    image
    source {
      id
      image
    }
  }
}
photos {
  id
  image
  source {
    id
    image
  }
}
lookingFor
postDurationHours
text
category {
  id
  name
}
distance
minAge
maxAge
`;
